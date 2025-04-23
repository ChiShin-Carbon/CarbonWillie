import React, { useRef, useEffect } from 'react'
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
import { faArrowRightFromBracket, faFileExport, faEye, faFileArrowUp } from '@fortawesome/free-solid-svg-icons';


const Tabs = () => {
    const [activeTab, setActiveTab] = useState('tab1') // 記錄當前活動的分頁

    // 存放從API獲取的數據
    const [years, setYears] = useState([]); // 存放年份
    const [selectedYear, setSelectedYear] = useState(""); // 選擇的年份
    const [displayedYear, setDisplayedYear] = useState(""); // 目前顯示的年份
    const [inventoryTitle, setInventoryTitle] = useState("");
    const [uploadInfo, setUploadInfo] = useState("");
    const [excelFile, setExcelFile] = useState(""); // Excel 檔案路徑
    const [inventoryDisplayed, setInventoryDisplayed] = useState(false); // 追蹤是否顯示清冊

    // 獲取年份列表
    const fetchBaselineYears = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/inventory_baseline_years", {
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

    // 當元件加載時請求年份
    useEffect(() => {
        fetchBaselineYears();
    }, []);

    // 顯示清冊按鈕事件
    const handleShowInventory = async () => {
        if (!selectedYear) {
            alert("請選擇年份!");
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/inventory_file/${selectedYear}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                const data = await response.json();
                console.log("從後端接收到的清冊資料:", data);
                setExcelFile(data.file_path); // 設定 Excel 文件路徑
                setInventoryTitle(`${selectedYear} 盤查清冊`);
                setUploadInfo(`系統生成檔案 ${data.created_at || '未知時間'}`);
                setInventoryDisplayed(true); // 設置已顯示清冊狀態為 true
                setDisplayedYear(selectedYear); // 設置當前顯示的年份
            } else {
                console.log(`Error fetching inventory file: ${response.status}`);
                alert("獲取清冊失敗，請稍後再試");
            }
        } catch (error) {
            console.error("Error fetching inventory file:", error);
            alert("獲取清冊過程發生錯誤，請稍後再試");
        }
    };

    ////////////////////////////////////////////
    const handleDownload = () => {
        if (!excelFile) return;

        const downloadPath = excelFile;

        // 建立 <a> 元素來觸發下載
        const link = document.createElement('a');
        link.href = downloadPath;  // 使用修改後的路徑
        link.download = downloadPath.split('/').pop();  // 使用新的檔名，這裡會抓取路徑最後的部分
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    //////////////////////////////////////////////////////

    // 上傳檔案
    const [file, setFile] = useState(null); // 上傳的檔案

    // 處理檔案選擇
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            // 修改檢查邏輯為 Excel 檔案
            const isExcel =
                selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || // .xlsx
                selectedFile.type === "application/vnd.ms-excel"; // .xls

            if (!isExcel) {
                alert("請上傳 Excel 檔案 (.xlsx 或 .xls)!");
                setFile(null); // 重置檔案
            } else {
                setFile(selectedFile);
            }
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert("請選擇檔案!");
            return;
        }

        try {
            alert("上傳中請稍等..."); // Step 1: 上傳前顯示

            const formData = new FormData();
            formData.append('user_id', window.sessionStorage.getItem("user_id")); // 假設使用者 ID 為 1
            formData.append('year', selectedYear);
            formData.append('file', file);

            const response = await fetch("http://127.0.0.1:8000/upload_inventory/", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log("檔案上傳成功:", data);

                alert("檔案上傳成功!"); // Step 2: 成功後提示
                location.reload();       // Step 3: 使用者按下「確定」後重新整理頁面
            } else {
                console.log(`Error uploading file: ${response.status}`);
                alert("上傳失敗，請稍後再試");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("上傳過程發生錯誤，請稍後再試");
        }
    };

    // 渲染未選擇年份或尚未顯示清冊時的提示元件
    const NotSelectedYearMessage = () => (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            fontSize: '18px',
            color: '#666',
            fontWeight: 'bold'
        }}>
            請先選擇要查看的年份!
        </div>
    );

    return (
        <main>
            <div className={styles.systemTablist}>
                <div className={styles.tabsLeft}>
                    <div>
                        <strong>
                            選擇年分
                        </strong>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                        >
                            {years.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <strong>
                            選擇版本
                        </strong>
                        <select disabled>
                            <option>系統原始生成版本</option>
                        </select>
                    </div>
                </div>
                <div className={styles.buttonRight}>
                    <button onClick={handleShowInventory}>
                        <FontAwesomeIcon icon={faEye} /> 顯示清冊
                    </button>
                </div>
            </div>
            <div className="system-titlediv">
                <div>
                    <h4 className="system-title">{inventoryTitle || "請選擇清冊後顯示"}</h4>
                    <hr className="system-hr" style={{ width: '360px' }}></hr>
                </div>
                <div className={styles.titleRight}>
                    <span style={{ color: 'gray', fontWeight: 'bold' }}>
                        {uploadInfo ? `檔案資訊 : ${uploadInfo}` : ""}
                    </span>
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
                    {/* 內容 - 根據是否顯示清冊決定顯示內容或提示 */}
                    {!inventoryDisplayed ? (
                        <NotSelectedYearMessage />
                    ) : (
                        <>
                            {activeTab === 'tab1' && <Division year={displayedYear} />}
                            {activeTab === 'tab2' && <ClassOne year={displayedYear} />}
                            {activeTab === 'tab3' && <ClassTwo year={displayedYear} />}
                            {activeTab === 'tab4' && <ClassThree year={displayedYear} />}
                        </>
                    )}
                </div>
                {/* 按鈕固定在底部 */}
                <div className={styles.bodyBottom}>
                    {!inventoryDisplayed ? (
                        <></>
                    ) : (
                        <button onClick={handleDownload}>
                            <FontAwesomeIcon icon={faArrowRightFromBracket} /> 匯出清冊
                        </button>
                    )}

                </div>
            </div>

        </main >
    );
}

export default Tabs;