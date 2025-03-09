import React, { useState, useEffect, useCallback } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CFormSelect, CForm, CCollapse, CCard, CCardBody, CModalTitle, CAlert
} from '@coreui/react';
import styles from '../../../../../scss/活動數據盤點.module.css';

import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

import { useRefreshData } from '../refreshdata';

const EditFillModal = ({ 
    isEditFillModalVisible, 
    setEditFillModalVisible, 
    selectedFillId,
    refreshRefrigerantData,
    setCurrentFunction,
    setCurrentTitle
}) => {
    // Create a local refresh instance as backup
    const localRefreshData = useRefreshData();
    
    // State for date restrictions
    const [cfvStartDate, setCfvStartDate] = useState('');
    const [cfvEndDate, setCfvEndDate] = useState('');
    
    const [collapseVisible, setCollapseVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState(null); // State for image preview
    const [existingImage, setExistingImage] = useState(null); // State to track if there's an existing image
    const [useExistingImage, setUseExistingImage] = useState(true); // Track if using existing image
    const [formValues, setFormValues] = useState({
        Doc_date: '',
        Doc_number: '',
        usage: '',
        escape_rate: '',
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
            usage: '',
            escape_rate: '',
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
        console.log("Attempting to refresh refrigerant fill data...");
        try {
            // First try the prop passed from parent
            if (typeof refreshRefrigerantData === 'function') {
                console.log("Using refreshRefrigerantData from props");
                await refreshRefrigerantData();
                return true;
            }
            // Then try our local refresh
            else if (localRefreshData && typeof localRefreshData.refreshRefrigerantData === 'function') {
                console.log("Using localrefreshRefrigerantData");
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

                // Check if the OCR data matches current form values
                if (extractedDate && extractedDate !== formValues.Doc_date) {
                    showFormAlert(`偵測的日期 (${extractedDate}) 與表單日期 (${formValues.Doc_date}) 不符`, 'warning');
                }
                
                // Check if extracted date is within valid range
                if (extractedDate && cfvStartDate && cfvEndDate) {
                    if (extractedDate < cfvStartDate || extractedDate > cfvEndDate) {
                        showFormAlert(`偵測到的日期 (${extractedDate}) 不在有效範圍內，請確認`, 'warning');
                    }
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
                    
                    // Clear date error
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
                
                // Clear number error
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

    // Fetch refrigerant fill data when selectedFillId changes
    useEffect(() => {
        const fetchRefrigerantFillData = async () => {
            if (!selectedFillId) return;

            resetStates(); // Reset all states before fetching new data

            try {
                const response = await fetch('http://localhost:8000/RefFill_findone', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ Fill_id: selectedFillId }),
                });
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.RefFill && data.RefFill.length > 0) {
                        // Populate form with fetched data
                        const refrigerantFill = data.RefFill[0];
                        setFormValues({
                            Doc_date: refrigerantFill?.Doc_date || '',
                            Doc_number: refrigerantFill?.Doc_number || '',
                            usage: refrigerantFill?.usage || '',
                            escape_rate: refrigerantFill?.escape_rate || '',
                            remark: refrigerantFill?.remark || '',
                            image: null, // Don't set file object here, just track path
                        });

                        if (refrigerantFill?.img_path) {
                            // Store existing image path
                            setExistingImage(refrigerantFill.img_path);
                            // Set preview with full URL path
                            setPreviewImage(`fastapi/${refrigerantFill.img_path}`);
                            setUseExistingImage(true);
                        }
                        
                        // Check if the loaded date is within valid range
                        if (refrigerantFill?.Doc_date && cfvStartDate && cfvEndDate) {
                            if (refrigerantFill.Doc_date < cfvStartDate || refrigerantFill.Doc_date > cfvEndDate) {
                                showFormAlert(`注意：此記錄的日期 (${refrigerantFill.Doc_date}) 不在當前有效範圍內`, 'warning');
                            }
                        }
                    } else {
                        console.error('No refrigerant fill data found');
                        showFormAlert('找不到冷媒填充資料', 'danger');
                    }
                } else {
                    console.error('Error fetching refrigerant fill data:', await response.text());
                    showFormAlert('擷取資料時發生錯誤，請重試', 'danger');
                }
            } catch (error) {
                console.error('Error fetching refrigerant fill data:', error);
                showFormAlert('擷取資料時發生錯誤，請重試', 'danger');
            }
        };

        if (isEditFillModalVisible && selectedFillId) {
            fetchRefrigerantFillData();
        }
    }, [selectedFillId, isEditFillModalVisible, resetStates, cfvStartDate, cfvEndDate]);

    // Validate the form
    const validateForm = () => {
        const errors = {};

        if (!formValues.Doc_date) {
            errors.Doc_date = '請輸入發票/收據日期';
        } else if (cfvStartDate && cfvEndDate && (formValues.Doc_date < cfvStartDate || formValues.Doc_date > cfvEndDate)) {
            errors.Doc_date = `日期必須在 ${cfvStartDate} 至 ${cfvEndDate} 之間`;
        }
        
        if (!formValues.Doc_number) errors.Doc_number = '請輸入發票號碼/收據編號';
        if (!formValues.usage || formValues.usage <= 0) errors.usage = '請輸入有效的填充量';
        if (!formValues.escape_rate || formValues.escape_rate < 0) errors.escape_rate = '請輸入有效的逸散率';
        if (!formValues.image && !existingImage) errors.image = '請上傳圖片';

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
            
            // Check if OCR values match the new input
            if (ocrData.date && value !== ocrData.date) {
                showFormAlert(`輸入的日期 (${value}) 與偵測結果 (${ocrData.date}) 不符`, 'warning');
            }
        } 
        // Clear validation errors for other fields
        else {
            if (formErrors[id]) {
                setFormErrors(prev => ({
                    ...prev,
                    [id]: undefined
                }));
            }
            
            // Check if OCR number matches
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
            form.append("fillrec_id", selectedFillId);
            form.append("user_id", window.sessionStorage.getItem('user_id'));
            form.append("Doc_date", formValues.Doc_date);
            form.append("Doc_number", formValues.Doc_number);
            form.append("usage", formValues.usage);
            form.append("escape_rate", formValues.escape_rate);
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

            const response = await fetch('http://localhost:8000/edit_RefFill', {
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
                        setCurrentFunction("RefrigerantFill");
                    }

                    if (typeof setCurrentTitle === 'function') {
                        setCurrentTitle("冷媒填充記錄");
                    }

                    if (refreshSuccessful) {
                        alert("資料提交成功！");
                    } else {
                        alert("資料已提交，但無法自動刷新頁面。請手動刷新。");
                    }
                }, 500);
            } else {
                showFormAlert(data.message || "更新冷媒填充記錄失敗。", "danger");
            }
        } catch (error) {
            console.error("更新冷媒填充記錄時發生錯誤:", error);
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
            aria-labelledby="RefrigerantFillModalLabel"
            size="xl"
            className={styles.modal}
        >
            <CModalHeader>
                <CModalTitle id="RefrigerantFillModalLabel">
                    <b>編輯填充紀錄</b>
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
                                <CFormLabel htmlFor="usage" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    填充量*
                                </CFormLabel>
                                <CCol>
                                    <CFormInput
                                        className={styles.addinput}
                                        type="number"
                                        id="usage"
                                        min="0.01"
                                        step="0.01"
                                        value={formValues.usage}
                                        onChange={handleChange}
                                        invalid={!!formErrors.usage}
                                    />
                                    {formErrors.usage && (
                                        <div className="invalid-feedback">{formErrors.usage}</div>
                                    )}
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="escape_rate" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    逸散率<br />
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
                                        step="0.01"
                                        id="escape_rate"
                                        value={formValues.escape_rate}
                                        onChange={handleChange}
                                        invalid={!!formErrors.escape_rate}
                                    />
                                    {formErrors.escape_rate && (
                                        <div className="invalid-feedback">{formErrors.escape_rate}</div>
                                    )}
                                </CCol>
                                <CCollapse visible={collapseVisible}>
                                    <CCard className="mt-3">
                                        <CCardBody>
                                            <img 
                                                src="/src/assets/images/逸散率建議表格.png" 
                                                alt="逸散率建議表格"
                                                style={{ maxWidth: '100%' }}
                                            />
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
                                    <li>發票/收據日期必須在規定的基準期間內</li>
                                    <li>填充量必須大於 0</li>
                                    <li>逸散率必須大於或等於 0</li>
                                    <li>點擊「逸散率(%)建議表格」可查看相關參考資料</li>
                                    <li>如有上傳新圖片，系統會自動偵測日期和發票號碼</li>
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