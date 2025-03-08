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
import { getVehicleData } from '../fetchdata'


export const Vehicle = ({refreshVehicleData}) => {
  const [isEditModalVisible, setEditModalVisible] = useState(false)
  const [vehicles, setVehicles] = useState([]) // State to hold fetched vehicle data
  const [selectedVehicleId, setSelectedVehicleId] = useState(null) // State to store selected vehicle ID
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const deleteVehicle = async (vehicle_id) => {
    if (!window.confirm('確定要刪除這筆資料嗎？')) {
      return; // User cancelled the deletion
    }

    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const response = await fetch(`http://localhost:8000/delete_vehicle`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ vehicle_id: vehicle_id }),
      });

      if (response.ok) {
        // Update local state to remove the deleted item
        setVehicles(prevVehicles => 
          prevVehicles.filter(vehicle => vehicle.vehicle_id !== vehicle_id)
        );
        
        // If parent component provided a refresh function, call it
        if (typeof refreshVehicleData === 'function') {
          refreshVehicleData();
        } else {
          // Otherwise fetch data again using local method
          fetchVehicleData();
        }
      } else {
        const errorData = await response.json();
        setErrorMessage(`刪除失敗: ${errorData.detail || response.statusText}`);
        console.error(`Error ${response.status}: ${errorData.detail || response.statusText}`);
      }
    } catch (error) {
      setErrorMessage('連接伺服器時發生錯誤');
      console.error('Error deleting vehicle:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Local fetch function
  const fetchVehicleData = async () => {
    setIsLoading(true);
    try {
      const data = await getVehicleData();
      if (data) {
        setVehicles(data);
      }
    } catch (error) {
      console.error('Error fetching vehicle data:', error);
      setErrorMessage('無法獲取車輛數據');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch vehicle data on component mount
  useEffect(() => {
    fetchVehicleData();
  }, []);

  return (
    <div>
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
      
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
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
            {vehicles.length > 0 ? (
              vehicles.map((vehicle) => (
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
                        setSelectedVehicleId(vehicle.vehicle_id);
                        setEditModalVisible(true);
                      }}
                    />
                    <FontAwesomeIcon
                      icon={faTrashCan}
                      className={styles.iconTrash}
                      onClick={() => {
                        deleteVehicle(vehicle.vehicle_id);
                      }}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="9">目前沒有公務車資料</td></tr>
            )}
          </CTableBody>
        </CTable>
      )}
      
      <EditModal
        isEditModalVisible={isEditModalVisible}
        setEditModalVisible={setEditModalVisible}
        selectedVehicleId={selectedVehicleId}
        refreshVehicleData={() => fetchVehicleData()}
      />
    </div>
  )
}