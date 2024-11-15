import React, { useState } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CFormSelect, CForm
} from '@coreui/react';
import styles from '../../../scss/管理者.module.css';

import cities from './citiesData';

const AddModal = ({ isAddModalVisible, setAddModalVisible }) => {
    const handleClose = () => setAddModalVisible(false);

    const [county, setCounty] = useState(''); // 縣市
    const [town, setTown] = useState(''); // 鄉鎮
    const [postal_code, setPostalCode] = useState(''); // 郵遞區號

    const handleCountyChange = (e) => {
        const selectedCounty = e.target.value;
        setCounty(selectedCounty); // 更新縣市
        setTown(''); // 清空鄉鎮
        setPostalCode(''); // 清空郵遞區號
    };

    const handleTownChange = (e) => {
        const selectedTown = e.target.value;
        setTown(selectedTown); // 更新鄉鎮
        if (county && cities[county][selectedTown]) {
            setPostalCode(cities[county][selectedTown]); // 更新郵遞區號
        }
    };

    return (
        <CModal visible={isAddModalVisible} onClose={handleClose} className={styles.modal}>
            <CModalHeader>
                <h5><b>新增企業資料</b></h5>
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
                            <CFormLabel htmlFor="county" className={`col-sm-2 col-form-label ${styles.addlabel}`} >縣市別</CFormLabel>
                            <CCol>
                                <CFormSelect className={styles.addinput} type="text" id="county" value={county} onChange={handleCountyChange} required>
                                    <option value="">選擇縣市別</option>
                                    {Object.keys(cities).map((city) => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="town" className={`col-sm-2 col-form-label ${styles.addlabel}`} >鄉鎮別</CFormLabel>
                            <CCol>
                                <CFormSelect className={styles.addinput} type="text" id="town" value={town} onChange={handleTownChange}>
                                    <option value="">選擇鄉鎮別</option>
                                    {county &&
                                        Object.keys(cities[county]).map((township) => (
                                            <option key={township} value={township}>
                                                {township}
                                            </option>
                                        ))}
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="postal_code" className={`col-sm-2 col-form-label ${styles.addlabel}`} >郵遞區號</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="text" id="postal_code" value={postal_code} readOnly />
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
                    <CButton className="modalbutton2" type="submit">新增</CButton>
                </CModalFooter>
            </CForm>
        </CModal >
    );
};


export default AddModal;