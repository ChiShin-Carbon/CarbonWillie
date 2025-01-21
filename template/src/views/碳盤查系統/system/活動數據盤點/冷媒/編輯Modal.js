import React, { useState, useEffect } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CFormSelect, CForm, CCollapse, CCard, CCardBody
} from '@coreui/react';
import styles from '../../../../../scss/活動數據盤點.module.css';

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'


const EditModal = ({ isEditModalVisible, setEditModalVisible, selectedRef }) => {
    const handleClose = () => setEditModalVisible(false);
    const [visible, setVisible] = useState(false)

    const [previewImage, setPreviewImage] = useState(null); // 用來存儲圖片的 
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file); // 創建圖片預覽 URL
            setPreviewImage(previewUrl); // 保存 URL 到狀態
        }
    };

    const [FormValues, setFormValues] = useState({
        device_type: '',
        device_location: '',
        refrigerant_type: '',
        remark: '',
        img_path: '',
    });


    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormValues((prevValues) => ({ ...prevValues, [id]: value }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        const form = new FormData();
        form.append('refrigerant_id', selectedRef);
        form.append('user_id', window.sessionStorage.getItem('user_id'));
        form.append('device_type', FormValues.device_type);
        form.append('device_location', FormValues.device_location);
        form.append('refrigerant_type', FormValues.refrigerant_type);
        form.append('remark', FormValues.remark);
        form.append("image", e.target.image.files[0]); // Assuming the image is selected
        

        for (let [key, value] of form.entries()) {
            console.log(`${key}:`, value); // Debugging output
        }

        try {
            const response = await fetch('http://localhost:8000/edit_Ref', {
                method: 'POST',
                body: form, // Send FormData directly
            });

            const data = await response.json();
            if (response.ok && data.status === "success") {
                alert("Employee record updated successfully!");
                handleClose();
            } else {
                alert(data.message || "Failed to update employee record.");
            }
        } catch (error) {
            console.error("Error updating employee record:", error);
            alert("An error occurred while updating the employee record.");
        }
    };



    useEffect(() => {
        const fetchRefData = async () => {
            if (!selectedRef) return;

            try {
                const response = await fetch('http://localhost:8000/Ref_findone', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ Ref_id: selectedRef }),
                });

                if (response.ok) {
                    const data = await response.json();
                    const RefData = data.Ref[0];
                    setFormValues({
                        device_type: RefData?.device_type || '',
                        device_location: RefData?.device_location || '',
                        refrigerant_type: RefData?.refrigerant_type || '',
                        remark: RefData?.remark || '',
                        img_path: RefData?.img_path || '',
                    });
                    setPreviewImage(ExtinguisherData?.img_path || null);
                } else {
                    console.error('Error fetching Ref data:', await response.text());
                }
            } catch (error) {
                console.error('Error fetching Ref data:', error);
            }
        };

        fetchRefData();
    }, [selectedRef]);

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
                <h5><b>編輯數據-冷媒</b></h5>
            </CModalHeader>
            <CForm onSubmit={handleEditSubmit}>
                <CModalBody>
                    <div className={styles.addmodal}>
                        <div className={styles.modalLeft}>
        
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="type" className={`col-sm-2 col-form-label ${styles.addlabel}`} >設備類型*</CFormLabel>
                                <CCol>
                                    <CFormSelect 
                                    aria-label="Default select example" 
                                    id="device_type" 
                                    className={styles.addinput}
                                    value={FormValues.device_type}
                                    onChange={handleInputChange}
                                     >
                                        <option value="1">冰箱</option>
                                        <option value="2">冷氣機</option>
                                        <option value="3">飲水機</option>
                                        <option value="4">冰水主機</option>
                                        <option value="5">空壓機</option>
                                        <option value="6">除濕機</option>
                                        <option value="7">車用冷媒</option>
                                        <option value="8">製冰機</option>
                                        <option value="9">冰櫃</option>
                                        <option value="10">冷凍櫃</option>
                                        <option value="11">其他</option>
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="site" className={`col-sm-2 col-form-label ${styles.addlabel}`} >設備位置*</CFormLabel>
                                <CCol>
                                    <CFormInput 
                                    className={styles.addinput} 
                                    type="text" 
                                    id="device_location" 
                                    value={FormValues.device_location}
                                    onChange={handleInputChange}
                                    required />
                                </CCol>
                            </CRow>

                            <CRow className="mb-3">
                                <CFormLabel htmlFor="type2" className={`col-sm-2 col-form-label ${styles.addlabel}`} >冷媒類型*</CFormLabel>
                                <CCol>
                                    <CFormSelect 
                                    aria-label="Default select example" 
                                    id="refrigerant_type" 
                                    className={styles.addinput} 
                                    value={FormValues.refrigerant_type}
                                    onChange={handleInputChange}
                                    >
                                        <option value="1">R11</option>
                                        <option value="2">R12</option>
                                        <option value="3">R22</option>
                                        <option value="4">R-32</option>
                                        <option value="5">R-123</option>
                                        <option value="6">R-23</option>
                                        <option value="7">R-134a</option>
                                        <option value="8">R-404A</option>
                                        <option value="9">R-407a</option>
                                        <option value="10">R-410A</option>
                                        <option value="11">R-600a</option>
                                        <option value="12">R-417a</option>
                                        <option value="13">F22</option>
                                        <option value="14">HCR-600A</option>
                                        <option value="15">HFC-134a</option>
                                        <option value="16">R401A</option>
                                        <option value="17">其他</option>
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                            {/* <CRow className="mb-3">
                                <CFormLabel htmlFor="quantity" className={`col-sm-2 col-form-label ${styles.addlabel}`} >填充料(公克)*</CFormLabel>
                                <CCol>
                                    <CFormInput className={styles.addinput} type="number" min='0' id="quantity" required />
                                </CCol>
                            </CRow> */}
                            {/* <CRow className="mb-3">
                                <CFormLabel htmlFor="num" className={`col-sm-2 col-form-label ${styles.addlabel}`} >數量*</CFormLabel>
                                <CCol>
                                    <CFormInput className={styles.addinput} type="number" min='0' id="num" required />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="percent" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    逸散率<br /><span className={styles.Note2} onClick={() => setVisible(!visible)}>逸散率(%)建議表格</span></CFormLabel>
                                <CCol>
                                    <CFormInput className={styles.addinput} type="number" min='0' id="percent" required />
                                </CCol>
                                <CCollapse visible={visible}>
                                    <CCard className="mt-3">
                                        <CCardBody>
                                            <img src='/src/assets/images/逸散率建議表格.png' />
                                        </CCardBody>
                                    </CCard>
                                </CCollapse>
                            </CRow> */}

                            <CRow className="mb-3">
                                <CFormLabel htmlFor="explain" className={`col-sm-2 col-form-label ${styles.addlabel}`} >備註</CFormLabel>
                                <CCol>
                                    <CFormTextarea 
                                    className={styles.addinput} 
                                    type="text" 
                                    id="remark" 
                                    rows={3} 
                                    value={FormValues.remark}
                                    onChange={handleInputChange}
                                    />

                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="image" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    圖片*
                                </CFormLabel>
                                <CCol>
                                    <CFormInput type="file" id="image" onChange={handleImageChange} required />
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
                                        <img src={previewImage} alt="Uploaded Preview" />
                                    </Zoom>
                                )}
                            </div>

                            <CFormLabel className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                偵測錯誤提醒
                            </CFormLabel>
                            <div className={styles.errorMSG}>
                                {/* 偵測日期:{C1date}  <span>{dateincorrectmessage}</span><br />
                                偵測號碼:{C1num}  <span>{numincorrectmessage}</span> */}
                            </div>
                        </div>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton className="modalbutton1" onClick={handleClose}>取消</CButton>
                    <CButton className="modalbutton2" type="submit">儲存</CButton>
                </CModalFooter>
            </CForm>
        </CModal>
    );
};


export default EditModal;