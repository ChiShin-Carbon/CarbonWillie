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
import { MultiSelect } from 'primereact/multiselect'; // Import PrimeReact MultiSelect
import 'primereact/resources/themes/saga-blue/theme.css'; // PrimeReact CSS (如果還沒引入)
import 'primereact/resources/primereact.min.css'; 
import 'primeicons/primeicons.css'; 
import { InputNumber } from 'primereact/inputnumber';


const Charts = () => {
    const random = () => Math.round(Math.random() * 100)
    const [selectedCities, setSelectedCities] = useState(null);

    // 定義年分數據
    const years = [
        { name: '2024', code: 'yy2024' },
        { name: '2023', code: 'yy2023' },
        { name: '2022', code: 'yy2022' },
        { name: '2021', code: 'yy2021' },
        { name: '2020', code: 'yy2020' }
    ];

    //年份選擇(+-)
    const [value3, setValue3] = useState(2024);

    return (
        <CRow>
            <div className="customCardHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h5><strong>碳排放分析</strong></h5>
                <InputNumber 
                    inputId="minmax-buttons" 
                    value={value3} 
                    onValueChange={(e) => setValue3(e.value)}
                    useGrouping={false}  
                    showButtons 
                    min={2000} 
                    max={2050} 
                    style={{ 
                    width: '20%', 
                    height: '38px',  // 調整高度
                    fontSize: '0.875rem' // 調整字體大小
                    }}
                />
            </div>

            <div><br /></div>
            
                <CCol sm={3}>
                    <CCard className="mb-4 customCard">
                    <CCardBody className="customCard2">
                        <div className="customCardHeader">
                        <strong>碳排總量&nbsp;&nbsp;
                        <span style={{ fontSize: '0.8rem', color: 'gray'}}>/CO2e</span>
                        <br />
                        <h2>725.29</h2>
                        <br />                    
                        範疇一&nbsp;&nbsp;
                        <span style={{ fontSize: '0.8rem', color: 'gray'}}>/CO2e</span>
                        <br />
                        <h3>435.85</h3>
                        <br />
                        範疇二&nbsp;&nbsp;
                        <span style={{ fontSize: '0.8rem', color: 'gray'}}>/CO2e</span>
                        <br />
                        <h3>249.25</h3>
                        <br />
                        範疇三&nbsp;&nbsp;
                        <span style={{ fontSize: '0.8rem', color: 'gray'}}>/CO2e</span>
                        <br />
                        <h3>100.14</h3>
                        <br />
                        </strong>                    
                        </div>
                    </CCardBody>
                    </CCard>
                </CCol>

                {/* 右侧 3/4 宽度 */}
                <CCol sm={9}>
                    {/**/}
                    <CCard className="mb-4 customCard">                                
                        
                        <CCardBody>
                            <div>
                            <strong>排放源</strong>
                            </div>
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
                            </CCardBody>                                
                    </CCard>
                </CCol>
            <div><br /></div>
            <div className="customCardHeader"><h5><strong>碳排放詳情</strong></h5>
            </div>
            <div><br /></div>
            <CCol xs={12}>                
                <CTabs activeItemKey={1}>
                    <CTabList variant="underline-border" className="custom-tablist">
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
                                    <CCardBody className="customCard2">
                                        <div className="customCardHeader">
                                        <strong>碳排總量&nbsp;&nbsp;
                                        <span style={{ fontSize: '0.8rem', color: 'gray'}}>/CO2e</span>
                                        <br /> 
                                        <h3>725.29</h3>  
                                        <span style={{ fontSize: '0.8rem', color: 'gray'}}>去年826.21</span>
                                        </strong>
                                        </div>
                                        {/*
                                        <div className="customCardBody"  style={{ textAlign: 'center' }}>
                                        暫無資料!
                                        </div>
                                        */}
                                    </CCardBody>
                                    </CCard>
                                    </CCol>
                                    <CCol sm={12}>
                                    <CCard className="mb-4 customCard">
                                    <CCardBody className="customCard2">
                                        <div className="customCardHeader">
                                            <strong>各設備比例</strong>
                                            <CChartDoughnut
                                            data={{
                                                labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
                                                datasets: [
                                                {
                                                    backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
                                                    data: [40, 20, 80, 10],
                                                },
                                                ],
                                            }}
                                            />
                                        </div>
                                    </CCardBody>
                                    </CCard>
                                    </CCol>
                                </CCol>

                                {/* 右侧 3/4 宽度 */}
                                <CCol sm={9}>
                                    {/**/}
                                    <CCard className="mb-4 customCard">                                
                                        <CCardHeader>
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
                                        </CCardHeader>
                                        <CCardBody>
                                            <CChartLine
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
                                        </CCardBody>                                    
                                    </CCard>
                                </CCol>
                            </CRow>
                        </CTabPanel>
                        <CTabPanel className="py-3" aria-labelledby="profile-tab-pane" itemKey={2}>                           
                            <CRow>
                                <CCol sm={3}>
                                    <CCol sm={12}>
                                        <CCard className="mb-4 customCard">
                                            <CCardBody className="customCard2">
                                            <div className="customCardHeader">
                                            <strong>碳排總量&nbsp;&nbsp;
                                            <span style={{ fontSize: '0.8rem', color: 'gray'}}>/CO2e</span>
                                            </strong>
                                            </div>
                                            <div className="customCardBody"  style={{ textAlign: 'center' }}>
                                            暫無資料!
                                            </div>
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                    <CCol sm={12}>
                                        <CCard className="mb-4 customCard">
                                            <CCardBody className="customCard2">
                                                <div className="customCardHeader">
                                                    <strong>各設備比例</strong>
                                                </div>
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
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                </CCol>

                                {/* 右侧 3/4 宽度 */}
                                <CCol sm={9}>
                                    <CCard className="mb-4 customCard">                                
                                        <CCardHeader>
                                            <div className="d-flex align-items-center">
                                                <strong className="me-3">趨勢分析 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>
                                                <CFormSelect size="sm" style={{ width: '30%', marginRight: '10px' }}>
                                                    <option>碳排總量</option>
                                                    <option value="1">表1</option>
                                                    <option value="2">表2</option>
                                                    <option value="3">表3</option>
                                                </CFormSelect>
                                                <CFormSelect size="sm" style={{ width: '45%' }}>
                                                    <option>年分</option>
                                                    <option value="1">表1</option>
                                                    <option value="2">表2</option>
                                                    <option value="3">表3</option>
                                                </CFormSelect>
                                            </div>
                                        </CCardHeader>
                                        <CCardBody>
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
                                        </CCardBody>                                    
                                    </CCard>
                                </CCol>
                            </CRow>
                        </CTabPanel>
                        <CTabPanel className="py-3" aria-labelledby="contact-tab-pane" itemKey={3}>
                            <CRow>
                                <CCol sm={3}>
                                    <CCol sm={12}>
                                        <CCard className="mb-4 customCard">
                                            <CCardBody className="customCard2">
                                                <div className="customCardHeader">
                                                    <strong>碳排總量&nbsp;&nbsp;
                                                        <span style={{ fontSize: '0.8rem', color: 'gray'}}>/CO2e</span>
                                                    </strong>
                                                </div>
                                                <div className="customCardBody"  style={{ textAlign: 'center' }}>暫無資料!</div>
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                    <CCol sm={12}>
                                        <CCard className="mb-4 customCard">
                                            <CCardBody className="customCard2">
                                                <div className="customCardHeader">
                                                    <strong>各設備比例</strong>
                                                </div>
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
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                </CCol>

                                {/* 右侧 3/4 宽度 */}
                                <CCol sm={9}>
                                    <CCard className="mb-4 customCard">                                
                                        <CCardHeader>
                                            <div className="d-flex align-items-center">
                                                <strong className="me-3">趨勢分析 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>
                                                <CFormSelect size="sm" style={{ width: '30%', marginRight: '10px' }}>
                                                    <option>碳排總量</option>
                                                    <option value="1">表1</option>
                                                    <option value="2">表2</option>
                                                    <option value="3">表3</option>
                                                </CFormSelect>
                                                <CFormSelect size="sm" style={{ width: '45%' }}>
                                                    <option>年分</option>
                                                    <option value="1">表1</option>
                                                    <option value="2">表2</option>
                                                    <option value="3">表3</option>
                                                </CFormSelect>
                                            </div>
                                        </CCardHeader>
                                        <CCardBody>
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
                                        </CCardBody>
                                    </CCard>
                                </CCol>
                            </CRow>
                        </CTabPanel>
                        <CTabPanel className="py-3" aria-labelledby="contact-tab-pane" itemKey={4}>
                            <CRow>
                                <CCol sm={3}>
                                    <CCol sm={12}>
                                        <CCard className="mb-4 customCard">
                                            <CCardBody className="customCard2">
                                                    <div className="customCardHeader">
                                                        <strong>碳排總量&nbsp;&nbsp;
                                                            <span style={{ fontSize: '0.8rem', color: 'gray'}}>/CO2e</span>
                                                        </strong>
                                                    </div>
                                                    <div className="customCardBody"  style={{ textAlign: 'center' }}> 暫無資料!</div>
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                    <CCol sm={12}>
                                        <CCard className="mb-4 customCard">
                                            <CCardBody className="customCard2">
                                                <div className="customCardHeader"><strong>各設備比例</strong></div>
                                                <div className="customCardBody" style={{ textAlign: 'center' }}>暫無資料!</div>
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                </CCol>

                                {/* 右侧 3/4 宽度 */}
                                <CCol sm={9}>
                                    {/**/}
                                    <CCard className="mb-4 customCard">                                
                                        <CCardHeader>
                                            <div className="d-flex align-items-center">
                                                <strong className="me-3">趨勢分析 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>
                                                <CFormSelect size="sm" style={{ width: '30%', marginRight: '10px' }}>
                                                    <option>碳排總量</option>
                                                    <option value="1">表1</option>
                                                    <option value="2">表2</option>
                                                    <option value="3">表3</option>
                                                </CFormSelect>
                                                <CFormSelect size="sm" style={{ width: '45%' }}>
                                                    <option>年分</option>
                                                    <option value="1">表1</option>
                                                    <option value="2">表2</option>
                                                    <option value="3">表3</option>
                                                </CFormSelect>
                                            </div>
                                        </CCardHeader>
                                        <CCardBody>
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
                                        </CCardBody>
                                    </CCard>
                                </CCol>
                            </CRow>
                        </CTabPanel>
                    </CTabContent>
                </CTabs>
            </CCol>
        </CRow>
    )
}

export default Charts