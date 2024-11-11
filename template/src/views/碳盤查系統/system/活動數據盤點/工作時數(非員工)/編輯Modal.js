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
                <h5><b>編輯數據-工作時數(非員工)</b></h5>
            </CModalHeader>
            <CForm>
                <CModalBody>
                    <div className={styles.addmodal}>

                        <CRow className="mb-3">
                            <CFormLabel htmlFor="month" className={`col-sm-2 col-form-label ${styles.addlabel}`} >月份*</CFormLabel>
                            <CCol>
                                <CFormSelect aria-label="Default select example" id="month" className={styles.addinput} >
                                    <option value="1">1月</option>
                                    <option value="2">2月</option>
                                    <option value="3">3月</option>
                                    <option value="4">4月</option>
                                    <option value="5">5月</option>
                                    <option value="6">6月</option>
                                    <option value="7">7月</option>
                                    <option value="8">8月</option>
                                    <option value="9">9月</option>
                                    <option value="10">10月</option>
                                    <option value="11">11月</option>
                                    <option value="12">12月</option>
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="people" className={`col-sm-2 col-form-label ${styles.addlabel}`} >人數*<span className={styles.Note}>如保全、清潔等委外人員</span></CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="number" min='0' id="people" required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="workhour" className={`col-sm-2 col-form-label ${styles.addlabel}`} >總工作時數*</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="number" min='0' id="workhour" required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="workday" className={`col-sm-2 col-form-label ${styles.addlabel}`} >總工作人天*</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="number" min='0' id="workday" required />
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