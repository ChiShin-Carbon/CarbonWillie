import React from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import '../../../scss/login.css';

const Login = () => {
  return (
    // <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
    <div class="login">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <div className="text-white py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h1>Chi Shin</h1>
                    <p>
                      Carbon Footprint <br></br>
                      Verification System
                    </p>
                    <hr></hr>
                    <p>精準碳盤查，全面掌握碳足跡， <br></br>
                      助您輕鬆邁向永續未來，共同創造綠色明天</p>

                  </div>
                </CCardBody>
              </div>
              <CCard className="p-4">
                <CCardBody class="aligncenter">
                  <img src="/src/assets/images/啟新logo.png"></img>
                  <CForm>
                    <div class="aligncenter">
                      <h2>登入</h2>
                      <p class="word">請輸入您的帳號密碼登入</p>
                    </div>
                    <hr></hr>

                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput placeholder="Username" autoComplete="username" />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                      />
                    </CInputGroup>

                    <CRow>
                      <CCol>
                        <p className="px-0">
                          尚未有帳號?
                        </p>
                      </CCol>
                      <CCol>
                        <Link to="/register">
                          <p>
                            建立新帳號
                          </p>
                        </Link>
                      </CCol>
                    </CRow>
                        <CButton class="button" className="px-4">
                          Login
                        </CButton>


                   
                  </CForm>
                </CCardBody>
              </CCard>

            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
