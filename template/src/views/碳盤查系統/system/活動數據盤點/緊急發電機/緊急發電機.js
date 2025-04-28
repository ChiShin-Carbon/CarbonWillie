import React, { useState, useEffect } from 'react';
import {
    CTable, CTableHead, CTableBody
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import styles from '../../../../../scss/活動數據盤點.module.css';
import EditModal from './編輯Modal.js';

import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

import { getEmergency_GeneratorData } from '../fetchdata.js';

export const EmergencyGenerator = ({refreshEmergency_GeneratorData}) => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [Emergency_Generator, setEmergency_Generator] = useState([]);
    const [selectedGenerator, setSelectedGenerator] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [userPosition, setUserPosition] = useState(null);
    const [cfvStartDate, setCfvStartDate] = useState(null); // State for baseline start date
    const [cfvEndDate, setCfvEndDate] = useState(null); // State for baseline end date
    
    // Get user position from sessionStorage
    useEffect(() => {
        const position = window.sessionStorage.getItem('position');
        setUserPosition(position ? parseInt(position) : null);
    }, []);
    
    // Check if user has permission to edit/delete
    const hasEditPermission = userPosition !== 1;

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

    // Function to fetch emergency generator data with baseline period filter
    const fetchEmergencyGeneratorData = async () => {
        setIsLoading(true);
        try {
            const data = await getEmergency_GeneratorData();
            if (data && cfvStartDate && cfvEndDate) {
                // Filter data based on baseline period
                const startDate = new Date(cfvStartDate);
                const endDate = new Date(cfvEndDate);
                
                const filteredData = data.filter(record => {
                    // Use Doc_date for filtering as it's the invoice/receipt date
                    const docDate = new Date(record.Doc_date);
                    return docDate >= startDate && docDate <= endDate;
                });
                
                setEmergency_Generator(filteredData);
            } else if (data) {
                // If no baseline dates available yet, show all data
                setEmergency_Generator(data);
            }
        } catch (error) {
            console.error('Error fetching emergency generator data:', error);
            setErrorMessage('無法獲取緊急發電機數據');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch baseline data on component mount
    useEffect(() => {
        getBaseline();
    }, []);

    // Fetch emergency generator data when baseline dates change
    useEffect(() => {
        fetchEmergencyGeneratorData();
    }, [cfvStartDate, cfvEndDate]);

    // Function to delete an emergency generator record
    const deleteEmergencyGenerator = async (generator_id) => {
        if (!window.confirm('確定要刪除這筆緊急發電機資料嗎？')) {
            return; // User cancelled the deletion
        }

        setIsLoading(true);
        setErrorMessage('');
        
        try {
            const response = await fetch(`http://localhost:8000/delete_emergency`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ generator_id: generator_id }),
            });

            if (response.ok) {
                // Update local state to remove the deleted item
                setEmergency_Generator(prevData => 
                    prevData.filter(record => record.generator_id !== generator_id)
                );
                
                // If parent component provided a refresh function, call it
                if (typeof refreshEmergency_GeneratorData === 'function') {
                    refreshEmergency_GeneratorData();
                } else {
                    // Otherwise fetch data again
                    fetchEmergencyGeneratorData();
                }
            } else {
                const errorData = await response.json();
                setErrorMessage(`刪除失敗: ${errorData.detail || response.statusText}`);
                console.error(`Error ${response.status}: ${errorData.detail || response.statusText}`);
            }
        } catch (error) {
            setErrorMessage('連接伺服器時發生錯誤');
            console.error('Error deleting emergency generator:', error);
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
                            <th>發票/收據日期</th>
                            <th>發票號碼/收據編號</th>
                            <th>使用量(公升)</th>
                            <th>備註</th>
                            <th>圖片</th>
                            <th>最近編輯</th>
                            {hasEditPermission && <th>操作</th>}
                        </tr>
                    </CTableHead>
                    <CTableBody className={styles.activityTableBody}>
                        {Emergency_Generator.length > 0 ? (
                            Emergency_Generator.map((record) => (
                                <tr key={record.generator_id}>
                                    <td>{record.Doc_date}</td>
                                    <td>{record.Doc_number}</td>
                                    <td>{record.usage}</td>
                                    <td>{record.remark}</td>
                                    <td>
                                        <Zoom>
                                            <img 
                                                src={`fastapi/${record.img_path}`} 
                                                alt="Generator usage"
                                                style={{ width: '100px' }} 
                                            />
                                        </Zoom>
                                    </td>
                                    <td>
                                        {record.username}<br />
                                        {new Date(record.edit_time).toLocaleString('zh-TW', {
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
                                                    setSelectedGenerator(record.generator_id);
                                                }} 
                                            />
                                            <FontAwesomeIcon 
                                                icon={faTrashCan} 
                                                className={styles.iconTrash} 
                                                onClick={() => deleteEmergencyGenerator(record.generator_id)}
                                            />
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={hasEditPermission ? "7" : "6"} style={{ textAlign: 'center', padding: '20px' }}>
                                    目前沒有符合基準期間的緊急發電機資料
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
                    selectedGenerator={selectedGenerator}
                    refreshEmergency_GeneratorData={refreshEmergency_GeneratorData || fetchEmergencyGeneratorData}
                />
            )}
        </div>
    );
};