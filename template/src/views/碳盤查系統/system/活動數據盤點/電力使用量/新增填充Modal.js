import React, { useState, useEffect, useCallback } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CButton, CFormLabel,
    CFormInput, CFormTextarea, CRow, CCol, CFormSelect, CForm, CAlert
} from '@coreui/react';
import styles from '../../../../../scss/活動數據盤點.module.css';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { useRefreshData } from '../refreshdata';

const AddFillModal = ({
    isAddFillModalVisible,
    setAddFillModalVisible,
    selectedElectricityId,
    refreshElectricityData,
    setCurrentFunction,
    setCurrentTitle
}) => {
    // Create a local refresh instance as backup
    const localRefreshData = useRefreshData();

    // Form state with default values
    const defaultFormData = {
        date: '',
        num: '',
        start: '',
        end: '',
        electricityType: '1',
        usage: '',
        amount: '',
        carbon_emission: '',
        remark: '',
        image: null
    };

    const [formData, setFormData] = useState({ ...defaultFormData });

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
        num: ''
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
        if (!isAddFillModalVisible) {
            resetForm();
        }
    }, [isAddFillModalVisible]);

    const resetForm = useCallback(() => {
        setFormData({ ...defaultFormData });
        setOcrData({ date: '', num: '' });

        if (previewImage) {
            URL.revokeObjectURL(previewImage);
            setPreviewImage(null);
        }

        setFormErrors({});
        setShowAlert(false);
    }, [previewImage, defaultFormData]);

    const handleClose = () => {
        setAddFillModalVisible(false);
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
        } else if (id === 'num' && ocrData.num && value !== ocrData.num) {
            showFormAlert(`輸入的號碼 (${value}) 與偵測結果 (${ocrData.num}) 不符`, 'warning');
        }

        // Clear validation error for this field
        if (formErrors[id]) {
            setFormErrors(prev => ({
                ...prev,
                [id]: undefined
            }));
        }
    };

    // Handle electricity type changes
    const handleElectricityTypeChange = (e) => {
        const value = e.target.value;
        
        setFormData(prev => ({
            ...prev,
            electricityType: value,
            // Reset the relevant fields based on type
            ...(value === '1' ? { amount: '' } : {}),
            ...(value === '2' ? { usage: '' } : {})
        }));
    };

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
                console.log('OCR API response:', data);

                // Properly extract and clean response values
                let extractedDate = '';
                let extractedNum = '';

                if (data.response_content && Array.isArray(data.response_content)) {
                    // Clean up any potential string artifacts
                    if (data.response_content[0]) {
                        extractedDate = String(data.response_content[0])
                            .replace(/[\[\]'"]/g, '') // Remove brackets and quotes
                            .trim();
                    }

                    if (data.response_content[1]) {
                        extractedNum = String(data.response_content[1])
                            .replace(/[\[\]'"]/g, '') // Remove brackets and quotes
                            .trim();
                    }
                }

                // Update OCR data with cleaned values
                setOcrData({
                    date: extractedDate,
                    num: extractedNum
                });

                // Inform the user that data is available to apply
                if (extractedDate || extractedNum) {
                    showFormAlert('圖片處理完成，可點擊「應用偵測資料」按鈕填入資料', 'success');
                } else {
                    showFormAlert('圖片處理完成，未能識別日期或號碼', 'warning');
                }
            } else {
                showFormAlert('OCR處理失敗，請手動輸入資料', 'warning');
            }
        } catch (error) {
            console.error('Error processing image with OCR:', error);
            showFormAlert('OCR處理發生錯誤，請手動輸入資料', 'warning');
        }
    };

    // Apply OCR data to form with better feedback
    const applyOcrData = () => {
        let appliedCount = 0;

        if (ocrData.date || ocrData.num) {
            // Track what was applied for better messaging
            const updates = [];

            if (ocrData.date) {
                setFormData(prev => ({
                    ...prev,
                    date: ocrData.date
                }));
                appliedCount++;
                updates.push('日期');
            }

            if (ocrData.num) {
                setFormData(prev => ({
                    ...prev,
                    num: ocrData.num
                }));
                appliedCount++;
                updates.push('號碼');
            }

            // Clear related errors
            setFormErrors(prev => ({
                ...prev,
                date: undefined,
                num: undefined
            }));

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

    // Validate the form
    const validateForm = () => {
        const errors = {};

        if (!formData.date) errors.date = '請選擇日期';
        if (!formData.num) errors.num = '請輸入發票號碼/收據編號';
        if (!formData.start) errors.start = '請選擇用電期間(起)';
        if (!formData.end) errors.end = '請選擇用電期間(迄)';
        if (!formData.image) errors.image = '請上傳圖片';
        
        // Validate based on electricity type
        if (formData.electricityType === '1') {
            if (!formData.usage) errors.usage = '請輸入當月總用電量';
            if (formData.usage && parseFloat(formData.usage) < 0) {
                errors.usage = '用電量不能為負數';
            }
        } else if (formData.electricityType === '2') {
            if (!formData.amount) errors.amount = '請輸入當月總金額';
            if (formData.amount && parseFloat(formData.amount) < 0) {
                errors.amount = '金額不能為負數';
            }
        }

        // Validate carbon emission (optional field but must be non-negative if provided)
        if (formData.carbon_emission && parseFloat(formData.carbon_emission) < 0) {
            errors.carbon_emission = '碳排量不能為負數';
        }

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
            // Prepare form data with careful type handling
            const formDataToSend = new FormData();
            // Convert user_id to integer
            const userId = parseInt(window.sessionStorage.getItem("user_id") || "1", 10);
            formDataToSend.append("user_id", userId);
            formDataToSend.append('electricity_id', selectedElectricityId);
            formDataToSend.append('date', formData.date);
            formDataToSend.append('number', formData.num);
            formDataToSend.append('start', formData.start);
            formDataToSend.append('end', formData.end);
            formDataToSend.append('electricity_type', formData.electricityType);
            formDataToSend.append('usage', formData.usage || '0');
            formDataToSend.append('amount', formData.amount || '0');
            formDataToSend.append('carbon_emission', formData.carbon_emission || '0');
            formDataToSend.append('remark', formData.remark || "");

            // Append image with the exact filename
            if (formData.image && formData.image.name) {
                const imageFile = formData.image;
                // Rename with timestamp to avoid duplicate names
                const newFile = new File(
                    [imageFile],
                    `${Date.now()}_${imageFile.name}`,
                    { type: imageFile.type }
                );
                formDataToSend.append("image", newFile);
            } else {
                formDataToSend.append("image", formData.image);
            }

            // Show submission status
            showFormAlert('正在提交資料...', 'info');

            // Send form data to the backend with debug logging
            console.log("Sending form data to backend:", {
                user_id: formDataToSend.get("user_id"),
                electricity_id: formDataToSend.get("electricity_id"),
                date: formDataToSend.get("date"),
                number: formDataToSend.get("number"),
                start: formDataToSend.get("start"),
                end: formDataToSend.get("end"),
                electricity_type: formDataToSend.get("electricity_type"),
                usage: formDataToSend.get("usage"),
                amount: formDataToSend.get("amount"),
                carbon_emission: formDataToSend.get("carbon_emission"),
                remark: formDataToSend.get("remark"),
                image: formDataToSend.get("image") ? "File attached" : "No file"
            });
    
            const res = await fetch("http://localhost:8000/insert_electricity_usage", {
                method: "POST",
                body: formDataToSend,
            });
    
            if (res.ok) {
                console.log('✅ Form submitted successfully!');
                
                // Close modal first
                setAddFillModalVisible(false);
                
                // Wait a moment before refreshing data
                setTimeout(async () => {
                    const refreshSuccessful = await safeRefresh();
                    
                    // Update current function and title if available
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
            visible={isAddFillModalVisible}
            onClose={handleClose}
            aria-labelledby="AddFillModalLabel"
            size="xl"
        >
            <CModalHeader>
                <CModalTitle id="AddFillModalLabel"><b>新增填充紀錄</b></CModalTitle>
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
                                <CFormLabel htmlFor="num" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    發票號碼/收據編號*
                                </CFormLabel>
                                <CCol>
                                    <CFormInput 
                                        className={styles.addinput} 
                                        type="text" 
                                        id="num" 
                                        value={formData.num}
                                        onChange={handleInputChange}
                                        invalid={!!formErrors.num}
                                    />
                                    {formErrors.num && (
                                        <div className="invalid-feedback">{formErrors.num}</div>
                                    )}
                                </CCol>
                            </CRow>
                            
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="start" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    用電期間(起)*
                                </CFormLabel>
                                <CCol>
                                    <CFormInput 
                                        className={styles.addinput} 
                                        type="date" 
                                        id="start" 
                                        value={formData.start}
                                        onChange={handleInputChange}
                                        invalid={!!formErrors.start}
                                    />
                                    {formErrors.start && (
                                        <div className="invalid-feedback">{formErrors.start}</div>
                                    )}
                                </CCol>
                            </CRow>
                            
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="end" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    用電期間(迄)*
                                </CFormLabel>
                                <CCol>
                                    <CFormInput 
                                        className={styles.addinput} 
                                        type="date" 
                                        id="end" 
                                        value={formData.end}
                                        onChange={handleInputChange}
                                        invalid={!!formErrors.end}
                                    />
                                    {formErrors.end && (
                                        <div className="invalid-feedback">{formErrors.end}</div>
                                    )}
                                </CCol>
                            </CRow>
                            
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="electricityType" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    填寫類型*
                                    <span className={styles.Note}> 選擇填寫請以*用電度數*作為優先填寫項目</span>
                                </CFormLabel>
                                <CCol>
                                    <CFormSelect
                                        aria-label="填寫類型選擇"
                                        id="electricityType"
                                        className={styles.addinput}
                                        value={formData.electricityType}
                                        onChange={handleElectricityTypeChange}
                                    >
                                        <option value="1">用電度數</option>
                                        <option value="2">用電金額</option>
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                            
                            {formData.electricityType === '1' && (
                                <CRow className="mb-3">
                                    <CFormLabel htmlFor="usage" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                        當月總用電量*
                                    </CFormLabel>
                                    <CCol>
                                        <CFormInput 
                                            className={styles.addinput} 
                                            type="number" 
                                            id="usage" 
                                            min="0"
                                            step="0.01"
                                            value={formData.usage}
                                            onChange={handleInputChange}
                                            invalid={!!formErrors.usage}
                                            placeholder="請輸入用電度數"
                                        />
                                        {formErrors.usage && (
                                            <div className="invalid-feedback">{formErrors.usage}</div>
                                        )}
                                    </CCol>
                                </CRow>
                            )}
                            
                            {formData.electricityType === '2' && (
                                <CRow className="mb-3">
                                    <CFormLabel htmlFor="amount" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                        當月總金額*
                                    </CFormLabel>
                                    <CCol>
                                        <CFormInput 
                                            className={styles.addinput} 
                                            type="number" 
                                            id="amount" 
                                            min="0"
                                            step="0.01"
                                            value={formData.amount}
                                            onChange={handleInputChange}
                                            invalid={!!formErrors.amount}
                                            placeholder="請輸入金額"
                                        />
                                        {formErrors.amount && (
                                            <div className="invalid-feedback">{formErrors.amount}</div>
                                        )}
                                    </CCol>
                                </CRow>
                            )}
                            
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="carbon_emission" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    當月碳排量
                                </CFormLabel>
                                <CCol>
                                    <CFormInput 
                                        className={styles.addinput} 
                                        type="number" 
                                        id="carbon_emission" 
                                        min="0"
                                        step="0.01"
                                        value={formData.carbon_emission}
                                        onChange={handleInputChange}
                                        invalid={!!formErrors.carbon_emission}
                                        placeholder="可選填，請輸入碳排量"
                                    />
                                    {formErrors.carbon_emission && (
                                        <div className="invalid-feedback">{formErrors.carbon_emission}</div>
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
                                {(ocrData.date || ocrData.num) && (
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
                                <div>偵測號碼: {ocrData.num || '尚未偵測'}</div>
                            </div>

                            <CFormLabel className={styles.addlabel}>
                                填表說明
                            </CFormLabel>
                            <div className={styles.infoBlock || 'p-3 border'}>
                                <ul className="mb-0">
                                    <li>所有帶有 * 的欄位為必填項目</li>
                                    <li>填寫類型可選「用電度數」或「用電金額」</li>
                                    <li>建議優先填寫「用電度數」</li>
                                    <li>用電期間必須設定起始與結束日期</li>
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
                        {isSubmitting ? '提交中...' : '儲存'}
                    </CButton>
                </CModalFooter>
            </CForm>
        </CModal>
    );
};

export default AddFillModal;