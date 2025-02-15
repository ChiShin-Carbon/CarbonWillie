import React, { useState, useEffect } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CFormSelect, CForm
} from '@coreui/react';
import styles from '../../../../../scss/活動數據盤點.module.css';

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'


const EditModal = ({ isEditModalVisible, setEditModalVisible, selectedExtinguisher }) => {
    const handleClose = () => setEditModalVisible(false);
    const [previewImage, setPreviewImage] = useState(null); // 用來存儲圖片的 
    const [FormValues, setFormValues] = useState({
        item_name: '',
        ingredient: '',
        specification: '',
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
            const fetchExtinguisherData = async () => {
                if (!selectedExtinguisher) return;
    
                try {
                    const response = await fetch('http://localhost:8000/Extinguisher_findone', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ Extinguisher_id: selectedExtinguisher }),
                    });
    
                    if (response.ok) {
                        const data = await response.json();
                        const ExtinguisherData = data.Extinguisher[0];
                        setFormValues({
                            item_name: ExtinguisherData?.item_name || '',
                            ingredient: ExtinguisherData?.ingredient || '',
                            specification: ExtinguisherData?.specification || '',
                            remark: ExtinguisherData?.remark || '',
                            img_path: ExtinguisherData?.img_path || '',
                        });
                        setPreviewImage(ExtinguisherData?.img_path || null);
                    } else {
                        console.error('Error fetching Extinguisher data:', await response.text());
                    }
                } catch (error) {
                    console.error('Error fetching Extinguisher data:', error);
                }
            };
    
            fetchExtinguisherData();
        }, [selectedExtinguisher]);

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
                <h5><b>編輯數據-滅火器</b></h5>
            </CModalHeader>
            <CForm onSubmit={handleEditSubmit}>
                <CModalBody>
                    <div className={styles.addmodal}>
                        <div className={styles.modalLeft}>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="name" className={`col-sm-2 col-form-label ${styles.addlabel}`} >品名*</CFormLabel>
                                <CCol>
                                    <CFormInput
                                     className={styles.addinput} 
                                     type="text" 
                                     id="item_name"
                                     value={FormValues.item_name}
                                     onChange={handleInputChange}
                                     required />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="element" className={`col-sm-2 col-form-label ${styles.addlabel}`} >成分*</CFormLabel>
                                <CCol>
                                    <CFormSelect 
                                    aria-label="Default select example" 
                                    id="ingredient" 
                                    className={styles.addinput}
                                    value={FormValues.ingredient}
                                    onChange={handleInputChange}
                                    
                                    >
                                        <option value="1">CO2</option>
                                        <option value="2">HFC-236ea</option>
                                        <option value="3">HFC-236fa</option>
                                        <option value="4">HFC-227ea</option>
                                        <option value="5">CF3CHFCF3</option>
                                        <option value="6">CHF3</option>
                                        <option value="7">其他</option>
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="weight" className={`col-sm-2 col-form-label ${styles.addlabel}`} >規格(重量)*</CFormLabel>
                                <CCol>
                                    <CFormInput 
                                    className={styles.addinput} 
                                    type="number" 
                                    min='0' 
                                    id="specification" 
                                    value={FormValues.specification}
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