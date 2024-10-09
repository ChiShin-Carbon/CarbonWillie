import React, { useState } from 'react';
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
import '../../../scss/個人&企業資料.css';
import styles from  '../../../scss/首頁.module.css';
import { MultiSelect } from 'primereact/multiselect'; // Import PrimeReact MultiSelect
import 'primereact/resources/themes/saga-blue/theme.css'; // PrimeReact CSS (如果還沒引入)
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';




const Charts = () => {
    const random = () => Math.round(Math.random() * 100)
    const [selectedCities, setSelectedCities] = useState(null);
    const username = window.sessionStorage.getItem('username');


    // 定義年分數據
    const years = [
        { name: '2024', code: 'yy2024' },
        { name: '2023', code: 'yy2023' },
        { name: '2022', code: 'yy2022' },
        { name: '2021', code: 'yy2021' },
        { name: '2020', code: 'yy2020' }
    ];

    return (
        <CRow>
            <div className={styles.systemTablist}>
                <div className={styles.tabsContainer}>
                    <div className={styles.tabsLeft}>
                        <span>歡迎回來 {username}</span>
                    </div>
                    <div className={styles.buttonRight}>
                        <button>開始盤查</button>
                    </div>
                </div>
            </div>

            {/*碳排分析*/}
            <div className="customCardHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h5><strong>碳排放分析</strong></h5>
                <CFormInput type="number" min='2020' defaultValue='2024' style={{ width: '20%', height: '38px', fontSize: '0.875rem' }} required />
            </div>

            <div><br /></div>
            <CCol sm={3}>
                <CCard className="mb-4 customCard h-80">
                    <CCardBody>
                        {/*這裡未登入=>*/}
                        <strong>
                            <div style={{ height: '420px', fontWeight: 900 }}>
                                <h2 style={{ fontWeight: 900 }}>說明</h2>
                                <h5 style={{ fontWeight: 900 }}>碳盤查是評估組織或活動所產生的溫室氣體排放量的系統性過程，旨在識別主要碳排放來源並支持制定有效的減排策略</h5>
                            </div></strong>
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
                                <CCard className="mb-4 customCard" >
                                    <CCardBody className={styles.CFVAnalyze1}>
                                        固定燃燒排放源
                                    </CCardBody>
                                </CCard>
                            </CCol>
                            <CCol sm={5}>
                                <CCard className="mb-4 customCard">
                                    <CCardBody className={styles.CFVAnalyze2} >
                                        藉由燃燒化石燃料產生熱或蒸汽之固定式設備，如：緊急發電機。
                                    </CCardBody>
                                </CCard>
                            </CCol>

                            <CCol sm={3}>
                                <CCard className="mb-4 customCard">
                                    <CCardBody className={styles.CFVAnalyze2}>
                                        CO2, CH4, N2O
                                    </CCardBody>
                                </CCard>
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol sm={3}>
                                <CCard className="mb-4 customCard" >
                                    <CCardBody className={styles.CFVAnalyze1}>
                                        移動燃燒排放源
                                    </CCardBody>
                                </CCard>
                            </CCol>

                            <CCol sm={5}>
                                <CCard className="mb-4 customCard">
                                    <CCardBody className={styles.CFVAnalyze2}>
                                        使用化石燃料之運輸設備，<br />
                                        如：公務用汽機車等。
                                    </CCardBody>
                                </CCard>
                            </CCol>

                            <CCol sm={3}>
                                <CCard className="mb-4 customCard">
                                    <CCardBody className={styles.CFVAnalyze2}>
                                        CO2, CH4, N2O
                                    </CCardBody>
                                </CCard>
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol sm={3}>
                                <CCard className="mb-4 customCard" >
                                    <CCardBody className={styles.CFVAnalyze1}>
                                        逸散排放源
                                    </CCardBody>
                                </CCard>
                            </CCol>

                            <CCol sm={5}>
                                <CCard className="mb-4 customCard">
                                    <CCardBody className={styles.CFVAnalyze2}>
                                        以逸散方式排放溫室氣體之設備或設施，<br />
                                        如冷卻系統(冷媒逸散)、廢水處理等設施(甲烷逸散)
                                    </CCardBody>
                                </CCard>
                            </CCol>

                            <CCol sm={3}>
                                <CCard className="mb-4 customCard">
                                    <CCardBody className={styles.CFVAnalyze2}>
                                        CO2, CH4, N2O,<br />
                                        HFCs,PFCs, SF6
                                    </CCardBody>
                                </CCard>
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol sm={3}>
                                <CCard className="mb-4 customCard" >
                                    <CCardBody className={styles.CFVAnalyze1}>
                                        外購電力或蒸氣<br />
                                        之能源間接排放
                                    </CCardBody>
                                </CCard>
                            </CCol>

                            <CCol sm={5}>
                                <CCard className="mb-4 customCard">
                                    <CCardBody className={styles.CFVAnalyze2}>
                                        使用外購能源(電力或蒸汽)之設備，<br />
                                        如空調設備、照明設備等。
                                    </CCardBody>
                                </CCard>
                            </CCol>

                            <CCol sm={3}>
                                <CCard className="mb-4 customCard">
                                    <CCardBody className={styles.CFVAnalyze2}>
                                        CO2, CH4, N2O
                                    </CCardBody>
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
            {/*碳排詳情*/}
            <div><br /></div>
            <div className="customCardHeader"><h5><strong>碳排放詳情</strong></h5>
            </div>
            <div><br /></div>
            <CCol xs={12}>
                <CTabs activeItemKey={1}>
                    <CTabList variant="underline-border" className="custom-tablist" style={{ backgroundColor: 'white' }}>
                        <CTab aria-controls="tab1" itemKey={1} className="custom-tablist-choose">
                            總量
                        </CTab>
                        <CTab aria-controls="tab2" itemKey={2} className="custom-tablist-choose">
                            範疇一
                        </CTab>
                        <CTab aria-controls="tab3" itemKey={3} className="custom-tablist-choose">
                            範疇二
                        </CTab>
                        <CTab aria-controls="tab3" itemKey={4} className="custom-tablist-choose">
                            範疇三
                        </CTab>
                    </CTabList>
                    <CTabContent>
                        <CTabPanel className="py-3" aria-labelledby="home-tab-pane" itemKey={1}>
                            <CRow>
                                <CCol sm={3}>
                                    <CCol sm={12}>
                                        <CCard className="mb-4 customCard">
                                            <CCardBody>
                                                <div >
                                                    <strong>碳排總量&nbsp;&nbsp;
                                                        <span style={{ fontSize: '0.8rem', color: 'gray' }}>/CO2e</span>
                                                        <br />
                                                        {/*
                                                        <div className="customCardBody"  style={{ textAlign: 'center', color: 'gray' }}>
                                                            暫無資料!
                                                        </div>
                                                        */}
                                                        <h3 style={{ fontWeight: 900 }}>725.29</h3>
                                                        <span style={{ fontSize: '0.8rem', color: 'gray' }}>去年826.21</span>
                                                    </strong>
                                                </div>
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                    <CCol sm={12}>
                                        <CCard className="mb-4 customCard">
                                            <CCardBody >
                                                <div style={{ height: '300px' }}>
                                                    {/*無資料 
                                                    <strong>各設備比例&nbsp;&nbsp;
                                                        <br /><br /><br /><br /><br />
                                                        <div className="customCardBody"  style={{ textAlign: 'center', color: 'gray' }}>
                                                            暫無資料!
                                                        </div>
                                                    </strong>
                                                    結束*/}
                                                    {/**有資料=> */}
                                                    <strong>各設備比例</strong>
                                                    <CChartDoughnut
                                                        data={{

                                                            datasets: [
                                                                {
                                                                    backgroundColor: ['#FFF48F', '#E46651', '#AADCB8', '#C2DFF4'],
                                                                    data: [40, 20, 80, 10],
                                                                },
                                                            ],
                                                        }}
                                                    />
                                                    {/**結束*/}
                                                </div>
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                </CCol>

                                {/* 右侧 3/4 宽度 */}
                                <CCol sm={9}>
                                    <CCard className="mb-4 customCard">
                                        <CCardHeader style={{ height: '480px' }}>
                                            <div className="d-flex align-items-center">
                                                <strong className="me-3">趨勢分析 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>
                                                <CFormSelect
                                                    size="sm"
                                                    style={{
                                                        width: '30%',
                                                        marginRight: '10px',
                                                        height: '38px',  // 調整高度
                                                        fontSize: '0.875rem' // 調整字體大小
                                                    }}
                                                >
                                                    <option>碳排總量</option>
                                                    <option value="1">表1</option>
                                                    <option value="2">表2</option>
                                                    <option value="3">表3</option>
                                                </CFormSelect>

                                                <MultiSelect
                                                    value={selectedCities}
                                                    onChange={(e) => setSelectedCities(e.value)}
                                                    options={years}
                                                    optionLabel="name"
                                                    display="chip"
                                                    placeholder="年分"
                                                    maxSelectedLabels={3}
                                                    className="w-full"
                                                    style={{
                                                        width: '50%',
                                                        height: '38px',  // 調整高度
                                                        fontSize: '0.875rem' // 調整字體大小
                                                    }}
                                                />
                                            </div>
                                            {/*無資料
                                            <br/><br/><br/><br/><br/><br/><br/>
                                            <strong>
                                                <div className="customCardBody"  style={{ textAlign: 'center', color: 'gray' }}>
                                                    暫無資料!
                                                </div>
                                            </strong>
                                            無資料結束*/}
                                            {/*有資料*/}
                                            <CChartLine style={{ height: '430px' }}
                                                data={{
                                                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                                                    datasets: [
                                                        {
                                                            label: 'My First dataset',
                                                            backgroundColor: 'rgba(220, 220, 220, 0.2)',
                                                            borderColor: 'rgba(220, 220, 220, 1)',
                                                            pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                                                            pointBorderColor: '#fff',
                                                            data: [random(), random(), random(), random(), random(), random(), random()],
                                                        },
                                                        {
                                                            label: 'My Second dataset',
                                                            backgroundColor: 'rgba(151, 187, 205, 0.2)',
                                                            borderColor: 'rgba(151, 187, 205, 1)',
                                                            pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                                                            pointBorderColor: '#fff',
                                                            data: [random(), random(), random(), random(), random(), random(), random()],
                                                        },
                                                    ],
                                                }}
                                            />
                                            {/*有資料結束*/}
                                        </CCardHeader>
                                    </CCard>
                                </CCol>
                            </CRow>
                        </CTabPanel>

                        <CTabPanel className="py-3" aria-labelledby="profile-tab-pane" itemKey={2}>
                            <CRow>
                                <CCol sm={3}>
                                    <CCol sm={12}>
                                        <CCard className="mb-4 customCard">
                                            <CCardBody>
                                                <div>
                                                    <strong>範疇一總量&nbsp;&nbsp;
                                                        <span style={{ fontSize: '0.8rem', color: 'gray' }}>/CO2e</span>
                                                        {/* 無資料=>
                                                        <div className="customCardBody"  style={{ textAlign: 'center', color: 'gray' }}>
                                                            暫無資料!
                                                        </div>
                                                        無資料結束*/}

                                                        {/*有資料=>*/}
                                                        <h3 style={{ fontWeight: 900 }}>485.52</h3>
                                                        <span style={{ fontSize: '0.8rem', color: 'gray' }}>去年356.14</span>
                                                        {/*有資料結束*/}
                                                    </strong>
                                                </div>
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                    <CCol sm={12}>
                                        <CCard className="mb-4 customCard">
                                            <CCardBody >
                                                <div style={{ height: '300px' }}>
                                                    <strong >各設備比例
                                                        <CChartPie
                                                            data={{
                                                                labels: ['Red', 'Green', 'Yellow'],
                                                                datasets: [
                                                                    {
                                                                        data: [300, 50, 100],
                                                                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                                                                        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                                                                    },
                                                                ],
                                                            }}
                                                        />
                                                    </strong>
                                                </div>
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                </CCol>

                                {/* 右侧 3/4 宽度 */}
                                <CCol sm={9}>
                                    <CCard className="mb-4 customCard">
                                        <CCardHeader>
                                            <div>
                                                <strong className="me-3">各設備分布 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>
                                            </div>
                                            <CChartBar
                                                data={{
                                                    labels: ['1', '2', '3', '4'],
                                                    datasets: [
                                                        {
                                                            label: 'GitHub Commits',
                                                            backgroundColor: ['#FDFF9A', '#E78080', '#A4A3DE', '#83EDD3'],
                                                            data: [80, 50, 12, 39],
                                                        },
                                                    ],
                                                }}
                                                labels="months"
                                            />
                                        </CCardHeader>
                                    </CCard>
                                </CCol>
                            </CRow>
                        </CTabPanel>

                        <CTabPanel className="py-3" aria-labelledby="contact-tab-pane" itemKey={3}>
                            <CRow>
                                <CCol sm={3}>
                                    <CCol sm={12}>
                                        <CCard className="mb-4 customCard">
                                            <CCardBody>
                                                <div>
                                                    <strong>範疇二總量&nbsp;&nbsp;
                                                        <span style={{ fontSize: '0.8rem', color: 'gray' }}>/CO2e</span>
                                                        {/*無資料=>
                                                        <div className="customCardBody"  style={{ textAlign: 'center', color: 'gray' }}>
                                                                暫無資料!
                                                        </div>
                                                        無資料結束*/}
                                                        {/*有資料*/}
                                                        <h3 style={{ fontWeight: 900 }}>485.52</h3>
                                                        <span style={{ fontSize: '0.8rem', color: 'gray' }}>去年356.14</span>
                                                        {/*有資料結束*/}
                                                    </strong>
                                                </div>
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                    <CCol sm={12}>
                                        <CCard className="mb-4 customCard">
                                            <CCardBody >
                                                <div style={{ height: '300px' }}>
                                                    <strong >各設備比例
                                                        <CChartPie
                                                            data={{
                                                                labels: ['Red', 'Green', 'Yellow'],
                                                                datasets: [
                                                                    {
                                                                        data: [300, 50, 100],
                                                                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                                                                        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                                                                    },
                                                                ],
                                                            }}
                                                        />
                                                    </strong>
                                                </div>
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                </CCol>

                                {/* 右侧 3/4 宽度 */}
                                <CCol sm={9}>
                                    <CCard className="mb-4 customCard">
                                        <CCardHeader>
                                            <div className="d-flex align-items-center">
                                                <strong className="me-3">各設備分布 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>
                                            </div>
                                            <CChartBar
                                                data={{
                                                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                                                    datasets: [
                                                        {
                                                            label: 'Dataset Label', // 單一標籤而不是陣列
                                                            backgroundColor: ['#EB3737', '#948AD3', '#EBCCD9', '#37EB7F', '#FFF48F', '#FF8833', '#931B4E'],
                                                            data: [40, 20, 12, 39, 10, 40, 39, 80, 40],
                                                        },
                                                    ],
                                                }}
                                                options={{
                                                    scales: {
                                                        xAxes: [
                                                            {
                                                                ticks: {
                                                                    beginAtZero: true,
                                                                    callback: function (value, index, values) {
                                                                        return value; // 保持數字水平顯示
                                                                    },
                                                                },
                                                            },
                                                        ],
                                                    },
                                                }}
                                                labels="months"
                                            />
                                        </CCardHeader>
                                    </CCard>
                                </CCol>
                            </CRow>
                        </CTabPanel>

                        <CTabPanel className="py-3" aria-labelledby="contact-tab-pane" itemKey={4}>
                            <CRow>
                                <CCol sm={3}>
                                    <CCol sm={12}>
                                        <CCard className="mb-4 customCard">
                                            <CCardBody>
                                                <div>
                                                    <strong>範疇三總量&nbsp;&nbsp;
                                                        <span style={{ fontSize: '0.8rem', color: 'gray' }}>/CO2e</span>
                                                        {/*無資料=>*/}
                                                        <br /><br />
                                                        <div style={{ textAlign: 'center', color: 'gray' }}>
                                                            暫無資料!
                                                        </div>
                                                        <br />
                                                        {/*無資料結束*/}
                                                        {/*有資料=>
                                                        <h3 style={{ fontWeight: 900 }}>0</h3>
                                                        <span style={{ fontSize: '0.8rem', color: 'gray'}}>去年0</span>
                                                        有資料結束*/}
                                                    </strong>
                                                </div>
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                    <CCol sm={12}>
                                        <CCard className="mb-4 customCard">
                                            <CCardBody >
                                                <div style={{ height: '295px' }}>
                                                    <strong >各設備比例<br /><br /><br /><br /><br />
                                                        <div className="customCardBody" style={{ textAlign: 'center', color: 'gray' }}>暫無資料!</div>
                                                    </strong>
                                                </div>
                                            </CCardBody>
                                            {/*
                                            <CCardBody >
                                                <div style={{height:'300px'}}>
                                                    <strong >各設備比例
                                                        <CChartPie
                                                        data={{
                                                            labels: ['Red', 'Green', 'Yellow'],
                                                            datasets: [
                                                            {
                                                                data: [300, 50, 100],
                                                                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                                                                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                                                            },
                                                            ],
                                                        }}
                                                        />
                                                    </strong>
                                                </div>
                                            </CCardBody> 
                                            */}
                                        </CCard>
                                        {/*
                                            <div className="customCardBody" style={{ textAlign: 'center' }}>暫無資料!</div>
                                        */}
                                    </CCol>
                                </CCol>

                                {/* 右侧 3/4 宽度 */}
                                <CCol sm={9}>
                                    {/**/}
                                    <CCard className="mb-4 customCard">
                                        <CCardHeader style={{ height: '480px' }}>
                                            <div className="d-flex align-items-center">
                                                <strong className="me-3">各設備分布 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>
                                            </div><br /><br /><br /><br /><br /><br /><br />
                                            <div className="customCardBody" style={{ textAlign: 'center', color: 'gray' }}>暫無資料!</div>
                                        </CCardHeader>
                                        {/* 
                                        <CCardHeader>
                                            <div className="d-flex align-items-center">
                                                <strong className="me-3">各設備分布 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>
                                            </div>
                                            <CChartBar
                                                data={{
                                                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                                                    datasets: [
                                                    {
                                                        label: 'GitHub Commits',
                                                        backgroundColor: '#f87979',
                                                        data: [40, 20, 12, 39, 10, 40, 39, 80, 40],
                                                    },
                                                    ],
                                                }}
                                                labels="months"
                                            /> 
                                        </CCardHeader>
                                        */}
                                    </CCard>
                                </CCol>
                            </CRow>
                        </CTabPanel>
                    </CTabContent>
                </CTabs>
            </CCol>
        </CRow >
    )
}

export default Charts