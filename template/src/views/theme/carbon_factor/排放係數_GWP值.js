import React, { useState, useEffect } from 'react'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardTitle,
  CNav,
  CNavItem,
  CNavLink,
  CFormSelect,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLoopCircular } from '@coreui/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTableList, faCircleInfo } from '@fortawesome/free-solid-svg-icons'

import styles from '../../../scss/盤查結果查詢.module.css'
import { getFuelFactorsData } from '../../碳盤查系統/system/活動數據盤點/fetchdata'

const EmissionFactorsDashboard = () => {
  const [activeTab, setActiveTab] = useState('tab1')
  const [visible1, setVisible1] = useState(false)
  const [fuelFactors, setFuelFactors] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const cellStyle = {
    border: '1px solid white',
    textAlign: 'center',
    verticalAlign: 'middle',
    height: '40px',
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const data = await getFuelFactorsData()
        if (data) {
          setFuelFactors(data)
        }
      } catch (error) {
        console.error('Error fetching fuel factors:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Section title component
  const SectionTitle = ({ title }) => (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
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
          padding: '10px 30px',
        }}
      >
        {title}
      </div>
    </div>
  )

  // Table header component for emissions
  const EmissionsTableHeader = () => (
    <thead style={{ border: '1px solid white', backgroundColor: 'orange', color: 'white' }}>
      <tr>
        <th scope="col" style={{...cellStyle, width: '150px'}} rowSpan={2}></th>
        <th scope="col" style={cellStyle} colSpan={3}>
          燃料單位熱值之排放係數(Kg/Kcal)
        </th>
        <th scope="col" style={cellStyle} colSpan={1}>
          低位熱值(Kcal/l)
        </th>
        <th scope="col" style={cellStyle} colSpan={3}>
          燃料單位重量/體積之排放係數(KgCO2/Kg)
        </th>
      </tr>
      <tr>
        <th scope="col" style={cellStyle}>CO2</th>
        <th scope="col" style={cellStyle}>CH4</th>
        <th scope="col" style={cellStyle}>N2O</th>
        <th scope="col" style={cellStyle}>LHV</th>
        <th scope="col" style={cellStyle}>CO2</th>
        <th scope="col" style={cellStyle}>CH4</th>
        <th scope="col" style={cellStyle}>N2O</th>
      </tr>
    </thead>
  )

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
        </CNav>

        <div className={styles.body}>
          {activeTab === 'tab1' && (
            <>
              <div className={styles.titleContainer}>
                <div className={styles.leftItem}>
                  <div>
                    <strong>AR4溫室氣體排放係數管理表6.0.4</strong>
                  </div>
                </div>
                <div className={styles.rightItem}>
                  <button style={{ backgroundColor: 'grey' }}>
                    <CIcon icon={cilLoopCircular} className="me-2" />
                    2025/01/17
                  </button>
                </div>
              </div>
              
              {/* 固定燃燒排放源 */}
              <CCard style={{ width: '100%' }}>
                <CCardTitle>
                  <SectionTitle title="固定燃燒排放源" />
                </CCardTitle>
                <CCardBody>
                  {isLoading ? (
                    <div>Loading...</div>
                  ) : (
                    <table style={{ width: '100%', fontSize: '1.2rem' }}>
                      <EmissionsTableHeader />
                      <tbody style={{ border: '1px solid white', backgroundColor: '#FFE4CA' }}>
                        {fuelFactors
                          .filter(factor =>
                            !factor.FuelType.includes('未控制') &&
                            !factor.FuelType.includes('氧化觸媒') &&
                            !factor.FuelType.includes('1995年後') &&
                            !factor.FuelType.includes('移動燃燒排放源')
                          )
                          .map((factor) => (
                            <tr key={factor.fuel_factor_id}>
                              <td style={cellStyle}><b>{factor.FuelType}</b></td>
                              <td style={cellStyle}>{factor.CO2_Emission}</td>
                              <td style={cellStyle}>{factor.CH4_Emission}</td>
                              <td style={cellStyle}>{factor.N2O_Emission}</td>
                              <td style={cellStyle}>{factor.LHV}</td>
                              <td style={cellStyle}>{factor.CO2_Total}</td>
                              <td style={cellStyle}>{factor.CH4_Total}</td>
                              <td style={cellStyle}>{factor.N2O_Total}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  )}
                </CCardBody>
              </CCard>
              <br />
              
              {/* 移動燃燒排放源 */}
              <CCard style={{ width: '100%' }}>
                <CCardTitle>
                  <SectionTitle title="移動燃燒排放源" />
                </CCardTitle>
                <CCardBody>
                  {isLoading ? (
                    <div>Loading...</div>
                  ) : (
                    <table style={{ width: '100%', fontSize: '1.2rem' }}>
                      <EmissionsTableHeader />
                      <tbody style={{ border: '1px solid white', backgroundColor: '#FFE4CA' }}>
                        {/* 車用汽油 section */}
                        <tr>
                          <td style={{ ...cellStyle, width: '100px', textAlign: 'center' }} rowSpan={3}>
                            <b>車用汽油</b>
                          </td>
                          <td style={cellStyle}><b>未控制</b></td>
                          {fuelFactors
                            .filter(factor => factor.FuelType === '車用汽油-未控制')
                            .map((factor) => (
                              <React.Fragment key={factor.fuel_factor_id}>
                                <td style={cellStyle}>{factor.CO2_Emission}</td>
                                <td style={cellStyle}>{factor.CH4_Emission}</td>
                                <td style={cellStyle}>{factor.N2O_Emission}</td>
                                <td style={cellStyle}>{factor.LHV}</td>
                                <td style={cellStyle}>{factor.CO2_Total}</td>
                                <td style={cellStyle}>{factor.CH4_Total}</td>
                                <td style={cellStyle}>{factor.N2O_Total}</td>
                              </React.Fragment>
                            ))}
                        </tr>
                        <tr>
                          <td style={cellStyle}><b>氧化觸媒</b></td>
                          {fuelFactors
                            .filter(factor => factor.FuelType === '車用汽油-氧化觸媒')
                            .map((factor) => (
                              <React.Fragment key={factor.fuel_factor_id}>
                                <td style={cellStyle}>{factor.CO2_Emission}</td>
                                <td style={cellStyle}>{factor.CH4_Emission}</td>
                                <td style={cellStyle}>{factor.N2O_Emission}</td>
                                <td style={cellStyle}>{factor.LHV}</td>
                                <td style={cellStyle}>{factor.CO2_Total}</td>
                                <td style={cellStyle}>{factor.CH4_Total}</td>
                                <td style={cellStyle}>{factor.N2O_Total}</td>
                              </React.Fragment>
                            ))}
                        </tr>
                        <tr>
                          <td style={cellStyle}><b>1995年後之低里程<br />輕型車輛</b></td>
                          {fuelFactors
                            .filter(factor => factor.FuelType === '車用汽油-1995年後之低里程輕型車輛')
                            .map((factor) => (
                              <React.Fragment key={factor.fuel_factor_id}>
                                <td style={cellStyle}>{factor.CO2_Emission}</td>
                                <td style={cellStyle}>{factor.CH4_Emission}</td>
                                <td style={cellStyle}>{factor.N2O_Emission}</td>
                                <td style={cellStyle}>{factor.LHV}</td>
                                <td style={cellStyle}>{factor.CO2_Total}</td>
                                <td style={cellStyle}>{factor.CH4_Total}</td>
                                <td style={cellStyle}>{factor.N2O_Total}</td>
                              </React.Fragment>
                            ))}
                        </tr>
                        
                        {/* 柴油 section */}
                        <tr>
                          <td style={cellStyle} colSpan={2}><b>柴油</b></td>
                          {fuelFactors
                            .filter(factor => factor.FuelType === '柴油(移動燃燒排放源)')
                            .map((factor) => (
                              <React.Fragment key={factor.fuel_factor_id}>
                                <td style={cellStyle}>{factor.CO2_Emission}</td>
                                <td style={cellStyle}>{factor.CH4_Emission}</td>
                                <td style={cellStyle}>{factor.N2O_Emission}</td>
                                <td style={cellStyle}>{factor.LHV}</td>
                                <td style={cellStyle}>{factor.CO2_Total}</td>
                                <td style={cellStyle}>{factor.CH4_Total}</td>
                                <td style={cellStyle}>{factor.N2O_Total}</td>
                              </React.Fragment>
                            ))}
                        </tr>
                      </tbody>
                    </table>
                  )}
                </CCardBody>
              </CCard>
              <br />
              
              {/* 電力排放係數 */}
              <CCard style={{ width: '100%' }}>
                <CCardTitle>
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <SectionTitle title="電力排放係數" />
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
                  </div>
                </CCardTitle>
                <CCardBody>
                  <table style={{ width: '100%', fontSize: '1.2rem' }}>
                    <thead style={{ border: '1px solid white', backgroundColor: 'orange', color: 'white' }}>
                      <tr>
                        <th scope="col" style={{ ...cellStyle, width: '200px' }}></th>
                        <th scope="col" style={{ ...cellStyle, width: '400px', textAlign: 'center' }}>110年</th>
                        <th scope="col" style={{ ...cellStyle, width: '300px', textAlign: 'center' }}>111年</th>
                        <th scope="col" style={{ ...cellStyle, width: '300px', textAlign: 'center' }}>112年</th>
                        <th scope="col" style={{ ...cellStyle, width: '300px', textAlign: 'center' }}>113年</th>
                        <th scope="col" style={{ ...cellStyle, width: '300px', textAlign: 'center' }}>114年</th>
                      </tr>
                    </thead>
                    <tbody style={{ border: '1px solid white', backgroundColor: '#FFE4CA' }}>
                      <tr>
                        <td style={cellStyle}><b>電力排放係數(CO2e/度)</b></td>
                        <td style={cellStyle}>0.494</td>
                        <td style={cellStyle}>0.494</td>
                        <td style={cellStyle}>0.494</td>
                        <td style={cellStyle}>0.494</td>
                        <td style={cellStyle}>0.494</td>
                      </tr>
                    </tbody>
                  </table>
                </CCardBody>
              </CCard>
              <br />
              
              {/* GWP數值 */}
              <CCard style={{ width: '100%' }}>
                <CCardTitle>
                  <SectionTitle title="GWP值" />
                </CCardTitle>
                <CCardBody>
                  <table style={{ width: '100%', fontSize: '1.2rem' }}>
                    <thead style={{ border: '1px solid white', backgroundColor: 'orange', color: 'white' }}>
                      <tr>
                        <th scope="col" style={cellStyle}>種類</th>
                        <th scope="col" style={cellStyle}>溫室氣體化學式</th>
                        <th scope="col" style={cellStyle}>IPCC 2013年預設GWP值</th>
                      </tr>
                    </thead>
                    <tbody style={{ border: '1px solid white', backgroundColor: '#FFE4CA' }}>
                      <tr>
                        <td style={{ ...cellStyle, width: '350px' }}><b>--</b></td>
                        <td style={cellStyle}>CO2二氧化碳</td>
                        <td style={cellStyle}>1</td>
                      </tr>
                      <tr>
                        <td style={{ ...cellStyle, width: '350px' }}><b>--</b></td>
                        <td style={cellStyle}>CH4甲烷</td>
                        <td style={cellStyle}>28</td>
                      </tr>
                      <tr>
                        <td style={{ ...cellStyle, width: '350px' }}><b>--</b></td>
                        <td style={cellStyle}>N2O氧化亞氮</td>
                        <td style={cellStyle}>265</td>
                      </tr>
                    </tbody>
                  </table>
                </CCardBody>
              </CCard>
              
              {/* Modal for electricity emission factor */}
              <CModal visible={visible1} onClose={() => setVisible1(false)}>
                <CModalHeader>
                  <CModalTitle><b>電力排放係數</b></CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <ul>
                    <li>
                      <b>電力排放係數(CO2e/度) = [(發電業及自用發電設備設置者促售公用售電業電量之電力排碳量 - 線損承擔之電力排碳量) / 公用售電業總銷售電量]</b>
                    </li>
                  </ul>
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={() => setVisible1(false)}>
                    關閉
                  </CButton>
                </CModalFooter>
              </CModal>
            </>
          )}
        </div>
      </CCol>
    </CRow>
  )
}

export default EmissionFactorsDashboard