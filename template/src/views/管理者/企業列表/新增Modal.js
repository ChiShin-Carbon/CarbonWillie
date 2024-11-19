import React, { useState } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CFormSelect, CForm
    , CFormCheck
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
        <CModal visible={isAddModalVisible} onClose={handleClose} className={styles.modal} size="xl">
            <CModalHeader>
                <h5><b>新增企業資料</b></h5>
            </CModalHeader>
            <CForm>
                <CModalBody>
                    <div className={styles.addmodal}>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="org_name" className={`col-sm-2 col-form-label ${styles.addlabel}`} >公私場所名稱</CFormLabel>
                            <CCol><CFormInput className={styles.addinput} type="text" id="org_name" required /></CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CFormLabel htmlFor="business_id" className={`col-sm-2 col-form-label ${styles.addlabel}`} >統一編號</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="text" id="business_id" required />
                            </CCol>
                            <CFormLabel htmlFor="registration_number" className={`col-sm-2 col-form-label ${styles.addlabel}`} >管制編號</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="text" id="registration_number" required />
                            </CCol>
                            <CFormLabel htmlFor="factory_number" className={`col-sm-2 col-form-label ${styles.addlabel}`} >工廠登記證編號</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="text" id="factory_number" required />
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
                            <CFormLabel htmlFor="charge_perso" className={`col-sm-2 col-form-label ${styles.addlabel}`} >負責人姓名</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="text" id="charge_perso" required />
                            </CCol>
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
                            <CFormLabel htmlFor="industry_code" className={`col-sm-2 col-form-label ${styles.addlabel}`} >行業代碼</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="text" id="industry_code" required />
                            </CCol>
                        </CRow>
                        <hr />
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="industry_name" className={`col-sm-2 col-form-label ${styles.addlabel}`} >登錄原因</CFormLabel>
                            <CCol>
                                <CFormSelect className={styles.addinput} id="edit_reason">
                                    <option value="1">自願性登錄</option>
                                    <option value="2">環評承諾</option>
                                    <option value="3">依法登錄</option>
                                    <option value="4">其他</option>
                                </CFormSelect>
                            </CCol>
                            <CFormLabel htmlFor="industry_code" className={`col-sm-2 col-form-label ${styles.addlabel}`} >選用GWP版本</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="text" id="edit_GWP_version" />
                            </CCol>
                            <CFormLabel htmlFor="industry_code" className={`col-sm-2 col-form-label ${styles.addlabel}`} >是否經第三方查證</CFormLabel>
                            <CCol>
                                <CFormSelect className={styles.addinput} id="edit_verification" >
                                    <option value="true">是</option>
                                    <option value="false">否</option>
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="industry_name" className={`col-sm-2 col-form-label ${styles.addlabel}`} >盤查依據規範</CFormLabel>
                            <CCol>
                                <CFormCheck type="checkbox" id="edit_GHG_Reg_Guide" label="溫室氣體排放量盤查登錄管理辦法 / 溫室氣體盤查登錄作業指引" />
                                <CFormCheck type="checkbox" id="edit_ISO_CNS_14064_1" label="ISO / CNS 14064-1" />
                                <CFormCheck type="checkbox" id="edit_GHG_Protocol" label="溫室氣體盤查議定書-企業會計與報告標準" />
                            </CCol>
                            <CFormLabel htmlFor="industry_code" className={`col-sm-2 col-form-label ${styles.addlabel}`} >查驗機構名稱</CFormLabel>
                            <CCol>
                                <CFormSelect className={styles.addinput} id="edit_inspection_agency" >
                                    <option value="0">選擇查驗機構</option>
                                    <option value="1">艾法諾國際股份有限公司(AFNOR)</option>
                                    <option value="2">香港商英國標準協會太平洋有限公司台灣分公司(Bsi)</option>
                                    <option value="3">台灣衛理國際品保驗證股份有限公司(BV)</option>
                                    <option value="4">立恩威國際驗證股份有限公司(DNV GL)</option>
                                    <option value="5">英商勞氏檢驗股份有限公司台灣分公司(LRQA)</option>
                                    <option value="6">台灣檢驗科技股份有限公司(SGS)</option>
                                    <option value="7">台灣德國萊因技術監護顧問股份有限公司(TÜV-Rh)</option>
                                    <option value="8">其他</option>
                                </CFormSelect>
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