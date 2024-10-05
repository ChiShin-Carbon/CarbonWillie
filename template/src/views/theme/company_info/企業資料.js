import React from 'react'
import {
    CRow, CCol, CCard, CCardBody, CCardHeader, CTab, CTabContent, CTabList, CTabPanel, CTabs, CForm, CFormLabel, CFormInput, CButton,
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
                                                            <CFormLabel htmlFor="account"><strong>機構名稱</strong></CFormLabel>
                                                            <CFormInput
                                                                type="name"
                                                                id="name"
                                                                placeholder="啟新醫事檢驗所"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="account"><strong>管制編號</strong></CFormLabel>
                                                            <CFormInput
                                                                type="registrationno"
                                                                id="registrationno"
                                                                placeholder="A39B6572"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="email"><strong>核准字號</strong></CFormLabel>
                                                            <CFormInput
                                                                type="permitno"
                                                                id="permitno"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={4}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="account"><strong>縣市別</strong></CFormLabel>
                                                            <CFormInput
                                                                type="country"
                                                                id="country"
                                                                placeholder="台北市"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={4}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="email"><strong>鄉鎮別</strong></CFormLabel>
                                                            <CFormInput
                                                                type="township"
                                                                id="township"
                                                                placeholder="中山區"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={4}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="email"><strong>郵遞區號</strong></CFormLabel>
                                                            <CFormInput
                                                                type="postal_code"
                                                                id="postal_code"
                                                                placeholder="10482"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={12}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="account"><strong>地址</strong></CFormLabel>
                                                            <CFormInput
                                                                type="address"
                                                                id="address"
                                                                placeholder="台北市中山區建國北路三段42號5樓"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="account"><strong>負責人姓名</strong></CFormLabel>
                                                            <CFormInput
                                                                type="head"
                                                                id="head"
                                                                placeholder="楊文仁"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="email"><strong>公私場所電子信箱</strong></CFormLabel>
                                                            <CFormInput
                                                                type="telephone"
                                                                id="telephone"
                                                                placeholder="02-25070723"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="account"><strong>聯絡人姓名</strong></CFormLabel>
                                                            <CFormInput
                                                                type="email"
                                                                id="email"
                                                                placeholder="name@example.com"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="email"><strong>Email</strong></CFormLabel>
                                                            <CFormInput
                                                                type="mobile"
                                                                id="mobile"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="account"><strong>電話</strong></CFormLabel>
                                                            <CFormInput
                                                                type="email"
                                                                id="email"
                                                                placeholder="name@example.com"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="email"><strong>手機</strong></CFormLabel>
                                                            <CFormInput
                                                                type="mobile"
                                                                id="mobile"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="account"><strong>行業名稱</strong></CFormLabel>
                                                            <CFormInput
                                                                type="industry_name"
                                                                id="industry_name"
                                                                placeholder='醫學檢驗業'
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="email"><strong>行業代碼</strong></CFormLabel>
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
                        </CTabPanel>
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
                                                            <CFormLabel htmlFor="account"><strong>機構名稱</strong></CFormLabel>
                                                            <CFormInput
                                                                type="name"
                                                                id="name"
                                                            />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="account"><strong>管制編號</strong></CFormLabel>
                                                            <CFormInput
                                                                type="registrationno"
                                                                id="registrationno"
                                                            />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="email"><strong>核准字號</strong></CFormLabel>
                                                            <CFormInput
                                                                type="permitno"
                                                                id="permitno"
                                                            />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={4}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="account"><strong>縣市別</strong></CFormLabel>
                                                            <CFormInput
                                                                type="country"
                                                                id="country"
                                                            />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={4}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="email"><strong>鄉鎮別</strong></CFormLabel>
                                                            <CFormInput
                                                                type="township"
                                                                id="township"
                                                            />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={4}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="email"><strong>郵遞區號</strong></CFormLabel>
                                                            <CFormInput
                                                                type="address"
                                                                id="address"
                                                            />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={12}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="account"><strong>地址</strong></CFormLabel>
                                                            <CFormInput
                                                                type="postal_code"
                                                                id="postal_code"
                                                            />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="account"><strong>負責人姓名</strong></CFormLabel>
                                                            <CFormInput
                                                                type="head"
                                                                id="head"
                                                            />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="email"><strong>公私場所Email</strong></CFormLabel>
                                                            <CFormInput
                                                                type="telephone"
                                                                id="telephone"
                                                            />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <strong style={{ textDecoration: 'underline',fontSize:'1.2rem' }}>聯絡人資訊</strong>
                                                <br></br>
                                                <CRow className="mb-3">
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="account"><strong>聯絡人姓名</strong></CFormLabel>
                                                            <CFormInput
                                                                type="email"
                                                                id="email"
                                                            />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="email"><strong>Email</strong></CFormLabel>
                                                            <CFormInput
                                                                type="mobile"
                                                                id="mobile"
                                                            />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="account"><strong>電話</strong></CFormLabel>
                                                            <CFormInput
                                                                type="email"
                                                                id="email"
                                                            />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="email"><strong>手機</strong></CFormLabel>
                                                            <CFormInput
                                                                type="mobile"
                                                                id="mobile"
                                                            />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="account"><strong>行業名稱</strong></CFormLabel>
                                                            <CFormInput
                                                                type="industry_name"
                                                                id="industry_name"
                                                            />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="email"><strong>行業代碼</strong></CFormLabel>
                                                            <CFormInput
                                                                type="industry_code"
                                                                id="industry_code"
                                                            />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <div className="col-auto text-center">
                                                    <CButton color="primary" type="submit" className="mb-3 customButton">
                                                        保存資料
                                                    </CButton>
                                                </div>
                                            </CForm>
                                        </div>
                                    </CCardBody>
                                </CCard>
                        </CTabPanel>
                        <CTabPanel className="py-3" aria-labelledby="contact-tab-pane" itemKey={3}>
                            Contact tab content
                        </CTabPanel>
                        <CTabPanel className="py-3" aria-labelledby="disabled-tab-pane" itemKey={4}>
                            Disabled tab content
                        </CTabPanel>
                    </CTabContent>
                </CTabs>
            </CCol>
        </CRow>
    )
}


export default Tabs