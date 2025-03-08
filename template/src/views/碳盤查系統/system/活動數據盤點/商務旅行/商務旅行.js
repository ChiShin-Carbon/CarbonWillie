import React, { useState, useEffect } from 'react';
import {
    CTable, CTableHead, CTableBody, CButton
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import styles from '../../../../../scss/活動數據盤點.module.css';
import EditModal from './編輯Modal.js';

import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

import { getBusiness_TripData } from '../fetchdata.js';

export const BusinessTrip = ({refreshBusinessTripData}) => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [BT, setBT] = useState([]);
    const [selectedbusiness, setSelectedbusiness] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Function to fetch business trip data
    const fetchBusinessTripData = async () => {
        setIsLoading(true);
        try {
            const data = await getBusiness_TripData();
            if (data) {
                setBT(data);
            }
        } catch (error) {
            console.error('Error fetching business trip data:', error);
            setErrorMessage('無法獲取商務旅行數據');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch business trip data on component mount
    useEffect(() => {
        fetchBusinessTripData();
    }, []);

    // Function to delete a business trip record
    const deleteBusinessTrip = async (business_id) => {
        if (!window.confirm('確定要刪除這筆商務旅行資料嗎？')) {
            return; // User cancelled the deletion
        }

        setIsLoading(true);
        setErrorMessage('');
        
        try {
            const response = await fetch(`http://localhost:8000/delete_BusinessTrip`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ business_id: business_id }),
            });

            if (response.ok) {
                // Update local state to remove the deleted item
                setBT(prevData => 
                    prevData.filter(trip => trip.business_id !== business_id)
                );
                
                // If parent component provided a refresh function, call it
                if (typeof refreshBusinessTripData === 'function') {
                    refreshBusinessTripData();
                } else {
                    // Otherwise fetch data again
                    fetchBusinessTripData();
                }
            } else {
                const errorData = await response.json();
                setErrorMessage(`刪除失敗: ${errorData.detail || response.statusText}`);
                console.error(`Error ${response.status}: ${errorData.detail || response.statusText}`);
            }
        } catch (error) {
            setErrorMessage('連接伺服器時發生錯誤');
            console.error('Error deleting business trip:', error);
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
                            <th>操作</th>
                        </tr>
                    </CTableHead>
                    <CTableBody className={styles.activityTableBody}>
                        {BT.length > 0 ? (
                            BT.map((Business_Trip) => (
                                <tr key={Business_Trip.business_id}>
                                    <td>{Business_Trip.transportation}</td>
                                    <td>{Business_Trip.kilometer}</td>
                                    <td>{Business_Trip.oil_species ? '柴油' : '汽油'}</td>
                                    <td>{Business_Trip.remark}</td>
                                    <td>
                                        <Zoom>
                                            <img 
                                                src={`fastapi/${Business_Trip.img_path}`} 
                                                alt="image" 
                                                style={{ width: '100px' }}
                                            />
                                        </Zoom>
                                    </td>
                                    <td>
                                        {Business_Trip.username}<br />
                                        {new Date(Business_Trip.edit_time).toLocaleString('zh-TW', {
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
                                                setSelectedbusiness(Business_Trip.business_id);
                                            }} 
                                        />
                                        <FontAwesomeIcon 
                                            icon={faTrashCan} 
                                            className={styles.iconTrash} 
                                            onClick={() => deleteBusinessTrip(Business_Trip.business_id)}
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className={styles.noData}>目前沒有商務旅行資料</td>
                            </tr>
                        )}
                    </CTableBody>
                </CTable>
            )}
            
            <EditModal
                isEditModalVisible={isEditModalVisible}
                setEditModalVisible={setEditModalVisible}
                selectedbusiness={selectedbusiness}
                refreshBusinessTripData={refreshBusinessTripData || fetchBusinessTripData}
            />
        </div>
    );
};