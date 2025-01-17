import React, { useState } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CCard, CFormSelect, CTab, CTabList, CTabs,
    CTable, CTableBody, CTableHead, CFormCheck, CCollapse
    , CForm, CCardBody,
} from '@coreui/react';

import styles from '../../../../../scss/活動數據盤點.module.css'

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

export const SellingWasteAdd = ({ isAddModalVisible, setAddModalVisible }) => {
    const handleClose = () => setAddModalVisible(false);

    const [recognizedText, setRecognizedText] = useState("");

    const handleC12Submit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("user_id", 1);
        formData.append("waste_item", document.getElementById("C12item").value);
        formData.append("remark", document.getElementById("C12explain").value);
        formData.append("image", document.getElementById("C12image").files[0]);

        try {
            const res = await fetch("http://localhost:8000/insert_Selling_waste", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                console.log("Form submitted successfully", data);
                setAddModalVisible(false);
            } else {
                console.error("Failed to submit form data", data.detail);
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
            size='xl'
        >
            <CModalHeader>
                <CModalTitle id="ActivityModalLabel"><b>新增數據</b></CModalTitle>
            </CModalHeader>
            <CForm>
                <CModalBody>
                    <div className={styles.addmodal}>
                        <div className={styles.modalLeft}>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="item" className={`col-sm-2 col-form-label ${styles.addlabel}`} >廢棄物項目*</CFormLabel>
                                <CCol>
                                    <CFormInput className={styles.addinput} type="text" id="C12item" required />
                                </CCol>
                            </CRow>

                            <CRow className="mb-3">
                                <CFormLabel htmlFor="explain" className={`col-sm-2 col-form-label ${styles.addlabel}`} >備註</CFormLabel>
                                <CCol>
                                    <CFormTextarea className={styles.addinput} type="text" id="C12explain" rows={3} />

                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel
                                    htmlFor="photo"
                                    className={`col-sm-2 col-form-label ${styles.addlabel}`}
                                >
                                    圖片*
                                </CFormLabel>
                                <CCol>
                                    <CFormInput type="file" id="C1image" onChange={(e) => (handleImageChange(e), handleC1image(e))} required />
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
                                {previewImage && ( // 如果有圖片 URL，則顯示預覽
                                    <Zoom><img src={previewImage} alt="Uploaded Preview" /></Zoom>
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
                    <CButton className="modalbutton1" onClick={handleClose}>
                        取消
                    </CButton>
                    <CButton type="submit" className="modalbutton2" onClick={handleC12Submit}>新增</CButton>

                </CModalFooter>
            </CForm>
        </CModal >
    );
};

export default SellingWasteAdd;
