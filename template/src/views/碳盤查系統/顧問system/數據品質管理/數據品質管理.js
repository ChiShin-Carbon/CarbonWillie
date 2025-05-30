import React, { useState, useEffect } from 'react'
import {
  CCard,
  CFormSelect,
  CTab,
  CTabList,
  CTabs,
  CTable,
  CTableBody,
  CTableHead,
  CForm,
  CFormInput,
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
  gas_type_map,
  emission_category_Map,
  emission_pattern_Map,
} from '../EmissionSource'

import { UpNav } from '../upNav'


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
      const activityData = isActivityDataEmpty ? [{ data_type: '' }] : source.activity_data

      const gasTypes = source.gas_types
        ? source.gas_types.split(',').map((gasId) => gas_type_map[parseInt(gasId)]) // 轉換為氣體名稱
        : []

      // Make sure emissionFactors is an array
      const emissionFactors = Array.isArray(source.emission_factors) ? source.emission_factors : []

      // 排放量&排放當量
      const emissionsList = Array.isArray(source.emissions) ? source.emissions : []

      return activityData.map((activity) => {
        // 活動數據種類等級
        const matClassLevel = activity.data_type
          ? activity.data_type === 1
            ? 1
            : activity.data_type === 2
              ? 2
              : activity.data_type === 3 || activity.data_type === 4
                ? 3
                : 0
          : ''
        // 活動數據可信種類(儀器校正誤差等級)
        const matBelType =
          activity.data_type === 1 || activity.data_type === 2
            ? '有進行外部校正或有多組數據茲佐證者'
            : activity.data_type === 3
              ? '有進行內部校正或經過會計簽證等証明者'
              : '未進行儀器校正或未進行紀錄彙整者'
        // 活動數據可信等級
        const matBelLevel =
          matBelType === '有進行外部校正或有多組數據茲佐證者'
            ? '1'
            : matBelType === '有進行內部校正或經過會計簽證等証明者'
              ? '2'
              : '3'
        // 係數種類等級
        const emiLevel = '3'
        // 單一排放源數據誤差等級
        const manage1 =
          matClassLevel && matBelLevel && emiLevel ? matClassLevel * matBelLevel * emiLevel : ''
        // 評分區間範圍
        const manage3 =
          manage1 === '' ? '' : manage1 < 10 ? '1' : manage1 < 19 ? '2' : manage1 >= 27 ? '3' : '-'

        return {
          status: 'completed',
          process: process_code_Map[source.process_code],
          equipment: device_code_Map[source.device_code],
          material: fuel_code_Map[source.fuel_code],
          details: {
            matCode: source.fuel_code,
            matName: fuel_code_Map[source.fuel_code],
            matClassLevel, // 活動數據種類等級
            matBelType, // 活動數據可信種類(儀器校正誤差等級)
            matBelLevel, // 活動數據可信等級
            matInfo: '',
            matUnit: '',
            sourceClass: emission_category_Map[source.emission_category],
            sourceType: emission_pattern_Map[source.emission_category][source.emission_pattern - 1],
            emiCoeClass: '5國家排放係數',
            emiLevel,
            manage1, // 單一排放源數據誤差等級
            manage3, // 評分區間範圍
            emiCoeList: gasTypes.map((gasType, index) => {
              const emissionData = emissionsList.find((e) => e.gas_type === index + 1) || {} // 依gas_type對應emissions
              return {
                gasType,
                emissionEquivalent: emissionData.emission_equivalent || 0,
              }
            }),
          },
        }
      })
    })
    .flat() // Flatten the array to ensure all data is in a single level

  console.log(tableData)

  const handleRowClick = (row) => {
    setSelectedRowData(row.details)
  }

  const handleInputChange = (e, field) => {
    const value = e.target.value
    setSelectedRowData((prevData) => ({
      ...prevData,
      [field]: value,
      ...(field === 'matBelType' && {
        matBelLevel:
          value === '有進行外部校正或有多組數據茲佐證者'
            ? '1'
            : value === '有進行內部校正或經過會計簽證等証明者'
              ? '2'
              : '3',
      }),
    }))
  }
  useEffect(() => {
    if (selectedRowData) {
      const { matBelLevel, matClassLevel, emiLevel } = selectedRowData
      if (matBelLevel && matClassLevel && emiLevel) {
        const manage1Value = parseInt(matBelLevel) * parseInt(matClassLevel) * parseInt(emiLevel)
        setSelectedRowData((prevData) => ({
          ...prevData,
          manage1: manage1Value,
        }))
      }
    }
  }, [selectedRowData?.matBelLevel, selectedRowData?.matClassLevel, selectedRowData?.emiLevel])

  useEffect(() => {
    if (selectedRowData) {
      const manage1Value = parseInt(selectedRowData.manage1, 10)
      let manage3Value
      if (manage1Value < 10) {
        manage3Value = '1'
      } else if (manage1Value < 19) {
        manage3Value = '2'
      } else if (manage1Value >= 27) {
        manage3Value = '3'
      } else {
        manage3Value = ''
      }
      setSelectedRowData((prevData) => ({
        ...prevData,
        manage3: manage3Value,
      }))
    }
  }, [selectedRowData?.manage1])

  return (
    <main>
      <UpNav/>

      <div className="system-titlediv">
        <div>
          <h4 className="system-title">數據品質管理</h4>
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
                  <th>製程</th>
                  <th>設備</th>
                  <th>原燃物料或產品</th>
                </tr>
              </CTableHead>
              <CTableBody className={styles.tableBody}>
                {tableData.map((row, index) => (
                  <tr key={index} onClick={() => handleRowClick(row)}>
                   
                    <td>{row.process}</td>
                    <td>{row.equipment}</td>
                    <td>{row.material}</td>
                  </tr>
                ))}
              </CTableBody>
            </CTable>
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
                      <p>{selectedRowData.processCode}</p>
                    </div>
                    <div>
                      <span>代碼:</span>
                      <p>{selectedRowData.processNum}</p>
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
                      <p>{selectedRowData.equipCode}</p>
                    </div>
                    <div>
                      <span>代碼:</span>
                      <p>{selectedRowData.equipNum}</p>
                    </div>
                    <div>
                      <span>名稱:</span>
                      <p>{selectedRowData.equipName}</p>
                    </div>
                  </div>
                </div> */}
                <div className={styles.block}>
                  <div className={styles.blockHead}>
                    <h5>原燃物料或產品</h5>
                  </div>
                  <div className={styles.blockBody}>
                    <div>
                      <span>代碼:</span>
                      <p>{selectedRowData.matCode}</p>
                    </div>
                    <div>
                      <span>名稱:</span>
                      <p>{selectedRowData.matName}</p>
                    </div>
                    <div>
                      <span>活動數據種類等級:</span>
                      <p>{selectedRowData.matClassLevel}</p>
                    </div>
                    <div>
                      <span>活動數據可信種類(儀器校正誤差等級):</span>
                      <CFormSelect
                        className={styles.input}
                        value={selectedRowData.matBelType}
                        onChange={(e) => handleInputChange(e, 'matBelType')}
                      >
                        <option value="有進行外部校正或有多組數據茲佐證者">
                          有進行外部校正或有多組數據茲佐證者
                        </option>
                        <option value="有進行內部校正或經過會計簽證等証明者">
                          有進行內部校正或經過會計簽證等証明者
                        </option>
                        <option value="未進行儀器校正或未進行紀錄彙整者">
                          未進行儀器校正或未進行紀錄彙整者
                        </option>
                      </CFormSelect>
                    </div>
                    <div>
                      <span>活動數據可信等級:</span>
                      <p>{selectedRowData.matBelLevel}</p>
                    </div>
                    <div>
                      <span>數據可信度資訊說明:</span>
                      <CFormInput
                        className={styles.input}
                        value={selectedRowData.matInfo}
                        onChange={(e) => handleInputChange(e, 'matInfo')}
                      />
                    </div>
                    <div>
                      <span>負責單位或保存單位:</span>
                      <CFormInput
                        className={styles.input}
                        value={selectedRowData.matUnit}
                        onChange={(e) => handleInputChange(e, 'matUnit')}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.block}>
                  <div className={styles.blockHead}>
                    <h5>排放源資料</h5>
                  </div>
                  <div className={styles.blockBody}>
                    <div>
                      <span>範疇別:</span>
                      <p>{selectedRowData.sourceClass}</p>
                    </div>
                    <div>
                      <span>排放型式:</span>
                      <p>{selectedRowData.sourceType}</p>
                    </div>
                  </div>
                </div>

                <div className={styles.block}>
                  <div className={styles.blockHead}>
                    <h5>排放係數</h5>
                  </div>
                  <div className={styles.blockBody}>
                    <div>
                      <span>係數種類:</span>
                      <p>{selectedRowData.emiCoeClass}</p>
                    </div>
                    <div>
                      <span>係數種類等級:</span>
                      <p>{selectedRowData.emiLevel}</p>
                    </div>
                  </div>
                </div>

                <div className={styles.block}>
                  <div className={styles.blockHead}>
                    <h5>數據品質管理</h5>
                  </div>
                  <div className={styles.blockBody}>
                    <div>
                      <span>單一排放源數據誤差等級:</span>
                      <p>{selectedRowData.manage1}</p>
                    </div>
                    <div>
                      <span>單一排放源占排放總量比(%):</span>
                      <p>
                        {(() => {
                          const totalEmissions =
                            selectedRowData?.emiCoeList?.reduce(
                              (sum, emiCoe) => sum + emiCoe.emissionEquivalent,
                              0,
                            ) || 0

                          let result = '' // 定量盤查-單一排放源排放當量小計

                          if (selectedRowData?.is_bioenergy) {
                            const firstGasType = selectedRowData.emiCoeList?.[0]?.gasType
                            if (firstGasType === 'CO2') {
                              result = selectedRowData.emiCoeList
                                .slice(1)
                                .reduce((sum, emiCoe) => sum + emiCoe.emissionEquivalent, 0)
                                .toFixed(5)
                            }
                          } else {
                            result = totalEmissions !== 0 ? totalEmissions.toFixed(5) : ''
                          }

                          const percentageResult =
                            result !== ''
                              ? ((result / totalEmissionEquivalent) * 100).toFixed(2) + '%'
                              : ''

                          return percentageResult !== ''
                            ? ((result / totalEmissionEquivalent) * 100).toFixed(4) + '%'
                            : ''
                        })()}
                      </p>
                    </div>
                    <div>
                      <span>評分區間範圍:</span>
                      <p>{selectedRowData.manage3}</p>
                    </div>
                    <div>
                      <span>排放量占比加權平均:</span>
                      <p>
                        {(() => {
                          const totalEmissions =
                            selectedRowData?.emiCoeList?.reduce(
                              (sum, emiCoe) => sum + emiCoe.emissionEquivalent,
                              0,
                            ) || 0

                          let result = '' // 定量盤查-單一排放源排放當量小計

                          if (selectedRowData?.is_bioenergy) {
                            const firstGasType = selectedRowData.emiCoeList?.[0]?.gasType
                            if (firstGasType === 'CO2') {
                              result = selectedRowData.emiCoeList
                                .slice(1)
                                .reduce((sum, emiCoe) => sum + emiCoe.emissionEquivalent, 0)
                                .toFixed(5)
                            }
                          } else {
                            result = totalEmissions !== 0 ? totalEmissions.toFixed(5) : ''
                          }

                          const percentageResult =
                            result !== ''
                              ? ((result / totalEmissionEquivalent) * 100).toFixed(2) + '%'
                              : ''

                          const singleEmissionPercentage =
                            percentageResult !== ''
                              ? (result / totalEmissionEquivalent).toFixed(4)
                              : ''

                          if (selectedRowData.manage1 == '') {
                            return ''
                          } else {
                            if (singleEmissionPercentage == '') {
                              return ''
                            } else {
                              return (singleEmissionPercentage * selectedRowData.manage1).toFixed(2)
                            }
                          }
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
