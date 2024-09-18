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
  CFormLabel
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import '../../../scss/login.css';

const Login = () => {
  return (
    // <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
    <div class="login">
      <div className="overlay"></div>
      <div className="content">
        <CCardGroup>
          <div className="text-white py-5" class="text">

            <div>
              <h1>Chi Shin</h1>
              <h3>
                Carbon Footprint <br></br>
                Verification System
              </h3>
              <hr class="texthr"></hr>
              <p>精準碳盤查，全面掌握碳足跡， <br></br>
                助您輕鬆邁向永續未來，共同創造綠色明天</p>

            </div>

          </div>
          <div class="card1">
            <CCard class="logincard" className="p-4">
              <CCardBody class="aligncenter">
                <img src="/src/assets/images/啟新logo.png"></img>
                <CForm>
                  <div class="aligncenter">
                    <h2>登入</h2>
                    <p class="word">請輸入您的帳號密碼登入</p>
                  </div>
                  <hr></hr>

                  <CRow className="mb-3">
                  <CFormLabel htmlFor="account" className="col-sm-2 col-form-label customlabel" >使用者帳號</CFormLabel>
                  <CCol>
                    <CFormInput className="custominput" type="text" id="account" placeholder="請填寫您的使用者帳號" />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CFormLabel htmlFor="Password" className="col-sm-2 col-form-label customlabel" >使用者密碼</CFormLabel>
                  <CCol>
                    <CFormInput className="custominput" type="password" id="Password" placeholder="請填寫您的密碼" />
                  </CCol>
                </CRow>

                  <CRow>
                    <CCol>
                      <p className="px-0" style={{color:'black'}}>
                        尚未有帳號?
                      </p>
                    </CCol>
                    <CCol>
                      <Link to="../register">
                        <p>
                          建立新帳號
                        </p>
                      </Link>
                    </CCol>
                  </CRow>
                  <CButton class="custom-button" className="px-4">
                    登入
                  </CButton>



                </CForm>
              </CCardBody>
            </CCard>

          </div>

        </CCardGroup>


      </div>
    </div >
  )
}

export default Login
