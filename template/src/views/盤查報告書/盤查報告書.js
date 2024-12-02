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


    const handleDownload = () => {
        // Specify the file URL and file name
        const fileUrl = 'src/assets/files/啟新-2024溫室氣體盤查報告書_V1.docx';
        const fileName = '啟新-2024溫室氣體盤查報告書_V1.docx';

        // Create a temporary anchor element
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;

        // Append to the document, trigger the download, and remove it
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                    {/* <select>
                        <option>編輯完成</option>
                        <option value="1">編輯中</option>
                    </select>
                    <button className={styles.save}>儲存</button> */}
                    <span style={{color:'gray',fontWeight:'bold'}}>最後上傳資訊 : XX部門-蔡沂庭 2024/12/2 23:59:23</span>
                    <button className={styles.save}>上傳編修後檔案</button> 
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
                            <span>第三章 報告溫室氣體排放量</span>
                            <FontAwesomeIcon icon={openSections.section3 ? faChevronUp : faChevronDown} />
                        </div>
                        {openSections.section3 && (
                            <div className={styles.subBlock}>
                                <div className={`${styles.CatalogTitle} ${activeSection === 'section3_1' ? styles.active : ''}`} onClick={() => setActiveSection('section3_1')}>
                                    3.1 溫室氣體排放類型與排放量說明
                                </div>
                                <div className={`${styles.CatalogTitle} ${activeSection === 'section3_2' ? styles.active : ''}`} onClick={() => setActiveSection('section3_2')}>
                                    3.2  直接溫室氣體排放(類別 1 排放)
                                </div>
                                <div className={`${styles.CatalogTitle} ${activeSection === 'section3_3' ? styles.active : ''}`} onClick={() => setActiveSection('section3_3')}>
                                    3.3  能源間接溫室氣體排放(類別 2 排放)
                                </div>
                                <div className={`${styles.CatalogTitle} ${activeSection === 'section3_4' ? styles.active : ''}`} onClick={() => setActiveSection('section3_4')}>
                                    3.4 溫室氣體總排放量
                                </div>
                            </div>
                        )}

                        <div
                            className={styles.CatalogTitle}
                            onClick={() => toggleSection('section4')}
                        >
                            <span>第四章 數據品質管理</span>
                            <FontAwesomeIcon icon={openSections.section4 ? faChevronUp : faChevronDown} />
                        </div>
                        {openSections.section4 && (
                            <div className={styles.subBlock}>
                                <div className={`${styles.CatalogTitle} ${activeSection === 'section4_1' ? styles.active : ''}`} onClick={() => setActiveSection('section4_1')}>
                                    4.1 量化方法
                                </div>
                                <div className={`${styles.CatalogTitle} ${activeSection === 'section4_2' ? styles.active : ''}`} onClick={() => setActiveSection('section4_2')}>
                                    4.2 量化方法變更說明
                                </div>
                                <div
                                    className={styles.CatalogTitle}
                                    onClick={() => toggleSection('section4_3')}
                                >
                                    <span>4.3 排放係數與變更說明</span>
                                </div>
                                <div className={`${styles.CatalogTitle} ${activeSection === 'section4_4' ? styles.active : ''}`} onClick={() => setActiveSection('section4_4')}>
                                    4.4 有效位數
                                </div>
                                <div className={`${styles.CatalogTitle} ${activeSection === 'section4_5' ? styles.active : ''}`} onClick={() => setActiveSection('section4_5')}>
                                    4.5 重大排放源之資訊流
                                </div>
                                <div className={`${styles.CatalogTitle} ${activeSection === 'section4_6' ? styles.active : ''}`} onClick={() => setActiveSection('section4_6')}>
                                    4.6 本次盤含排除事項、注意事項及推估說明
                                </div>
                            </div>
                        )}

                        <div
                            className={styles.CatalogTitle}
                            onClick={() => toggleSection('section5')}
                        >
                            <span>第五章 基準年 </span>
                            <FontAwesomeIcon icon={openSections.section5 ? faChevronUp : faChevronDown} />
                        </div>
                        {openSections.section5 && (
                            <div className={styles.subBlock}>
                                <div className={`${styles.CatalogTitle} ${activeSection === 'section5_1' ? styles.active : ''}`} onClick={() => setActiveSection('section5_1')}>
                                    5.1 基準年設定
                                </div>
                            </div>
                        )}

                        <div className={`${styles.CatalogTitle} ${activeSection === 'section6' ? styles.active : ''}`} onClick={() => setActiveSection('section6')}>第六章 參考文獻</div>
                    </div>
                    <div className={styles.CatalogFoot}>
                        <a href="src/assets/files/盤查報告書參考範本_各行業通用.odt" download="盤查報告書參考範本_各行業通用.odt">點此下載報告書範本</a>
                    </div>
                </CCard>




                <CCard className={styles.cardMain}>
                    <div style={{ height: '95%' }}>

                        {activeSection === 'cover' && (
                            <img
                                src="../img/封面.jpeg"
                                alt="Cover"
                                style={{ width: '100%', height: 'auto' }}
                            />
                        )}
                        {activeSection === 'catalog' && (
                            <img
                                src="../img/目錄.jpeg"
                                alt="Catalog"
                                style={{ width: '100%', height: 'auto' }}
                            />
                        )}

                        {activeSection === 'section1' && (
                            <img
                                src="../img/第一章.jpeg"
                                alt="Section1"
                                style={{ width: '100%', height: 'auto' }}
                            />
                        )}

                        {activeSection === 'section2' && (
                            <img
                                src="../img/第二章.jpeg"
                                alt="Section2"
                                style={{ width: '100%', height: 'auto' }}
                            />
                        )}

                        {activeSection === 'section3_1' && (
                            <img
                                src="../img/第三章1.jpeg"
                                alt="Section3_1"
                                style={{ width: '100%', height: 'auto' }}
                            />
                        )}
                        {activeSection === 'section3_2' && (
                            <div>
                                <img
                                    src="../img/第三章2.jpeg"
                                    alt="Section3_2"
                                    style={{ width: '100%', height: 'auto' }}
                                />
                                <img
                                    src="../img/第三章2_2.jpeg"
                                    alt="Section3_3"
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            </div>
                        )}

                        {activeSection === 'section3_3' && (
                            <img
                                src="../img/第三章3.jpeg"
                                alt="Section3_3"
                                style={{ width: '100%', height: 'auto' }}
                            />
                        )}

                        {activeSection === 'section3_4' && (
                            <img
                                src="../img/第三章4.jpeg"
                                alt="Section3_4"
                                style={{ width: '100%', height: 'auto' }}
                            />
                        )}

                        {activeSection === 'section4_1' && (
                            <div>
                                <img
                                    src="../img/第四章.jpeg"
                                    alt="Section3_2"
                                    style={{ width: '100%', height: 'auto' }}
                                />
                                <img
                                    src="../img/第四章2.jpeg"
                                    alt="Section3_3"
                                    style={{ width: '100%', height: 'auto' }}
                                />
                                <img
                                    src="../img/第四章3.jpeg"
                                    alt="Section3_3"
                                    style={{ width: '100%', height: 'auto' }}
                                />
                                <img
                                    src="../img/第四章4.jpeg"
                                    alt="Section3_3"
                                    style={{ width: '100%', height: 'auto' }}
                                />
                                <img
                                    src="../img/第四章5.jpeg"
                                    alt="Section3_3"
                                    style={{ width: '100%', height: 'auto' }}
                                />
                                <img
                                    src="../img/第四章6.jpeg"
                                    alt="Section3_3"
                                    style={{ width: '100%', height: 'auto' }}
                                />
                                <img
                                    src="../img/第四章7.jpeg"
                                    alt="Section3_3"
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            </div>
                        )}

                        {activeSection === 'section4_2' && (
                            <img
                                src="../img/第四章_2.jpeg"
                                alt="Section3_3"
                                style={{ width: '100%', height: 'auto' }}
                            />
                        )}

                        {activeSection === 'section4_3' && (
                            <img
                                src="../img/第四章_3.jpeg"
                                alt="Section3_3"
                                style={{ width: '100%', height: 'auto' }}
                            />
                        )}

                        {activeSection === 'section4_4' && (
                            <img
                                src="../img/第四章_4.jpeg"
                                alt="Section3_3"
                                style={{ width: '100%', height: 'auto' }}
                            />
                        )}

                        {activeSection === 'section4_5' && (
                            <img
                                src="../img/第四章_5.jpeg"
                                alt="Section3_3"
                                style={{ width: '100%', height: 'auto' }}
                            />
                        )}

                        {activeSection === 'section4_6' && (
                            <img
                                src="../img/第四章8.jpeg"
                                alt="Section3_3"
                                style={{ width: '100%', height: 'auto' }}
                            />
                        )}

                        {activeSection === 'section5_1' && (
                            <img
                                src="../img/第五章.jpeg"
                                alt="Section3_3"
                                style={{ width: '100%', height: 'auto' }}
                            />
                        )}

                        {activeSection === 'section6' && (
                            <img
                                src="../img/第六章.jpeg"
                                alt="Section3_3"
                                style={{ width: '100%', height: 'auto' }}
                            />
                        )}




                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <button onClick={handleDownload}>
                            <FontAwesomeIcon icon={faArrowRightFromBracket} /> 匯出報告
                        </button>
                    </div>

                </CCard>
            </div >


        </main >
    );
}

export default Tabs;
