import React, { useState } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CFormSelect, CForm
} from '@coreui/react';
import styles from '../../../scss/管理者.module.css';

const EditModal = ({ isEditModalVisible, setEditModalVisible}) => {
    const handleClose = () => setEditModalVisible(false);

    return (
        <CModal visible={isEditModalVisible} onClose={handleClose} className={styles.modal}>
            <CModalHeader>
                <h5><b>編輯企業資料</b></h5>
            </CModalHeader>
            <CForm>
                <CModalBody>
                    <div className={styles.addmodal}>

                        <CRow className="mb-3">
                            <CFormLabel htmlFor="org_name" className={`col-sm-2 col-form-label ${styles.addlabel}`} >公私場所名稱</CFormLabel>
                            <CCol><CFormInput className={styles.addinput} type="text" id="org_name" required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="registration_number" className={`col-sm-2 col-form-label ${styles.addlabel}`} >管制編號</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="text" id="registration_number" required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="actory_number" className={`col-sm-2 col-form-label ${styles.addlabel}`} >核准字號</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="text" id="actory_number" required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="org_address" className={`col-sm-2 col-form-label ${styles.addlabel}`} >地址</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="text" id="org_address" required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="postal_code" className={`col-sm-2 col-form-label ${styles.addlabel}`} >郵遞區號</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="text" id="postal_code" required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="charge_perso" className={`col-sm-2 col-form-label ${styles.addlabel}`} >負責人姓名</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="text" id="charge_perso" required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="org_email" className={`col-sm-2 col-form-label ${styles.addlabel}`} >公私場所電子信箱</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="text" id="org_email" required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="contact_person" className={`col-sm-2 col-form-label ${styles.addlabel}`} >聯絡人姓名</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="text" id="contact_person" required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="email" className={`col-sm-2 col-form-label ${styles.addlabel}`} >電子信箱</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="text" id="email" required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="telephone" className={`col-sm-2 col-form-label ${styles.addlabel}`} >電話</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="text" id="telephone" required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="phone" className={`col-sm-2 col-form-label ${styles.addlabel}`} >手機</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="text" id="phone" required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="industry_name" className={`col-sm-2 col-form-label ${styles.addlabel}`} >行業名稱</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="text" id="industry_name" required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="industry_code" className={`col-sm-2 col-form-label ${styles.addlabel}`} >行業代碼</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="text" id="industry_code" required />
                            </CCol>
                        </CRow>
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