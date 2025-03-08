import React, { useState, useEffect } from 'react';
import {
    CTable, CTableHead, CTableBody, CModal, CModalBody, CModalFooter, CModalHeader, CButton
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import styles from '../../../../../scss/活動數據盤點.module.css';
import EditModal from './編輯Modal.js';

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css';

import { getNonEmployeeData } from '../fetchdata.js';

export const NonEmployee = ({refreshNonEmployeeData}) => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [selectedNonemployeeId, setSelectedNonemployeeId] = useState(null);
    const [nonemployeeData, setNonEmployeeData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Function to fetch nonemployee data
    const fetchNonEmployeeData = async () => {
        setIsLoading(true);
        try {
            const data = await getNonEmployeeData();
            if (data) {
                setNonEmployeeData(data);
            }
        } catch (error) {
            console.error('Error fetching non-employee data:', error);
            setErrorMessage('無法獲取非員工數據');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch nonemployee data when the component mounts
    useEffect(() => {
        fetchNonEmployeeData();
    }, []);

    // Function to delete a nonemployee record
    const deleteNonEmployee = async (nonemployee_id) => {
        if (!window.confirm('確定要刪除這筆非員工資料嗎？')) {
            return; // User cancelled the deletion
        }

        setIsLoading(true);
        setErrorMessage('');
        
        try {
            const response = await fetch(`http://localhost:8000/delete_nonemployee`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nonemployee_id: nonemployee_id }),
            });

            if (response.ok) {
                // Update local state to remove the deleted item
                setNonEmployeeData(prevData => 
                    prevData.filter(item => item.nonemployee_id !== nonemployee_id)
                );
                
                // If parent component provided a refresh function, call it
                if (typeof refreshNonEmployeeData === 'function') {
                    refreshNonEmployeeData();
                } else {
                    // Otherwise fetch data again
                    fetchNonEmployeeData();
                }
            } else {
                const errorData = await response.json();
                setErrorMessage(`刪除失敗: ${errorData.detail || response.statusText}`);
                console.error(`Error ${response.status}: ${errorData.detail || response.statusText}`);
            }
        } catch (error) {
            setErrorMessage('連接伺服器時發生錯誤');
            console.error('Error deleting non-employee:', error);
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
                            <th>月份</th>
                            <th>人數</th>
                            <th>總工作時數</th>
                            <th>總工作人天</th>
                            <th>備註</th>
                            <th>圖片</th>
                            <th>最近編輯</th>
                            <th>操作</th>
                        </tr>
                    </CTableHead>
                    <CTableBody className={styles.activityTableBody}>
                        {nonemployeeData.length > 0 ? (
                            nonemployeeData.map((item) => (
                                <tr key={item.nonemployee_id}>
                                    <td>{item.period_date}</td>
                                    <td>{item.nonemployee_number}</td>
                                    <td>{item.total_hours}</td>
                                    <td>{item.total_days}</td>
                                    <td>{item.remark}</td>
                                    <td>
                                        <Zoom>
                                            <img src={`fastapi/${item.img_path}`} alt="image" width="100" />
                                        </Zoom>
                                    </td>
                                    <td>
                                        {item.username}<br />
                                        {new Date(item.edit_time).toLocaleString('zh-TW', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit',
                                            hour12: false
                                        })}
                                    </td>
                                    <td>
                                        <FontAwesomeIcon
                                            icon={faPenToSquare}
                                            className={styles.iconPen}
                                            onClick={() => {
                                                setSelectedNonemployeeId(item.nonemployee_id);
                                                setEditModalVisible(true);
                                            }}
                                        />
                                        <FontAwesomeIcon 
                                            icon={faTrashCan} 
                                            className={styles.iconTrash} 
                                            onClick={() => deleteNonEmployee(item.nonemployee_id)}
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center">目前沒有非員工資料</td>
                            </tr>
                        )}
                    </CTableBody>
                </CTable>
            )}
            
            <EditModal
                isEditModalVisible={isEditModalVisible}
                setEditModalVisible={setEditModalVisible}
                selectedNonemployeeId={selectedNonemployeeId}
                refreshNonEmployeeData={refreshNonEmployeeData || fetchNonEmployeeData}
            />
        </div>
    );
};