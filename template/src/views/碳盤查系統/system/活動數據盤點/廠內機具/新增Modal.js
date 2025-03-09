import React, { useState, useEffect, useCallback } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CButton, CFormLabel, 
    CFormInput, CFormTextarea, CRow, CCol, CFormSelect, CForm, CAlert, CCard, CCardBody
} from '@coreui/react';
import styles from '../../../../../scss/活動數據盤點.module.css';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { useRefreshData } from '../refreshdata';

export const MachineryAdd = ({ 
    isAddModalVisible, 
    setAddModalVisible,
    refreshMachineryData,
    setCurrentFunction,
    setCurrentTitle
}) => {
    // Create a local refresh instance as backup
    const localRefreshData = useRefreshData();
    
    // State for date restrictions
    const [cfvStartDate, setCfvStartDate] = useState('');
    const [cfvEndDate, setCfvEndDate] = useState('');
    
    // Form state with default values
    const defaultFormData = {
        date: '',
        number: '',
        location: '',
        energy_type: '1',
        usage: '',
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
    
    // OCR states
    const [ocrData, setOcrData] = useState({
        date: '',
        number: ''
    });

    // Fetch baseline data when component mounts
    useEffect(() => {
        getBaseline();
    }, []);

    // Function to fetch baseline data
    const getBaseline = async () => {
        try {
            const response = await fetch('http://localhost:8000/baseline');
            if (response.ok) {
                const data = await response.json();
                setCfvStartDate(data.baseline.cfv_start_date);
                setCfvEndDate(data.baseline.cfv_end_date);
            } else {
                console.log(response.status);
                showFormAlert('無法取得基準期間資料', 'warning');
            }
        } catch (error) {
            console.error('Error fetching baseline:', error);
            showFormAlert('取得基準期間資料時發生錯誤', 'warning');
        }
    };

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
        
        // Special validation for date field
        if (id === 'date') {
            if (cfvStartDate && cfvEndDate && (value < cfvStartDate || value > cfvEndDate)) {
                setFormErrors(prev => ({
                    ...prev,
                    date: `日期必須在 ${cfvStartDate} 至 ${cfvEndDate} 之間`
                }));
            } else {
                setFormErrors(prev => ({
                    ...prev,
                    date: undefined
                }));
            }
            
            // If this is a field with OCR data, check if it matches
            if (ocrData.date && value !== ocrData.date) {
                showFormAlert(`輸入的日期 (${value}) 與偵測結果 (${ocrData.date}) 不符`, 'warning');
            }
        } 
        // For other fields
        else if (id === 'number' && ocrData.number && value !== ocrData.number) {
            showFormAlert(`輸入的號碼 (${value}) 與偵測結果 (${ocrData.number}) 不符`, 'warning');
        }
        
        // Clear validation error for non-date fields
        if (id !== 'date' && formErrors[id]) {
            setFormErrors(prev => ({
                ...prev,
                [id]: undefined
            }));
        }
    };

    // Apply OCR data to form
    const applyOcrData = () => {
        let appliedCount = 0;

        if (ocrData.date || ocrData.number) {
            // Track what was applied for better messaging
            const updates = [];

            if (ocrData.date) {
                // Check if date is within valid range before applying
                if (cfvStartDate && cfvEndDate && (ocrData.date < cfvStartDate || ocrData.date > cfvEndDate)) {
                    showFormAlert(`偵測到的日期 (${ocrData.date}) 不在有效範圍內，未套用`, 'warning');
                } else {
                    setFormData(prev => ({
                        ...prev,
                        date: ocrData.date
                    }));
                    appliedCount++;
                    updates.push('日期');
                    
                    // Clear date error
                    setFormErrors(prev => ({
                        ...prev,
                        date: undefined
                    }));
                }
            }

            if (ocrData.number) {
                setFormData(prev => ({
                    ...prev,
                    number: ocrData.number
                }));
                appliedCount++;
                updates.push('號碼');
                
                // Clear number error
                setFormErrors(prev => ({
                    ...prev,
                    number: undefined
                }));
            }

            if (appliedCount > 0) {
                showFormAlert(`已應用偵測${updates.join('和')}`, 'success');
            } else {
                showFormAlert('沒有可應用的偵測資料', 'warning');
            }
        } else {
            showFormAlert('沒有可應用的偵測資料', 'warning');
        }

        return appliedCount;
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
                
                // Extract and clean OCR results
                let extractedDate = '';
                let extractedNumber = '';

                if (data.response_content && Array.isArray(data.response_content)) {
                    if (data.response_content[0]) {
                        extractedDate = String(data.response_content[0])
                            .replace(/[\[\]'"]/g, '')
                            .trim();
                    }
                    if (data.response_content[1]) {
                        extractedNumber = String(data.response_content[1])
                            .replace(/[\[\]'"]/g, '')
                            .trim();
                    }
                }
                
                // Update OCR data
                setOcrData({
                    date: extractedDate,
                    number: extractedNumber
                });
                
                // Check if extracted date is within valid range
                if (extractedDate && cfvStartDate && cfvEndDate) {
                    if (extractedDate < cfvStartDate || extractedDate > cfvEndDate) {
                        showFormAlert(`偵測到的日期 (${extractedDate}) 不在有效範圍內，請確認`, 'warning');
                    } else {
                        // Auto-apply OCR data if form fields are empty and date is valid
                        let applied = false;
                        
                        if (!formData.date && extractedDate) {
                            setFormData(prev => ({
                                ...prev,
                                date: extractedDate
                            }));
                            applied = true;
                        }
                        
                        if (!formData.number && extractedNumber) {
                            setFormData(prev => ({
                                ...prev,
                                number: extractedNumber
                            }));
                            applied = true;
                        }
                        
                        if (applied) {
                            showFormAlert('圖片處理完成，已自動套用偵測資料', 'success');
                        } else {
                            showFormAlert('圖片處理完成', 'success');
                        }
                    }
                } else {
                    // If no date validation needed, apply as normal
                    let applied = false;
                    
                    if (!formData.date && extractedDate) {
                        setFormData(prev => ({
                            ...prev,
                            date: extractedDate
                        }));
                        applied = true;
                    }
                    
                    if (!formData.number && extractedNumber) {
                        setFormData(prev => ({
                            ...prev,
                            number: extractedNumber
                        }));
                        applied = true;
                    }
                    
                    if (applied) {
                        showFormAlert('圖片處理完成，已自動套用偵測資料', 'success');
                    } else {
                        showFormAlert('圖片處理完成', 'success');
                    }
                }
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
        
        if (!formData.date) {
            errors.date = '請選擇日期';
        } else if (cfvStartDate && cfvEndDate && (formData.date < cfvStartDate || formData.date > cfvEndDate)) {
            errors.date = `日期必須在 ${cfvStartDate} 至 ${cfvEndDate} 之間`;
        }
        
        if (!formData.number) errors.number = '請輸入發票號碼/收據編號';
        if (!formData.location) errors.location = '請輸入設備位置';
        if (!formData.usage) errors.usage = '請輸入使用量';
        if (!formData.image) errors.image = '請上傳圖片';
        
        // Validate numeric fields to ensure they're non-negative
        if (formData.usage && parseFloat(formData.usage) < 0) {
            errors.usage = '數值不能為負數';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Safe refresh function that tries multiple approaches
    const safeRefresh = async () => {
        console.log("Attempting to refresh machinery data...");
        try {
            // First try the prop passed from parent
            if (typeof refreshMachineryData === 'function') {
                console.log("Using refreshMachineryData from props");
                await refreshMachineryData();
                return true;
            } 
            // Then try our local refresh
            else if (localRefreshData && typeof localRefreshData.refreshMachineryData === 'function') {
                console.log("Using localRefreshData.refreshMachineryData");
                await localRefreshData.refreshMachineryData();
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
            showFormAlert('請填寫所有必填欄位，並確保日期在有效範圍內', 'danger');
            return;
        }
        
        setIsSubmitting(true);
    
        try {
            // Prepare form data
            const formDataToSend = new FormData();
            formDataToSend.append("user_id", window.sessionStorage.getItem("user_id") || "1");
            formDataToSend.append("date", formData.date);
            formDataToSend.append("number", formData.number);
            formDataToSend.append("location", formData.location);
            formDataToSend.append("type", formData.energy_type);
            formDataToSend.append("usage", formData.usage);
            formDataToSend.append("remark", formData.remark || "");
            formDataToSend.append("image", formData.image);
    
            // Show submission status
            showFormAlert('正在提交資料...', 'info');
            
            // Send form data to the backend
            const res = await fetch("http://localhost:8000/insert_machine", {
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
                        setCurrentFunction("Machinery");
                    }
                    
                    if (typeof setCurrentTitle === 'function') {
                        setCurrentTitle("機械設備燃料紀錄");
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

    // Energy type options
    const energyTypeOptions = [
        { value: "1", label: "柴油" },
        { value: "2", label: "汽油" },
        { value: "3", label: "其他" }
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
                <CModalTitle id="ActivityModalLabel"><b>新增機械設備燃料紀錄</b></CModalTitle>
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
                                        min={cfvStartDate}
                                        max={cfvEndDate}
                                    />
                                    {formErrors.date && (
                                        <div className="invalid-feedback">{formErrors.date}</div>
                                    )}
                                    {cfvStartDate && cfvEndDate && (
                                        <div className="form-text">
                                            有效日期範圍: {cfvStartDate} 至 {cfvEndDate}
                                        </div>
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
                                <CFormLabel htmlFor="location" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    設備位置*
                                </CFormLabel>
                                <CCol>
                                    <CFormInput 
                                        className={styles.addinput} 
                                        type="text" 
                                        id="location" 
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        invalid={!!formErrors.location}
                                        placeholder="例如: 工地、廠房、辦公室..."
                                    />
                                    {formErrors.location && (
                                        <div className="invalid-feedback">{formErrors.location}</div>
                                    )}
                                </CCol>
                            </CRow>
                            
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="energy_type" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    能源類型*
                                </CFormLabel>
                                <CCol>
                                    <CFormSelect 
                                        className={styles.addinput}
                                        id="energy_type" 
                                        value={formData.energy_type}
                                        onChange={handleInputChange}
                                    >
                                        {energyTypeOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                            
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="usage" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    使用量(公升)*
                                </CFormLabel>
                                <CCol>
                                    <CFormInput 
                                        className={styles.addinput} 
                                        type="number" 
                                        min="0" 
                                        step="0.01"
                                        id="usage" 
                                        value={formData.usage}
                                        onChange={handleInputChange}
                                        invalid={!!formErrors.usage}
                                        placeholder="請輸入數值"
                                    />
                                    {formErrors.usage && (
                                        <div className="invalid-feedback">{formErrors.usage}</div>
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
                                    <li>發票/收據日期必須在規定的基準期間內</li>
                                    <li>使用量請以公升為單位</li>
                                    <li>請上傳機械設備燃料相關發票或收據的圖片</li>
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

export default MachineryAdd;