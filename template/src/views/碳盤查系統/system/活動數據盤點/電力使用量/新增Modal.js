import React, { useState, useEffect } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CButton, CFormLabel, 
    CFormInput, CFormTextarea, CRow, CCol, CForm, CAlert
} from '@coreui/react';
import styles from '../../../../../scss/活動數據盤點.module.css';
import { useRefreshData } from '../refreshdata';

export const ElectricityAdd = ({
    isAddModalVisible,
    setAddModalVisible,
    refreshElectricityData,
    setCurrentFunction,
    setCurrentTitle
}) => {
    // Create a local refresh instance as backup
    const localRefreshData = useRefreshData();
    
    // Form state
    const [formData, setFormData] = useState({
        customer_number: '',
        explain: '',
    });

    // UI states
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertColor, setAlertColor] = useState('danger');
    const [formErrors, setFormErrors] = useState({});

    // Reset form when modal opens/closes
    useEffect(() => {
        if (!isAddModalVisible) {
            resetForm();
        }
    }, [isAddModalVisible]);

    const resetForm = () => {
        setFormData({
            customer_number: '',
            explain: '',
        });
        
        setFormErrors({});
        setShowAlert(false);
    };

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

    // Validate the form
    const validateForm = () => {
        const errors = {};
        
        if (!formData.customer_number.trim()) errors.customer_number = '請輸入電號';
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Safe refresh function that tries multiple approaches
    const safeRefresh = async () => {
        console.log("Attempting to refresh electricity data...");
        try {
            // First try the prop passed from parent
            if (typeof refreshElectricityData === 'function') {
                console.log("Using refreshElectricityData from props");
                await refreshElectricityData();
                return true;
            } 
            // Then try our local refresh
            else if (localRefreshData && typeof localRefreshData.refreshElectricityData === 'function') {
                console.log("Using localRefreshData.refreshElectricityData");
                await localRefreshData.refreshElectricityData();
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
            formDataToSend.append("user_id", window.sessionStorage.getItem("user_id"));
            formDataToSend.append("customer_number", formData.customer_number);
            formDataToSend.append("explain", formData.explain);
    
            // Send form data to the backend
            const res = await fetch("http://localhost:8000/insert_electricity", {
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
                    
                    // Update current function and title
                    if (typeof setCurrentFunction === 'function') {
                        setCurrentFunction("Electricity");
                    }
                    
                    if (typeof setCurrentTitle === 'function') {
                        setCurrentTitle("用電");
                    }
                    
                    if (refreshSuccessful) {
                        alert("資料提交成功！");
                    } else {
                        alert("資料已提交，但無法自動刷新頁面。請手動刷新。");
                    }
                }, 500);
            } else {
                const errorData = await res.json().catch(() => ({}));
                console.error("❌ Failed to submit form", errorData);
                showFormAlert(errorData.detail || "提交失敗，請重試。", "danger");
            }
        } catch (error) {
            console.error("❌ Error submitting form:", error);
            showFormAlert("提交時發生錯誤。", "danger");
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
                <CModalTitle id="ActivityModalLabel"><b>新增電號數據</b></CModalTitle>
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
                                <CFormLabel 
                                    htmlFor="customer_number" 
                                    className={`col-sm-2 col-form-label ${styles.addlabel}`}
                                >
                                    電號*
                                </CFormLabel>
                                <CCol>
                                    <CFormInput 
                                        className={styles.addinput} 
                                        type="text" 
                                        id="customer_number" 
                                        value={formData.customer_number}
                                        onChange={handleInputChange}
                                        invalid={!!formErrors.customer_number}
                                    />
                                    {formErrors.customer_number && (
                                        <div className="invalid-feedback">{formErrors.customer_number}</div>
                                    )}
                                </CCol>
                            </CRow>
                            
                            <CRow className="mb-3">
                                <CFormLabel 
                                    htmlFor="explain" 
                                    className={`col-sm-2 col-form-label ${styles.addlabel}`}
                                >
                                    備註
                                </CFormLabel>
                                <CCol>
                                    <CFormTextarea 
                                        className={styles.addinput} 
                                        id="explain" 
                                        rows={3}
                                        value={formData.explain}
                                        onChange={handleInputChange}
                                    />
                                </CCol>
                            </CRow>

                            <div className="text-center mt-3">
                                <small>*為必填欄位</small>
                            </div>
                        </div>
                        
                        <div className={styles.modalRight}>
                            <CFormLabel className={styles.addlabel}>
                                使用說明
                            </CFormLabel>
                            <div className={styles.infoBlock || 'p-3 border'}>
                                <ul className="mb-0">
                                    <li>電號為必填項目</li>
                                    <li>請確保電號資料正確</li>
                                    <li>備註可提供額外資訊，如使用位置等</li>
                                    <li>提交後可在主頁面新增用電填充記錄</li>
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

export default ElectricityAdd;