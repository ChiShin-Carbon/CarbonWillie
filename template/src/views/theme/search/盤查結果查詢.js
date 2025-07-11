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
import { cilDataTransferDown, cilDataTransferUp, cilMenu, cilChartPie } from '@coreui/icons'
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

  const gas_emission_equivalent = [
    'CO2_emission_equivalent',
    'CH4_emission_equivalent',
    'N2O_emission_equivalent',
    'HFCS_emission_equivalent',
    'PFCS_emission_equivalent',
    'SF6_emission_equivalent',
    'NF3_emission_equivalent',
    'total_emission_equivalent',
  ]

  const category1_gas_emission_equivalent = [
    'category1_CO2_emission_equivalent',
    'category1_CH4_emission_equivalent',
    'category1_N2O_emission_equivalent',
    'category1_HFCS_emission_equivalent',
    'category1_PFCS_emission_equivalent',
    'category1_SF6_emission_equivalent',
    'category1_NF3_emission_equivalent',
    'category1_total_emission_equivalent',
  ]

  const [availableYears, setAvailableYears] = useState([])
  const [selectedYear, setSelectedYear] = useState('')
  const [electricityUsage, setElectricityUsage] = useState('')
  const [quantitativeInventory, setQuantitativeInventory] = useState({})

  const getResult = async (year = '') => {
    try {
      const response = await fetch(`http://localhost:8000/result${year ? `?year=${year}` : ''}`)
      if (response.ok) {
        const data = await response.json()
        setElectricityUsage(data.result.Electricity_Usage)
        setQuantitativeInventory(data.result.Quantitative_Inventory)
        setAvailableYears(data.result.Available_Years)
        setSelectedYear(data.result.Selected_Year.toString())
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

  useEffect(() => {
    if (selectedYear !== '') {
      getResult(selectedYear)
    }
  }, [selectedYear])

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
              <CFormSelect
                style={{ width: '120px' }}
                value={selectedYear}
                onChange={(e) => {
                  const selected = e.target.value
                  setSelectedYear(selected)
                  getResult(selected)
                }}
              >
                {availableYears.map((year) => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
          </div>
          {/* <div style={{ width: '300px', display: 'flex', justifyContent: 'left' }}>
            <strong
              style={{ fontSize: '1.0rem', display: 'flex', alignItems: 'center', padding: '5px' }}
            >
              選擇計畫
            </strong>
            <CCol style={{ justifyContent: 'left', alignItems: 'center', padding: '0' }}>
              <CFormSelect style={{ width: '180px' }}>
                <option>2024盤查報告</option>
                <option value="1">2023盤查報告</option>
                <option value="2">2022盤查報告</option>
                <option value="3">2021盤查報告</option>
              </CFormSelect>
            </CCol>
          </div> */}
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
                &nbsp;表格呈現
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
                <FontAwesomeIcon icon={faChartPie} />
                &nbsp;圖形呈現
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
                  <div>
                    <strong>{selectedYear}盤查報告</strong>
                  </div>
                  {/* <div>
                    <CFormSelect size="sm" className={styles.input}>
                      <option>全部表格</option>
                      <option value="1">表1</option>
                      <option value="2">表2</option>
                      <option value="3">表3</option>
                    </CFormSelect>
                  </div> */}
                </div>
                {/* <div className={styles.rightItem}>
                  <button>
                    <CIcon icon={cilDataTransferDown} className="me-2" />
                    下載全部
                  </button>
                </div> */}
              </div>
              {/* 全廠電力 */}
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
                      全廠電力
                    </div>
                    {/* <CButton
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
                    </CButton> */}
                  </div>
                </CCardTitle>
                <CCardBody>
                  <table style={{ width: '100%', fontSize: '1.2rem' }}>
                    <thead
                      style={{
                        border: '1px solid white',
                        backgroundColor: '#33CCFF',
                        color: 'white',
                      }}
                    >
                      <tr>
                        <th scope="col" style={cellStyle}></th>
                        <th scope="col" style={cellStyle}>
                          全廠火力電力(仟度)
                        </th>
                        <th scope="col" style={cellStyle}>
                          風力(仟度)
                        </th>
                        <th scope="col" style={cellStyle}>
                          水力(仟度)
                        </th>
                        <th scope="col" style={cellStyle}>
                          地熱(仟度)
                        </th>
                        <th scope="col" style={cellStyle}>
                          水力(仟度)
                        </th>
                        <th scope="col" style={cellStyle}>
                          水力(仟度)
                        </th>
                      </tr>
                    </thead>
                    <tbody style={{ border: '1px solid white', backgroundColor: '#CCEEFF' }}>
                      <tr>
                        <td
                          style={{
                            border: '1px solid white',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                            height: '40px',
                            width: '70px',
                          }}
                        >
                          <b>電力</b>
                        </td>
                        <td style={cellStyle}>{electricityUsage}</td>
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
              {/* 全廠 七大溫室氣體排放量統計表 */}
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
                      全廠&nbsp;七大溫室氣體排放量統計表
                    </div>
                    {/* <CButton
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
                    </CButton> */}
                  </div>
                </CCardTitle>
                <CCardBody>
                  <table style={{ width: '100%', fontSize: '1.2rem' }}>
                    <thead
                      style={{
                        border: '1px solid white',
                        backgroundColor: '#33CCFF',
                        color: 'white',
                      }}
                    >
                      <tr>
                        <th scope="col" style={cellStyle}></th>
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
                          HFCs
                        </th>
                        <th scope="col" style={cellStyle}>
                          PFCs
                        </th>
                        <th scope="col" style={cellStyle}>
                          SF6
                        </th>
                        <th scope="col" style={cellStyle}>
                          NF3
                        </th>
                        <th scope="col" style={cellStyle}>
                          七種溫室氣體年總排放當量
                        </th>
                        <th scope="col" style={cellStyle}>
                          生質排放當量
                        </th>
                      </tr>
                    </thead>
                    <tbody style={{ border: '1px solid white', backgroundColor: '#CCEEFF' }}>
                      <tr>
                        <td
                          style={{
                            border: '1px solid white',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                            height: '40px',
                            width: '150px',
                          }}
                        >
                          <b>
                            排放當量
                            <br />
                            (公噸CO2e/年)
                          </b>
                        </td>
                        {gas_emission_equivalent.map((gas, index) => (
                          <td key={index} style={cellStyle}>
                            {quantitativeInventory[gas] === 0
                              ? '-----'
                              : quantitativeInventory[gas]}
                          </td>
                        ))}
                        <td style={cellStyle}>-----</td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            border: '1px solid white',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                            height: '40px',
                            width: '70px',
                          }}
                        >
                          <b>
                            氣體別占比
                            <br />
                            (%)
                          </b>
                        </td>
                        {gas_emission_equivalent.map((gas, index) => (
                          <td key={index} style={cellStyle}>
                            {quantitativeInventory.total_emission_equivalent
                              ? quantitativeInventory[gas] === 0
                                ? '-----'
                                : gas === 'total_emission_equivalent'
                                  ? '100.00%'
                                  : (
                                      (quantitativeInventory[gas] /
                                        quantitativeInventory.total_emission_equivalent) *
                                      100
                                    ).toFixed(2) + '%'
                              : '0.00%'}
                          </td>
                        ))}
                        <td style={cellStyle}>-----</td>
                      </tr>
                    </tbody>
                  </table>
                  <br />
                </CCardBody>
              </CCard>
              <br></br>
              {/* 類別一 七大溫室氣體排放量統計表 */}
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
                      範疇一&nbsp;&nbsp;七大溫室氣體排放量統計表
                    </div>
                    {/* <CButton
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
                    </CButton> */}
                  </div>
                </CCardTitle>
                <CCardBody>
                  <table style={{ width: '100%', fontSize: '1.2rem' }}>
                    <thead
                      style={{
                        border: '1px solid white',
                        backgroundColor: '#33CCFF',
                        color: 'white',
                      }}
                    >
                      <tr>
                        <th scope="col" style={cellStyle}></th>
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
                          HFCs
                        </th>
                        <th scope="col" style={cellStyle}>
                          PFCs
                        </th>
                        <th scope="col" style={cellStyle}>
                          SF6
                        </th>
                        <th scope="col" style={cellStyle}>
                          NF3
                        </th>
                        <th scope="col" style={cellStyle}>
                          七種溫室氣體年總排放當量
                        </th>
                        {/* <th scope="col" style={cellStyle}>
                          生質排放當量
                        </th> */}
                      </tr>
                    </thead>
                    <tbody style={{ border: '1px solid white', backgroundColor: '#CCEEFF' }}>
                      <tr>
                        <td
                          style={{
                            border: '1px solid white',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                            height: '40px',
                            width: '150px',
                          }}
                        >
                          <b>
                            排放當量
                            <br />
                            (公噸CO2e/年)
                          </b>
                        </td>
                        {category1_gas_emission_equivalent.map((category1_gas, index) => (
                          <td key={index} style={cellStyle}>
                            {quantitativeInventory[category1_gas] === 0
                              ? '-----'
                              : quantitativeInventory[category1_gas]}
                          </td>
                        ))}
                        {/* <td style={cellStyle}></td> */}
                      </tr>
                      <tr>
                        <td
                          style={{
                            border: '1px solid white',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                            height: '40px',
                            width: '70px',
                          }}
                        >
                          <b>
                            氣體別占比
                            <br />
                            (%)
                          </b>
                        </td>
                        {category1_gas_emission_equivalent.map((category1_gas, index) => (
                          <td key={index} style={cellStyle}>
                            {quantitativeInventory.total_emission_equivalent
                              ? quantitativeInventory[category1_gas] === 0
                                ? '-----'
                                : category1_gas === 'category1_total_emission_equivalent'
                                  ? '100.00%'
                                  : (
                                      (quantitativeInventory[category1_gas] /
                                        quantitativeInventory.total_emission_equivalent) *
                                      100
                                    ).toFixed(2) + '%'
                              : '0.00%'}
                          </td>
                        ))}
                        {/* <td style={cellStyle}></td> */}
                      </tr>
                    </tbody>
                  </table>
                  <br />
                </CCardBody>
              </CCard>
              <br></br>
              {/* 範疇一及範疇二排放形式排放量統計表 */}
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
                      範疇一及範疇二&nbsp;&nbsp;排放形式排放量統計表
                    </div>
                    {/* <CButton
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
                    </CButton> */}
                  </div>
                </CCardTitle>
                <CCardBody>
                  <table style={{ width: '100%', fontSize: '1.2rem' }}>
                    <thead
                      style={{
                        border: '1px solid white',
                        backgroundColor: '#33CCFF',
                        color: 'white',
                      }}
                    >
                      <tr>
                        <th scope="col" style={cellStyle} rowSpan={2}></th>
                        <th scope="col" style={cellStyle} colSpan={4}>
                          範疇1
                        </th>
                        <th scope="col" style={cellStyle} colSpan={2}>
                          範疇2
                        </th>
                        <th scope="col" style={cellStyle} colSpan={2} rowSpan={2}>
                          範疇一及範疇二排放量
                        </th>
                      </tr>
                      <tr>
                        <th scope="col" style={cellStyle}>
                          固定排放
                        </th>
                        <th scope="col" style={cellStyle}>
                          製程排放
                        </th>
                        <th scope="col" style={cellStyle}>
                          移動排放
                        </th>
                        <th scope="col" style={cellStyle}>
                          逸散排放
                        </th>
                        <th scope="col" style={cellStyle}>
                          外購電力
                        </th>
                      </tr>
                    </thead>
                    <tbody style={{ border: '1px solid white', backgroundColor: '#CCEEFF' }}>
                      <tr>
                        <td
                          rowSpan={2}
                          style={{
                            border: '1px solid white',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                            height: '40px',
                            width: '150px',
                          }}
                        >
                          <b>
                            排放當量
                            <br />
                            (公噸CO2e/年)
                          </b>
                        </td>
                        <td style={cellStyle} colSpan={4}>
                          {quantitativeInventory.category1_total_emission_equivalent}
                        </td>
                        <td style={cellStyle} colSpan={2} rowSpan={2}>
                          {quantitativeInventory.category2_total_emission_equivalent}
                        </td>
                        <td style={cellStyle} rowSpan={2}>
                          {quantitativeInventory.category1_total_emission_equivalent +
                            quantitativeInventory.category2_total_emission_equivalent}
                        </td>
                      </tr>
                      <tr>
                        <td style={cellStyle}>
                          {quantitativeInventory.stationary_emission_equivalent}
                        </td>
                        <td style={cellStyle}>
                          {quantitativeInventory.process_emission_equivalent}
                        </td>
                        <td style={cellStyle}>
                          {quantitativeInventory.mobile_emission_equivalent}
                        </td>
                        <td style={cellStyle}>
                          {quantitativeInventory.fugitive_emission_equivalent}
                        </td>
                      </tr>
                      <tr>
                        <td
                          rowSpan={2}
                          style={{
                            border: '1px solid white',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                            height: '40px',
                            width: '70px',
                          }}
                        >
                          <b>
                            氣體別占比
                            <br />
                            (%)
                          </b>
                        </td>
                        <td style={cellStyle} colSpan={4}>
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
                        <td style={cellStyle} colSpan={2} rowSpan={2}>
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
                        <td style={cellStyle} rowSpan={2}>
                          {quantitativeInventory.category1_total_emission_equivalent +
                          quantitativeInventory.category2_total_emission_equivalent
                            ? (
                                ((quantitativeInventory.category1_total_emission_equivalent +
                                  quantitativeInventory.category2_total_emission_equivalent) /
                                  (quantitativeInventory.category1_total_emission_equivalent +
                                    quantitativeInventory.category2_total_emission_equivalent)) *
                                100
                              ).toFixed(2) + '%'
                            : '-'}
                        </td>
                      </tr>
                      <tr>
                        <td style={cellStyle}>
                          {quantitativeInventory.category1_total_emission_equivalent
                            ? (
                                (quantitativeInventory.stationary_emission_equivalent /
                                  quantitativeInventory.category1_total_emission_equivalent) *
                                100
                              ).toFixed(2) + '%'
                            : '-'}
                        </td>
                        <td style={cellStyle}>
                          {quantitativeInventory.category1_total_emission_equivalent
                            ? (
                                (quantitativeInventory.process_emission_equivalent /
                                  quantitativeInventory.category1_total_emission_equivalent) *
                                100
                              ).toFixed(2) + '%'
                            : '-'}
                        </td>
                        <td style={cellStyle}>
                          {quantitativeInventory.category1_total_emission_equivalent
                            ? (
                                (quantitativeInventory.mobile_emission_equivalent /
                                  quantitativeInventory.category1_total_emission_equivalent) *
                                100
                              ).toFixed(2) + '%'
                            : '-'}
                        </td>
                        <td style={cellStyle}>
                          {quantitativeInventory.category1_total_emission_equivalent
                            ? (
                                (quantitativeInventory.fugitive_emission_equivalent /
                                  quantitativeInventory.category1_total_emission_equivalent) *
                                100
                              ).toFixed(2) + '%'
                            : '-'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <br />
                </CCardBody>
              </CCard>
              <br></br>
              {/* <CCard style={{ width: '100%' }}>
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
                      全廠&nbsp;溫室氣體數據等級評估結果
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
                </CCardTitle>
                <CCardBody>
                  <table style={{ width: '100%', fontSize: '1.2rem' }}>
                    <thead
                      style={{
                        border: '1px solid white',
                        backgroundColor: '#33CCFF',
                        color: 'white',
                      }}
                    >
                      <tr style={{ height: '80px' }}>
                        <th scope="col" style={cellStyle}>
                          等級
                        </th>
                        <th scope="col" style={cellStyle}>
                          第一級
                        </th>
                        <th scope="col" style={cellStyle}>
                          第二級
                        </th>
                        <th scope="col" style={cellStyle}>
                          第三級
                        </th>
                      </tr>
                      <tr>
                        <th scope="col" style={cellStyle}>
                          評分範圍
                        </th>
                        <th scope="col" style={cellStyle}>
                          X{' < '}10分
                        </th>
                        <th scope="col" style={cellStyle}>
                          10{' ≦ '}X{' < '}19分
                        </th>
                        <th scope="col" style={cellStyle}>
                          19{' ≦ '}X{' ≦ '}27分
                        </th>
                      </tr>
                    </thead>
                    <tbody style={{ border: '1px solid white', backgroundColor: '#CCEEFF' }}>
                      <tr>
                        <td
                          style={{
                            border: '1px solid white',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                            height: '40px',
                            width: '150px',
                          }}
                        >
                          <b>個數</b>
                        </td>
                        <td style={cellStyle}></td>
                        <td style={cellStyle}></td>
                        <td style={cellStyle}></td>
                      </tr>
                      <tr style={{ height: '80px' }}>
                        <td
                          style={{
                            border: '1px solid white',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                            height: '40px',
                            width: '70px',
                          }}
                        >
                          <b>
                            清冊等級
                            <br />
                            總平均分數
                          </b>
                        </td>
                        <td style={cellStyle}></td>
                        <td style={cellStyle}></td>
                        <td style={cellStyle}></td>
                      </tr>
                    </tbody>
                  </table>
                  <br />
                </CCardBody>
              </CCard> */}
              {/* <br></br> */}
              {/* 溫室氣體不確定性量化評估結果 */}
              {/* <CCard style={{ width: '100%' }}>
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
                      溫室氣體不確定性量化評估結果
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
                </CCardTitle>
                <CCardBody>
                  <table style={{ width: '100%', fontSize: '1.2rem' }}>
                    <thead
                      style={{
                        border: '1px solid white',
                        backgroundColor: '#33CCFF',
                        color: 'white',
                      }}
                    >
                      <tr style={{ height: '80px' }}>
                        <th scope="col" style={cellStyle}>
                          進行不確定性評估之排放量
                          <br />
                          絕對值加總
                        </th>
                        <th scope="col" style={cellStyle}>
                          排放總量絕對值加總
                        </th>
                        <th scope="col" style={cellStyle} rowSpan={2} colSpan={2}>
                          本清冊之總不確定性
                        </th>
                      </tr>
                      <tr style={{ border: '1px solid white', backgroundColor: '#CCEEFF' }}>
                        <td scope="col" style={cellStyle}></td>
                        <td scope="col" style={cellStyle}></td>
                      </tr>
                      <tr>
                        <th scope="col" style={cellStyle} colSpan={2}>
                          進行不確定性評估之排放量佔總排放量之比例
                        </th>
                        <th scope="col" style={cellStyle}>
                          95%信賴區間下限
                        </th>
                        <th scope="col" style={cellStyle}>
                          95%信賴區間上限
                        </th>
                      </tr>
                    </thead>
                    <tbody style={{ border: '1px solid white', backgroundColor: '#CCEEFF' }}>
                      <tr>
                        <td style={cellStyle} colSpan={2}></td>
                        <td style={cellStyle}></td>
                        <td style={cellStyle}></td>
                      </tr>
                    </tbody>
                  </table>
                  <br />
                </CCardBody>
              </CCard> */}
              <br></br>
              <br></br>
            </>
          )}

          {/* /*圖表呈現頁 */}
          {activeTab === 'tab2' && (
            <>
              <div className={styles.titleContainer}>
                <div className={styles.leftItem}>
                  <div>
                    <strong>{selectedYear}盤查報告</strong>
                  </div>
                  {/* <div>
                    <CFormSelect size="sm" className={styles.input}>
                      <option>全部圖形</option>
                      <option value="1">表1</option>
                      <option value="2">表2</option>
                      <option value="3">表3</option>
                    </CFormSelect>
                  </div> */}
                </div>
                {/* <div className={styles.rightItem}>
                  <button>
                    <CIcon icon={cilDataTransferDown} className="me-2" />
                    下載全部
                  </button>
                </div> */}
              </div>

              <CRow>
                {/* 圓餅圖 */}
                <CCol xs={6}>
                  <CCard className="mb-4">
                    <CCardHeader
                      style={{
                        backgroundColor: '#9D6B6B',
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <strong
                        style={{
                          fontSize: '1.4rem',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '5px',
                        }}
                      >
                        碳排範疇比例 /{' '}
                      </strong>
                      <strong style={{ fontSize: '1.2rem', color: 'white', padding: '5px' }}>
                        圓餅圖
                      </strong>
                      {/* <CButton
                        style={{
                          position: 'absolute',
                          right: '10px',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <b>
                          <CIcon icon={cilDataTransferDown} style={{ fontSize: '24px' }} />
                        </b>
                      </CButton> */}
                    </CCardHeader>
                    <CCardBody
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                      }}
                    >
                      <div style={{ width: '350px', height: '350px' }}>
                        <CChartPie
                          data={{
                            labels: ['範疇一', '範疇二', '範疇三'],
                            datasets: [
                              {
                                data: [
                                  quantitativeInventory.category1_total_emission_equivalent,
                                  quantitativeInventory.category2_total_emission_equivalent,
                                  0,
                                ],
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
                              color: 'black', // 設定標籤顏色
                              font: {
                                weight: 'bold', // 設定字體粗細
                              },
                              formatter: (value) => `${value}%`, // 顯示百分比或其他格式
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
                    <CCardHeader
                      style={{
                        backgroundColor: '#9D6B6B',
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <strong
                        style={{
                          fontSize: '1.4rem',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '5px',
                        }}
                      >
                        碳排總量/{' '}
                      </strong>
                      <strong style={{ fontSize: '1.2rem', color: 'white', padding: '5px' }}>
                        半圓環形圖
                      </strong>
                      {/* 
                      <CButton
                        style={{
                          position: 'absolute',
                          right: '10px',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <b>
                          <CIcon icon={cilDataTransferDown} style={{ fontSize: '24px' }} />
                        </b>
                      </CButton> */}
                    </CCardHeader>
                    <CCardBody
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                      }}
                    >
                      <div
                        style={{
                          width: '350px',
                          height: '350px',
                          margin: '0 auto',
                          position: 'relative',
                        }}
                      >
                        <CChartDoughnut
                          data={{
                            datasets: [
                              {
                                backgroundColor: ['#d882c0', '#FFB3FF', '#FFB6C1'],
                                data: [
                                  quantitativeInventory.category1_total_emission_equivalent,
                                  quantitativeInventory.category2_total_emission_equivalent,
                                  0,
                                ],
                              },
                            ],
                          }}
                          options={{
                            rotation: -90,
                            circumference: 180,
                            cutout: '70%', // 中間空心的部分
                            plugins: {
                              legend: {
                                position: 'bottom', // 圖例位置
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
                          {(
                            quantitativeInventory.category1_total_emission_equivalent +
                            quantitativeInventory.category2_total_emission_equivalent
                          ).toFixed(5)}
                        </div>
                      </div>
                      {/* 自定義圖例 */}
                      <div style={{ marginTop: '10px', textAlign: 'center' }}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: '5px',
                          }}
                        >
                          <div
                            style={{
                              width: '20px',
                              height: '20px',
                              backgroundColor: '#d882c0',
                              marginRight: '10px',
                            }}
                          ></div>
                          <span>
                            範疇一 - {quantitativeInventory.category1_total_emission_equivalent} (
                            {quantitativeInventory.category1_total_emission_equivalent +
                            quantitativeInventory.category2_total_emission_equivalent
                              ? (
                                  (quantitativeInventory.category1_total_emission_equivalent /
                                    (quantitativeInventory.category1_total_emission_equivalent +
                                      quantitativeInventory.category2_total_emission_equivalent)) *
                                  100
                                ).toFixed(2) + '%'
                              : '-'}
                            )
                          </span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: '5px',
                          }}
                        >
                          <div
                            style={{
                              width: '20px',
                              height: '20px',
                              backgroundColor: '#FFB3FF',
                              marginRight: '10px',
                            }}
                          ></div>
                          <span>
                            範疇二 - {quantitativeInventory.category2_total_emission_equivalent} (
                            {quantitativeInventory.category1_total_emission_equivalent +
                            quantitativeInventory.category2_total_emission_equivalent
                              ? (
                                  (quantitativeInventory.category2_total_emission_equivalent /
                                    (quantitativeInventory.category1_total_emission_equivalent +
                                      quantitativeInventory.category2_total_emission_equivalent)) *
                                  100
                                ).toFixed(2) + '%'
                              : '-'}
                            )
                          </span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <div
                            style={{
                              width: '20px',
                              height: '20px',
                              backgroundColor: '#FFB6C1',
                              marginRight: '10px',
                            }}
                          ></div>
                          <span>範疇三 - 0 (0%)</span>
                        </div>
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>
                {/* 柱狀圖 */}
                <CCol xs={6}>
                  <CCard className="mb-4">
                    <CCardHeader
                      style={{
                        backgroundColor: '#9D6B6B',
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <strong
                        style={{
                          fontSize: '1.4rem',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '5px',
                        }}
                      >
                        碳排總量 /{' '}
                      </strong>
                      <strong style={{ fontSize: '1.2rem', color: 'white', padding: '5px' }}>
                        柱狀圖
                      </strong>
                      {/* <CButton
                        style={{
                          position: 'absolute',
                          right: '10px',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <b>
                          <CIcon icon={cilDataTransferDown} style={{ fontSize: '24px' }} />
                        </b>
                      </CButton> */}
                    </CCardHeader>
                    <CCardBody
                      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                      <div style={{ width: '350px', height: '350px' }}>
                        <CChartBar
                          data={{
                            labels: ['範疇一', '範疇二', '範疇三'],
                            datasets: [
                              {
                                backgroundColor: ['#d882c0', '#FFB3FF', '#FFB6C1'],
                                data: [
                                  quantitativeInventory.category1_total_emission_equivalent,
                                  quantitativeInventory.category2_total_emission_equivalent,
                                  0,
                                ],
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
                                  return value.toFixed(2) // 格式化數值顯示，保留兩位小數
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
                        />
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>
                {/* 環形圖 */}
                <CCol xs={6}>
                  <CCard className="mb-4">
                    <CCardHeader
                      style={{
                        backgroundColor: '#9D6B6B',
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <strong
                        style={{
                          fontSize: '1.4rem',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '5px',
                        }}
                      >
                        碳排範疇比例 /{' '}
                      </strong>
                      <strong style={{ fontSize: '1.2rem', color: 'white', padding: '5px' }}>
                        環形圖
                      </strong>
                      {/* <CButton
                        style={{
                          position: 'absolute',
                          right: '10px',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <b>
                          <CIcon icon={cilDataTransferDown} style={{ fontSize: '24px' }} />
                        </b>
                      </CButton> */}
                    </CCardHeader>
                    <CCardBody
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                      }}
                    >
                      <div style={{ width: '350px', height: '350px' }}>
                        <CChartDoughnut
                          data={{
                            labels: ['範疇一', '範疇二', '範疇三'],
                            datasets: [
                              {
                                backgroundColor: ['#d882c0', '#FFB3FF', '#FFB6C1'],
                                data: [
                                  quantitativeInventory.category1_total_emission_equivalent,
                                  quantitativeInventory.category2_total_emission_equivalent,
                                  0,
                                ],
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
                                  const total = context.chart.data.datasets[0].data.reduce(
                                    (acc, val) => acc + val,
                                    0,
                                  )
                                  const percentage = ((value / total) * 100).toFixed(1) + '%'
                                  return percentage
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
