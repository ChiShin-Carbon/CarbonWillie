import React, { useState } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CCard, CFormSelect, CTab, CTabList, CTabs,
    CTable, CTableBody, CTableHead, CFormCheck, CCollapse
    , CForm, CCardBody,
} from '@coreui/react';

import styles from '../../../../../scss/活動數據盤點.module.css'

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

export const CommutingAdd = ({ isAddModalVisible, setAddModalVisible }) => {
    const handleClose = () => setAddModalVisible(false);
    const [transportType, setTransportType] = useState("1"); // 默認選擇汽車

    const [recognizedText, setRecognizedText] = useState("");

    const handleC9Submit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("user_id", 1);
        formData.append("transportation", document.getElementById("C9type").value);
        formData.append("oil_species", document.getElementById("C9oil_type").value);
        formData.append("kilometers", document.getElementById("C9km").value);
        formData.append("remark", document.getElementById("C9explain").value);
        formData.append("image", document.getElementById("C9image").files[0]);

        try {
            const res = await fetch("http://localhost:8000/insert_commute", {
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
            size="xl"
        >
            <CModalHeader>
                <CModalTitle id="ActivityModalLabel"><b>新增數據</b></CModalTitle>
            </CModalHeader>
            <CForm>
                <CModalBody>
                    <div className={styles.addmodal}>
                        <div className={styles.modalLeft}>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="type" className={`col-sm-2 col-form-label ${styles.addlabel}`} >交通方式*</CFormLabel>
                                <CCol>
                                    <CFormSelect aria-label="Default select example" id="C9type" className={styles.addinput}
                                        onChange={(e) => setTransportType(e.target.value)} >
                                        <option value="1">汽車</option>
                                        <option value="2">機車</option>
                                        <option value="3">公車</option>
                                        <option value="4">捷運</option>
                                        <option value="5">火車</option>
                                        <option value="6">高鐵</option>
                                        <option value="7">客運</option>
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="oil" className={`col-sm-2 col-form-label ${styles.addlabel}`} >油種*<span className={styles.Note}>僅汽/機車須填寫</span></CFormLabel>
                                <CCol>
                                    <CFormSelect aria-label="Default select example" id="C9oil_type" className={styles.addinput} disabled={!(transportType === "1" || transportType === "2")} >
                                        <option value="1">無</option>
                                        <option value="2">汽油</option>
                                        <option value="3">柴油</option>
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="km" className={`col-sm-2 col-form-label ${styles.addlabel}`} >公里數*</CFormLabel>
                                <CCol>
                                    <CFormInput className={styles.addinput} type="C9number" id="C9km" required />
                                </CCol>
                            </CRow>

                            <CRow className="mb-3">
                                <CFormLabel htmlFor="explain" className={`col-sm-2 col-form-label ${styles.addlabel}`} >備註</CFormLabel>
                                <CCol>
                                    <CFormTextarea className={styles.addinput} type="text" id="C9explain" rows={3} />

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
                    <CButton type="submit" className="modalbutton2" onClick={handleC9Submit}>新增</CButton>

                </CModalFooter>
            </CForm>
        </CModal>
    );
};

export default CommutingAdd;
