import React, { useState } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CFormSelect, CForm
} from '@coreui/react';
import styles from '../../../../../scss/活動數據盤點.module.css';

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const EditModal = ({ isEditModalVisible, setEditModalVisible }) => {
    const handleClose = () => setEditModalVisible(false);

    const [previewImage, setPreviewImage] = useState(null); // 用來存儲圖片的 
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file); // 創建圖片預覽 URL
            setPreviewImage(previewUrl); // 保存 URL 到狀態
        }
    };

    return (
        <CModal backdrop="static" visible={isEditModalVisible} onClose={handleClose} className={styles.modal}>
            <CModalHeader>
                <h5><b>編輯數據-營運產生廢棄物</b></h5>
            </CModalHeader>
            <CForm>
                <CModalBody>
                    <div className={styles.addmodal}>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="item" className={`col-sm-2 col-form-label ${styles.addlabel}`} >廢棄物項目*</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="text" id="item" required />
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