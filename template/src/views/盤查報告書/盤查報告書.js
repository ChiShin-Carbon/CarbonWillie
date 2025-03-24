import React, { useRef, useEffect } from 'react'
import { useState } from 'react';
import axios from "axios"; // 用於 API 請求

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
import { faFileExport, faEye, faFileArrowUp } from '@fortawesome/free-solid-svg-icons';

import { Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { getDocument } from 'pdfjs-dist';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';




const Tabs = () => {
    const [activeSection, setActiveSection] = useState(null); // 用來追踪當前選中的章節

    const handleDownload = () => {
        if (!pdfFile) return;

        // 儲存 pdfFile 至變數 A
        const A = pdfFile;

        // 將 A 路徑的最後部分 .pdf 拆解並改成 .docx
        const downloadPath = A.replace(/\.pdf$/, '.docx');

        // 建立 <a> 元素來觸發下載
        const link = document.createElement('a');
        link.href = downloadPath;  // 使用修改後的路徑
        link.download = downloadPath.split('/').pop();  // 使用新的檔名，這裡會抓取路徑最後的部分
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    ///////////////////////////////////////////////////////////////////////////////////////////

    const [pdfFile, setPdfFile] = useState("");
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const [chapterPages, setChapterPages] = useState({});
    const [viewerKey, setViewerKey] = useState(0); // 強迫重新渲染用
    const [targetPage, setTargetPage] = useState(null); // 目標頁面

    useEffect(() => {
        if (!pdfFile) return;

        const extractTextFromPDF = async () => {
            try {
                const pdf = await getDocument(pdfFile).promise;
                let textContent = [];

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const text = await page.getTextContent();
                    const textItems = text.items.map((item) => item.str).join(" ");

                    if (textItems.includes("溫室氣體盤查報告書")) {
                        textContent.push({ chapter: "封面", page: i });
                    }
                    if (textItems.includes("第一章、機構簡介與政策聲明")) {
                        textContent.push({ chapter: "第一章、機構簡介與政策聲明", page: i });
                    }
                    if (textItems.includes("第二章、盤查邊界設定")) {
                        textContent.push({ chapter: "第二章、盤查邊界設定", page: i });
                    }
                    if (textItems.includes("第三章、報告溫室氣體排放量")) {
                        textContent.push({ chapter: "第三章、報告溫室氣體排放量", page: i });
                    }
                    if (textItems.includes("第四章、數據品質管理")) {
                        textContent.push({ chapter: "第四章、數據品質管理", page: i });
                    }
                    if (textItems.includes("第五章、基準年")) {
                        textContent.push({ chapter: "第五章、基準年", page: i });
                    }
                    if (textItems.includes("第六章、參考文獻")) {
                        textContent.push({ chapter: "第六章、參考文獻", page: i });
                    }
                }

                const chapters = {};
                textContent.forEach(({ chapter, page }) => {
                    chapters[chapter] = page;
                });

                setChapterPages(chapters);
            } catch (error) {
                console.error("解析 PDF 錯誤:", error);
            }
        };

        extractTextFromPDF();
    }, [pdfFile]);

    const goToPage = (pageNumber) => {
        setTargetPage(pageNumber);
        setViewerKey((prev) => prev + 1);
    };


    //////////////////////////////////////////後端API/////////////////////////////////////////

    const [years, setYears] = useState([]); // 存放年份
    const [selectedYear, setSelectedYear] = useState(""); // 選擇的年份
    const [versions, setVersions] = useState([]); // 存放該年份的版本
    const [selectedVersion, setSelectedVersion] = useState(""); // 預設為「未選擇版本」

    const [uploadInfo, setUploadInfo] = useState("");

    // 獲取年份列表
    const fetchBaselineYears = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/baseline_years", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                const data = await response.json();
                setYears(data.map(item => item.year)); // 提取年份
                if (data.length > 0) {
                    setSelectedYear(data[0].year); // 預設選中第一個年份
                }
            } else {
                console.log(`Error fetching years: ${response.status}`);
            }
        } catch (error) {
            console.error("Error fetching baseline years:", error);
        }
    };

    // 獲取該年份的版本列表
    const fetchReportVersions = async (year) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/report_versions/${year}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                const data = await response.json();
                const versionOptions = [{ version: 0 }, ...data]; // 加入「系統原始生成版本」
                setVersions(versionOptions);
            } else {
                console.log(`Error fetching versions: ${response.status}`);
            }
        } catch (error) {
            console.error("Error fetching report versions:", error);
        }
    };

    // 當元件加載時請求年份
    useEffect(() => {
        fetchBaselineYears();
    }, []);

    // 當選擇的年份變更時，請求對應的版本
    useEffect(() => {
        if (selectedYear) {
            fetchReportVersions(selectedYear);
        }
    }, [selectedYear]);


    const departmentMap = {
        1: "管理部門",
        2: "資訊部門",
        3: "業務部門",
        4: "門診部門",
        5: "健檢部門",
        6: "檢驗部門",
        7: "其他",
    };

    // 產出報告按鈕事件
    const handleGenerateReport = async () => {
        if (selectedVersion === "") {
            setPdfFile(""); // 清空 PDF 預覽
            setUploadInfo(""); // 清空資訊
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/report_file/${selectedYear}/${selectedVersion}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                const data = await response.json();
                setPdfFile(data.file_path); // 設定 PDF 文件路徑

                if (selectedVersion === "0") {
                    setUploadInfo(`系統生成之初始檔案 ${data.uploaded_at}`);
                } else {
                    const departmentName = departmentMap[data.department] || "未知部門";
                    setUploadInfo(`${departmentName} - ${data.username} ${data.uploaded_at}`);
                }
            } else {
                console.log(`Error fetching report file: ${response.status}`);
            }
        } catch (error) {
            console.error("Error fetching report file:", error);
        }
    };

    //////////////////////////////////上傳檔案API/////////////////////////////
    const [file, setFile] = useState(null); // 上傳的檔案
    const [errorMessage, setErrorMessage] = useState(""); // 用於顯示錯誤訊息



    // 處理檔案選擇
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            // 檢查檔案格式
            if (selectedFile.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                setErrorMessage("請上傳word檔案(.docx)");
                setFile(null); // 重置檔案
            } else {
                setErrorMessage(""); // 清除錯誤訊息
                setFile(selectedFile);
            }
        }
    };
    // 上傳檔案
    const handleUpload = async () => {
        if (!file) {
            setErrorMessage("請選擇檔案!");
            return;
        }
        try {
            const formData = new FormData();
            formData.append('user_id', 1); // 假設使用者 ID 為 1
            formData.append('year', selectedYear);
            formData.append('file', file);

            const response = await fetch("http://127.0.0.1:8000/upload_report/", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                alert("檔案上傳成功!");
                console.log("檔案上傳成功:", data);
            } else {
                console.log(`Error uploading file: ${response.status}`);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };


    return (
        <main>
            <div className={styles.systemTablist}>
                <div className={styles.tabsLeft}>
                    <div>
                        <strong>
                            選擇年分
                        </strong>
                        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                            {years.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <strong>
                            選擇版本
                        </strong>
                        <select value={selectedVersion} onChange={(e) => setSelectedVersion(e.target.value)}>
                            <option value="">未選擇版本</option> {/* 新增預設選項 */}
                            {versions.map(({ version }) => (
                                <option key={version} value={version}>
                                    {version === 0 ? "系統原始生成版本" : `版本 ${version}`}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className={styles.buttonRight}>
                    <button onClick={handleGenerateReport}><FontAwesomeIcon icon={faEye} /> 顯示報告</button>

                    <div>
                        <strong>選擇檔案</strong>
                        <input type="file" onChange={handleFileChange} />
                        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    </div>

                    <div>
                        <button onClick={handleUpload}>上傳編修後檔案</button>
                    </div>
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
                    <span style={{ color: 'gray', fontWeight: 'bold' }}>
                        {uploadInfo ? `該版本上傳資訊 : ${uploadInfo}` : ""}
                    </span>

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
                        {pdfFile ? (
                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                <Viewer
                                    key={viewerKey}
                                    fileUrl={pdfFile}
                                    defaultScale={SpecialZoomLevel.PageFit}
                                    initialPage={targetPage ? targetPage - 1 : 0}
                                    plugins={[defaultLayoutPluginInstance]}
                                />
                            </Worker>
                        ) : (
                            <div className={styles.noChoose}>請先選擇報告書版本!</div>
                        )}
                    </div>
                    <div className={styles.export}>
                        {pdfFile && (
                            <button onClick={handleDownload}>
                                <FontAwesomeIcon icon={faFileExport} /> 匯出該版本報告
                            </button>
                        )}

                    </div>

                </CCard>
            </div >


        </main >
    );
}

export default Tabs;
