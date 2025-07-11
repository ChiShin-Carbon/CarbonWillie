import React, { useState, useEffect } from 'react';
import {
    CTable, CTableHead, CTableBody, CFormSelect, CModal, CModalBody, CModalFooter, CModalHeader, CForm, CButton,
    CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CCollapse, CCard, CCardBody
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import styles from '../../../../../scss/活動數據盤點.module.css';
import EditModal from './編輯Modal.js';

import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

import { getCommuteData } from '../fetchdata.js';

export const Commuting = ({refreshCommuteData}) => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [Commute, setCommute] = useState([]);
    const [selectedCommute, setSelectedCommute] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [userPosition, setUserPosition] = useState(null);
    const [cfvStartDate, setCfvStartDate] = useState(null);  // State for baseline start date
    const [cfvEndDate, setCfvEndDate] = useState(null);  // State for baseline end date
    const [userRole, setUserRole] = useState(null)

    
    // Get user position from sessionStorage
    useEffect(() => {
        const storedUserPosition = window.sessionStorage.getItem('position');
        const storedUserRole = window.sessionStorage.getItem('role');
        setUserPosition(storedUserPosition ? parseInt(storedUserPosition) : null);
        setUserRole(storedUserRole ? parseInt(storedUserRole) : null);
    }, []);
    
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

    // Function to fetch commute data with baseline period filter
    const fetchCommuteData = async () => {
        setIsLoading(true);
        try {
            const data = await getCommuteData();
            if (data && cfvStartDate && cfvEndDate) {
                // Filter data based on baseline period
                const startDate = new Date(cfvStartDate);
                const endDate = new Date(cfvEndDate);
                
                // Assuming commute records have a date field like "commute_date" or "date"
                // Update this field name according to your actual data structure
                const filteredData = data.filter(commute => {
                    // If commute records have a specific date field, use that
                    // This is an assumption - adjust the field name as needed
                    const recordDate = new Date(commute.edit_time);
                    return recordDate >= startDate && recordDate <= endDate;
                });
                
                setCommute(filteredData);
            } else if (data) {
                // If no baseline dates available yet, show all data
                setCommute(data);
            }
        } catch (error) {
            console.error('Error fetching commute data:', error);
            setErrorMessage('無法獲取員工通勤數據');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch baseline data on component mount
    useEffect(() => {
        getBaseline();
    }, []);

    // Fetch commute data when baseline dates change
    useEffect(() => {
        fetchCommuteData();
    }, [cfvStartDate, cfvEndDate]);

    // Function to delete a commute record
    const deleteCommute = async (commute_id) => {
        if (!window.confirm('確定要刪除這筆員工通勤資料嗎？')) {
            return; // User cancelled the deletion
        }

        setIsLoading(true);
        setErrorMessage('');
        
        try {
            const response = await fetch(`http://localhost:8000/delete_commute`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ commute_id: commute_id }),
            });

            if (response.ok) {
                // Update local state to remove the deleted item
                setCommute(prevData => 
                    prevData.filter(commute => commute.commute_id !== commute_id)
                );
                
                // If parent component provided a refresh function, call it
                if (typeof refreshCommuteData === 'function') {
                    refreshCommuteData();
                } else {
                    // Otherwise fetch data again
                    fetchCommuteData();
                }
            } else {
                const errorData = await response.json();
                setErrorMessage(`刪除失敗: ${errorData.detail || response.statusText}`);
                console.error(`Error ${response.status}: ${errorData.detail || response.statusText}`);
            }
        } catch (error) {
            setErrorMessage('連接伺服器時發生錯誤');
            console.error('Error deleting commute:', error);
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
                <CTable hover className={styles.activityTableShort}>
                    <CTableHead className={styles.activityTableHead}>
                        <tr>
                            <th>交通方式</th>
                            <th>公里數</th>
                            <th>油種</th>
                            <th>備註</th>
                            <th>圖片</th>
                            <th>最近編輯</th>
                            {hasEditPermission && <th>操作</th>}
                        </tr>
                    </CTableHead>
                    <CTableBody className={styles.activityTableBody}>
                        {Commute.length > 0 ? (
                            Commute.map((commute) => (
                                <tr key={commute.commute_id}>
                                    <td>{commute.transportation}</td>
                                    <td>{commute.kilometer}</td>
                                    <td>{commute.oil_species ? '柴油' : '汽油'}</td>
                                    <td>{commute.remark}</td>
                                    <td>
                                        <Zoom>
                                            <img 
                                                src={`fastapi/${commute.img_path}`} 
                                                alt="image" 
                                                style={{ width: '100px' }}
                                            />
                                        </Zoom>
                                    </td>
                                    <td>
                                        {commute.username}<br />
                                        {new Date(commute.edit_time).toLocaleString('zh-TW', {
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
                                                onClick={() => {
                                                    setEditModalVisible(true);
                                                    setSelectedCommute(commute.commute_id);
                                                }}
                                            />
                                            <FontAwesomeIcon 
                                                icon={faTrashCan} 
                                                className={styles.iconTrash} 
                                                onClick={() => deleteCommute(commute.commute_id)}
                                            />
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={hasEditPermission ? "7" : "6"} className={styles.noData}>目前沒有符合基準期間的員工通勤資料</td>
                            </tr>
                        )}
                    </CTableBody>
                </CTable>
            )}
            
            {hasEditPermission && (
                <EditModal
                    isEditModalVisible={isEditModalVisible}
                    setEditModalVisible={setEditModalVisible}
                    selectedCommute={selectedCommute}
                    refreshCommuteData={refreshCommuteData || fetchCommuteData}
                />
            )}
        </div>
    );
};