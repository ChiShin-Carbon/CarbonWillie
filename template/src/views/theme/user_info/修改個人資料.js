import React from 'react'
import {
    CRow, CCol, CCard, CCardBody, CCardHeader, CNav, CNavItem, CNavLink, CForm, CFormLabel, CFormInput, CButton,
} from '@coreui/react'

const Cards = () => {
    return (
      <CRow>
        <CCol xs={12}>
        <CCard className="mb-4">
          <CCardBody>
              <CCard >{/*className="text-center"*/ }
                <CCardHeader>
                  <CNav variant="tabs" className="card-header-tabs">
                    <CNavItem>
                      <CNavLink href="#" active>
                        Active
                      </CNavLink>
                    </CNavItem>
                    <CNavItem>
                      <CNavLink href="#">Link</CNavLink>
                    </CNavItem>
                    <CNavItem>
                      <CNavLink href="#" disabled>
                        Disabled
                      </CNavLink>
                    </CNavItem>
                  </CNav>
                </CCardHeader>
                <CCardBody>
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
                </CCardBody>
              </CCard>  
          </CCardBody>
        </CCard>
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

export default Cards