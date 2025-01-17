import React, { useState } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CCard, CFormSelect, CTab, CTabList, CTabs,
    CTable, CTableBody, CTableHead, CFormCheck, CCollapse
    , CForm, CCardBody,
} from '@coreui/react';

import styles from '../../../../../scss/活動數據盤點.module.css'

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'


export const MachineryAdd = ({ isAddModalVisible, setAddModalVisible }) => {
    const handleClose = () => setAddModalVisible(false);
    const [date, setC1date] = useState("");
    const [num, setC1num] = useState("");
    const [recognizedText, setRecognizedText] = useState("");

    const handleC6Submit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("user_id", 1);
        formData.append("date", document.getElementById("C6date").value);
        formData.append("number", document.getElementById("C6num").value);
        formData.append("location", document.getElementById("C6site").value);
        formData.append("type", document.getElementById("C6type").value);
        formData.append("filling", document.getElementById("C6quantity").value);
        formData.append("remark", document.getElementById("C6explain").value);
        formData.append("image", document.getElementById("C6image").files[0]);

        try {
            const res = await fetch("http://localhost:8000/insert_machine", {
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

        const imageElement = document.getElementById("C6image");

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
                                <CFormLabel htmlFor="month" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票/收據日期*</CFormLabel>
                                <CCol><CFormInput className={styles.addinput} type="date" id="C6date" value={date} required />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="num" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票號碼/收據編號*</CFormLabel>
                                <CCol>
                                    <CFormInput className={styles.addinput} type="text" id="C6num" value={num} required />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="site" className={`col-sm-2 col-form-label ${styles.addlabel}`} >設備位置*</CFormLabel>
                                <CCol>
                                    <CFormInput className={styles.addinput} type="text" id="C6site" required />
                                </CCol>
                            </CRow>

                            <CRow className="mb-3">
                                <CFormLabel htmlFor="type2" className={`col-sm-2 col-form-label ${styles.addlabel}`} >能源類型*</CFormLabel>
                                <CCol>
                                    <CFormSelect aria-label="Default select example" id="C6type" className={styles.addinput} >
                                        <option value="1">柴油</option>
                                        <option value="2">汽油</option>
                                        <option value="3">其他</option>
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="quantity" className={`col-sm-2 col-form-label ${styles.addlabel}`} >使用量(公克)*</CFormLabel>
                                <CCol>
                                    <CFormInput className={styles.addinput} type="number" min='0' id="C6quantity" required />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="explain" className={`col-sm-2 col-form-label ${styles.addlabel}`} >備註</CFormLabel>
                                <CCol>
                                    <CFormTextarea className={styles.addinput} type="text" id="C6explain" rows={3} />

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
                    <CButton type="submit" className="modalbutton2" onClick={handleC6Submit}>新增</CButton>

                </CModalFooter>
            </CForm>
        </CModal >
    );
};

export default MachineryAdd;
