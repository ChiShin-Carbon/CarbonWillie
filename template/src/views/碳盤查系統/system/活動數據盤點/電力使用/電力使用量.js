import React, { useState, useEffect } from 'react' // Added `useEffect` import
import {
  CTable,
  CTableHead,
  CTableBody,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CForm,
  CButton,
  CFormLabel,
  CFormInput,
  CFormTextarea,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import styles from '../../../../../scss/活動數據盤點.module.css'
import EditModal from './編輯Modal.js'

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

export const ElectricityUsage = () => {
  const [isEditModalVisible, setEditModalVisible] = useState(false)
  const [ElectricityUsage, setElectricityUsage] = useState([]) // State to hold fetched electricity usage data
  const [selectedUsage, setSelectedUsage] = useState(null) // Store selected usage for edit

  // Function to fetch electricity usage data
  const getElectricityUsageData = async () => {
    try {
      const response = await fetch('http://localhost:8000/Electricity_Usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      if (response.ok) {
        setElectricityUsage(data.Electricity_Usage) // Set data to state
      } else {
        console.error(`Error ${response.status}: ${data.detail}`)
      }
    } catch (error) {
      console.error('Error fetching electricity usage data:', error)
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    getElectricityUsageData()
  }, [])

  return (
    <div>
      <CTable hover className={styles.activityTableLong}>
        <CTableHead className={styles.activityTableHead}>
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
        </CTableHead>
        <CTableBody className={styles.activityTableBody}>
          {ElectricityUsage.map((usage, index) => (
            <tr key={index}>
              <td>{usage.Doc_date}</td>
              <td>{usage.Doc_number}</td>
              <td>{usage.period_start}</td>
              <td>{usage.period_end}</td>
              <td>{usage.electricity_type === 1 ? '總用電量' : '總金額'}</td>
              <td>{usage.electricity_type === 1 ? usage.usage : usage.amount}</td>
              <td>{usage.carbon_emission}</td>
              <td>{usage.remark}</td>
              <td>
                <Zoom>
                  <img src={`fastapi/${usage.img_path}`} alt="receipt" style={{ width: '100px' }} />
                </Zoom>
              </td>
              <td>
                {usage.username}
                <br />
                {usage.edit_time}
              </td>
              <td>
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  className={styles.iconPen}
                  onClick={() => {
                    setEditModalVisible(true)
                    setSelectedUsage(usage.electricity_id)
                  }}
                />
                <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
              </td>
            </tr>
          ))}
        </CTableBody>
      </CTable>
      <EditModal
        isEditModalVisible={isEditModalVisible}
        setEditModalVisible={setEditModalVisible}
        selectedUsage={selectedUsage}
      />
    </div>
  )
}
