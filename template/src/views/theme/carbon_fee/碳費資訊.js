import React, { useState } from 'react'
import {
    CRow, CCol, CCard, CCardBody, CCardHeader, CFormSelect, CNav, CNavItem, CNavLink, CForm, CFormLabel, CFormInput,
    CCardSubtitle,
    CCardText,
    CCardTitle, CButton,
    CTable,
    CTableBody,
    CTableCaption,
    CTableHead,
    CTableHeaderCell,
    CTableDataCell,
    CTableRow,
} from '@coreui/react'
import {
    CChartBar,
    CChartDoughnut,
    CChartLine,
    CChartPie,
    CChartPolarArea,
    CChartRadar,
} from '@coreui/react-chartjs'
import { Chart } from 'chart.js';
import { DocsCallout } from 'src/components'
import { DocsExample } from 'src/components'
import CIcon from '@coreui/icons-react'
import {
    cilDataTransferDown,
    cilDataTransferUp,
    cilMenu,
    cilChartPie,
    cilNewspaper,
} from '@coreui/icons'
// import { freeSet } from '@coreui/icons'
// import { getIconsView } from '../brands/Brands.js'


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableList, faChartPie } from '@fortawesome/free-solid-svg-icons';


import styles from '../../../scss/盤查結果查詢.module.css';


