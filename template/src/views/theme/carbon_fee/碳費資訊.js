import React, { useState, useEffect } from 'react'
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
  CInputGroup,
  CInputGroupText,
  CListGroup,
  CListGroupItem,
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
import {
  cilDataTransferDown,
  cilDataTransferUp,
  cilMenu,
  cilChartPie,
  cilSearch,
  cilArrowCircleRight,
} from '@coreui/icons'
// import { freeSet } from '@coreui/icons'
// import { getIconsView } from '../brands/Brands.js'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTableList,
  faChartPie,
  faNewspaper,
  faCircleInfo,
} from '@fortawesome/free-solid-svg-icons'

import styles from '../../../scss/盤查結果查詢.module.css'
import NEWS from './新聞'
const Tabs = () => {
  const [activeTab, setActiveTab] = useState('tab1') // 記錄當前活動的分頁
  const cellStyle = {
    border: '1px solid white',
    textAlign: 'center',
    verticalAlign: 'middle',
    height: '40px',
  }
  const rankingstyle = { border: '1px solid white', textAlign: 'center', verticalAlign: 'middle' }

  const [visible1, setVisible1] = useState(false) // 削減率計算公式model
  const [visible2, setVisible2] = useState(false) // 削減率計算公式model
  const [visible3, setVisible3] = useState(false) // 削減率計算公式model

  const [electricityUsage, setElectricityUsage] = useState('')
  const [quantitativeInventory, setQuantitativeInventory] = useState({})

  const getResult = async () => {
    try {
      const response = await fetch('http://localhost:8000/result')
      if (response.ok) {
        const data = await response.json()
        setElectricityUsage(data.result.Electricity_Usage)
        setQuantitativeInventory(data.result.Quantitative_Inventory)
      } else {
        console.log(response.status)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    getResult()
  }, [])

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
              參考標準
            </strong>
            <CCol style={{ justifyContent: 'left', alignItems: 'center', padding: '0' }}>
              <CFormSelect style={{ width: '90px' }}>
                <option>台灣</option>
                {/* <option value="1">歐盟</option>
                <option value="2">xx2023盤查報告</option>
                <option value="3">xx2022盤查報告</option> */}
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
                &nbsp;碳費計算
              </div>
            </CNavLink>
          </CNavItem>
          {/* <CNavItem>
            <CNavLink
              active={activeTab === 'tab2'}
              onClick={() => setActiveTab('tab2')}
              className={activeTab === 'tab2' ? styles.tabChoose : styles.tabNoChoose}
            >
              <div>
                <FontAwesomeIcon icon={faChartPie} />
                &nbsp;碳費分析
              </div>
            </CNavLink>
          </CNavItem> */}
          <CNavItem>
            <CNavLink
              active={activeTab === 'tab3'}
              onClick={() => setActiveTab('tab3')}
              className={activeTab === 'tab3' ? styles.tabChoose : styles.tabNoChoose}
            >
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
                  <div>
                    <strong>2024碳費計算</strong>
                  </div>
                  <div>
                    <CFormSelect size="sm" className={styles.input}>
                      <option>全部表格</option>
                      <option value="1">表1</option>
                      <option value="2">表2</option>
                      <option value="3">表3</option>
                    </CFormSelect>
                  </div>
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
                  <div style={{ display: 'flex', flexDireaction: 'row' }}>
                    <div
                      style={{
                        fontWeight: 'bold',
                        fontSize: '1.5rem',
                        color: 'white',
                        backgroundColor: '#9D6B6B',
                        borderTopLeftRadius: '5px',
                        borderBottomRightRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 40px 10px 40px',
                      }}
                    >
                      總覽
                    </div>
                    <CButton
                      style={{
                        position: 'absolute',
                        right: '30px',
                        width: '40px',
                        backgroundColor: '#9D6B6B',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: '10px',
                      }}
                    >
                      <b>
                        <CIcon icon={cilDataTransferDown} className="me-2" />
                      </b>
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
                    <thead
                      style={{
                        border: '1px solid white',
                        backgroundColor: '#339933',
                        color: 'white',
                      }}
                    >
                      <tr>
                        <th scope="col" style={cellStyle} rowSpan={2}></th>
                        <th scope="col" style={cellStyle} rowSpan={2}>
                          排放當量<br></br>(公噸CO2e/年)
                        </th>
                        <th scope="col" style={cellStyle} rowSpan={2}>
                          百分比<br></br>(%)
                        </th>
                        <th scope="col" style={cellStyle} rowSpan={2}>
                          一般費率<br></br>(300元/公噸CO2e)
                        </th>
                        <th scope="col" style={cellStyle} colSpan={2}>
                          優惠費率
                        </th>
                      </tr>
                      <tr>
                        <th scope="col" style={cellStyle}>
                          達技術標竿<br></br>(100元/公噸CO2e)
                        </th>
                        <th scope="col" style={cellStyle}>
                          達行業別目標<br></br>(50元/公噸CO2e)
                        </th>
                      </tr>
                    </thead>
                    <tbody style={{ border: '1px solid white', backgroundColor: '#ccffcc' }}>
                      <tr>
                        <td style={{ border: '1px solid white' }}>
                          <b>總排放量</b>
                        </td>
                        <td style={cellStyle}>{quantitativeInventory.total_emission_equivalent}</td>
                        <td style={cellStyle}>100%</td>
                        <td style={cellStyle}>
                          $
                          {(
                            quantitativeInventory.total_emission_equivalent *
                            300 *
                            1
                          ).toLocaleString()}
                        </td>
                        <td style={cellStyle}>
                          $
                          {(
                            quantitativeInventory.total_emission_equivalent *
                            100 *
                            1
                          ).toLocaleString()}
                        </td>
                        <td style={cellStyle}>
                          $
                          {(
                            quantitativeInventory.total_emission_equivalent *
                            50 *
                            1
                          ).toLocaleString()}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid white' }}>
                          <b>
                            <div>
                              <CRow>
                                <div style={{ width: '140px' }}>直接排放</div>
                                <div style={{ width: '100px' }}>/範疇一</div>
                              </CRow>
                            </div>
                          </b>
                        </td>
                        <td style={cellStyle}>
                          {quantitativeInventory.category1_total_emission_equivalent}
                        </td>
                        <td style={cellStyle}>
                          {quantitativeInventory.category1_total_emission_equivalent +
                          quantitativeInventory.category2_total_emission_equivalent
                            ? (
                                (quantitativeInventory.category1_total_emission_equivalent /
                                  (quantitativeInventory.category1_total_emission_equivalent +
                                    quantitativeInventory.category2_total_emission_equivalent)) *
                                100
                              ).toFixed(2) + '%'
                            : '-'}
                        </td>
                        <td style={cellStyle}>
                          $
                          {(
                            quantitativeInventory.category1_total_emission_equivalent *
                            300 *
                            1
                          ).toLocaleString()}
                        </td>
                        <td style={cellStyle}>
                          $
                          {(
                            quantitativeInventory.category1_total_emission_equivalent *
                            100 *
                            1
                          ).toLocaleString()}
                        </td>
                        <td style={cellStyle}>
                          $
                          {(
                            quantitativeInventory.category1_total_emission_equivalent *
                            50 *
                            1
                          ).toLocaleString()}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid white' }}>
                          <b>
                            <div>
                              <CRow>
                                <div style={{ width: '140px' }}>間接排放</div>
                                <div style={{ width: '100px' }}>/範疇二</div>
                              </CRow>
                            </div>
                          </b>
                        </td>
                        <td style={cellStyle}>
                          {quantitativeInventory.category2_total_emission_equivalent}
                        </td>
                        <td style={cellStyle}>
                          {quantitativeInventory.category1_total_emission_equivalent +
                          quantitativeInventory.category2_total_emission_equivalent
                            ? (
                                (quantitativeInventory.category2_total_emission_equivalent /
                                  (quantitativeInventory.category1_total_emission_equivalent +
                                    quantitativeInventory.category2_total_emission_equivalent)) *
                                100
                              ).toFixed(2) + '%'
                            : '-'}
                        </td>
                        <td style={cellStyle}>
                          $
                          {(
                            quantitativeInventory.category2_total_emission_equivalent *
                            300 *
                            1
                          ).toLocaleString()}
                        </td>
                        <td style={cellStyle}>
                          $
                          {(
                            quantitativeInventory.category2_total_emission_equivalent *
                            100 *
                            1
                          ).toLocaleString()}
                        </td>
                        <td style={cellStyle}>
                          $
                          {(
                            quantitativeInventory.category2_total_emission_equivalent *
                            50 *
                            1
                          ).toLocaleString()}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid white' }}>
                          <b>
                            <div>
                              <CRow>
                                <div style={{ width: '140px' }}>其他間接排放</div>
                                <div style={{ width: '100px' }}>/範疇三</div>
                              </CRow>
                            </div>
                          </b>
                        </td>
                        <td style={cellStyle}>-----</td>
                        <td style={cellStyle}>-----</td>
                        <td style={cellStyle}>-----</td>
                        <td style={cellStyle}>-----</td>
                        <td style={cellStyle}>-----</td>
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
                  <div style={{ display: 'flex', flexDireaction: 'row' }}>
                    <div
                      style={{
                        fontWeight: 'bold',
                        fontSize: '1.5rem',
                        color: 'white',
                        backgroundColor: '#9D6B6B',
                        borderTopLeftRadius: '5px',
                        borderBottomRightRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 30px 10px 30px',
                      }}
                    >
                      技術標竿指定削減率
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
                        <CModalTitle>
                          <b>技術標竿指定削減率</b>
                        </CModalTitle>
                      </CModalHeader>
                      <CModalBody>
                        <ul>
                          <li>
                            以<b>107~111年為基準年</b>
                            ，考量各排放源排放形式，包括燃料種類、製程、電力使用等訂定減量目標，適用
                            <b>優惠費率B</b>。
                            <br />
                            <font style={{ backgroundColor: '#DCDCDC' }}>
                              削減率 = [(基準年-當年分) / 基準年]*100%
                            </font>
                            <br />
                          </li>
                          <li>
                            目標年溫室氣體年排放量削減率相對基準年應達6%。<br></br>
                            <font style={{ backgroundColor: '#DCDCDC' }}>
                              目標年溫室氣體排放量 =
                              [基準年固定燃料燃燒溫室氣體年排放量*(1-削減率)]+[基準年製程溫室氣體年排放量*(1-削減率)]
                              +[基準年使用電力之溫室氣體年排放量*(1-削減率)]+[逸散及移動排放源基準年溫室氣體年排放量]
                            </font>
                            <br />
                          </li>
                        </ul>
                      </CModalBody>
                      <CModalFooter>
                        <CButton color="secondary" onClick={() => setVisible1(false)}>
                          關閉
                        </CButton>
                      </CModalFooter>
                    </CModal>
                    <CButton
                      style={{
                        position: 'absolute',
                        right: '30px',
                        width: '40px',
                        backgroundColor: '#9D6B6B',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: '10px',
                      }}
                    >
                      <b>
                        <CIcon icon={cilDataTransferDown} className="me-2" />
                      </b>
                    </CButton>
                  </div>
                </CCardTitle>
                <CCardBody>
                  <table style={{ fontSize: '1.2rem' }}>
                    <thead
                      style={{
                        border: '1px solid white',
                        backgroundColor: '#339933',
                        color: 'white',
                      }}
                    >
                      <tr>
                        <th scope="col" style={cellStyle} colSpan={2}></th>
                        <th scope="col" style={cellStyle}>
                          基準年排放當量<br></br>(公噸CO2e/年)
                        </th>
                        <th scope="col" style={cellStyle}>
                          排放當量<br></br>(公噸CO2e/年)
                        </th>
                        <th scope="col" style={cellStyle}>
                          削減率<br></br>(%)
                        </th>
                        <th scope="col" style={cellStyle}>
                          目標年削減率<br></br>(%)
                        </th>
                      </tr>
                    </thead>
                    <tbody style={{ border: '1px solid white', backgroundColor: '#ccffcc' }}>
                      <tr>
                        <td
                          style={{
                            border: '1px solid white',
                            width: '170px',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                          }}
                          colSpan={2}
                        >
                          <b>使用電力間接排放</b>
                        </td>
                        <td style={cellStyle}>
                          {quantitativeInventory.category2_total_emission_equivalent}
                        </td>
                        <td style={cellStyle}>
                          {quantitativeInventory.category2_total_emission_equivalent}
                        </td>
                        <td style={cellStyle}>0%</td>
                        <td style={cellStyle}>
                          <b>6%</b>
                        </td>
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
                  <div style={{ display: 'flex', flexDireaction: 'row' }}>
                    <div
                      style={{
                        fontWeight: 'bold',
                        fontSize: '1.5rem',
                        color: 'white',
                        backgroundColor: '#9D6B6B',
                        borderTopLeftRadius: '5px',
                        borderBottomRightRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 30px 10px 30px',
                      }}
                    >
                      行業別指定削減率
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
                      onClick={() => setVisible2(!visible2)}
                    >
                      <FontAwesomeIcon
                        icon={faCircleInfo}
                        style={{ width: '20px', height: '20px' }}
                      />
                    </CButton>
                    <CModal visible={visible2} onClose={() => setVisible2(false)}>
                      <CModalHeader>
                        <CModalTitle>
                          <b>行業別指定削減率</b>
                        </CModalTitle>
                      </CModalHeader>
                      <CModalBody>
                        <ul>
                          <li>
                            以<b>110年為基準年</b>，此目標參酌國際間科技基礎減量目標(SBT)訂定，適用
                            <b>優惠費率A</b>。
                            <br />
                            <font style={{ backgroundColor: '#DCDCDC' }}>
                              削減率 = [(基準年-當年分) / 基準年]*100%
                            </font>
                            <br />
                          </li>
                          <li>
                            目標年訂為119年，目標年溫室氣體年排放量削減率相對基準年應達42%。
                            <br />
                            <font style={{ backgroundColor: '#DCDCDC' }}>
                              目標年溫室氣體排放量 = 基準年溫室氣體年排放量*(1-削減率)
                            </font>
                            <br />
                          </li>
                        </ul>
                      </CModalBody>
                      <CModalFooter>
                        <CButton color="secondary" onClick={() => setVisible2(false)}>
                          關閉
                        </CButton>
                      </CModalFooter>
                    </CModal>
                    <CButton
                      style={{
                        position: 'absolute',
                        right: '30px',
                        width: '40px',
                        backgroundColor: '#9D6B6B',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: '10px',
                      }}
                    >
                      <b>
                        <CIcon icon={cilDataTransferDown} className="me-2" />
                      </b>
                    </CButton>
                  </div>
                </CCardTitle>
                <CCardBody>
                  <table style={{ fontSize: '1.2rem' }}>
                    <thead
                      style={{
                        border: '1px solid white',
                        backgroundColor: '#339933',
                        color: 'white',
                      }}
                    >
                      <tr>
                        <th scope="col" style={cellStyle} colSpan={2}></th>
                        <th scope="col" style={cellStyle}>
                          基準年排放當量<br></br>(公噸CO2e/年)
                        </th>
                        <th scope="col" style={cellStyle}>
                          排放當量<br></br>(公噸CO2e/年)
                        </th>
                        <th scope="col" style={cellStyle}>
                          削減率<br></br>(%)
                        </th>
                        <th scope="col" style={cellStyle}>
                          目標年削減率<br></br>(%)
                        </th>
                      </tr>
                    </thead>
                    <tbody style={{ border: '1px solid white', backgroundColor: '#ccffcc' }}>
                      <tr>
                        <td
                          style={{
                            border: '1px solid white',
                            width: '120px',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                          }}
                          colSpan={2}
                        >
                          <b>其他行業別</b>
                        </td>
                        <td style={cellStyle}>{quantitativeInventory.total_emission_equivalent}</td>
                        <td style={cellStyle}>{quantitativeInventory.total_emission_equivalent}</td>
                        <td style={cellStyle}>0%</td>
                        <td style={cellStyle}>
                          <b>42%</b>
                        </td>
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

          
          {/* 碳費新聞 */}
          {activeTab === 'tab3' && <NEWS />}
        </div>
      </CCol>
    </CRow>
  )
}

export default Tabs
