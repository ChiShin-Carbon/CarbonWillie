import React, { useState } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CFormSelect, CForm,CCollapse,CCard,CCardBody
} from '@coreui/react';
import styles from '../../../../../scss/活動數據盤點.module.css';

const EditFillModal = ({ isEditFillModalVisible, setEditFillModalVisible }) => {
    const editFillClose = () => setEditFillModalVisible(false);
    const [collapseVisible, setCollapseVisible] = useState(false)

    return (
        <CModal visible={isEditFillModalVisible} onClose={editFillClose} className={styles.modal}>
            <CModalHeader>
                <h5><b>編輯填充紀錄</b></h5>
            </CModalHeader>
            <CForm>
                <CModalBody>
                    <div className={styles.addmodal}>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="month" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票/收據日期*</CFormLabel>
                            <CCol><CFormInput className={styles.addinput} type="date" id="date" required /></CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="num" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票號碼/收據編號*</CFormLabel>
                            <CCol><CFormInput className={styles.addinput} type="text" id="num" required /></CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="num" className={`col-sm-2 col-form-label ${styles.addlabel}`} >填充量*</CFormLabel>
                            <CCol><CFormInput className={styles.addinput} type="number" id="num" required /></CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="percent" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                逸散率<br /><span className={styles.Note2} onClick={() => setCollapseVisible(!collapseVisible)}>逸散率(%)建議表格</span></CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="number" min='0' id="percent" required />
                            </CCol>
                            <CCollapse visible={collapseVisible}>
                                <CCard className="mt-3">
                                    <CCardBody>
                                        <img src='/src/assets/images/逸散率建議表格.png' />
                                    </CCardBody>
                                </CCard>
                            </CCollapse>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="explain" className={`col-sm-2 col-form-label ${styles.addlabel}`} >備註</CFormLabel>
                            <CCol><CFormTextarea className={styles.addinput} type="text" id="explain" rows={3} /></CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="photo" className={`col-sm-2 col-form-label ${styles.addlabel}`} >圖片*</CFormLabel>
                            <CCol><CFormInput type="file" id="photo" required /></CCol>
                        </CRow>
                        <br />
                        <div style={{ textAlign: 'center' }}>*為必填欄位</div>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton className="modalbutton1" onClick={editFillClose}>取消</CButton>
                    <CButton className="modalbutton2" type="submit">儲存</CButton>
                </CModalFooter>
            </CForm>
        </CModal>
    );
};


export default EditFillModal;