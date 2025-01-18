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
                            <option>xx2024盤查報告</option>
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
                            公務車
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
                            滅火器
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
                            工作時數(員工)
                        </div>
                    </CNavLink>
                </CNavItem>
                <CNavItem>
                    <CNavLink
                        active={activeTab === 'tab5'}
                        onClick={() => setActiveTab('tab5')}
                        className={activeTab === 'tab5' ? styles.tabChoose : styles.tabNoChoose}
                    >
                        <div>
                            工作時數(非員工)
                        </div>
                    </CNavLink>
                </CNavItem>
                <CNavItem>
                    <CNavLink
                        active={activeTab === 'tab6'}
                        onClick={() => setActiveTab('tab6')}
                        className={activeTab === 'tab6' ? styles.tabChoose : styles.tabNoChoose}
                    >
                        <div>
                            冷媒
                        </div>
                    </CNavLink>
                </CNavItem>
                <CNavItem>
                    <CNavLink
                        active={activeTab === 'tab7'}
                        onClick={() => setActiveTab('tab7')}
                        className={activeTab === 'tab7' ? styles.tabChoose : styles.tabNoChoose}
                    >
                        <div>
                            廠內機具
                        </div>
                    </CNavLink>
                </CNavItem>
                <CNavItem>
                    <CNavLink
                        active={activeTab === 'tab8'}
                        onClick={() => setActiveTab('tab8')}
                        className={activeTab === 'tab8' ? styles.tabChoose : styles.tabNoChoose}
                    >
                        <div>
                            緊急發電機
                        </div>
                    </CNavLink>
                </CNavItem>
                <CNavItem>
                    <CNavLink
                        active={activeTab === 'tab9'}
                        onClick={() => setActiveTab('tab9')}
                        className={activeTab === 'tab9' ? styles.tabChoose : styles.tabNoChoose}
                    >
                        <div>
                            電力使用量
                        </div>
                    </CNavLink>
                </CNavItem>
                <CNavItem>
                    <CNavLink
                        active={activeTab === 'tab10'}
                        onClick={() => setActiveTab('tab10')}
                        className={activeTab === 'tab10' ? styles.tabChoose : styles.tabNoChoose}
                    >
                        <div>
                            員工通勤
                        </div>
                    </CNavLink>
                </CNavItem>
                <CNavItem>
                    <CNavLink
                        active={activeTab === 'tab11'}
                        onClick={() => setActiveTab('tab11')}
                        className={activeTab === 'tab11' ? styles.tabChoose : styles.tabNoChoose}
                    >
                        <div>
                            商務旅行
                        </div>
                    </CNavLink>
                </CNavItem>
                <CNavItem>
                    <CNavLink
                        active={activeTab === 'tab12'}
                        onClick={() => setActiveTab('tab12')}
                        className={activeTab === 'tab12' ? styles.tabChoose : styles.tabNoChoose}
                    >
                        <div>
                            營運產生廢棄物
                        </div>
                    </CNavLink>
                </CNavItem>
                <CNavItem>
                    <CNavLink
                        active={activeTab === 'tab13'}
                        onClick={() => setActiveTab('tab13')}
                        className={activeTab === 'tab13' ? styles.tabChoose : styles.tabNoChoose}
                    >
                        <div>
                            銷售產品的廢棄物
                        </div>
                    </CNavLink>
                </CNavItem>


            </CNav>

            <div className={styles.body}>
                {/* /*碳費計算 */}
                {activeTab === 'tab1' && (
                    <>

                    </>
                )}

                {/* /*碳費分析&圖表呈現頁 */}
                {activeTab === 'tab2' && (
                    <>

                    </>
                )}


            </div>

        </main >
    );
}

export default Tabs;
