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
    selectedEmployee,
    refreshEmployeeData,
    setCurrentFunction,
    setCurrentTitle
}) => {
    // Create a local refresh instance as backup
    const localRefreshData = useRefreshData();
    const [previewImage, setPreviewImage] = useState(null); // State for image preview
    const [existingImage, setExistingImage] = useState(null); // State to track if there's an existing image
    const [useExistingImage, setUseExistingImage] = useState(true); // Track if using existing image
    const [formValues, setFormValues] = useState({
        period_date: '',
        employee_number: '',
        daily_hours: '',
        workday: '',
        overtime: '',
        sick_leave: '',
        personal_leave: '',
        business_trip: '',
        wedding_and_funeral: '',
        special_leave: '',
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
            period_date: '',
            employee_number: '',
            daily_hours: '',
            workday: '',
            overtime: '',
            sick_leave: '',
            personal_leave: '',
            business_trip: '',
            wedding_and_funeral: '',
            special_leave: '',
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
                console.log("Using localRefreshEmployeeData");
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

    // Fetch employee data when selectedEmployee changes
    useEffect(() => {
        const fetchEmployeeData = async () => {
            if (!selectedEmployee) return;

            resetStates(); // Reset all states before fetching new data

            try {
                const response = await fetch('http://localhost:8000/employee_findone', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ Employee_id: selectedEmployee }),
                });
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.employees && data.employees.length > 0) {
                        // Populate form with fetched data
                        const employee = data.employees[0];
                        setFormValues({
                            period_date: employee?.period_date || '',
                            employee_number: employee?.employee_number || '',
                            daily_hours: employee?.daily_hours || '',
                            workday: employee?.workday || '',
                            overtime: employee?.overtime || '',
                            sick_leave: employee?.sick_leave || '',
                            personal_leave: employee?.personal_leave || '',
                            business_trip: employee?.business_trip || '',
                            wedding_and_funeral: employee?.wedding_and_funeral || '',
                            special_leave: employee?.special_leave || '',
                            remark: employee?.remark || '',
                            image: null, // Don't set file object here, just track path
                        });

                        if (employee?.img_path) {
                            // Store existing image path
                            setExistingImage(employee.img_path);
                            // Set preview with full URL path
                            setPreviewImage(`fastapi/${employee.img_path}`);
                            setUseExistingImage(true);
                        }
                    } else {
                        console.error('No employee data found');
                        showFormAlert('找不到員工資料', 'danger');
                    }
                } else {
                    console.error('Error fetching employee data:', await response.text());
                    showFormAlert('擷取資料時發生錯誤，請重試', 'danger');
                }
            } catch (error) {
                console.error('Error fetching employee data:', error);
                showFormAlert('擷取資料時發生錯誤，請重試', 'danger');
            }
        };

        if (isEditModalVisible && selectedEmployee) {
            fetchEmployeeData();
        }
    }, [selectedEmployee, isEditModalVisible, resetStates]);

    // Validate the form
    const validateForm = () => {
        const errors = {};

        if (!formValues.period_date) errors.period_date = '請選擇月份';
        if (!formValues.employee_number) errors.employee_number = '請輸入員工數';
        if (!formValues.daily_hours) errors.daily_hours = '請輸入每日工時';
        if (!formValues.workday) errors.workday = '請輸入每月工作日數';
        if (!formValues.image && !existingImage) errors.image = '請上傳圖片';

        // Validate numeric fields to ensure they're non-negative
        const numericFields = [
            'employee_number', 'daily_hours', 'workday', 'overtime', 
            'sick_leave', 'personal_leave', 'business_trip', 
            'wedding_and_funeral', 'special_leave'
        ];
        
        numericFields.forEach(field => {
            if (formValues[field] && parseFloat(formValues[field]) < 0) {
                errors[field] = '數值不能為負數';
            }
        });

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
            form.append("employee_id", selectedEmployee);
            form.append("user_id", window.sessionStorage.getItem('user_id'));
            form.append("month", formValues.period_date);
            form.append("employee", formValues.employee_number);
            form.append("daily_hours", formValues.daily_hours);
            form.append("workday", formValues.workday);
            form.append("overtime", formValues.overtime);
            form.append("sick", formValues.sick_leave);
            form.append("personal", formValues.personal_leave);
            form.append("business", formValues.business_trip);
            form.append("funeral", formValues.wedding_and_funeral);
            form.append("special", formValues.special_leave);
            form.append("explain", formValues.remark);

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

            const response = await fetch('http://localhost:8000/edit_employee', {
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
                        setCurrentFunction("Employee");
                    }

                    if (typeof setCurrentTitle === 'function') {
                        setCurrentTitle("工作時數(員工)");
                    }

                    if (refreshSuccessful) {
                        alert("資料提交成功！");
                    } else {
                        alert("資料已提交，但無法自動刷新頁面。請手動刷新。");
                    }
                }, 500);
            } else {
                showFormAlert(data.message || "更新員工記錄失敗。", "danger");
            }
        } catch (error) {
            console.error("更新員工記錄時發生錯誤:", error);
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
            aria-labelledby="EmployeeModalLabel"
            size="xl"
            className={styles.modal}
        >
            <CModalHeader>
                <CModalTitle id="EmployeeModalLabel">
                    <b>編輯數據-工作時數(員工)</b>
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
                                <CFormLabel htmlFor="period_date" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    月份*
                                </CFormLabel>
                                <CCol>
                                    <CFormInput
                                        className={styles.addinput}
                                        type="month"
                                        id="period_date"
                                        value={formValues.period_date}
                                        onChange={handleChange}
                                        invalid={!!formErrors.period_date}
                                    />
                                    {formErrors.period_date && (
                                        <div className="invalid-feedback">{formErrors.period_date}</div>
                                    )}
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="employee_number" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    員工數*
                                </CFormLabel>
                                <CCol>
                                    <CFormInput
                                        className={styles.addinput}
                                        type="number"
                                        min="0"
                                        id="employee_number"
                                        value={formValues.employee_number}
                                        onChange={handleChange}
                                        invalid={!!formErrors.employee_number}
                                    />
                                    {formErrors.employee_number && (
                                        <div className="invalid-feedback">{formErrors.employee_number}</div>
                                    )}
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="daily_hours" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    每日工時*<br /><span className={styles.Note}>不含休息時間</span>
                                </CFormLabel>
                                <CCol>
                                    <CFormInput
                                        className={styles.addinput}
                                        type="number"
                                        min="0"
                                        id="daily_hours"
                                        value={formValues.daily_hours}
                                        onChange={handleChange}
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
                                        value={formValues.workday}
                                        onChange={handleChange}
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
                                        id="overtime"
                                        value={formValues.overtime}
                                        onChange={handleChange}
                                        invalid={!!formErrors.overtime}
                                    />
                                    {formErrors.overtime && (
                                        <div className="invalid-feedback">{formErrors.overtime}</div>
                                    )}
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="sick_leave" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    總病假時數
                                </CFormLabel>
                                <CCol>
                                    <CFormInput
                                        className={styles.addinput}
                                        type="number"
                                        min="0"
                                        id="sick_leave"
                                        value={formValues.sick_leave}
                                        onChange={handleChange}
                                        invalid={!!formErrors.sick_leave}
                                    />
                                    {formErrors.sick_leave && (
                                        <div className="invalid-feedback">{formErrors.sick_leave}</div>
                                    )}
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="personal_leave" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    總事假時數
                                </CFormLabel>
                                <CCol>
                                    <CFormInput
                                        className={styles.addinput}
                                        type="number"
                                        min="0"
                                        id="personal_leave"
                                        value={formValues.personal_leave}
                                        onChange={handleChange}
                                        invalid={!!formErrors.personal_leave}
                                    />
                                    {formErrors.personal_leave && (
                                        <div className="invalid-feedback">{formErrors.personal_leave}</div>
                                    )}
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="business_trip" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    總出差時數
                                </CFormLabel>
                                <CCol>
                                    <CFormInput
                                        className={styles.addinput}
                                        type="number"
                                        min="0"
                                        id="business_trip"
                                        value={formValues.business_trip}
                                        onChange={handleChange}
                                        invalid={!!formErrors.business_trip}
                                    />
                                    {formErrors.business_trip && (
                                        <div className="invalid-feedback">{formErrors.business_trip}</div>
                                    )}
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="wedding_and_funeral" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    總婚喪時數
                                </CFormLabel>
                                <CCol>
                                    <CFormInput
                                        className={styles.addinput}
                                        type="number"
                                        min="0"
                                        id="wedding_and_funeral"
                                        value={formValues.wedding_and_funeral}
                                        onChange={handleChange}
                                        invalid={!!formErrors.wedding_and_funeral}
                                    />
                                    {formErrors.wedding_and_funeral && (
                                        <div className="invalid-feedback">{formErrors.wedding_and_funeral}</div>
                                    )}
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="special_leave" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    總特休時數
                                </CFormLabel>
                                <CCol>
                                    <CFormInput
                                        className={styles.addinput}
                                        type="number"
                                        min="0"
                                        id="special_leave"
                                        value={formValues.special_leave}
                                        onChange={handleChange}
                                        invalid={!!formErrors.special_leave}
                                    />
                                    {formErrors.special_leave && (
                                        <div className="invalid-feedback">{formErrors.special_leave}</div>
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
                                    <li>每日工時不含休息時間</li>
                                    <li>數值不能為負數</li>
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