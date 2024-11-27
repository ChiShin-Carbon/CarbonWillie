import React, { useRef } from 'react'
import { useState } from 'react';


import {
    CRow, CCol, CCard, CCardBody, CCardHeader, CFormSelect, CTab, CTabContent, CTabList, CTabPanel, CTabs, CForm, CFormLabel, CFormInput, CFormTextarea, CFormCheck,
    CCardSubtitle, CCardText, CCardTitle, CButton,
    CTable, CTableBody, CTableCaption, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CCollapse,
    CAccordion, CAccordionItem, CAccordionHeader, CAccordionBody, CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle,

} from '@coreui/react'
import '../../scss/碳盤查系統.css'
import styles from '../../scss/盤查報告書.module.css'

import 'primereact/resources/themes/saga-blue/theme.css';  // 主题样式
import 'primereact/resources/primereact.min.css';          // 核心 CSS
import 'primeicons/primeicons.css';                        // 图标样式


import { Editor } from '@tinymce/tinymce-react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faArrowRightFromBracket, faChevronUp } from '@fortawesome/free-solid-svg-icons';


const Tabs = () => {


    const API_KEY = import.meta.env.VITE_TINYMCE_API_KEY

    const [openSections, setOpenSections] = useState({
        section3: false,
        section4: false,
        'section4_3': false,
        section5: false,
        section6: false,
    });

    const [activeSection, setActiveSection] = useState(null); // 用來追踪當前選中的章節

    const toggleSection = (section) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));

        setActiveSection(section); // 設置當前選中的章節
    };
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
                            <option value="1">xx2023盤查報告</option>
                            <option value="2">xx2022盤查報告</option>
                        </select>
                    </div>
                </div>
                <div className={styles.buttonRight}>
                    <button>產出報告</button>
                </div>
            </div>
            <div className="system-titlediv">
                <div>
                    <h4 className="system-title">xx2024盤查報告</h4>
                    <hr className="system-hr"></hr>
                </div>
                <div className={styles.titleRight}>
                    <select>
                        <option>編輯完成</option>
                        <option value="1">編輯中</option>
                    </select>
                    <button className={styles.save}>儲存</button>
                </div>

            </div>


            <div className={styles.cardRow}>
                <CCard className={styles.cardCatalog}>
                    <div className={styles.CatalogBody}>
                        <div className={`${styles.CatalogTitle} ${activeSection === 'cover' ? styles.active : ''}`} onClick={() => setActiveSection('cover')}>封面</div>
                        <div className={`${styles.CatalogTitle} ${activeSection === 'catalog' ? styles.active : ''}`} onClick={() => setActiveSection('catalog')}>目錄</div>
                        <div className={`${styles.CatalogTitle} ${activeSection === 'section1' ? styles.active : ''}`} onClick={() => setActiveSection('section1')}>第一章 公司基本資料</div>
                        <div className={`${styles.CatalogTitle} ${activeSection === 'section2' ? styles.active : ''}`} onClick={() => setActiveSection('section2')}>第二章 盤查邊界設定</div>

                        <div
                            className={styles.CatalogTitle}
                            onClick={() => toggleSection('section3')}
                        >
                            <span>第三章 排放源鑑別</span>
                            <FontAwesomeIcon icon={openSections.section3 ? faChevronUp : faChevronDown} />
                        </div>
                        {openSections.section3 && (
                            <div className={styles.subBlock}>
                                <div className={`${styles.CatalogTitle} ${activeSection === 'section3_1' ? styles.active : ''}`} onClick={() => setActiveSection('section3_1')}>
                                    3.1 與前一年度相較之排放源增設、拆除或停止使用之情形
                                </div>
                                <div className={`${styles.CatalogTitle} ${activeSection === 'section3_2' ? styles.active : ''}`} onClick={() => setActiveSection('section3_2')}>
                                    3.2 製程流程圖說
                                </div>
                                <div className={`${styles.CatalogTitle} ${activeSection === 'section3_3' ? styles.active : ''}`} onClick={() => setActiveSection('section3_3')}>
                                    3.3 產製期程及產品產量
                                </div>
                                <div className={`${styles.CatalogTitle} ${activeSection === 'section3_4' ? styles.active : ''}`} onClick={() => setActiveSection('section3_4')}>
                                    3.4 排放源之單元名稱或程序及其排放之溫室氣體種類
                                </div>
                            </div>
                        )}

                        <div
                            className={styles.CatalogTitle}
                            onClick={() => toggleSection('section4')}
                        >
                            <span>第四章 排放量計算</span>
                            <FontAwesomeIcon icon={openSections.section4 ? faChevronUp : faChevronDown} />
                        </div>
                        {openSections.section4 && (
                            <div className={styles.subBlock}>
                                <div className={`${styles.CatalogTitle} ${activeSection === 'section4_1' ? styles.active : ''}`} onClick={() => setActiveSection('section4_1')}>
                                    4.1 與排放量有關之原(物)料、燃料之種類及用量
                                </div>
                                <div className={`${styles.CatalogTitle} ${activeSection === 'section4_2' ? styles.active : ''}`} onClick={() => setActiveSection('section4_2')}>
                                    4.2 排放量計算採用之方法、參數選用、數據來源、檢測方法及檢測日期
                                </div>
                                <div
                                    className={styles.CatalogTitle}
                                    onClick={() => toggleSection('section4_3')}
                                >
                                    <span>4.3 排放源排放量計算過程</span>
                                    <FontAwesomeIcon icon={openSections.section4_3 ? faChevronUp : faChevronDown} />
                                </div>
                                {openSections['section4_3'] && (
                                    <div className={styles.subsubBlock}>
                                        <div className={`${styles.CatalogTitle} ${activeSection === 'section4_3_1' ? styles.active : ''}`} onClick={() => setActiveSection('section4_3_1')}>
                                            4.3.1 直接排放
                                        </div>
                                        <div className={`${styles.CatalogTitle} ${activeSection === 'section4_3_2' ? styles.active : ''}`} onClick={() => setActiveSection('section4_3_2')}>
                                            4.3.2 能源間接排放
                                        </div>
                                    </div>
                                )}
                                <div className={`${styles.CatalogTitle} ${activeSection === 'section4_4' ? styles.active : ''}`} onClick={() => setActiveSection('section4_4')}>
                                    4.4 全廠（場）溫室氣體排放量
                                </div>
                            </div>
                        )}

                        <div
                            className={styles.CatalogTitle}
                            onClick={() => toggleSection('section5')}
                        >
                            <span>第五章 數據品質管理 </span>
                            <FontAwesomeIcon icon={openSections.section5 ? faChevronUp : faChevronDown} />
                        </div>
                        {openSections.section5 && (
                            <div className={styles.subBlock}>
                                <div className={`${styles.CatalogTitle} ${activeSection === 'section5_1' ? styles.active : ''}`} onClick={() => setActiveSection('section5_1')}>
                                    5.1 不確定性量化資料來源
                                </div>
                                <div className={`${styles.CatalogTitle} ${activeSection === 'section5_2' ? styles.active : ''}`} onClick={() => setActiveSection('section5_2')}>
                                    5.2 不確定性評估結果
                                </div>
                            </div>
                        )}

                        <div
                            className={styles.CatalogTitle}
                            onClick={() => toggleSection('section6')}
                        >
                            <span>第六章 其他主管機關規定事項</span>
                            <FontAwesomeIcon icon={openSections.section6 ? faChevronUp : faChevronDown} />
                        </div>
                        {openSections.section6 && (
                            <div className={styles.subBlock}>
                                <div className={`${styles.CatalogTitle} ${activeSection === 'section6_1' ? styles.active : ''}`} onClick={() => setActiveSection('section6_1')}>
                                    6.1 事業執行減量措施及說明
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={styles.CatalogFoot}>
                        <a href="src/assets/files/盤查報告書參考範本_各行業通用.odt" download="盤查報告書參考範本_各行業通用.odt">點此下載報告書範本</a>
                    </div>
                </CCard>


                <CCard className={styles.cardMain}>
                    <div style={{ height: '95%' }}>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <button><FontAwesomeIcon icon={faArrowRightFromBracket} />&nbsp;匯出報告</button>
                    </div>

                </CCard>
            </div >


        </main >
    );
}

export default Tabs;
