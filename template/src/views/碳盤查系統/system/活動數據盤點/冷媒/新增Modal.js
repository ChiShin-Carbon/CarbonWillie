import React, { useState, useEffect, useCallback } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CButton, CFormLabel, 
    CFormInput, CFormTextarea, CRow, CCol, CFormSelect, CForm, CAlert, CCard, CCardBody, CCollapse
} from '@coreui/react';
import styles from '../../../../../scss/活動數據盤點.module.css';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { useRefreshData } from '../refreshdata';

export const RefrigerantAdd = ({ 
    isAddModalVisible, 
    setAddModalVisible,
    refreshRefrigerantData,
    setCurrentFunction,
    setCurrentTitle
}) => {
    // Create a local refresh instance as backup
    const localRefreshData = useRefreshData();
    
    // Form state with default values
    const defaultFormData = {
        date: '',
        number: '',
        device_type: '1',
        device_location: '',
        refrigerant_type: '1',
        filling: '',
        quantity: '1',  // Default to 1
        leakage_rate: '',
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
    const [visible, setVisible] = useState(false);
    
    // OCR states
    const [ocrData, setOcrData] = useState({
        date: '',
        number: ''
    });

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
        setOcrData({ date: '', number: '' });
        
        if (previewImage) {
            URL.revokeObjectURL(previewImage);
            setPreviewImage(null);
        }
        
        setFormErrors({});
        setShowAlert(false);
        setVisible(false);
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
        
        // If this is a field with OCR data, check if it matches
        if (id === 'date' && ocrData.date && value !== ocrData.date) {
            showFormAlert(`輸入的日期 (${value}) 與偵測結果 (${ocrData.date}) 不符`, 'warning');
        } else if (id === 'number' && ocrData.number && value !== ocrData.number) {
            showFormAlert(`輸入的號碼 (${value}) 與偵測結果 (${ocrData.number}) 不符`, 'warning');
        }
        
        // Clear validation error for this field
        if (formErrors[id]) {
            setFormErrors(prev => ({
                ...prev,
                [id]: undefined
            }));
        }
    };

    // Apply OCR data to form
    const applyOcrData = () => {
        if (ocrData.date || ocrData.number) {
            setFormData(prev => ({
                ...prev,
                date: ocrData.date || prev.date,
                number: ocrData.number || prev.number
            }));
            
            // Clear related errors
            setFormErrors(prev => ({
                ...prev,
                date: undefined,
                number: undefined
            }));
            
            showFormAlert('已應用偵測資料', 'success');
        } else {
            showFormAlert('沒有可應用的偵測資料', 'warning');
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
        
        // Process image with OCR
        processImageWithOCR(file);
    };

    // Process image with OCR
    const processImageWithOCR = async (imageFile) => {
        showFormAlert('正在處理圖片...', 'info');
        
        const formDataToSend = new FormData();
        formDataToSend.append('image', imageFile);

        try {
            const res = await fetch('http://localhost:8000/ocrapi', {
                method: 'POST',
                body: formDataToSend,
            });

            if (res.ok) {
                const data = await res.json();
                const extractedDate = data.response_content[0];
                const extractedNumber = data.response_content[1];
                
                // Update OCR data
                setOcrData({
                    date: extractedDate,
                    number: extractedNumber
                });
                
                // Auto-apply OCR data if form fields are empty
                if (!formData.date && extractedDate) {
                    setFormData(prev => ({
                        ...prev,
                        date: extractedDate
                    }));
                }
                
                if (!formData.number && extractedNumber) {
                    setFormData(prev => ({
                        ...prev,
                        number: extractedNumber
                    }));
                }
                
                showFormAlert('圖片處理完成', 'success');
            } else {
                showFormAlert('OCR處理失敗，請手動輸入資料', 'warning');
            }
        } catch (error) {
            console.error('Error processing image with OCR:', error);
            showFormAlert('OCR處理發生錯誤，請手動輸入資料', 'warning');
        }
    };

    // Validate the form
    const validateForm = () => {
        const errors = {};
        
        if (!formData.date) errors.date = '請選擇日期';
        if (!formData.number) errors.number = '請輸入發票號碼/收據編號';
        if (!formData.device_location) errors.device_location = '請輸入設備位置';
        if (!formData.filling) errors.filling = '請輸入填充料(公克)';
        if (!formData.quantity) errors.quantity = '請輸入數量';
        if (!formData.leakage_rate) errors.leakage_rate = '請輸入逸散率';
        if (!formData.image) errors.image = '請上傳圖片';
        
        // Validate numeric fields to ensure they're non-negative
        const numericFields = ['filling', 'quantity', 'leakage_rate'];
        
        numericFields.forEach(field => {
            if (formData[field] && parseFloat(formData[field]) < 0) {
                errors[field] = '數值不能為負數';
            }
        });
        
        // Validate leakage rate is between 0 and 100
        if (formData.leakage_rate && (parseFloat(formData.leakage_rate) < 0 || parseFloat(formData.leakage_rate) > 100)) {
            errors.leakage_rate = '逸散率必須在 0 到 100 之間';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
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
                console.log("Using localRefreshData.refreshRefrigerantData");
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
            formDataToSend.append("date", formData.date);
            formDataToSend.append("number", formData.number);
            formDataToSend.append("device_type", formData.device_type);
            formDataToSend.append("device_location", formData.device_location);
            formDataToSend.append("refrigerant_type", formData.refrigerant_type);
            formDataToSend.append("filling", formData.filling);
            formDataToSend.append("quantity", formData.quantity);
            formDataToSend.append("leakage_rate", formData.leakage_rate);
            formDataToSend.append("remark", formData.remark || "");
            formDataToSend.append("image", formData.image);
    
            // Show submission status
            showFormAlert('正在提交資料...', 'info');
            
            // Send form data to the backend
            const res = await fetch("http://localhost:8000/insert_ref", {
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
                        setCurrentFunction("Refrigerant");
                    }
                    
                    if (typeof setCurrentTitle === 'function') {
                        setCurrentTitle("冷媒填充紀錄");
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

    // Device type options
    const deviceTypeOptions = [
        { value: "1", label: "冰箱" },
        { value: "2", label: "冷氣機" },
        { value: "3", label: "飲水機" },
        { value: "4", label: "冰水主機" },
        { value: "5", label: "空壓機" },
        { value: "6", label: "除濕機" },
        { value: "7", label: "車用冷媒" },
        { value: "8", label: "製冰機" },
        { value: "9", label: "冰櫃" },
        { value: "10", label: "冷凍櫃" },
        { value: "11", label: "其他" }
    ];

    // Refrigerant type options
    const refrigerantTypeOptions = [
        { value: "1", label: "R11" },
        { value: "2", label: "R12" },
        { value: "3", label: "R22" },
        { value: "4", label: "R-32" },
        { value: "5", label: "R-123" },
        { value: "6", label: "R-23" },
        { value: "7", label: "R-134a" },
        { value: "8", label: "R-404A" },
        { value: "9", label: "R-407a" },
        { value: "10", label: "R-410A" },
        { value: "11", label: "R-600a" },
        { value: "12", label: "R-417a" },
        { value: "13", label: "F22" },
        { value: "14", label: "HCR-600A" },
        { value: "15", label: "HFC-134a" },
        { value: "16", label: "R401A" },
        { value: "17", label: "其他" }
    ];

    return (
        <CModal
            backdrop="static"
            visible={isAddModalVisible}
            onClose={handleClose}
            aria-labelledby="ActivityModalLabel"
            size="xl"
        >
            <CModalHeader>
                <CModalTitle id="ActivityModalLabel"><b>新增冷媒紀錄</b></CModalTitle>
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
                                <CFormLabel htmlFor="date" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    發票/收據日期*
                                </CFormLabel>
                                <CCol>
                                    <CFormInput 
                                        className={styles.addinput} 
                                        type="date" 
                                        id="date" 
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        invalid={!!formErrors.date}
                                    />
                                    {formErrors.date && (
                                        <div className="invalid-feedback">{formErrors.date}</div>
                                    )}
                                </CCol>
                            </CRow>
                            
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="number" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    發票號碼/收據編號*
                                </CFormLabel>
                                <CCol>
                                    <CFormInput 
                                        className={styles.addinput} 
                                        type="text" 
                                        id="number" 
                                        value={formData.number}
                                        onChange={handleInputChange}
                                        invalid={!!formErrors.number}
                                    />
                                    {formErrors.number && (
                                        <div className="invalid-feedback">{formErrors.number}</div>
                                    )}
                                </CCol>
                            </CRow>
                            
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="device_type" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    設備類型*
                                </CFormLabel>
                                <CCol>
                                    <CFormSelect 
                                        className={styles.addinput}
                                        id="device_type" 
                                        value={formData.device_type}
                                        onChange={handleInputChange}
                                    >
                                        {deviceTypeOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </CFormSelect>
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
                                        value={formData.device_location}
                                        onChange={handleInputChange}
                                        invalid={!!formErrors.device_location}
                                        placeholder="例如: 辦公室、廠房、餐廳..."
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
                                        value={formData.refrigerant_type}
                                        onChange={handleInputChange}
                                    >
                                        {refrigerantTypeOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                            
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="filling" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    填充料(公克)*
                                </CFormLabel>
                                <CCol>
                                    <CFormInput 
                                        className={styles.addinput} 
                                        type="number" 
                                        min="0" 
                                        step="0.01"
                                        id="filling" 
                                        value={formData.filling}
                                        onChange={handleInputChange}
                                        invalid={!!formErrors.filling}
                                        placeholder="請輸入數值"
                                    />
                                    {formErrors.filling && (
                                        <div className="invalid-feedback">{formErrors.filling}</div>
                                    )}
                                </CCol>
                            </CRow>
                            
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="quantity" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    數量*
                                </CFormLabel>
                                <CCol>
                                    <CFormInput 
                                        className={styles.addinput} 
                                        type="number" 
                                        min="1" 
                                        id="quantity" 
                                        value={formData.quantity}
                                        onChange={handleInputChange}
                                        invalid={!!formErrors.quantity}
                                    />
                                    {formErrors.quantity && (
                                        <div className="invalid-feedback">{formErrors.quantity}</div>
                                    )}
                                </CCol>
                            </CRow>
                            
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="leakage_rate" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    逸散率*<br />
                                    <span 
                                        className={styles.Note2} 
                                        onClick={() => setVisible(!visible)}
                                        style={{ cursor: 'pointer', textDecoration: 'underline', color: '#0d6efd' }}
                                    >
                                        逸散率(%)建議表格
                                    </span>
                                </CFormLabel>
                                <CCol>
                                    <CFormInput 
                                        className={styles.addinput} 
                                        type="number" 
                                        min="0" 
                                        step="0.01"
                                        max="100"
                                        id="leakage_rate" 
                                        value={formData.leakage_rate}
                                        onChange={handleInputChange}
                                        invalid={!!formErrors.leakage_rate}
                                        placeholder="範圍: 0-100%"
                                    />
                                    {formErrors.leakage_rate && (
                                        <div className="invalid-feedback">{formErrors.leakage_rate}</div>
                                    )}
                                </CCol>
                            </CRow>
                            
                            {visible && (
                                <CRow className="mb-3">
                                    <CCol offset={2}>
                                        <CCard className="mt-0 mb-3">
                                            <CCardBody>
                                                <img 
                                                    src='/src/assets/images/逸散率建議表格.png' 
                                                    alt="逸散率建議表格"
                                                    style={{ maxWidth: '100%' }}
                                                />
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                </CRow>
                            )}
                            
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
                                            alt="Uploaded Preview"
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
                                偵測結果
                                {(ocrData.date || ocrData.number) && (
                                    <button 
                                        type="button" 
                                        className="btn btn-sm btn-outline-primary float-end"
                                        onClick={applyOcrData}
                                    >
                                        應用偵測資料
                                    </button>
                                )}
                            </CFormLabel>
                            <div className={styles.errorMSG || 'p-3 border'}>
                                <div>偵測日期: {ocrData.date || '尚未偵測'}</div>
                                <div>偵測號碼: {ocrData.number || '尚未偵測'}</div>
                            </div>
                            
                            <CFormLabel className={styles.addlabel}>
                                填表說明
                            </CFormLabel>
                            <div className={styles.infoBlock || 'p-3 border'}>
                                <ul className="mb-0">
                                    <li>所有帶有 * 的欄位為必填項目</li>
                                    <li>填充料數量請以公克為單位</li>
                                    <li>點擊「逸散率(%)建議表格」可查看各類型設備建議使用的逸散率</li>
                                    <li>請上傳冷媒填充相關發票或收據的圖片</li>
                                    <li>系統會自動偵測上傳圖片中的日期和發票號碼</li>
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

export default RefrigerantAdd;