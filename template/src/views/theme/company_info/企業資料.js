import React from 'react'
import {
    CRow, CCol, CCard, CCardBody, CCardHeader, CTab, CTabContent, CTabList, CTabPanel, CTabs, CForm, CFormLabel, CFormInput, CButton,
} from '@coreui/react'

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
                            <CCardBody>
                                <CCard className="mb-4 customCard">
                                    <CCardBody>
                                        <div className="customCardHeader">
                                            <strong className="customtitlebottom">企業資料</strong>
                                        </div>
                                        <div className="customCardBody">

                                            <CForm>
                                                <CRow className="mb-3">
                                                    <CCol sm={12}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="account">機構名稱</CFormLabel>
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
                                                            <CFormLabel htmlFor="account">管制編號</CFormLabel>
                                                            <CFormInput
                                                                type="registrationno"
                                                                id="registrationno"
                                                                placeholder="A39B6572"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="email">核准字號</CFormLabel>
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
                                                            <CFormLabel htmlFor="account">縣市別</CFormLabel>
                                                            <CFormInput
                                                                type="country"
                                                                id="country"
                                                                placeholder="台北市"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={4}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="email">鄉鎮別</CFormLabel>
                                                            <CFormInput
                                                                type="township"
                                                                id="township"
                                                                placeholder="中山區"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={4}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="email">里別</CFormLabel>
                                                            <CFormInput
                                                                type="village"
                                                                id="village"
                                                                placeholder="行政里"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={8}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="account">地址</CFormLabel>
                                                            <CFormInput
                                                                type="address"
                                                                id="address"
                                                                placeholder="台北市中山區建國北路三段42號5樓"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={4}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="email">郵遞區號</CFormLabel>
                                                            <CFormInput
                                                                type="postal_code"
                                                                id="postal_code"
                                                                placeholder="10482"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="account">負責人姓名</CFormLabel>
                                                            <CFormInput
                                                                type="head"
                                                                id="head"
                                                                placeholder="楊文仁"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="email">電話</CFormLabel>
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
                                                            <CFormLabel htmlFor="account">電子信箱</CFormLabel>
                                                            <CFormInput
                                                                type="email"
                                                                id="email"
                                                                placeholder="name@example.com"
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="email">手機</CFormLabel>
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
                                                            <CFormLabel htmlFor="account">行業名稱</CFormLabel>
                                                            <CFormInput
                                                                type="industry_name"
                                                                id="industry_name"
                                                                placeholder='醫學檢驗業'
                                                                disabled readOnly />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="email">行業代碼</CFormLabel>
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
                            </CCardBody>
                        </CTabPanel>
                        <CTabPanel className="py-3" aria-labelledby="profile-tab-pane" itemKey={2}>
                            <CCardBody>
                                <CCard className="mb-4 customCard">

                                    <CCardBody>
                                        <div className="customCardHeader">
                                            <strong className="customtitlebottom">修改企業資料</strong>
                                        </div>
                                        <div className="customCardBody">
                                            <CForm>
                                                <CRow className="mb-3">
                                                    <CCol sm={12}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="account">機構名稱</CFormLabel>
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
                                                            <CFormLabel htmlFor="account">管制編號</CFormLabel>
                                                            <CFormInput
                                                                type="registrationno"
                                                                id="registrationno"
                                                            />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="email">核准字號</CFormLabel>
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
                                                            <CFormLabel htmlFor="account">縣市別</CFormLabel>
                                                            <CFormInput
                                                                type="country"
                                                                id="country"
                                                            />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={4}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="email">鄉鎮別</CFormLabel>
                                                            <CFormInput
                                                                type="township"
                                                                id="township"
                                                            />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={4}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="email">里別</CFormLabel>
                                                            <CFormInput
                                                                type="village"
                                                                id="village"
                                                            />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={8}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="account">地址</CFormLabel>
                                                            <CFormInput
                                                                type="postal_code"
                                                                id="postal_code"
                                                            />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={4}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="email">郵遞區號</CFormLabel>
                                                            <CFormInput
                                                                type="address"
                                                                id="address"
                                                            />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="account">負責人姓名</CFormLabel>
                                                            <CFormInput
                                                                type="head"
                                                                id="head"
                                                            />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="email">電話</CFormLabel>
                                                            <CFormInput
                                                                type="telephone"
                                                                id="telephone"
                                                            />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="account">電子信箱</CFormLabel>
                                                            <CFormInput
                                                                type="email"
                                                                id="email"
                                                            />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="email">手機</CFormLabel>
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
                                                            <CFormLabel htmlFor="account">行業名稱</CFormLabel>
                                                            <CFormInput
                                                                type="industry_name"
                                                                id="industry_name"
                                                            />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={6}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="email">行業代碼</CFormLabel>
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
                            </CCardBody>
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