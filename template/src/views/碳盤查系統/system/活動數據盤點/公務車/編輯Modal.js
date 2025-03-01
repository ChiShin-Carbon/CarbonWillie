import React, { useState, useEffect } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CFormSelect, CForm
    , CModalTitle
} from '@coreui/react';
import styles from '../../../../../scss/活動數據盤點.module.css';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const EditModal = ({ isEditModalVisible, setEditModalVisible, selectedVehicleId }) => {
    const [vehicles, setVehicles] = useState([]); // State to hold fetched vehicle data
    const [previewImage, setPreviewImage] = useState(null); // State for image preview
    const [existingImage, setExistingImage] = useState(null); // State to track if there's an existing image
    const [formValues, setFormValues] = useState({
        date: '',
        num: '',
        type: '',
        quantity: '',
        explain: '',
        image: null,
    });

    const [C1date, setC1date] = useState('');
    const [C1num, setC1num] = useState('');
    const [dateincorrectmessage, setDateincorrectmessage] = useState('');
    const [numincorrectmessage, setNumincorrectmessage] = useState('');
    const [isdatecorrect, setIsdatecorrect] = useState(true);
    const [isnumcorrect, setIsnumcorrect] = useState(true);

    // Reset states when modal closes or opens
    const resetStates = () => {
        setPreviewImage(null);
        setExistingImage(null);
        setC1date('');
        setC1num('');
        setDateincorrectmessage('');
        setNumincorrectmessage('');
        setIsdatecorrect(true);
        setIsnumcorrect(true);
        setFormValues({
            date: '',
            num: '',
            type: '',
            quantity: '',
            explain: '',
            image: null,
        });
    };

    // Handle closing the modal
    const handleClose = () => {
        setEditModalVisible(false);
        resetStates();
    };

    const handleC1image = async (e) => {
        e.preventDefault();
    
        const imageElement = document.getElementById('image');
    
        if (!imageElement || !imageElement.files || imageElement.files.length === 0) {
          console.error('Form elements or image files not found');
          return;
        }
    
        const formData = new FormData();
        formData.append('image', imageElement.files[0]);
    
        try {
          const res = await fetch('http://localhost:8000/ocrapi', {
            method: 'POST',
            body: formData,
          });
    
          if (res.ok) {
            const data = await res.json();
            setC1date(data.response_content[0]);
            setC1num(data.response_content[1]);
            console.log('Data submitted successfully');
    
            if (data.response_content[0] !== document.getElementById('date').value) {
              setIsdatecorrect(false);
              setDateincorrectmessage('日期不正確');
            } else {
              setIsdatecorrect(true);
              setDateincorrectmessage('');
            }
    
            if (data.response_content[1] !== document.getElementById('num').value) {
              setIsnumcorrect(false);
              setNumincorrectmessage('發票號碼不正確');
            } else {
              setIsnumcorrect(true);
              setNumincorrectmessage('');
            }
    
          } else {
            console.error('Failed to submit data');
          }
        } catch (error) {
          console.error('Error submitting data', error);
        }
    };


    // Handle image change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setPreviewImage(previewUrl);
            setFormValues((prev) => ({ ...prev, image: file }));
            setUseExistingImage(false); // 選擇新圖片時，不使用現有圖片
            
            // Trigger OCR after image is selected
            setTimeout(() => {
                handleC1image(e);
            }, 100);
        } else {
            // 如果用戶取消選擇，恢復使用現有圖片（如果有的話）
            if (existingImage && useExistingImage) {
                setPreviewImage(`http://localhost:8000/fastapi/${existingImage}`);
            }
        }
    };
    // Fetch vehicle data when selectedVehicleId changes
    useEffect(() => {
        const fetchVehicleData = async () => {
            if (!selectedVehicleId) return;
            
            resetStates(); // Reset all states before fetching new data
            
            try {
                const response = await fetch('http://localhost:8000/vehicle_findone', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ vehicle_id: selectedVehicleId }),
                });
                const data = await response.json();
                if (response.ok && data.length > 0) {
                    setVehicles(data); // Assuming the response contains vehicle details
                    // Populate form with fetched data
                    const vehicle = data[0];
                    setFormValues({
                        date: vehicle?.Doc_date || '',
                        num: vehicle?.Doc_number || '',
                        type: vehicle?.oil_species ? '1' : '2', // Map to options
                        quantity: vehicle?.liters || '',
                        explain: vehicle?.remark || '',
                        image: null, // Don't set file object here, just track path
                    });
                    
                    if (vehicle?.img_path) {
                        // Store existing image path
                        setExistingImage(vehicle.img_path);
                        // Set preview with full URL path
                        setPreviewImage(`fastapi/${vehicle.img_path}`);
                    }
                } else {
                    console.error(`Error ${response.status}: ${data.detail || 'No data found'}`);
                }
            } catch (error) {
                console.error('Error fetching vehicle data:', error);
            }
        };

        if (isEditModalVisible && selectedVehicleId) {
            fetchVehicleData();
        }
    }, [selectedVehicleId, isEditModalVisible]);

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        if (!formValues.date || !formValues.num || !formValues.type || !formValues.quantity) {
            alert("請填寫所有必填欄位。");
            return;
        }

        const form = new FormData();
        form.append("vehicle_id", selectedVehicleId);
        form.append("user_id", window.sessionStorage.getItem('user_id'));
        form.append("date", formValues.date);
        form.append("number", formValues.num);
        form.append("oil_species", formValues.type);
        form.append("liters", formValues.quantity);
        form.append("remark", formValues.explain);
        
        // Only append image if a new one was selected
        if (formValues.image) {
            form.append("image", formValues.image);
        } else if (existingImage) {
            // Let backend know we're keeping existing image
            form.append("existing_image", existingImage);
        }

        try {
            const response = await fetch('http://localhost:8000/edit_vehicle', {
                method: 'POST',
                body: form, // Send FormData directly
            });

            const data = await response.json();
            if (response.ok && data.status === "success") {
                alert("車輛記錄已成功更新！");
                handleClose();
            } else {
                alert(data.message || "更新車輛記錄失敗。");
            }
        } catch (error) {
            console.error("更新車輛記錄時發生錯誤:", error);
            alert("更新車輛記錄時發生錯誤。");
        }
    };

    // Handle form input changes
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormValues((prev) => ({ ...prev, [id]: value }));
        
        // Check for date or invoice number mismatches if OCR data exists
        if (id === 'date' && C1date) {
            if (value !== C1date) {
                setIsdatecorrect(false);
                setDateincorrectmessage('日期不正確');
            } else {
                setIsdatecorrect(true);
                setDateincorrectmessage('');
            }
        }
        
        if (id === 'num' && C1num) {
            if (value !== C1num) {
                setIsnumcorrect(false);
                setNumincorrectmessage('發票號碼不正確');
            } else {
                setIsnumcorrect(true);
                setNumincorrectmessage('');
            }
        }
    };

    return (
        <CModal
            backdrop="static"
            visible={isEditModalVisible}
            onClose={handleClose}
            aria-labelledby="ActivityModalLabel"
            size="xl"
            className={styles.modal}
        >
            <CModalHeader>
                <CModalTitle id="ActivityModalLabel">
                    <h5><b>編輯數據-公務車</b></h5>
                </CModalTitle>
            </CModalHeader>
            <CForm onSubmit={handleEditSubmit}>
                <CModalBody>
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
                                        required
                                    />
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
                                        required
                                    />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="type" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    油種*
                                </CFormLabel>
                                <CCol>
                                    <CFormSelect
                                        id="type"
                                        className={styles.addinput}
                                        value={formValues.type}
                                        onChange={handleChange}
                                    >
                                        <option value="1">汽油</option>
                                        <option value="2">柴油</option>
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="quantity" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    公升數
                                </CFormLabel>
                                <CCol>
                                    <CFormInput
                                        className={styles.addinput}
                                        type="number"
                                        id="quantity"
                                        min="0"
                                        value={formValues.quantity}
                                        onChange={handleChange}
                                        required
                                    />
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
                                        value={formValues.explain}
                                        onChange={handleChange}
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
                                        // Only require if no existing image
                                        required={!existingImage} 
                                    />
                                    {existingImage && (
                                        <div className="mt-2 text-muted">
                                            已有上傳圖片。如需更改，請選擇新圖片。
                                        </div>
                                    )}
                                </CCol>
                            </CRow>
                            <br />
                            <div style={{ textAlign: 'center' }}>*為必填欄位</div>
                        </div>
                        <div className={styles.modalRight}>
                            <CFormLabel className={`col-sm-2 col-form-label ${styles.addlabel}`} >
                                圖片預覽
                            </CFormLabel>
                            <div className={styles.imgBlock}>
                                {previewImage && (
                                    <Zoom>
                                        <img 
                                            src={previewImage} 
                                            alt="預覽圖片" 
                                            style={{ maxWidth: '100%', maxHeight: '250px', objectFit: 'contain' }}
                                        />
                                    </Zoom>
                                )}
                            </div>

                            <CFormLabel className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                偵測錯誤提醒
                            </CFormLabel>
                            <div className={styles.errorMSG}>
                                {C1date && (
                                    <>
                                        偵測日期: {C1date} <span style={{color: 'red'}}>{dateincorrectmessage}</span><br />
                                    </>
                                )}
                                {C1num && (
                                    <>
                                        偵測號碼: {C1num} <span style={{color: 'red'}}>{numincorrectmessage}</span>
                                    </>
                                )}
                                {!C1date && !C1num && existingImage && (
                                    <span>已載入現有圖片。如需OCR檢查，請上傳新圖片。</span>
                                )}
                            </div>
                        </div>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton className="modalbutton1" onClick={handleClose}>
                        取消
                    </CButton>
                    <CButton className="modalbutton2" type="submit">
                        儲存
                    </CButton>
                </CModalFooter>
            </CForm>
        </CModal>
    );
};

export default EditModal;