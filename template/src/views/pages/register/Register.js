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
          <div class="card1">
            <CCard class="logincard" className="p-4">
              <CCardBody class="aligncenter">
                <img src="/src/assets/images/啟新logo.png"></img>
                <CForm>
                  <h2>註冊</h2>
                  <p class="word">請填寫以下資料來註冊帳號</p>
                  <hr></hr>
                  <CInputGroup className="mb-3">
                    <CInputGroupText style={{ border: 'none', backgroundColor: 'white' }}>
                      <b>姓名</b>
                    </CInputGroupText>
                    <CFormInput
                      placeholder="請填寫您的姓名"
                      autoComplete="username"
                      style={{ borderRadius: '30px', backgroundColor: '#F0F0F0' }} />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText style={{ border: 'none', backgroundColor: 'white' }}>
                      <b>電子郵件</b>
                    </CInputGroupText>
                    <CFormInput
                      placeholder="請填寫您的電子郵件"
                      autoComplete="email" type="email"
                      style={{ borderRadius: '30px', backgroundColor: '#F0F0F0' }} />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText style={{ border: 'none', backgroundColor: 'white' }}>
                      <b>連絡電話</b>
                    </CInputGroupText>
                    <CFormInput
                      placeholder="請填寫您的連絡電話"
                      autoComplete="phonenumber"
                      style={{ borderRadius: '30px', backgroundColor: '#F0F0F0' }} />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText style={{ border: 'none', backgroundColor: 'white' }}>
                      <b>所屬部門</b>
                    </CInputGroupText>
                    <CFormSelect
                      aria-label="Default select example"
                      options={[
                        '請選擇所屬部門',
                        { label: '管理部門', value: '1' },
                        { label: '資訊部門', value: '2' },
                        { label: '門診部門', value: '3'},
                        { label: '健檢部門', value: '4'},
                        { label: '檢驗部門', value: '5'}
                      ]}
                      style={{ borderRadius: '30px', backgroundColor: '#F0F0F0' }}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText style={{ border: 'none', backgroundColor: 'white' }}>
                      <b>所屬職位</b>
                    </CInputGroupText>
                    <CFormSelect
                      aria-label="Default select example"
                      options={[
                        '請選擇所屬職位',
                        { label: '總經理', value: '1' },
                        { label: '副總經理', value: '2' },
                        { label: '主管', value: '3'},
                        { label: '組長', value: '4'}
                      ]}
                      style={{ borderRadius: '30px', backgroundColor: '#F0F0F0' }}
                    />
                  </CInputGroup>


                  <CInputGroup className="mb-3">
                    <CInputGroupText style={{ border: 'none', backgroundColor: 'white' }}>
                      <b>使用者帳號</b>
                    </CInputGroupText>
                    <CFormInput
                      placeholder="請填寫您的使用者帳號"
                      autoComplete="useraccount"
                      style={{ borderRadius: '30px', backgroundColor: '#F0F0F0' }} />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText style={{ border: 'none', backgroundColor: 'white' }}>
                      <b>使用者密碼</b>
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="請填寫您的密碼"
                      autoComplete="new-password" style={{ borderRadius: '30px', backgroundColor: '#F0F0F0' }}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText style={{ border: 'none', backgroundColor: 'white' }}>
                      <b>確認密碼</b>
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="確認您的密碼"
                      autoComplete="new-password" style={{ borderRadius: '30px', backgroundColor: '#F0F0F0' }}
                    />
                  </CInputGroup>
                  <CRow>
                    <CCol>
                      <p className="px-0" style={{color:'black'}}>
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
          </div>

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
        </CCardGroup>

      </div>
    </div>

  )
}

export default Register
