// 編輯Modal.js
import React from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CFormSelect, CForm
} from '@coreui/react';
import styles from '../../../../scss/活動數據盤點.module.css';

const FunctionForms = ({ currentFunction }) => {
    switch (currentFunction) {
        case 'one':
            return (
                <div className={styles.addmodal}>
                    <CForm>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="date" className={`col-sm-4 col-form-label ${styles.addlabel}`}>發票/收據日期</CFormLabel>
                            <CCol>
                                <CFormInput type="date" id="date" />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="num" className={`col-sm-4 col-form-label ${styles.addlabel}`}>發票號碼/收據編號</CFormLabel>
                            <CCol>
                                <CFormInput type="text" id="num" />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="unit" className={`col-sm-4 col-form-label ${styles.addlabel}`}>單位</CFormLabel>
                            <CCol>
                                <CFormSelect id="unit" aria-label="Default select example">
                                    <option value="1">公升</option>
                                    <option value="2">金額</option>
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="quantity" className={`col-sm-4 col-form-label ${styles.addlabel}`}>公升數/金額</CFormLabel>
                            <CCol>
                                <CFormInput type="text" id="quantity" />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="explain" className={`col-sm-4 col-form-label ${styles.addlabel}`}>備註</CFormLabel>
                            <CCol>
                                <CFormTextarea id="explain" rows={3} />
                            </CCol>
                        </CRow>
                    </CForm>
                </div>
            );
        case 'two':
            return (
                <div>
                    <CFormLabel htmlFor="carTypeDiesel">車種</CFormLabel>
                    <CFormInput type="text" id="carTypeDiesel" placeholder="公務車(柴油)" />
                </div>
            );

        case 'three':
            return (
                <div>
                    <CFormLabel htmlFor="carTypeDiesel">車ddd</CFormLabel>
                    <CFormInput type="text" id="carTypeDiesel" placeholder="公務車(柴油)" />
                </div>
            );




        default:
            return <div>未選擇項目</div>;
    }
};

const EditModal = ({ isEditModalVisible, setEditModalVisible, currentFunction }) => {
    const handleClose = () => setEditModalVisible(false);

    return (
        <CModal visible={isEditModalVisible} onClose={handleClose} className={styles.modal}>
            <CModalHeader>
                <h5>編輯內容</h5>
            </CModalHeader>
            <CModalBody>
                {/* 根據 currentFunction 顯示不同的編輯內容 */}
                <FunctionForms currentFunction={currentFunction} />
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={handleClose}>取消</CButton>
                <CButton color="primary">儲存</CButton>
            </CModalFooter>
        </CModal>
    );
};

export default EditModal;
