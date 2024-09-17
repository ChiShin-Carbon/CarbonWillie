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
  CFormSelect,
  CRow,
  CFormLabel
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import '../../../scss/register.css';

const Register = () => {
  return (
    <div class="register">
      <div className="overlay"></div>
      <div className="content">
        <CCardGroup>
          <CCard class="logincard" className="p-4">
            <CCardBody class="aligncenter">
              <img src="/src/assets/images/啟新logo.png"></img>
              <CForm>
                <h2>註冊</h2>
                <p class="word">請填寫以下資料來註冊帳號</p>
                <hr></hr>

                <CRow className="mb-3">
                  <CFormLabel htmlFor="Name" className="col-sm-2 col-form-label customlabel" >姓名</CFormLabel>
                  <CCol >
                    <CFormInput className="custominput" type="text" id="Name" placeholder="請填寫您的姓名" />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CFormLabel htmlFor="Email" className="col-sm-2 col-form-label customlabel" >電子郵件</CFormLabel>
                  <CCol>
                    <CFormInput className="custominput" type="email" id="Email" placeholder="請填寫您的電子郵件" />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CFormLabel htmlFor="phonenumber" className="col-sm-2 col-form-label customlabel" >連絡電話</CFormLabel>
                  <CCol>
                    <CFormInput className="custominput" type="text" id="phonenumber" placeholder="請填寫您的連絡電話" />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CFormLabel htmlFor="work" className="col-sm-2 col-form-label customlabel" >所屬部門</CFormLabel>
                  <CCol>
                    <CFormSelect aria-label="Default select example" id="work" className="custominput"
                      options={[
                        '請選擇所屬部門',
                        { label: '管理部門', value: '1' },
                        { label: '資訊部門', value: '2' },
                        { label: '門診部門', value: '3' },
                        { label: '健檢部門', value: '4' },
                        { label: '檢驗部門', value: '5' }
                      ]}

                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CFormLabel htmlFor="job" className="col-sm-2 col-form-label customlabel" >所屬職位</CFormLabel>
                  <CCol>
                    <CFormSelect aria-label="Default select example" id="job" className="custominput"
                      options={[
                        '請選擇所屬職位',
                        { label: '總經理', value: '1' },
                        { label: '副總經理', value: '2' },
                        { label: '主管', value: '3' },
                        { label: '組長', value: '4' }
                      ]}
                    />
                  </CCol>
                </CRow>
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
                <CRow className="mb-3">
                  <CFormLabel htmlFor="Password2" className="col-sm-2 col-form-label customlabel" >確認密碼</CFormLabel>
                  <CCol>
                    <CFormInput className="custominput" type="password" id="Password2" placeholder="確認您的密碼" />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <p className="px-0" style={{ color: 'black' }}>
                      已經有帳號了?
                    </p>
                  </CCol>
                  <CCol>
                    <Link to="../login">
                      <p>
                        登入
                      </p>
                    </Link>
                  </CCol>
                </CRow>

                <CButton class="button" className="px-4">
                  創建帳號
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCardGroup>
        
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



      </div>
    </div>

  )
}

export default Register
