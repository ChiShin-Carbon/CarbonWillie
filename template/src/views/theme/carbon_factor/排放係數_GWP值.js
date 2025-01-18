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
import { faTableList, faChartPie } from '@fortawesome/free-solid-svg-icons'

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
              {/* 溫室氣體排放係數 */}
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
                      溫室氣體排放係數
                    </div>
                  </div>
                </CCardTitle>
                <CCardBody>
                  {/* CO2排放係數 */}
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
                        <th scope="col" style={cellStyle} rowSpan={2}>
                          排放形式
                        </th>
                        <th scope="col" style={cellStyle} rowSpan={2}>
                          排放源類別
                        </th>
                        <th scope="col" style={cellStyle} rowSpan={2}>
                          燃料別
                        </th>
                        <th scope="col" style={cellStyle} rowSpan={2}>
                          IPCC 2006年CO2排放係數
                        </th>
                        <th scope="col" style={cellStyle} rowSpan={2}>
                          單位
                        </th>
                        <th scope="col" style={cellStyle} colSpan={2}>
                          IPCC 2006年CO2排放係數之不確定性
                        </th>
                      </tr>
                      <tr>
                        <th scope="col" style={cellStyle}>
                          95%信賴區間下限
                        </th>
                        <th scope="col" style={cellStyle}>
                          95%信賴區間上限
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
                            width: '70px',
                          }}
                          rowSpan={9}
                        >
                          <b>CO2</b>
                        </td>
                        <td style={cellStyle} rowSpan={7}><b>固定源</b></td>
                        <td style={cellStyle} rowSpan={2}>燃料油</td>
                        <td style={cellStyle}>柴油</td>
                        <td style={cellStyle}>74,100</td>
                        <td style={cellStyle}>kgCO2/TJ</td>
                        <td style={cellStyle}>-2.0%</td>
                        <td style={cellStyle}>+0.9%</td>
                      </tr>
                      <tr>
                        <td style={cellStyle}>車用汽油</td>
                        <td style={cellStyle}>69,300</td>
                        <td style={cellStyle}>kgCO2/TJ</td>
                        <td style={cellStyle}>-2.6%</td>
                        <td style={cellStyle}>+5.3%</td>
                      </tr>
                      <tr>
                        <td style={cellStyle} rowSpan={2}>燃料氣</td>
                        <td style={cellStyle}>乙烷</td>
                        <td style={cellStyle}>61,600</td>
                        <td style={cellStyle}>kgCO2/TJ</td>
                        <td style={cellStyle}>-8.3%</td>
                        <td style={cellStyle}>+11.4%</td>
                      </tr>
                      <tr>
                        <td style={cellStyle}>天然氣</td>
                        <td style={cellStyle}>56,100</td>
                        <td style={cellStyle}>kgCO2/TJ</td>
                        <td style={cellStyle}>-3.2%</td>
                        <td style={cellStyle}>+3.9%</td>
                      </tr>
                      <tr>
                        <td style={cellStyle} rowSpan={2}>其他燃料</td>
                        <td style={cellStyle}>一般廢棄物</td>
                        <td style={cellStyle}>91,700</td>
                        <td style={cellStyle}>kgCO2/TJ</td>
                        <td style={cellStyle}>-20.1%</td>
                        <td style={cellStyle}>+32.0%</td>
                      </tr>
                      <tr>
                        <td style={cellStyle}>事業廢棄物</td>
                        <td style={cellStyle}>143,000</td>
                        <td style={cellStyle}>kgCO2/TJ</td>
                        <td style={cellStyle}>-23.1%</td>
                        <td style={cellStyle}>+28.0%</td>
                      </tr>
                      <tr>
                        <td style={cellStyle}>生質燃料</td>
                        <td style={cellStyle}>汙泥沼氣</td>
                        <td style={cellStyle}>54,600</td>
                        <td style={cellStyle}>kgCO2/TJ</td>
                        <td style={cellStyle}>-15.4%</td>
                        <td style={cellStyle}>+20.9%</td>
                      </tr>
                      <tr>
                        <td style={cellStyle} rowSpan={2}><b>移動源</b></td>
                        <td style={cellStyle} rowSpan={2}>燃料源</td>
                        <td style={cellStyle}>車用汽油</td>
                        <td style={cellStyle}>69,300</td>
                        <td style={cellStyle}>kgCO2/TJ</td>
                        <td style={cellStyle}>-2.6%</td>
                        <td style={cellStyle}>+5.3%</td>
                      </tr>
                      <tr>
                        <td style={cellStyle}>柴油</td>
                        <td style={cellStyle}>74,100</td>
                        <td style={cellStyle}>kgCO2/TJ</td>
                        <td style={cellStyle}>-2.0%</td>
                        <td style={cellStyle}>+0.9%</td>
                      </tr>
                    </tbody>
                  </table>
                  <br />
                  {/* CH4排放係數 */}
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
                        <th scope="col" style={cellStyle} rowSpan={2}>
                          排放形式
                        </th>
                        <th scope="col" style={cellStyle} rowSpan={2}>
                          排放源類別
                        </th>
                        <th scope="col" style={cellStyle} rowSpan={2}>
                          燃料別
                        </th>
                        <th scope="col" style={cellStyle} rowSpan={2}>
                          IPCC 2006年CO2排放係數
                        </th>
                        <th scope="col" style={cellStyle} rowSpan={2}>
                          單位
                        </th>
                        <th scope="col" style={cellStyle} colSpan={2}>
                          IPCC 2006年CO2排放係數之不確定性
                        </th>
                      </tr>
                      <tr>
                        <th scope="col" style={cellStyle}>
                          95%信賴區間下限
                        </th>
                        <th scope="col" style={cellStyle}>
                          95%信賴區間上限
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
                            width: '70px',
                          }}
                          rowSpan={9}
                        >
                          <b>CH4</b>
                        </td>
                        <td style={cellStyle} rowSpan={7}><b>固定源</b></td>
                        <td style={cellStyle} rowSpan={2}>燃料油</td>
                        <td style={cellStyle}>柴油</td>
                        <td style={cellStyle}>3</td>
                        <td style={cellStyle}>kgCH4/TJ</td>
                        <td style={cellStyle}>-66.7%</td>
                        <td style={cellStyle}>+233.3%</td>
                      </tr>
                      <tr>
                        <td style={cellStyle}>車用汽油</td>
                        <td style={cellStyle}>3</td>
                        <td style={cellStyle}>kgCH4/TJ</td>
                        <td style={cellStyle}>-66.7%</td>
                        <td style={cellStyle}>+233.3%</td>
                      </tr>
                      <tr>
                        <td style={cellStyle} rowSpan={2}>燃料氣</td>
                        <td style={cellStyle}>乙烷</td>
                        <td style={cellStyle}>1</td>
                        <td style={cellStyle}>kgCH4/TJ</td>
                        <td style={cellStyle}>-70%</td>
                        <td style={cellStyle}>+200%</td>
                      </tr>
                      <tr>
                        <td style={cellStyle}>天然氣</td>
                        <td style={cellStyle}>1</td>
                        <td style={cellStyle}>kgCH4/TJ</td>
                        <td style={cellStyle}>-70%</td>
                        <td style={cellStyle}>+200%</td>
                      </tr>
                      <tr>
                        <td style={cellStyle} rowSpan={2}>其他燃料</td>
                        <td style={cellStyle}>一般廢棄物</td>
                        <td style={cellStyle}>30</td>
                        <td style={cellStyle}>kgCH4/TJ</td>
                        <td style={cellStyle}>-66.7%</td>
                        <td style={cellStyle}>+233.3%</td>
                      </tr>
                      <tr>
                        <td style={cellStyle}>事業廢棄物</td>
                        <td style={cellStyle}>30</td>
                        <td style={cellStyle}>kgCH4/TJ</td>
                        <td style={cellStyle}>-66.7%</td>
                        <td style={cellStyle}>+233.3%</td>
                      </tr>
                      <tr>
                        <td style={cellStyle}>生質燃料</td>
                        <td style={cellStyle}>汙泥沼氣</td>
                        <td style={cellStyle}>1</td>
                        <td style={cellStyle}>kgCH4/TJ</td>
                        <td style={cellStyle}>-70%</td>
                        <td style={cellStyle}>+200%</td>
                      </tr>
                      <tr>
                        <td style={cellStyle} rowSpan={2}><b>移動源</b></td>
                        <td style={cellStyle} rowSpan={2}>燃料源</td>
                        <td style={cellStyle}>車用汽油</td>
                        <td style={cellStyle}>25</td>
                        <td style={cellStyle}>kgCH4/TJ</td>
                        <td style={cellStyle}>-69.6%</td>
                        <td style={cellStyle}>+244.0%</td>
                      </tr>
                      <tr>
                        <td style={cellStyle}>柴油</td>
                        <td style={cellStyle}>3.9</td>
                        <td style={cellStyle}>kgCH4/TJ</td>
                        <td style={cellStyle}>-59.0%</td>
                        <td style={cellStyle}>+143.6%</td>
                      </tr>
                    </tbody>
                  </table>
                  <br/>
                  {/* N2O排放係數 */}
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
                        <th scope="col" style={cellStyle} rowSpan={2}>
                          排放形式
                        </th>
                        <th scope="col" style={cellStyle} rowSpan={2}>
                          排放源類別
                        </th>
                        <th scope="col" style={cellStyle} rowSpan={2}>
                          燃料別
                        </th>
                        <th scope="col" style={cellStyle} rowSpan={2}>
                          IPCC 2006年CO2排放係數
                        </th>
                        <th scope="col" style={cellStyle} rowSpan={2}>
                          單位
                        </th>
                        <th scope="col" style={cellStyle} colSpan={2}>
                          IPCC 2006年CO2排放係數之不確定性
                        </th>
                      </tr>
                      <tr>
                        <th scope="col" style={cellStyle}>
                          95%信賴區間下限
                        </th>
                        <th scope="col" style={cellStyle}>
                          95%信賴區間上限
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
                            width: '70px',
                          }}
                          rowSpan={9}
                        >
                          <b>N2O</b>
                        </td>
                        <td style={cellStyle} rowSpan={7}><b>固定源</b></td>
                        <td style={cellStyle} rowSpan={2}>燃料油</td>
                        <td style={cellStyle}>柴油</td>
                        <td style={cellStyle}>0.6</td>
                        <td style={cellStyle}>kgN2O/TJ</td>
                        <td style={cellStyle}>-66.7%</td>
                        <td style={cellStyle}>+233.3%</td>
                      </tr>
                      <tr>
                        <td style={cellStyle}>車用汽油</td>
                        <td style={cellStyle}>0.6</td>
                        <td style={cellStyle}>kgN2O/TJ</td>
                        <td style={cellStyle}>-66.7%</td>
                        <td style={cellStyle}>+233.3%</td>
                      </tr>
                      <tr>
                        <td style={cellStyle} rowSpan={2}>燃料氣</td>
                        <td style={cellStyle}>乙烷</td>
                        <td style={cellStyle}>0.1</td>
                        <td style={cellStyle}>kgN2O/TJ</td>
                        <td style={cellStyle}>-70.0%</td>
                        <td style={cellStyle}>+200.0%</td>
                      </tr>
                      <tr>
                        <td style={cellStyle}>天然氣</td>
                        <td style={cellStyle}>0.1</td>
                        <td style={cellStyle}>kgN2O/TJ</td>
                        <td style={cellStyle}>-70.0%</td>
                        <td style={cellStyle}>+200.0%</td>
                      </tr>
                      <tr>
                        <td style={cellStyle} rowSpan={2}>其他燃料</td>
                        <td style={cellStyle}>一般廢棄物</td>
                        <td style={cellStyle}>4.0</td>
                        <td style={cellStyle}>kgN2O/TJ</td>
                        <td style={cellStyle}>-62.5%</td>
                        <td style={cellStyle}>+275.0%</td>
                      </tr>
                      <tr>
                        <td style={cellStyle}>事業廢棄物</td>
                        <td style={cellStyle}>4.0</td>
                        <td style={cellStyle}>kgN2O/TJ</td>
                        <td style={cellStyle}>-62.5%</td>
                        <td style={cellStyle}>+275.0%</td>
                      </tr>
                      <tr>
                        <td style={cellStyle}>生質燃料</td>
                        <td style={cellStyle}>汙泥沼氣</td>
                        <td style={cellStyle}>0.1</td>
                        <td style={cellStyle}>kgN2O/TJ</td>
                        <td style={cellStyle}>-70.0%</td>
                        <td style={cellStyle}>+200.0%</td>
                      </tr>
                      <tr>
                        <td style={cellStyle} rowSpan={2}><b>移動源</b></td>
                        <td style={cellStyle} rowSpan={2}>燃料源</td>
                        <td style={cellStyle}>車用汽油</td>
                        <td style={cellStyle}>8.0</td>
                        <td style={cellStyle}>kgN2O/TJ</td>
                        <td style={cellStyle}>-67.5%</td>
                        <td style={cellStyle}>+200.0%</td>
                      </tr>
                      <tr>
                        <td style={cellStyle}>柴油</td>
                        <td style={cellStyle}>3.9</td>
                        <td style={cellStyle}>kgN2O/TJ</td>
                        <td style={cellStyle}>-66.7%</td>
                        <td style={cellStyle}>+207.7%</td>
                      </tr>
                    </tbody>
                  </table>
                  <br/>
                  {/* 外購電力排放係數 */}
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
                        <th scope="col" style={cellStyle} rowSpan={2}>
                          排放形式
                        </th>
                        <th scope="col" style={cellStyle} rowSpan={2}>
                          排放源類別
                        </th>
                        <th scope="col" style={cellStyle} rowSpan={2}>
                          燃料別
                        </th>
                        <th scope="col" style={cellStyle} rowSpan={2}>
                          IPCC 2006年CO2排放係數
                        </th>
                        <th scope="col" style={cellStyle} rowSpan={2}>
                          單位
                        </th>
                        <th scope="col" style={cellStyle} colSpan={2}>
                          IPCC 2006年CO2排放係數之不確定性
                        </th>
                      </tr>
                      <tr>
                        <th scope="col" style={cellStyle}>
                          95%信賴區間下限
                        </th>
                        <th scope="col" style={cellStyle}>
                          95%信賴區間上限
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
                            width: '70px',
                          }}
                          rowSpan={9}
                        >
                          <b>外購電力</b>
                        </td>
                        <td style={cellStyle} rowSpan={7}><b>--</b></td>
                        <td style={cellStyle} rowSpan={2}>--</td>
                        <td style={cellStyle}>--</td>
                        <td style={cellStyle}>0.495</td>
                        <td style={cellStyle}>公斤/度</td>
                        <td style={cellStyle}>--</td>
                        <td style={cellStyle}>--</td>
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
