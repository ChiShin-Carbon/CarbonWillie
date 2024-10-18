import React, { useRef } from 'react'
import { useState } from 'react';


import {
    CRow, CCol, CCard, CCardBody, CCardHeader, CFormSelect, CTab, CTabContent, CTabList, CTabPanel, CTabs, CForm, CFormLabel, CFormInput, CFormTextarea, CFormCheck,
    CCardSubtitle, CCardText, CCardTitle, CButton,
    CTable, CTableBody, CTableCaption, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CCollapse,
    CAccordion, CAccordionItem, CAccordionHeader, CAccordionBody, CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle,

} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilDataTransferDown } from '@coreui/icons'

import '../../../../scss/碳盤查系統.css'
import styles from '../../../../scss/活動數據盤點.module.css'
import { Link } from 'react-router-dom'


import 'primereact/resources/themes/saga-blue/theme.css';  // 主题样式
import 'primereact/resources/primereact.min.css';          // 核心 CSS
import 'primeicons/primeicons.css';                        // 图标样式


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';

import { Calendar } from 'primereact/calendar';


const Tabs = () => {
    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const [isEditModalVisible, setEditModalVisible] = useState(false);

    return (
        <main>
            <CTabs activeItemKey={1}>
                <CTabList variant="underline-border" className="system-tablist">
                    <div className={styles.tabsContainer}>
                        <div className={styles.tabsLeft}>
                            <Link to="/碳盤查系統/system" className="system-tablist-link"><CTab aria-controls="tab1" itemKey={3} className="system-tablist-choose">
                                基準年&邊界設定
                            </CTab></Link>
                            <Link to="." className="system-tablist-link"><CTab aria-controls="tab3" itemKey={1} className="system-tablist-choose">
                                活動數據分配
                            </CTab></Link>
                            <Link to="/碳盤查系統/system/活動數據盤點" className="system-tablist-link"><CTab aria-controls="tab3" itemKey={2} className="system-tablist-choose">
                                活動數據盤點
                            </CTab></Link>
                        </div>
                        <div className={styles.tabsRight}>
                            <Link to="/碳盤查系統/system/盤查進度管理" className="system-tablist-link"><CTab aria-controls="tab3" itemKey={5} className="system-tablist-choose">
                                盤查進度管理
                            </CTab></Link>
                        </div>
                    </div>
                </CTabList>

            </CTabs>


            <div className="system-titlediv">
                <div>
                    <h4 className="system-title">活動數據分配</h4>
                    <hr className="system-hr"></hr>
                </div>
                <button className="system-save">儲存</button>
            </div>
            <CCard className={`mb-4 ${styles.activityCard2}`}>
                <div>
                    <div className={styles.activityCard2Head}>
                        <strong className={styles.activityCard2HeadTitle}>範疇一</strong>
                        <button className={styles.activityAddButton} onClick={() => setAddModalVisible(true)}>新增</button>
                    </div>

                    <div className={styles.activityCardBody2}>
                        <div className={styles.activityAccordionDiv}>
                            <CAccordion className={styles.activityAccordion}>
                                <CAccordionItem itemKey={1} className={styles.activityAccordionItem}>
                                    <CAccordionHeader >公務車(汽油)</CAccordionHeader>
                                    <CAccordionBody>
                                        <div className={styles.AccordionBodyItem}>
                                            <h6>各部門填寫人</h6>
                                            <hr />
                                            <div className={styles.departmentList}>
                                                <div className={styles.departmentItem}>
                                                    <span>管理部門:</span>
                                                    <span>XXX</span>
                                                </div>
                                                <div className={styles.departmentItem}>
                                                    <span>資訊部門:</span>
                                                    <span>XXX</span>
                                                </div>
                                                <div className={styles.departmentItem}>
                                                    <span>門診部門:</span>
                                                    <span>XXX</span>
                                                </div>
                                                <div className={styles.departmentItem}>
                                                    <span>健檢部門:</span>
                                                    <span>XXX</span>
                                                </div>
                                                <div className={styles.departmentItem}>
                                                    <span>檢驗部門:</span>
                                                    <span>XXX</span>
                                                </div>
                                                <div className={styles.departmentItem}>
                                                    <span>業務部門:</span>
                                                    <span>XXX</span>
                                                </div>
                                            </div>

                                            <div style={{ textAlign: 'right' }}>
                                                <FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} onClick={() => setEditModalVisible(true)} />
                                                <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} /></div>
                                        </div>
                                    </CAccordionBody>
                                </CAccordionItem>
                            </CAccordion>

                        </div>
                    </div>
                </div>

                <div>
                    <div className={styles.activityCard2Head}>
                        <strong className={styles.activityCard2HeadTitle}>範疇二</strong>
                    </div>

                    <div className={styles.activityCardBody2}>
                        <div className={styles.activityAccordionDiv}>
                            <CAccordion className={styles.activityAccordion}>
                                <CAccordionItem itemKey={1} className={styles.activityAccordionItem}>
                                    <CAccordionHeader >間接蒸氣(汽電共生廠有做溫室氣體盤查)</CAccordionHeader>
                                    <CAccordionBody>
                                        <div className={styles.AccordionBodyItem}>
                                            <h6>各部門填寫人</h6>
                                            <hr />
                                            <div className={styles.departmentList}>
                                                <div className={styles.departmentItem}>
                                                    <span>管理部門:</span>
                                                    <span>XXX</span>
                                                </div>
                                                <div className={styles.departmentItem}>
                                                    <span>資訊部門:</span>
                                                    <span>XXX</span>
                                                </div>
                                                <div className={styles.departmentItem}>
                                                    <span>門診部門:</span>
                                                    <span>XXX</span>
                                                </div>
                                                <div className={styles.departmentItem}>
                                                    <span>健檢部門:</span>
                                                    <span>XXX</span>
                                                </div>
                                                <div className={styles.departmentItem}>
                                                    <span>檢驗部門:</span>
                                                    <span>XXX</span>
                                                </div>
                                                <div className={styles.departmentItem}>
                                                    <span>業務部門:</span>
                                                    <span>XXX</span>
                                                </div>
                                            </div>

                                            <div style={{ textAlign: 'right' }}>
                                                <FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} onClick={() => setEditModalVisible(true)} />
                                                <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} /></div>
                                        </div>
                                    </CAccordionBody>
                                </CAccordionItem>
                            </CAccordion>
                        </div>
                    </div>
                </div>

                <div>
                    <div className={styles.activityCard2Head}>
                        <strong className={styles.activityCard2HeadTitle}>範疇三</strong>
                    </div>
                    <div className={styles.activityCardBody2}>

                    </div>
                </div>

            </CCard>




            <CModal
                backdrop="static"
                visible={isAddModalVisible}
                onClose={() => setAddModalVisible(false)}
                aria-labelledby="StaticBackdropExampleLabel"
            >
                <CModalHeader>
                    <CModalTitle id="StaticBackdropExampleLabel"><b>新增排放源與填寫人</b></CModalTitle>
                </CModalHeader>
                <CModalBody style={{ padding: '10px 50px' }}>
                    <CForm >
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="sitename" className={`col-sm-2 col-form-label ${styles.addlabel}`} >排放類別</CFormLabel>
                            <CCol>
                                <CFormSelect aria-label="Default select example" className={styles.addinput}>
                                    <option value="1">範疇一</option>
                                    <option value="2">範疇二</option>
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="sitename" className={`col-sm-2 col-form-label ${styles.addlabel}`} >排放源</CFormLabel>
                            <CCol>
                                <CFormSelect aria-label="Default select example" className={styles.addinput}>
                                    <option value="1">...</option>
                                    <option value="2">...</option>
                                    <option value="3">...</option>
                                    <option value="4">...</option>
                                    <option value="5">...</option>
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <hr />
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="sitename" className={`col-sm-2 col-form-label ${styles.addlabel}`} >管理部門</CFormLabel>
                            <CCol>
                                <CFormSelect aria-label="Default select example" className={styles.addinput}>
                                    <option value="1">無</option>
                                    <option value="2">...</option>
                                    <option value="3">...</option>
                                    <option value="4">...</option>
                                    <option value="5">...</option>
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="sitename" className={`col-sm-2 col-form-label ${styles.addlabel}`} >資訊部門</CFormLabel>
                            <CCol>
                                <CFormSelect aria-label="Default select example" className={styles.addinput}>
                                    <option value="1">無</option>
                                    <option value="2">...</option>
                                    <option value="3">...</option>
                                    <option value="4">...</option>
                                    <option value="5">...</option>
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="sitename" className={`col-sm-2 col-form-label ${styles.addlabel}`} >門診部門</CFormLabel>
                            <CCol>
                                <CFormSelect aria-label="Default select example" className={styles.addinput}>
                                    <option value="1">無</option>
                                    <option value="2">...</option>
                                    <option value="3">...</option>
                                    <option value="4">...</option>
                                    <option value="5">...</option>
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="sitename" className={`col-sm-2 col-form-label ${styles.addlabel}`} >健檢部門</CFormLabel>
                            <CCol>
                                <CFormSelect aria-label="Default select example" className={styles.addinput}>
                                    <option value="1">無</option>
                                    <option value="2">...</option>
                                    <option value="3">...</option>
                                    <option value="4">...</option>
                                    <option value="5">...</option>
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="sitename" className={`col-sm-2 col-form-label ${styles.addlabel}`} >檢驗部門</CFormLabel>
                            <CCol>
                                <CFormSelect aria-label="Default select example" className={styles.addinput}>
                                    <option value="1">無</option>
                                    <option value="2">...</option>
                                    <option value="3">...</option>
                                    <option value="4">...</option>
                                    <option value="5">...</option>
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="sitename" className={`col-sm-2 col-form-label ${styles.addlabel}`} >業務部門</CFormLabel>
                            <CCol>
                                <CFormSelect aria-label="Default select example" className={styles.addinput}>
                                    <option value="1">無</option>
                                    <option value="2">...</option>
                                    <option value="3">...</option>
                                    <option value="4">...</option>
                                    <option value="5">...</option>
                                </CFormSelect>
                            </CCol>
                        </CRow>

                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton className="modalbutton1" onClick={() => setAddModalVisible(false)}>
                        取消
                    </CButton>
                    <CButton className="modalbutton2">新增</CButton>
                </CModalFooter>
            </CModal>



            <CModal
                backdrop="static"
                visible={isEditModalVisible}
                onClose={() => setEditModalVisible(false)}
                aria-labelledby="StaticBackdropExampleLabel2"
            >
                <CModalHeader>
                    <CModalTitle id="StaticBackdropExampleLabel2"><b>編輯排放源與填寫人</b></CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm >
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="sitename" className={`col-sm-2 col-form-label ${styles.addlabel}`} >排放類別</CFormLabel>
                            <CCol>
                                <CFormSelect aria-label="Default select example" className={styles.addinput}>
                                    <option value="1">範疇一</option>
                                    <option value="2">範疇二</option>
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="sitename" className={`col-sm-2 col-form-label ${styles.addlabel}`} >排放源</CFormLabel>
                            <CCol>
                                <CFormSelect aria-label="Default select example" className={styles.addinput}>
                                    <option value="1">...</option>
                                    <option value="2">...</option>
                                    <option value="3">...</option>
                                    <option value="4">...</option>
                                    <option value="5">...</option>
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <hr />
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="sitename" className={`col-sm-2 col-form-label ${styles.addlabel}`} >管理部門</CFormLabel>
                            <CCol>
                                <CFormSelect aria-label="Default select example" className={styles.addinput}>
                                    <option value="1">無</option>
                                    <option value="2">...</option>
                                    <option value="3">...</option>
                                    <option value="4">...</option>
                                    <option value="5">...</option>
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="sitename" className={`col-sm-2 col-form-label ${styles.addlabel}`} >資訊部門</CFormLabel>
                            <CCol>
                                <CFormSelect aria-label="Default select example" className={styles.addinput}>
                                    <option value="1">無</option>
                                    <option value="2">...</option>
                                    <option value="3">...</option>
                                    <option value="4">...</option>
                                    <option value="5">...</option>
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="sitename" className={`col-sm-2 col-form-label ${styles.addlabel}`} >門診部門</CFormLabel>
                            <CCol>
                                <CFormSelect aria-label="Default select example" className={styles.addinput}>
                                    <option value="1">無</option>
                                    <option value="2">...</option>
                                    <option value="3">...</option>
                                    <option value="4">...</option>
                                    <option value="5">...</option>
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="sitename" className={`col-sm-2 col-form-label ${styles.addlabel}`} >健檢部門</CFormLabel>
                            <CCol>
                                <CFormSelect aria-label="Default select example" className={styles.addinput}>
                                    <option value="1">無</option>
                                    <option value="2">...</option>
                                    <option value="3">...</option>
                                    <option value="4">...</option>
                                    <option value="5">...</option>
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="sitename" className={`col-sm-2 col-form-label ${styles.addlabel}`} >檢驗部門</CFormLabel>
                            <CCol>
                                <CFormSelect aria-label="Default select example" className={styles.addinput}>
                                    <option value="1">無</option>
                                    <option value="2">...</option>
                                    <option value="3">...</option>
                                    <option value="4">...</option>
                                    <option value="5">...</option>
                                </CFormSelect>
                            </CCol>
                        </CRow>

                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton className="modalbutton1" onClick={() => setEditModalVisible(false)}>
                        取消
                    </CButton>
                    <CButton className="modalbutton2">確認</CButton>
                </CModalFooter>
            </CModal>
        </main>
    );
}

export default Tabs;
