import React, { useState } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CCard, CFormSelect, CTab, CTabList, CTabs,
    CTable, CTableBody, CTableHead, CFormCheck, CCollapse
    , CForm, CCardBody,
} from '@coreui/react';

import styles from '../../../../../scss/活動數據盤點.module.css'

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

export const FireExtinguisherAdd = ({ isAddModalVisible, setAddModalVisible }) => {
    const handleClose = () => setAddModalVisible(false);

    const [recognizedText, setRecognizedText] = useState("");

    const handleC2Submit = async (e) => {
        e.preventDefault();

        // Get form elements by their IDs
        const name = document.getElementById("name").value;
        const element = document.getElementById("element").value;
        const weight = document.getElementById("weight").value;
        const explain = document.getElementById("explain").value;
        const image = document.getElementById("C2image");

        // Check if the image file exists
        if (!image || !image.files || image.files.length === 0) {
            console.error("Image file not found");
            return;
        }

        // Prepare form data
        const formData = new FormData();
        formData.append("user_id", 1); // Example user_id, you should use the actual user ID
        formData.append("name", name);
        formData.append("element", element);
        formData.append("weight", weight);
        formData.append("explain", explain);
        formData.append("image", image.files[0]);

        try {
            // Send form data to the backend
            const res = await fetch("http://localhost:8000/insert_Extinguisher", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                console.log("Form submitted successfully:", data);
            } else {
                console.error("Failed to submit form data");
            }
        } catch (error) {
            console.error("Error submitting form data", error);
        }
    };

    
    const [previewImage, setPreviewImage] = useState(null); // 用來存儲圖片的 
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file); // 創建圖片預覽 URL
            setPreviewImage(previewUrl); // 保存 URL 到狀態
        }
    };

    return (
        <CModal
            backdrop="static"
            visible={isAddModalVisible}
            onClose={() => setAddModalVisible(false)}
            aria-labelledby="ActivityModalLabel"
        >
            <CModalHeader>
                <CModalTitle id="ActivityModalLabel"><b>新增數據</b></CModalTitle>
            </CModalHeader>
            <CForm>
                <CModalBody>
                    <div className={styles.addmodal}>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="name" className={`col-sm-2 col-form-label ${styles.addlabel}`} >品名*</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="text" id="name" required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="element" className={`col-sm-2 col-form-label ${styles.addlabel}`} >成分*</CFormLabel>
                            <CCol>
                                <CFormSelect aria-label="Default select example" id="element" className={styles.addinput}>
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
                                <CFormInput className={styles.addinput} type="number" min='0' id="weight" required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="explain" className={`col-sm-2 col-form-label ${styles.addlabel}`} >備註</CFormLabel>
                            <CCol>
                                <CFormTextarea className={styles.addinput} type="text" id="explain" rows={3} />

                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="photo" className={`col-sm-2 col-form-label ${styles.addlabel}`}  >圖片*</CFormLabel>
                            <CCol>
                                <CFormInput type="file" id="C2image" onChange={(e) => handleImageChange(e)} required />
                            </CCol>
                        </CRow>
                        {previewImage && ( // 如果有圖片 URL，則顯示預覽
                            <CRow className="mb-3">
                                <CCol className="text-center">
                                    <Zoom><img src={previewImage} alt="Uploaded Preview" /></Zoom>
                                </CCol>
                            </CRow>
                        )}
                        <br />
                        <div style={{ textAlign: 'center' }}>*為必填欄位</div>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton className="modalbutton1" onClick={handleClose}>
                        取消
                    </CButton>
                    <CButton  type="submit" className="modalbutton2" onClick={handleC2Submit}>新增</CButton>

                </CModalFooter>
            </CForm>
        </CModal>
    );
};

export default FireExtinguisherAdd;
