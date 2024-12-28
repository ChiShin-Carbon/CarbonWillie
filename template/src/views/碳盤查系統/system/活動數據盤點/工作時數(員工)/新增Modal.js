import React, { useState } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CCard, CFormSelect, CTab, CTabList, CTabs,
    CTable, CTableBody, CTableHead, CFormCheck, CCollapse
    , CForm, CCardBody,
} from '@coreui/react';

import styles from '../../../../../scss/活動數據盤點.module.css'

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

export const EmployeeAdd = ({ isAddModalVisible, setAddModalVisible }) => {
    const handleClose = () => setAddModalVisible(false);

    const [recognizedText, setRecognizedText] = useState("");

    const handleC3Submit = async (e) => {
        e.preventDefault();

        // Gather form values
        const month = document.getElementById("C3month").value;
        const employee = document.getElementById("C3employee").value;
        const daily_hours = document.getElementById("C3daily_hours").value;
        const workday = document.getElementById("C3workday").value;
        const overtime = document.getElementById("C3overtime").value;
        const sick = document.getElementById("C3sick").value;
        const personal = document.getElementById("C3personal").value;
        const business = document.getElementById("C3business").value;
        const funeral = document.getElementById("C3funeral").value;
        const special = document.getElementById("C3special").value;
        const explain = document.getElementById("C3explain").value;
        const image = document.getElementById("C3image").files[0];

        // Prepare FormData for submission
        const formData = new FormData();
        formData.append("user_id", 1); // Set user_id as required
        formData.append("month", month);
        formData.append("employee", employee);
        formData.append("daily_hours", daily_hours);
        formData.append("workday", workday);
        formData.append("overtime", overtime);
        formData.append("sick", sick);
        formData.append("personal", personal);
        formData.append("business", business);
        formData.append("funeral", funeral);
        formData.append("special", special);
        formData.append("explain", explain);
        formData.append("image", image);

        try {
            // Send form data to the backend
            const response = await fetch("http://localhost:8000/insert_employee", {
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
                            <form onSubmit={handleC3Submit}>
                                <CRow className="mb-3">
                                    <CFormLabel htmlFor="month" className={`col-sm-2 col-form-label ${styles.addlabel}`} >月份*</CFormLabel>
                                    <CCol><CFormInput className={styles.addinput} type="month" id="C3month" required /></CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CFormLabel htmlFor="people" className={`col-sm-2 col-form-label ${styles.addlabel}`} >員工數*</CFormLabel>
                                    <CCol>
                                        <CFormInput className={styles.addinput} type="number" min='0' id="C3employee" required />
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CFormLabel htmlFor="workhour" className={`col-sm-2 col-form-label ${styles.addlabel}`} >每日工時*<br /><span className={styles.Note}> 不含休息時間</span></CFormLabel>
                                    <CCol>
                                        <CFormInput className={styles.addinput} type="number" min='0' id="C3daily_hours" required />
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CFormLabel htmlFor="workday" className={`col-sm-2 col-form-label ${styles.addlabel}`} >每月工作日數*</CFormLabel>
                                    <CCol>
                                        <CFormInput className={styles.addinput} type="number" min='0' id="C3workday" required />
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CFormLabel htmlFor="plushou" className={`col-sm-2 col-form-label ${styles.addlabel}`} >總加班時數</CFormLabel>
                                    <CCol>
                                        <CFormInput className={styles.addinput} type="number" min='0' id="C3overtime" />
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CFormLabel htmlFor="sickhour" className={`col-sm-2 col-form-label ${styles.addlabel}`} >總病假時數</CFormLabel>
                                    <CCol>
                                        <CFormInput className={styles.addinput} type="number" min='0' id="C3sick" />
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CFormLabel htmlFor="personalhour" className={`col-sm-2 col-form-label ${styles.addlabel}`} >總事假時數</CFormLabel>
                                    <CCol>
                                        <CFormInput className={styles.addinput} type="number" min='0' id="C3personal" />
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CFormLabel htmlFor="businesshour" className={`col-sm-2 col-form-label ${styles.addlabel}`} >總出差時數</CFormLabel>
                                    <CCol>
                                        <CFormInput className={styles.addinput} type="number" min='0' id="C3business" />
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CFormLabel htmlFor="deadhour" className={`col-sm-2 col-form-label ${styles.addlabel}`} >總婚喪時數</CFormLabel>
                                    <CCol>
                                        <CFormInput className={styles.addinput} type="number" min='0' id="C3funeral" />
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CFormLabel htmlFor="resthour" className={`col-sm-2 col-form-label ${styles.addlabel}`} >總特休時數</CFormLabel>
                                    <CCol>
                                        <CFormInput className={styles.addinput} type="number" min='0' id="C3special" />
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CFormLabel htmlFor="explain" className={`col-sm-2 col-form-label ${styles.addlabel}`} >備註</CFormLabel>
                                    <CCol>
                                        <CFormTextarea className={styles.addinput} type="text" id="C3explain" rows={3} />

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
                            </form>
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
                    <CButton type="submit" className="modalbutton2" onClick={handleC3Submit}>新增</CButton>

                </CModalFooter>
            </CForm>
        </CModal >
    );
};

export default EmployeeAdd;
