import React, { useState, useEffect } from 'react'
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
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

export const Vehicle = () => {
  const [isEditModalVisible, setEditModalVisible] = useState(false)
  const [vehicles, setVehicles] = useState([]) // State to hold fetched vehicle data
  const [selectedVehicleId, setSelectedVehicleId] = useState(null) // State to store selected vehicle ID

  // Function to fetch vehicle data
  const getVehicleData = async () => {
    try {
      const response = await fetch('http://localhost:8000/vehicle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      if (response.ok) {
        setVehicles(data.vehicles) // Set vehicle data to state
      } else {
        console.error(`Error ${response.status}: ${data.detail}`)
      }
    } catch (error) {
      console.error('Error fetching vehicle data:', error)
    }
  }

  const deleteVehicle = async (vehicle_id) => {
    try {
      const response = await fetch(`http://localhost:8000/delete_vehicle`, {
        method: 'DELETE',
        body: JSON.stringify({ vehicle_id: vehicle_id }),
      })

      if (response.ok) {
        getVehicleData() // Fetch vehicle data again to update the table
      } else {
        console.error(`Error ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error)
    }
  }

  // Fetch vehicle data on component mount
  useEffect(() => {
    getVehicleData()
  }, [])

  return (
    <div>
      <CTable hover className={styles.activityTable1}>
        <CTableHead className={styles.activityTableHead}>
          <tr>
            <th>發票/收據日期</th>
            <th>發票號碼/收據編號</th>
            <th>油種</th>
            <th>單位</th>
            <th>公升數/金額</th>
            <th>備註</th>
            <th>圖片</th>
            <th>最近編輯</th>
            <th>操作</th>
          </tr>
        </CTableHead>
        <CTableBody className={styles.activityTableBody}>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.vehicle_id}>
              <td>{vehicle.Doc_date}</td>
              <td>{vehicle.Doc_number}</td>
              <td>{vehicle.oil_species ? '柴油' : '汽油'}</td>
              <td>公升</td>
              <td>{vehicle.liters}</td>
              <td>{vehicle.remark}</td>
              <td>
                <Zoom>
                  <img
                    src={`fastapi/${vehicle.img_path}`}
                    alt="receipt"
                    style={{ width: '100px' }}
                  />
                </Zoom>
              </td>
              <td>
                {vehicle.username}
                <br />
                {vehicle.edit_time}
              </td>
              <td>
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  className={styles.iconPen}
                  onClick={() => {
                    setSelectedVehicleId(vehicle.vehicle_id) // Set the selected vehicle ID
                    setEditModalVisible(true) // Open the modal
                  }}
                />
                <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} 
                  onClick={() => {
                    deleteVehicle(vehicle.vehicle_id)
                  }
                }
                />
              </td>
            </tr>
          ))}
        </CTableBody>
      </CTable>
      <EditModal
        isEditModalVisible={isEditModalVisible}
        setEditModalVisible={setEditModalVisible}
        selectedVehicleId={selectedVehicleId}
      />
    </div>
  )
}
