import React, { useState, useEffect } from 'react';
import {
    CTable, CTableHead, CTableBody, CModal, CButton,
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import styles from '../../../../../scss/活動數據盤點.module.css';
import EditModal from './編輯Modal.js';

import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

import { getOperationalWasteData } from '../fetchdata.js';

export const OperationalWaste = ({refreshWasteData}) => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [operationalWasteData, setOperationalWasteData] = useState([]);
    const [selectedWaste, setSelectedWaste] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Function to fetch operational waste data
    const fetchWasteData = async () => {
        setIsLoading(true);
        try {
            const data = await getOperationalWasteData();
            if (data) {
                setOperationalWasteData(data);
            }
        } catch (error) {
            console.error('Error fetching operational waste data:', error);
            setErrorMessage('無法獲取營運產生廢棄物數據');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch operational waste data on component mount
    useEffect(() => {
        fetchWasteData();
    }, []);

    // Function to delete a waste record
    const deleteWaste = async (waste_id) => {
        if (!window.confirm('確定要刪除這筆營運產生廢棄物資料嗎？')) {
            return; // User cancelled the deletion
        }

        setIsLoading(true);
        setErrorMessage('');
        
        try {
            const response = await fetch(`http://localhost:8000/delete_waste`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ waste_id: waste_id }),
            });

            if (response.ok) {
                // Update local state to remove the deleted item
                setOperationalWasteData(prevData => 
                    prevData.filter(waste => waste.waste_id !== waste_id)
                );
                
                // If parent component provided a refresh function, call it
                if (typeof refreshWasteData === 'function') {
                    refreshWasteData();
                } else {
                    // Otherwise fetch data again
                    fetchWasteData();
                }
            } else {
                const errorData = await response.json();
                setErrorMessage(`刪除失敗: ${errorData.detail || response.statusText}`);
                console.error(`Error ${response.status}: ${errorData.detail || response.statusText}`);
            }
        } catch (error) {
            setErrorMessage('連接伺服器時發生錯誤');
            console.error('Error deleting waste record:', error);
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
                            <th>廢棄物項目</th>
                            <th>備註</th>
                            <th>圖片</th>
                            <th>最近編輯</th>
                            <th>操作</th>
                        </tr>
                    </CTableHead>
                    <CTableBody className={styles.activityTableBody}>
                        {operationalWasteData.length > 0 ? (
                            operationalWasteData.map((waste) => (
                                <tr key={waste.waste_id}>
                                    <td>{waste.waste_item}</td>
                                    <td>{waste.remark}</td>
                                    <td>
                                        <Zoom>
                                            <img 
                                                src={`fastapi/${waste.img_path}`} 
                                                alt={`${waste.waste_item} image`} 
                                                style={{ width: '100px' }}
                                            />
                                        </Zoom>
                                    </td>
                                    <td>
                                        {waste.username}<br />
                                        {new Date(waste.edit_time).toLocaleString('zh-TW', {
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
                                                setSelectedWaste(waste.waste_id);
                                            }}
                                        />
                                        <FontAwesomeIcon
                                            icon={faTrashCan}
                                            className={styles.iconTrash}
                                            onClick={() => deleteWaste(waste.waste_id)}
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className={styles.noDataMessage}>目前沒有營運產生廢棄物資料</td>
                            </tr>
                        )}
                    </CTableBody>
                </CTable>
            )}
            
            <EditModal
                selectedWaste={selectedWaste}
                isEditModalVisible={isEditModalVisible}
                setEditModalVisible={setEditModalVisible}
                refreshWasteData={refreshWasteData || fetchWasteData}
            />
        </div>
    );
};