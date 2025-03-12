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

    const userId = window.sessionStorage.getItem('user_id');
    console.log('目前的 user_id:', userId);

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
                        <div className={`${styles.CatalogTitle} ${activeSection === 'section1' ? styles.active : ''}`} onClick={() => setActiveSection('section1')}>第一章、機構簡介與政策聲明</div>
                        <div className={`${styles.CatalogTitle} ${activeSection === 'section2' ? styles.active : ''}`} onClick={() => setActiveSection('section2')}>第二章、盤查邊界設定</div>
                        <div className={`${styles.CatalogTitle} ${activeSection === 'section3' ? styles.active : ''}`} onClick={() => setActiveSection('section3')}>第三章、報告溫室氣體排放量</div>
                        <div className={`${styles.CatalogTitle} ${activeSection === 'section4' ? styles.active : ''}`} onClick={() => setActiveSection('section4')}>第四章、數據品質管理</div>
                        <div className={`${styles.CatalogTitle} ${activeSection === 'section5' ? styles.active : ''}`} onClick={() => setActiveSection('section5')}>第五章、基準年</div>
                        <div className={`${styles.CatalogTitle} ${activeSection === 'section6' ? styles.active : ''}`} onClick={() => setActiveSection('section6')}>第六章、參考文獻</div>

                       
                    </div>
                    <div className={styles.CatalogFoot}>
                        <a href="src/assets/files/盤查報告書參考範本_各行業通用.odt" download="盤查報告書參考範本_各行業通用.odt">點此下載報告書範本</a>
                    </div>
                </CCard>




                <CCard className={styles.cardMain}>
                    <div style={{ height: '95%' }}>

                        

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
