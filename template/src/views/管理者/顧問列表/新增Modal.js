import React, { useState } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CFormSelect, CForm
} from '@coreui/react';
import styles from '../../../scss/管理者.module.css';
import Select from 'react-select';

const options = [
    { value: 0, label: 'AAA股份有限公司' },
    { value: 1, label: 'BBB股份有限公司' },
];

const AddModal = ({ isAddModalVisible, setAddModalVisible }) => {
    const handleClose = () => setAddModalVisible(false);

    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleChange = (selected) => {
        setSelectedOptions(selected);
    };

    return (
        <CModal visible={isAddModalVisible} onClose={handleClose} className={styles.modal}>
            <CModalHeader>
                <h5><b>新增顧問資料</b></h5>
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
                            <CFormLabel htmlFor="email" className={`col-sm-2 col-form-label ${styles.addlabel}`} >電子郵件</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="email" id="email" required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="phone" className={`col-sm-2 col-form-label ${styles.addlabel}`} >手機</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="text" id="phone" required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="password" className={`col-sm-2 col-form-label ${styles.addlabel}`} >密碼</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="text" id="password" required />
                            </CCol>
                        </CRow>
                        <hr />
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="" className={`col-sm-2 col-form-label ${styles.addlabel}`} >負責企業</CFormLabel>
                            <Select
                                className={styles.addinput}
                                options={options}
                                isMulti
                                value={selectedOptions}
                                onChange={handleChange}
                                closeMenuOnSelect={false}
                            />
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