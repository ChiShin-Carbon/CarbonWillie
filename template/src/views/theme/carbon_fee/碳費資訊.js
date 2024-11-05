import React, { useState, useEffect } from 'react'
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
    CDropdown,
    CDropdownDivider,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CInputGroup,
    CInputGroupText,
    CListGroup,
    CListGroupItem
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
    cilSearch,
    cilArrowCircleRight
} from '@coreui/icons'
// import { freeSet } from '@coreui/icons'
// import { getIconsView } from '../brands/Brands.js'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableList, faChartPie ,faNewspaper, faCircleInfo} from '@fortawesome/free-solid-svg-icons';


import styles from '../../../scss/盤查結果查詢.module.css';


const Tabs = () => {
    const random = () => Math.round(Math.random() * 100)
    const [activeTab, setActiveTab] = useState('tab1'); // 記錄當前活動的分頁
    const cellStyle = { border: '1px solid white', textAlign: 'center', verticalAlign: 'middle', height: '40px' };
    const rankingstyle = { border: '1px solid white', textAlign: 'center', verticalAlign: 'middle' };
    const [news, setNews] = useState([]); // 定義狀態變數
    const [query, setQuery] = useState('台灣碳費'); // 預設搜尋關鍵字
    
    //試著加入new
    useEffect(() => {
        async function fetchNews() {
            try {
                const response = await fetch(`http://127.0.0.1:5000/news?q=${query}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }

                const data = await response.json();
                setNews(data.articles); // 將 API 回傳的新聞資料儲存在狀態中
            } catch (error) {
                console.error('Fetch error: ', error);
            }
        }
        fetchNews();
    }, [query]); // useEffect 依賴空陣列，確保只在組件初次加載時呼叫 API
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
                                <FontAwesomeIcon icon={faNewspaper} />
                                &nbsp;碳費新聞
                            </div>
                        </CNavLink>
                    </CNavItem>
                </CNav>

                <div className={styles.body}>
                    {/* /*碳費計算 */}
                    {activeTab === 'tab1' && (
                        <>
                            <div className={styles.titleContainer}>
                                <div className={styles.leftItem}>
                                    <div><strong>xx2024碳費計算</strong></div>
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
                            {/* 總覽 */}
                            <CCard style={{ width: '100%' }}>
                                <CCardTitle>
                                    <div style={{ display: 'flex', flexDireaction: 'row'}}>
                                        <div style={{ fontWeight:'bold', fontSize: '1.5rem',color:'white', backgroundColor:'#9D6B6B', borderTopLeftRadius:'5px', borderBottomRightRadius:'20px', display: 'flex', alignItems: 'center',padding: '10px 40px 10px 40px'}}>
                                            總覽
                                        </div>
                                        <CButton style={{ position: 'absolute', right: '30px', width: '40px', backgroundColor: '#9D6B6B', color: 'white', display: 'flex', alignItems: 'center', marginTop:'10px'}}>
                                            <b><CIcon icon={cilDataTransferDown} className="me-2" /></b>
                                        </CButton>
                                    </div>
                                    {/* <div style={{ width: '100%', height: '50px', display: 'grid', alignItems: 'center', }}>
                                        <strong style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', padding: '5px' }}>總覽</strong>
                                        <CButton style={{ position: 'absolute', right: '30px', width: '40px', backgroundColor: '#9D6B6B', color: 'white', display: 'flex', alignItems: 'center' }}>
                                            <b><CIcon icon={cilDataTransferDown} className="me-2" /></b>
                                        </CButton>
                                    </div> */}
                                </CCardTitle>
                                <CCardBody>
                                    <table style={{ fontSize: '1.2rem' }}>
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
                                            <td style={{ border: '1px solid white'}}><b>總排放量</b></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                        </tr>
                                        <tr>
                                            <td style={{ border: '1px solid white'}}><b><div><CRow><div style={{width:'140px'}}>直接排放</div><div style={{width:'100px'}}>/範疇一</div></CRow></div></b></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                        </tr>
                                        <tr>
                                            <td style={{ border: '1px solid white'}}><b><div><CRow><div style={{width:'140px'}}>間接排放</div><div style={{width:'100px'}}>/範疇二</div></CRow></div></b></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                        </tr>
                                        <tr>
                                            <td style={{ border: '1px solid white'}}><b><div><CRow><div style={{width:'140px'}}>其他間接排放</div><div style={{width:'100px'}}>/範疇三</div></CRow></div></b></td>
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
                                <CCardTitle>
                                    <div style={{ display: 'flex', flexDireaction: 'row'}}>
                                        <div style={{ fontWeight:'bold', fontSize: '1.5rem',color:'white', backgroundColor:'#9D6B6B', borderTopLeftRadius:'5px', borderBottomRightRadius:'20px', display: 'flex', alignItems: 'center',padding: '10px 30px 10px 30px'}}>
                                            技術標竿指定削減率
                                        </div>
                                        <CButton style={{ height: '18px', width: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop:'28px' }}>
                                            <FontAwesomeIcon icon={faCircleInfo}  style={{ width:'20px', height:'20px'}}/>
                                        </CButton>
                                        <CButton style={{ position: 'absolute', right: '30px', width: '40px', backgroundColor: '#9D6B6B', color: 'white', display: 'flex', alignItems: 'center', marginTop:'10px'}}>
                                            <b><CIcon icon={cilDataTransferDown} className="me-2" /></b>
                                        </CButton>
                                    </div>
                                </CCardTitle>
                                <CCardBody>
                                    <table style={{  fontSize: '1.2rem' }}>
                                        <thead style={{ border: '1px solid white', backgroundColor: '#339933', color: 'white' }}>
                                            <tr>
                                                <th scope="col" style={cellStyle} colSpan={2}></th>
                                                <th scope="col" style={cellStyle}>基準年排放當量<br></br>(公噸CO2e/年)</th>
                                                <th scope="col" style={cellStyle}>排放當量<br></br>(公噸CO2e/年)</th>
                                                <th scope="col" style={cellStyle}>削減率<br></br>(%)</th>
                                                <th scope="col" style={cellStyle}>目標年削減率<br></br>(%)</th>
                                            </tr>
                                        </thead>
                                        <tbody style={{ border: '1px solid white', backgroundColor: '#ccffcc' }}>
                                        <tr>
                                            <td style={{ border: '1px solid white', width:'170px', textAlign: 'center', verticalAlign: 'middle'}} colSpan={2}><b>使用電力間接排放</b></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}><b>6%</b></td>
                                        </tr>
                                        {/* <tr>
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
                                        </tr> */}
                                        </tbody>
                                    </table>
                                    <br />
                                </CCardBody>
                            </CCard>
                            <br></br>
                            {/* 行業別指定削減率 */}
                            <CCard style={{ width: '100%' }}>
                                <CCardTitle>
                                    <div style={{ display: 'flex', flexDireaction: 'row'}}>
                                        <div style={{ fontWeight:'bold', fontSize: '1.5rem',color:'white', backgroundColor:'#9D6B6B', borderTopLeftRadius:'5px', borderBottomRightRadius:'20px', display: 'flex', alignItems: 'center',padding: '10px 30px 10px 30px'}}>
                                            行業別指定削減率
                                        </div>
                                        <CButton style={{ height: '18px', width: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop:'28px' }}>
                                            <FontAwesomeIcon icon={faCircleInfo}  style={{ width:'20px', height:'20px'}}/>
                                        </CButton>
                                        <CButton style={{ position: 'absolute', right: '30px', width: '40px', backgroundColor: '#9D6B6B', color: 'white', display: 'flex', alignItems: 'center', marginTop:'10px'}}>
                                            <b><CIcon icon={cilDataTransferDown} className="me-2" /></b>
                                        </CButton>
                                    </div>
                                </CCardTitle>
                                <CCardBody>
                                    <table style={{ fontSize: '1.2rem' }}>
                                        <thead style={{ border: '1px solid white', backgroundColor: '#339933', color: 'white' }}>
                                            <tr>
                                                <th scope="col" style={cellStyle} colSpan={2}></th>
                                                <th scope="col" style={cellStyle}>基準年排放當量<br></br>(公噸CO2e/年)</th>
                                                <th scope="col" style={cellStyle}>排放當量<br></br>(公噸CO2e/年)</th>
                                                <th scope="col" style={cellStyle}>削減率<br></br>(%)</th>
                                                <th scope="col" style={cellStyle}>目標年削減率<br></br>(%)</th>
                                            </tr>
                                        </thead>
                                        <tbody style={{ border: '1px solid white', backgroundColor: '#ccffcc' }}>
                                        <tr>
                                            <td style={{ border: '1px solid white', width:'120px', textAlign: 'center', verticalAlign: 'middle'}} colSpan={2}><b>其他行業別</b></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}><b>42%</b></td>
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

                    {/* /*碳費分析&圖表呈現頁 */}
                    {activeTab === 'tab2' && (
                        <>
                            <div className={styles.titleContainer}>
                                <div className={styles.leftItem}>
                                    <div><strong>xx2024碳費分析</strong></div>
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
                               <CCol xs={12}>
                                    <CCard className="mb-4">
                                        <CCardHeader style={{ backgroundColor: '#9D6B6B', height: '50px', display: 'flex', alignItems: 'center', }}>
                                            <strong style={{ fontSize: '1.5rem', color: 'white', display: 'flex', alignItems: 'center', padding: '5px'}}>統計圖表 / </strong>
                                            <strong style={{ fontSize: '1.3rem', color: 'white', padding: '5px' }}>圓餅圖</strong>
                                            <CButton style={{ position: 'absolute', right: '10px', color: 'white', display: 'flex', alignItems: 'center' }}>
                                                <b><CIcon icon={cilDataTransferDown} style={{ fontSize: '24px' }} /></b>
                                            </CButton>
                                        </CCardHeader>
                                        <CCardBody style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', }}>
                                            <div style={{ width: '350px', height: '350px' }}>
                                                <CChartPie
                                                    data={{
                                                        labels: ['電力使用', '冷媒', '公務車'],
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
                            </CRow>
                            {/* 碳費分析 */}
                            <CCard style={{ width: '100%' }}>
                                <CCardTitle>
                                    <div style={{ display: 'flex', flexDireaction: 'row'}}>
                                        <div style={{ fontWeight:'bold', fontSize: '1.5rem',color:'white', backgroundColor:'#9D6B6B', borderTopLeftRadius:'5px', borderBottomRightRadius:'20px', display: 'flex', alignItems: 'center',padding: '10px 30px 10px 30px'}}>
                                            分析總覽
                                        </div>
                                        <CButton style={{ height: '18px', width: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop:'28px' }}>
                                            <FontAwesomeIcon icon={faCircleInfo}  style={{ width:'20px', height:'20px'}}/>
                                        </CButton>
                                        <CButton style={{ position: 'absolute', right: '30px', width: '40px', backgroundColor: '#9D6B6B', color: 'white', display: 'flex', alignItems: 'center', marginTop:'10px'}}>
                                            <b><CIcon icon={cilDataTransferDown} className="me-2" /></b>
                                        </CButton>
                                    </div>
                                </CCardTitle>
                                <CCardBody>
                                    <table style={{ fontSize:'1.2rem' }}>
                                        <thead style={{ border: '1px solid white', backgroundColor: '#339933', color: 'white' }}>
                                            <tr>
                                                <th scope="col" style={cellStyle} rowSpan={2}></th>
                                                <th scope="col" style={cellStyle} rowSpan={2}>範疇</th>
                                                <th scope="col" style={cellStyle} rowSpan={2}>類型</th>
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
                                            <td style={{ border: '1px solid white', textAlign: 'center', verticalAlign: 'middle'}}><b>1</b></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                        </tr>
                                        <tr>
                                            <td style={rankingstyle}><b>2</b></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                        </tr>
                                        <tr>
                                            <td style={rankingstyle}><b>3</b></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                        </tr>
                                        <tr>
                                            <td style={rankingstyle}><b>4</b></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                        </tr>
                                        <tr>
                                            <td style={rankingstyle}><b>5</b></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
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
                        </>
                    )}
                    {/* 碳費新聞 */}
                    {activeTab === 'tab3' && (
                        <>
                            {/* 搜尋&篩選器 */}
                            <div style={{width:'100%'}}>
                            <CInputGroup className="mb-3">
                                <CFormInput type="text" placeholder="搜尋..." className="search-input" onChange={(e) => setQuery(e.target.value)}/>
                                {/* <CButton type="submit" className="search-button" style={{width: '40px', backgroundColor: 'white', color: 'black', alignItems: 'center' }}>
                                    <b><CIcon icon={cilSearch} className="me-2" /></b>
                                </CButton> */}
                                <CInputGroupText style={{backgroundColor:'white' }}>
                                    <i className="pi pi-search" />
                                </CInputGroupText>
                                <CDropdown  style={{backgroundColor:'white' }}>
                                <CDropdownToggle color="secondary" variant="outline">
                                    篩選
                                </CDropdownToggle>
                                <CDropdownMenu>
                                    <CDropdownItem onClick={() => setQuery('台灣碳費')}>台灣</CDropdownItem>
                                    <CDropdownItem onClick={() => setQuery('international carbon fees')}>國際</CDropdownItem>
                                    <CDropdownItem onClick={() => setQuery('carbon')}>Something else here</CDropdownItem>
                                </CDropdownMenu>
                                </CDropdown>
                            </CInputGroup>
                            <CInputGroup className="mb-3">
                            </CInputGroup>
                            </div>
                            {/* 碳費新聞 */}
                            <CCard style={{ width: '100%' }}>
                                <CCardTitle>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <div style={{
                                            fontWeight: 'bold',
                                            fontSize: '1.5rem',
                                            color: 'white',
                                            backgroundColor: '#00a000',
                                            borderTopLeftRadius: '5px',
                                            borderBottomRightRadius: '20px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '10px 40px'
                                        }}>碳費新聞</div>
                                    </div>
                                </CCardTitle>
                                <CCardBody>
                                    <CCardBody style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <CCard style={{ width: '1100px', fontSize: '1.2rem' }}>
                                            <CCardBody>
                                                {news.length > 0 ? (
                                                    news
                                                    //.filter(article => article.title.includes('碳'))
                                                    .filter(article => {
                                                        // 檢查是否是 Yahoo 網址且包含指定的結尾
                                                        const isYahooWithValidExtension = !(article.url.includes("yahoo") && !/\.(png|html)$/.test(article.url));
                                                        
                                                        // 檢查標題是否包含 '碳'
                                                        const hasKeywordInTitle = article.title.includes('碳');
                                                        
                                                        // 只有在符合兩個條件時才返回 true
                                                        return isYahooWithValidExtension && hasKeywordInTitle;
                                                    })
                                                    
                                                    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)) // 根據日期從新到舊排序
                                                    .slice(0, 20) // 限制最多顯示 10 篇新聞
                                                    .map((article, index) => (
                                                        
                                                        <div key={index} style={{ marginBottom: '20px', borderBottom: '1px solid lightgray', paddingBottom: '20px' }}> 
                                                            <CRow>
                                                                <div style={{ width: '100%', height: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                    {/* Left green bar */}
                                                                    <div style={{ width: '10px', height: '100%', backgroundColor: '#00a000', borderRadius: '4px' }}></div>
                                                                    
                                                                    {/* Left section: Date and Title */}
                                                                    <div style={{ display: 'flex', flex: 1, marginLeft: '20px', flexDirection: 'column' }}>
                                                                        {/* Date */}
                                                                        <p style={{ color: 'green', fontWeight: 'bold', margin: 0 }}>{new Date(article.publishedAt).toLocaleDateString()}</p>
                                                                        {/* Title */}
                                                                        <p style={{ fontWeight: 'bold', margin: 0 }}>{article.title}</p>
                                                                    </div>

                                                                    {/* Right section: Arrow button */}
                                                                    <CButton style={{ height: '60px', width: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => window.open(article.url, '_blank')}>
                                                                        <CIcon icon={cilArrowCircleRight} style={{ width: '55px', height: '55px' }} />
                                                                    </CButton>
                                                                </div>
                                                            </CRow>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p>正在載入新聞...</p>
                                                )}
                                            </CCardBody>
                                        </CCard>
                                    </CCardBody>
                                    <br />
                                </CCardBody>
                            </CCard>
                            <br></br>
                            {/* 碳費百科 */}
                            <CCard style={{ width: '100%' }}>
                                <CCardTitle>
                                    <div style={{ display: 'flex', flexDireaction: 'row'}}>
                                        <div style={{ fontWeight:'bold', fontSize: '1.5rem',color:'white', backgroundColor:'#d882c0', borderTopLeftRadius:'5px', borderBottomRightRadius:'20px', display: 'flex', alignItems: 'center',padding: '10px 40px 10px 40px'}}>碳費百科</div>
                                    </div>
                                </CCardTitle>
                                <CCardBody>
                                    <CCardBody style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                    <CRow>
                                        <CCol sm={12}>
                                        <CCard style={{width: '1100px', fontSize: '1.2rem'}}>
                                            <CCardBody>
                                                <CRow>
                                                    <div style={{ width: '100%', height: '50px', display: 'flex', justifyContent: 'space-between',alignItems:'center' }}>
                                                    <div style={{width: '10px', height: '100%', backgroundColor: '#d882c0', borderRadius: '4px',}}></div> {/* 左側粉色 bar */}
                                                    {/* 左側：日期與標題 */}
                                                    <div style={{ display: 'flex',flex: 1, marginLeft: '20px', flexDirection: 'column' }}>
                                                        {/* 日期 */}
                                                        <p style={{ color: '#d882c0', fontWeight: 'bold', margin: 0 }}>2022/12/01</p>
                                                        {/* 標題 */}
                                                        <p style={{ fontWeight: 'bold', margin: 0 }}>2024各國碳費標準</p>
                                                    </div>
                                                    {/* 右側：箭頭按鈕 */}
                                                    <CButton style={{ height: '60px', width: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                        <CIcon icon={cilArrowCircleRight}   style={{ width: '55px', height: '55px' }} />
                                                    </CButton>
                                                    </div>
                                                </CRow>
                                            </CCardBody>
                                        </CCard>
                                        </CCol>
                                    </CRow>
                                    </CCardBody>
                                </CCardBody>
                            </CCard>
                            <br></br>
                        </>
                    )}
                </div>
            </CCol>
        </CRow>
    )
}


export default Tabs
