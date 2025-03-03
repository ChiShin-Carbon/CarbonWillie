import React, { useState, useEffect, useCallback } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CButton, CFormLabel, 
    CFormInput, CFormTextarea, CRow, CCol, CForm, CAlert
} from '@coreui/react';
import styles from '../../../../../scss/活動數據盤點.module.css';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { useRefreshData } from '../refreshdata';

export const SellingWasteAdd = ({ 
    isAddModalVisible, 
    setAddModalVisible,
    refreshSellingWasteData, 
    setCurrentFunction,
    setCurrentTitle
}) => {
    // Create a local refresh instance as backup
    const localRefreshData = useRefreshData();
    
    // Form state with default values
    const defaultFormData = {
        waste_item: '',
        remark: '',
        image: null
    };
    
    const [formData, setFormData] = useState({...defaultFormData});

    // UI states
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertColor, setAlertColor] = useState('danger');
    const [formErrors, setFormErrors] = useState({});
    
    // Clean up resources when component unmounts or modal closes
    useEffect(() => {
        return () => {
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    // Reset form when modal opens/closes
    useEffect(() => {
        if (!isAddModalVisible) {
            resetForm();
        }
    }, [isAddModalVisible]);

    const resetForm = useCallback(() => {
        setFormData({...defaultFormData});
        
        if (previewImage) {
            URL.revokeObjectURL(previewImage);
            setPreviewImage(null);
        }
        
        setFormErrors({});
        setShowAlert(false);
    }, [previewImage, defaultFormData]);

    const handleClose = () => {
        setAddModalVisible(false);
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        
        // Clear validation error for this field
        if (formErrors[id]) {
            setFormErrors(prev => ({
                ...prev,
                [id]: undefined
            }));
        }
    };

    // Handle image changes
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

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
        if (previewImage) {
            URL.revokeObjectURL(previewImage);
        }

        // Update form data and preview
        setFormData(prev => ({
            ...prev,
            image: file
        }));
        
        const previewUrl = URL.createObjectURL(file);
        setPreviewImage(previewUrl);
        
        // Clear image validation error
        if (formErrors.image) {
            setFormErrors(prev => ({
                ...prev,
                image: undefined
            }));
        }
    };

    // Validate the form
    const validateForm = () => {
        const errors = {};
        
        if (!formData.waste_item) errors.waste_item = '請輸入廢棄物項目';
        if (!formData.image) errors.image = '請上傳圖片';
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Safe refresh function that tries multiple approaches
    const safeRefresh = async () => {
        console.log("Attempting to refresh waste data...");
        try {
            // First try the prop passed from parent
            if (typeof refreshSellingWasteData === 'function') {
                console.log("Using refreshSellingWasteData from props");
                await refreshSellingWasteData();
                return true;
            } 
            // Then try our local refresh
            else if (localRefreshData && typeof localRefreshData.refreshSellingWasteData === 'function') {
                console.log("Using localRefreshData.refreshSellingWasteData");
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

    const showFormAlert = (message, color) => {
        setAlertMessage(message);
        setAlertColor(color);
        setShowAlert(true);
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            setShowAlert(false);
        }, 5000);
    };

    const handleSubmit = async (e) => {
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
            // Prepare form data
            const formDataToSend = new FormData();
            formDataToSend.append("user_id", window.sessionStorage.getItem("user_id") || "1");
            formDataToSend.append("waste_item", formData.waste_item);
            formDataToSend.append("remark", formData.remark || "");
            formDataToSend.append("image", formData.image);
    
            // Show submission status
            showFormAlert('正在提交資料...', 'info');
            
            // Send form data to the backend
            const res = await fetch("http://localhost:8000/insert_Selling_waste", {
                method: "POST",
                body: formDataToSend,
            });
    
            if (res.ok) {
                console.log('✅ Form submitted successfully!');
                
                // Close modal first
                setAddModalVisible(false);
                
                // Wait a moment before refreshing data
                setTimeout(async () => {
                    const refreshSuccessful = await safeRefresh();
                    
                    // Update current function and title if available
                    if (typeof setCurrentFunction === 'function') {
                        setCurrentFunction("SellingWaste");
                    }
                    
                    if (typeof setCurrentTitle === 'function') {
                        setCurrentTitle("可回售廢棄物");
                    }
                    
                    if (refreshSuccessful) {
                        alert("資料提交成功！");
                    } else {
                        alert("資料已提交，但無法自動刷新頁面。請手動刷新。");
                    }
                }, 500);
            } else {
                const errorText = await res.text();
                console.error("❌ Failed to submit form:", errorText);
                showFormAlert(`提交失敗，請重試。${errorText ? `錯誤: ${errorText}` : ''}`, "danger");
            }
        } catch (error) {
            console.error("❌ Error submitting form:", error);
            showFormAlert(`提交時發生錯誤: ${error.message}`, "danger");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <CModal
            backdrop="static"
            visible={isAddModalVisible}
            onClose={handleClose}
            aria-labelledby="ActivityModalLabel"
            size="xl"
        >
            <CModalHeader>
                <CModalTitle id="ActivityModalLabel"><b>新增可回售廢棄物</b></CModalTitle>
            </CModalHeader>
            
            <CForm onSubmit={handleSubmit}>
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
                                        className={styles.addinput} 
                                        type="text" 
                                        id="waste_item" 
                                        value={formData.waste_item}
                                        onChange={handleInputChange}
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
                                        value={formData.remark}
                                        onChange={handleInputChange}
                                        placeholder="選填，可記錄其他相關資訊"
                                    />
                                </CCol>
                            </CRow>
                            
                            <CRow className="mb-3">
                                <CFormLabel
                                    htmlFor="image"
                                    className={`col-sm-2 col-form-label ${styles.addlabel}`}
                                >
                                    圖片*
                                </CFormLabel>
                                <CCol>
                                    <CFormInput 
                                        type="file" 
                                        id="image" 
                                        onChange={handleImageChange}
                                        invalid={!!formErrors.image}
                                        accept="image/*"
                                    />
                                    {formErrors.image && (
                                        <div className="invalid-feedback">{formErrors.image}</div>
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
                                            alt="廢棄物圖片預覽"
                                            style={{ maxWidth: '100%', maxHeight: '200px' }}
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
                                    <li>請填寫正確的廢棄物項目名稱</li>
                                    <li>備註欄可記錄處理方式或其他相關資訊</li>
                                    <li>請上傳清晰的廢棄物圖片</li>
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
                        {isSubmitting ? '提交中...' : '新增'}
                    </CButton>
                </CModalFooter>
            </CForm>
        </CModal>
    );
};

export default SellingWasteAdd;