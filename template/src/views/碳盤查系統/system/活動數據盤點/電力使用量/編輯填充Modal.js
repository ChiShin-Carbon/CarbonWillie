import React, { useState, useEffect, useCallback } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CFormSelect, CForm,
    CModalTitle, CAlert
} from '@coreui/react';
import styles from '../../../../../scss/活動數據盤點.module.css';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

import { useRefreshData } from '../refreshdata';

const EditFillModal = ({
    isEditFillModalVisible,
    setEditFillModalVisible,
    selectedFill,
    refreshElectricityData,
    setCurrentFunction,
    setCurrentTitle
}) => {
    // Create a local refresh instance as backup
    const localRefreshData = useRefreshData();
    const [previewImage, setPreviewImage] = useState(null); // State for image preview
    const [existingImage, setExistingImage] = useState(null); // State to track if there's an existing image
    const [useExistingImage, setUseExistingImage] = useState(true); // Track if using existing image
    
    // State for date restrictions
    const [cfvStartDate, setCfvStartDate] = useState('');
    const [cfvEndDate, setCfvEndDate] = useState('');
    
    const [formValues, setFormValues] = useState({
        Doc_date: '',
        Doc_number: '',
        period_start: '',
        period_end: '',
        electricity_type: '1',
        usage: '',
        amount: '',
        carbon_emission: '',
        remark: '',
        image: null,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    
    // OCR states
    const [ocrData, setOcrData] = useState({
        date: '',
        number: ''
    });
    
    // Alert states
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertColor, setAlertColor] = useState('danger');

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

    // Reset states when modal closes or opens
    const resetStates = useCallback(() => {
        setPreviewImage(null);
        setExistingImage(null);
        setUseExistingImage(true);
        setOcrData({
            date: '',
            number: ''
        });
        setShowAlert(false);
        setFormErrors({});
        setFormValues({
            Doc_date: '',
            Doc_number: '',
            period_start: '',
            period_end: '',
            electricity_type: '1',
            usage: '',
            amount: '',
            carbon_emission: '',
            remark: '',
            image: null,
        });
    }, []);

    // Handle closing the modal
    const handleClose = () => {
        setEditFillModalVisible(false);
        resetStates();
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
                console.log('OCR API response:', data);

                // Properly extract and clean response values
                let extractedDate = '';
                let extractedNumber = '';

                if (data.response_content && Array.isArray(data.response_content)) {
                    // Clean up any potential string artifacts
                    if (data.response_content[0]) {
                        extractedDate = String(data.response_content[0])
                            .replace(/[\[\]'"]/g, '') // Remove brackets and quotes
                            .trim();
                    }

                    if (data.response_content[1]) {
                        extractedNumber = String(data.response_content[1])
                            .replace(/[\[\]'"]/g, '') // Remove brackets and quotes
                            .trim();
                    }
                }

                // Update OCR data with cleaned values
                setOcrData({
                    date: extractedDate,
                    number: extractedNumber
                });

                // Check if extracted date is within valid range
                if (extractedDate && cfvStartDate && cfvEndDate) {
                    if (extractedDate < cfvStartDate || extractedDate > cfvEndDate) {
                        showFormAlert(`偵測到的日期 (${extractedDate}) 不在有效範圍內，請確認`, 'warning');
                    }
                }

                // Check if the OCR data matches current form values
                if (extractedDate && extractedDate !== formValues.Doc_date) {
                    showFormAlert(`偵測的日期 (${extractedDate}) 與表單日期 (${formValues.Doc_date}) 不符`, 'warning');
                }
                
                if (extractedNumber && extractedNumber !== formValues.Doc_number) {
                    showFormAlert(`偵測的號碼 (${extractedNumber}) 與表單號碼 (${formValues.Doc_number}) 不符`, 'warning');
                }

                // Inform user that OCR data is available
                if (extractedDate || extractedNumber) {
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
                    setFormValues(prev => ({
                        ...prev,
                        Doc_date: ocrData.date
                    }));
                    appliedCount++;
                    updates.push('日期');
                    
                    // Clear date error if it exists
                    setFormErrors(prev => ({
                        ...prev,
                        Doc_date: undefined
                    }));
                }
            }

            if (ocrData.number) {
                setFormValues(prev => ({
                    ...prev,
                    Doc_number: ocrData.number
                }));
                appliedCount++;
                updates.push('號碼');
                
                // Clear related errors
                setFormErrors(prev => ({
                    ...prev,
                    Doc_number: undefined
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

            // Process image with OCR
            processImageWithOCR(file);
        } else {
            // 如果用戶取消選擇，恢復使用現有圖片（如果有的話）
            if (existingImage && useExistingImage) {
                setPreviewImage(`fastapi/${existingImage}`);
            }
        }
    };

    // Handle electricity type change
    const handleElectricityTypeChange = (e) => {
        const value = e.target.value;
        
        setFormValues(prev => ({
            ...prev,
            electricity_type: value
        }));
    };

    // Fetch electricity fill data when selectedFill changes
    useEffect(() => {
        const fetchElectricityFillData = async () => {
            if (!selectedFill) return;

            resetStates(); // Reset all states before fetching new data

            try {
                const response = await fetch('http://localhost:8000/ElectricityFill_findone', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ElectricityFill_id: selectedFill }),
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.ElectricityFill && data.ElectricityFill.length > 0) {
                        // Populate form with fetched data
                        const fillData = data.ElectricityFill[0];
                        setFormValues({
                            Doc_date: fillData?.Doc_date || '',
                            Doc_number: fillData?.Doc_number || '',
                            period_start: fillData?.period_start || '',
                            period_end: fillData?.period_end || '',
                            electricity_type: String(fillData?.electricity_type) || '1',
                            usage: fillData?.usage || '',
                            amount: fillData?.amount || '',
                            carbon_emission: fillData?.carbon_emission || '',
                            remark: fillData?.remark || '',
                            image: null, // Don't set file object here, just track path
                        });

                        if (fillData?.img_path) {
                            // Store existing image path
                            setExistingImage(fillData.img_path);
                            // Set preview with full URL path
                            setPreviewImage(`fastapi/${fillData.img_path}`);
                            setUseExistingImage(true);
                        }
                        
                        // Check if the loaded date is within valid range
                        if (fillData?.Doc_date && cfvStartDate && cfvEndDate) {
                            if (fillData.Doc_date < cfvStartDate || fillData.Doc_date > cfvEndDate) {
                                showFormAlert(`注意：此記錄的日期 (${fillData.Doc_date}) 不在當前有效範圍內`, 'warning');
                            }
                        }
                    } else {
                        console.error('No fill record data found');
                        showFormAlert('找不到填充記錄資料', 'danger');
                    }
                } else {
                    console.error('Error fetching fill record data:', await response.text());
                    showFormAlert('擷取資料時發生錯誤，請重試', 'danger');
                }
            } catch (error) {
                console.error('Error fetching fill record data:', error);
                showFormAlert('擷取資料時發生錯誤，請重試', 'danger');
            }
        };

        if (isEditFillModalVisible && selectedFill) {
            fetchElectricityFillData();
        }
    }, [selectedFill, isEditFillModalVisible, resetStates, cfvStartDate, cfvEndDate]);

    // Validate the form
    const validateForm = () => {
        const errors = {};

        if (!formValues.Doc_date) {
            errors.Doc_date = '請輸入發票/收據日期';
        } else if (cfvStartDate && cfvEndDate && (formValues.Doc_date < cfvStartDate || formValues.Doc_date > cfvEndDate)) {
            errors.Doc_date = `日期必須在 ${cfvStartDate} 至 ${cfvEndDate} 之間`;
        }
        
        if (!formValues.Doc_number) errors.Doc_number = '請輸入發票號碼/收據編號';
        if (!formValues.period_start) errors.period_start = '請選擇用電期間(起)';
        if (!formValues.period_end) errors.period_end = '請選擇用電期間(迄)';
        if (!formValues.image && !existingImage) errors.image = '請上傳圖片';
        
        // Validate based on electricity type
        if (formValues.electricity_type === '1') {
            if (!formValues.usage) errors.usage = '請輸入當月總用電量';
            if (formValues.usage && parseFloat(formValues.usage) < 0) {
                errors.usage = '用電量不能為負數';
            }
        } else if (formValues.electricity_type === '2') {
            if (!formValues.amount) errors.amount = '請輸入當月總金額';
            if (formValues.amount && parseFloat(formValues.amount) < 0) {
                errors.amount = '金額不能為負數';
            }
        }

        // Validate carbon emission (optional field but must be non-negative if provided)
        if (formValues.carbon_emission && parseFloat(formValues.carbon_emission) < 0) {
            errors.carbon_emission = '碳排量不能為負數';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form input changes
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormValues((prev) => ({ ...prev, [id]: value }));

        // Special validation for date field
        if (id === 'Doc_date') {
            if (cfvStartDate && cfvEndDate && (value < cfvStartDate || value > cfvEndDate)) {
                setFormErrors(prev => ({
                    ...prev,
                    Doc_date: `日期必須在 ${cfvStartDate} 至 ${cfvEndDate} 之間`
                }));
            } else {
                setFormErrors(prev => ({
                    ...prev,
                    Doc_date: undefined
                }));
            }
            
            // Check if OCR date matches
            if (ocrData.date && value !== ocrData.date) {
                showFormAlert(`輸入的日期 (${value}) 與偵測結果 (${ocrData.date}) 不符`, 'warning');
            }
        }
        // Clear validation errors for other fields
        else if (formErrors[id]) {
            setFormErrors(prev => ({
                ...prev,
                [id]: undefined
            }));
            
            // Check for invoice number mismatches if OCR data exists
            if (id === 'Doc_number' && ocrData.number && value !== ocrData.number) {
                showFormAlert(`輸入的號碼 (${value}) 與偵測結果 (${ocrData.number}) 不符`, 'warning');
            }
        }
    };

    // Handle form submission
    const handleEditSubmit = async (e) => {
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
            showFormAlert('正在提交資料...', 'info');

            const form = new FormData();
            // Convert selectedFill to integer if it's a string
            form.append("usage_id", parseInt(selectedFill, 10));
            form.append("user_id", window.sessionStorage.getItem('user_id'));
            form.append("date", formValues.Doc_date);
            form.append("number", formValues.Doc_number);
            form.append("start", formValues.period_start);
            form.append("end", formValues.period_end);
            form.append("electricity_type", formValues.electricity_type);
            form.append("usage", formValues.usage || '0');
            form.append("amount", formValues.amount || '0');
            form.append("carbon_emission", formValues.carbon_emission || '0');
            form.append("remark", formValues.remark || ""); // Ensure empty string if null

            // Handle image upload
            if (formValues.image) {
                // Only append image if a new one was selected
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

            // Add better debugging info
            console.log("Form data being sent:");
            for (let [key, value] of form.entries()) {
                // For File objects, print useful info
                if (value instanceof File) {
                    console.log(`${key}: File object (name: ${value.name}, size: ${value.size}, type: ${value.type})`);
                } else {
                    console.log(`${key}: ${value}`);
                }
            }

            console.log("Submitting to:", 'http://localhost:8000/edit_ElectricityUsage');

            const response = await fetch('http://localhost:8000/edit_ElectricityUsage', {
                method: 'POST',
                body: form, // Send FormData directly
            });

            const data = await response.json();
            if (response.ok && data.status === "success") {
                // Close modal first
                setEditFillModalVisible(false);

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
                showFormAlert(data.message || "更新用電記錄失敗。", "danger");
            }
        } catch (error) {
            console.error("更新用電記錄時發生錯誤:", error);
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
            visible={isEditFillModalVisible}
            onClose={handleClose}
            aria-labelledby="ElectricityFillModalLabel"
            size="xl"
            className={styles.modal}
        >
            <CModalHeader>
                <CModalTitle id="ElectricityFillModalLabel">
                    <b>編輯電力使用量記錄</b>
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
                                <CFormLabel htmlFor="Doc_date" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    發票/收據日期*
                                </CFormLabel>
                                <CCol>
                                    <CFormInput
                                        className={styles.addinput}
                                        type="date"
                                        id="Doc_date"
                                        value={formValues.Doc_date}
                                        onChange={handleChange}
                                        invalid={!!formErrors.Doc_date}
                                        min={cfvStartDate}
                                        max={cfvEndDate}
                                    />
                                    {formErrors.Doc_date && (
                                        <div className="invalid-feedback">{formErrors.Doc_date}</div>
                                    )}
                                    {cfvStartDate && cfvEndDate && (
                                        <div className="form-text">
                                            有效日期範圍: {cfvStartDate} 至 {cfvEndDate}
                                        </div>
                                    )}
                                    {formValues.Doc_date && cfvStartDate && cfvEndDate &&
                                     (formValues.Doc_date < cfvStartDate || formValues.Doc_date > cfvEndDate) && (
                                        <div className="text-danger mt-1">
                                            <strong>注意：此記錄的日期 ({formValues.Doc_date}) 不在當前有效範圍內</strong>
                                        </div>
                                    )}
                                </CCol>
                            </CRow>
                            
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="Doc_number" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    發票號碼/收據編號*
                                </CFormLabel>
                                <CCol>
                                    <CFormInput
                                        className={styles.addinput}
                                        type="text"
                                        id="Doc_number"
                                        value={formValues.Doc_number}
                                        onChange={handleChange}
                                        invalid={!!formErrors.Doc_number}
                                    />
                                    {formErrors.Doc_number && (
                                        <div className="invalid-feedback">{formErrors.Doc_number}</div>
                                    )}
                                </CCol>
                            </CRow>
                            
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="period_start" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    用電期間(起)*
                                </CFormLabel>
                                <CCol>
                                    <CFormInput
                                        className={styles.addinput}
                                        type="date"
                                        id="period_start"
                                        value={formValues.period_start}
                                        onChange={handleChange}
                                        invalid={!!formErrors.period_start}
                                    />
                                    {formErrors.period_start && (
                                        <div className="invalid-feedback">{formErrors.period_start}</div>
                                    )}
                                </CCol>
                            </CRow>
                            
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="period_end" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    用電期間(迄)*
                                </CFormLabel>
                                <CCol>
                                    <CFormInput
                                        className={styles.addinput}
                                        type="date"
                                        id="period_end"
                                        value={formValues.period_end}
                                        onChange={handleChange}
                                        invalid={!!formErrors.period_end}
                                    />
                                    {formErrors.period_end && (
                                        <div className="invalid-feedback">{formErrors.period_end}</div>
                                    )}
                                </CCol>
                            </CRow>
                            
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="electricity_type" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    填寫類型*
                                    <span className={styles.Note}> 選擇填寫請以*用電度數*作為優先填寫項目</span>
                                </CFormLabel>
                                <CCol>
                                    <CFormSelect
                                        aria-label="填寫類型選擇"
                                        id="electricity_type"
                                        className={styles.addinput}
                                        value={formValues.electricity_type}
                                        onChange={handleElectricityTypeChange}
                                    >
                                        <option value="1">用電度數</option>
                                        <option value="2">用電金額</option>
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                            
                            {formValues.electricity_type === '1' && (
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
                                            value={formValues.usage}
                                            onChange={handleChange}
                                            invalid={!!formErrors.usage}
                                            placeholder="請輸入用電度數"
                                        />
                                        {formErrors.usage && (
                                            <div className="invalid-feedback">{formErrors.usage}</div>
                                        )}
                                    </CCol>
                                </CRow>
                            )}
                            
                            {formValues.electricity_type === '2' && (
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
                                            value={formValues.amount}
                                            onChange={handleChange}
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
                                        value={formValues.carbon_emission}
                                        onChange={handleChange}
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
                                        value={formValues.remark}
                                        onChange={handleChange}
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
                                <div>
                                    偵測日期: {ocrData.date || '尚未偵測'}
                                    {ocrData.date && formValues.Doc_date && ocrData.date !== formValues.Doc_date && (
                                        <span className="text-danger ms-2">
                                            (發票日期與偵測不符)
                                        </span>
                                    )}
                                </div>
                                <div>
                                    偵測號碼: {ocrData.number || '尚未偵測'}
                                    {ocrData.number && formValues.Doc_number && ocrData.number !== formValues.Doc_number && (
                                        <span className="text-danger ms-2">
                                            (發票號碼與偵測不符)
                                        </span>
                                    )}
                                </div>
                                {!ocrData.date && !ocrData.number && existingImage && (
                                    <div>已載入現有圖片。如需OCR檢查，請上傳新圖片。</div>
                                )}
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
                                    <li>如有上傳新圖片，系統會自動偵測日期和發票號碼</li>
                                    <li>請上傳發票或收據的圖片作為證明</li>
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

export default EditFillModal;