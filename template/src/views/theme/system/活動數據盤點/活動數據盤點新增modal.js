import React from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CCard, CFormSelect, CTab, CTabList, CTabs,
    CTable, CTableBody, CTableHead, CFormCheck
    , CForm
} from '@coreui/react';

import styles from '../../../../scss/活動數據盤點.module.css'


const FunctionForms = ({ currentFunction }) => {
    switch (currentFunction) {
        case 'one':
            return (
                <div className={styles.addmodal}>
                    <CForm >
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="month" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票/收據日期</CFormLabel>
                            <CCol>
                                <CFormSelect aria-label="Default select example" id="month" className={styles.addinput}>
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
                            <CFormLabel htmlFor="num" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票號碼/收據編號</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="text" id="num" />
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CFormLabel htmlFor="unit" className={`col-sm-2 col-form-label ${styles.addlabel}`} >單位</CFormLabel>
                            <CCol>
                                <CFormSelect aria-label="Default select example" id="unit" className={styles.addinput}>
                                    <option value="1">公升</option>
                                    <option value="2">金額</option>
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="quantity" className={`col-sm-2 col-form-label ${styles.addlabel}`} >公升數/金額</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="text" id="quantity" />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="explain" className={`col-sm-2 col-form-label ${styles.addlabel}`} >備註</CFormLabel>
                            <CCol>
                                <CFormTextarea className={styles.addinput} type="text" id="explain" rows={3} />

                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="explain" className={`col-sm-2 col-form-label ${styles.addlabel}`} >圖片</CFormLabel>
                            <CCol>
                                <CFormInput type="file" id="formFile" />
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
                    <CFormLabel htmlFor="extinguisher">滅火器類型</CFormLabel>
                    <CFormInput type="text" id="extinguisher" placeholder="滅火器" />
                </div>
            );
        case 'four':
            return (
                <div>
                    <CFormLabel htmlFor="workHours">工作時數</CFormLabel>
                    <CFormInput type="number" id="workHours" placeholder="員工工作時數" />
                </div>
            );

        default:
            return <div>未選擇項目</div>;
    }
};

const ActivityModal = ({ isAddModalVisible, setAddModalVisible, currentFunction }) => {
    return (
        <CModal
            backdrop="static"
            visible={isAddModalVisible}
            onClose={() => setAddModalVisible(false)}
            aria-labelledby="ActivityModalLabel"
        >
            <CModalHeader>
                <CModalTitle id="ActivityModalLabel"><b>新增數據</b></CModalTitle>
            </CModalHeader>
            <CModalBody>
                {/* Dynamically render form based on currentFunction */}
                <FunctionForms currentFunction={currentFunction} />
            </CModalBody>
            <CModalFooter>
                <CButton className="modalbutton1" onClick={() => setAddModalVisible(false)}>
                    取消
                </CButton>
                <CButton className="modalbutton2">新增</CButton>
            </CModalFooter>
        </CModal>
    );
};

export default ActivityModal;
