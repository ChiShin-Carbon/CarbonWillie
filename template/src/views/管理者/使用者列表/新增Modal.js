import React, { useState } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CFormSelect, CForm
} from '@coreui/react';
import styles from '../../../scss/管理者.module.css';

const AddModal = ({ isAddModalVisible, setAddModalVisible }) => {
    const handleClose = () => setAddModalVisible(false);

    return (
        <CModal visible={isAddModalVisible} onClose={handleClose} className={styles.modal}>
            <CModalHeader>
                <h5><b>新增使用者資料</b></h5>
            </CModalHeader>
            <CForm>
                <CModalBody>
                    <div className={styles.addmodal}>

                        <CRow className="mb-3">
                            <CFormLabel htmlFor="address" className={`col-sm-2 col-form-label ${styles.addlabel}`} >帳號</CFormLabel>
                            <CCol><CFormInput className={styles.addinput} type="text" id="address" required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="username" className={`col-sm-2 col-form-label ${styles.addlabel}`} >姓名</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="text" id="username" required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="business_id" className={`col-sm-2 col-form-label ${styles.addlabel}`} >統編</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="text" id="business_id" required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="email" className={`col-sm-2 col-form-label ${styles.addlabel}`} >電子郵件</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="email" id="email" required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="telephone" className={`col-sm-2 col-form-label ${styles.addlabel}`} >辦公室電話</CFormLabel>
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
                            <CFormLabel htmlFor="department" className={`col-sm-2 col-form-label ${styles.addlabel}`} >所屬部門</CFormLabel>
                            <CCol>
                                <CFormSelect aria-label="Default select example" id="department" className={styles.addinput}>
                                    <option value="1">管理部門</option>
                                    <option value="2">資訊部門</option>
                                    <option value="3">門診部門</option>
                                    <option value="4">健檢部門</option>
                                    <option value="5">檢驗部門</option>
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="position" className={`col-sm-2 col-form-label ${styles.addlabel}`} >職位</CFormLabel>
                            <CCol>
                                <CFormSelect aria-label="Default select example" id="position" className={styles.addinput}>
                                    <option value="1">總經理</option>
                                    <option value="2">副總經理</option>
                                    <option value="3">主管</option>
                                    <option value="4">組長</option>
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="password" className={`col-sm-2 col-form-label ${styles.addlabel}`} >密碼</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="text" id="password" required />
                            </CCol>
                        </CRow>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton className="modalbutton1" onClick={handleClose}>取消</CButton>
                    <CButton className="modalbutton2" type="submit">新增</CButton>
                </CModalFooter>
            </CForm>
        </CModal>
    );
};


export default AddModal;