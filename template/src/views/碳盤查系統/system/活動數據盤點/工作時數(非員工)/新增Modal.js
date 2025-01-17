import React, { useState } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CForm,
} from '@coreui/react';

import styles from '../../../../../scss/活動數據盤點.module.css';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

export const NonEmployeeAdd = ({ isAddModalVisible, setAddModalVisible }) => {
    const handleClose = () => setAddModalVisible(false);
    const [recognizedText, setRecognizedText] = useState("");
    const [previewImage, setPreviewImage] = useState(null);

    const handleC3Submit = async (e) => {
        e.preventDefault();

        // Gather form values using correct IDs
        const month = document.getElementById("C4date").value;
        const nonemployee = document.getElementById("C4people").value;
        const total_hours = document.getElementById("C4workhour").value;
        const total_day = document.getElementById("C4workday").value;
        const explain = document.getElementById("C4explain").value;
        const image = document.getElementById("C4image").files[0];

        // Prepare FormData for submission
        const formData = new FormData();
        formData.append("user_id", 1); // Set user_id as required
        formData.append("month", month);
        formData.append("nonemployee", nonemployee);
        formData.append("total_hours", total_hours);
        formData.append("total_day", total_day);
        formData.append("explain", explain);
        formData.append("image", image);

        try {
            // Send form data to the backend
            const response = await fetch("http://localhost:8000/insert_nonemployee", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Employee data submitted successfully:", result);
            } else {
                console.error("Failed to submit employee data");
            }
        } catch (error) {
            console.error("Error submitting employee data:", error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setPreviewImage(previewUrl);
        }
    };

    return (
        <CModal
            backdrop="static"
            visible={isAddModalVisible}
            onClose={handleClose}
            aria-labelledby="ActivityModalLabel"
            size='xl'
        >
            <CModalHeader>
                <CModalTitle id="ActivityModalLabel"><b>新增數據</b></CModalTitle>
            </CModalHeader>
            <CForm onSubmit={handleC3Submit}>
                <CModalBody>
                    <div className={styles.addmodal}>
                        <div className={styles.modalLeft}>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="C4date" className={`col-sm-2 col-form-label ${styles.addlabel}`} >月份*</CFormLabel>
                                <CCol><CFormInput className={styles.addinput} type="month" id="C4date" required /></CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="C4people" className={`col-sm-2 col-form-label ${styles.addlabel}`} >人數*</CFormLabel>
                                <CCol><CFormInput className={styles.addinput} type="number" min="0" id="C4people" required /></CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="C4workhour" className={`col-sm-2 col-form-label ${styles.addlabel}`} >總工作時數*</CFormLabel>
                                <CCol><CFormInput className={styles.addinput} type="number" min="0" id="C4workhour" required /></CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="C4workday" className={`col-sm-2 col-form-label ${styles.addlabel}`} >總工作人天*</CFormLabel>
                                <CCol><CFormInput className={styles.addinput} type="number" min="0" id="C4workday" required /></CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="C4explain" className={`col-sm-2 col-form-label ${styles.addlabel}`} >備註</CFormLabel>
                                <CCol><CFormTextarea className={styles.addinput} type="text" id="C4explain" rows={3} /></CCol>
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
                    <CButton className="modalbutton1" onClick={handleClose}>取消</CButton>
                    <CButton type="submit" className="modalbutton2">新增</CButton>
                </CModalFooter>
            </CForm>
        </CModal>
    );
};

export default NonEmployeeAdd;
