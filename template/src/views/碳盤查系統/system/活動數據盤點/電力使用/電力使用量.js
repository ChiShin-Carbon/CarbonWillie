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
  const [userPosition, setUserPosition] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [cfvStartDate, setCfvStartDate] = useState(null) // State for baseline start date
  const [cfvEndDate, setCfvEndDate] = useState(null) // State for baseline end date
  
  // Get user position from sessionStorage
  useEffect(() => {
    const position = window.sessionStorage.getItem('position')
    setUserPosition(position ? parseInt(position) : null)
  }, [])
  
  // Check if user has permission to edit/delete
  const hasEditPermission = userPosition !== 1 && userRole !== 0 && userRole !== 1

  // Function to fetch baseline data
  const getBaseline = async () => {
    try {
      const response = await fetch('http://localhost:8000/baseline');
      if (response.ok) {
        const data = await response.json();
        setCfvStartDate(data.baseline.cfv_start_date);
        setCfvEndDate(data.baseline.cfv_end_date);
      } else {
        console.log(response.status);
        setErrorMessage('無法取得基準期間資料');
      }
    } catch (error) {
      console.error('Error fetching baseline:', error);
      setErrorMessage('取得基準期間資料時發生錯誤');
    }
  };

  // Function to fetch electricity usage data with baseline period filter
  const getElectricityUsageData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/Electricity_Usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      if (response.ok) {
        if (cfvStartDate && cfvEndDate) {
          // Filter data based on baseline period
          // For electricity usage, we'll use Doc_date (receipt month) for filtering
          const startDate = new Date(cfvStartDate);
          const endDate = new Date(cfvEndDate);
          
          const filteredData = data.Electricity_Usage.filter(usage => {
            // Create a date from the Doc_date (receipt month)
            // Assuming Doc_date is in format YYYY-MM
            const parts = usage.Doc_date.split('-');
            if (parts.length >= 2) {
              // Create a date for the 1st of the month
              const docDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, 1);
              return docDate >= startDate && docDate <= endDate;
            }
            return false;
          });
          
          setElectricityUsage(filteredData);
        } else {
          // If no baseline dates are available, show all data
          setElectricityUsage(data.Electricity_Usage);
        }
      } else {
        console.error(`Error ${response.status}: ${data.detail}`);
        setErrorMessage(`獲取數據失敗: ${data.detail || response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching electricity usage data:', error);
      setErrorMessage('連接伺服器時發生錯誤');
    } finally {
      setIsLoading(false);
    }
  }

  // Fetch baseline data on component mount
  useEffect(() => {
    getBaseline();
  }, []);

  // Fetch electricity usage data when baseline dates change
  useEffect(() => {
    getElectricityUsageData();
  }, [cfvStartDate, cfvEndDate]);

  // Function to delete electricity usage record
  const deleteElectricityUsage = async (electricity_id) => {
    if (!window.confirm('確定要刪除這筆用電資料嗎？')) {
      return; // User cancelled the deletion
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch(`http://localhost:8000/delete_electricity`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ electricity_id: electricity_id }),
      });

      if (response.ok) {
        // Update local state to remove the deleted item
        setElectricityUsage(prevData => 
          prevData.filter(usage => usage.electricity_id !== electricity_id)
        );
        
        // Fetch data again to ensure sync with backend
        getElectricityUsageData();
      } else {
        const errorData = await response.json();
        setErrorMessage(`刪除失敗: ${errorData.detail || response.statusText}`);
        console.error(`Error ${response.status}: ${errorData.detail || response.statusText}`);
      }
    } catch (error) {
      setErrorMessage('連接伺服器時發生錯誤');
      console.error('Error deleting electricity usage:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
              {hasEditPermission && <th>操作</th>}
            </tr>
          </CTableHead>
          <CTableBody className={styles.activityTableBody}>
            {ElectricityUsage.length > 0 ? (
              ElectricityUsage.map((usage, index) => (
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
                  {hasEditPermission && (
                    <td>
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        className={styles.iconPen}
                        onClick={() => {
                          setEditModalVisible(true)
                          setSelectedUsage(usage.electricity_id)
                        }}
                      />
                      <FontAwesomeIcon 
                        icon={faTrashCan} 
                        className={styles.iconTrash} 
                        onClick={() => deleteElectricityUsage(usage.electricity_id)}
                      />
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={hasEditPermission ? "11" : "10"} style={{ textAlign: 'center', padding: '20px' }}>
                  目前沒有符合基準期間的用電資料
                </td>
              </tr>
            )}
          </CTableBody>
        </CTable>
      )}
      
      {hasEditPermission && (
        <EditModal
          isEditModalVisible={isEditModalVisible}
          setEditModalVisible={setEditModalVisible}
          selectedUsage={selectedUsage}
          refreshElectricityUsageData={getElectricityUsageData}
        />
      )}
    </div>
  )
}