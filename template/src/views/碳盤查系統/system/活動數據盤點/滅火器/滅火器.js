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
import { getExtinguisherData } from '../fetchdata.js'

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

export const FireExtinguisher = ({refreshFireExtinguisherData}) => {
  const [isEditModalVisible, setEditModalVisible] = useState(false)
  const [isAddFillModalVisible, setAddFillModalVisible] = useState(false)
  const [isEditFillModalVisible, setEditFillModalVisible] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null) // 用於追蹤展開的列
  const [selectedExtinguisher, setSelectedExtinguisher] = useState(null) // Store selected extinguisher for edit
  const [selectedFill, setSelectedFill] = useState(null) // Store selected fill for edit
  const [selectedExtinguisherId, setSelectedExtinguisherId] = useState(null) // Store selected extinguisher for fill
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [userPosition, setUserPosition] = useState(null)
  const [cfvStartDate, setCfvStartDate] = useState(null) // State for baseline start date
  const [cfvEndDate, setCfvEndDate] = useState(null) // State for baseline end date
  
  // Get user position from sessionStorage
  useEffect(() => {
    const position = window.sessionStorage.getItem('position')
    setUserPosition(position ? parseInt(position) : null)
  }, [])
  
  // Check if user has permission to edit/delete
  const hasEditPermission = userPosition === 3;

  const ingredientMap = {
    1: 'CO2', // Replace with actual ingredient names
    2: 'HFC-236ea',
    3: 'HFC-236fa',
    4: 'HFC-227ea',
    5: 'CF3CFCF3',
    6: 'CHF3',
    7: '其他',
  }

  const [extinguishers, setExtinguishers] = useState([]) // State to hold fetched extinguisher data

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
// Function to fetch extinguisher data with baseline period filter
const fetchExtinguisherData = async () => {
  setIsLoading(true);
  try {
    const data = await getExtinguisherData();
    if (data && cfvStartDate && cfvEndDate) {
      const startDate = new Date(cfvStartDate);
      const endDate = new Date(cfvEndDate);
      
      const filteredData = data.map(extinguisher => {
        // Filter fill records that fall within the baseline period
        let filteredFillrec = [];
        if (extinguisher.fillrec && extinguisher.fillrec.length > 0) {
          filteredFillrec = extinguisher.fillrec.filter(fill => {
            const docDate = new Date(fill.Doc_date);
            return docDate >= startDate && docDate <= endDate;
          });
        }
        
        return {
          ...extinguisher,
          fillrec: filteredFillrec
        };
      });
      // Don't filter out extinguisher records - show all extinguisher devices
      // Only the fill records are filtered by CFV period
      
      setExtinguishers(filteredData);
    } else if (data) {
      // If no baseline dates available yet, show all data
      setExtinguishers(data);
    }
  } catch (error) {
    console.error('Error fetching extinguisher data:', error);
    setErrorMessage('無法獲取滅火器數據');
  } finally {
    setIsLoading(false);
  }
};

  // Fetch baseline data on component mount
  useEffect(() => {
    getBaseline();
  }, []);

  // Fetch extinguisher data when baseline dates change
  useEffect(() => {
    fetchExtinguisherData();
  }, [cfvStartDate, cfvEndDate]);

  // Function to delete an extinguisher record
  const deleteExtinguisher = async (extinguisher_id) => {
    if (!window.confirm('確定要刪除這筆滅火器資料嗎？此操作將同時刪除所有相關的填充記錄。')) {
      return; // User cancelled the deletion
    }

    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const response = await fetch(`http://localhost:8000/delete_Extinguisher`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ extinguisher_id: extinguisher_id }),
      });

      if (response.ok) {
        // Update local state to remove the deleted item
        setExtinguishers(prevExtinguishers => 
          prevExtinguishers.filter(extinguisher => extinguisher.extinguisher_id !== extinguisher_id)
        );
        
        // If parent component provided a refresh function, call it
        if (typeof refreshFireExtinguisherData === 'function') {
          refreshFireExtinguisherData();
        } else {
          // Otherwise fetch data again
          fetchExtinguisherData();
        }
      } else {
        const errorData = await response.json();
        setErrorMessage(`刪除失敗: ${errorData.detail || response.statusText}`);
        console.error(`Error ${response.status}: ${errorData.detail || response.statusText}`);
      }
    } catch (error) {
      setErrorMessage('連接伺服器時發生錯誤');
      console.error('Error deleting extinguisher:', error);
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
      const response = await fetch(`http://localhost:8000/delete_ExtinguisherFill`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fillrec_id: fillrec_id }),
      });

      if (response.ok) {
        // Update local state to remove the deleted fill record
        setExtinguishers(prevExtinguishers => 
          prevExtinguishers.map(extinguisher => ({
            ...extinguisher,
            fillrec: extinguisher.fillrec ? 
              extinguisher.fillrec.filter(fill => fill.fillrec_id !== fillrec_id) : 
              []
          }))
        );
        
        // If parent component provided a refresh function, call it
        if (typeof refreshFireExtinguisherData === 'function') {
          refreshFireExtinguisherData();
        } else {
          // Otherwise fetch data again
          fetchExtinguisherData();
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
              <th>品名</th>
              <th>成分</th>
              <th>規格(重量)</th>
              <th>備註</th>
              <th>圖片</th>
              <th>最近編輯</th>
              {hasEditPermission && <th>操作</th>}
            </tr>
          </CTableHead>
          <CTableBody className={styles.activityTableBody}>
            {extinguishers.length > 0 ? (
              extinguishers.map((extinguisher, extinguisher_id) => (
                <React.Fragment key={extinguisher.extinguisher_id}>
                  <tr onClick={() => toggleRow(extinguisher_id)} className={styles.trChoose}>
                    <td>{extinguisher.item_name}</td>
                    <td>{ingredientMap[extinguisher.ingredient]}</td>
                    <td>{extinguisher.specification}</td>
                    <td>{extinguisher.remark}</td>
                    <td>
                      <Zoom>
                        <img
                          src={`fastapi/${extinguisher.img_path}`}
                          alt="receipt"
                          style={{ width: '100px' }}
                        />
                      </Zoom>
                    </td>
                    <td>
                      {extinguisher.username}
                      <br />
                      {extinguisher.edit_time}
                    </td>
                    {hasEditPermission && (
                      <td>
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          className={styles.iconPen}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row toggle
                            setEditModalVisible(true);
                            setSelectedExtinguisher(extinguisher.extinguisher_id);
                          }}
                        />
                        <FontAwesomeIcon 
                          icon={faTrashCan} 
                          className={styles.iconTrash} 
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row toggle
                            deleteExtinguisher(extinguisher.extinguisher_id);
                          }}
                        />
                      </td>
                    )}
                  </tr>
                  {selectedRow === extinguisher_id && (
                    <tr>
                      <td colSpan={hasEditPermission ? "7" : "6"}>
                        <div className={styles.expandedContent}>
                          {/* 在展開的區塊中放置你需要的內容 */}
                          <div className={styles.fill}>
                            <div>填充紀錄</div>
                            {hasEditPermission && (
                              <button
                                onClick={() => {
                                  setAddFillModalVisible(true);
                                  const extinguisherId = extinguisher.extinguisher_id; // Capture the ID directly
                                  setSelectedExtinguisherId(extinguisherId);
                                  console.log(extinguisherId); // Log the correct ID
                                }}
                              >新增</button>
                            )}
                          </div>
                          <table>
                            {extinguisher.fillrec && extinguisher.fillrec.length > 0 ? (
                              <>
                                <thead>
                                  <tr>
                                    <th>發票/收據日期</th>
                                    <th>發票號碼/收據編號</th>
                                    <th>填充量</th>
                                    <th>備註</th>
                                    <th>圖片</th>
                                    <th>最近編輯</th>
                                    {hasEditPermission && <th>操作</th>}
                                  </tr>
                                </thead>
                                <tbody>
                                  {extinguisher.fillrec.map((fill, index) => (
                                    <tr key={fill.fillrec_id}>
                                      <td>{fill.Doc_date}</td>
                                      <td>{fill.Doc_number}</td>
                                      <td>{fill.usage}</td>
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
                                        {fill.fillrec_edit_time}
                                      </td>
                                      {hasEditPermission && (
                                        <td>
                                          <FontAwesomeIcon
                                            icon={faPenToSquare}
                                            className={styles.iconPen}
                                            onClick={() => {
                                              setEditFillModalVisible(true);
                                              setSelectedFill(fill.fillrec_id);
                                            }}
                                          />
                                          <FontAwesomeIcon 
                                            icon={faTrashCan} 
                                            className={styles.iconTrash}
                                            onClick={() => {
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
                                <td colSpan={hasEditPermission ? "7" : "6"} style={{ textAlign: 'center', padding: '10px' }}>
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
                <td colSpan={hasEditPermission ? "7" : "6"} style={{ textAlign: 'center', padding: '20px' }}>
                  沒有滅火器活動數據
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
            selectedExtinguisher={selectedExtinguisher}
            refreshFireExtinguisherData={refreshFireExtinguisherData || fetchExtinguisherData}
          />

          {/* 填充新增編輯modal */}
          <AddFillModal
            isAddFillModalVisible={isAddFillModalVisible}
            setAddFillModalVisible={setAddFillModalVisible}
            selectedExtinguisherId={selectedExtinguisherId}
            refreshFireExtinguisherData={refreshFireExtinguisherData || fetchExtinguisherData}
          />

          <EditFillModal
            isEditFillModalVisible={isEditFillModalVisible}
            setEditFillModalVisible={setEditFillModalVisible}
            selectedFill={selectedFill}
            refreshFireExtinguisherData={refreshFireExtinguisherData || fetchExtinguisherData}
          />
        </>
      )}
    </div>
  )
}