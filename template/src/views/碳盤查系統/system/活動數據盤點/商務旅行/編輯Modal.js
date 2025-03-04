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
    selectedbusiness,
    refreshBusinessTripData,
    setCurrentFunction,
    setCurrentTitle
}) => {
    // Create a local refresh instance as backup
    const localRefreshData = useRefreshData();
    const [transportType, setTransportType] = useState("1"); // Default to car
    const [previewImage, setPreviewImage] = useState(null); // State for image preview
    const [existingImage, setExistingImage] = useState(null); // State to track if there's an existing image
    const [useExistingImage, setUseExistingImage] = useState(true); // Track if using existing image
    const [formValues, setFormValues] = useState({
        transportation: '1',
        oil_species: '0',
        kilometer: '',
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
            transportation: '1',
            oil_species: '0',
            kilometer: '',
            remark: '',
            image: null,
        });
        setTransportType("1");
    }, []);

    // Handle closing the modal
    const handleClose = () => {
        setEditModalVisible(false);
        resetStates();
    };

    // Safe refresh function that tries multiple approaches
    const safeRefresh = async () => {
        console.log("Attempting to refresh business trip data...");
        try {
            // First try the prop passed from parent
            if (typeof refreshBusinessTripData === 'function') {
                console.log("Using refreshBusinessTripData from props");
                await refreshBusinessTripData();
                return true;
            }
            // Then try our local refresh
            else if (localRefreshData && typeof localRefreshData.refreshBusinessTripData === 'function') {
                console.log("Using localRefreshBusinessTripData");
                await localRefreshData.refreshBusinessTripData();
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
            setUseExistingImage(false); // When selecting a new image, don't use existing image
        } else {
            // If user cancels selection, revert to existing image (if available)
            if (existingImage && useExistingImage) {
                setPreviewImage(`fastapi/${existingImage}`);
            }
        }
    };

    // Fetch business trip data when selectedbusiness changes
    useEffect(() => {
        const fetchBusinessData = async () => {
            if (!selectedbusiness) return;

            resetStates(); // Reset all states before fetching new data

            try {
                const response = await fetch('http://localhost:8000/Business_Trip_findone', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ BT_id: selectedbusiness }),
                });
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.Business_Trip && data.Business_Trip.length > 0) {
                        // Populate form with fetched data
                        const business = data.Business_Trip[0];
                        const transportValue = business?.transportation?.toString() || '1';
                        
                        // Log raw data for debugging
                        console.log("Raw business trip data:", business);
                        console.log("Raw oil_species value:", business.oil_species);
                        console.log("Type of oil_species:", typeof business.oil_species);
                        
                        // Convert oil_species to string to ensure consistent handling
                        // If it's a boolean, convert true to "1" and false to "0"
                        let oilSpeciesValue;
                        if (typeof business.oil_species === 'boolean') {
                            oilSpeciesValue = business.oil_species ? "1" : "0";
                            console.log("Converting boolean to string:", oilSpeciesValue);
                        } else {
                            // Ensure we have a string value (could be number or string)
                            oilSpeciesValue = business.oil_species?.toString() || "0";
                            console.log("Converting to string:", oilSpeciesValue);
                        }
                        
                        setFormValues({
                            transportation: transportValue,
                            oil_species: oilSpeciesValue,
                            kilometer: business?.kilometer?.toString() || '',
                            remark: business?.remark || '',
                            image: null, // Don't set file object here, just track path
                        });
                        
                        console.log("Final oil_species value set:", oilSpeciesValue);
                        
                        // Update transport type state
                        setTransportType(transportValue);

                        if (business?.img_path) {
                            // Store existing image path
                            setExistingImage(business.img_path);
                            // Set preview with full URL path
                            setPreviewImage(`fastapi/${business.img_path}`);
                            setUseExistingImage(true);
                        }
                    } else {
                        console.error('No business trip data found');
                        showFormAlert('找不到商務旅行資料', 'danger');
                    }
                } else {
                    console.error('Error fetching business trip data:', await response.text());
                    showFormAlert('擷取資料時發生錯誤，請重試', 'danger');
                }
            } catch (error) {
                console.error('Error fetching business trip data:', error);
                showFormAlert('擷取資料時發生錯誤，請重試', 'danger');
            }
        };

        if (isEditModalVisible && selectedbusiness) {
            fetchBusinessData();
        }
    }, [selectedbusiness, isEditModalVisible, resetStates]);

    // Validate the form
    const validateForm = () => {
        const errors = {};

        if (!formValues.transportation) errors.transportation = '請選擇交通方式';
        
        // Only validate oil_species if transportation is car or motorcycle
        if ((transportType === "1" || transportType === "2") && !formValues.oil_species) {
            errors.oil_species = '請選擇油種';
        }
        
        if (!formValues.kilometer) {
            errors.kilometer = '請輸入公里數';
        } else if (parseFloat(formValues.kilometer) < 0) {
            errors.kilometer = '公里數不能為負數';
        }
        
        if (!formValues.image && !existingImage) errors.image = '請上傳圖片';

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
            form.append("businesstrip_id", selectedbusiness);
            form.append("user_id", window.sessionStorage.getItem('user_id') || "1");
            form.append("transportation", parseInt(formValues.transportation, 10));
            form.append("oil_species", parseInt(formValues.oil_species, 10)); // Ensure it's a number (0 or 1)
            form.append("kilometers", parseFloat(formValues.kilometer));
            form.append("remark", formValues.remark || "");

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

            const response = await fetch('http://localhost:8000/edit_BusinessTrip', {
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
                        setCurrentFunction("BusinessTrip");
                    }

                    if (typeof setCurrentTitle === 'function') {
                        setCurrentTitle("商務旅行");
                    }

                    if (refreshSuccessful) {
                        alert("資料提交成功！");
                    } else {
                        alert("資料已提交，但無法自動刷新頁面。請手動刷新。");
                    }
                }, 500);
            } else {
                showFormAlert(data.message || "更新商務旅行記錄失敗。", "danger");
            }
        } catch (error) {
            console.error("更新商務旅行記錄時發生錯誤:", error);
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
            aria-labelledby="BusinessTripModalLabel"
            size="xl"
            className={styles.modal}
        >
            <CModalHeader>
                <CModalTitle id="BusinessTripModalLabel">
                    <b>編輯數據-商務旅行</b>
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
                                <CFormLabel htmlFor="transportation" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    交通方式*
                                </CFormLabel>
                                <CCol>
                                    <CFormSelect
                                        id="transportation"
                                        className={styles.addinput}
                                        value={formValues.transportation}
                                        onChange={(e) => {
                                            setTransportType(e.target.value);
                                            handleChange(e);
                                        }}
                                        invalid={!!formErrors.transportation}
                                    >
                                        <option value="1">汽車</option>
                                        <option value="2">機車</option>
                                        <option value="3">公車</option>
                                        <option value="4">捷運</option>
                                        <option value="5">火車</option>
                                        <option value="6">高鐵</option>
                                        <option value="7">客運</option>
                                        <option value="8">飛機</option>
                                        <option value="9">輪船</option>
                                    </CFormSelect>
                                    {formErrors.transportation && (
                                        <div className="invalid-feedback">{formErrors.transportation}</div>
                                    )}
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="oil_species" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    油種*<span className={styles.Note}>僅汽/機車須填寫</span>
                                </CFormLabel>
                                <CCol>
                                    <CFormSelect
                                        id="oil_species"
                                        className={styles.addinput}
                                        value={formValues.oil_species}
                                        onChange={handleChange}
                                        disabled={!(transportType === "1" || transportType === "2")}
                                        invalid={!!formErrors.oil_species}
                                    >
                                        <option value="0">汽油</option>
                                        <option value="1">柴油</option>
                                    </CFormSelect>
                                    {formErrors.oil_species && (
                                        <div className="invalid-feedback">{formErrors.oil_species}</div>
                                    )}
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="kilometer" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    公里數*
                                </CFormLabel>
                                <CCol>
                                    <CFormInput
                                        className={styles.addinput}
                                        type="number"
                                        id="kilometer"
                                        min="0"
                                        step="0.01"
                                        value={formValues.kilometer}
                                        onChange={handleChange}
                                        invalid={!!formErrors.kilometer}
                                        placeholder="請輸入數值"
                                    />
                                    {formErrors.kilometer && (
                                        <div className="invalid-feedback">{formErrors.kilometer}</div>
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
                                    <li>僅汽車和機車需要選擇油種</li>
                                    <li>公里數應為正數</li>
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