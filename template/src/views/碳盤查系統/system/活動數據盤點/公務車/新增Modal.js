import React, { useState, useEffect, useCallback } from 'react';
import {
  CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CButton, CFormLabel, 
  CFormInput, CFormTextarea, CRow, CCol, CForm, CAlert, CFormSelect
} from '@coreui/react';
import styles from '../../../../../scss/活動數據盤點.module.css';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { useRefreshData } from '../refreshdata';

export const VehicleAdd = ({ 
    isAddModalVisible, 
    setAddModalVisible,
    refreshVehicleData, 
    setCurrentFunction,
    setCurrentTitle
}) => {
    // Create a local refresh instance as backup
    const localRefreshData = useRefreshData();
    
    // Form state with default values
    const defaultFormData = {
        date: '',
        number: '',
        oil_species: '1', // Default to diesel (柴油) since it works
        unit: '1', // Default to liters
        quantity: '',
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
        if (!formData.quantity) errors.quantity = '請輸入公升數/金額';
        if (!formData.image) errors.image = '請上傳圖片';
        
        // Validate numeric fields to ensure they're non-negative
        if (formData.quantity && parseFloat(formData.quantity) < 0) {
            errors.quantity = '數值不能為負數';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Safe refresh function that tries multiple approaches
    const safeRefresh = async () => {
      console.log("Attempting to refresh vehicle data...");
      try {
          // First try the prop passed from parent (most reliable)
          if (typeof refreshVehicleData === 'function') {
              console.log("Using refreshVehicleData from props");
              await refreshVehicleData();
              return true;
          } 
          // Then try our local refresh
          else if (localRefreshData && typeof localRefreshData.refreshVehicleData === 'function') {
              console.log("Using localRefreshData.refreshVehicleData");
              await localRefreshData.refreshVehicleData();
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
            formDataToSend.append("date", formData.date);
            formDataToSend.append("number", formData.number);
            // Convert oil_species to integer
            formDataToSend.append("oil_species", parseInt(formData.oil_species, 10));
            // Ensure liters is a number
            formDataToSend.append("liters", parseFloat(formData.quantity));
            formDataToSend.append("remark", formData.remark || "");
            
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
                date: formDataToSend.get("date"),
                number: formDataToSend.get("number"),
                oil_species: formDataToSend.get("oil_species"),
                liters: formDataToSend.get("liters"),
                remark: formDataToSend.get("remark"),
                image: formDataToSend.get("image") ? "File attached" : "No file"
            });
            
            const res = await fetch("http://localhost:8000/insert_vehicle", {
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
                        setCurrentFunction("Vehicle");
                    }
                    
                    if (typeof setCurrentTitle === 'function') {
                        setCurrentTitle("公務車");
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
            visible={isAddModalVisible}
            onClose={handleClose}
            aria-labelledby="VehicleModalLabel"
            size="xl"
        >
            <CModalHeader>
                <CModalTitle id="VehicleModalLabel"><b>新增車輛用油紀錄</b></CModalTitle>
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
                                <CFormLabel htmlFor="oil_species" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    油種*
                                </CFormLabel>
                                <CCol>
                                    <CFormSelect 
                                        className={styles.addinput} 
                                        id="oil_species" 
                                        value={formData.oil_species}
                                        onChange={handleInputChange}
                                    >
                                        <option value="1">柴油</option>
                                        <option value="0">汽油</option>
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                            
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="unit" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    單位*
                                    <span className={styles.Note}> 選擇單位請以*公升*做為優先填寫項目</span>
                                </CFormLabel>
                                <CCol>
                                    <CFormSelect 
                                        className={styles.addinput} 
                                        id="unit" 
                                        value={formData.unit}
                                        onChange={handleInputChange}
                                    >
                                        <option value="1">公升</option>
                                        <option value="2">金額</option>
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                            
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="quantity" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    公升數/金額*
                                </CFormLabel>
                                <CCol>
                                    <CFormInput 
                                        className={styles.addinput} 
                                        type="number" 
                                        min="0" 
                                        step="0.01"
                                        id="quantity" 
                                        value={formData.quantity}
                                        onChange={handleInputChange}
                                        invalid={!!formErrors.quantity}
                                        placeholder="請輸入數值"
                                    />
                                    {formErrors.quantity && (
                                        <div className="invalid-feedback">{formErrors.quantity}</div>
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
                                    <li>油種選擇汽油或柴油</li>
                                    <li>單位請以公升為優先填寫項目</li>
                                    <li>請上傳車輛用油相關發票或收據的圖片</li>
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

export default VehicleAdd;