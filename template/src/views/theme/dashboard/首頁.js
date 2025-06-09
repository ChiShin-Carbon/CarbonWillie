import React, { useState, useEffect } from 'react'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CTab,
  CTabContent,
  CTabList,
  CTabPanel,
  CTabs,
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CFormSelect,
  CAlert,
} from '@coreui/react'
import {
  CChartBar,
  CChartDoughnut,
  CChartLine,
  CChartPie,
  CChartPolarArea,
  CChartRadar,
} from '@coreui/react-chartjs'
import '../../../scss/個人&企業資料.css'
import styles from '../../../scss/首頁.module.css'
import { MultiSelect } from 'primereact/multiselect' // Import PrimeReact MultiSelect
import 'primereact/resources/themes/saga-blue/theme.css' // PrimeReact CSS (如果還沒引入)
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'

const Charts = () => {
  const random = () => Math.round(Math.random() * 100)
  const [selectedCities, setSelectedCities] = useState(null)
  const username = window.sessionStorage.getItem('username')

  // 定義年分數據
  const years = [
    { name: '2024', code: 'yy2024' },
    { name: '2023', code: 'yy2023' },
    { name: '2022', code: 'yy2022' },
    { name: '2021', code: 'yy2021' },
    { name: '2020', code: 'yy2020' },
  ]

  const [availableYears, setAvailableYears] = useState([])
  const [prevYearQuantitativeInventory, setPrevYearQuantitativeInventory] = useState({})
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

        // 如果是第一次載入（year 沒有傳入）
        if (!year && data.result.Available_Years.length > 1) {
          const previousYear = data.result.Available_Years[1]
          // 取得上一年度的資料
          const prevRes = await fetch(`http://localhost:8000/result?year=${previousYear}`)
          if (prevRes.ok) {
            const prevData = await prevRes.json()
            setPrevYearQuantitativeInventory(prevData.result.Quantitative_Inventory)
          }
        }
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
        <div className={styles.tabsContainer}>
          <div className={styles.tabsLeft}>
            <span>歡迎回來 {username}</span>
          </div>
          {/* <div className={styles.buttonRight}>
                        <button>開始盤查</button>
                    </div> */}
        </div>
      </div>

      {/*碳排分析*/}
      <div
        className="customCardHeader"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <h5>
          <strong>碳排放分析</strong>
        </h5>
        {/* <CFormInput
          type="number"
          min="2020"
          defaultValue="2024"
          style={{ width: '20%', height: '38px', fontSize: '0.875rem' }}
          required
        /> */}
      </div>

      <div>
        <br />
      </div>
      <CCol sm={3}>
        <CCard className="mb-4 customCard h-80">
          <CCardBody>
            {/*這裡未登入=>*/}
            <strong>
              <div style={{ height: '280px', fontWeight: 900 }}>
                <h2 style={{ fontWeight: 900 }}>說明</h2>
                <h5 style={{ fontWeight: 900 }}>
                  碳盤查是評估組織或活動所產生的溫室氣體排放量的系統性過程，旨在識別主要碳排放來源並支持制定有效的減排策略
                </h5>
              </div>
            </strong>
            {/*結束*/}
            {/* 已登入
                        <div  style={{height: '420px',fontWeight: 900}}>
                        <strong>碳排總量&nbsp;&nbsp;
                        <span style={{ fontSize: '0.8rem', color: 'gray'}}>/CO2e</span>
                        <br />
                        <h2 style={{ fontWeight: 900 }}>725.29</h2>
                        <br />
                        範疇一&nbsp;&nbsp;
                        <span style={{ fontSize: '0.8rem', color: 'gray'}}>/CO2e</span>
                        <br />
                        <h3 style={{ fontWeight: 900 }}>435.85</h3>
                        <br />
                        範疇二&nbsp;&nbsp;
                        <span style={{ fontSize: '0.8rem', color: 'gray'}}>/CO2e</span>
                        <br />
                        <h3 style={{ fontWeight: 900 }}>249.25</h3>
                        <br />
                        範疇三&nbsp;&nbsp;
                        <span style={{ fontSize: '0.8rem', color: 'gray'}}>/CO2e</span>
                        <br />
                        <h3 style={{ fontWeight: 900 }}>100.14</h3>
                        <br /><br />
                        </strong>
                        </div> 
                        結束*/}
          </CCardBody>
        </CCard>

        <CCard className="mb-4 customCard">
          <CCardBody>
            <div>
              <strong>
                碳排總量&nbsp;&nbsp;
                <span style={{ fontSize: '0.8rem', color: 'gray' }}>/CO2e</span>
                <br />
                <h3 style={{ fontWeight: 900 }}>
                  {quantitativeInventory.total_emission_equivalent ?? '尚無資料'}
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'gray' }}>
                  上一年度碳盤查 {prevYearQuantitativeInventory.total_emission_equivalent ?? '0'}
                </span>
              </strong>
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      {/* 右侧 3/4 宽度 */}
      <CCol sm={9}>
        {/**/}
        <CCard className="mb-4 customCard h-80">
          <CCardBody>
            {/*這裡未登入=>*/}
            <h2 style={{ fontWeight: 900 }}>常見溫室氣體排放源</h2>
            <CRow>
              <CCol sm={3}>
                <CCard className="mb-4 customCard">
                  <CCardBody className={styles.CFVAnalyze1}>固定燃燒排放源</CCardBody>
                </CCard>
              </CCol>
              <CCol sm={5}>
                <CCard className="mb-4 customCard">
                  <CCardBody className={styles.CFVAnalyze2}>
                    藉由燃燒化石燃料產生熱或蒸汽之固定式設備，如：緊急發電機。
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol sm={3}>
                <CCard className="mb-4 customCard">
                  <CCardBody className={styles.CFVAnalyze2}>CO2, CH4, N2O</CCardBody>
                </CCard>
              </CCol>
            </CRow>
            <CRow>
              <CCol sm={3}>
                <CCard className="mb-4 customCard">
                  <CCardBody className={styles.CFVAnalyze1}>移動燃燒排放源</CCardBody>
                </CCard>
              </CCol>

              <CCol sm={5}>
                <CCard className="mb-4 customCard">
                  <CCardBody className={styles.CFVAnalyze2}>
                    使用化石燃料之運輸設備，
                    <br />
                    如：公務用汽機車等。
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol sm={3}>
                <CCard className="mb-4 customCard">
                  <CCardBody className={styles.CFVAnalyze2}>CO2, CH4, N2O</CCardBody>
                </CCard>
              </CCol>
            </CRow>
            <CRow>
              <CCol sm={3}>
                <CCard className="mb-4 customCard">
                  <CCardBody className={styles.CFVAnalyze1}>逸散排放源</CCardBody>
                </CCard>
              </CCol>

              <CCol sm={5}>
                <CCard className="mb-4 customCard">
                  <CCardBody className={styles.CFVAnalyze2}>
                    以逸散方式排放溫室氣體之設備或設施，
                    <br />
                    如冷卻系統(冷媒逸散)、廢水處理等設施(甲烷逸散)
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol sm={3}>
                <CCard className="mb-4 customCard">
                  <CCardBody className={styles.CFVAnalyze2}>
                    CO2, CH4, N2O,
                    <br />
                    HFCs,PFCs, SF6
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
            <CRow>
              <CCol sm={3}>
                <CCard className="mb-4 customCard">
                  <CCardBody className={styles.CFVAnalyze1}>
                    外購電力或蒸氣
                    <br />
                    之能源間接排放
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol sm={5}>
                <CCard className="mb-4 customCard">
                  <CCardBody className={styles.CFVAnalyze2}>
                    使用外購能源(電力或蒸汽)之設備，
                    <br />
                    如空調設備、照明設備等。
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol sm={3}>
                <CCard className="mb-4 customCard">
                  <CCardBody className={styles.CFVAnalyze2}>CO2, CH4, N2O</CCardBody>
                </CCard>
              </CCol>
            </CRow>
            {/*結束2*/}
            {/*已登入
                        <div style={{height: '20px' }}>
                            <strong>排放源</strong>
                        </div>
                        <div style={{width:'90%', height: '400px' }}>
                            <CChartBar
                                data={{
                                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                                    datasets: [
                                        {
                                            label: 'GitHub Commits',
                                            backgroundColor: [
                                                '#f87979',
                                                '#82E0AA',
                                                '#F4D03F',
                                                '#f87979',
                                                '#82E0AA',
                                                '#F4D03F',
                                                '#f87979',
                                            ],
                                            data: [40, 20, 12, 39, 10, 40, 39],
                                        },
                                    ],
                                }}
                                options={{
                                    indexAxis: 'y',
                                    scales: {
                                        x: {
                                            beginAtZero: true,
                                        },
                                    },
                                    plugins: {
                                        datalabels: {
                                            anchor: 'end',
                                            align: 'end',
                                            color: 'white',
                                            font: {
                                                size: 12,
                                            },
                                        },
                                        legend: {
                                            display: false, // 隱藏圖例
                                        },
                                    },
                                }}
                                labels="months"
                            />
                        </div>
                        結束*/}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Charts
