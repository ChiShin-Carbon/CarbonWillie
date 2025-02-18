// functions.js
import React, { useState, useEffect } from 'react'
import {
  CTable,
  CTableHead,
  CTableBody,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CForm,
  CButton,
  CFormLabel,
  CFormInput,
  CFormTextarea,
  CRow,
  CCol,
  CCollapse,
  CCard,
  CCardBody,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import styles from '../../../../../scss/活動數據盤點.module.css'
import EditModal from './編輯Modal.js'
import AddFillModal from './新增填充Modal.js'
import EditFillModal from './編輯填充Modal.js'

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

export const Electricity = () => {
  const [isEditModalVisible, setEditModalVisible] = useState(false)
  const [isAddFillModalVisible, setAddFillModalVisible] = useState(false)
  const [isEditFillModalVisible, setEditFillModalVisible] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null) // 用於追蹤展開的列
  const [selectedElectricity, setSelectedElectricity] = useState(null) // Store selected electricity for edit
  const [selectedFill, setSelectedFill] = useState(null) // Store selected fill for edit
  const [selectedElectricityId, setSelectedElectricityId] = useState(null) // Store selected electricity for fill

  const [electricities, setElectricities] = useState([]) // State to hold fetched electricity data
  // Function to fetch electricity data
  const getElectricityData = async () => {
    try {
      const response = await fetch('http://localhost:8000/Electricity', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      if (response.ok) {
        setElectricities(data.electricities) // Set electricity data to state
      } else {
        console.error(`Error ${response.status}: ${data.detail}`)
      }
    } catch (error) {
      console.error('Error fetching electricity data:', error)
    }
  }

  // Fetch electricity data on component mount
  useEffect(() => {
    getElectricityData()
  }, [])

  const toggleRow = (index) => {
    setSelectedRow(selectedRow === index ? null : index)
  }

  return (
    <div>
      <CTable hover className={styles.activityTable1}>
        <CTableHead className={styles.activityTableHead}>
          <tr>
            <th>電號</th>
            <th>備註</th>
            <th>最近編輯</th>
            <th>操作</th>
          </tr>
        </CTableHead>
        <CTableBody className={styles.activityTableBody}>
          {electricities.map((electricity, electricity_id) => (
            <React.Fragment key={electricity.electricity_id}>
              <tr onClick={() => toggleRow(electricity_id)} className={styles.trChoose}>
                <td>{electricity.customer_number}</td>
                <td>{electricity.remark}</td>
                <td>
                  {electricity.username}
                  <br />
                  {electricity.edit_time}
                </td>
                <td>
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    className={styles.iconPen}
                    onClick={() => {
                      setEditModalVisible(true)
                      setSelectedElectricity(electricity.electricity_id)
                    }}
                  />
                  <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                </td>
              </tr>
              {selectedRow === electricity_id && (
                <td colSpan="9">
                  <div className={styles.expandedContent}>
                    {/* 在展開的區塊中放置你需要的內容 */}
                    <div className={styles.fill}>
                      <div>填充紀錄</div>
                      <button
                        onClick={() => {
                          setAddFillModalVisible(true)
                          const electricityId = electricity.electricity_id // Capture the ID directly
                          setSelectedElectricityId(electricityId)
                          console.log(electricityId) // Log the correct ID
                        }}
                      >
                        新增
                      </button>
                    </div>
                    <table>
                      {electricity.fillrec && electricity.fillrec.length > 0 && (
                        <>
                          <tr>
                            <th>收據月份</th>
                            <th>收據編號</th>
                            <th>用電期間(起)</th>
                            <th>用電期間(迄)</th>
                            <th>填寫類型</th>
                            <th>當月總用電量/總金額</th>
                            <th>當月碳排量</th>
                            <th>備註</th>
                            <th>圖片</th>
                            <th>最近編輯</th>
                            <th>操作</th>
                          </tr>
                          {electricity.fillrec.map((fill, index) => (
                            <tr key={fill.usage_id}>
                              <td>{fill.Doc_date}</td>
                              <td>{fill.Doc_number}</td>
                              <td>{fill.period_start}</td>
                              <td>{fill.period_end}</td>
                              <td>{fill.electricity_type === 1 ? '總用電量' : '總金額'}</td>
                              <td>{fill.electricity_type === 1 ? fill.usage : fill.amount}</td>
                              <td>{fill.carbon_emission}</td>
                              <td>{fill.usage_remark}</td>
                              <td>
                                <Zoom>
                                  <img
                                    src={`fastapi/${fill.usage_img_path}`}
                                    alt="receipt"
                                    style={{ width: '100px' }}
                                  />
                                </Zoom>
                              </td>
                              <td>
                                {fill.usage_username}
                                <br />
                                {fill.usage_edit_time}
                              </td>
                              <td>
                                <FontAwesomeIcon
                                  icon={faPenToSquare}
                                  className={styles.iconPen}
                                  onClick={() => {
                                    setEditFillModalVisible(true)
                                    setSelectedFill(fill.usage_id)
                                  }}
                                />
                                <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                              </td>
                            </tr>
                          ))}
                        </>
                      )}
                    </table>
                  </div>
                </td>
              )}
            </React.Fragment>
          ))}
        </CTableBody>
      </CTable>
      <EditModal
        isEditModalVisible={isEditModalVisible}
        setEditModalVisible={setEditModalVisible}
        selectedElectricity={selectedElectricity}
      />

      {/* 填充新增編輯modal */}
      <AddFillModal
        isAddFillModalVisible={isAddFillModalVisible}
        setAddFillModalVisible={setAddFillModalVisible}
        selectedElectricityId={selectedElectricityId}
      />

      <EditFillModal
        isEditFillModalVisible={isEditFillModalVisible}
        setEditFillModalVisible={setEditFillModalVisible}
        selectedFill={selectedFill}
      />
    </div>
  )
}
