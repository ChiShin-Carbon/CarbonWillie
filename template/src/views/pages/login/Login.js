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

                  <CInputGroup className="mb-3">
                    <CInputGroupText style={{border:'none',backgroundColor:'white'}}>
                     <b>帳號</b>
                    </CInputGroupText>
                    <CFormInput
                     placeholder="請輸入您的使用者帳號"
                     autoComplete="username"
                     style={{borderRadius:'30px',backgroundColor:'#F0F0F0'}} />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText style={{border:'none',backgroundColor:'white'}}>
                    <b>密碼</b>
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="請輸入您的使用者密碼"
                      autoComplete="current-password"
                      style={{borderRadius:'30px',backgroundColor:'#F0F0F0'}}
                    />
                  </CInputGroup>

                  <CRow>
                    <CCol>
                      <p className="px-0" style={{color:'black'}}>
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

          </div>

        </CCardGroup>


      </div>
    </div >
  )
}

export default Login
