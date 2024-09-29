import React, { useRef } from 'react'
import { useState } from 'react';


import {
    CRow, CCol, CCard, CCardBody, CCardHeader, CFormSelect, CTab, CTabContent, CTabList, CTabPanel, CTabs, CForm, CFormLabel, CFormInput, CFormTextarea,
    CCardSubtitle, CCardText, CCardTitle, CButton,
    CTable, CTableBody, CTableCaption, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CCollapse,
    CAccordion, CAccordionItem, CAccordionHeader, CAccordionBody,

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
    const [visible, setVisible] = useState(false)


    return (
        <main>
            <CTabs activeItemKey={1}>
                <CTabList variant="underline-border" className="system-tablist">
                    <Link to="/theme/system" className="system-tablist-link"><CTab aria-controls="tab1" itemKey={3} className="system-tablist-choose">
                        資訊填寫
                    </CTab></Link>
                    <Link to="/theme/system/邊界設定" className="system-tablist-link"><CTab aria-controls="tab2" itemKey={2} className="system-tablist-choose">
                        邊界設定
                    </CTab></Link>
                    <Link to="." className="system-tablist-link"><CTab aria-controls="tab3" itemKey={1} className="system-tablist-choose">
                        活動數據分配
                    </CTab></Link>
                    <Link to="/theme/system/活動數據盤點" className="system-tablist-link"><CTab aria-controls="tab3" itemKey={4} className="system-tablist-choose">
                        活動數據盤點
                    </CTab></Link>
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
                <div style={{minHeight:'300px'}}>
                    <div className={styles.activityCard2Head}>
                        <strong className={styles.activityCard2HeadTitle}>範疇一</strong>
                    </div>

                    <div className={styles.activityCardBody}>
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
                                            </div>

                                            <div style={{ textAlign: 'right' }}>
                                                <FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} />
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

                    <div className={styles.activityCardBody}>
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
                                            </div>

                                            <div style={{ textAlign: 'right' }}>
                                                <FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} />
                                                <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} /></div>
                                        </div>
                                    </CAccordionBody>
                                </CAccordionItem>
                            </CAccordion>
                        </div>
                    </div>
                </div>

            </CCard>

        </main>
    );
}

export default Tabs;
