// Electricity.js
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
import { getElectricityData } from '../fetchdata.js'

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

export const Electricity = ({ refreshElectricityData }) => {
  const [isEditModalVisible, setEditModalVisible] = useState(false)
  const [isAddFillModalVisible, setAddFillModalVisible] = useState(false)
  const [isEditFillModalVisible, setEditFillModalVisible] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null) // 用於追蹤展開的列
  const [selectedElectricity, setSelectedElectricity] = useState(null) // Store selected electricity for edit
  const [selectedFill, setSelectedFill] = useState(null) // Store selected fill for edit
  const [selectedElectricityId, setSelectedElectricityId] = useState(null) // Store selected electricity for fill
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [userPosition, setUserPosition] = useState(null)
  const [cfvStartDate, setCfvStartDate] = useState(null) // State for baseline start date
  const [cfvEndDate, setCfvEndDate] = useState(null) // State for baseline end date
  const [userRole, setUserRole] = useState(null)


  // Get user position from sessionStorage
  useEffect(() => {
    const storedUserPosition = window.sessionStorage.getItem('position');
    const storedUserRole = window.sessionStorage.getItem('role');
    setUserPosition(storedUserPosition ? parseInt(storedUserPosition) : null);
    setUserRole(storedUserRole ? parseInt(storedUserRole) : null);
  }, [])

  // Check if user has permission to edit/delete
  const hasEditPermission = userPosition !== 1 && userRole !== 0 && userRole !== 1

  const [electricities, setElectricities] = useState([]) // State to hold fetched electricity data

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

  const deleteElectricity = async (electricity_id) => {
    try {
      const response = await fetch(`http://localhost:8000/delete_Electricity`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ electricity_id }),
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json();
        return {
          success: false,
          error: `刪除失敗: ${errorData.detail || response.statusText}`
        };
      }
    } catch (error) {
      console.error('Error deleting electricity:', error);
      return {
        success: false,
        error: '連接伺服器時發生錯誤'
      };
    }
  };

  const deleteElectricityFill = async (usage_id) => {
    try {
      const response = await fetch(`http://localhost:8000/delete_ElectricityUsage`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usage_id }),
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json();
        return {
          success: false,
          error: `刪除失敗: ${errorData.detail || response.statusText}`
        };
      }
    } catch (error) {
      console.error('Error deleting electricity usage:', error);
      return {
        success: false,
        error: '連接伺服器時發生錯誤'
      };
    }
  };
