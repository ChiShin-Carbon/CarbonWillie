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
    cilNewspaper,
    cilSearch,
    cilArrowCircleRight
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
    const rankingstyle={ border: '1px solid white', textAlign: 'center', verticalAlign: 'middle'};
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
                            {/* 碳費分析 */}
                            <CCard style={{ width: '100%' }}>
                                <CCardBody>
                                    <CRow>
                                        <CCardTitle>
                                            <CRow>
                                                <div style={{ width: '100%', height: '50px', display: 'grid', alignItems: 'center', }}>
                                                    <strong style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', padding: '5px' }}>分析總覽</strong>
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
                                            <td style={{ border: '1px solid white', width:'30px', textAlign: 'center', verticalAlign: 'middle'}}><b>1</b></td>
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
                                        <tr>
                                            <td style={rankingstyle}><b>6</b></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                        </tr>
                                        <tr>
                                            <td style={rankingstyle}><b>7</b></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                        </tr>
                                        <tr>
                                            <td style={rankingstyle}><b>8</b></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                        </tr>
                                        <tr>
                                            <td style={rankingstyle}><b>9</b></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                        </tr>
                                        <tr>
                                            <td style={rankingstyle}><b>10</b></td>
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
                            <CRow>
                                {/* 柱狀圖 */}
                                <CCol xs={12}>
                                    <CCard className="mb-4">
                                        <CCardHeader style={{ backgroundColor: '#9D6B6B', height: '50px', display: 'flex', alignItems: 'center', }}>
                                            <strong style={{ fontSize: '1.2rem', color: 'white', display: 'flex', alignItems: 'center', padding: '5px' }}>碳排總量 / </strong>
                                            <strong style={{ fontSize: '1.0rem', color: 'white', padding: '5px' }}>柱狀圖</strong>
                                            <CButton style={{ position: 'absolute', right: '10px', color: 'white', display: 'flex', alignItems: 'center' }}>
                                                <b><CIcon icon={cilDataTransferDown} style={{ fontSize: '24px' }} /></b>
                                            </CButton>
                                        </CCardHeader>
                                        <CCardBody style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                            <div style={{ width: '1000px', height: '350px' }}>
                                                <CChartBar
                                                    data={{
                                                        labels: ['電力使用', '範疇二', '範疇三','範疇一', '範疇二', '範疇三','範疇一', '範疇二', '範疇三','範疇一'],
                                                        datasets: [
                                                            {
                                                                backgroundColor: ['#d882c0', '#FFB3FF', '#FFB6C1','#d882c0', '#FFB3FF', '#FFB6C1','#d882c0', '#FFB3FF', '#FFB6C1','#d882c0'],
                                                                data: [55.3654, 38.2547, 12.6354,55.3654, 38.2547, 12.6354,55.3654, 38.2547, 12.6354,55.3654],
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
                            </CRow>
                        </>
                    )}
                    {/* 碳費新聞 */}
                    {activeTab === 'tab3' && (
                        <>
                            {/* 第一版 */}
                            <div className={styles.titleContainer}>
                            <CInputGroup className="mb-3">
                                <CFormInput type="text" placeholder="搜尋..." className="search-input" />
                                {/* <CButton type="submit" className="search-button" style={{width: '40px', backgroundColor: 'white', color: 'black', alignItems: 'center' }}>
                                    <b><CIcon icon={cilSearch} className="me-2" /></b>
                                </CButton> */}
                                <CInputGroupText style={{backgroundColor:'white' }}>
                                    <i className="pi pi-search" />
                                </CInputGroupText>
                                <CDropdown alignment="end" variant="input-group">
                                <CDropdownToggle color="secondary" variant="outline">
                                    Dropdown
                                </CDropdownToggle>
                                <CDropdownMenu>
                                    <CDropdownItem href="#">Action</CDropdownItem>
                                    <CDropdownItem href="#">Another action</CDropdownItem>
                                    <CDropdownItem href="#">Something else here</CDropdownItem>
                                    <CDropdownDivider />
                                    <CDropdownItem href="#">Separated link</CDropdownItem>
                                </CDropdownMenu>
                                </CDropdown>
                            </CInputGroup></div>
                            {/* 第二版 */}
                            <div className={styles.titleContainer}>
                                <div className={styles.leftItem} style={{width:'1000px'}}>
                                <CInputGroup className="mb-3">
                                    <CFormInput type="text" placeholder="搜尋..." className="search-input" />
                                    <CInputGroupText style={{backgroundColor:'white' }}>
                                        <i className="pi pi-search" />
                                    </CInputGroupText>
                                </CInputGroup>
                                </div>
                                <div className={styles.rightItem}>
                                    <CFormSelect size="sm" className={styles.input} >
                                        <option>新至舊</option>
                                        <option value="1">表1</option>
                                        <option value="2">表2</option>
                                        <option value="3">表3</option>
                                    </CFormSelect>
                                </div>
                            </div>
                            {/* 類別一及類別二排放形式排放量統計表 */}
                            <CCard style={{ width: '100%' }}>
                                <CCardBody>
                                    <CRow>
                                    <CCol sm={12}>
                                        <CCardTitle>
                                            <CRow>
                                                <div style={{ width: '100%', height: '50px', display: 'grid', alignItems: 'center', }}>
                                                    <strong style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', padding: '5px' }}>碳費新聞</strong>
                                                </div>
                                            </CRow>
                                        </CCardTitle>
                                        <CCardBody style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                        <CRow>
                                            <CCol sm={12}>
                                            <CCard style={{width: '1100px'}}>
                                                <CCardBody>
                                                    <CRow>
                                                    <div style={{ width: '100%', height: '40px', display: 'grid', alignItems: 'center', }}>
                                                    <strong style={{ fontSize: '1.0rem', display: 'flex', alignItems: 'center', padding: '5px' }}>
                                                        <p className="item-date" style={{color:'green'}}>2024-2-26</p>
                                                        <p className="item-title">碳新聞new!</p>
                                                    </strong>
                                                    <CButton style={{ position: 'absolute', right: '15px', color: 'grey', display: 'flex', alignItems: 'center' }}>
                                                        <b><CIcon icon={cilArrowCircleRight} className="me-2"  size="xl" /></b>
                                                    </CButton>
                                                    </div></CRow>
                                                </CCardBody>
                                            </CCard>
                                            </CCol>
                                        </CRow>
                                        </CCardBody>
                                        </CCol>
                                    </CRow>
                                    <br />
                                </CCardBody>
                            </CCard>
                            <br></br>
                            <CRow>
                                {/* 柱狀圖 */}
                                <CCol xs={12}>
                                    <CCard className="mb-4">
                                        <CCardHeader style={{ backgroundColor: '#9D6B6B', height: '50px', display: 'flex', alignItems: 'center', }}>
                                            <strong style={{ fontSize: '1.2rem', color: 'white', display: 'flex', alignItems: 'center', padding: '5px' }}>碳排總量 / </strong>
                                            <strong style={{ fontSize: '1.0rem', color: 'white', padding: '5px' }}>柱狀圖</strong>
                                            <CButton style={{ position: 'absolute', right: '10px', color: 'white', display: 'flex', alignItems: 'center' }}>
                                                <b><CIcon icon={cilDataTransferDown} style={{ fontSize: '24px' }} /></b>
                                            </CButton>
                                        </CCardHeader>
                                        <CCardBody style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                            
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
