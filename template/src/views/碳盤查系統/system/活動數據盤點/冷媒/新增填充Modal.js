import React, { useState, useEffect } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CButton, CFormLabel, CFormInput,
    CFormTextarea, CRow, CCol, CFormSelect, CForm, CCollapse, CCard, CCardBody, CAlert
} from '@coreui/react';
import styles from '../../../../../scss/活動數據盤點.module.css';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { useRefreshData } from '../refreshdata';


const AddFillModal = ({
    isAddFillModalVisible,
    setAddFillModalVisible,
    selectedRefId,
    refreshRefrigerantData, // Add this prop for data refresh
    setCurrentFunction,
    setCurrentTitle
}) => {

    const localRefreshData = useRefreshData();

    // State for date restrictions
    const [cfvStartDate, setCfvStartDate] = useState('');
    const [cfvEndDate, setCfvEndDate] = useState('');

    // Single form data state object
    const [formData, setFormData] = useState({
        date: '',
        num: '',
        usage: '',
        percent: '',
        remark: '',
        image: null
    });

    // OCR and validation states
    const [ocrData, setOcrData] = useState({
        date: '',
        num: ''
    });

    const [validation, setValidation] = useState({
        isDateCorrect: true,
        isNumCorrect: true,
        dateErrorMessage: '',
        numErrorMessage: '',
        formErrors: {}
    });

    // UI states
    const [previewImage, setPreviewImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertColor, setAlertColor] = useState('danger');
    const [collapseVisible, setCollapseVisible] = useState(false);

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

    // Clean up resources when modal closes
    useEffect(() => {
        return () => {
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    // Reset form data when modal opens/closes
    useEffect(() => {
        if (!isAddFillModalVisible) {
            resetForm();
        }
    }, [isAddFillModalVisible]);

    const resetForm = () => {
        setFormData({
            date: '',
            num: '',
            usage: '',
            percent: '',
            remark: '',
            image: null
        });
        setOcrData({
            date: '',
            num: ''
        });
        setValidation({
            isDateCorrect: true,
            isNumCorrect: true,
            dateErrorMessage: '',
            numErrorMessage: '',
            formErrors: {}
        });
        if (previewImage) {
            URL.revokeObjectURL(previewImage);
        }
        setPreviewImage(null);
        setShowAlert(false);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));

        // Special validation for date field
        if (id === 'date') {
            if (cfvStartDate && cfvEndDate && (value < cfvStartDate || value > cfvEndDate)) {
                setValidation(prev => ({
                    ...prev,
                    formErrors: {
                        ...prev.formErrors,
                        date: `日期必須在 ${cfvStartDate} 至 ${cfvEndDate} 之間`
                    }
                }));
            } else {
                setValidation(prev => ({
                    ...prev,
                    formErrors: {
                        ...prev.formErrors,
                        date: undefined
                    }
                }));
            }
            
            // Check if OCR values match the new input
            if (ocrData.date) {
                const isMatch = value === ocrData.date;
                setValidation(prev => ({
                    ...prev,
                    isDateCorrect: isMatch,
                    dateErrorMessage: isMatch ? '' : '日期不正確'
                }));
            }
        } 
        // Clear validation errors for other fields
        else {
            setValidation(prev => ({
                ...prev,
                formErrors: {
                    ...prev.formErrors,
                    [id]: undefined
                }
            }));
            
            // Check if OCR num matches the new input
            if (id === 'num' && ocrData.num) {
                const isMatch = value === ocrData.num;
                setValidation(prev => ({
                    ...prev,
                    isNumCorrect: isMatch,
                    numErrorMessage: isMatch ? '' : '發票號碼不正確'
                }));
            }
        }
    };

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

        // Create new preview and update form data
        const previewUrl = URL.createObjectURL(file);
        setPreviewImage(previewUrl);
        setFormData(prev => ({
            ...prev,
            image: file
        }));

        // Process image with OCR
        processImageWithOCR(file);
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
                
                // Extract and clean OCR results
                let extractedDate = '';
                let extractedNum = '';

                if (data.response_content && Array.isArray(data.response_content)) {
                    if (data.response_content[0]) {
                        extractedDate = String(data.response_content[0])
                            .replace(/[\[\]'"]/g, '')
                            .trim();
                    }
                    if (data.response_content[1]) {
                        extractedNum = String(data.response_content[1])
                            .replace(/[\[\]'"]/g, '')
                            .trim();
                    }
                }

                // Update OCR data
                setOcrData({
                    date: extractedDate,
                    num: extractedNum
                });

                // Check if current form values match OCR results
                const isDateMatch = formData.date === extractedDate;
                const isNumMatch = formData.num === extractedNum;

                setValidation(prev => ({
                    ...prev,
                    isDateCorrect: isDateMatch,
                    isNumCorrect: isNumMatch,
                    dateErrorMessage: isDateMatch ? '' : '日期不正確',
                    numErrorMessage: isNumMatch ? '' : '發票號碼不正確'
                }));

                // Check if the detected date is within valid range
                if (extractedDate && cfvStartDate && cfvEndDate) {
                    if (extractedDate < cfvStartDate || extractedDate > cfvEndDate) {
                        showFormAlert(`偵測到的日期 (${extractedDate}) 不在有效範圍內，請確認`, 'warning');
                    } else {
                        showFormAlert('圖片處理完成', 'success');
                    }
                } else {
                    showFormAlert('圖片處理完成', 'success');
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

        if (ocrData.date || ocrData.num) {
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
                    setValidation(prev => ({
                        ...prev,
                        isDateCorrect: true,
                        dateErrorMessage: '',
                        formErrors: {
                            ...prev.formErrors,
                            date: undefined
                        }
                    }));
                }
            }

            if (ocrData.num) {
                setFormData(prev => ({
                    ...prev,
                    num: ocrData.num
                }));
                appliedCount++;
                updates.push('號碼');
                
                // Clear number error
                setValidation(prev => ({
                    ...prev,
                    isNumCorrect: true,
                    numErrorMessage: '',
                    formErrors: {
                        ...prev.formErrors,
                        num: undefined
                    }
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

    const validateForm = () => {
        const errors = {};

        // Required fields validation
        if (!formData.date) {
            errors.date = '請輸入日期';
        } else if (cfvStartDate && cfvEndDate && (formData.date < cfvStartDate || formData.date > cfvEndDate)) {
            errors.date = `日期必須在 ${cfvStartDate} 至 ${cfvEndDate} 之間`;
        }
        
        if (!formData.num) errors.num = '請輸入發票號碼/收據編號';
        if (!formData.usage) errors.usage = '請輸入填充量';
        if (!formData.percent) errors.percent = '請輸入逸散率';
        if (!formData.image) errors.image = '請上傳圖片';

        setValidation(prev => ({
            ...prev,
            formErrors: errors
        }));

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
            console.warn("No valid refrigerant refresh function found");
            return false;
        } catch (error) {
            console.error("Error refreshing refrigerant data:", error);
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent multiple submissions
        if (isSubmitting) return;

        // Validate form
        if (!validateForm()) {
            showFormAlert('請填寫所有必填欄位，並確保日期在有效範圍內', 'danger');
            return;
        }

        setIsSubmitting(true);

        const formDataToSend = new FormData();
        formDataToSend.append('user_id', window.sessionStorage.getItem('user_id') || '1');
        formDataToSend.append('refrigerant_id', selectedRefId);
        formDataToSend.append('Doc_date', formData.date);
        formDataToSend.append('Doc_number', formData.num);
        formDataToSend.append('usage', formData.usage);
        formDataToSend.append('escape_rate', formData.percent);
        formDataToSend.append('remark', formData.remark);
        formDataToSend.append('image', formData.image);

        try {
            const res = await fetch('http://localhost:8000/insert_RefFill', {
                method: 'POST',
                body: formDataToSend,
            });

            if (res.ok) {
                console.log('✅ Form submitted successfully!');

                // Close modal first to prevent UI issues
                setAddFillModalVisible(false);

                // Wait a moment before refreshing data
                setTimeout(async () => {
                    const refreshed = await safeRefresh();

                    if (refreshed) {
                        alert("資料提交成功！");
                    } else {
                        alert("資料已提交，請手動刷新頁面。");
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

    const showFormAlert = (message, color, outsideModal = false) => {
        if (outsideModal) {
            // For alerts outside the modal (after closing)
            alert(message);
        } else {
            // For alerts inside the modal
            setAlertMessage(message);
            setAlertColor(color);
            setShowAlert(true);

            // Auto hide after 5 seconds
            setTimeout(() => {
                setShowAlert(false);
            }, 5000);
        }
    };

    const closeModal = () => {
        setAddFillModalVisible(false);
    };

    return (
        <CModal
            backdrop="static"
            visible={isAddFillModalVisible}
            onClose={closeModal}
            aria-labelledby="ActivityModalLabel"
            size="xl"
        >
            <CModalHeader>
                <h5><b>新增填充紀錄</b></h5>
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
                                        min={cfvStartDate}
                                        max={cfvEndDate}
                                    />
                                    {validation.formErrors.date && (
                                        <div className="invalid-feedback">{validation.formErrors.date}</div>
                                    )}
                                    {cfvStartDate && cfvEndDate && (
                                        <div className="form-text">
                                            有效日期範圍: {cfvStartDate} 至 {cfvEndDate}
                                        </div>
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
                                    />
                                    {validation.formErrors.num && (
                                        <div className="invalid-feedback">{validation.formErrors.num}</div>
                                    )}
                                </CCol>
                            </CRow>

                            <CRow className="mb-3">
                                <CFormLabel htmlFor="usage" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    填充量*
                                </CFormLabel>
                                <CCol>
                                    <CFormInput
                                        className={styles.addinput}
                                        type="number"
                                        id="usage"
                                        value={formData.usage}
                                        onChange={handleInputChange}
                                        invalid={!!validation.formErrors.usage}
                                    />
                                    {validation.formErrors.usage && (
                                        <div className="invalid-feedback">{validation.formErrors.usage}</div>
                                    )}
                                </CCol>
                            </CRow>

                            <CRow className="mb-3">
                                <CFormLabel htmlFor="percent" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    逸散率*<br />
                                    <span
                                        className={styles.Note2}
                                        onClick={() => setCollapseVisible(!collapseVisible)}
                                    >
                                        逸散率(%)建議表格
                                    </span>
                                </CFormLabel>
                                <CCol>
                                    <CFormInput
                                        className={styles.addinput}
                                        type="number"
                                        min="0"
                                        id="percent"
                                        value={formData.percent}
                                        onChange={handleInputChange}
                                        invalid={!!validation.formErrors.percent}
                                    />
                                    {validation.formErrors.percent && (
                                        <div className="invalid-feedback">{validation.formErrors.percent}</div>
                                    )}
                                </CCol>
                                <CCollapse visible={collapseVisible}>
                                    <CCard className="mt-3">
                                        <CCardBody>
                                            <img src='/src/assets/images/逸散率建議表格.png' alt="逸散率建議表格" />
                                        </CCardBody>
                                    </CCard>
                                </CCollapse>
                            </CRow>

                            <CRow className="mb-3">
                                <CFormLabel htmlFor="remark" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    備註
                                </CFormLabel>
                                <CCol>
                                    <CFormTextarea
                                        className={styles.addinput}
                                        id="remark"
                                        value={formData.remark}
                                        onChange={handleInputChange}
                                        rows={3}
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
                                        invalid={!!validation.formErrors.image}
                                        accept="image/*"
                                    />
                                    {validation.formErrors.image && (
                                        <div className="invalid-feedback">{validation.formErrors.image}</div>
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
                                <div>
                                    偵測日期: {ocrData.date || '尚未偵測'}
                                    {ocrData.date && formData.date && ocrData.date !== formData.date && (
                                        <span className="text-danger ms-2">
                                            (發票日期與偵測不符)
                                        </span>
                                    )}
                                </div>
                                <div>
                                    偵測號碼: {ocrData.num || '尚未偵測'}
                                    {ocrData.num && formData.num && ocrData.num !== formData.num && (
                                        <span className="text-danger ms-2">
                                            (發票號碼與偵測不符)
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            <CFormLabel className={styles.addlabel}>
                                填表說明
                            </CFormLabel>
                            <div className={styles.infoBlock || 'p-3 border'}>
                                <ul className="mb-0">
                                    <li>所有帶有 * 的欄位為必填項目</li>
                                    <li>發票/收據日期必須在規定的基準期間內</li>
                                    <li>填充量和逸散率必須為正數</li>
                                    <li>可點擊「逸散率(%)建議表格」查看建議值</li>
                                    <li>請上傳相關佐證文件的圖片</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </CModalBody>

                <CModalFooter>
                    <CButton
                        className="modalbutton1"
                        onClick={closeModal}
                        disabled={isSubmitting}
                        type="button"
                    >
                        取消
                    </CButton>
                    <CButton
                        className="modalbutton2"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? '儲存中...' : '新增'}
                    </CButton>
                </CModalFooter>
            </CForm>
        </CModal>
    );
};

export default AddFillModal;