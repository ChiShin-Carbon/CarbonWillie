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

  // const generateDetails = (sourceId) => {
  //   switch (sourceId) {
  //     case 2:
  //       return {
  //         matCode: '170006',
  //         matName: '柴油',
  //         matClassLevel: '2',
  //         matBelType: '有進行外部校正或有多組數據茲佐證者',
  //         matBelLevel: '1',
  //         matInfo: '',
  //         matUnit: '',
  //         sourceClass: '範疇1',
  //         sourceType: '移動',
  //         emiCoeClass: '5國家排放係數',
  //         emiLevel: '3',
  //         manage1: '6',
  //         manage2: '',
  //         manage3: '3',
  //         manage4: '',
  //       }
  //     case 3:
  //       return {
  //         matCode: '170001',
  //         matName: '車用汽油',
  //         matClassLevel: '2',
  //         matBelType: '有進行外部校正或有多組數據茲佐證者',
  //         matBelLevel: '1',
  //         matInfo: '',
  //         matUnit: '',
  //         sourceClass: '範疇1',
  //         sourceType: '移動',
  //         emiCoeClass: '5國家排放係數',
  //         emiLevel: '3',
  //         manage1: '6',
  //         manage2: '',
  //         manage3: '3',
  //         manage4: '',
  //       }
  //     case 4:
  //       return {
  //         matCode: 'GG1814',
  //         matName: '冷媒－R410a，R32/125（50/50）',
  //         matClassLevel: '3',
  //         matBelType: '未進行儀器校正或未進行紀錄彙整者',
  //         matBelLevel: '3',
  //         matInfo: '',
  //         matUnit: '',
  //         sourceClass: '範疇1',
  //         sourceType: '逸散',
  //         emiCoeClass: '5國家排放係數',
  //         emiLevel: '3',
  //         manage1: '27',
  //         manage2: '',
  //         manage3: '3',
  //         manage4: '',
  //       }
  //     case 6:
  //       return {
  //         matCode: '350099',
  //         matName: '其他電力',
  //         matClassLevel: '1',
  //         matBelType: '有進行外部校正或有多組數據茲佐證者',
  //         matBelLevel: '1',
  //         matInfo: '',
  //         matUnit: '',
  //         sourceClass: '範疇2',
  //         sourceType: '外購電力',
  //         emiCoeClass: '5國家排放係數',
  //         emiLevel: '3',
  //         manage1: '3',
  //         manage2: '',
  //         manage3: '1',
  //         manage4: '',
  //       }
  //   }
  // }

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
        // 單一排放源占排放總量比(%)
        const manage2 = ''
        // 排放量占比加權平均
        const manage4 =
          manage1 === '' || manage2 === ''
            ? ''
            : (parseFloat(manage2) * parseFloat(manage1)).toFixed(2)

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
            manage2, // 單一排放源站排放總量比
            manage3, // 評分區間範圍
            manage4, // 排放量佔比加權平均
            emiCoeList: gasTypes.map((gasType, index) => {
              // Get the emission factor for this index, or use a default empty object if it doesn't exist
              const emissionFactor = emissionFactors[index] || {}
              const emissionData = emissionsList.find((e) => e.gas_type === index + 1) || {} // 依gas_type對應emissions

              return {
                gasType,
                emiCoeType: emissionFactor.factor_type || '1', // Default to '1' (預設)
                emiCoeNum: emissionFactor.factor || 0, // Default to 0
                emiCoeGWP: emissionFactor.GWP || 1, // Default GWP to 1
                emissions: emissionData.emissions || 0,
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
          <Link to="/碳盤查系統/顧問system/定量盤查" className="system-tablist-link">
            <CTab aria-controls="tab3" itemKey={5} className="system-tablist-choose">
              定量盤查
            </CTab>
          </Link>
          <Link to="." className="system-tablist-link">
            <CTab aria-controls="tab3" itemKey={1} className="system-tablist-choose">
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
                        {/* {selectedRowData.manage2} */}
                        {(() => {
                          const totalEmissions =
                            selectedRowData?.emiCoeList?.reduce(
                              (sum, emiCoe) => sum + emiCoe.emissionEquivalent,
                              0,
                            ) || 0

                          let result = '' // 單一排放源排放當量小計

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
                          return result !== ''
                            ? ((result / totalEmissionEquivalent) * 100).toFixed(2) + '%'
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
                      <p>{selectedRowData.manage4}</p>
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
