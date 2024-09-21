import React from 'react'
import {
    CRow, CCol, CCard, CCardBody, CCardHeader,CFormSelect, CTab, CTabContent, CTabList, CTabPanel, CTabs, CForm, CFormLabel, CFormInput,
    CCardSubtitle,
    CCardText,
    CCardTitle, CButton,
    CTable,
    CTableBody,
    CTableCaption,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
     cilDataTransferDown,
 } from '@coreui/icons'
// import { freeSet } from '@coreui/icons'
// import { getIconsView } from '../brands/Brands.js'

const Tabs = () => {
    return (
        <CRow>
        <CCol xs={12}>
            <CTabs activeItemKey={1}>
                <CTabList variant="underline-border" className="custom-tablist">
                    <CTab aria-controls="home-tab-pane" itemKey={1}>
                    表格呈現
                    </CTab>
                    <CTab aria-controls="profile-tab-pane" itemKey={2}>
                    圖形呈現
                    </CTab>
                </CTabList>
                <CTabContent>
                <CTabPanel className="py-3" aria-labelledby="home-tab-pane" itemKey={1}>
                <CCardBody>
                <CCard className="mb-4">
                    <CCardHeader>
                        <CRow>
                        <strong style={{ fontSize: '1.2rem', borderBottom: '5px solid #d882c0',width: '14%'}}>xx2024盤查報告</strong>
                            <CCol>
                            <CFormSelect size="sm" className="mb-3" style={{width:'15%'}}>
                                <option>全部表格</option>
                                <option value="1">表1</option>
                                <option value="2">表2</option>
                                <option value="3">表3</option>
                            </CFormSelect>
                            </CCol>
                            <div className="col-auto text-center">
                                <CButton color="primary" type="submit" className="mb-3" style={{backgroundColor: '#CA6AAF', borderColor: '#CA6AAF', color: 'white',width:'120px',height:'50px' }}>
                                 <CIcon icon={cilDataTransferDown} className="me-2" />
                                下載全部
                                </CButton>
                            </div>
                        </CRow>
                    </CCardHeader>
                    <CCardBody>
                        <CCard style={{ width: '100%' }}>
                            <CCardBody>
                                <CRow>
                                <CCardTitle>總覽
                                    <CButton color="primary" type="submit" className="mb-3" align="right" style={{backgroundColor: '#CA6AAF', borderColor: '#CA6AAF', color: 'white',width:'120px',height:'50px' }}>
                                    <b><CIcon icon={cilDataTransferDown} className="me-2" /></b>
                                    </CButton>
                                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                        <CButton color="primary"><CIcon icon={cilDataTransferDown} className="me-2" /></CButton>
                                    </div>
                                </CCardTitle>
                                </CRow>

                                <CTable border='1'>
                                    <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Class</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Heading</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Heading</CTableHeaderCell>
                                    </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                    <CTableRow>
                                        <CTableHeaderCell scope="row">1</CTableHeaderCell>
                                        <CTableDataCell>Mark</CTableDataCell>
                                        <CTableDataCell>Otto</CTableDataCell>
                                        <CTableDataCell>@mdo</CTableDataCell>
                                    </CTableRow>
                                    <CTableRow>
                                        <CTableHeaderCell scope="row">2</CTableHeaderCell>
                                        <CTableDataCell>Jacob</CTableDataCell>
                                        <CTableDataCell>Thornton</CTableDataCell>
                                        <CTableDataCell>@fat</CTableDataCell>
                                    </CTableRow>
                                    <CTableRow>
                                        <CTableHeaderCell scope="row">3</CTableHeaderCell>
                                        <CTableDataCell colSpan={2}>Larry the Bird</CTableDataCell>
                                        <CTableDataCell>@twitter</CTableDataCell>
                                    </CTableRow>
                                    </CTableBody>
                                    </CTable>

                                <CCardSubtitle className="mb-2 text-body-secondary">Card subtitle</CCardSubtitle>
                                <CCardText>
                                    Some quick example text to build on the card title and make up the bulk of the
                                    card&#39;s content.
                                </CCardText>
                            </CCardBody>
                        </CCard>
                        <CForm>
                        <CRow className="mb-3">
                            <CCol sm={9}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="account">機構名稱</CFormLabel>
                                <CFormInput
                                type="name"
                                id="name"
                                placeholder="啟新醫事檢驗所"
                                disabled readOnly/>
                            </div>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CCol sm={4}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="account">管制編號</CFormLabel>
                                <CFormInput
                                type="registrationno"
                                id="registrationno"
                                placeholder="A39B6572"
                                disabled readOnly/>
                            </div>
                            </CCol>
                            <CCol sm={1}></CCol>
                            <CCol sm={4}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="email">核准字號</CFormLabel>
                                <CFormInput
                                type="permitno"
                                id="permitno"
                                disabled readOnly/>
                            </div>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CCol sm={3}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="account">縣市別</CFormLabel>
                                <CFormInput
                                type="country"
                                id="country"
                                placeholder="台北市"
                                disabled readOnly/>
                            </div>
                            </CCol>
                            <CCol sm={3}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="email">鄉鎮別</CFormLabel>
                                <CFormInput
                                type="township"
                                id="township"
                                placeholder="中山區"
                                disabled readOnly/>
                            </div>
                            </CCol>
                            <CCol sm={3}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="email">里別</CFormLabel>
                                <CFormInput
                                type="village"
                                id="village"
                                placeholder="行政里"
                                disabled readOnly/>
                            </div>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CCol sm={6}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="account">地址</CFormLabel>
                                <CFormInput
                                type="address"
                                id="address"
                                placeholder="台北市中山區建國北路三段42號5樓"
                                disabled readOnly/>
                            </div>
                            </CCol>
                            <CCol sm={3}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="email">郵遞區號</CFormLabel>
                                <CFormInput
                                type="postal_code"
                                id="postal_code"
                                placeholder="10482"
                                disabled readOnly/>
                            </div>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CCol sm={4}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="account">負責人姓名</CFormLabel>
                                <CFormInput
                                type="head"
                                id="head"
                                placeholder="楊文仁"
                                disabled readOnly/>
                            </div>
                            </CCol>
                            <CCol sm={1}></CCol>
                            <CCol sm={4}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="email">電話</CFormLabel>
                                <CFormInput
                                type="telephone"
                                id="telephone"
                                placeholder="02-25070723"
                                disabled readOnly/>
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
                                disabled readOnly/>
                            </div>
                            </CCol>
                            <CCol sm={1}></CCol>
                            <CCol sm={4}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="email">手機</CFormLabel>
                                <CFormInput
                                type="mobile"
                                id="mobile"
                                disabled readOnly/>
                            </div>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CCol sm={4}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="account">行業名稱</CFormLabel>
                                <CFormInput
                                type="industry_name"
                                id="industry_name"
                                placeholder='醫學檢驗業'
                                disabled readOnly/>
                            </div>
                            </CCol>
                            <CCol sm={1}></CCol>
                            <CCol sm={4}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="email">行業代碼</CFormLabel>
                                <CFormInput
                                type="industry_code"
                                id="industry_code"
                                placeholder='8691'
                                disabled readOnly/>
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
                            <strong style={{ fontSize: '1.2rem', borderBottom: '5px solid #d882c0' }}>修改企業資料</strong>
                        </CCardHeader>
                    <CCardBody>
                <CForm>
                <CRow className="mb-3">
                    <CCol sm={9}>
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
                    <CCol sm={4}>
                    <div className="mb-3">
                        <CFormLabel htmlFor="account">管制編號</CFormLabel>
                        <CFormInput
                        type="registrationno"
                        id="registrationno"
                        />
                    </div>
                    </CCol>
                    <CCol sm={1}></CCol>
                    <CCol sm={4}>
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
                    <CCol sm={3}>
                    <div className="mb-3">
                        <CFormLabel htmlFor="account">縣市別</CFormLabel>
                        <CFormInput
                        type="country"
                        id="country"
                        />
                    </div>
                    </CCol>
                    <CCol sm={3}>
                    <div className="mb-3">
                        <CFormLabel htmlFor="email">鄉鎮別</CFormLabel>
                        <CFormInput
                        type="township"
                        id="township"
                        />
                    </div>
                    </CCol>
                    <CCol sm={3}>
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
                    <CCol sm={6}>
                    <div className="mb-3">
                        <CFormLabel htmlFor="account">地址</CFormLabel>
                        <CFormInput
                        type="postal_code"
                        id="postal_code"
                        />
                    </div>
                    </CCol>
                    <CCol sm={3}>
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
                    <CCol sm={4}>
                    <div className="mb-3">
                        <CFormLabel htmlFor="account">負責人姓名</CFormLabel>
                        <CFormInput
                        type="head"
                        id="head"
                        />
                    </div>
                    </CCol>
                    <CCol sm={1}></CCol>
                    <CCol sm={4}>
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
                    <CCol sm={4}>
                    <div className="mb-3">
                        <CFormLabel htmlFor="account">電子信箱</CFormLabel>
                        <CFormInput
                        type="email"
                        id="email"
                        />
                    </div>
                    </CCol>
                    <CCol sm={1}></CCol>
                    <CCol sm={4}>
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
                    <CCol sm={4}>
                    <div className="mb-3">
                        <CFormLabel htmlFor="account">行業名稱</CFormLabel>
                        <CFormInput
                        type="industry_name"
                        id="industry_name"
                        />
                    </div>
                    </CCol>
                    <CCol sm={1}></CCol>
                    <CCol sm={4}>
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
                <CButton color="primary" type="submit" className="mb-3" style={{backgroundColor: '#CA6AAF', borderColor: '#CA6AAF', color: 'white', }}>
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
