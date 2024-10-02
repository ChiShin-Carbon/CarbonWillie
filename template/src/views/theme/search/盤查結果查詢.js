import React,{useState} from 'react'
import {
    CRow, CCol, CCard, CCardBody, CCardHeader,CFormSelect, CNav, CNavItem, CNavLink, CForm, CFormLabel, CFormInput,
    CCardSubtitle,
    CCardText,
    CCardTitle, CButton,
    CTable,
    CTableBody,
    CTableCaption,
    CTableHead,
} from '@coreui/react'
import {
    CChartBar,
    CChartDoughnut,
    CChartLine,
    CChartPie,
    CChartPolarArea,
    CChartRadar,
  } from '@coreui/react-chartjs'
import { DocsCallout } from 'src/components'
import { DocsExample } from 'src/components'
import CIcon from '@coreui/icons-react'
import {
     cilDataTransferDown,
     cilDataTransferUp
 } from '@coreui/icons'
// import { freeSet } from '@coreui/icons'
// import { getIconsView } from '../brands/Brands.js'


const Tabs = () => {
    const random = () => Math.round(Math.random() * 100)
    const [activeTab, setActiveTab] = useState('tab1'); // 記錄當前活動的分頁
    const  cellStyle = {border: '1px solid white',textAlign: 'center'}; // table設定
    return (
        
        <CRow>
        <div style={{width:'100%',height:'50px', backgroundColor:'#D9D9D9',display: 'grid',alignItems: 'center',}}> 
            <CRow>
            <div style={{width:'250px',display: 'flex', justifyContent: 'left'}}>
            <strong style={{ fontSize: '1.0rem',display: 'flex', alignItems: 'center',padding:'5px'}}>
                選擇年分
            </strong>
                <CCol style={{justifyContent: 'left', alignItems: 'center',padding:'0'}}>
                <CFormSelect style={{width:'120px'}}>
                    <option>2025</option>
                    <option value="1">2024</option>
                    <option value="2">2023</option>
                    <option value="3">2022</option>
                </CFormSelect>
                </CCol>
            </div>
            <div style={{width:'300px',display: 'flex', justifyContent: 'left'}}>
            <strong style={{ fontSize: '1.0rem',display: 'flex', alignItems: 'center',padding:'5px'}}>
                選擇計畫
            </strong>
                <CCol style={{justifyContent: 'left', alignItems: 'center',padding:'0'}}>
                <CFormSelect style={{width:'180px'}}>
                    <option>xx2025盤查報告</option>
                    <option value="1">xx2024盤查報告</option>
                    <option value="2">xx2023盤查報告</option>
                    <option value="3">xx2022盤查報告</option>
                </CFormSelect>
                </CCol>
            </div>
            <CButton style={{position: 'absolute', right: '45px',width:'115px',backgroundColor:'#9D6B6B',color:'white',display: 'flex',alignItems: 'center' }} shape="rounded-pill">
                <CIcon style={{ display: 'flex'}} icon={cilDataTransferUp} className="me-2" />
                上傳檔案
            </CButton>
            </CRow>
        </div>
        <div style={{height:'10px'}}></div>
        <CCol xs={12}>
                    <CNav variant="tabs" className="card-header-tabs">
                        <CNavItem>
                        <CNavLink active={activeTab === 'tab1'}
                            onClick={() => setActiveTab('tab1')}>
                        表格呈現
                        </CNavLink>
                        </CNavItem><CNavItem>
                        <CNavLink active={activeTab === 'tab2'}
                                    onClick={() => setActiveTab('tab2')}>
                        圖形呈現
                        </CNavLink>
                        </CNavItem>
                    </CNav>
                <br/>
                {/* /*表格呈現頁 */}
                {activeTab === 'tab1' && (
                    <>
                        <div style={{width:'100%'}}>
                        <CRow verticalAlign='cnet'>
                        <strong style={{ fontSize: '1.2rem', borderBottom: '5px solid #d882c0',width: '14%'}}>xx2024盤查報告</strong>
                            <CCol>
                            <CFormSelect size="sm" className="mb-3" style={{width:'15%'}}>
                                <option>全部表格</option>
                                <option value="1">表1</option>
                                <option value="2">表2</option>
                                <option value="3">表3</option>
                            </CFormSelect>
                            </CCol>
                            <CButton type="submit" style={{position: 'absolute', right: '45px',display: 'flex',alignItems: 'center', backgroundColor: '#CA6AAF', borderColor: '#CA6AAF', color: 'white',width:'120px',height:'50px' }}>
                                <CIcon icon={cilDataTransferDown} className="me-2" />
                            下載全部
                            </CButton>
                        </CRow>
                        </div>
                        <br/>
                        <CCard style={{ width: '100%' }}>
                            <CCardBody>
                                <CCardTitle>
                                 <CRow>   
                                <div style={{width:'100%',height:'50px', backgroundColor:'#D9D9D9',display: 'grid',alignItems: 'center',}}> 
                                <strong style={{ fontSize: '1.4rem',display: 'flex', alignItems: 'center',padding:'5px'}}>總覽</strong>
                                    
                                    <CButton style={{position: 'absolute', right: '30px',width:'40px',backgroundColor:'#9D6B6B',color:'white',display: 'flex',alignItems: 'center' }}>
                                        <b><CIcon icon={cilDataTransferDown} className="me-2" /></b>
                                    </CButton>
                                </div>
                                </CRow>
                                </CCardTitle>
                                <table style={{width: '700px'}}>
                                    <thead style={{backgroundColor:'#33CCFF',color:'white'}}>
                                    <tr>
                                        <th style={{ border: '1px solid white',width: '30%', textAlign: 'center', verticalAlign: 'middle' }}></th>
                                        <th style={{ border: '1px solid white',width: '30%',height:'50px',textAlign: 'center', verticalAlign: 'middle' }}>排放當量<br/>(公噸COe/年)</th>
                                        <th style={{ border: '1px solid white',width: '20%',height:'50px', textAlign: 'center', verticalAlign: 'middle' }}>百分比<br/>(%)</th>
                                        <th style={{ border: '1px solid white',width: '20%',height:'50px', textAlign: 'center', verticalAlign: 'middle' }}>碳費</th>
                                    </tr>
                                    </thead>
                                    <tbody style={{backgroundColor:'#CCEEFF'}}>
                                    <tr>
                                        <td style={{ border: '1px solid white'}}><b>總排放量</b></td>
                                        <td style={cellStyle}></td>
                                        <td style={cellStyle}></td>
                                        <td style={cellStyle}></td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: '1px solid white'}}><b><div><CRow><div style={{width:'120px'}}>直接排放</div><div style={{width:'80px'}}>/範疇一</div></CRow></div></b></td>
                                        <td style={cellStyle}></td>
                                        <td style={cellStyle}></td>
                                        <td style={cellStyle}></td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: '1px solid white'}}><b><div><CRow><div style={{width:'120px'}}>間接排放</div><div style={{width:'80px'}}>/範疇二</div></CRow></div></b></td>
                                        <td style={cellStyle}></td>
                                        <td style={cellStyle}></td>
                                        <td style={cellStyle}></td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: '1px solid white'}}><b><div><CRow><div style={{width:'120px'}}>其他間接排放</div><div style={{width:'80px'}}>/範疇三</div></CRow></div></b></td>
                                        <td style={cellStyle}></td>
                                        <td style={cellStyle}></td>
                                        <td style={cellStyle}></td>
                                    </tr>
                                    </tbody>
                                </table>
                                <br/>
                        </CCardBody>
                        </CCard>
                        <br></br>
                        <CCard style={{ width: '100%' }}>
                            <CCardBody>
                                <CRow>
                                <CCardTitle>
                                 <CRow>   
                                <div style={{width:'100%',height:'50px', backgroundColor:'#D9D9D9',display: 'grid',alignItems: 'center',}}> 
                                <strong style={{ fontSize: '1.4rem',display: 'flex', alignItems: 'center',padding:'5px'}}>直接排放 / 範疇二</strong>
                                    <CButton style={{position: 'absolute', right: '30px',width:'40px',backgroundColor:'#9D6B6B',color:'white',display: 'flex',alignItems: 'center' }}>
                                        <b><CIcon icon={cilDataTransferDown} className="me-2" /></b>
                                    </CButton>
                                </div>
                                </CRow>
                                </CCardTitle>
                                </CRow>
                                <table style={{width: '700px'}}>
                                    <thead style={{backgroundColor:'#33CCFF',color:'white'}}>
                                    <tr>
                                    <th scope="col" style={{ width: '15%', textAlign: 'center', verticalAlign: 'middle' }}></th>
                                        <th scope="col" style={{ width: '30%', textAlign: 'center', verticalAlign: 'middle' }}>設備</th>
                                        <th scope="col" style={{ width: '20%', textAlign: 'center', verticalAlign: 'middle' }}>排放當量<br/>(公噸COe/年)</th>
                                        <th scope="col" style={{ width: '15%', textAlign: 'center', verticalAlign: 'middle' }}>百分比<br/>(%)</th>
                                        <th scope="col" style={{ width: '20%', textAlign: 'center', verticalAlign: 'middle' }}>碳費</th>
                                    </tr>
                                    </thead>
                                    <tbody style={{backgroundColor:'#CCEEFF'}}>
                                    <tr>
                                        <td style={cellStyle} rowSpan={2}><b>固定排放</b></td>
                                        <td style={cellStyle}>Mark</td>
                                        <td style={cellStyle}>Otto</td>
                                        <td style={cellStyle}>@mdo</td>
                                        <td style={cellStyle}>@mdo</td>
                                    </tr>
                                    <tr>
                                        <td style={cellStyle}>Mark</td>
                                        <td style={cellStyle}>Otto</td>
                                        <td style={cellStyle}>@mdo</td>
                                        <td style={cellStyle}>@mdo</td>
                                    </tr>
                                    <tr>
                                        <td style={cellStyle}><b>移動排放</b></td>
                                        <td style={cellStyle}>Jacob</td>
                                        <td style={cellStyle}>Thornton</td>
                                        <td style={cellStyle}>@fat</td>
                                        <td style={cellStyle}>@mdo</td>
                                    </tr>
                                    <tr>
                                        <td style={cellStyle} rowSpan={3}><b>逸散排放</b></td>
                                        <td style={cellStyle}>Larry the Bird</td>
                                        <td style={cellStyle}>@twitter</td>
                                        <td style={cellStyle}>@mdo</td>
                                        <td style={cellStyle}>@mdo</td>
                                    </tr>
                                    <tr>
                                        <td style={cellStyle}>Larry the Bird</td>
                                        <td style={cellStyle}>@twitter</td>
                                        <td style={cellStyle}>@mdo</td>
                                        <td style={cellStyle}>@mdo</td>
                                    </tr>
                                    <tr>
                                        <td style={cellStyle}>Larry the Bird</td>
                                        <td style={cellStyle}>@twitter</td>
                                        <td style={cellStyle}>@mdo</td>
                                        <td style={cellStyle}>@mdo</td>
                                    </tr>
                                    </tbody>
                                </table>
                                <br/>
                                <CCardSubtitle className="mb-2 text-body-secondary">Card subtitle</CCardSubtitle>
                                <CCardText>
                                    Some quick example text to build on the card title and make up the bulk of the
                                    card&#39;s content.
                                </CCardText>
                            </CCardBody>
                        </CCard>
                    <br></br>
                </>
                )}

                {/* /*圖表呈現頁 */ }
                {activeTab === 'tab2' && (
                    <>
                    <CRow>
                    <div style={{width:'100%'}}>
                        <CRow verticalAlign='cnet'>
                        <strong style={{ fontSize: '1.2rem', borderBottom: '5px solid #d882c0',width: '14%'}}>xx2024盤查報告</strong>
                            <CCol>
                            <CFormSelect size="sm" className="mb-3" style={{width:'15%'}}>
                                <option>全部表格</option>
                                <option value="1">表1</option>
                                <option value="2">表2</option>
                                <option value="3">表3</option>
                            </CFormSelect>
                            </CCol>
                            <CButton type="submit" style={{position: 'absolute', right: '45px',display: 'flex',alignItems: 'center', backgroundColor: '#CA6AAF', borderColor: '#CA6AAF', color: 'white',width:'120px',height:'50px' }}>
                                <CIcon icon={cilDataTransferDown} className="me-2" />
                            下載全部
                            </CButton>
                        </CRow>
                    </div>
                    
                    </CRow> <br/>  
                    <CRow>
                    {/* 圓餅圖 */}
                    <CCol xs={6}>
                        <CCard className="mb-4">
                        <CCardHeader>碳排範疇比例 / 圓餅圖</CCardHeader>
                        <CCardBody>
                            <div style={{ width: '350px', height: '350px' }}>
                            <CChartPie
                            data={{
                                labels: ['範疇一', '範疇二', '範疇三'],
                                datasets: [
                                {
                                    data: [300, 50, 100],
                                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                                    hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                                },
                                ],
                            }}
                            options={{
                                responsive: true,
                                plugins: {
                                  legend: {
                                    position: 'right', // 圖例位置
                                    
                                  },
                                  tooltip: {
                                    enabled: true, // 顯示提示框
                                  },
                                  
                                },
                            }}
                            />
                            </div>
                        </CCardBody>
                        </CCard>
                    </CCol>
                    {/* 環形圖 */}
                    <CCol xs={6}>
                        <CCard className="mb-4">
                        <CCardHeader>碳排範疇比例 / 半圓環形圖</CCardHeader>
                        <CCardBody>
                        <div style={{ width: '350px', height: '350px' }}>
                            <CChartDoughnut 
                            data={{
                                labels: ['範疇一', '範疇二', '範疇三'],
                                datasets: [
                                {
                                    backgroundColor: ['#41B883', '#E46651', '#00D8FF'],
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
                                    display: true,
                                    position: "bottom",
                                    labels: {
                                    boxWidth: 15,
                                    },
                                },
                                },
                            }}
                            />
                        </div>
                        </CCardBody>
                        </CCard>
                    </CCol> 
                    {/* 柱狀圖 */}
                    <CCol xs={6}>
                        <CCard className="mb-4">
                        <CCardHeader>碳排總量 / 柱狀圖</CCardHeader>
                        <CCardBody>
                        <div style={{ width: '350px', height: '350px' }}>
                            <CChartBar
                            data={{
                                labels: ['範疇一', '範疇二', '範疇三'],
                                datasets: [
                                {
                                    labels: ['範疇一', '範疇二', '範疇三'],
                                    backgroundColor: ['#41B883', '#E46651', '#00D8FF'],
                                    data: [55.3654, 38.2547, 12.6354],
                                },
                                ],
                            }}
                            labels="months"
                            /></div>
                        </CCardBody>
                        </CCard>
                    </CCol>
                    {/* 環形圖 */}
                    <CCol xs={6}>
                        <CCard className="mb-4">
                        <CCardHeader>碳排範疇比例 / 環形圖</CCardHeader>
                        <CCardBody>
                            <div style={{ width: '350px', height: '350px' }}>
                            <CChartDoughnut 
                            data={{
                                labels: ['範疇一', '範疇二', '範疇三'],
                                datasets: [
                                {
                                    backgroundColor: ['#41B883', '#E46651', '#00D8FF'],
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
      </CCol>
    </CRow>
    )
}


export default Tabs