// Function to fetch electricity data with baseline period filter
const fetchElectricityData = async () => {
  setIsLoading(true);
  try {
    const data = await getElectricityData();
    if (data && cfvStartDate && cfvEndDate) {
      const startDate = new Date(cfvStartDate);
      const endDate = new Date(cfvEndDate);
      
      console.log('CFV Start Date:', cfvStartDate, 'Parsed:', startDate);
      console.log('CFV End Date:', cfvEndDate, 'Parsed:', endDate);
      
      const filteredData = data.map(electricity => {
        // Filter fill records that fall within the baseline period
        let filteredFillrec = [];
        if (electricity.fillrec && electricity.fillrec.length > 0) {
          filteredFillrec = electricity.fillrec.filter(fill => {
            // Parse the full date (YYYY-MM-DD format)
            const docDate = new Date(fill.Doc_date);
            
            console.log('Doc_date:', fill.Doc_date, 'Parsed:', docDate);
            console.log('In range:', docDate >= startDate && docDate <= endDate);
            
            // Check if the date is valid
            if (isNaN(docDate.getTime())) {
              console.warn('Invalid date parsed from:', fill.Doc_date);
              return false;
            }
            
            return docDate >= startDate && docDate <= endDate;
          });
          
          console.log(`Electricity ${electricity.electricity_id}: ${electricity.fillrec.length} total records, ${filteredFillrec.length} filtered records`);
        }
        
        return {
          ...electricity,
          fillrec: filteredFillrec
        };
      });
      
      console.log('Total electricity meters:', filteredData.length);
      console.log('Meters with CFV period data:', filteredData.filter(e => e.fillrec && e.fillrec.length > 0).length);
      
      setElectricities(filteredData);
    } else if (data) {
      // If no baseline dates available yet, show all data
      console.log('No CFV dates available, showing all data');
      setElectricities(data);
    }
  } catch (error) {
    console.error('Error fetching electricity data:', error);
    setErrorMessage('無法獲取用電數據');
  } finally {
    setIsLoading(false);
  }
};

  // Fetch baseline data on component mount
  useEffect(() => {
    getBaseline();
  }, []);

  // Fetch electricity data when baseline dates change
  useEffect(() => {
    fetchElectricityData();
  }, [cfvStartDate, cfvEndDate]);

  // Function to delete an electricity record
  const handleDeleteElectricity = async (electricity_id) => {
    if (!window.confirm('確定要刪除這筆電號資料嗎？此操作將同時刪除所有相關的電力使用記錄。')) {
      return; // User cancelled the deletion
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await deleteElectricity(electricity_id);

      if (result.success) {
        // Update local state to remove the deleted item
        setElectricities(prevElectricities =>
          prevElectricities.filter(electricity => electricity.electricity_id !== electricity_id)
        );

        // If parent component provided a refresh function, call it
        if (typeof refreshElectricityData === 'function') {
          refreshElectricityData();
        } else {
          // Otherwise fetch data again
          fetchElectricityData();
        }
      } else {
        setErrorMessage(result.error);
      }
    } catch (error) {
      setErrorMessage('連接伺服器時發生錯誤');
      console.error('Error deleting electricity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to delete a fill record
  const handleDeleteFill = async (usage_id) => {
    if (!window.confirm('確定要刪除這筆電力使用記錄嗎？')) {
      return; // User cancelled the deletion
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await deleteElectricityFill(usage_id);

      if (result.success) {
        // Update local state to remove the deleted fill record
        setElectricities(prevElectricities =>
          prevElectricities.map(electricity => ({
            ...electricity,
            fillrec: electricity.fillrec ?
              electricity.fillrec.filter(fill => fill.usage_id !== usage_id) :
              []
          }))
        );

        // If parent component provided a refresh function, call it
        if (typeof refreshElectricityData === 'function') {
          refreshElectricityData();
        } else {
          // Otherwise fetch data again
          fetchElectricityData();
        }
      } else {
        setErrorMessage(result.error);
      }
    } catch (error) {
      setErrorMessage('連接伺服器時發生錯誤');
      console.error('Error deleting fill record:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRow = (index) => {
    setSelectedRow(selectedRow === index ? null : index)
  }

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
              <th>電號</th>
              <th>備註</th>
              <th>最近編輯</th>
              {hasEditPermission && <th>操作</th>}
            </tr>
          </CTableHead>
          <CTableBody className={styles.activityTableBody}>
            {electricities.length > 0 ? (
              electricities.map((electricity, index) => (
                <React.Fragment key={electricity.electricity_id}>
                  <tr onClick={() => toggleRow(index)} className={styles.trChoose}>
                    <td>{electricity.customer_number}</td>
                    <td>{electricity.remark}</td>
                    <td>
                      {electricity.username}
                      <br />
                      {electricity.edit_time}
                    </td>
                    {hasEditPermission && (
                      <td>
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          className={styles.iconPen}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row toggle
                            setEditModalVisible(true);
                            setSelectedElectricity(electricity.electricity_id);
                          }}
                        />
                        <FontAwesomeIcon
                          icon={faTrashCan}
                          className={styles.iconTrash}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row toggle
                            handleDeleteElectricity(electricity.electricity_id);
                          }}
                        />
                      </td>
                    )}
                  </tr>
                  {selectedRow === index && (
                    <tr>
                      <td colSpan={hasEditPermission ? "4" : "3"}>
                        <div className={styles.expandedContent}>
                          <div className={styles.fill}>
                            <div>電力使用紀錄</div>
                            {hasEditPermission && (
                              <button
                                onClick={() => {
                                  setAddFillModalVisible(true);
                                  setSelectedElectricityId(electricity.electricity_id);
                                }}
                              >
                                新增
                              </button>
                            )}
                          </div>
                          <table>
                            {electricity.fillrec && electricity.fillrec.length > 0 ? (
                              <>
                                <thead>
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
                                </thead>
                                <tbody>
                                  {electricity.fillrec.map((fill) => (
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
                                      {hasEditPermission && (
                                        <td>
                                          <FontAwesomeIcon
                                            icon={faPenToSquare}
                                            className={styles.iconPen}
                                            onClick={() => {
                                              setEditFillModalVisible(true);
                                              setSelectedFill(fill.usage_id);
                                            }}
                                          />
                                          <FontAwesomeIcon
                                            icon={faTrashCan}
                                            className={styles.iconTrash}
                                            onClick={() => {
                                              handleDeleteFill(fill.usage_id);
                                            }}
                                          />
                                        </td>
                                      )}
                                    </tr>
                                  ))}
                                </tbody>
                              </>
                            ) : (
                              <tr>
                                <td colSpan={hasEditPermission ? "11" : "10"} style={{ textAlign: 'center', padding: '10px' }}>
                                  沒有符合基準期間的電力使用記錄
                                </td>
                              </tr>
                            )}
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={hasEditPermission ? "4" : "3"} style={{ textAlign: 'center', padding: '20px' }}>
                  沒有用電活動數據
                </td>
              </tr>
            )}
          </CTableBody>
        </CTable>
      )}

      {hasEditPermission && (
        <>
          <EditModal
            isEditModalVisible={isEditModalVisible}
            setEditModalVisible={setEditModalVisible}
            selectedElectricity={selectedElectricity}
            refreshElectricityData={refreshElectricityData || fetchElectricityData}
          />

          {/* 填充新增編輯modal */}
          <AddFillModal
            isAddFillModalVisible={isAddFillModalVisible}
            setAddFillModalVisible={setAddFillModalVisible}
            selectedElectricityId={selectedElectricityId}
            refreshElectricityData={refreshElectricityData || fetchElectricityData}
          />

          <EditFillModal
            isEditFillModalVisible={isEditFillModalVisible}
            setEditFillModalVisible={setEditFillModalVisible}
            selectedFill={selectedFill}
            refreshElectricityData={refreshElectricityData || fetchElectricityData}
          />
        </>
      )}
    </div>
  )
}