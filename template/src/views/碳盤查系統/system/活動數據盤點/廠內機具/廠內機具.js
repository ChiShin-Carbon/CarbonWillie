import React, { useState, useEffect } from 'react';
import {
    CTable, CTableHead, CTableBody, CModal, CModalBody, CModalFooter, CModalHeader, CButton,
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import styles from '../../../../../scss/活動數據盤點.module.css';
import EditModal from './編輯Modal.js';

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css';

import { getMachineryData } from '../fetchdata.js'

export const Machinery = ({refreshMachineryData}) => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [machineryData, setMachineryData] = useState([]);
    const [selectedMachinery, setSelectedMachinery] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Function to fetch machinery data
    const fetchMachineryData = async () => {
        setIsLoading(true);
        try {
            const data = await getMachineryData();
            if (data) {
                setMachineryData(data);
            }
        } catch (error) {
            console.error('Error fetching machinery data:', error);
            setErrorMessage('無法獲取場內機具數據');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchMachineryData();
    }, []);

    // Function to delete a machinery record
    const deleteMachinery = async (machinery_id) => {
        if (!window.confirm('確定要刪除這筆場內機具資料嗎？')) {
            return; // User cancelled the deletion
        }

        setIsLoading(true);
        setErrorMessage('');
        
        try {
            const response = await fetch(`http://localhost:8000/delete_machine`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ machinery_id: machinery_id }),
            });

            if (response.ok) {
                // Update local state to remove the deleted item
                setMachineryData(prevData => 
                    prevData.filter(item => item.machinery_id !== machinery_id)
                );
                
                // If parent component provided a refresh function, call it
                if (typeof refreshMachineryData === 'function') {
                    refreshMachineryData();
                } else {
                    // Otherwise fetch data again
                    fetchMachineryData();
                }
            } else {
                const errorData = await response.json();
                setErrorMessage(`刪除失敗: ${errorData.detail || response.statusText}`);
                console.error(`Error ${response.status}: ${errorData.detail || response.statusText}`);
            }
        } catch (error) {
            setErrorMessage('連接伺服器時發生錯誤');
            console.error('Error deleting machinery:', error);
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
                            <th>發票/收據日期</th>
                            <th>發票號碼/收據編號</th>
                            <th>設備位置</th>
                            <th>能源類型</th>
                            <th>使用量</th>
                            <th>備註</th>
                            <th>圖片</th>
                            <th>最近編輯</th>
                            <th>操作</th>
                        </tr>
                    </CTableHead>
                    <CTableBody className={styles.activityTableBody}>
                        {machineryData.length > 0 ? (
                            machineryData.map((item) => (
                                <tr key={item.machinery_id}>
                                    <td>{item.Doc_date}</td>
                                    <td>{item.Doc_number}</td>
                                    <td>{item.machinery_location}</td>
                                    <td>{item.energy_type}</td>
                                    <td>{item.usage ?? 'N/A'}</td>
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
                                                setEditModalVisible(true);
                                                setSelectedMachinery(item.machinery_id);
                                            }}
                                        />
                                        <FontAwesomeIcon 
                                            icon={faTrashCan} 
                                            className={styles.iconTrash} 
                                            onClick={() => deleteMachinery(item.machinery_id)}
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center">目前沒有場內機具資料</td>
                            </tr>
                        )}
                    </CTableBody>
                </CTable>
            )}
            
            <EditModal
                isEditModalVisible={isEditModalVisible}
                setEditModalVisible={setEditModalVisible}
                selectedMachinery={selectedMachinery}
                refreshMachineryData={refreshMachineryData || fetchMachineryData}
            />
        </div>
    );
};