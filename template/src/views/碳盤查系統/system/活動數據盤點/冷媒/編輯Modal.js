import React, { useState, useEffect, useCallback } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CFormSelect, CForm,
    CModalTitle, CAlert, CCollapse, CCard, CCardBody
} from '@coreui/react';
import styles from '../../../../../scss/活動數據盤點.module.css';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

import { useRefreshData } from '../refreshdata';

const EditModal = ({ 
    isEditModalVisible, 
    setEditModalVisible, 
    selectedRef,
    refreshRefrigerantData,
    setCurrentFunction,
    setCurrentTitle
}) => {
    // Create a local refresh instance as backup
    const localRefreshData = useRefreshData();
    const [previewImage, setPreviewImage] = useState(null); // State for image preview
    const [existingImage, setExistingImage] = useState(null); // State to track if there's an existing image
    const [useExistingImage, setUseExistingImage] = useState(true); // Track if using existing image
    const [visible, setVisible] = useState(false); // For collapse toggle
    const [formValues, setFormValues] = useState({
        device_type: '',
        device_location: '',
        refrigerant_type: '',
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
            device_type: '',
            device_location: '',
            refrigerant_type: '',
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
        console.log("Attempting to refresh refrigerant data...");
        try {
            // First try the prop passed from parent
            if (typeof refreshRefrigerantData === 'function') {
                console.log("Using refreshRefrigerantData from props");
                await refreshRefrigerantData();
                return true;
            }
            // Then try our local refresh
            else if (localRefreshData && typeof localRefreshData.refreshRefrigerantData === 'function') {
                console.log("Using localRefreshRefrigerantData");
                await localRefreshData.refreshRefrigerantData();
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

    // Fetch refrigerant data when selectedRef changes
    useEffect(() => {
        const fetchRefrigerantData = async () => {
            if (!selectedRef) return;

            resetStates(); // Reset all states before fetching new data

            try {
                const response = await fetch('http://localhost:8000/Ref_findone', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ Ref_id: selectedRef }),
                });
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.Ref && data.Ref.length > 0) {
                        // Populate form with fetched data
                        const refrigerant = data.Ref[0];
                        setFormValues({
                            device_type: refrigerant?.device_type || '',
                            device_location: refrigerant?.device_location || '',
                            refrigerant_type: refrigerant?.refrigerant_type || '',
                            remark: refrigerant?.remark || '',
                            image: null, // Don't set file object here, just track path
                        });

                        if (refrigerant?.img_path) {
                            // Store existing image path
                            setExistingImage(refrigerant.img_path);
                            // Set preview with full URL path
                            setPreviewImage(`fastapi/${refrigerant.img_path}`);
                            setUseExistingImage(true);
                        }
                    } else {
                        console.error('No refrigerant data found');
                        showFormAlert('找不到冷媒資料', 'danger');
                    }
                } else {
                    console.error('Error fetching refrigerant data:', await response.text());
                    showFormAlert('擷取資料時發生錯誤，請重試', 'danger');
                }
            } catch (error) {
                console.error('Error fetching refrigerant data:', error);
                showFormAlert('擷取資料時發生錯誤，請重試', 'danger');
            }
        };

        if (isEditModalVisible && selectedRef) {
            fetchRefrigerantData();
        }
    }, [selectedRef, isEditModalVisible, resetStates]);

    // Validate the form
    const validateForm = () => {
        const errors = {};

        if (!formValues.device_type) errors.device_type = '請選擇設備類型';
        if (!formValues.device_location) errors.device_location = '請輸入設備位置';
        if (!formValues.refrigerant_type) errors.refrigerant_type = '請選擇冷媒類型';
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
            form.append("refrigerant_id", selectedRef);
            form.append("user_id", window.sessionStorage.getItem('user_id'));
            form.append("device_type", formValues.device_type);
            form.append("device_location", formValues.device_location);
            form.append("refrigerant_type", formValues.refrigerant_type);
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

            const response = await fetch('http://localhost:8000/edit_Ref', {
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
                        setCurrentFunction("Refrigerant");
                    }

                    if (typeof setCurrentTitle === 'function') {
                        setCurrentTitle("冷媒");
                    }

                    if (refreshSuccessful) {
                        alert("資料提交成功！");
                    } else {
                        alert("資料已提交，但無法自動刷新頁面。請手動刷新。");
                    }
                }, 500);
            } else {
                showFormAlert(data.message || "更新冷媒記錄失敗。", "danger");
            }
        } catch (error) {
            console.error("更新冷媒記錄時發生錯誤:", error);
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
            aria-labelledby="RefrigerantModalLabel"
            size="xl"
            className={styles.modal}
        >
            <CModalHeader>
                <CModalTitle id="RefrigerantModalLabel">
                    <b>編輯數據-冷媒</b>
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
                                <CFormLabel htmlFor="device_type" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    設備類型*
                                </CFormLabel>
                                <CCol>
                                    <CFormSelect
                                        className={styles.addinput}
                                        id="device_type"
                                        value={formValues.device_type}
                                        onChange={handleChange}
                                        invalid={!!formErrors.device_type}
                                    >
                                        <option value="">請選擇設備類型</option>
                                        <option value="1">冰箱</option>
                                        <option value="2">冷氣機</option>
                                        <option value="3">飲水機</option>
                                        <option value="4">冰水主機</option>
                                        <option value="5">空壓機</option>
                                        <option value="6">除濕機</option>
                                        <option value="7">車用冷媒</option>
                                        <option value="8">製冰機</option>
                                        <option value="9">冰櫃</option>
                                        <option value="10">冷凍櫃</option>
                                        <option value="11">其他</option>
                                    </CFormSelect>
                                    {formErrors.device_type && (
                                        <div className="invalid-feedback">{formErrors.device_type}</div>
                                    )}
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="device_location" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    設備位置*
                                </CFormLabel>
                                <CCol>
                                    <CFormInput
                                        className={styles.addinput}
                                        type="text"
                                        id="device_location"
                                        value={formValues.device_location}
                                        onChange={handleChange}
                                        invalid={!!formErrors.device_location}
                                    />
                                    {formErrors.device_location && (
                                        <div className="invalid-feedback">{formErrors.device_location}</div>
                                    )}
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="refrigerant_type" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    冷媒類型*
                                </CFormLabel>
                                <CCol>
                                    <CFormSelect
                                        className={styles.addinput}
                                        id="refrigerant_type"
                                        value={formValues.refrigerant_type}
                                        onChange={handleChange}
                                        invalid={!!formErrors.refrigerant_type}
                                    >
                                        <option value="">請選擇冷媒類型</option>
                                        <option value="1">R11</option>
                                        <option value="2">R12</option>
                                        <option value="3">R22</option>
                                        <option value="4">R-32</option>
                                        <option value="5">R-123</option>
                                        <option value="6">R-23</option>
                                        <option value="7">R-134a</option>
                                        <option value="8">R-404A</option>
                                        <option value="9">R-407a</option>
                                        <option value="10">R-410A</option>
                                        <option value="11">R-600a</option>
                                        <option value="12">R-417a</option>
                                        <option value="13">F22</option>
                                        <option value="14">HCR-600A</option>
                                        <option value="15">HFC-134a</option>
                                        <option value="16">R401A</option>
                                        <option value="17">其他</option>
                                    </CFormSelect>
                                    {formErrors.refrigerant_type && (
                                        <div className="invalid-feedback">{formErrors.refrigerant_type}</div>
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

                            <CRow className="mb-3">
                                <CFormLabel className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    <span className={styles.Note2} onClick={() => setVisible(!visible)}>逸散率(%)建議表格</span>
                                </CFormLabel>
                                <CCol>
                                    <CCollapse visible={visible}>
                                        <CCard className="mt-3">
                                            <CCardBody>
                                                <img src='/src/assets/images/逸散率建議表格.png' alt="逸散率建議表格" />
                                            </CCardBody>
                                        </CCard>
                                    </CCollapse>
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
                                    <li>設備類型與冷媒類型請選擇最符合的選項</li>
                                    <li>備註欄位可填寫額外資訊或特殊說明</li>
                                    <li>點擊「逸散率(%)建議表格」可查看相關參考資料</li>
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