const Tabs = () => {
    const random = () => Math.round(Math.random() * 100)
    const [activeTab, setActiveTab] = useState('tab1'); // 記錄當前活動的分頁
    const cellStyle = { border: '1px solid white', textAlign: 'center', verticalAlign: 'middle', height: '40px'}; // table_th設定

    return (
        <CRow>
            <div className={styles.systemTablist}>
                <div className={styles.tabsLeft}>
                    <div style={{ width: '250px', display: 'flex', justifyContent: 'left' }}>
                        <strong style={{ fontSize: '1.0rem', display: 'flex', alignItems: 'center', padding: '5px' }}>
                            選擇年分
                        </strong>
                        <CCol style={{ justifyContent: 'left', alignItems: 'center', padding: '0' }}>
                            <CFormSelect style={{ width: '120px' }}>
                                <option>2025</option>
                                <option value="1">2024</option>
                                <option value="2">2023</option>
                                <option value="3">2022</option>
                            </CFormSelect>
                        </CCol>
                    </div>
                    <div style={{ width: '300px', display: 'flex', justifyContent: 'left' }}>
                        <strong style={{ fontSize: '1.0rem', display: 'flex', alignItems: 'center', padding: '5px' }}>
                            參考標準
                        </strong>
                        <CCol style={{ justifyContent: 'left', alignItems: 'center', padding: '0' }}>
                            <CFormSelect style={{ width: '90px' }}>
                                <option>台灣</option>
                                <option value="1">歐盟</option>
                                <option value="2">xx2023盤查報告</option>
                                <option value="3">xx2022盤查報告</option>
                            </CFormSelect>
                        </CCol>
                    </div>
                </div>
                {/* <div className={styles.buttonRight}>
                    <button>
                        <CIcon style={{ display: 'inline' }} icon={cilDataTransferUp} className="me-2" />
                        上傳檔案
                    </button>
                </div> */}
            </div>
            <div style={{ height: '10px' }}></div>
            <CCol xs={12}>
                <CNav variant="tabs" className="card-header-tabs">
                    <CNavItem >
                        <CNavLink active={activeTab === 'tab1'}
                            onClick={() => setActiveTab('tab1')}
                            className={activeTab === 'tab1' ? styles.tabChoose : styles.tabNoChoose}>
                            <div>
                                <FontAwesomeIcon icon={faTableList} />
                                &nbsp;碳費計算
                            </div>
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink active={activeTab === 'tab2'}
                            onClick={() => setActiveTab('tab2')}
                            className={activeTab === 'tab2' ? styles.tabChoose : styles.tabNoChoose}>
                            <div>
                                <FontAwesomeIcon icon={faChartPie} />
                                &nbsp;碳費分析
                            </div>
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink active={activeTab === 'tab3'}
                            onClick={() => setActiveTab('tab3')}
                            className={activeTab === 'tab3' ? styles.tabChoose : styles.tabNoChoose}>
                            <div>
                                <FontAwesomeIcon icon={cilNewspaper} />
                                &nbsp;碳費新聞
                            </div>
                        </CNavLink>
                    </CNavItem>
                </CNav>

                <div className={styles.body}>
                    {/* /*表格呈現頁 */}
                    {activeTab === 'tab1' && (
                        <>
                            <div className={styles.titleContainer}>
                                <div className={styles.leftItem}>
                                    <div><strong>xx2024盤查報告</strong></div>
                                    <div>
                                        <CFormSelect size="sm" className={styles.input} >
                                            <option>全部表格</option>
                                            <option value="1">表1</option>
                                            <option value="2">表2</option>
                                            <option value="3">表3</option>
                                        </CFormSelect></div>
                                </div>
                                <div className={styles.rightItem}>
                                    <button>
                                        <CIcon icon={cilDataTransferDown} className="me-2" />
                                        下載全部
                                    </button>
                                </div>
                            </div>
                            <br></br>
                            {/* 類別一及類別二排放形式排放量統計表 */}
                            <CCard style={{ width: '100%' }}>
                                <CCardBody>
                                    <CRow>
                                        <CCardTitle>
                                            <CRow>
                                                <div style={{ width: '100%', height: '50px', display: 'grid', alignItems: 'center', }}>
                                                    <strong style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', padding: '5px' }}>總覽</strong>
                                                    <CButton style={{ position: 'absolute', right: '30px', width: '40px', backgroundColor: '#9D6B6B', color: 'white', display: 'flex', alignItems: 'center' }}>
                                                        <b><CIcon icon={cilDataTransferDown} className="me-2" /></b>
                                                    </CButton>
                                                </div>
                                            </CRow>
                                        </CCardTitle>
                                    </CRow>
                                    <table style={{ width: '1100px' }}>
                                        <thead style={{ border: '1px solid white', backgroundColor: '#339933', color: 'white' }}>
                                            <tr>
                                                <th scope="col" style={cellStyle} rowSpan={2}></th>
                                                <th scope="col" style={cellStyle} rowSpan={2}>排放當量<br></br>(公噸CO2e/年)</th>
                                                <th scope="col" style={cellStyle} rowSpan={2}>百分比<br></br>(%)</th>
                                                <th scope="col" style={cellStyle} rowSpan={2}>一般費率<br></br>(300元/公噸CO2e)</th>
                                                <th scope="col" style={cellStyle} colSpan={2}>優惠費率</th>
                                            </tr>
                                            <tr>
                                                <th scope="col" style={cellStyle}>達技術標竿<br></br>(100元/公噸CO2e)</th>
                                                <th scope="col" style={cellStyle}>達行業別目標<br></br>(50元/公噸CO2e)</th>
                                            </tr>
                                        </thead>
                                        <tbody style={{ border: '1px solid white', backgroundColor: '#ccffcc' }}>
                                        <tr>
                                            <td style={{ border: '1px solid white', width:'200px'}}><b>總排放量</b></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                        </tr>
                                        <tr>
                                            <td style={{ border: '1px solid white'}}><b><div><CRow><div style={{width:'120px'}}>直接排放</div><div style={{width:'80px'}}>/範疇一</div></CRow></div></b></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                        </tr>
                                        <tr>
                                            <td style={{ border: '1px solid white'}}><b><div><CRow><div style={{width:'120px'}}>間接排放</div><div style={{width:'80px'}}>/範疇二</div></CRow></div></b></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                        </tr>
                                        <tr>
                                            <td style={{ border: '1px solid white'}}><b><div><CRow><div style={{width:'120px'}}>其他間接排放</div><div style={{width:'80px'}}>/範疇三</div></CRow></div></b></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <br />
                                </CCardBody>
                            </CCard>
                            <br></br>
                            {/* 技術標竿指定削減率 */}
                            <CCard style={{ width: '100%' }}>
                                <CCardBody>
                                    <CRow>
                                        <CCardTitle>
                                            <CRow>
                                                <div style={{ width: '100%', height: '50px', display: 'grid', alignItems: 'center', }}>
                                                    <strong style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', padding: '5px' }}>技術標竿指定削減率</strong>
                                                    <CButton style={{ position: 'absolute', right: '30px', width: '40px', backgroundColor: '#9D6B6B', color: 'white', display: 'flex', alignItems: 'center' }}>
                                                        <b><CIcon icon={cilDataTransferDown} className="me-2" /></b>
                                                    </CButton>
                                                </div>
                                            </CRow>
                                        </CCardTitle>
                                    </CRow>
                                    <table style={{ width: '900px' }}>
                                        <thead style={{ border: '1px solid white', backgroundColor: '#339933', color: 'white' }}>
                                            <tr>
                                                <th scope="col" style={cellStyle} colSpan={2}></th>
                                                <th scope="col" style={cellStyle}>排放當量<br></br>(公噸CO2e/年)</th>
                                                <th scope="col" style={cellStyle}>削減率<br></br>(%)</th>
                                                <th scope="col" style={cellStyle}>標準削減率<br></br>(%)</th>
                                            </tr>
                                        </thead>
                                        <tbody style={{ border: '1px solid white', backgroundColor: '#ccffcc' }}>
                                        <tr>
                                            <td style={{ border: '1px solid white', width:'200px', textAlign: 'center', verticalAlign: 'middle'}} colSpan={2}><b>直接排放：<br></br>固定燃燒排放源</b></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}>需計算</td>
                                        </tr>
                                        <tr>
                                            <td style={{ border: '1px solid white', width: '100px', textAlign: 'center', verticalAlign: 'middle'}} rowSpan={3}><b>直接排放：<br></br>製程排放</b></td>
                                            <td style={{border: '1px solid white', textAlign: 'center', verticalAlign: 'middle', height: '40px',width:'100px'}}><b>含氟氣體</b></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}>85%</td>
                                        </tr>
                                        <tr>
                                            <td style={cellStyle}><b>氧化亞氮</b></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}>50%</td>
                                        </tr>
                                        <tr>
                                            <td style={cellStyle}><b>其他製程</b></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}>3%</td>
                                        </tr>
                                        <tr>
                                            <td style={{ border: '1px solid white', width:'200px', textAlign: 'center', verticalAlign: 'middle'}} colSpan={2}><b>使用電力間接排放</b></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}>6%</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <br />
                                </CCardBody>
                            </CCard>
                            <br></br>
                            <br></br>
                        </>
                    )}

                    {/* /*圖表呈現頁 */}
                    {activeTab === 'tab2' && (
                        <>
                            {/* 類別一及類別二排放形式排放量統計表 */}
                            <CCard style={{ width: '100%' }}>
                                <CCardBody>
                                    <CRow>
                                        <CCardTitle>
                                            <CRow>
                                                <div style={{ width: '100%', height: '50px', display: 'grid', alignItems: 'center', }}>
                                                    <strong style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', padding: '5px' }}>總覽</strong>
                                                    <CButton style={{ position: 'absolute', right: '30px', width: '40px', backgroundColor: '#9D6B6B', color: 'white', display: 'flex', alignItems: 'center' }}>
                                                        <b><CIcon icon={cilDataTransferDown} className="me-2" /></b>
                                                    </CButton>
                                                </div>
                                            </CRow>
                                        </CCardTitle>
                                    </CRow>
                                    <table style={{ width: '1100px' }}>
                                        <thead style={{ border: '1px solid white', backgroundColor: '#339933', color: 'white' }}>
                                            <tr>
                                                <th scope="col" style={cellStyle} rowSpan={2}></th>
                                                <th scope="col" style={cellStyle} rowSpan={2}>排放當量<br></br>(公噸CO2e/年)</th>
                                                <th scope="col" style={cellStyle} rowSpan={2}>百分比<br></br>(%)</th>
                                                <th scope="col" style={cellStyle} rowSpan={2}>一般費率<br></br>(300元/公噸CO2e)</th>
                                                <th scope="col" style={cellStyle} colSpan={2}>優惠費率</th>
                                            </tr>
                                            <tr>
                                                <th scope="col" style={cellStyle}>達技術標竿<br></br>(100元/公噸CO2e)</th>
                                                <th scope="col" style={cellStyle}>達行業別目標<br></br>(50元/公噸CO2e)</th>
                                            </tr>
                                        </thead>
                                        <tbody style={{ border: '1px solid white', backgroundColor: '#ccffcc' }}>
                                        <tr>
                                            <td style={{ border: '1px solid white', width:'200px'}}><b>總排放量</b></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                        </tr>
                                        <tr>
                                            <td style={{ border: '1px solid white'}}><b><div><CRow><div style={{width:'120px'}}>直接排放</div><div style={{width:'80px'}}>/範疇一</div></CRow></div></b></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                        </tr>
                                        <tr>
                                            <td style={{ border: '1px solid white'}}><b><div><CRow><div style={{width:'120px'}}>間接排放</div><div style={{width:'80px'}}>/範疇二</div></CRow></div></b></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                        </tr>
                                        <tr>
                                            <td style={{ border: '1px solid white'}}><b><div><CRow><div style={{width:'120px'}}>其他間接排放</div><div style={{width:'80px'}}>/範疇三</div></CRow></div></b></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <br />
                                </CCardBody>
                            </CCard>
                            <br></br>
                            <div className={styles.titleContainer}>
                                <div className={styles.leftItem}>
                                    <div><strong>xx2024盤查報告</strong></div>
                                    <div>
                                        <CFormSelect size="sm" className={styles.input} >
                                            <option>全部圖形</option>
                                            <option value="1">表1</option>
                                            <option value="2">表2</option>
                                            <option value="3">表3</option>
                                        </CFormSelect></div>
                                </div>
                                <div className={styles.rightItem}>
                                    <button>
                                        <CIcon icon={cilDataTransferDown} className="me-2" />
                                        下載全部
                                    </button>
                                </div>
                            </div>

                            
                            <CRow>
                                {/* 圓餅圖 */}
                                <CCol xs={6}>
                                    <CCard className="mb-4">
                                        <CCardHeader style={{ backgroundColor: '#9D6B6B', height: '50px', display: 'flex', alignItems: 'center', }}>
                                            <strong style={{ fontSize: '1.2rem', color: 'white', display: 'flex', alignItems: 'center', padding: '5px' }}>碳排範疇比例 / </strong>
                                            <strong style={{ fontSize: '1.0rem', color: 'white', padding: '5px' }}>圓餅圖</strong>
                                            <CButton style={{ position: 'absolute', right: '10px', color: 'white', display: 'flex', alignItems: 'center' }}>
                                                <b><CIcon icon={cilDataTransferDown} style={{ fontSize: '24px' }} /></b>
                                            </CButton>
                                        </CCardHeader>
                                        <CCardBody style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', }}>
                                            <div style={{ width: '350px', height: '350px' }}>
                                                <CChartPie
                                                    data={{
                                                        labels: ['範疇一', '範疇二', '範疇三'],
                                                        datasets: [
                                                            {
                                                                data: [60, 30, 10],
                                                                backgroundColor: ['#d882c0', '#FFB3FF', '#FFB6C1'],
                                                                hoverBackgroundColor: ['#d882c0', '#FFB3FF', '#FFB6C1'],
                                                            },
                                                        ],
                                                    }}
                                                    options={{
                                                        responsive: true,
                                                        plugins: {
                                                            legend: {
                                                                display: true,
                                                                position: 'right', // 圖例位置
                                                                labels: {
                                                                    boxWidth: 25,
                                                                },
                                                            },
                                                            tooltip: {
                                                                enabled: true, // 顯示提示框
                                                            },

                                                        },
                                                        // 開啟數據標籤
                                                        datalabels: {
                                                            display: true,
                                                            color: 'black',  // 設定標籤顏色
                                                            font: {
                                                                weight: 'bold',  // 設定字體粗細
                                                            },
                                                            formatter: (value) => `${value}%`,  // 顯示百分比或其他格式
                                                        },
                                                        responsive: true,
                                                        maintainAspectRatio: true,
                                                    }}
                                                />
                                            </div>
                                        </CCardBody>
                                    </CCard>
                                </CCol>
                                {/* 半圓環形圖 */}
                                <CCol xs={6}>
                                    <CCard className="mb-4">
                                        <CCardHeader style={{ backgroundColor: '#9D6B6B', height: '50px', display: 'flex', alignItems: 'center', }}>
                                            <strong style={{ fontSize: '1.2rem', color: 'white', display: 'flex', alignItems: 'center', padding: '5px' }}>碳排總量/ </strong>
                                            <strong style={{ fontSize: '1.0rem', color: 'white', padding: '5px' }}>半圓環形圖</strong>

                                            <CButton style={{ position: 'absolute', right: '10px', color: 'white', display: 'flex', alignItems: 'center' }}>
                                                <b><CIcon icon={cilDataTransferDown} style={{ fontSize: '24px' }} /></b>
                                            </CButton>
                                        </CCardHeader>
                                        <CCardBody style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', }}>
                                            <div style={{ width: '350px', height: '350px', margin: '0 auto', position: 'relative', }}>
                                                <CChartDoughnut
                                                    data={{
                                                        datasets: [
                                                            {
                                                                backgroundColor: ['#d882c0', '#FFB3FF', '#FFB6C1'],
                                                                data: [60, 30, 10],
                                                            },
                                                        ],
                                                    }}
                                                    options={{
                                                        rotation: -90,
                                                        circumference: 180,
                                                        cutout: "70%", // 中間空心的部分
                                                        plugins: {
                                                            legend: {
                                                                position: "bottom", // 圖例位置
                                                            },
                                                            tooltip: {
                                                                enabled: true, // 顯示提示框
                                                            },
                                                        },
                                                        responsive: true,
                                                        maintainAspectRatio: true,
                                                    }}
                                                    height={300} // 設置高度為 300px
                                                />
                                                {/* 中間的數字 */}
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        top: '65%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                        fontSize: '1.8rem',
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    96.54
                                                </div>
                                            </div>
                                            {/* 自定義圖例 */}
                                            <div style={{ marginTop: '10px', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '5px' }}>
                                                    <div
                                                        style={{
                                                            width: '20px',
                                                            height: '20px',
                                                            backgroundColor: '#d882c0',
                                                            marginRight: '10px',
                                                        }}
                                                    ></div>
                                                    <span>範疇一 - 55.3654 (60%)</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '5px' }}>
                                                    <div
                                                        style={{
                                                            width: '20px',
                                                            height: '20px',
                                                            backgroundColor: '#FFB3FF',
                                                            marginRight: '10px',
                                                        }}
                                                    ></div>
                                                    <span>範疇二 - 38.2547 (30%)</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <div
                                                        style={{
                                                            width: '20px',
                                                            height: '20px',
                                                            backgroundColor: '#FFB6C1',
                                                            marginRight: '10px',
                                                        }}
                                                    ></div>
                                                    <span>範疇三 - 12.6354 (10%)</span>
                                                </div>
                                            </div>
                                        </CCardBody>
                                    </CCard>
                                </CCol>
                                {/* 柱狀圖 */}
                                <CCol xs={6}>
                                    <CCard className="mb-4">
                                        <CCardHeader style={{ backgroundColor: '#9D6B6B', height: '50px', display: 'flex', alignItems: 'center', }}>
                                            <strong style={{ fontSize: '1.2rem', color: 'white', display: 'flex', alignItems: 'center', padding: '5px' }}>碳排總量 / </strong>
                                            <strong style={{ fontSize: '1.0rem', color: 'white', padding: '5px' }}>柱狀圖</strong>
                                            <CButton style={{ position: 'absolute', right: '10px', color: 'white', display: 'flex', alignItems: 'center' }}>
                                                <b><CIcon icon={cilDataTransferDown} style={{ fontSize: '24px' }} /></b>
                                            </CButton>
                                        </CCardHeader>
                                        <CCardBody style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                            <div style={{ width: '350px', height: '350px' }}>
                                                <CChartBar
                                                    data={{
                                                        labels: ['範疇一', '範疇二', '範疇三'],
                                                        datasets: [
                                                            {
                                                                backgroundColor: ['#d882c0', '#FFB3FF', '#FFB6C1'],
                                                                data: [55.3654, 38.2547, 12.6354],
                                                            },
                                                        ],
                                                    }}
                                                    options={{
                                                        plugins: {
                                                            legend: {
                                                                display: false,
                                                                position: 'bottom',
                                                            },
                                                            datalabels: {
                                                                display: true,
                                                                color: 'black',
                                                                anchor: 'end', // 標籤位置
                                                                align: 'start', // 標籤對齊方式
                                                                formatter: function (value) {
                                                                    return value.toFixed(2); // 格式化數值顯示，保留兩位小數
                                                                },
                                                            },
                                                        },
                                                        responsive: true,
                                                        maintainAspectRatio: false, // 不維持比例，可以自由調整大小
                                                        scales: {
                                                            y: {
                                                                beginAtZero: true,
                                                                ticks: {
                                                                    precision: 0, // Y 軸上顯示的數字無小數點
                                                                },
                                                            },
                                                        },
                                                    }}
                                                    height={300} // 設置高度為 300px
                                                /></div>
                                        </CCardBody>
                                    </CCard>
                                </CCol>
                                {/* 環形圖 */}
                                <CCol xs={6}>
                                    <CCard className="mb-4">
                                        <CCardHeader style={{ backgroundColor: '#9D6B6B', height: '50px', display: 'flex', alignItems: 'center', }}>
                                            <strong style={{ fontSize: '1.2rem', color: 'white', display: 'flex', alignItems: 'center', padding: '5px' }}>碳排範疇比例 / </strong>
                                            <strong style={{ fontSize: '1.0rem', color: 'white', padding: '5px' }}>環形圖</strong>
                                            <CButton style={{ position: 'absolute', right: '10px', color: 'white', display: 'flex', alignItems: 'center' }}>
                                                <b><CIcon icon={cilDataTransferDown} style={{ fontSize: '24px' }} /></b>
                                            </CButton>
                                        </CCardHeader>
                                        <CCardBody style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', }}>
                                            <div style={{ width: '350px', height: '350px' }}>
                                                <CChartDoughnut
                                                    data={{
                                                        labels: ['範疇一', '範疇二', '範疇三'],
                                                        datasets: [
                                                            {
                                                                backgroundColor: ['#d882c0', '#FFB3FF', '#FFB6C1'],
                                                                data: [60, 30, 10],
                                                            },
                                                        ],
                                                    }}
                                                    options={{
                                                        responsive: true,
                                                        cutout: '70%', // 調整內圈大小（百分比），越大內圈越大
                                                        plugins: {
                                                            legend: {
                                                                position: 'right', // 圖例位置

                                                            },
                                                            tooltip: {
                                                                enabled: true, // 顯示提示框
                                                            },
                                                            datalabels: {
                                                                formatter: (value, context) => {
                                                                    // 計算百分比
                                                                    const total = context.chart.data.datasets[0].data.reduce((acc, val) => acc + val, 0);
                                                                    const percentage = ((value / total) * 100).toFixed(1) + '%';
                                                                    return percentage;
                                                                },
                                                                color: '#fff', // 字體顏色
                                                                font: {
                                                                    size: 16, // 字體大小
                                                                },
                                                                anchor: 'center', // 字體位置
                                                                align: 'center',
                                                            },
                                                        },

                                                    }}
                                                />
                                            </div>
                                        </CCardBody>
                                    </CCard>
                                </CCol>
                            </CRow>
                        </>
                    )}
                </div>
            </CCol>
        </CRow>
    )
}


export default Tabs
