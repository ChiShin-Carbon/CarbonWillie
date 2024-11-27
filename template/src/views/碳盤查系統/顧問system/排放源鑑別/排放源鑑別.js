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
  CFormCheck,
  CForm,
  CFormInput,
  CFormTextarea,
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
  emission_pattern_Map,
  process_category_Map,
  escape_category_Map,
  power_category_Map,
  getSourcePower,
  gas_type_map,
} from '../EmissionSource'

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
  const tableData = emission_sources.map((source) => {
    const gasTypes = source.gas_types
      ? source.gas_types.split(',').map((gasId) => gas_type_map[parseInt(gasId)]) // 轉換為氣體名稱
      : []

    return {
      status: 'completed', // completed or not completed
      process: process_code_Map[source.process_code],
      equipment: device_code_Map[source.device_code],
      material: fuel_code_Map[source.fuel_code],
      details: {
        processCode: source.process_code,
        processName: process_code_Map[source.process_code],
        equipCode: source.device_code,
        equipName: device_code_Map[source.device_code],
        matType: source.fuel_category,
        matCode: source.fuel_code,
        matName: fuel_code_Map[source.fuel_code],
        matbio: source.is_bioenergy,
        sourceClass: source.emission_category,
        sourceType: emission_pattern_Map[source.emission_category][source.emission_pattern - 1],
        sourcePower: getSourcePower(source),
        sourceSupply: source.supplier,
        gasType: gasTypes,
        steamEle: source.is_CHP,
        remark: source.remark,
      },
    }
  })

  const handleRowClick = (row) => {
    setSelectedRowData(row.details)
  }

  const handleInputChange = (e, field) => {
    const value = e.target.value
    setSelectedRowData((prevData) => ({
      ...prevData,
      [field]: value,
      ...(field === 'sourceClass' && { sourceType: emission_pattern_Map[value][0] || '' }), // 根據類別設置初始的 sourceType
      ...(field === 'sourceType' && { sourcePower: '' }), // 選擇 sourceType 後清空 sourcePower
    }))
  }

  const handleGasChange = (gas) => {
    setSelectedRowData((prevData) => {
      const newGaseType = prevData.gaseType.includes(gas)
        ? prevData.gaseType.filter((g) => g !== gas) // 如果已選中，則移除
        : [...prevData.gaseType, gas] // 否則添加
      return { ...prevData, gaseType: newGaseType } // 更新 gaseType
    })
  }

  return (
    <main>
      <CTabs activeItemKey={1}>
        <CTabList variant="underline-border" className="system-tablist">
          <Link to="." className="system-tablist-link">
            <CTab aria-controls="tab1" itemKey={1} className="system-tablist-choose">
              排放源鑑別
            </CTab>
          </Link>
          <Link to="/碳盤查系統/顧問system/活動數據" className="system-tablist-link">
            <CTab aria-controls="tab3" itemKey={2} className="system-tablist-choose">
              活動數據
            </CTab>
          </Link>
          <Link to="/碳盤查系統/顧問system/定量盤查" className="system-tablist-link">
            <CTab aria-controls="tab3" itemKey={3} className="system-tablist-choose">
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
          <Link to="/碳盤查系統/顧問system/全廠電力蒸汽供需情況 " className="system-tablist-link">
            <CTab aria-controls="tab3" itemKey={4} className="system-tablist-choose">
              全廠電力蒸汽供需情況
            </CTab>
          </Link>
        </CTabList>
      </CTabs>

      <div className="system-titlediv">
        <div>
          <h4 className="system-title">排放源鑑別</h4>
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
                <div className={styles.block}>
                  <div className={styles.blockHead}>
                    <h5>製程</h5>
                  </div>
                  <div className={styles.blockBody3}>
                    {/* <div>
                      <span>編號:</span>
                      <p>{selectedRowData.processNum}</p>
                    </div> */}
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
                    {/* <div>
                      <span>編號:</span>
                      <p>{selectedRowData.equipNum}</p>
                    </div> */}
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
                  <div className={styles.blockBody}>
                    <div>
                      <span>類別:</span>
                      <CFormSelect
                        className={styles.input}
                        value={selectedRowData.matType}
                        onChange={(e) => handleInputChange(e, 'matType')} // 更新 matType
                      >
                        <option value="false">原燃物料</option>
                        <option value="true">產品</option>
                      </CFormSelect>
                      <p></p>
                    </div>
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
                      <CFormSelect
                        className={styles.input}
                        value={selectedRowData.matbio}
                        onChange={(e) => handleInputChange(e, 'matbio')}
                      >
                        <option value="true">是</option>
                        <option value="false">否</option>
                      </CFormSelect>
                      <p></p>
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
                      <CFormSelect
                        className={styles.input}
                        value={selectedRowData.sourceClass}
                        onChange={(e) => handleInputChange(e, 'sourceClass')}
                      >
                        <option value="1">範疇1</option>
                        <option value="2">範疇2</option>
                        <option value="3">範疇3</option>
                        {/* <option value="類別4">類別4</option>
                        <option value="類別5">類別5</option>
                        <option value="類別6">類別6</option> */}
                      </CFormSelect>
                    </div>
                    <div>
                      <span>排放型式:</span>
                      <CFormSelect
                        className={styles.input}
                        value={selectedRowData.sourceType}
                        onChange={(e) => handleInputChange(e, 'sourceType')}
                      >
                        {emission_pattern_Map[selectedRowData.sourceClass]?.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </CFormSelect>
                    </div>
                    <div>
                      <span>製程/逸散/外購電力類別:</span>
                      <CFormSelect
                        className={styles.input}
                        value={selectedRowData.sourcePower}
                        onChange={(e) => handleInputChange(e, 'sourcePower')}
                      >
                        {(() => {
                          // 根據 sourceType 選擇對應的映射物件
                          const sourceType = selectedRowData?.sourceType
                          let optionsMap = null

                          if (sourceType === '製程') {
                            optionsMap = process_category_Map
                          } else if (sourceType === '逸散') {
                            optionsMap = escape_category_Map
                          } else if (sourceType === '外購電力') {
                            optionsMap = power_category_Map
                          }
                          // 若找到對應的映射物件，生成選項
                          return optionsMap
                            ? Object.values(optionsMap).map((value) => (
                                <option key={value} value={value}>
                                  {value}
                                </option>
                              ))
                            : null
                        })()}
                      </CFormSelect>
                    </div>
                    <div>
                      <span>電力/蒸汽供應商名稱:</span>
                      <CFormInput
                        className={styles.input}
                        value={selectedRowData.sourceSupply}
                        onChange={(e) => handleInputChange(e, 'sourceSupply')}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.block}>
                  <div className={styles.blockHead}>
                    <h5>可能產生溫室氣體種類</h5>
                  </div>
                  <div className={styles.blockBody}>
                    {['CO2', 'CH4', 'N2O', 'HFCS', 'PFCS', 'SF6', 'NF3'].map((gas) => (
                      <div key={gas}>
                        <CFormCheck
                          id={gas}
                          label={gas}
                          checked={selectedRowData.gasType.includes(gas)} // 預選邏輯
                          onChange={() => handleGasChange(gas)} // 添加 onChange 事件
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.block}>
                  <div className={styles.blockHead}>
                    <h5>是否屬汽電共生設備</h5>
                  </div>
                  <div className={styles.blockBody}>
                    <div>
                      <CFormSelect
                        className={styles.input}
                        value={selectedRowData.steamEle}
                        onChange={(e) => handleInputChange(e, 'steamEle')}
                      >
                        <option value="true">是</option>
                        <option value="false">否</option>
                      </CFormSelect>
                      <p></p>
                    </div>
                  </div>
                </div>

                <div className={styles.block}>
                  <div className={styles.blockHead}>
                    <h5>備註</h5>
                  </div>
                  <div className={styles.blockBody1}>
                    <div>
                      <CFormTextarea
                        className={styles.input}
                        type="text"
                        rows={2}
                        value={selectedRowData.remark}
                        onChange={(e) => handleInputChange(e, 'remark')}
                      />
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
