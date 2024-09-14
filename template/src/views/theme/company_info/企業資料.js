import React from 'react'
import {
    CRow, CCol, CCard, CCardBody, CCardHeader, CNav, CNavItem, CNavLink, CForm, CFormLabel, CFormInput, CButton,
} from '@coreui/react'

const Tabs = () => {
    return (
        <CRow>
        <CCol xs={12}>
            <CTabs activeItemKey={1}>
                <CTabList variant="underline-border">
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
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>企業資料</strong>
                    </CCardHeader>
                    <CCardBody>
                        <CForm>
                        <CRow className="mb-3">
                            <CCol sm={10}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="account">機構名稱</CFormLabel>
                                <CFormInput
                                type="email"
                                id="account"
                                />
                            </div>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CCol sm={4}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="account">管制編號</CFormLabel>
                                <CFormInput
                                type="email"
                                id="email"
                                placeholder="name@example.com"
                                />
                            </div>
                            </CCol>
                            <CCol sm={2}></CCol>
                            <CCol sm={4}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="email">核准字號</CFormLabel>
                                <CFormInput
                                type="phone"
                                id="name"
                                />
                            </div>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CCol sm={4}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="account">縣市別</CFormLabel>
                                <CFormInput
                                type="email"
                                id="email"
                                />
                            </div>
                            </CCol>
                            <CCol sm={2}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="email">鄉村地區別</CFormLabel>
                                <CFormInput
                                type="phone"
                                id="name"
                                />
                            </div>
                            </CCol>
                            <CCol sm={4}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="email">里別</CFormLabel>
                                <CFormInput
                                type="phone"
                                id="name"
                                />
                            </div>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CCol sm={6}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="account">地址</CFormLabel>
                                <CFormInput
                                type="email"
                                id="email"
                                placeholder="name@example.com"
                                />
                            </div>
                            </CCol>
                            <CCol sm={4}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="email">郵遞區號</CFormLabel>
                                <CFormInput
                                type="phone"
                                id="name"
                                />
                            </div>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CCol sm={4}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="account">負責人姓名</CFormLabel>
                                <CFormInput
                                type="email"
                                id="email"
                                placeholder="name@example.com"
                                />
                            </div>
                            </CCol>
                            <CCol sm={2}></CCol>
                            <CCol sm={4}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="email">電話</CFormLabel>
                                <CFormInput
                                type="phone"
                                id="name"
                                />
                            </div>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CCol sm={4}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="account">電子信箱</CFormLabel>
                                <CFormInput
                                type="email"
                                id="email"
                                placeholder="name@example.com"
                                />
                            </div>
                            </CCol>
                            <CCol sm={2}></CCol>
                            <CCol sm={4}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="email">手機</CFormLabel>
                                <CFormInput
                                type="phone"
                                id="name"
                                />
                            </div>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CCol sm={4}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="account">行業名稱</CFormLabel>
                                <CFormInput
                                type="email"
                                id="email"
                                />
                            </div>
                            </CCol>
                            <CCol sm={2}></CCol>
                            <CCol sm={4}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="email">行業代碼</CFormLabel>
                                <CFormInput
                                type="phone"
                                id="name"
                                />
                            </div>
                            </CCol>
                        </CRow>
                        </CForm>
                    </CCardBody>
                </CCard>
                </CCardBody>
                </CTabPanel>
                <CTabPanel className="py-3" aria-labelledby="profile-tab-pane" itemKey={2}>
                <CCardBody>
                    <CCard className="mb-4">
                        <CCardHeader>
                            <strong>修改企業資料</strong>
                        </CCardHeader>
                    <CCardBody>
                <CForm>
                <CRow className="mb-3">
                    <CCol sm={10}>
                    <div className="mb-3">
                        <CFormLabel htmlFor="account">機構名稱</CFormLabel>
                        <CFormInput
                        type="email"
                        id="account"
                        />
                    </div>
                    </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CCol sm={4}>
                    <div className="mb-3">
                        <CFormLabel htmlFor="account">管制編號</CFormLabel>
                        <CFormInput
                        type="email"
                        id="email"
                        placeholder="name@example.com"
                        />
                    </div>
                    </CCol>
                    <CCol sm={2}></CCol>
                    <CCol sm={4}>
                    <div className="mb-3">
                        <CFormLabel htmlFor="email">核准字號</CFormLabel>
                        <CFormInput
                        type="phone"
                        id="name"
                        />
                    </div>
                    </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CCol sm={4}>
                    <div className="mb-3">
                        <CFormLabel htmlFor="account">縣市別</CFormLabel>
                        <CFormInput
                        type="email"
                        id="email"
                        />
                    </div>
                    </CCol>
                    <CCol sm={2}>
                    <div className="mb-3">
                        <CFormLabel htmlFor="email">鄉村地區別</CFormLabel>
                        <CFormInput
                        type="phone"
                        id="name"
                        />
                    </div>
                    </CCol>
                    <CCol sm={4}>
                    <div className="mb-3">
                        <CFormLabel htmlFor="email">里別</CFormLabel>
                        <CFormInput
                        type="phone"
                        id="name"
                        />
                    </div>
                    </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CCol sm={6}>
                    <div className="mb-3">
                        <CFormLabel htmlFor="account">地址</CFormLabel>
                        <CFormInput
                        type="email"
                        id="email"
                        placeholder="name@example.com"
                        />
                    </div>
                    </CCol>
                    <CCol sm={4}>
                    <div className="mb-3">
                        <CFormLabel htmlFor="email">郵遞區號</CFormLabel>
                        <CFormInput
                        type="phone"
                        id="name"
                        />
                    </div>
                    </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CCol sm={4}>
                    <div className="mb-3">
                        <CFormLabel htmlFor="account">負責人姓名</CFormLabel>
                        <CFormInput
                        type="email"
                        id="email"
                        placeholder="name@example.com"
                        />
                    </div>
                    </CCol>
                    <CCol sm={2}></CCol>
                    <CCol sm={4}>
                    <div className="mb-3">
                        <CFormLabel htmlFor="email">電話</CFormLabel>
                        <CFormInput
                        type="phone"
                        id="name"
                        />
                    </div>
                    </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CCol sm={4}>
                    <div className="mb-3">
                        <CFormLabel htmlFor="account">電子信箱</CFormLabel>
                        <CFormInput
                        type="email"
                        id="email"
                        placeholder="name@example.com"
                        />
                    </div>
                    </CCol>
                    <CCol sm={2}></CCol>
                    <CCol sm={4}>
                    <div className="mb-3">
                        <CFormLabel htmlFor="email">手機</CFormLabel>
                        <CFormInput
                        type="phone"
                        id="name"
                        />
                    </div>
                    </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CCol sm={4}>
                    <div className="mb-3">
                        <CFormLabel htmlFor="account">行業名稱</CFormLabel>
                        <CFormInput
                        type="email"
                        id="email"
                        />
                    </div>
                    </CCol>
                    <CCol sm={2}></CCol>
                    <CCol sm={4}>
                    <div className="mb-3">
                        <CFormLabel htmlFor="email">行業代碼</CFormLabel>
                        <CFormInput
                        type="phone"
                        id="name"
                        />
                    </div>
                    </CCol>
                </CRow>
              <div className="col-auto text-center">
                <CButton color="primary" type="submit" className="mb-3">
                  保存資料
                </CButton>
              </div>
            </CForm>
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