import React, { useState, useEffect } from 'react'
import {
  CCard,
  CFormSelect,
  CFormInput,
  CTab,
  CTabList,
  CTabs,
  CTable,
  CTableBody,
  CTableHead,
  CForm,
} from '@coreui/react'

import '../../../../scss/碳盤查系統.css'
import styles from '../../../../scss/顧問system.module.css'
import { Link } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons'

import {
  process_code_Map,
  device_code_Map,
  fuel_code_Map,
  activity_data_unit_map,
  gas_type_map,
} from '../EmissionSource'

const Tabs = () => {
  // 設定 state 來儲存選擇的行數據，初始值為 null
  const [selectedRowData, setSelectedRowData] = useState(null)
  const [emission_sources, setEmissionSources] = useState([])
  const [totalEmissionEquivalent, setTotalEmissionEquivalent] = useState(0)

  const getEmissionSource = async () => {
    try {
      const response = await fetch('http://localhost:8000/emission_source')
      if (response.ok) {
        const data = await response.json()
        setEmissionSources(data.emission_sources)
        setTotalEmissionEquivalent(data.total_emission_equivalent)
      } else {
        console.log(response.status)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    getEmissionSource()
  }, [])

  // 表格數據
  const tableData = emission_sources
    .map((source) => {
      // Check if activity_data is empty
      const isActivityDataEmpty = !source.activity_data || source.activity_data.length === 0

      // If activity_data is empty, set default values for its fields
      const activityData = isActivityDataEmpty
        ? [{ activity_data: '', activity_data_unit: '' }]
        : source.activity_data

      const gasTypes = source.gas_types
        ? source.gas_types.split(',').map((gasId) => gas_type_map[parseInt(gasId)]) // 轉換為氣體名稱
        : []

      // Make sure emissionFactors is an array
      const emissionFactors = Array.isArray(source.emission_factors) ? source.emission_factors : []

      // 排放量&排放當量
      const emissionsList = Array.isArray(source.emissions) ? source.emissions : []

      return activityData.map((activity) => ({
        status: 'completed',
        process: process_code_Map[source.process_code],
        equipment: device_code_Map[source.device_code],
        material: fuel_code_Map[source.fuel_code],
        details: {
          activity: activity.activity_data || '',
          activityUnit: activity_data_unit_map[activity.activity_data_unit],
          emiCoe1: gasTypes,
          emiCoeList: gasTypes.map((gasType, index) => {
            // Get the emission factor for this index, or use a default empty object if it doesn't exist
            const emissionFactor = emissionFactors[index] || {}
            const emissionData = emissionsList.find((e) => e.gas_type === index + 1) || {} // 依gas_type對應emissions

            return {
              gasType,
              emiCoeType: emissionFactor.factor_type || '1', // Default to '1' (預設)
              emiCoeNum: emissionFactor.factor || 0, // Default to 0
              emiCoeSource: emissionFactor.factor_source || '',
              emiCoeUnit: `${gasType}/${activity_data_unit_map[activity.activity_data_unit]}`,
              emiCoeClass: '5國家排放係數',
              emiCoeGWP: emissionFactor.GWP || 1, // Default GWP to 1
              emissions: emissionData.emissions || 0,
              emissionEquivalent: emissionData.emission_equivalent || 0,
            }
          }),
          is_bioenergy: source.is_bioenergy,
          other3: '',
        },
      }))
    })
    .flat()

  const handleRowClick = (row) => {
    setSelectedRowData(row.details)
  }

  const handleInputChange = (e, field, index) => {
    const value = e.target.value
    setSelectedRowData((prevData) => {
      const updatedEmiCoeList = [...prevData.emiCoeList]
      updatedEmiCoeList[index] = {
        ...updatedEmiCoeList[index],
        [field]: value,
      }

      if (field === 'emiCoeType' && value === '0') {
        updatedEmiCoeList[index].emiCoeNum = updatedEmiCoeList[index].emiCoeNum || ''
      }

      return {
        ...prevData,
        emiCoeList: updatedEmiCoeList,
      }
    })
  }

  return (
    <main>
      <CTabs activeItemKey={1}>
        <CTabList variant="underline-border" className="system-tablist">
          <Link to="/碳盤查系統/顧問system/排放源鑑別" className="system-tablist-link">
            <CTab aria-controls="tab1" itemKey={3} className="system-tablist-choose">
              排放源鑑別
            </CTab>
          </Link>
          <Link to="/碳盤查系統/顧問system/活動數據" className="system-tablist-link">
            <CTab aria-controls="tab3" itemKey={4} className="system-tablist-choose">
              活動數據
            </CTab>
          </Link>
          <Link to="." className="system-tablist-link">
            <CTab aria-controls="tab3" itemKey={1} className="system-tablist-choose">
              定量盤查
            </CTab>
          </Link>
          <Link to="/碳盤查系統/顧問system/數據品質管理" className="system-tablist-link">
            <CTab aria-controls="tab3" itemKey={5} className="system-tablist-choose">
              數據品質管理
            </CTab>
          </Link>
          <Link to="/碳盤查系統/顧問system/不確定性量化評估" className="system-tablist-link">
            <CTab aria-controls="tab3" itemKey={6} className="system-tablist-choose">
              不確定性量化評估
            </CTab>
          </Link>
          {/* <Link to="/碳盤查系統/顧問system/全廠電力蒸汽供需情況 " className="system-tablist-link">
            <CTab aria-controls="tab3" itemKey={2} className="system-tablist-choose">
              全廠電力蒸汽供需情況{' '}
            </CTab>
          </Link> */}
        </CTabList>
      </CTabs>

      <div className="system-titlediv">
        <div>
          <h4 className="system-title">定量盤查</h4>
          <hr className="system-hr"></hr>
        </div>
        {/* <button className="system-save">儲存</button> */}
      </div>
      <div className={styles.cardRow}>
        <CCard className={styles.card}>
          <div className={styles.cardBody}>
            <CTable hover className={styles.table}>
              <CTableHead className={styles.tableHead}>
                <tr>
                  <th style={{ width: '15%' }}>填寫進度</th>
                  <th>製程</th>
                  <th>設備</th>
                  <th>原燃物料或產品</th>
                </tr>
              </CTableHead>
              <CTableBody className={styles.tableBody}>
                {tableData.map((row, index) => (
                  <tr key={index} onClick={() => handleRowClick(row)}>
                    <td>
                      <FontAwesomeIcon
                        icon={row.status === 'completed' ? faCircleCheck : faCircleXmark}
                        className={
                          row.status === 'completed' ? styles.iconCorrect : styles.iconWrong
                        }
                      />
                    </td>
                    <td>{row.process}</td>
                    <td>{row.equipment}</td>
                    <td>{row.material}</td>
                  </tr>
                ))}
              </CTableBody>
            </CTable>
          </div>

          <div className={styles.submitTable}>
            <button className={styles.button}>全部完成</button>
          </div>
        </CCard>

        <CCard className={styles.card}>
          {selectedRowData ? (
            <>
              <CForm>
                {/* <div className={styles.block}>
                  <div className={styles.blockHead}>
                    <h5>製程</h5>
                  </div>
                  <div className={styles.blockBody3}>
                    <div>
                      <span>編號:</span>
                      <p>{selectedRowData.processNum}</p>
                    </div>
                    <div>
                      <span>代碼:</span>
                      <p>{selectedRowData.processCode}</p>
                    </div>
                    <div>
                      <span>名稱:</span>
                      <p>{selectedRowData.processName}</p>
                    </div>
                  </div>
                </div>
                <div className={styles.block}>
                  <div className={styles.blockHead}>
                    <h5>設備</h5>
                  </div>
                  <div className={styles.blockBody3}>
                    <div>
                      <span>編號:</span>
                      <p>{selectedRowData.equipNum}</p>
                    </div>
                    <div>
                      <span>代碼:</span>
                      <p>{selectedRowData.equipCode}</p>
                    </div>
                    <div>
                      <span>名稱:</span>
                      <p>{selectedRowData.equipName}</p>
                    </div>
                  </div>
                </div>
                <div className={styles.block}>
                  <div className={styles.blockHead}>
                    <h5>原燃物料或產品</h5>
                  </div>
                  <div className={styles.blockBody3}>
                    <div>
                      <span>代碼:</span>
                      <p>{selectedRowData.matCode}</p>
                    </div>
                    <div>
                      <span>名稱:</span>
                      <p>{selectedRowData.matName}</p>
                    </div>
                    <div>
                      <span>是否屬生質能源:</span>
                      <p>{selectedRowData.matbio}</p>
                    </div>
                  </div>
                </div>
                <div className={styles.block}>
                  <div className={styles.blockHead}>
                    <h5>排放源資料</h5>
                  </div>
                  <div className={styles.blockBody}>
                    <div>
                      <span>類別別:</span>
                      <p>{selectedRowData.sourceClass}</p>
                    </div>
                    <div>
                      <span>排放型式:</span>
                      <p>{selectedRowData.sourceType}</p>
                    </div>
                  </div>
                </div> */}

                <div className={styles.block}>
                  <div className={styles.blockHead}>
                    <h5>活動數據</h5>
                  </div>
                  <div className={styles.blockBody}>
                    <div>
                      <span>活動數據:</span>
                      <p>{selectedRowData.activity}</p>
                    </div>
                    <div>
                      <span>單位:</span>
                      <p>{selectedRowData.activityUnit}</p>
                    </div>
                  </div>
                </div>
                <div className={styles.block}>
                  <div className={styles.blockHead}>
                    <h5>排放係數數據</h5>
                  </div>
                  {selectedRowData.emiCoeList &&
                    selectedRowData.emiCoeList.length > 0 &&
                    selectedRowData.emiCoeList.map((emiCoe, index) => (
                      <>
                        <div key={index} className={styles.blockBodySpecial}>
                          <div className={styles.blockBodyTitle}>
                            <div className={styles.line}></div>
                            <div className={styles.titleBox}>
                              <span>{`溫室氣體#${index + 1}: ${emiCoe.gasType}`}</span>
                            </div>
                            <div className={styles.line}></div>
                          </div>
                          <div className={styles.blockBody}>
                            <div>
                              <span>係數類型:</span>
                              <CFormSelect
                                className={styles.input}
                                value={emiCoe.emiCoeType}
                                onChange={(e) => handleInputChange(e, 'emiCoeType', index)}
                              >
                                <option value="1">預設</option>
                                <option value="0">自訂</option>
                              </CFormSelect>
                            </div>
                            <div>
                              <span>
                                {emiCoe.emiCoeType === '0' ? '自訂排放係數' : '預設排放係數'}
                              </span>
                              {emiCoe.emiCoeType === '0' ? (
                                <CFormInput
                                  type="number"
                                  className={styles.input}
                                  value={emiCoe.emiCoeNum}
                                  onChange={(e) => handleInputChange(e, 'emiCoeNum', index)}
                                />
                              ) : (
                                <p>{emiCoe.emiCoeNum}</p>
                              )}
                            </div>
                            <div>
                              <span>係數單位:</span>
                              <p>{emiCoe.emiCoeUnit}</p>
                            </div>
                            <div>
                              <span>係數種類:</span>
                              <CFormSelect
                                className={styles.input}
                                value={emiCoe.emiCoeClass}
                                onChange={(e) => handleInputChange(e, 'emiCoeClass', index)}
                              >
                                <option value="1自廠發展係數/質量平衡所得係數">
                                  1自廠發展係數/質量平衡所得係數
                                </option>
                                <option value="2同製程/設備經驗係數">2同製程/設備經驗係數</option>
                                <option value="3製造廠提供係數">3製造廠提供係數</option>
                                <option value="4區域排放係數">4區域排放係數</option>
                                <option value="5國家排放係數">5國家排放係數</option>
                                <option value="6國際排放係數">6國際排放係數</option>
                              </CFormSelect>
                            </div>
                            <div>
                              <span>排放量(公噸/年):</span>
                              <p>{emiCoe.emissions}</p>
                            </div>
                            <div>
                              <span>GWP:</span>
                              <p>{emiCoe.emiCoeGWP}</p>
                            </div>
                            <div>
                              <span>排放當量(公噸CO2e/年):</span>
                              <p>{emiCoe.emissionEquivalent}</p>
                            </div>
                          </div>
                          <hr />
                        </div>
                      </>
                    ))}
                </div>

                <div className={styles.block}>
                  <div className={styles.blockHead}>
                    <h5>其他</h5>
                  </div>
                  <div className={styles.blockBody1}>
                    <div>
                      <span>單一排放源排放當量小計(CO2e公噸/年):</span>
                      <p>
                        {(() => {
                          const totalEmissions =
                            selectedRowData?.emiCoeList?.reduce(
                              (sum, emiCoe) => sum + emiCoe.emissionEquivalent,
                              0,
                            ) || 0

                          if (selectedRowData?.is_bioenergy) {
                            const firstGasType = selectedRowData.emiCoeList?.[0]?.gasType
                            if (firstGasType === 'CO2') {
                              return selectedRowData.emiCoeList
                                .slice(1)
                                .reduce((sum, emiCoe) => sum + emiCoe.emissionEquivalent, 0)
                                .toFixed(5)
                            }
                          }
                          return totalEmissions !== 0 ? totalEmissions.toFixed(4) : ''
                        })()}
                      </p>
                    </div>
                    <div>
                      <span>單一排放源生質燃料之CO2排放當量小計(CO2e公噸/年):</span>
                      <p>
                        {(() => {
                          if (selectedRowData.is_bioenergy) {
                            const firstGasType = selectedRowData.emiCoeList?.[0]?.gasType
                            if (firstGasType === 'CO2') {
                              const firstEmission = selectedRowData.emiCoeList?.[0]
                              return (
                                (selectedRowData.activity / 1000) *
                                firstEmission.emiCoeNum *
                                firstEmission.emiCoeGWP
                              ).toFixed(5)
                            } else {
                              return ''
                            }
                          } else {
                            return ''
                          }
                        })()}
                      </p>
                    </div>
                    <div>
                      <span>單一排放源占排放總量比(%):</span>
                      <p>
                        {/* 單一排放源排放當量小計/七種溫室氣體年總排放當量 */}
                        {(() => {
                          const totalEmissions =
                            selectedRowData?.emiCoeList?.reduce(
                              (sum, emiCoe) => sum + emiCoe.emissionEquivalent,
                              0,
                            ) || 0
                          return totalEmissionEquivalent > 0
                            ? ((totalEmissions / totalEmissionEquivalent) * 100).toFixed(2) + '%'
                            : ''
                        })()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={styles.submit}>
                  <button className={styles.button} type="submit">
                    儲存
                  </button>
                </div>
              </CForm>
            </>
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                textAlign: 'center',
                alignContent: 'center',
                fontWeight: 'bold',
                fontSize: 'large',
              }}
            >
              請選取內容!
            </div>
          )}
        </CCard>
      </div>
    </main>
  )
}

export default Tabs
