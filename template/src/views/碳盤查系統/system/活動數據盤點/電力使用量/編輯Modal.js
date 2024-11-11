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
                <h5><b>編輯數據-電力使用量</b></h5>
            </CModalHeader>
            <CForm>
                <CModalBody>
                <div className={styles.addmodal}>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="month" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票/收據日期*</CFormLabel>
                        <CCol><CFormInput className={styles.addinput} type="date" id="date" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="num" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票號碼/收據編號*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="text" id="num" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="datestart" className={`col-sm-2 col-form-label ${styles.addlabel}`} >用電期間(起)*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="date" id="datestart" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="dateend" className={`col-sm-2 col-form-label ${styles.addlabel}`} >用電期間(迄)*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="date" id="dateend" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="type" className={`col-sm-2 col-form-label ${styles.addlabel}`} >填寫類型*<span className={styles.Note}> 選擇填寫請以*用電度數*作為優先填寫項目</span></CFormLabel>
                        <CCol>
                            <CFormSelect aria-label="Default select example" id="type" className={styles.addinput} >
                                <option value="1">用電度數</option>
                                <option value="2">用電金額</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CFormLabel htmlFor="quantity" className={`col-sm-2 col-form-label ${styles.addlabel}`} >尖峰度數*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="quantity" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="quantity2" className={`col-sm-2 col-form-label ${styles.addlabel}`} >半尖峰度數</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="quantity2" />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="quantity3" className={`col-sm-2 col-form-label ${styles.addlabel}`} >周六尖峰度數</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="quantity3" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="quantity4" className={`col-sm-2 col-form-label ${styles.addlabel}`} >離峰度數</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="quantity4" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="monthusage" className={`col-sm-2 col-form-label ${styles.addlabel}`} >當月總用電量或總金額</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="monthusage" />
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