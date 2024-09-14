import React from 'react'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CTab,
  CTabContent,
  CTabList,
  CTabPanel,
  CTabs,
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
} from '@coreui/react'

const Tabs=()=>{
    return(
        <CRow>
        <CCol xs={12}>
            <CTabs activeItemKey={1}>
                <CTabList variant="underline-border">
                    <CTab aria-controls="home-tab-pane" itemKey={1}>
                    個人資料
                    </CTab>
                    <CTab aria-controls="profile-tab-pane" itemKey={2}>
                    修改個人資料
                    </CTab>
                    <CTab aria-controls="contact-tab-pane" itemKey={3}>
                    修改密碼
                    </CTab>
                </CTabList>
                <CTabContent>
                    <CTabPanel className="py-3" aria-labelledby="home-tab-pane" itemKey={1}>
                    <CCardBody>
                        <CCard className="mb-4">
                            <CCardHeader>
                                <strong style={{ fontSize: '1.2rem', borderBottom: '5px solid #d882c0' }}>個人資料</strong>
                            </CCardHeader>
                            <CCardBody>
                                <CForm>
                                    <CRow className="mb-3">
                                        <CCol sm={4}>
                                            <div className="mb-3">
                                                <CFormLabel htmlFor="account">帳號</CFormLabel>
                                                <CFormInput type="account" id="account" disabled readOnly/>
                                            </div>
                                        </CCol>
                                        <CCol sm={2}></CCol>
                                        <CCol sm={4}>
                                            <div className="mb-3">
                                                <CFormLabel htmlFor="email">姓名</CFormLabel>
                                                <CFormInput type="name" id="name" disabled readOnly/>
                                            </div>
                                        </CCol>
                                    </CRow>
                                    <CRow className="mb-3">
                                        <CCol sm={4}>
                                            <div className="mb-3">
                                                <CFormLabel htmlFor="account">電子郵件</CFormLabel>
                                                <CFormInput type="email" id="email" placeholder="name@example.com" disabled readOnly/>
                                            </div>
                                        </CCol>
                                        <CCol sm={2}></CCol>
                                        <CCol sm={4}>
                                            <div className="mb-3">
                                                <CFormLabel htmlFor="email">辦公室電話</CFormLabel>
                                                <CFormInput  type="name" id="phone" disabled readOnly/>
                                            </div>
                                        </CCol>
                                    </CRow>
                                    <CRow className="mb-3">
                                        <CCol sm={4}>
                                            <div className="mb-3">
                                                <CFormLabel htmlFor="account">所屬部門</CFormLabel>
                                                <CFormInput type="email" id="email" disabled readOnly/>
                                            </div>
                                        </CCol>
                                        <CCol sm={2}></CCol>
                                        <CCol sm={4}>
                                            <div className="mb-3">
                                                <CFormLabel htmlFor="email">職業</CFormLabel>
                                                <CFormInput type="phone" id="name" disabled readOnly/>
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
                                <strong style={{ fontSize: '1.2rem', borderBottom: '5px solid #d882c0' }}>修改個人資料</strong>
                            </CCardHeader>
                            <CCardBody>
                                <CForm>
                                    <CRow className="mb-3">
                                        <CCol sm={4}>
                                            <div className="mb-3">
                                                <CFormLabel htmlFor="account">帳號</CFormLabel>
                                                <CFormInput type="account" id="account"/>
                                            </div>
                                        </CCol>
                                        <CCol sm={2}></CCol>
                                        <CCol sm={4}>
                                            <div className="mb-3">
                                                <CFormLabel htmlFor="email">姓名</CFormLabel>
                                                <CFormInput type="name" id="name"/>
                                            </div>
                                        </CCol>
                                    </CRow>
                                    <CRow className="mb-3">
                                        <CCol sm={4}>
                                            <div className="mb-3">
                                                <CFormLabel htmlFor="account">電子郵件</CFormLabel>
                                                <CFormInput type="email" id="email" placeholder="name@example.com"/>
                                            </div>
                                        </CCol>
                                        <CCol sm={2}></CCol>
                                        <CCol sm={4}>
                                            <div className="mb-3">
                                                <CFormLabel htmlFor="email">辦公室電話</CFormLabel>
                                                <CFormInput  type="name" id="phone"/>
                                            </div>
                                        </CCol>
                                    </CRow>
                                    <CRow className="mb-3">
                                        <CCol sm={4}>
                                            <div className="mb-3">
                                                <CFormLabel htmlFor="account">所屬部門</CFormLabel>
                                                <CFormInput type="email" id="email"/>
                                            </div>
                                        </CCol>
                                        <CCol sm={2}></CCol>
                                        <CCol sm={4}>
                                            <div className="mb-3">
                                                <CFormLabel htmlFor="email">職業</CFormLabel>
                                                <CFormInput type="phone" id="name"/>
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


const FormControl = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>修改個人資料</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CRow className="mb-3">
                <CCol sm={4}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="account">帳號</CFormLabel>
                    <CFormInput
                      type="email"
                      id="account"
                    />
                  </div>
                </CCol>
                <CCol sm={2}></CCol>
                <CCol sm={4}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="email">姓名</CFormLabel>
                    <CFormInput
                      type="name"
                      id="name"
                    />
                  </div>
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol sm={4}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="account">電子郵件</CFormLabel>
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
                    <CFormLabel htmlFor="email">辦公室電話</CFormLabel>
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
                    <CFormLabel htmlFor="account">所屬部門</CFormLabel>
                    <CFormInput
                      type="email"
                      id="email"
                    />
                  </div>
                </CCol>
                <CCol sm={2}></CCol>
                <CCol sm={4}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="email">職業</CFormLabel>
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
      </CCol>
      
    </CRow>
  )
}

export default Tabs