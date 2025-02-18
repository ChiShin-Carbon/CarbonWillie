import React, { useState } from 'react'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CFormSelect,
  CNav,
  CNavItem,
  CNavLink,
  CForm,
  CFormLabel,
  CFormInput,
  CCardSubtitle,
  CCardText,
  CCardTitle,
  CButton,
  CTable,
  CTableBody,
  CTableCaption,
  CTableHead,
  CTableHeaderCell,
  CTableDataCell,
  CTableRow,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import {
  CChartBar,
  CChartDoughnut,
  CChartLine,
  CChartPie,
  CChartPolarArea,
  CChartRadar,
} from '@coreui/react-chartjs'
import { Chart } from 'chart.js'
import { DocsCallout } from 'src/components'
import { DocsExample } from 'src/components'
import CIcon from '@coreui/icons-react'
import { cilDataTransferDown, cilDataTransferUp, cilMenu, cilChartPie,cilLoopCircular } from '@coreui/icons'
// import { freeSet } from '@coreui/icons'
// import { getIconsView } from '../brands/Brands.js'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTableList, faChartPie, faCircleInfo, } from '@fortawesome/free-solid-svg-icons'

import styles from '../../../scss/盤查結果查詢.module.css'

const Tabs = () => {
  const random = () => Math.round(Math.random() * 100)
  const [activeTab, setActiveTab] = useState('tab1') // 記錄當前活動的分頁
  const cellStyle = {
    border: '1px solid white',
    textAlign: 'center',
    verticalAlign: 'middle',
    height: '40px',
  } // table_th設定

  const [visible1, setVisible1] = useState(false) // 電力排放係數計算公式model

  return (
    <CRow>
      <div className={styles.systemTablist}>
        <div className={styles.tabsLeft}>
          <div style={{ width: '250px', display: 'flex', justifyContent: 'left' }}>
            <strong
              style={{ fontSize: '1.0rem', display: 'flex', alignItems: 'center', padding: '5px' }}
            >
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
            <strong
              style={{ fontSize: '1.0rem', display: 'flex', alignItems: 'center', padding: '5px' }}
            >
              選擇標準
            </strong>
            <CCol style={{ justifyContent: 'left', alignItems: 'center', padding: '0' }}>
              <CFormSelect style={{ width: '180px' }}>
                <option>IPCC 2006</option>
                <option value="1">IPCC 2015</option>
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
          <CNavItem>
            <CNavLink
              active={activeTab === 'tab1'}
              onClick={() => setActiveTab('tab1')}
              className={activeTab === 'tab1' ? styles.tabChoose : styles.tabNoChoose}
            >
              <div>
                <FontAwesomeIcon icon={faTableList} />
                &nbsp;排放係數_GWP值
              </div>
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              active={activeTab === 'tab2'}
              onClick={() => setActiveTab('tab2')}
              className={activeTab === 'tab2' ? styles.tabChoose : styles.tabNoChoose}
            >
              {/* <div>
                <FontAwesomeIcon icon={faChartPie} />
                &nbsp;圖形呈現
              </div> */}
            </CNavLink>
          </CNavItem>
        </CNav>

        <div className={styles.body}>
          {/* /*表格呈現頁 */}
          {activeTab === 'tab1' && (
            <>
              <div className={styles.titleContainer}>
                <div className={styles.leftItem}>
                  <div>
                    <strong>AR4溫室氣體排放係數管理表6.0.4</strong>
                  </div>
                </div>
                <div className={styles.rightItem}>
                  <button style={{ backgroundColor:'grey' }}>
                    <CIcon icon={cilLoopCircular} className="me-2" />
                    2025/01/17
                  </button>
                </div>
              </div>
              {/* 固定燃燒排放源 */}
              <CCard style={{ width: '100%' }}>
                <CCardTitle>
                  <div style={{ display: 'flex', flexDireaction: 'row' }}>
                    <div
                      style={{
                        fontWeight: 'bold',
                        fontSize: '1.4rem',
                        color: 'white',
                        backgroundColor: '#9D6B6B',
                        borderTopLeftRadius: '5px',
                        borderBottomRightRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 30px 10px 30px',
                      }}
                    >
                      固定燃燒排放源
                    </div>
                  </div>
                </CCardTitle>
                <CCardBody>
                <table style={{ width: '100%', fontSize: '1.2rem' }}>
                    <thead
                      style={{
                        border: '1px solid white',
                        backgroundColor: 'orange',
                        color: 'white',
                      }}
                    >
                      <tr>
                        <th scope="col" style={cellStyle} rowSpan={2} style={{width:'150px'}}></th>
                        <th scope="col" style={cellStyle} rowSpan={1} colSpan={3}>
                          燃料單位熱值之排放係數(kg/TJ)
                        </th>
                        <th scope="col" style={cellStyle} rowSpan={1} colSpan={3}>
                          燃料單位熱值之排放係數(Kg/Kcal)
                        </th>
                        <th scope="col" style={cellStyle} rowSpan={1} colSpan={2}>
                          低位熱值
                        </th>
                        <th scope="col" style={cellStyle} rowSpan={1} colSpan={3}>
                          燃料單位重量/體積之排放係數(KgCO2/Kg)
                        </th>
                      </tr>
                      <tr>
                        <th scope="col" style={cellStyle}>
                          CO2
                        </th>
                        <th scope="col" style={cellStyle}>
                          CH4
                        </th>
                        <th scope="col" style={cellStyle}>
                          N2O
                        </th>
                        <th scope="col" style={cellStyle}>
                          CO2
                        </th>
                        <th scope="col" style={cellStyle}>
                          CH4
                        </th>
                        <th scope="col" style={cellStyle}>
                          N2O
                        </th>
                        <th scope="col" style={cellStyle}>
                          單位
                        </th>
                        <th scope="col" style={cellStyle}>
                          數值
                        </th>
                        <th scope="col" style={cellStyle}>
                          CO2
                        </th>
                        <th scope="col" style={cellStyle}>
                          CH4
                        </th>
                        <th scope="col" style={cellStyle}>
                          N2O
                        </th>
                      </tr>
                    </thead>
                    <tbody style={{ border: '1px solid white', backgroundColor: '#FFE4CA' }}>
                      <tr>
                        <td style={cellStyle}><b>車用汽油</b></td>
                        <td style={cellStyle}>69,300</td>
                        <td style={cellStyle}>3</td>
                        <td style={cellStyle}>0.6</td>
                        <td style={cellStyle}>2.90E-04</td>
                        <td style={cellStyle}>1.26E-08</td>
                        <td style={cellStyle}>2.51E-09</td>
                        <td style={cellStyle}>Kcal/l</td>
                        <td style={cellStyle}>7800</td>
                        <td style={cellStyle}>2.26E+00</td>
                        <td style={cellStyle}>9.80E-05</td>
                        <td style={cellStyle}>1.96E-05</td>
                      </tr>
                      <tr>
                        <td style={cellStyle}><b>柴油</b></td>
                        <td style={cellStyle}>74100</td>
                        <td style={cellStyle}>3</td>
                        <td style={cellStyle}>0.6</td>
                        <td style={cellStyle}>3.10E-04</td>
                        <td style={cellStyle}>1.26E-08</td>
                        <td style={cellStyle}>2.51E-09</td>
                        <td style={cellStyle}>Kcal/l</td>
                        <td style={cellStyle}>8400</td>
                        <td style={cellStyle}>2.61E+00</td>
                        <td style={cellStyle}>1.06E-04</td>
                        <td style={cellStyle}>2.11E-05</td>
                      </tr>
                      <tr>
                        <td style={cellStyle}><b>乙烷</b></td>
                        <td style={cellStyle}>61,600</td>
                        <td style={cellStyle}>1</td>
                        <td style={cellStyle}>0.1</td>
                        <td style={cellStyle}>2.58E-04</td>
                        <td style={cellStyle}>4.19E-09</td>
                        <td style={cellStyle}>4.19E-10</td>
                        <td style={cellStyle}>--</td>
                        <td style={cellStyle}>--</td>
                        <td style={cellStyle}>--</td>
                        <td style={cellStyle}>--</td>
                        <td style={cellStyle}>--</td>
                      </tr>
                      <tr>
                        <td style={cellStyle}><b>天然氣</b></td>
                        <td style={cellStyle}>56,100</td>
                        <td style={cellStyle}>1</td>
                        <td style={cellStyle}>0.1</td>
                        <td style={cellStyle}>7.62E-04</td>
                        <td style={cellStyle}>4.19E-09</td>
                        <td style={cellStyle}>4.19E-10</td>
                        <td style={cellStyle}>--</td>
                        <td style={cellStyle}>--</td>
                        <td style={cellStyle}>--</td>
                        <td style={cellStyle}>--</td>
                        <td style={cellStyle}>--</td>
                      </tr>
                      <tr>
                        <td style={cellStyle}><b>事業廢棄物</b></td>
                        <td style={cellStyle}>143,000</td>
                        <td style={cellStyle}>30</td>
                        <td style={cellStyle}>4</td>
                        <td style={cellStyle}>5.99E-04</td>
                        <td style={cellStyle}>1.26E-07</td>
                        <td style={cellStyle}>1.67E-08</td>
                        <td style={cellStyle}>--</td>
                        <td style={cellStyle}>--</td>
                        <td style={cellStyle}>--</td>
                        <td style={cellStyle}>--</td>
                        <td style={cellStyle}>--</td>
                      </tr>
                    </tbody>
                  </table>
                  <br />
                  </CCardBody>
                  </CCard>
                  <br></br>
                  {/* 移動燃燒排放源 */}
                  <CCard style={{ width: '100%' }}>
                  <CCardTitle>
                    <div style={{ display: 'flex', flexDireaction: 'row' }}>
                      <div
                        style={{
                          fontWeight: 'bold',
                          fontSize: '1.4rem',
                          color: 'white',
                          backgroundColor: '#9D6B6B',
                          borderTopLeftRadius: '5px',
                          borderBottomRightRadius: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '10px 30px 10px 30px',
                        }}
                      >
                        移動燃燒排放源
                      </div>
                    </div>
                  </CCardTitle>
                  <CCardBody>
                  <table style={{ width: '100%', fontSize: '1.2rem' }}>
                    <thead
                      style={{
                        border: '1px solid white',
                        backgroundColor: 'orange',
                        color: 'white',
                      }}
                    >
                      <tr>
                        <th scope="col" style={cellStyle} rowSpan={2}></th>
                        <th scope="col" style={cellStyle} rowSpan={1} colSpan={3}>
                          燃料單位熱值之排放係數(kg/TJ)
                        </th>
                        <th scope="col" style={cellStyle} rowSpan={1} colSpan={3}>
                          燃料單位熱值之排放係數(Kg/Kcal)
                        </th>
                        <th scope="col" style={cellStyle} rowSpan={1} colSpan={2}>
                          低位熱值
                        </th>
                        <th scope="col" style={cellStyle} rowSpan={1} colSpan={3}>
                          燃料單位重量/體積之排放係數(KgCO2/Kg)
                        </th>
                      </tr>
                      <tr>
                        <th scope="col" style={cellStyle}>
                          CO2
                        </th>
                        <th scope="col" style={cellStyle}>
                          CH4
                        </th>
                        <th scope="col" style={cellStyle}>
                          N2O
                        </th>
                        <th scope="col" style={cellStyle}>
                          CO2
                        </th>
                        <th scope="col" style={cellStyle}>
                          CH4
                        </th>
                        <th scope="col" style={cellStyle}>
                          N2O
                        </th>
                        <th scope="col" style={cellStyle}>
                          單位
                        </th>
                        <th scope="col" style={cellStyle}>
                          數值
                        </th>
                        <th scope="col" style={cellStyle}>
                          CO2
                        </th>
                        <th scope="col" style={cellStyle}>
                          CH4
                        </th>
                        <th scope="col" style={cellStyle}>
                          N2O
                        </th>
                      </tr>
                    </thead>
                    <tbody style={{ border: '1px solid white', backgroundColor: '#FFE4CA' }}>
                      <tr>
                        <td style={cellStyle}><b>車用汽油</b></td>
                        <td style={cellStyle}>69300</td>
                        <td style={cellStyle}>--</td>
                        <td style={cellStyle}>--</td>
                        <td style={cellStyle}>2.90E-04</td>
                        <td style={cellStyle}>--</td>
                        <td style={cellStyle}>--</td>
                        <td style={cellStyle}>Kcal/l</td>
                        <td style={cellStyle}>7800</td>
                        <td style={cellStyle}>2.26E+00</td>
                        <td style={cellStyle}>--</td>
                        <td style={cellStyle}>--</td>
                      </tr>
                      <tr>
                        <td style={cellStyle}><b>柴油</b></td>
                        <td style={cellStyle}>74100</td>
                        <td style={cellStyle}>3.9</td>
                        <td style={cellStyle}>3.9</td>
                        <td style={cellStyle}>3.10E-04</td>
                        <td style={cellStyle}>1.63E-08</td>
                        <td style={cellStyle}>1.63E-08</td>
                        <td style={cellStyle}>Kcal/l</td>
                        <td style={cellStyle}>8400</td>
                        <td style={cellStyle}>2.61E+00</td>
                        <td style={cellStyle}>1.37E-04</td>
                        <td style={cellStyle}>1.37E-04</td>
                      </tr>
                      <tr>
                        <td style={cellStyle}><b>車用汽油-未控制</b></td>
                        <td style={cellStyle}>--</td>
                        <td style={cellStyle}>33</td>
                        <td style={cellStyle}>3.2</td>
                        <td style={cellStyle}>--</td>
                        <td style={cellStyle}>1.38E-07</td>
                        <td style={cellStyle}>1.34E-08</td>
                        <td style={cellStyle}>Kcal/l</td>
                        <td style={cellStyle}>7400</td>
                        <td style={cellStyle}>--</td>
                        <td style={cellStyle}>1.02E-03</td>
                        <td style={cellStyle}>9.91E-05</td>
                      </tr>
                      <tr>
                        <td style={cellStyle}><b>車用汽油-氧化觸媒</b></td>
                        <td style={cellStyle}>--</td>
                        <td style={cellStyle}>25</td>
                        <td style={cellStyle}>8</td>
                        <td style={cellStyle}>--</td>
                        <td style={cellStyle}>1.05E-07</td>
                        <td style={cellStyle}>3.35E-08</td>
                        <td style={cellStyle}>Kcal/l</td>
                        <td style={cellStyle}>7400</td>
                        <td style={cellStyle}>--</td>
                        <td style={cellStyle}>7.75E-04</td>
                        <td style={cellStyle}>2.48E-04</td>
                      </tr>
                      <tr>
                        <td style={cellStyle}><b>車用汽油-1995年後之低里程輕型車輛</b></td>
                        <td style={cellStyle}>--</td>
                        <td style={cellStyle}>3.8</td>
                        <td style={cellStyle}>5.7</td>
                        <td style={cellStyle}>--</td>
                        <td style={cellStyle}>1.59E-08</td>
                        <td style={cellStyle}>2.39E-08</td>
                        <td style={cellStyle}>Kcal/l</td>
                        <td style={cellStyle}>7400</td>
                        <td style={cellStyle}>--</td>
                        <td style={cellStyle}>1.18E-04</td>
                        <td style={cellStyle}>1.77E-04</td>
                      </tr>
                      <tr>
                        <td style={cellStyle}><b>柴油</b></td>
                        <td style={cellStyle}>--</td>
                        <td style={cellStyle}>3.9</td>
                        <td style={cellStyle}>3.9</td>
                        <td style={cellStyle}>--</td>
                        <td style={cellStyle}>1.63E-08</td>
                        <td style={cellStyle}>1.63E-08</td>
                        <td style={cellStyle}>Kcal/l</td>
                        <td style={cellStyle}>8400</td>
                        <td style={cellStyle}>--</td>
                        <td style={cellStyle}>1.37E-04</td>
                        <td style={cellStyle}>1.37E-04</td>
                      </tr>
                    </tbody>
                  </table>
                  <br/>
                  </CCardBody>
                  </CCard>
                  <br></br>
                  {/* 電力排放係數 */}
                  <CCard style={{ width: '100%' }}>
                  <CCardTitle>
                  <div style={{ display: 'flex', flexDireaction: 'row' }}>
                    <div style={{ display: 'flex', flexDireaction: 'row' }}>
                      <div
                        style={{
                          fontWeight: 'bold',
                          fontSize: '1.4rem',
                          color: 'white',
                          backgroundColor: '#9D6B6B',
                          borderTopLeftRadius: '5px',
                          borderBottomRightRadius: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '10px 30px 10px 30px',
                        }}
                      >
                        電力排放係數
                      </div>
                    </div>
                    <CButton
                      style={{
                        height: '18px',
                        width: '18px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '28px',
                      }}
                      onClick={() => setVisible1(!visible1)}
                    >
                      <FontAwesomeIcon
                        icon={faCircleInfo}
                        style={{ width: '20px', height: '20px' }}
                      />
                    </CButton>
                    <CModal visible={visible1} onClose={() => setVisible1(false)}>
                      <CModalHeader>
                        <CModalTitle><b>電力排放係數</b></CModalTitle>
                      </CModalHeader>
                      <CModalBody><ul>
                                  <li><b>電力排放係數(CO2e/度) = [(發電業及自用發電設備設置者促售公用售電業電量之電力排碳量 - 線損承擔之電力排碳量) / 公用售電業總銷售電量]</b><br/>
                                  </li></ul>
                      </CModalBody>
                      <CModalFooter>
                        <CButton color="secondary" onClick={() => setVisible1(false)}>
                          關閉
                        </CButton>
                      </CModalFooter>
                    </CModal>
                    </div>
                  </CCardTitle>
                  <CCardBody>
                  <table style={{ width: '100%', fontSize: '1.2rem' }}>
                    <thead
                      style={{
                        border: '1px solid white',
                        backgroundColor: 'orange',
                        color: 'white',
                      }}
                    >
                      <tr>
                        <th scope="col" style={cellStyle} style={{width:'200px'}}></th>
                        <th scope="col" style={cellStyle} style={{width:'400px', textAlign: 'center',}}>
                          發電業及自用發電設備設置者促售<br/>公用售電業電量之電力排碳量
                        </th>
                        <th scope="col" style={cellStyle}  style={cellStyle} style={{width:'300px', textAlign: 'center',}}>
                          線損承擔之電力排碳量
                        </th>
                        <th scope="col" style={cellStyle}  style={cellStyle} style={{width:'300px', textAlign: 'center',}}>
                          公用售電業總銷售電量
                        </th>
                        <th scope="col" style={cellStyle}  style={cellStyle} style={{width:'300px', textAlign: 'center',}}>
                          電力排碳係數(CO2e/度)
                        </th>
                      </tr>
                    </thead>
                    <tbody style={{ border: '1px solid white', backgroundColor: '#FFE4CA' }}>
                      <tr>
                        <td style={cellStyle}><b>112年電力</b></td>
                        <td style={cellStyle}>?</td>
                        <td style={cellStyle}>?</td>
                        <td style={cellStyle}>?</td>
                        <td style={cellStyle}>0.494</td>
                      </tr>
                    </tbody>
                  </table>
                  <br/>
                </CCardBody>
              </CCard>
              <br></br>
              {/* GWP數值 */}
              <CCard style={{ width: '100%' }}>
                <CCardTitle>
                  <div style={{ display: 'flex', flexDireaction: 'row' }}>
                    <div
                      style={{
                        fontWeight: 'bold',
                        fontSize: '1.4rem',
                        color: 'white',
                        backgroundColor: '#9D6B6B',
                        borderTopLeftRadius: '5px',
                        borderBottomRightRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 30px 10px 30px',
                      }}
                    >
                      GWP值
                    </div>
                  </div>
                </CCardTitle>
                <CCardBody>
                  {/* HFCs的GWP */}
                  <table style={{ width: '100%', fontSize: '1.2rem' }}>
                    <thead
                      style={{
                        border: '1px solid white',
                        backgroundColor: 'orange',
                        color: 'white',
                      }}
                    >
                      <tr>
                        <th scope="col" style={cellStyle}>
                          種類
                        </th>
                        <th scope="col" style={cellStyle}>
                          溫室氣體化學式
                        </th>
                        <th scope="col" style={cellStyle}>
                          IPCC 2013年預設GWP值
                        </th>
                      </tr>
                    </thead>
                    <tbody style={{ border: '1px solid white', backgroundColor: '#FFE4CA' }}>
                      <tr>
                        <td
                          style={{
                            border: '1px solid white',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                            height: '40px',
                            width: '350px',
                          }}
                        >
                          <b>--</b>
                        </td>
                        <td style={cellStyle}>CO2二氧化碳</td>
                        <td style={cellStyle}>1</td>
                      </tr>
                      <tr>
                        <td style={{
                            border: '1px solid white',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                            height: '40px',
                            width: '350px',
                          }}>
                          <b>--</b>
                        </td>
                        <td style={cellStyle}>CH4甲烷</td>
                        <td style={cellStyle}>28</td>
                      </tr>
                      <tr>
                        <td style={{
                            border: '1px solid white',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                            height: '40px',
                            width: '350px',
                          }}>
                          <b>--</b>
                        </td>
                        <td style={cellStyle}>CH4石化甲烷</td>
                        <td style={cellStyle}>30</td>
                      </tr>
                      <tr>
                        <td style={{
                            border: '1px solid white',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                            height: '40px',
                            width: '350px',
                          }}>
                          <b>--</b>
                        </td>
                        <td style={cellStyle}>N2O氧化亞氮</td>
                        <td style={cellStyle}>265</td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            border: '1px solid white',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                            height: '40px',
                            width: '350px',
                          }}
                          rowSpan={3}
                        >
                          <b>HFCs<br/>氫氟碳化物</b>
                        </td>
                        <td style={cellStyle}>CHF3三氟甲烷</td>
                        <td style={cellStyle}>12,400</td>
                      </tr>
                      <tr>
                        <td style={cellStyle}>CH2F2二氟甲烷</td>
                        <td style={cellStyle}>677</td>
                      </tr>
                      <tr>
                        <td style={cellStyle}>CH3F一氟甲烷</td>
                        <td style={cellStyle}>116</td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            border: '1px solid white',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                            height: '40px',
                            width: '350px',
                          }}
                          rowSpan={2}
                        >
                          <b>Fully Fluorinated Species<br/>全氟碳化物</b>
                        </td>
                        <td style={cellStyle}>NF3三氟化氮</td>
                        <td style={cellStyle}>16,100</td>
                      </tr>
                      <tr>
                        <td style={cellStyle}>SF6六氟化硫</td>
                        <td style={cellStyle}>23,500</td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            border: '1px solid white',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                            height: '40px',
                            width: '350px',
                          }}
                          rowSpan={2}
                        >
                          <b>混合冷媒</b>
                        </td>
                        <td style={cellStyle}>R-401A,HCFC-22/HFC-152a/HCFC-124</td>
                        <td style={cellStyle}>1,130</td>
                      </tr>
                      <tr>
                        <td style={cellStyle}>R-401B,HCFC-22/HFC-152a/HCFC-124</td>
                        <td style={cellStyle}>1,236</td>
                      </tr>
                    </tbody>
                  </table>
                  <br />
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
