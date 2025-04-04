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
    const [versions, setVersions] = useState([]); // 存放該年份的版本
    const [selectedVersion, setSelectedVersion] = useState(""); // 預設為「未選擇版本」
    const [inventoryTitle, setInventoryTitle] = useState("");
    const [uploadInfo, setUploadInfo] = useState("");
    const [file, setFile] = useState(null); // 上傳的檔案
    const [excelFile, setExcelFile] = useState(""); // Excel 檔案路徑

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

    // 獲取該年份的版本列表
    const fetchInventoryVersions = async (year) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/inventory_versions/${year}`, {
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
            console.error("Error fetching inventory versions:", error);
        }
    };

    // 當元件加載時請求年份
    useEffect(() => {
        fetchBaselineYears();
    }, []);

    // 當選擇的年份變更時，請求對應的版本
    useEffect(() => {
        if (selectedYear) {
            fetchInventoryVersions(selectedYear);
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

    // 顯示清冊按鈕事件
    const handleShowInventory = async () => {
        if (selectedVersion === "") {
            setExcelFile(""); // 清空 Excel 預覽
            setUploadInfo(""); // 清空資訊
            setInventoryTitle(""); // 清空標題
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/inventory_file/${selectedYear}/${selectedVersion}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                const data = await response.json();
                console.log("從後端接收到的清冊資料:", data);
                setExcelFile(data.file_path); // 設定 Excel 文件路徑

                const versionText = selectedVersion === "0" ? "系統原始生成版本" : `版本 ${selectedVersion}`;
                setInventoryTitle(`${selectedYear} 盤查清冊 - ${versionText}`);

                if (selectedVersion === "0") {
                    setUploadInfo(`系統生成之初始檔案 ${data.uploaded_at}`);
                } else {
                    const departmentName = departmentMap[data.department] || "未知部門";
                    setUploadInfo(`${departmentName} - ${data.username} ${data.uploaded_at}`);
                }
            } else {
                console.log(`Error fetching inventory file: ${response.status}`);
            }
        } catch (error) {
            console.error("Error fetching inventory file:", error);
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
                        <select
                            value={selectedVersion}
                            onChange={(e) => setSelectedVersion(e.target.value)}
                        >
                            <option value="">未選擇版本</option>
                            {versions.map(({ version }) => (
                                <option key={version} value={version}>
                                    {version === 0 ? "系統原始生成版本" : `版本 ${version}`}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button onClick={handleShowInventory}>
                        <FontAwesomeIcon icon={faEye} /> 顯示清冊
                    </button>

                </div>
                <div className={styles.buttonRight}>
                    <div>
                        <strong>選擇檔案</strong>
                        <input type="file" />
                    </div>

                    <button><FontAwesomeIcon icon={faFileArrowUp} /> 上傳編修後檔案</button>

                </div>
            </div>
            <div className="system-titlediv">
                <div>
                    <h4 className="system-title">{inventoryTitle || "請選擇清冊後顯示"}</h4>
                    <hr className="system-hr" style={{width:'360px'}}></hr>
                </div>
                <div className={styles.titleRight}>
                    <span style={{ color: 'gray', fontWeight: 'bold' }}>
                        {uploadInfo ? `該版本上傳資訊 : ${uploadInfo}` : ""}
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
