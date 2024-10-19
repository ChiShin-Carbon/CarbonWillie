// 編輯Modal.js
import React,{useState} from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CFormSelect, CForm
} from '@coreui/react';
import styles from '../../../../scss/活動數據盤點.module.css';

const FunctionForms = ({ currentFunction }) => {
     const [transportType, setTransportType] = useState("1"); // 默認選擇汽車
    switch (currentFunction) {

        case 'one':
            return (
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
                        <CFormLabel htmlFor="type" className={`col-sm-2 col-form-label ${styles.addlabel}`} >油種*</CFormLabel>
                        <CCol>
                            <CFormSelect aria-label="Default select example" id="type" className={styles.addinput}>
                                <option value="1">汽油</option>
                                <option value="2">柴油</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="unit" className={`col-sm-2 col-form-label ${styles.addlabel}`} >單位*<span className={styles.Note}> 選擇單位請以*公升*做為優先填寫項目</span></CFormLabel>
                        <CCol>
                            <CFormSelect aria-label="Default select example" id="unit" className={styles.addinput}>
                                <option value="1">公升</option>
                                <option value="2">金額</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="quantity" className={`col-sm-2 col-form-label ${styles.addlabel}`} >公升數/金額*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="quantity" required />
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
            );

            return (
                <div className={styles.addmodal}>

                    <CRow className="mb-3">
                        <CFormLabel htmlFor="month" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票/收據日期*</CFormLabel>
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
                        <CFormLabel htmlFor="num" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票號碼/收據編號*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="text" id="num" required />
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CFormLabel htmlFor="unit" className={`col-sm-2 col-form-label ${styles.addlabel}`} >單位*<span className={styles.Note}> 選擇單位請以*公升*做為優先填寫項目</span></CFormLabel>
                        <CCol>
                            <CFormSelect aria-label="Default select example" id="unit" className={styles.addinput}>
                                <option value="1">公升</option>
                                <option value="2">金額</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="quantity" className={`col-sm-2 col-form-label ${styles.addlabel}`} >公升數/金額*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="quantity" required />
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
            );
        case 'two':
            return (
                <div className={styles.addmodal}>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="name" className={`col-sm-2 col-form-label ${styles.addlabel}`} >品名*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="text" id="name" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="element" className={`col-sm-2 col-form-label ${styles.addlabel}`} >成分*</CFormLabel>
                        <CCol>
                            <CFormSelect aria-label="Default select example" id="element" className={styles.addinput}>
                                <option value="1">CO2</option>
                                <option value="2">HFC-236ea</option>
                                <option value="3">HFC-236fa</option>
                                <option value="4">HFC-227ea</option>
                                <option value="5">CF3CHFCF3</option>
                                <option value="6">CHF3</option>
                                <option value="7">其他</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="weight" className={`col-sm-2 col-form-label ${styles.addlabel}`} >規格(重量)*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="weight" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="explain" className={`col-sm-2 col-form-label ${styles.addlabel}`} >備註</CFormLabel>
                        <CCol>
                            <CFormTextarea className={styles.addinput} type="text" id="explain" rows={3} />

                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="photo" className={`col-sm-2 col-form-label ${styles.addlabel}`} >圖片*</CFormLabel>
                        <CCol>
                            <CFormInput type="file" id="photo" required />
                        </CCol>
                    </CRow>
                    <br />
                    <div style={{ textAlign: 'center' }}>*為必填欄位</div>

                </div>
            );
        case 'three':
            return (
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
                        <CFormLabel htmlFor="people" className={`col-sm-2 col-form-label ${styles.addlabel}`} >員工數*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="people" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="workhour" className={`col-sm-2 col-form-label ${styles.addlabel}`} >每日工時*<br /><span className={styles.Note}> 不含休息時間</span></CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="workhour" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="workday" className={`col-sm-2 col-form-label ${styles.addlabel}`} >每月工作日數*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="workday" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="plushou" className={`col-sm-2 col-form-label ${styles.addlabel}`} >總加班時數</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="plushour" />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="sickhour" className={`col-sm-2 col-form-label ${styles.addlabel}`} >總病假時數</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="sickhour" />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="personalhour" className={`col-sm-2 col-form-label ${styles.addlabel}`} >總事假時數</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="personalhour" />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="businesshour" className={`col-sm-2 col-form-label ${styles.addlabel}`} >總出差時數</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="businesshour" />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="deadhour" className={`col-sm-2 col-form-label ${styles.addlabel}`} >總婚喪時數</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="deadhour" />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="resthour" className={`col-sm-2 col-form-label ${styles.addlabel}`} >總特休時數</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="resthour" />
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
            );
        case 'four':
            return (
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
            );
        case 'five':
            const [visible, setVisible] = useState(false)
            return (
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
                        <CFormLabel htmlFor="type" className={`col-sm-2 col-form-label ${styles.addlabel}`} >設備類型*</CFormLabel>
                        <CCol>
                            <CFormSelect aria-label="Default select example" id="type" className={styles.addinput} >
                                <option value="1">冰箱</option>
                                <option value="2">冷氣機</option>
                                <option value="3">飲水機</option>
                                <option value="4">冰水主機</option>
                                <option value="5">空壓機</option>
                                <option value="6">除濕機</option>
                                <option value="7">車用冷媒</option>
                                <option value="8">製冰機</option>
                                <option value="9">冰櫃</option>
                                <option value="10">冷凍櫃</option>
                                <option value="11">其他</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="site" className={`col-sm-2 col-form-label ${styles.addlabel}`} >設備位置*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="text" id="site" required />
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CFormLabel htmlFor="type2" className={`col-sm-2 col-form-label ${styles.addlabel}`} >冷媒類型*</CFormLabel>
                        <CCol>
                            <CFormSelect aria-label="Default select example" id="type2" className={styles.addinput} >
                                <option value="1">R11</option>
                                <option value="2">R12</option>
                                <option value="3">R22</option>
                                <option value="4">R-32</option>
                                <option value="5">R-123</option>
                                <option value="6">R-23</option>
                                <option value="7">R-134a</option>
                                <option value="8">R-404A</option>
                                <option value="9">R-407a</option>
                                <option value="10">R-410A</option>
                                <option value="11">R-600a</option>
                                <option value="12">R-417a</option>
                                <option value="13">F22</option>
                                <option value="14">HCR-600A</option>
                                <option value="15">HFC-134a</option>
                                <option value="16">R401A</option>
                                <option value="17">其他</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="quantity" className={`col-sm-2 col-form-label ${styles.addlabel}`} >填充料(公克)*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="quantity" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="num" className={`col-sm-2 col-form-label ${styles.addlabel}`} >數量*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="num" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="percent" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                            逸散率<br /><span className={styles.Note2} onClick={() => setVisible(!visible)}>逸散率(%)建議表格</span></CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="percent" required />
                        </CCol>
                        <CCollapse visible={visible}>
                            <CCard className="mt-3">
                                <CCardBody>
                                    <img src='/src/assets/images/逸散率建議表格.png' />
                                </CCardBody>
                            </CCard>
                        </CCollapse>
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
            );
        case 'six':
            return (
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
                        <CFormLabel htmlFor="site" className={`col-sm-2 col-form-label ${styles.addlabel}`} >設備位置*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="text" id="site" required />
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CFormLabel htmlFor="type2" className={`col-sm-2 col-form-label ${styles.addlabel}`} >能源類型*</CFormLabel>
                        <CCol>
                            <CFormSelect aria-label="Default select example" id="type2" className={styles.addinput} >
                                <option value="1">柴油</option>
                                <option value="2">汽油</option>
                                <option value="3">其他</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="quantity" className={`col-sm-2 col-form-label ${styles.addlabel}`} >使用量(公克)*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="quantity" required />
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
            );
        case 'seven':
            return (
                <div className={styles.addmodal}>

                    <CRow className="mb-3">
                        <CFormLabel htmlFor="date" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票/收據日期*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="date" id="date" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="num" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票號碼/收據編號*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="text" id="num" required />
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CFormLabel htmlFor="quantity" className={`col-sm-2 col-form-label ${styles.addlabel}`} >使用量(公升)*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="quantity" required />
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
            );
        case 'eight':
            return (
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
            );
        case 'nine':


            return (
                <div className={styles.addmodal}>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="type" className={`col-sm-2 col-form-label ${styles.addlabel}`} >交通方式*</CFormLabel>
                        <CCol>
                            <CFormSelect aria-label="Default select example" id="type" className={styles.addinput}
                                onChange={(e) => setTransportType(e.target.value)} >
                                <option value="1">汽車</option>
                                <option value="2">機車</option>
                                <option value="3">公車</option>
                                <option value="4">捷運</option>
                                <option value="5">火車</option>
                                <option value="6">高鐵</option>
                                <option value="7">客運</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="oil" className={`col-sm-2 col-form-label ${styles.addlabel}`} >油種*<span className={styles.Note}>僅汽/機車須填寫</span></CFormLabel>
                        <CCol>
                            <CFormSelect aria-label="Default select example" id="type" className={styles.addinput} disabled={!(transportType === "1" || transportType === "2")} >
                                <option value="1">無</option>
                                <option value="2">汽油</option>
                                <option value="3">柴油</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="km" className={`col-sm-2 col-form-label ${styles.addlabel}`} >公里數*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" id="km" required />
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
            );


            return (
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
            );
        case 'ten':


            return (
                <div className={styles.addmodal}>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="type" className={`col-sm-2 col-form-label ${styles.addlabel}`} >交通方式*</CFormLabel>
                        <CCol>
                            <CFormSelect aria-label="Default select example" id="type" className={styles.addinput}
                                onChange={(e) => setTransportType(e.target.value)} >
                                <option value="1">汽車</option>
                                <option value="2">機車</option>
                                <option value="3">公車</option>
                                <option value="4">捷運</option>
                                <option value="5">火車</option>
                                <option value="6">高鐵</option>
                                <option value="7">客運</option>
                                <option value="8">飛機</option>
                                <option value="9">輪船</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="oil" className={`col-sm-2 col-form-label ${styles.addlabel}`} >油種*<span className={styles.Note}>僅汽/機車須填寫</span></CFormLabel>
                        <CCol>
                            <CFormSelect aria-label="Default select example" id="type" className={styles.addinput} disabled={!(transportType === "1" || transportType === "2")} >
                                <option value="1">無</option>
                                <option value="2">汽油</option>
                                <option value="3">柴油</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="km" className={`col-sm-2 col-form-label ${styles.addlabel}`} >公里數*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" id="km" required />
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
            );
        case 'eleven':
            return (
                <div className={styles.addmodal}>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="item" className={`col-sm-2 col-form-label ${styles.addlabel}`} >廢棄物項目*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="text" id="item" required />
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
            );
        case 'twelve':
            return (
                <div className={styles.addmodal}>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="item" className={`col-sm-2 col-form-label ${styles.addlabel}`} >廢棄物項目*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="text" id="item" required />
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
                <h5><b>編輯數據</b></h5>
            </CModalHeader>
            <CForm>
                <CModalBody>
                    {/* 根據 currentFunction 顯示不同的編輯內容 */}
                    <FunctionForms currentFunction={currentFunction} />
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
