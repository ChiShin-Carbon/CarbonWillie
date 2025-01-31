import React, { useState, useEffect } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CFormSelect, CForm
} from '@coreui/react';
import styles from '../../../../../scss/活動數據盤點.module.css';

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'


const EditModal = ({ isEditModalVisible, setEditModalVisible, selectedbusiness }) => {
    const handleClose = () => setEditModalVisible(false);
    const [transportType, setTransportType] = useState("1"); // 默認選擇汽車

    const [previewImage, setPreviewImage] = useState(null); // 用來存儲圖片的 
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file); // 創建圖片預覽 URL
            setPreviewImage(previewUrl); // 保存 URL 到狀態
        }
    };

    const [formValues, setFormValues] = useState({
        transportation: '',
        oil_species: '',
        kilometer: '',
        remark: '',
    });

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        const form = new FormData();
        form.append('businesstrip_id', selectedbusiness);
        form.append('user_id', window.sessionStorage.getItem('user_id'));
        form.append('transportation', formValues.transportation);
        form.append('oil_species', formValues.oil_species);
        form.append('kilometers', formValues.kilometer);
        form.append('remark', formValues.remark);

        
        const imageFile = document.getElementById('C1image')?.files[0];
        if (imageFile) {
            form.append('image', imageFile);
        }
        
        

        for (let [key, value] of form.entries()) {
            console.log(`${key}:`, value); // Debugging output
        }

        try {
            const response = await fetch('http://localhost:8000/edit_BusinessTrip', {
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
        const fetchBusinessData = async () => {
            if (!selectedbusiness) return;

            try {
                const response = await fetch('http://localhost:8000/Business_Trip_findone', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ BT_id: selectedbusiness }),
                });

                if (response.ok) {
                    const data = await response.json();
                    const BusinessData = data.Business_Trip[0];
                    setFormValues({
                        transportation: BusinessData?.transportation || '',
                        oil_species: BusinessData?.oil_species || '',
                        kilometer: BusinessData?.kilometer || '',
                        remark: BusinessData?.remark || '',
                    });
                    setPreviewImage(BusinessData?.img_path || null);
                } else {
                    console.error('Error fetching machinery data:', await response.text());
                }
            } catch (error) {
                console.error('Error fetching machinery data:', error);
            }
        };

        fetchBusinessData();
    }, [selectedbusiness]);

    // Handle form input changes
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormValues((prev) => ({ ...prev, [id]: value }));
    };


    return (
        <CModal
            backdrop="static"
            visible={isEditModalVisible} onClose={handleClose}
            aria-labelledby="ActivityModalLabel"
            size="xl"
        >
            <CModalHeader>
                <h5><b>編輯數據-商務旅行</b></h5>
            </CModalHeader>
            <CForm onSubmit={handleEditSubmit}>
                <CModalBody>
                    <div className={styles.addmodal}>
                        <div className={styles.modalLeft}>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="type" className={`col-sm-2 col-form-label ${styles.addlabel}`} >交通方式*</CFormLabel>
                                <CCol>
                                    <CFormSelect aria-label="Default select example" id="transportation" className={styles.addinput}
                                        value={formValues.transportation}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setTransportType(e.target.value)
                                        }} >
                                        <option value="1">汽車</option>
                                        <option value="2">機車</option>
                                        <option value="3">公車</option>
                                        <option value="4">捷運</option>
                                        <option value="5">火車</option>
                                        <option value="6">高鐵</option>
                                        <option value="7">客運</option>
                                        <option value="8">飛機</option>
                                        <option value="9">輪船</option>
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="oil" className={`col-sm-2 col-form-label ${styles.addlabel}`} >油種*<span className={styles.Note}>僅汽/機車須填寫</span></CFormLabel>
                                <CCol>
                                    <CFormSelect aria-label="Default select example"
                                        id="oil_species"
                                        value={formValues.oil_species}
                                        onChange={handleChange}
                                        className={styles.addinput}
                                        disabled={!(transportType === "1" || transportType === "2")} >
                                        <option value="1">無</option>
                                        <option value="2">汽油</option>
                                        <option value="3">柴油</option>
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="km" className={`col-sm-2 col-form-label ${styles.addlabel}`} >公里數*</CFormLabel>
                                <CCol>
                                    <CFormInput
                                        className={styles.addinput}
                                        type="number"
                                        id="kilometer"
                                        value={formValues.kilometer}
                                        onChange={handleChange}
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
                                        rows={3}
                                        value={formValues.remark}
                                        onChange={handleChange}
                                    />

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
                    <CButton className="modalbutton1" onClick={handleClose}>取消</CButton>
                    <CButton className="modalbutton2" type="submit">儲存</CButton>
                </CModalFooter>
            </CForm>
        </CModal>
    );
};


export default EditModal;