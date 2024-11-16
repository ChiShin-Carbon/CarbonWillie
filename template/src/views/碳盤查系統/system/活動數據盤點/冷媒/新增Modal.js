import React, { useState } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CCard, CFormSelect, CTab, CTabList, CTabs,
    CTable, CTableBody, CTableHead, CFormCheck, CCollapse
    , CForm, CCardBody,
} from '@coreui/react';

import styles from '../../../../../scss/活動數據盤點.module.css'


export const RefrigerantAdd = ({ isAddModalVisible, setAddModalVisible }) => {
    const [date, setC1date] = useState("");
    const [num, setC1num] = useState("");
    const handleClose = () => setAddModalVisible(false);
    const [visible, setVisible] = useState(false)

    const [recognizedText, setRecognizedText] = useState("");

    const handleC5Submit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("user_id", 1);
        formData.append("date", document.getElementById("C5date").value);
        formData.append("number", document.getElementById("C5num").value);
        formData.append("device_type", document.getElementById("C5type").value);
        formData.append("device_location", document.getElementById("C5site").value);
        formData.append("refrigerant_type", document.getElementById("C5type2").value);
        formData.append("filling", document.getElementById("C5quantity").value);
        formData.append("quantity", document.getElementById("C5num").value);
        formData.append("leakage_rate", document.getElementById("C5percent").value);
        formData.append("remark", document.getElementById("C5explain").value);
        formData.append("image", document.getElementById("C5image").files[0]);

        try {
            const res = await fetch("http://localhost:8000/insert_ref", {
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

    
    const handleC5image = async (e) => {
        e.preventDefault();

        const imageElement = document.getElementById("C5image");

        if (!imageElement || !imageElement.files) {
            console.error("Form elements or image files not found");
            return;
        }

        const formData = new FormData();
        formData.append("image", imageElement.files[0]);

        try {
            const res = await fetch("http://localhost:8000/ocrapi", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                setC1date(data.response_content[0]);
                setC1num(data.response_content[1]);
                console.log("Data submitted successfully");
            } else {
                console.error("Failed to submit data");
            }
        } catch (error) {
            console.error("Error submitting data", error);
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
                            <CFormLabel htmlFor="month" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票/收據日期*</CFormLabel>
                            <CCol><CFormInput className={styles.addinput} type="date" id="C5date" value={date} required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="num" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票號碼/收據編號*</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="text" id="C5num" value={num} required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="type" className={`col-sm-2 col-form-label ${styles.addlabel}`} >設備類型*</CFormLabel>
                            <CCol>
                                <CFormSelect aria-label="Default select example" id="C5type" className={styles.addinput} >
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
                                <CFormInput className={styles.addinput} type="text" id="C5site" required />
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CFormLabel htmlFor="type2" className={`col-sm-2 col-form-label ${styles.addlabel}`} >冷媒類型*</CFormLabel>
                            <CCol>
                                <CFormSelect aria-label="Default select example" id="C5type2" className={styles.addinput} >
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
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="quantity" className={`col-sm-2 col-form-label ${styles.addlabel}`} >填充料(公克)*</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="number" min='0' id="C5quantity" required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="num" className={`col-sm-2 col-form-label ${styles.addlabel}`} >數量*</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="number" min='0' id="C5num" required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="percent" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                逸散率<br /><span className={styles.Note2} onClick={() => setVisible(!visible)}>逸散率(%)建議表格</span></CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="number" min='0' id="C5percent" required />
                            </CCol>
                            <CCollapse visible={visible}>
                                <CCard className="mt-3">
                                    <CCardBody>
                                        <img src='/src/assets/images/逸散率建議表格.png' />
                                    </CCardBody>
                                </CCard>
                            </CCollapse>
                        </CRow>

                        <CRow className="mb-3">
                            <CFormLabel htmlFor="explain" className={`col-sm-2 col-form-label ${styles.addlabel}`} >備註</CFormLabel>
                            <CCol>
                                <CFormTextarea className={styles.addinput} type="text" id="C5explain" rows={3} />

                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="photo" className={`col-sm-2 col-form-label ${styles.addlabel}`}  >圖片*</CFormLabel>
                            <CCol>
                                <CFormInput type="file" id="C5image" onChange={handleC5image} required />
                            </CCol>
                        </CRow>
                        <br />
                        <div style={{ textAlign: 'center' }}>*為必填欄位</div>

                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton className="modalbutton1" onClick={handleClose}>
                        取消
                    </CButton>
                    <CButton type="submit" className="modalbutton2" onClick={handleC5Submit}>新增</CButton>

                </CModalFooter>
            </CForm>
        </CModal>
    );
};

export default RefrigerantAdd;
