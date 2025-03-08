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

import { getSellingWasteData } from '../fetchdata.js';

export const SellingWaste = ({refreshSellingWasteData}) => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [sellingWasteData, setSellingWasteData] = useState([]);
    const [selectedWaste, setSelectedWaste] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Function to fetch selling waste data
    const fetchSellingWasteData = async () => {
        setIsLoading(true);
        try {
            const data = await getSellingWasteData();
            if (data) {
                setSellingWasteData(data);
            }
        } catch (error) {
            console.error('Error fetching selling waste data:', error);
            setErrorMessage('無法獲取銷售產品的廢棄物數據');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch selling waste data on component mount
    useEffect(() => {
        fetchSellingWasteData();
    }, []);

    // Function to delete a selling waste record
    const deleteSellingWaste = async (waste_id) => {
        if (!window.confirm('確定要刪除這筆銷售產品的廢棄物資料嗎？')) {
            return; // User cancelled the deletion
        }

        setIsLoading(true);
        setErrorMessage('');
        
        try {
            const response = await fetch(`http://localhost:8000/delete_SellingWaste`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ waste_id: waste_id }),
            });

            if (response.ok) {
                // Update local state to remove the deleted item
                setSellingWasteData(prevData => 
                    prevData.filter(waste => waste.waste_id !== waste_id)
                );
                
                // If parent component provided a refresh function, call it
                if (typeof refreshSellingWasteData === 'function') {
                    refreshSellingWasteData();
                } else {
                    // Otherwise fetch data again
                    fetchSellingWasteData();
                }
            } else {
                const errorData = await response.json();
                setErrorMessage(`刪除失敗: ${errorData.detail || response.statusText}`);
                console.error(`Error ${response.status}: ${errorData.detail || response.statusText}`);
            }
        } catch (error) {
            setErrorMessage('連接伺服器時發生錯誤');
            console.error('Error deleting selling waste:', error);
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
                        {sellingWasteData.length > 0 ? (
                            sellingWasteData.map((waste) => (
                                <tr key={waste.waste_id}>
                                    <td>{waste.waste_item}</td>
                                    <td>{waste.remark}</td>
                                    <td>
                                        <Zoom>
                                            <img 
                                                src={`fastapi/${waste.img_path}`} 
                                                alt="image" 
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
                                            onClick={() => deleteSellingWaste(waste.waste_id)}
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className={styles.noDataMessage}>目前沒有銷售產品的廢棄物資料</td>
                            </tr>
                        )}
                    </CTableBody>
                </CTable>
            )}
            
            <EditModal
                isEditModalVisible={isEditModalVisible}
                setEditModalVisible={setEditModalVisible}
                selectedWaste={selectedWaste}
                refreshSellingWasteData={refreshSellingWasteData || fetchSellingWasteData}
            />
        </div>
    );
};