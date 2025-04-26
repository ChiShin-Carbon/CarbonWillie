import React, { useState, useEffect } from 'react'
import {
  CCard,
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
import { faCircleCheck, faCircleXmark, faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { Tooltip } from 'react-tooltip'

import { process_code_Map, device_code_Map, fuel_code_Map, gas_type_map } from '../EmissionSource'

const Tabs = () => {
  // 設定 state 來儲存選擇的行數據，初始值為 null
  const [selectedRowData, setSelectedRowData] = useState(null)

  const [emission_sources, setEmissionSources] = useState([])
  const getEmissionSource = async () => {
    try {
      const response = await fetch('http://localhost:8000/emission_source')
      if (response.ok) {
        const data = await response.json()
        setEmissionSources(data.emission_sources)
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
        ? [{ activity_data: '', activity_data_unit: '', save_unit: '', data_type: '' }]
        : source.activity_data

      const gasTypes = source.gas_types
        ? source.gas_types.split(',').map((gasId) => gas_type_map[parseInt(gasId)]) // 轉換為氣體名稱
        : []

      const emissionFactors = source.emission_factors || {}

      return activityData.map((activity) => ({
        status: 'completed',
        process: process_code_Map[source.process_code],
        equipment: device_code_Map[source.device_code],
        material: fuel_code_Map[source.fuel_code],
        details: {
          act95down: '',
          act95up: '',
          actSource: activity.data_source || '',
          actUnit: activity.save_unit || '',
          green: gasTypes,
          greenList: gasTypes.map((gasType, index) => {
            const activityData = parseFloat(activity.activity_data)
            const factor = emissionFactors[index]?.factor
            const GWP = emissionFactors[index]?.GWP
            return {
              gasType,
              greenNum: (activityData / 1000) * factor * GWP,
            }
          }),
          green95down: '',
          green95up: '',
          greenSource: '',
          greenUnit: '',
          single95down: '',
          single95up: '',
          singleEmi95down: '',
          singeEmi95up: '',
        },
      }))
    })
    .flat()

  const handleRowClick = (row) => {
    setSelectedRowData(row.details)
  }

  const handleInputChange = (e, field) => {
    const value = e.target.value
    setSelectedRowData((prevData) => ({
      ...prevData,
      [field]: value,
    }))
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
          <Link to="/碳盤查系統/顧問system/定量盤查" className="system-tablist-link">
            <CTab aria-controls="tab3" itemKey={6} className="system-tablist-choose">
              定量盤查
            </CTab>
          </Link>
          <Link to="/碳盤查系統/顧問system/數據品質管理" className="system-tablist-link">
            <CTab aria-controls="tab3" itemKey={5} className="system-tablist-choose">
              數據品質管理
            </CTab>
          </Link>
          <Link to="." className="system-tablist-link">
            <CTab aria-controls="tab3" itemKey={1} className="system-tablist-choose">
              不確定性量化評估
            </CTab>
          </Link>
          {/* <Link to="/碳盤查系統/顧問system/全廠電力蒸汽供需情況 " className="system-tablist-link">
            <CTab aria-controls="tab3" itemKey={2} className="system-tablist-choose">
              全廠電力蒸汽供需情況
            </CTab>
          </Link> */}
        </CTabList>
      </CTabs>

      <div className="system-titlediv">
        <div>
          <h4 className="system-title">不確定性量化評估</h4>
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
                </div>
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
                  </div>
                </div> */}
                <div className={styles.block}>
                  <div className={styles.blockHead}>
                    <h5>
                      活動數據之不確定性
                      <span
                        style={{ marginLeft: '8px', position: 'relative', display: 'inline-block' }}
                      >
                        <FontAwesomeIcon
                          icon={faCircleInfo}
                          style={{ fontSize: '18px', cursor: 'pointer' }}
                          data-tooltip-id="info-tooltip"
                        />
                        <Tooltip
                          id="info-tooltip"
                          place="right"
                          effect="solid"
                          style={{ fontSize: '14px', padding: '6px 10px' }}
                        >
                          ± 誤差值（%）× 擴充係數 = ± 誤差值（%）× 2
                        </Tooltip>
                      </span>
                    </h5>
                  </div>
                  <div className={styles.blockBody}>
                    <div>
                      <span>95%信賴區間之下限:</span>
                      <CFormInput
                        className={styles.input}
                        value={selectedRowData.act95down}
                        onChange={(e) => handleInputChange(e, 'act95down')}
                      />
                    </div>
                    <div>
                      <span>95%信賴區間之上限:</span>
                      <CFormInput
                        className={styles.input}
                        value={selectedRowData.act95up}
                        onChange={(e) => handleInputChange(e, 'act95up')}
                      />
                    </div>
                    <div>
                      <span>數據來源:</span>
                      <CFormInput
                        className={styles.input}
                        value={selectedRowData.actSource}
                        onChange={(e) => handleInputChange(e, 'actSource')}
                      />
                    </div>
                    <div>
                      <span>活動數據保存單位:</span>
                      <CFormInput
                        className={styles.input}
                        value={selectedRowData.actUnit}
                        onChange={(e) => handleInputChange(e, 'actUnit')}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.block}>
                  <div className={styles.blockHead}>
                    <h5>排放係數不確定性</h5>
                  </div>
                  {selectedRowData.greenList &&
                    selectedRowData.greenList.length > 0 &&
                    selectedRowData.greenList.map((green, index) => (
                      <>
                        <div key={index} className={styles.blockBodySpecial}>
                          <div className={styles.blockBodyTitle}>
                            <div className={styles.line}></div>
                            <div className={styles.titleBox}>
                              <span>{`溫室氣體#${index + 1}`}</span>
                            </div>
                            <div className={styles.line}></div>
                          </div>
                          <div className={styles.blockBody}>
                            <div>
                              <span>溫室氣體:</span>
                              <p>{green.gasType}</p>
                            </div>
                            <div>
                              <span>溫室氣體排放當量(噸CO2e/年):</span>
                              <p>{green.greenNum}</p>
                            </div>
                            <div>
                              <span>95%信賴區間之下限:</span>
                              <CFormInput
                                className={styles.input}
                                value={selectedRowData.green95down}
                                onChange={(e) => handleInputChange(e, 'green95down')}
                              />
                            </div>
                            <div>
                              <span>95%信賴區間之上限:</span>
                              <CFormInput
                                className={styles.input}
                                value={selectedRowData.green95up}
                                onChange={(e) => handleInputChange(e, 'green95up')}
                              />
                            </div>
                            <div>
                              <span>係數不確定性資料來源:</span>
                              <CFormInput
                                className={styles.input}
                                value={selectedRowData.greenSource}
                                onChange={(e) => handleInputChange(e, 'greenSource')}
                              />
                            </div>
                            <div>
                              <span>排放係數保存單位:</span>
                              <CFormInput
                                className={styles.input}
                                value={selectedRowData.greenUnit}
                                onChange={(e) => handleInputChange(e, 'greenUnit')}
                              />
                            </div>
                            <div>
                              <span>
                                單一溫室氣體不確定性
                                <br />
                                95%信賴區間之下限:
                              </span>
                              <p>{selectedRowData.single95down}</p>
                            </div>
                            <div>
                              <span>
                                單一溫室氣體不確定性
                                <br />
                                95%信賴區間之上限:
                              </span>
                              <p>{selectedRowData.single95up}</p>
                            </div>
                          </div>
                          <hr />
                        </div>
                      </>
                    ))}
                </div>

                <div className={styles.block}>
                  <div className={styles.blockHead}>
                    <h5>單一排放源不確定性</h5>
                  </div>
                  <div className={styles.blockBody}>
                    <div>
                      <span>95%信賴區間之下限:</span>
                      <p>{selectedRowData.singeEmi95down}</p>
                    </div>
                    <div>
                      <span>95%信賴區間之上限:</span>
                      <p>{selectedRowData.singeEmi95up}</p>
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
