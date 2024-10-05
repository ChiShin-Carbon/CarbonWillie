import React from 'react'
import {
    CRow, CCol, CCard, CCardBody, CCardHeader, CTab, CTabContent, CTabList, CTabPanel, CTabs, CForm, CFormLabel, CFormInput, CButton,CFormSelect 
} from '@coreui/react'
import '../../../scss/個人&企業資料.css';

const Tabs = () => {
    return (
        <CRow>
            <CCol xs={12}>
                <CTabs activeItemKey={1}>
                    <CTabList variant="underline-border" className="custom-tablist">
                        <CTab aria-controls="home-tab-pane" itemKey={1}>
                            企業資料
                        </CTab>
                        <CTab aria-controls="profile-tab-pane" itemKey={2}>
                            修改企業資料
                        </CTab>
                        <CTab aria-controls="profile-tab-pane" itemKey={3}>
                            修改盤查資訊
                        </CTab>
                    </CTabList>
                    <CTabContent>
                        <CTabPanel className="py-3" aria-labelledby="home-tab-pane" itemKey={1}>
                                <CCard className="mb-4 customCard">
                                    <CCardBody  className="customCard2">
                                        <div className="customCardHeader">
                                            <strong className="customtitlebottom">企業資料</strong>
                                        </div>
                                        <div className="customCardBody">
                                            <CForm>
                                                <CRow className="mb-3">
                                                    <CCol sm={12}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>機構名稱</strong></CFormLabel>
                                                            <CFormInput
                                                                type="org_name"
                                                                id="org_name"
                                                                placeholder="啟新醫事檢驗所"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>管制編號</strong></CFormLabel>
                                                            <CFormInput
                                                                type="registrationNo"
                                                                id="registrationNo"
                                                                placeholder="A39B6572"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>工廠登記證編號</strong></CFormLabel>
                                                            <CFormInput
                                                                type="factory_registrationNo"
                                                                id="factory_registrationNo"
                                                                placeholder=""
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={4}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>縣市別</strong></CFormLabel>
                                                            <CFormInput
                                                                type="county"
                                                                id="county"
                                                                placeholder="台北市"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={4}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>鄉鎮別</strong></CFormLabel>
                                                            <CFormInput
                                                                type="township"
                                                                id="township"
                                                                placeholder="中山區"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={4}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>郵遞區號</strong></CFormLabel>
                                                            <CFormInput
                                                                type="post_code"
                                                                id="post_code"
                                                                placeholder="10482"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={12}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>地址</strong></CFormLabel>
                                                            <CFormInput
                                                                type="org_address"
                                                                id="org_address"
                                                                placeholder="台北市中山區建國北路三段42號5樓"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>負責人姓名</strong></CFormLabel>
                                                            <CFormInput
                                                                type="responsible_person"
                                                                id="responsible_person"
                                                                placeholder="楊文仁"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>公私場所電子信箱</strong></CFormLabel>
                                                            <CFormInput
                                                                type="org_email"
                                                                id="org_email"
                                                                placeholder="company@gmail.com"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>聯絡人姓名</strong></CFormLabel>
                                                            <CFormInput
                                                                type="contact_person"
                                                                id="contact_person"
                                                                placeholder="XXX"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>Email</strong></CFormLabel>
                                                            <CFormInput
                                                                type="email"
                                                                id="email"
                                                                placeholder="name@gmail.com"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>電話</strong></CFormLabel>
                                                            <CFormInput
                                                                type="phone"
                                                                id="phone"
                                                                placeholder="039788787"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>手機</strong></CFormLabel>
                                                            <CFormInput
                                                                type="telephone"
                                                                id="telephone"
                                                                placeholder='0909563129'
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>行業名稱</strong></CFormLabel>
                                                            <CFormInput
                                                                type="industry_name"
                                                                id="industry_name"
                                                                placeholder='醫學檢驗業'
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>行業代碼</strong></CFormLabel>
                                                            <CFormInput
                                                                type="industry_code"
                                                                id="industry_code"
                                                                placeholder='8691'
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                            </CForm>
                                        </div>
                                    </CCardBody>
                                </CCard>
                                {/* 盤查資訊 */}
                                <CCard className="mb-4 customCard">
                                    <CCardBody  className="customCard2">
                                        <div className="customCardHeader">
                                            <strong className="customtitlebottom">盤查資訊</strong>
                                        </div>
                                        <div className="customCardBody">
                                            <CForm>
                                                <CRow className="mb-3">
                                                    <CCol sm={3}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>登錄原因</strong></CFormLabel>
                                                            <CFormInput
                                                                type="reason"
                                                                id="reason"
                                                                placeholder="自願性登錄"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={12}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>盤查依據規範</strong></CFormLabel>
                                                            <CFormInput
                                                                type="specification"
                                                                id="specification"
                                                                placeholder="溫室氣體排放量盤查登錄管理辦法/溫室氣體盤查登錄指引與ISO/CNS 14064-1"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={4}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>是否經第三方查證</strong></CFormLabel>
                                                            <CFormInput
                                                                type="verification"
                                                                id="verification"
                                                                placeholder="是"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={8}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>查驗機構名稱</strong></CFormLabel>
                                                            <CFormInput
                                                                type="inspection_agency"
                                                                id="inspection_agency"
                                                                placeholder="台灣檢驗科技股份有限公司(SGS)"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={4}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>顯著性門檻</strong></CFormLabel>
                                                            <CFormInput
                                                                type="significance"
                                                                id="significance"
                                                                placeholder="3.0%"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={4}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>實質性門檻</strong></CFormLabel>
                                                            <CFormInput
                                                                type="materiality"
                                                                id="materiality"
                                                                placeholder="5.0%"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={4}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>排除門檻</strong></CFormLabel>
                                                            <CFormInput
                                                                type="exclusion"
                                                                id="exclusion"
                                                                placeholder="0.5%"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                            </CForm>
                                        </div>
                                    </CCardBody>
                                </CCard>
                        </CTabPanel>
                        {/* 修改企業資料 */}
                        <CTabPanel className="py-3" aria-labelledby="profile-tab-pane" itemKey={2}>
                                <CCard className="mb-4 customCard">
                                    <CCardBody  className="customCard2">
                                        <div className="customCardHeader">
                                            <strong className="customtitlebottom">修改企業資料</strong>
                                        </div>
                                        <div className="customCardBody">
                                            <CForm>
                                                <CRow className="mb-3">
                                                    <CCol sm={12}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>機構名稱</strong></CFormLabel>
                                                            <CFormInput
                                                                type="org_name"
                                                                id="org_name" />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>管制編號</strong></CFormLabel>
                                                            <CFormInput
                                                                type="registrationNo"
                                                                id="registrationNo" />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>工廠登記證編號</strong></CFormLabel>
                                                            <CFormInput
                                                                type="factory_registrationNo"
                                                                id="factory_registrationNo" />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={4}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>縣市別</strong></CFormLabel>
                                                            <CFormInput
                                                                type="county"
                                                                id="county" />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={4}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>鄉鎮別</strong></CFormLabel>
                                                            <CFormInput
                                                                type="township"
                                                                id="township" />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={4}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>郵遞區號</strong></CFormLabel>
                                                            <CFormInput
                                                                type="post_code"
                                                                id="post_code" />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={12}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>地址</strong></CFormLabel>
                                                            <CFormInput
                                                                type="org_address"
                                                                id="org_address" />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>負責人姓名</strong></CFormLabel>
                                                            <CFormInput
                                                                type="responsible_person"
                                                                id="responsible_person" />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>公私場所電子信箱</strong></CFormLabel>
                                                            <CFormInput
                                                                type="org_email"
                                                                id="org_email" />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>聯絡人姓名</strong></CFormLabel>
                                                            <CFormInput
                                                                type="contact_person"
                                                                id="contact_person" />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>Email</strong></CFormLabel>
                                                            <CFormInput
                                                                type="email"
                                                                id="email" />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>電話</strong></CFormLabel>
                                                            <CFormInput
                                                                type="phone"
                                                                id="phone" />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>手機</strong></CFormLabel>
                                                            <CFormInput
                                                                type="telephone"
                                                                id="telephone" />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>行業名稱</strong></CFormLabel>
                                                            <CFormInput
                                                                type="industry_name"
                                                                id="industry_name" />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>行業代碼</strong></CFormLabel>
                                                            <CFormInput
                                                                type="industry_code"
                                                                id="industry_code" />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                            </CForm>
                                        </div>
                                    </CCardBody>
                                </CCard>
                        </CTabPanel>
                        <CTabPanel className="py-3" aria-labelledby="contact-tab-pane" itemKey={3}>
                        <CCard className="mb-4 customCard">
                                    <CCardBody  className="customCard2">
                                        <div className="customCardHeader">
                                            <strong className="customtitlebottom">盤查資訊</strong>
                                        </div>
                                        <div className="customCardBody">
                                            <CForm>
                                                <CRow className="mb-3">
                                                    <CCol sm={3}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>登錄原因</strong></CFormLabel>
                                                            <CFormSelect>
                                                                <option value="0">自願性登錄</option>
                                                                <option value="1">環評承諾</option>
                                                                <option value="2">依法登錄</option>
                                                                <option value="3">其他</option>
                                                            </CFormSelect>
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={12}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>盤查依據規範</strong></CFormLabel>
                                                            <CFormSelect>
                                                                <option value="0">溫室氣體排放量盤查登錄管理辦法/溫室氣體盤查登錄作業指引</option>
                                                                <option value="1">ISO / CNS 14064-1</option>
                                                                <option value="2">溫室氣體盤查議定書-企業會計與報告標準</option>
                                                            </CFormSelect>
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={4}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>是否經第三方查證</strong></CFormLabel>
                                                            <CFormSelect>
                                                                <option value="0">是</option>
                                                                <option value="1">否</option>
                                                            </CFormSelect>
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={8}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>查驗機構名稱</strong></CFormLabel>
                                                            <CFormSelect>
                                                                <option value="0">艾法諾國際股份有限公司(AFNOR)</option>
                                                                <option value="1">香港商英國標準協會太平洋有限公司台灣分公司(Bsi)</option>
                                                                <option value="2">台灣衛理國際品保驗證股份有限公司(BV)</option>
                                                                <option value="3">立恩威國際驗證股份有限公司(DNV GL)</option>
                                                                <option value="4">英商勞氏檢驗股份有限公司台灣分公司(LRQA)</option>
                                                                <option value="5">台灣檢驗科技股份有限公司(SGS)</option>
                                                                <option value="6">台灣德國萊因技術監護顧問股份有限公司(TÜV-Rh)</option>
                                                                <option value="7">其他</option>
                                                            </CFormSelect>
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={4}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>顯著性門檻</strong></CFormLabel>
                                                            <CFormInput
                                                                type="significance"
                                                                id="significance" />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={4}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>實質性門檻</strong></CFormLabel>
                                                            <CFormInput
                                                                type="materiality"
                                                                id="materiality" />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={4}>
                                                        <div className="mb-3">
                                                            <CFormLabel><strong>排除門檻</strong></CFormLabel>
                                                            <CFormInput
                                                                type="exclusion"
                                                                id="exclusion" />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                            </CForm>
                                        </div>
                                    </CCardBody>
                                </CCard>
                        </CTabPanel>
                    </CTabContent>
                </CTabs>
            </CCol>
        </CRow>
    )
}


export default Tabs