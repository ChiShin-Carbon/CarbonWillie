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
    selectedGenerator,
    refreshEmergency_GeneratorData,
    setCurrentFunction,
    setCurrentTitle
}) => {
    // Create a local refresh instance as backup
    const localRefreshData = useRefreshData();
    const [generator, setGenerator] = useState([]); // State to hold fetched generator data
    const [previewImage, setPreviewImage] = useState(null); // State for image preview
    const [existingImage, setExistingImage] = useState(null); // State to track if there's an existing image
    const [useExistingImage, setUseExistingImage] = useState(true); // Track if using existing image
    const [formValues, setFormValues] = useState({
        date: '',
        num: '',
        usage: '',
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
            date: '',
            num: '',
            usage: '',
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
        console.log("Attempting to refresh generator data...");
        try {
            // First try the prop passed from parent
            if (typeof refreshEmergency_GeneratorData === 'function') {
                console.log("Using refreshEmergency_GeneratorData from props");
                await refreshEmergency_GeneratorData();
                return true;
            }
            // Then try our local refresh
            else if (localRefreshData && typeof localRefreshData.refreshEmergency_GeneratorData === 'function') {
                console.log("Using localrefreshEmergency_GeneratorData");
                await localRefreshData.refreshEmergency_GeneratorData();
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
                if (extractedDate && extractedDate !== formValues.date) {
                    showFormAlert(`偵測的日期 (${extractedDate}) 與表單日期 (${formValues.date}) 不符`, 'warning');
                }
                
                if (extractedNumber && extractedNumber !== formValues.num) {
                    showFormAlert(`偵測的號碼 (${extractedNumber}) 與表單號碼 (${formValues.num}) 不符`, 'warning');
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
                setFormValues(prev => ({
                    ...prev,
                    date: ocrData.date
                }));
                appliedCount++;
                updates.push('日期');
            }

            if (ocrData.number) {
                setFormValues(prev => ({
                    ...prev,
                    num: ocrData.number
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

    // Fetch generator data when selectedGenerator changes
    useEffect(() => {
        const fetchGeneratorData = async () => {
            if (!selectedGenerator) return;

            resetStates(); // Reset all states before fetching new data

            try {
                const response = await fetch('http://localhost:8000/Emergency_Generator_findone', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ EG_id: selectedGenerator }),
                });
                const data = await response.json();
                if (response.ok && data.Emergency_Generator && data.Emergency_Generator.length > 0) {
                    setGenerator(data.Emergency_Generator); // Store full generator data
                    
                    // Populate form with fetched data
                    const generatorData = data.Emergency_Generator[0];
                    setFormValues({
                        date: generatorData?.Doc_date || '',
                        num: generatorData?.Doc_number || '',
                        usage: generatorData?.usage || '',
                        remark: generatorData?.remark || '',
                        image: null, // Don't set file object here, just track path
                    });

                    if (generatorData?.img_path) {
                        // Store existing image path
                        setExistingImage(generatorData.img_path);
                        // Set preview with full URL path
                        setPreviewImage(`fastapi/${generatorData.img_path}`);
                        setUseExistingImage(true);
                    }
                } else {
                    console.error(`Error ${response.status}: ${data.detail || 'No data found'}`);
                    showFormAlert('無法取得緊急發電機資料', 'danger');
                }
            } catch (error) {
                console.error('Error fetching generator data:', error);
                showFormAlert('擷取資料時發生錯誤，請重試', 'danger');
            }
        };

        if (isEditModalVisible && selectedGenerator) {
            fetchGeneratorData();
        }
    }, [selectedGenerator, isEditModalVisible, resetStates]);

    // Validate the form
    const validateForm = () => {
        const errors = {};

        if (!formValues.date) errors.date = '請選擇日期';
        if (!formValues.num) errors.num = '請輸入發票號碼/收據編號';
        if (!formValues.usage) errors.usage = '請輸入使用量';
        if (!formValues.image && !existingImage) errors.image = '請上傳圖片';

        // Validate numeric fields to ensure they're non-negative
        if (formValues.usage && parseFloat(formValues.usage) < 0) {
            errors.usage = '數值不能為負數';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

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
            form.append("generator_id", selectedGenerator);
            form.append("user_id", window.sessionStorage.getItem('user_id'));
            form.append("date", formValues.date);
            form.append("number", formValues.num);
            form.append("usage", formValues.usage);
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

            const response = await fetch('http://localhost:8000/edit_emergency', {
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
                        setCurrentFunction("Emergency");
                    }

                    if (typeof setCurrentTitle === 'function') {
                        setCurrentTitle("緊急發電機");
                    }

                    if (refreshSuccessful) {
                        alert("資料提交成功！");
                    } else {
                        alert("資料已提交，但無法自動刷新頁面。請手動刷新。");
                    }
                }, 500);
            } else {
                showFormAlert(data.message || "更新發電機記錄失敗。", "danger");
            }
        } catch (error) {
            console.error("更新發電機記錄時發生錯誤:", error);
            showFormAlert(`提交時發生錯誤: ${error.message}`, "danger");
        } finally {
            setIsSubmitting(false);
        }
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

        // Check for date or invoice number mismatches if OCR data exists
        if (id === 'date' && ocrData.date && value !== ocrData.date) {
            showFormAlert(`輸入的日期 (${value}) 與偵測結果 (${ocrData.date}) 不符`, 'warning');
        }

        if (id === 'num' && ocrData.number && value !== ocrData.number) {
            showFormAlert(`輸入的號碼 (${value}) 與偵測結果 (${ocrData.number}) 不符`, 'warning');
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
            aria-labelledby="GeneratorModalLabel"
            size="xl"
            className={styles.modal}
        >
            <CModalHeader>
                <CModalTitle id="GeneratorModalLabel">
                    <b>編輯數據-緊急發電機</b>
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
                                <CFormLabel htmlFor="date" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    發票/收據日期*
                                </CFormLabel>
                                <CCol>
                                    <CFormInput
                                        className={styles.addinput}
                                        type="date"
                                        id="date"
                                        value={formValues.date}
                                        onChange={handleChange}
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
                                        value={formValues.num}
                                        onChange={handleChange}
                                        invalid={!!formErrors.num}
                                    />
                                    {formErrors.num && (
                                        <div className="invalid-feedback">{formErrors.num}</div>
                                    )}
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
                                        id="usage"
                                        min="0"
                                        step="0.01"
                                        value={formValues.usage}
                                        onChange={handleChange}
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
                                    <li>使用量應為正數</li>
                                    <li>單位為公升(L)</li>
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

export default EditModal;