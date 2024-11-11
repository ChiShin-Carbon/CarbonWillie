import React, { useState } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CFormSelect, CForm
} from '@coreui/react';
import styles from '../../../../../scss/活動數據盤點.module.css';

const EditModal = ({ isEditModalVisible, setEditModalVisible }) => {
    const handleClose = () => setEditModalVisible(false);

    return (
        <CModal visible={isEditModalVisible} onClose={handleClose} className={styles.modal}>
            <CModalHeader>
                <h5><b>編輯數據-滅火器</b></h5>
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
                        <CFormLabel htmlFor="photo" className={`col-sm-2 col-form-label ${styles.addlabel}`} >圖片*</CFormLabel>
                        <CCol>
                            <CFormInput type="file" id="photo" required />
                        </CCol>
                    </CRow>
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