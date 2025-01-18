import React, { useState, useEffect } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CFormSelect, CForm
} from '@coreui/react';
import styles from '../../../../../scss/活動數據盤點.module.css';

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const EditFillModal = ({ isEditFillModalVisible, setEditFillModalVisible, selectedFill }) => {
    const editFillClose = () => setEditFillModalVisible(false);
    const [previewImage, setPreviewImage] = useState(null); // 用來存儲圖片的 
    const [FormValues, setFormValues] = useState({
        Doc_date: '',
        Doc_number: '',
        usage: '',
        remark: '',
        img_path: '',
    });
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file); // 創建圖片預覽 URL
            setPreviewImage(previewUrl); // 保存 URL 到狀態
        }
    };

    const handleInputChange = (e) => {
            const { id, value } = e.target;
            setFormValues((prevValues) => ({ ...prevValues, [id]: value }));
        };
    
        const handleEditSubmit = async (e) => {
                e.preventDefault();
        
                const form = new FormData();
                form.append('extinguisher_id', selectedExtinguisher);
                form.append('user_id', window.sessionStorage.getItem('user_id'));
                form.append('item_name', FormValues.item_name);
                form.append('ingredient', FormValues.ingredient);
                form.append('specification', FormValues.specification);
                form.append('remark', FormValues.remark);
                form.append("image", e.target.image.files[0]); // Assuming the image is selected
    
                for (let [key, value] of form.entries()) {
                    console.log(`${key}:`, value); // Debugging output
                }
        
                try {
                    const response = await fetch('http://localhost:8000/edit_extinguisher', {
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
                const fetchExtinguisherFillData = async () => {
                    console.log('Fetching Extinguisher data for ID:', selectedFill);
                    if (!selectedFill) return;
        
                    try {
                        const response = await fetch('http://localhost:8000/ExtinguisherFill_findone', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ ExtinguisherFill_id: selectedFill }),
                        });
        
                        if (response.ok) {
                            const data = await response.json();
                            const ExtinguisherFillData = data.ExtinguisherFill[0];
                            setFormValues({
                                Doc_date: ExtinguisherFillData?.Doc_date || '',
                                Doc_number: ExtinguisherFillData?.Doc_number || '',
                                usage: ExtinguisherFillData?.usage || '',
                                remark: ExtinguisherFillData?.remark || '',
                                img_path: ExtinguisherFillData?.img_path || '',
                            });
                            setPreviewImage(ExtinguisherFillData?.img_path || null);
                            console.log('Fetched Extinguisher data:', ExtinguisherFillData);
                        } else {
                            console.error('Error fetching Extinguisher data:', await response.text());
                        }
                    } catch (error) {
                        console.error('Error fetching Extinguisher data:', error);
                    }
                };
        
                fetchExtinguisherFillData();
            }, [selectedFill]);
    

    return (
        <CModal
            backdrop="static"
            visible={isEditFillModalVisible} onClose={editFillClose}
            aria-labelledby="ActivityModalLabel"
            size="xl"
            className={styles.modal}
        >
            <CModalHeader>
                <h5><b>編輯填充紀錄</b></h5>
            </CModalHeader>
            <CForm>
                <CModalBody>
                    <div className={styles.addmodal}>
                        <div className={styles.modalLeft}>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="month" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票/收據日期*</CFormLabel>
                                <CCol><CFormInput 
                                className={styles.addinput} 
                                type="date" 
                                id="Doc_date" 
                                value={FormValues.Doc_date}
                                onChange={handleInputChange}
                                required />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="num" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票號碼/收據編號*</CFormLabel>
                                <CCol>
                                    <CFormInput 
                                    className={styles.addinput} 
                                    type="text" 
                                    id="Doc_number" 
                                    value={FormValues.Doc_number}
                                    onChange={handleInputChange}
                                    required />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="num" className={`col-sm-2 col-form-label ${styles.addlabel}`} >填充量*</CFormLabel>
                                <CCol>
                                    <CFormInput 
                                    className={styles.addinput} 
                                    type="number" 
                                    id="usage" 
                                    value={FormValues.usage}
                                    onChange={handleInputChange}
                                    required />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="explain" className={`col-sm-2 col-form-label ${styles.addlabel}`} >備註</CFormLabel>
                                <CCol>
                                    <CFormTextarea 
                                    className={styles.addinput} 
                                    type="text" 
                                    id="remark" 
                                    value={FormValues.remark}
                                    onChange={handleInputChange}
                                    rows={3} />

                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="image" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    圖片*
                                </CFormLabel>
                                <CCol>
                                    <CFormInput 
                                    type="file" id="image" onChange={handleImageChange} required />
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
                    <CButton className="modalbutton1" onClick={editFillClose}>取消</CButton>
                    <CButton className="modalbutton2" type="submit">儲存</CButton>
                </CModalFooter>
            </CForm>
        </CModal>
    );
};


export default EditFillModal;