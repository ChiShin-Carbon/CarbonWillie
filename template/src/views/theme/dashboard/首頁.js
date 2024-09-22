import React from 'react'
import {
    CRow,
    CCol,
    CCard,
    CCardBody,
    CCardHeader,
    CCardTitle,
    CTab,
    CTabContent,
    CTabList,
    CTabPanel,
    CTabs,
    CForm,
    CFormLabel,
    CFormInput,
    CButton,
    CFormSelect,
} from '@coreui/react'
import '../../../scss/個人&企業資料.css';
import { Colors } from 'chart.js';

const Tabs = () => {
    return (
        <CRow>
            <CCol xs={12}>
            <div className="customCardHeader"><strong>碳排放詳情</strong></div>
                <CTabs activeItemKey={1}>
                    <CTabList variant="underline-border" className="custom-tablist">
                        <CTab aria-controls="tab1" itemKey={1} className="custom-tablist-choose">
                            總量
                        </CTab>
                        <CTab aria-controls="tab2" itemKey={2} className="custom-tablist-choose">
                            範疇一
                        </CTab>
                        <CTab aria-controls="tab3" itemKey={3} className="custom-tablist-choose">
                            範疇二
                        </CTab>
                        <CTab aria-controls="tab3" itemKey={4} className="custom-tablist-choose">
                            範疇三
                        </CTab>
                    </CTabList>
                    <CTabContent>
                        <CTabPanel className="py-3" aria-labelledby="home-tab-pane" itemKey={1}>

                        <CRow>
                            <CCol sm={3}>
                                <CCol sm={12}>
                                <CCard className="mb-4 customCard">
                                <CCardBody className="customCard2">
                                    <div className="customCardHeader">
                                    <strong>碳排總量  </strong>
                                    <span style={{ fontSize: '0.8rem', color: 'gray' }}>/CO2e</span>
                                    </div>
                                    <div className="customCardBody">
                                    暫無資料!
                                    </div>
                                </CCardBody>
                                </CCard>
                                </CCol>
                                <CCol sm={12}>
                                <CCard className="mb-4 customCard">
                                <CCardBody className="customCard2">
                                    <div className="customCardHeader">
                                    <strong>各設備比例</strong>
                                    
                                    </div>
                                    <div className="customCardBody">
                                    暫無資料!
                                    </div>
                                </CCardBody>
                                </CCard>
                                </CCol>
                            </CCol>

                            {/* 右侧 3/4 宽度 */}
                            <CCol sm={9}>
                                {/**/}
                                <CCard className="mb-4 customCard">
                                <CCardBody className="customCard2">
                                <CCardHeader>
                                    <CRow className="d-flex align-items-center">
                                        <strong className="me-3">趨勢分析</strong>
                                        <CRow>
                                        <CFormSelect size="sm"  style={{ width: '15%' }}>
                                        <option>碳排總量</option>
                                        <option value="1">表1</option>
                                        <option value="2">表2</option>
                                        <option value="3">表3</option>
                                        </CFormSelect>
                                        <CFormSelect size="sm"  style={{ width: '15%' }}>
                                        <option>年分</option>
                                        <option value="1">表1</option>
                                        <option value="2">表2</option>
                                        <option value="3">表3</option>
                                        </CFormSelect></CRow>
                                    </CRow>
                                    
                                    </CCardHeader>

                                    <div className="customCardBody">
                                    <CForm>
                                        <CRow className="mb-3">
                                        <CCol sm={5}>
                                            <div className="mb-3">
                                            <CFormLabel htmlFor="email">
                                                <strong>姓名</strong>
                                            </CFormLabel>
                                            <CFormInput
                                                type="name"
                                                id="name"
                                                placeholder="王宥樺"
                                                disabled
                                                readOnly
                                            />
                                            </div>
                                        </CCol>
                                        <CCol sm={2}></CCol>
                                        <CCol sm={5}>
                                            <div className="mb-3">
                                            <CFormLabel htmlFor="phone">
                                                <strong>辦公室電話</strong>
                                            </CFormLabel>
                                            <CFormInput
                                                type="name"
                                                id="phone"
                                                placeholder="0968132840"
                                                disabled
                                                readOnly
                                            />
                                            </div>
                                        </CCol>
                                        </CRow>
                                    </CForm>
                                    </div>
                                </CCardBody>
                                </CCard>
                            </CCol>
                            </CRow>

                        </CTabPanel>
                        <CTabPanel className="py-3" aria-labelledby="profile-tab-pane" itemKey={2}>
                           
                                <CCard className="mb-4 customCard">

                                    <CCardBody className="customCard2">
                                        <div className="customCardHeader">
                                            <strong className="customtitlebottom">修改個人資料</strong>
                                        </div>
                                        <div className="customCardBody">
                                            <CForm>
                                                <CRow className="mb-3">
                                                    <CCol sm={5}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="account"><strong>帳號</strong></CFormLabel>
                                                            <CFormInput type="account" id="account" placeholder='cindy.wang@ch.com' />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={2}></CCol>
                                                    <CCol sm={5}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="email"><strong>姓名</strong></CFormLabel>
                                                            <CFormInput type="name" id="name" placeholder='王宥樺' />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={5}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="account"><strong>電子郵件</strong></CFormLabel>
                                                            <CFormInput type="email" id="email" placeholder="name@example.com" />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={2}></CCol>
                                                    <CCol sm={5}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="email"><strong>辦公室電話</strong></CFormLabel>
                                                            <CFormInput type="name" id="phone" placeholder='0968132840' />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3">
                                                    <CCol sm={5}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="account"><strong>所屬部門</strong></CFormLabel>
                                                            <CFormInput type="email" id="email" placeholder='管理部門' />
                                                        </div>
                                                    </CCol>
                                                    <CCol sm={2}></CCol>
                                                    <CCol sm={5}>
                                                        <div className="mb-3">
                                                            <CFormLabel htmlFor="email"><strong>職業</strong></CFormLabel>
                                                            <CFormInput type="phone" id="name" placeholder='主管' />
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                                <div className="col-auto text-center">
                                                    <CButton type="submit" className="mb-3 customButton">
                                                        保存資料
                                                    </CButton>
                                                </div>
                                            </CForm>
                                        </div>
                                    </CCardBody>
                                </CCard>
                        </CTabPanel>
                        <CTabPanel className="py-3" aria-labelledby="contact-tab-pane" itemKey={3}>
                            <CCard className="mb-4 customCard">
                                <CCardBody  className="customCard2">
                                    <div className="customCardHeader">
                                        <strong className="customtitlebottom">修改密碼</strong>
                                    </div>
                                    <div className="customCardBody">
                                        <CForm>
                                            <CRow className="mb-3">
                                                <CCol sm={3}></CCol>
                                                <CCol sm={6}>
                                                    <div className="mb-3">
                                                        <CFormLabel htmlFor="account"><strong>原本密碼</strong></CFormLabel>
                                                        <CFormInput type="password" id="account" />
                                                    </div>
                                                </CCol>
                                                <CCol sm={3}></CCol>
                                            </CRow>
                                            <CRow className="mb-3">
                                                <CCol sm={3}></CCol>

                                                <CCol sm={6}>
                                                    <div className="mb-3">
                                                        <CFormLabel htmlFor="email"><strong>新密碼</strong></CFormLabel>
                                                        <CFormInput type="password" id="name" />
                                                    </div>
                                                </CCol>
                                                <CCol sm={3}></CCol>
                                            </CRow>
                                            <CRow className="mb-3">
                                                <CCol sm={3}></CCol>
                                                <CCol sm={6}>
                                                    <div className="mb-3">
                                                        <CFormLabel htmlFor="account"><strong>確認新密碼</strong></CFormLabel>
                                                        <CFormInput type="password" id="email" />
                                                    </div>
                                                </CCol>
                                                <CCol sm={3}></CCol>
                                            </CRow>
                                            <div className="col-auto text-center">
                                                <CButton type="submit" className="mb-3 customButton">
                                                    保存資料
                                                </CButton>
                                            </div>
                                        </CForm>
                                    </div>
                                </CCardBody>
                            </CCard>
                        </CTabPanel>
                        <CTabPanel className="py-3" aria-labelledby="contact-tab-pane" itemKey={4}>
                            <CCard className="mb-4 customCard">
                                <CCardBody  className="customCard2">
                                    <div className="customCardHeader">
                                        <strong className="customtitlebottom">修改密碼</strong>
                                    </div>
                                    <div className="customCardBody">
                                        <CForm>
                                            <CRow className="mb-3">
                                                <CCol sm={3}></CCol>
                                                <CCol sm={6}>
                                                    <div className="mb-3">
                                                        <CFormLabel htmlFor="account"><strong>原本密碼</strong></CFormLabel>
                                                        <CFormInput type="password" id="account" />
                                                    </div>
                                                </CCol>
                                                <CCol sm={3}></CCol>
                                            </CRow>
                                            <CRow className="mb-3">
                                                <CCol sm={3}></CCol>

                                                <CCol sm={6}>
                                                    <div className="mb-3">
                                                        <CFormLabel htmlFor="email"><strong>新密碼</strong></CFormLabel>
                                                        <CFormInput type="password" id="name" />
                                                    </div>
                                                </CCol>
                                                <CCol sm={3}></CCol>
                                            </CRow>
                                            <CRow className="mb-3">
                                                <CCol sm={3}></CCol>
                                                <CCol sm={6}>
                                                    <div className="mb-3">
                                                        <CFormLabel htmlFor="account"><strong>確認新密碼</strong></CFormLabel>
                                                        <CFormInput type="password" id="email" />
                                                    </div>
                                                </CCol>
                                                <CCol sm={3}></CCol>
                                            </CRow>
                                            <div className="col-auto text-center">
                                                <CButton type="submit" className="mb-3 customButton">
                                                    保存資料
                                                </CButton>
                                            </div>
                                        </CForm>
                                    </div>
                                </CCardBody>
                            </CCard>
                        </CTabPanel>
                    </CTabContent>
                </CTabs>
            </CCol>
        </CRow>
    )
}

export default Tabs