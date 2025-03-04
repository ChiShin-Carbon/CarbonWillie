import React, { useState, useEffect, useCallback } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CFormSelect, CForm,
    CModalTitle, CAlert
} from '@coreui/react';
import styles from '../../../../../scss/活動數據盤點.module.css';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

import { useRefreshData } from '../refreshdata';

const EditModal = ({ 
    isEditModalVisible, 
    setEditModalVisible, 
    selectedExtinguisher, 
    refreshFireExtinguisherData,
    setCurrentFunction,
    setCurrentTitle
}) => {
    // Create a local refresh instance as backup
    const localRefreshData = useRefreshData();
    const [previewImage, setPreviewImage] = useState(null); // State for image preview
    const [existingImage, setExistingImage] = useState(null); // State to track if there's an existing image
    const [useExistingImage, setUseExistingImage] = useState(true); // Track if using existing image
    const [formValues, setFormValues] = useState({
        item_name: '',
        ingredient: '',
        specification: '',
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
            item_name: '',
            ingredient: '',
            specification: '',
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
        console.log("Attempting to refresh extinguisher data...");
        try {
            // First try the prop passed from parent
            if (typeof refreshFireExtinguisherData === 'function') {
                console.log("Using refreshFireExtinguisherData from props");
                await refreshFireExtinguisherData();
                return true;
            }
            // Then try our local refresh
            else if (localRefreshData && typeof localRefreshData.refreshFireExtinguisherData === 'function') {
                console.log("Using localRefreshFireExtinguisherData");
                await localRefreshData.refreshFireExtinguisherData();
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
            setUseExistingImage(false); // 選擇新圖片時，不使用現有圖片
        } else {
            // 如果用戶取消選擇，恢復使用現有圖片（如果有的話）
            if (existingImage && useExistingImage) {
                setPreviewImage(`fastapi/${existingImage}`);
            }
        }
    };

    // Fetch extinguisher data when selectedExtinguisher changes
    useEffect(() => {
        const fetchExtinguisherData = async () => {
            if (!selectedExtinguisher) return;

            resetStates(); // Reset all states before fetching new data

            try {
                const response = await fetch('http://localhost:8000/Extinguisher_findone', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ Extinguisher_id: selectedExtinguisher }),
                });
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.Extinguisher && data.Extinguisher.length > 0) {
                        // Populate form with fetched data
                        const extinguisher = data.Extinguisher[0];
                        setFormValues({
                            item_name: extinguisher?.item_name || '',
                            ingredient: extinguisher?.ingredient || '',
                            specification: extinguisher?.specification || '',
                            remark: extinguisher?.remark || '',
                            image: null, // Don't set file object here, just track path
                        });

                        if (extinguisher?.img_path) {
                            // Store existing image path
                            setExistingImage(extinguisher.img_path);
                            // Set preview with full URL path
                            setPreviewImage(`fastapi/${extinguisher.img_path}`);
                            setUseExistingImage(true);
                        }
                    } else {
                        console.error('No extinguisher data found');
                        showFormAlert('找不到滅火器資料', 'danger');
                    }
                } else {
                    console.error('Error fetching extinguisher data:', await response.text());
                    showFormAlert('擷取資料時發生錯誤，請重試', 'danger');
                }
            } catch (error) {
                console.error('Error fetching extinguisher data:', error);
                showFormAlert('擷取資料時發生錯誤，請重試', 'danger');
            }
        };

        if (isEditModalVisible && selectedExtinguisher) {
            fetchExtinguisherData();
        }
    }, [selectedExtinguisher, isEditModalVisible, resetStates]);

    // Validate the form
    const validateForm = () => {
        const errors = {};

        if (!formValues.item_name) errors.item_name = '請輸入品名';
        if (!formValues.ingredient) errors.ingredient = '請選擇成分';
        if (!formValues.specification) errors.specification = '請輸入規格';
        if (!formValues.image && !existingImage) errors.image = '請上傳圖片';

        // Validate numeric fields to ensure they're non-negative
        if (formValues.specification && parseFloat(formValues.specification) < 0) {
            errors.specification = '數值不能為負數';
        }

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
            form.append("extinguisher_id", selectedExtinguisher);
            form.append("user_id", window.sessionStorage.getItem('user_id'));
            form.append("item_name", formValues.item_name);
            form.append("ingredient", formValues.ingredient);
            form.append("specification", formValues.specification);
            form.append("remark", formValues.remark);

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

            const response = await fetch('http://localhost:8000/edit_extinguisher', {
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
                        setCurrentFunction("FireExtinguisher");
                    }

                    if (typeof setCurrentTitle === 'function') {
                        setCurrentTitle("滅火器");
                    }

                    if (refreshSuccessful) {
                        alert("資料提交成功！");
                    } else {
                        alert("資料已提交，但無法自動刷新頁面。請手動刷新。");
                    }
                }, 500);
            } else {
                showFormAlert(data.message || "更新滅火器記錄失敗。", "danger");
            }
        } catch (error) {
            console.error("更新滅火器記錄時發生錯誤:", error);
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
            aria-labelledby="ExtinguisherModalLabel"
            size="xl"
            className={styles.modal}
        >
            <CModalHeader>
                <CModalTitle id="ExtinguisherModalLabel">
                    <b>編輯數據-滅火器</b>
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
                                <CFormLabel htmlFor="item_name" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    品名*
                                </CFormLabel>
                                <CCol>
                                    <CFormInput
                                        className={styles.addinput}
                                        type="text"
                                        id="item_name"
                                        value={formValues.item_name}
                                        onChange={handleChange}
                                        invalid={!!formErrors.item_name}
                                    />
                                    {formErrors.item_name && (
                                        <div className="invalid-feedback">{formErrors.item_name}</div>
                                    )}
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="ingredient" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    成分*
                                </CFormLabel>
                                <CCol>
                                    <CFormSelect
                                        id="ingredient"
                                        className={styles.addinput}
                                        value={formValues.ingredient}
                                        onChange={handleChange}
                                        invalid={!!formErrors.ingredient}
                                    >
                                        <option value="1">CO2</option>
                                        <option value="2">HFC-236ea</option>
                                        <option value="3">HFC-236fa</option>
                                        <option value="4">HFC-227ea</option>
                                        <option value="5">CF3CHFCF3</option>
                                        <option value="6">CHF3</option>
                                        <option value="7">其他</option>
                                    </CFormSelect>
                                    {formErrors.ingredient && (
                                        <div className="invalid-feedback">{formErrors.ingredient}</div>
                                    )}
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="specification" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    規格(重量)*
                                </CFormLabel>
                                <CCol>
                                    <CFormInput
                                        className={styles.addinput}
                                        type="number"
                                        id="specification"
                                        min="0"
                                        step="0.01"
                                        value={formValues.specification}
                                        onChange={handleChange}
                                        invalid={!!formErrors.specification}
                                        placeholder="請輸入數值"
                                    />
                                    {formErrors.specification && (
                                        <div className="invalid-feedback">{formErrors.specification}</div>
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
                                    <li>成分請選擇最符合的選項</li>
                                    <li>規格(重量)應為正數</li>
                                    <li>備註欄位可填寫額外資訊或特殊說明</li>
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