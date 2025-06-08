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

import { getRefrigerantData } from '../fetchdata.js'

export const Refrigerant = ({refreshRefrigerantData}) => {
  const [isEditModalVisible, setEditModalVisible] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null) // 用於追蹤展開的列
  const currentFunction = 'Refrigerant'

  const [isAddFillModalVisible, setAddFillModalVisible] = useState(false)
  const [isEditFillModalVisible, setEditFillModalVisible] = useState(false)

  const [selectedRefId, setSelectedRefId] = useState(null)
  const [selectedFillId, setSelectedFillId] = useState(null)
  const [selectedRef, setSelectedRef] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [userPosition, setUserPosition] = useState(null)
  const [cfvStartDate, setCfvStartDate] = useState(null)  // State for baseline start date
  const [cfvEndDate, setCfvEndDate] = useState(null)  // State for baseline end date
  const [userRole, setUserRole] = useState(null)

  
  // Get user position from sessionStorage
  useEffect(() => {
    const storedUserPosition = window.sessionStorage.getItem('position');
    const storedUserRole = window.sessionStorage.getItem('role');
    setUserPosition(storedUserPosition ? parseInt(storedUserPosition) : null);
    setUserRole(storedUserRole ? parseInt(storedUserRole) : null);
  }, [])

  // Check if user has permission to edit/delete/add
  const hasEditPermission = userPosition !== 1 && userRole !== 0 && userRole !== 1

  const device_type_Map = {
    1: '冰箱',
    2: '冷氣機',
    3: '飲水機',
    4: '冰水主機',
    5: '空壓機',
    6: '除濕機',
    7: '車用冷媒',
    8: '製冰機',
    9: '冰櫃',
    10: '冷凍櫃',
    11: '其他'
  }

  const refrigerant_type_Map = {
    1: 'R11', // Replace with actual refrigerant_type names
    2: 'R12',
    3: 'R22',
    4: 'R-32',
    5: 'R-123',
    6: 'R-23',
    7: 'R-134a',
    8: 'R-404A',
    9: 'R-407C',
    10: 'R-410A',
    11: 'R-600a',
    12: 'R-417a',
    13: 'F22',
    14: 'HCR-600A',
    15: 'HFC-134a',
    16: 'R401A',
    17: '其他',
  }

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
// Function to fetch refrigerant data with baseline period filter
const fetchRefrigerantData = async () => {
  setIsLoading(true);
  try {
    const data = await getRefrigerantData();
    if (data && cfvStartDate && cfvEndDate) {
      const startDate = new Date(cfvStartDate);
      const endDate = new Date(cfvEndDate);
      
      const filteredData = data.map(refrigerant => {
        // Filter fill records that fall within the baseline period
        let filteredFillrec = [];
        if (refrigerant.fillrec && refrigerant.fillrec.length > 0) {
          filteredFillrec = refrigerant.fillrec.filter(fill => {
            const docDate = new Date(fill.Doc_date);
            return docDate >= startDate && docDate <= endDate;
          });
        }
        
        return {
          ...refrigerant,
          fillrec: filteredFillrec
        };
      });
      // Don't filter out refrigerant records - show all refrigerant devices
      // Only the fill records are filtered by CFV period
      
      setRefrigerants(filteredData);
    } else if (data) {
      // If no baseline dates are available yet, show all data
      setRefrigerants(data);
    }
  } catch (error) {
    console.error('Error fetching refrigerant data:', error);
    setErrorMessage('無法獲取冷媒數據');
  } finally {
    setIsLoading(false);
  }
};

  // Function to toggle expanded row
  const toggleRow = (rowIndex) => {
    if (selectedRow === rowIndex) {
      // If the clicked row is already selected, close it
      setSelectedRow(null);
    } else {
      // Otherwise, select the clicked row
      setSelectedRow(rowIndex);
    }
  };

  const [refrigerants, setRefrigerants] = useState([]) // State to hold fetched refrigerant data

  // Fetch baseline data on component mount
  useEffect(() => {
    getBaseline();
  }, []);

  // Fetch refrigerant data when baseline dates change
  useEffect(() => {
    fetchRefrigerantData();
  }, [cfvStartDate, cfvEndDate]);

  // Function to delete a refrigerant record
  const deleteRefrigerant = async (refrigerant_id) => {
    if (!window.confirm('確定要刪除這筆冷媒資料嗎？此操作將同時刪除所有相關的填充記錄。')) {
      return; // User cancelled the deletion
    }

    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const response = await fetch(`http://localhost:8000/delete_refrigerant`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refrigerant_id: refrigerant_id }),
      });

      if (response.ok) {
        // Update local state to remove the deleted item
        setRefrigerants(prevRefrigerants => 
          prevRefrigerants.filter(refrigerant => refrigerant.refrigerant_id !== refrigerant_id)
        );
        
        // Close expanded row if it was the deleted one
        setSelectedRow(null);
        
        // If parent component provided a refresh function, call it
        if (typeof refreshRefrigerantData === 'function') {
          refreshRefrigerantData();
        } else {
          // Otherwise fetch data again
          fetchRefrigerantData();
        }
      } else {
        const errorData = await response.json();
        setErrorMessage(`刪除失敗: ${errorData.detail || response.statusText}`);
        console.error(`Error ${response.status}: ${errorData.detail || response.statusText}`);
      }
    } catch (error) {
      setErrorMessage('連接伺服器時發生錯誤');
      console.error('Error deleting refrigerant:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to delete a fill record
  const deleteFill = async (fillrec_id) => {
    if (!window.confirm('確定要刪除這筆填充記錄嗎？')) {
      return; // User cancelled the deletion
    }

    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const response = await fetch(`http://localhost:8000/delete_refrigerant_fill`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fillrec_id: fillrec_id }),
      });

      if (response.ok) {
        // Update local state to remove the deleted fill record
        setRefrigerants(prevRefrigerants => 
          prevRefrigerants.map(refrigerant => ({
            ...refrigerant,
            fillrec: refrigerant.fillrec ? 
              refrigerant.fillrec.filter(fill => fill.fillrec_id !== fillrec_id) : 
              []
          }))
        );
        
        // If parent component provided a refresh function, call it
        if (typeof refreshRefrigerantData === 'function') {
          refreshRefrigerantData();
        } else {
          // Otherwise fetch data again
          fetchRefrigerantData();
        }
      } else {
        const errorData = await response.json();
        setErrorMessage(`刪除失敗: ${errorData.detail || response.statusText}`);
        console.error(`Error ${response.status}: ${errorData.detail || response.statusText}`);
      }
    } catch (error) {
      setErrorMessage('連接伺服器時發生錯誤');
      console.error('Error deleting fill record:', error);
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
        <CTable hover className={styles.activityTable1}>
          <CTableHead className={styles.activityTableHead}>
            <tr>
              <th>設備類型</th>
              <th>設備位置</th>
              <th>冷媒類型</th>
              <th>備註</th>
              <th>圖片</th>
              <th>最近編輯</th>
              {hasEditPermission && <th>操作</th>}
            </tr>
          </CTableHead>
          <CTableBody className={styles.activityTableBody}>
            {refrigerants.length > 0 ? (
              refrigerants.map((refrigerant, refrigerant_id) => (
                <React.Fragment key={refrigerant.refrigerant_id}>
                  <tr onClick={() => toggleRow(refrigerant_id)} className={styles.trChoose}>
                    <td>{device_type_Map[refrigerant.device_type]}</td>
                    <td>{refrigerant.device_location}</td>
                    <td>{refrigerant_type_Map[refrigerant.refrigerant_type]}</td>
                    <td>{refrigerant.remark}</td>
                    <td>
                      <Zoom>
                        <img
                          src={`fastapi/${refrigerant.img_path}`}
                          alt="receipt"
                          style={{ width: '100px' }}
                        />
                      </Zoom>
                    </td>
                    <td>
                      {refrigerant.username}
                      <br />
                      {new Date(refrigerant.edit_time).toLocaleString('zh-TW', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false
                      })}
                    </td>
                    {hasEditPermission && (
                      <td>
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          className={styles.iconPen}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row toggle when clicking the edit icon
                            setEditModalVisible(true);
                            setSelectedRef(refrigerant.refrigerant_id);
                          }}
                        />
                        <FontAwesomeIcon
                          icon={faTrashCan}
                          className={styles.iconTrash}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row toggle when clicking the trash icon
                            deleteRefrigerant(refrigerant.refrigerant_id);
                          }}
                        />
                      </td>
                    )}
                  </tr>
                  {selectedRow === refrigerant_id && (
                    <tr>
                      <td colSpan={hasEditPermission ? "7" : "6"}>
                        <div className={styles.expandedContent}>
                          <div className={styles.fill}>
                            <div>填充紀錄</div>
                            {hasEditPermission && (
                              <button onClick={() => {
                                setAddFillModalVisible(true);
                                const selectedRefId = refrigerant.refrigerant_id;
                                setSelectedRefId(selectedRefId);
                                console.log(selectedRefId);
                              }}>新增</button>
                            )}
                          </div>
                          <table>
                            {refrigerant.fillrec && refrigerant.fillrec.length > 0 ? (
                              <>
                                <thead>
                                  <tr>
                                    <th>發票/收據日期</th>
                                    <th>發票號碼/收據編號</th>
                                    <th>填充量</th>
                                    <th>逸散率(%)</th>
                                    <th>備註</th>
                                    <th>圖片</th>
                                    <th>最近編輯</th>
                                    {hasEditPermission && <th>操作</th>}
                                  </tr>
                                </thead>
                                <tbody>
                                  {refrigerant.fillrec.map((fill, index) => (
                                    <tr key={fill.fillrec_id}>
                                      <td>{fill.Doc_date}</td>
                                      <td>{fill.Doc_number}</td>
                                      <td>{fill.usage}</td>
                                      <td>{fill.escape_rate}</td>
                                      <td>{fill.fillrec_remark}</td>
                                      <td>
                                        <Zoom>
                                          <img
                                            src={`fastapi/${fill.fillrec_img_path}`}
                                            alt="receipt"
                                            style={{ width: '100px' }}
                                          />
                                        </Zoom>
                                      </td>
                                      <td>
                                        {fill.fillrec_username}
                                        <br />
                                        {new Date(fill.fillrec_edit_time).toLocaleString('zh-TW', {
                                          year: 'numeric',
                                          month: '2-digit',
                                          day: '2-digit',
                                          hour: '2-digit',
                                          minute: '2-digit',
                                          second: '2-digit',
                                          hour12: false
                                        })}
                                      </td>
                                      {hasEditPermission && (
                                        <td>
                                          <FontAwesomeIcon
                                            icon={faPenToSquare}
                                            className={styles.iconPen}
                                            onClick={(e) => {
                                              e.stopPropagation(); // Prevent row toggle
                                              setEditFillModalVisible(true);
                                              setSelectedFillId(fill.fillrec_id);
                                            }}
                                          />
                                          <FontAwesomeIcon
                                            icon={faTrashCan}
                                            className={styles.iconTrash}
                                            onClick={(e) => {
                                              e.stopPropagation(); // Prevent row toggle
                                              deleteFill(fill.fillrec_id);
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
                                <td colSpan={hasEditPermission ? "8" : "7"} style={{ textAlign: 'center', padding: '10px' }}>
                                  沒有符合基準期間的填充記錄
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
                <td colSpan={hasEditPermission ? "7" : "6"} className="text-center">目前沒有冷媒資料</td>
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
            currentFunction={currentFunction}
            selectedRef={selectedRef}
            refreshRefrigerantData={refreshRefrigerantData || fetchRefrigerantData}
          />

          {/* 填充新增編輯modal */}
          <AddFillModal
            isAddFillModalVisible={isAddFillModalVisible}
            setAddFillModalVisible={setAddFillModalVisible}
            selectedRefId={selectedRefId}
            refreshRefrigerantData={refreshRefrigerantData || fetchRefrigerantData}
          />

          <EditFillModal
            isEditFillModalVisible={isEditFillModalVisible}
            setEditFillModalVisible={setEditFillModalVisible}
            selectedFillId={selectedFillId}
            refreshRefrigerantData={refreshRefrigerantData || fetchRefrigerantData}
          />
        </>
      )}
    </div>
  )
}