import React, { useState, useEffect } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CFormSelect, CForm
} from '@coreui/react';
import styles from '../../../../../scss/活動數據盤點.module.css';

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'


const EditModal = ({ isEditModalVisible, setEditModalVisible, selectedCommute }) => {
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

    useEffect(() => {
        const fetchCommuteData = async () => {
            if (!selectedCommute) return;

            try {
                const response = await fetch('http://localhost:8000/Commute_findone', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ commuteRequest_id: selectedCommute }),
                });

                if (response.ok) {
                    const data = await response.json();
                    const CommuteData = data.Commute[0];
                    setFormValues({
                        transportation: CommuteData?.transportation || '',
                        oil_species: CommuteData?.oil_species || '',
                        kilometer: CommuteData?.kilometer || '',
                        remark: CommuteData?.remark || '',
                    });
                    setPreviewImage(CommuteData?.img_path || null);
                } else {
                    console.error('Error fetching machinery data:', await response.text());
                }
            } catch (error) {
                console.error('Error fetching machinery data:', error);
            }
        };

        fetchCommuteData();
    }, [selectedCommute]);

    // Handle form input changes
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormValues((prev) => ({ ...prev, [id]: value }));
    };



    return (
        <CModal backdrop="static" visible={isEditModalVisible} onClose={handleClose} className={styles.modal}>
            <CModalHeader>
                <h5><b>編輯數據-員工通勤</b></h5>
            </CModalHeader>
            <CForm>
                <CModalBody>
                    <div className={styles.addmodal}>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="type" className={`col-sm-2 col-form-label ${styles.addlabel}`} >交通方式*</CFormLabel>
                            <CCol>
                                <CFormSelect aria-label="Default select example" id="type" className={styles.addinput}
                                    value={formValues.transportation}
                                    onChange={(e) => {
                                        setTransportType(e.target.value)
                                        handleChange(e)
                                    }} >
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
                                <CFormSelect aria-label="Default select example" 
                                id="type" 
                                className={styles.addinput} 
                                value={formValues.oil_species}
                                onChange={handleChange}
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
                                id="km" 
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
                                id="explain" 
                                rows={3} 
                                value={formValues.remark}
                                onChange={handleChange}
                                />

                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="photo" className={`col-sm-2 col-form-label ${styles.addlabel}`}  >圖片*</CFormLabel>
                            <CCol>
                                <CFormInput type="file" id="photo" onChange={(e) => handleImageChange(e)} required />
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
                    <CButton className="modalbutton1" onClick={handleClose}>取消</CButton>
                    <CButton className="modalbutton2" type="submit">儲存</CButton>
                </CModalFooter>
            </CForm>
        </CModal>
    );
};


export default EditModal;