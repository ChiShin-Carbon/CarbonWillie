import React, { useState, useEffect, useCallback } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CForm,
    CModalTitle, CAlert
} from '@coreui/react';
import styles from '../../../../../scss/活動數據盤點.module.css';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

import { useRefreshData } from '../refreshdata';

const EditModal = ({ 
    isEditModalVisible, 
    setEditModalVisible, 
    selectedWaste,
    refreshSellingWasteData,
    setCurrentFunction,
    setCurrentTitle
}) => {
    // Create a local refresh instance as backup
    const localRefreshData = useRefreshData();
    const [previewImage, setPreviewImage] = useState(null); // State for image preview
    const [existingImage, setExistingImage] = useState(null); // State to track if there's an existing image
    const [useExistingImage, setUseExistingImage] = useState(true); // Track if using existing image
    const [formValues, setFormValues] = useState({
        waste_item: '',
        remark: '',
        image: null,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    
    // Alert states
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertColor, setAlertColor] = useState('danger');

    // Reset states when modal closes or opens
    const resetStates = useCallback(() => {
        setPreviewImage(null);
        setExistingImage(null);
        setUseExistingImage(true);
        setShowAlert(false);
        setFormErrors({});
        setFormValues({
            waste_item: '',
            remark: '',
            image: null,
        });
    }, []);

    // Handle closing the modal
    const handleClose = () => {
        setEditModalVisible(false);
        resetStates();
    };

    // Safe refresh function that tries multiple approaches
    const safeRefresh = async () => {
        console.log("Attempting to refresh selling waste data...");
        try {
            // First try the prop passed from parent
            if (typeof refreshSellingWasteData === 'function') {
                console.log("Using refreshSellingWasteData from props");
                await refreshSellingWasteData();
                return true;
            }
            // Then try our local refresh
            else if (localRefreshData && typeof localRefreshData.refreshSellingWasteData === 'function') {
                console.log("Using localRefreshSellingWasteData");
                await localRefreshData.refreshSellingWasteData();
                return true;
            }
            console.warn("No valid refresh function found");
            return false;
        } catch (error) {
            console.error("Error refreshing data:", error);
            return false;
        }
    };

    // Show alert with auto-hide
    const showFormAlert = (message, color) => {
        setAlertMessage(message);
        setAlertColor(color);
        setShowAlert(true);

        // Auto hide after 5 seconds
        setTimeout(() => {
            setShowAlert(false);
        }, 5000);
    };

    // Handle image change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!validImageTypes.includes(file.type)) {
                showFormAlert('請上傳有效的圖片檔案 (JPEG, PNG, GIF, WEBP)', 'danger');
                return;
            }

            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                showFormAlert('圖片大小不能超過 5MB', 'danger');
                return;
            }

            // Clear previous preview
            if (previewImage && !existingImage) {
                URL.revokeObjectURL(previewImage);
            }

            const previewUrl = URL.createObjectURL(file);
            setPreviewImage(previewUrl);
            setFormValues((prev) => ({ ...prev, image: file }));
            setUseExistingImage(false); // When selecting a new image, don't use existing image
        } else {
            // If user cancels selection, revert to existing image (if available)
            if (existingImage && useExistingImage) {
                setPreviewImage(`fastapi/${existingImage}`);
            }
        }
    };

    // Fetch selling waste data when selectedWaste changes
    useEffect(() => {
        const fetchSellingData = async () => {
            if (!selectedWaste) return;

            resetStates(); // Reset all states before fetching new data

            try {
                const response = await fetch('http://localhost:8000/Selling_waste_findone', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ SW_id: selectedWaste }),
                });
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.Selling_Waste && data.Selling_Waste.length > 0) {
                        // Populate form with fetched data
                        const waste = data.Selling_Waste[0];
                        
                        // Log raw data for debugging
                        console.log("Raw selling waste data:", waste);
                        
                        setFormValues({
                            waste_item: waste?.waste_item || '',
                            remark: waste?.remark || '',
                            image: null, // Don't set file object here, just track path
                        });

                        if (waste?.img_path) {
                            // Store existing image path
                            setExistingImage(waste.img_path);
                            // Set preview with full URL path
                            setPreviewImage(`fastapi/${waste.img_path}`);
                            setUseExistingImage(true);
                        }
                    } else {
                        console.error('No selling waste data found');
                        showFormAlert('找不到廢棄物資料', 'danger');
                    }
                } else {
                    console.error('Error fetching selling waste data:', await response.text());
                    showFormAlert('擷取資料時發生錯誤，請重試', 'danger');
                }
            } catch (error) {
                console.error('Error fetching selling waste data:', error);
                showFormAlert('擷取資料時發生錯誤，請重試', 'danger');
            }
        };

        if (isEditModalVisible && selectedWaste) {
            fetchSellingData();
        }
    }, [selectedWaste, isEditModalVisible, resetStates]);

    // Validate the form
    const validateForm = () => {
        const errors = {};

        if (!formValues.waste_item.trim()) errors.waste_item = '請輸入廢棄物項目';
        if (!formValues.image && !existingImage) errors.image = '請上傳圖片';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form input changes
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormValues((prev) => ({ ...prev, [id]: value }));

        // Clear validation error for this field
        if (formErrors[id]) {
            setFormErrors(prev => ({
                ...prev,
                [id]: undefined
            }));
        }
    };

    // Handle form submission
    const handleEditSubmit = async (e) => {
        e.preventDefault();

        // Prevent double submissions
        if (isSubmitting) return;

        // Validate form
        if (!validateForm()) {
            showFormAlert('請填寫所有必填欄位', 'danger');
            return;
        }

        setIsSubmitting(true);

        try {
            showFormAlert('正在提交資料...', 'info');

            const form = new FormData();
            form.append("waste_id", selectedWaste);
            form.append("user_id", window.sessionStorage.getItem('user_id') || "1");
            form.append("waste_item", formValues.waste_item);
            form.append("remark", formValues.remark || "");

            // Only append image if a new one was selected
            if (formValues.image) {
                const imageFile = formValues.image;
                // Rename with timestamp to avoid duplicate names
                const newFile = new File(
                    [imageFile],
                    `${Date.now()}_${imageFile.name}`,
                    { type: imageFile.type }
                );
                form.append("image", newFile);
            } else if (existingImage && useExistingImage) {
                // Let backend know we're keeping existing image
                form.append("existing_image", existingImage);
            }

            const response = await fetch('http://localhost:8000/edit_SellingWaste', {
                method: 'POST',
                body: form, // Send FormData directly
            });

            const data = await response.json();
            if (response.ok && data.status === "success") {
                // Close modal first
                setEditModalVisible(false);

                // Wait a moment before refreshing data
                setTimeout(async () => {
                    const refreshSuccessful = await safeRefresh();

                    // Update current function and title if available
                    if (typeof setCurrentFunction === 'function') {
                        setCurrentFunction("SellingWaste");
                    }

                    if (typeof setCurrentTitle === 'function') {
                        setCurrentTitle("銷售產品的廢棄物");
                    }

                    if (refreshSuccessful) {
                        alert("資料提交成功！");
                    } else {
                        alert("資料已提交，但無法自動刷新頁面。請手動刷新。");
                    }
                }, 500);
            } else {
                showFormAlert(data.message || "更新廢棄物記錄失敗。", "danger");
            }
        } catch (error) {
            console.error("更新廢棄物記錄時發生錯誤:", error);
            showFormAlert(`提交時發生錯誤: ${error.message}`, "danger");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Clean up resources when component unmounts or modal closes
    useEffect(() => {
        return () => {
            if (previewImage && !existingImage) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage, existingImage]);

    return (
        <CModal
            backdrop="static"
            visible={isEditModalVisible}
            onClose={handleClose}
            aria-labelledby="SellingWasteModalLabel"
            size="xl"
            className={styles.modal}
        >
            <CModalHeader>
                <CModalTitle id="SellingWasteModalLabel">
                    <b>編輯數據-銷售產品的廢棄物</b>
                </CModalTitle>
            </CModalHeader>
            <CForm onSubmit={handleEditSubmit}>
                <CModalBody>
                    {showAlert && (
                        <CAlert color={alertColor} dismissible>
                            {alertMessage}
                        </CAlert>
                    )}
                    <div className={styles.addmodal}>
                        <div className={styles.modalLeft}>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="waste_item" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    廢棄物項目*
                                </CFormLabel>
                                <CCol>
                                    <CFormInput
                                        id="waste_item"
                                        className={styles.addinput}
                                        type="text"
                                        value={formValues.waste_item}
                                        onChange={handleChange}
                                        invalid={!!formErrors.waste_item}
                                    />
                                    {formErrors.waste_item && (
                                        <div className="invalid-feedback">{formErrors.waste_item}</div>
                                    )}
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="remark" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    備註
                                </CFormLabel>
                                <CCol>
                                    <CFormTextarea
                                        className={styles.addinput}
                                        id="remark"
                                        rows={3}
                                        value={formValues.remark}
                                        onChange={handleChange}
                                        placeholder="選填，可記錄其他相關資訊"
                                    />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="image" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    圖片*
                                </CFormLabel>
                                <CCol>
                                    <CFormInput
                                        type="file"
                                        id="image"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        invalid={!!formErrors.image}
                                    />
                                    {formErrors.image && (
                                        <div className="invalid-feedback">{formErrors.image}</div>
                                    )}
                                    {existingImage && (
                                        <div className="form-text">
                                            已有上傳圖片。如需更改，請選擇新圖片。
                                        </div>
                                    )}
                                    <div className="form-text">
                                        支援的格式: JPG, PNG, GIF, WEBP (最大 5MB)
                                    </div>
                                </CCol>
                            </CRow>
                            <div className="text-center mt-3">
                                <small>*為必填欄位</small>
                            </div>
                        </div>
                        <div className={styles.modalRight}>
                            <CFormLabel className={styles.addlabel}>
                                圖片預覽
                            </CFormLabel>
                            <div className={styles.imgBlock}>
                                {previewImage ? (
                                    <Zoom>
                                        <img
                                            src={previewImage}
                                            alt="預覽圖片"
                                            style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                                        />
                                    </Zoom>
                                ) : (
                                    <div className="text-center p-4 text-muted border">
                                        尚未上傳圖片
                                    </div>
                                )}
                            </div>

                            <CFormLabel className={styles.addlabel}>
                                填表說明
                            </CFormLabel>
                            <div className={styles.infoBlock || 'p-3 border'}>
                                <ul className="mb-0">
                                    <li>所有帶有 * 的欄位為必填項目</li>
                                    <li>廢棄物項目應清楚描述產品銷售產生的廢棄物類型</li>
                                    <li>備註欄位可填寫廢棄物來源、數量或處理方式等資訊</li>
                                    <li>請上傳清晰的廢棄物照片</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton
                        className="modalbutton1"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        type="button"
                    >
                        取消
                    </CButton>
                    <CButton
                        type="submit"
                        className="modalbutton2"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? '提交中...' : '儲存'}
                    </CButton>
                </CModalFooter>
            </CForm>
        </CModal>
    );
};

export default EditModal;