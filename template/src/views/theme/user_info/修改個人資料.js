import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
} from '@coreui/react'
import { DocsExample } from 'src/components'

const Navs = () => {
    return (
      <CRow>
        <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>React Navs</strong> <small>Base navs</small>
          </CCardHeader>
          <CCardBody>
            <p className="text-body-secondary small">
              The base <code>.nav</code> component is built with flexbox and provide a strong
              foundation for building all types of navigation components. It includes some style
              overrides (for working with lists), some link padding for larger hit areas, and basic
              disabled styling.
            </p>
            <DocsExample href="components/nav#base-nav">
              <CNav>
                <CNavItem>
                  <CNavLink href="#" active>
                    Active
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink href="#">Link</CNavLink>
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
            </DocsExample>
            <p className="text-body-secondary small">
              Classes are used throughout, so your markup can be super flexible. Use{' '}
              <code>&lt;ul&gt;</code>s like above, <code>&lt;ol&gt;</code> if the order of your
              items is important, or roll your own with a <code>&lt;nav&gt;</code> element. Because
              the .nav uses display: flex, the nav links behave the same as nav items would, but
              without the extra markup.
            </p>
            <DocsExample href="components/nav#base-nav">
              <CNav as="nav">
                <CNavLink href="#" active>
                  Active
                </CNavLink>
                <CNavLink href="#">Link</CNavLink>
                <CNavLink href="#">Link</CNavLink>
                <CNavLink href="#" disabled>
                  Disabled
                </CNavLink>
              </CNav>
            </DocsExample>
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

export default FormControl
