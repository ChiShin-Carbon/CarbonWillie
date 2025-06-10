import React, { useState, useEffect } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CButton, CFormLabel, 
    CFormInput, CFormTextarea, CRow, CCol, CFormSelect, CForm, CAlert
} from '@coreui/react';
import styles from '../../../../../scss/活動數據盤點.module.css';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { useRefreshData } from '../refreshdata';

export const EmployeeAdd = ({
    isAddModalVisible,
    setAddModalVisible,
    refreshEmployeeData,
    setCurrentFunction,
    setCurrentTitle
}) => {
    // Create a local refresh instance as backup
    const localRefreshData = useRefreshData();
    
    // State for date restrictions
    const [cfvStartDate, setCfvStartDate] = useState('');
    const [cfvEndDate, setCfvEndDate] = useState('');
    
    // Computed min/max month values (YYYY-MM format)
    const [minMonth, setMinMonth] = useState('');
    const [maxMonth, setMaxMonth] = useState('');
    
    // Form state
    const [formData, setFormData] = useState({
        month: '',
        employee: '',
        daily_hours: '',
        workday: '',
        overtime: '',
        sick: '',
        personal: '',
        business: '',
        funeral: '',
        special: '',
        explain: '',
        image: null
    });

    // UI states
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertColor, setAlertColor] = useState('danger');
    const [formErrors, setFormErrors] = useState({});

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
                const startDate = data.baseline.cfv_start_date;
                const endDate = data.baseline.cfv_end_date;
                
                setCfvStartDate(startDate);
                setCfvEndDate(endDate);
                
                // Convert dates to YYYY-MM format for month input
                // Extract just the year and month parts from the date strings
                if (startDate && endDate) {
                    const startParts = startDate.split('-');
                    const endParts = endDate.split('-');
                    
                    if (startParts.length >= 2 && endParts.length >= 2) {
                        const startYearMonth = `${startParts[0]}-${startParts[1]}`;
                        const endYearMonth = `${endParts[0]}-${endParts[1]}`;
                        
                        setMinMonth(startYearMonth);
                        setMaxMonth(endYearMonth);
                    }
                }
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

    const resetForm = () => {
        setFormData({
            month: '',
            employee: '',
            daily_hours: '',
            workday: '',
            overtime: '',
            sick: '',
            personal: '',
            business: '',
            funeral: '',
            special: '',
            explain: '',
            image: null
        });
        
        if (previewImage) {
            URL.revokeObjectURL(previewImage);
            setPreviewImage(null);
        }
        
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
        
        // Special validation for month field
        if (id === 'month') {
            if (minMonth && maxMonth && (value < minMonth || value > maxMonth)) {
                setFormErrors(prev => ({
                    ...prev,
                    month: `月份必須在 ${minMonth} 至 ${maxMonth} 之間`
                }));
            } else {
                setFormErrors(prev => ({
                    ...prev,
                    month: undefined
                }));
            }
        }
        // Clear validation error for other fields
        else if (formErrors[id]) {
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
        
        if (!formData.month) {
            errors.month = '請選擇月份';
        } else if (minMonth && maxMonth && (formData.month < minMonth || formData.month > maxMonth)) {
            errors.month = `月份必須在 ${minMonth} 至 ${maxMonth} 之間`;
        }
        
        if (!formData.employee) errors.employee = '請輸入員工數';
        if (!formData.daily_hours) errors.daily_hours = '請輸入每日工時';
        if (!formData.workday) errors.workday = '請輸入每月工作日數';
        if (!formData.image) errors.image = '請上傳圖片';
        
        // Validate numeric fields to ensure they're non-negative
        const numericFields = ['employee', 'daily_hours', 'workday', 'overtime', 'sick', 
                              'personal', 'business', 'funeral', 'special'];
        
        numericFields.forEach(field => {
            if (formData[field] && parseFloat(formData[field]) < 0) {
                errors[field] = '數值不能為負數';
            }
        });
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Safe refresh function that tries multiple approaches
    const safeRefresh = async () => {
        console.log("Attempting to refresh employee data...");
        try {
            // First try the prop passed from parent
            if (typeof refreshEmployeeData === 'function') {
                console.log("Using refreshEmployeeData from props");
                await refreshEmployeeData();
                return true;
            } 
            // Then try our local refresh
            else if (localRefreshData && typeof localRefreshData.refreshEmployeeData === 'function') {
                console.log("Using localRefreshData.refreshEmployeeData");
                await localRefreshData.refreshEmployeeData();
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

    const formatYearMonthDisplay = (yearMonth) => {
        if (!yearMonth) return '';
        const parts = yearMonth.split('-');
        if (parts.length < 2) return yearMonth;
        return `${parts[0]}年${parts[1]}月`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Prevent double submissions
        if (isSubmitting) return;
        
        // Validate form
        if (!validateForm()) {
            showFormAlert('請填寫所有必填欄位，並確保月份在有效範圍內', 'danger');
            return;
        }
        
        setIsSubmitting(true);
    
        try {
            // Prepare form data
            const formDataToSend = new FormData();
            formDataToSend.append("user_id", window.sessionStorage.getItem("user_id"));
            formDataToSend.append("month", formData.month);
            formDataToSend.append("employee_number", formData.employee);
            formDataToSend.append("daily_hours", formData.daily_hours);
            formDataToSend.append("workday", formData.workday);
            formDataToSend.append("overtime", formData.overtime || "0");
            formDataToSend.append("sick", formData.sick || "0");
            formDataToSend.append("personal", formData.personal || "0");
            formDataToSend.append("business", formData.business || "0");
            formDataToSend.append("funeral", formData.funeral || "0");
            formDataToSend.append("special", formData.special || "0");
            formDataToSend.append("explain", formData.explain || "");
            formDataToSend.append("image", formData.image);
    
            // Send form data to the backend
            const res = await fetch("http://localhost:8000/insert_employee", {
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
                        setCurrentFunction("Employee");
                    }
                    
                    if (typeof setCurrentTitle === 'function') {
                        setCurrentTitle("員工工時");
                    }
                    
                    if (refreshSuccessful) {
                        alert("資料提交成功！");
                    } else {
                        alert("資料已提交，但無法自動刷新頁面。請手動刷新。");
                    }
                }, 500);
            } else {
                console.error("❌ Failed to submit form");
                showFormAlert("提交失敗，請重試。", "danger");
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
                <CModalTitle id="ActivityModalLabel"><b>新增數據</b></CModalTitle>
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
                                <CFormLabel htmlFor="month" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    月份*
                                </CFormLabel>
                                <CCol>
                                    <CFormInput 
                                        className={styles.addinput} 
                                        type="month" 
                                        id="month" 
                                        value={formData.month}
                                        onChange={handleInputChange}
                                        invalid={!!formErrors.month}
                                        min={minMonth}
                                        max={maxMonth}
                                    />
                                    {formErrors.month && (
                                        <div className="invalid-feedback">{formErrors.month}</div>
                                    )}
                                    {minMonth && maxMonth && (
                                        <div className="form-text">
                                            有效月份範圍: {formatYearMonthDisplay(minMonth)} 至 {formatYearMonthDisplay(maxMonth)}
                                        </div>
                                    )}
                                </CCol>
                            </CRow>
                            
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="employee" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    員工數*
                                </CFormLabel>
                                <CCol>
                                    <CFormInput 
                                        className={styles.addinput} 
                                        type="number" 
                                        min="0" 
                                        id="employee" 
                                        value={formData.employee}
                                        onChange={handleInputChange}
                                        invalid={!!formErrors.employee}
                                    />
                                    {formErrors.employee && (
                                        <div className="invalid-feedback">{formErrors.employee}</div>
                                    )}
                                </CCol>
                            </CRow>
                            
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="daily_hours" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    每日工時*<br />
                                    <span className={styles.Note}>不含休息時間</span>
                                </CFormLabel>
                                <CCol>
                                    <CFormInput 
                                        className={styles.addinput} 
                                        type="number" 
                                        min="0" 
                                        step="0.5"
                                        id="daily_hours" 
                                        value={formData.daily_hours}
                                        onChange={handleInputChange}
                                        invalid={!!formErrors.daily_hours}
                                    />
                                    {formErrors.daily_hours && (
                                        <div className="invalid-feedback">{formErrors.daily_hours}</div>
                                    )}
                                </CCol>
                            </CRow>
                            
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="workday" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    每月工作日數*
                                </CFormLabel>
                                <CCol>
                                    <CFormInput 
                                        className={styles.addinput} 
                                        type="number" 
                                        min="0" 
                                        id="workday" 
                                        value={formData.workday}
                                        onChange={handleInputChange}
                                        invalid={!!formErrors.workday}
                                    />
                                    {formErrors.workday && (
                                        <div className="invalid-feedback">{formErrors.workday}</div>
                                    )}
                                </CCol>
                            </CRow>
                            
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="overtime" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    總加班時數
                                </CFormLabel>
                                <CCol>
                                    <CFormInput 
                                        className={styles.addinput} 
                                        type="number" 
                                        min="0" 
                                        step="0.5"
                                        id="overtime" 
                                        value={formData.overtime}
                                        onChange={handleInputChange}
                                        invalid={!!formErrors.overtime}
                                    />
                                    {formErrors.overtime && (
                                        <div className="invalid-feedback">{formErrors.overtime}</div>
                                    )}
                                </CCol>
                            </CRow>
                            
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="sick" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    總病假時數
                                </CFormLabel>
                                <CCol>
                                    <CFormInput 
                                        className={styles.addinput} 
                                        type="number" 
                                        min="0" 
                                        step="0.5"
                                        id="sick" 
                                        value={formData.sick}
                                        onChange={handleInputChange}
                                        invalid={!!formErrors.sick}
                                    />
                                    {formErrors.sick && (
                                        <div className="invalid-feedback">{formErrors.sick}</div>
                                    )}
                                </CCol>
                            </CRow>
                            
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="personal" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    總事假時數
                                </CFormLabel>
                                <CCol>
                                    <CFormInput 
                                        className={styles.addinput} 
                                        type="number" 
                                        min="0" 
                                        step="0.5"
                                        id="personal" 
                                        value={formData.personal}
                                        onChange={handleInputChange}
                                        invalid={!!formErrors.personal}
                                    />
                                    {formErrors.personal && (
                                        <div className="invalid-feedback">{formErrors.personal}</div>
                                    )}
                                </CCol>
                            </CRow>
                            
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="business" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    總出差時數
                                </CFormLabel>
                                <CCol>
                                    <CFormInput 
                                        className={styles.addinput} 
                                        type="number" 
                                        min="0" 
                                        step="0.5"
                                        id="business" 
                                        value={formData.business}
                                        onChange={handleInputChange}
                                        invalid={!!formErrors.business}
                                    />
                                    {formErrors.business && (
                                        <div className="invalid-feedback">{formErrors.business}</div>
                                    )}
                                </CCol>
                            </CRow>
                            
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="funeral" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    總婚喪時數
                                </CFormLabel>
                                <CCol>
                                    <CFormInput 
                                        className={styles.addinput} 
                                        type="number" 
                                        min="0" 
                                        step="0.5"
                                        id="funeral" 
                                        value={formData.funeral}
                                        onChange={handleInputChange}
                                        invalid={!!formErrors.funeral}
                                    />
                                    {formErrors.funeral && (
                                        <div className="invalid-feedback">{formErrors.funeral}</div>
                                    )}
                                </CCol>
                            </CRow>
                            
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="special" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    總特休時數
                                </CFormLabel>
                                <CCol>
                                    <CFormInput 
                                        className={styles.addinput} 
                                        type="number" 
                                        min="0" 
                                        step="0.5"
                                        id="special" 
                                        value={formData.special}
                                        onChange={handleInputChange}
                                        invalid={!!formErrors.special}
                                    />
                                    {formErrors.special && (
                                        <div className="invalid-feedback">{formErrors.special}</div>
                                    )}
                                </CCol>
                            </CRow>
                            
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="explain" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
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
                                填表說明
                            </CFormLabel>
                            <div className={styles.infoBlock || 'p-3 border'}>
                                <ul className="mb-0">
                                    <li>所有帶有 * 的欄位為必填項目</li>
                                    <li>月份必須在基準期間的月份範圍內</li>
                                    <li>每日工時指每位員工平均每日工作時數，不含休息時間</li>
                                    <li>每月工作日數不含國定假日與例假日</li>
                                    <li>總加班時數是指所有員工的加班時數總和</li>
                                    <li>其他時數項目皆為所有員工的時數總和</li>
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

export default EmployeeAdd;