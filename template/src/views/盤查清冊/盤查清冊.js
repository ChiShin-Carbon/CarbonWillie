import React, { useRef } from 'react'
import { useState } from 'react';


import {
    CRow, CCol, CCard, CCardBody, CCardHeader, CFormSelect, CTab, CTabContent, CTabList, CTabPanel, CTabs, CForm, CFormLabel, CFormInput, CFormTextarea, CFormCheck,
    CCardSubtitle, CCardText, CCardTitle, CButton,
    CTable, CTableBody, CTableCaption, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CCollapse,
    CAccordion, CAccordionItem, CAccordionHeader, CAccordionBody, CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CNav,
    CNavItem,
    CNavLink,

} from '@coreui/react'
import '../../scss/碳盤查系統.css'
import styles from '../../scss/盤查清冊.module.css'

import 'primereact/resources/themes/saga-blue/theme.css';  // 主题样式
import 'primereact/resources/primereact.min.css';          // 核心 CSS
import 'primeicons/primeicons.css';                        // 图标样式

import { Division } from './各表格檔案/分工說明表.js';
import { ClassOne } from './類別一.js';
import { ClassTwo } from './類別二.js';
import { ClassThree } from './類別三.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';


const Tabs = () => {

    const [activeTab, setActiveTab] = useState('tab1') // 記錄當前活動的分頁

    return (
        <main>
            <div className={styles.systemTablist}>
                <div className={styles.tabsLeft}>
                    <div>
                        <strong>
                            選擇年分
                        </strong>
                        <select>
                            <option>2025</option>
                            <option value="1">2024</option>
                            <option value="2">2023</option>
                            <option value="3">2022</option>
                        </select>
                    </div>
                    <div>
                        <strong>
                            選擇計畫
                        </strong>
                        <select>
                            <option>xx2024盤查清冊</option>
                            <option value="1">xx2023盤查清冊</option>
                            <option value="2">xx2022盤查清冊</option>
                        </select>
                    </div>
                </div>
                <div className={styles.buttonRight}>
                    <button>產出清冊</button>
                </div>
            </div>
            <div className="system-titlediv">
                <div>
                    <h4 className="system-title">xx2024盤查清冊</h4>
                    <hr className="system-hr"></hr>
                </div>
                <div className={styles.titleRight}>
                    {/* <select>
                        <option>編輯完成</option>
                        <option value="1">編輯中</option>
                    </select>
                    <button className={styles.save}>儲存</button> */}
                    <span style={{ color: 'gray', fontWeight: 'bold' }}>最後上傳資訊 : XX部門-蔡沂庭 2024/12/2 23:59:23</span>
                    <button className={styles.save}>上傳編修後檔案</button>
                </div>

            </div>

            <CNav variant="tabs" className="card-header-tabs">
                <CNavItem>
                    <CNavLink
                        active={activeTab === 'tab1'}
                        onClick={() => setActiveTab('tab1')}
                        className={activeTab === 'tab1' ? styles.tabChoose : styles.tabNoChoose}
                    >
                        <div>
                            分工說明表
                        </div>
                    </CNavLink>
                </CNavItem>
                <CNavItem>
                    <CNavLink
                        active={activeTab === 'tab2'}
                        onClick={() => setActiveTab('tab2')}
                        className={activeTab === 'tab2' ? styles.tabChoose : styles.tabNoChoose}
                    >
                        <div>
                            類別一
                        </div>
                    </CNavLink>
                </CNavItem>
                <CNavItem>
                    <CNavLink
                        active={activeTab === 'tab3'}
                        onClick={() => setActiveTab('tab3')}
                        className={activeTab === 'tab3' ? styles.tabChoose : styles.tabNoChoose}
                    >
                        <div>
                            類別二
                        </div>
                    </CNavLink>
                </CNavItem>
                <CNavItem>
                    <CNavLink
                        active={activeTab === 'tab4'}
                        onClick={() => setActiveTab('tab4')}
                        className={activeTab === 'tab4' ? styles.tabChoose : styles.tabNoChoose}
                    >
                        <div>
                            類別三
                        </div>
                    </CNavLink>
                </CNavItem>
            </CNav>

            <div className={styles.body}>
                <div className={styles.bodyMain}>
                    {/* 內容 */}
                    {activeTab === 'tab1' && <Division />}
                    {activeTab === 'tab2' && <ClassOne />}
                    {activeTab === 'tab3' && <ClassTwo />}
                    {activeTab === 'tab4' && <ClassThree />}
                </div>
                {/* 按鈕固定在底部 */}
                <div className={styles.bodyBottom}>
                    <button>
                        <FontAwesomeIcon icon={faArrowRightFromBracket} /> 匯出清冊
                    </button>
                </div>
            </div>

        </main >
    );
}

export default Tabs;
