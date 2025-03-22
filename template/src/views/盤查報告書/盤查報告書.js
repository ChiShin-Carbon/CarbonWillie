import React, { useRef, useEffect } from 'react'
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


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExport } from '@fortawesome/free-solid-svg-icons';

import { Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { getDocument } from 'pdfjs-dist';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';




const Tabs = () => {
    const [activeSection, setActiveSection] = useState(null); // 用來追踪當前選中的章節

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
    ///////////////////////////////////////////////////////////////////////////////////////////

    const pdfFile = '/original_report/combined.pdf';
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const [chapterPages, setChapterPages] = useState({});
    const [viewerKey, setViewerKey] = useState(0); // 強迫重新渲染用
    const [targetPage, setTargetPage] = useState(null); // 目標頁面

    // 解析章節
    useEffect(() => {
        const extractTextFromPDF = async () => {
            try {
                const pdf = await getDocument(pdfFile).promise;
                let textContent = [];

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const text = await page.getTextContent();
                    const textItems = text.items.map((item) => item.str).join(' ');

                    if (textItems.includes('溫室氣體盤查報告書')) {
                        textContent.push({ chapter: '封面', page: i });
                    }
                    if (textItems.includes('第一章、機構簡介與政策聲明')) {
                        textContent.push({ chapter: '第一章、機構簡介與政策聲明', page: i });
                    }
                    if (textItems.includes('第二章、盤查邊界設定')) {
                        textContent.push({ chapter: '第二章、盤查邊界設定', page: i });
                    }
                    if (textItems.includes('第三章、報告溫室氣體排放量')) {
                        textContent.push({ chapter: '第三章、報告溫室氣體排放量', page: i });
                    }
                    if (textItems.includes('第四章、數據品質管理')) {
                        textContent.push({ chapter: '第四章、數據品質管理', page: i });
                    }
                    if (textItems.includes('第五章、基準年')) {
                        textContent.push({ chapter: '第五章、基準年', page: i });
                    }
                    if (textItems.includes('第六章、參考文獻')) {
                        textContent.push({ chapter: '第六章、參考文獻', page: i });
                    }
                }

                const chapters = {};
                textContent.forEach(({ chapter, page }) => {
                    chapters[chapter] = page;
                });

                setChapterPages(chapters);
            } catch (error) {
                console.error('解析 PDF 錯誤:', error);
            }
        };

        extractTextFromPDF();
    }, [pdfFile]);

    // ** 重新渲染 PDF 並跳到指定頁 **
    const goToPage = (pageNumber) => {
        setTargetPage(pageNumber);
        setViewerKey((prev) => prev + 1); // 透過 key 重新渲染
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
                            選擇版本
                        </strong>
                        <select>
                            <option>系統原始生成版本</option>
                            <option value="1">版本1</option>
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
                    <span style={{ color: 'gray', fontWeight: 'bold' }}>該版本上傳資訊 : XX部門-蔡沂庭 2024/12/2 23:59:23</span>
                    <button className={styles.save}>上傳編修後檔案</button>
                </div>

            </div>


            <div className={styles.cardRow}>
                <CCard className={styles.cardCatalog}>
                    <div className={styles.CatalogBody}>
                        <div className={`${styles.CatalogTitle} ${activeSection === 'cover' ? styles.active : ''}`}
                          onClick={() => { setActiveSection('cover'); goToPage(chapterPages['封面']); }}>封面</div>
                        {/* 綁定章節+跳頁 */}
                        <div className={`${styles.CatalogTitle} ${activeSection === 'section1' ? styles.active : ''}`}
                            onClick={() => { setActiveSection('section1'); goToPage(chapterPages['第一章、機構簡介與政策聲明']); }}>第一章、機構簡介與政策聲明</div>
                        <div className={`${styles.CatalogTitle} ${activeSection === 'section2' ? styles.active : ''}`}
                            onClick={() => { setActiveSection('section2'); goToPage(chapterPages['第二章、盤查邊界設定']); }}>第二章、盤查邊界設定</div>
                        <div className={`${styles.CatalogTitle} ${activeSection === 'section3' ? styles.active : ''}`}
                            onClick={() => { setActiveSection('section3'); goToPage(chapterPages['第三章、報告溫室氣體排放量']); }}>第三章、報告溫室氣體排放量</div>
                        <div className={`${styles.CatalogTitle} ${activeSection === 'section4' ? styles.active : ''}`}
                            onClick={() => { setActiveSection('section4'); goToPage(chapterPages['第四章、數據品質管理']); }}>第四章、數據品質管理</div>
                        <div className={`${styles.CatalogTitle} ${activeSection === 'section5' ? styles.active : ''}`}
                            onClick={() => { setActiveSection('section5'); goToPage(chapterPages['第五章、基準年']); }}>第五章、基準年</div>
                        <div className={`${styles.CatalogTitle} ${activeSection === 'section6' ? styles.active : ''}`}
                            onClick={() => { setActiveSection('section6'); goToPage(chapterPages['第六章、參考文獻']); }}>第六章、參考文獻</div>
                    </div>
                    <div className={styles.CatalogFoot}>
                        <a href="src/assets/files/盤查報告書參考範本_各行業通用.odt" download="盤查報告書參考範本_各行業通用.odt">點此下載報告書範本</a>
                    </div>
                </CCard>




                <CCard className={styles.cardMain}>
                    <div style={{ height: '600px' }}>
                        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                            <Viewer
                                key={viewerKey}
                                fileUrl={pdfFile}
                                defaultScale={SpecialZoomLevel.PageFit}
                                initialPage={targetPage ? targetPage - 1 : 0} // 透過 initialPage 跳轉
                                plugins={[defaultLayoutPluginInstance]}
                            />
                        </Worker>
                    </div>
                    <div className={styles.export}>
                        <button onClick={handleDownload}>
                        <FontAwesomeIcon icon={faFileExport} /> 匯出該版本報告
                        </button>

                    </div>

                </CCard>
            </div >


        </main >
    );
}

export default Tabs;
