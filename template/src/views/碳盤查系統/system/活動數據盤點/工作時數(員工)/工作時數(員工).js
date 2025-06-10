import React, { useState, useEffect } from 'react';
import {
    CTable, CTableHead, CTableBody, CButton,
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import styles from '../../../../../scss/活動數據盤點.module.css';
import EditModal from './編輯Modal.js';
import {getEmployeeData} from '../fetchdata.js'

import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

// Helper function to safely parse date strings
const parseEditTime = (dateString) => {
    if (!dateString) {
        console.warn('Empty date string provided');
        return new Date(); // Return current date as fallback
    }
    
    // Try multiple parsing methods
    let date;
    
    // Method 1: Direct Date constructor
    date = new Date(dateString);
    if (!isNaN(date.getTime()) && date.getFullYear() > 1990) {
        return date;
    }
    
    // Method 2: Replace space with 'T' for ISO format
    if (typeof dateString === 'string' && dateString.includes(' ')) {
        const isoString = dateString.replace(' ', 'T');
        date = new Date(isoString);
        if (!isNaN(date.getTime()) && date.getFullYear() > 1990) {
            return date;
        }
    }
    
    // Method 3: Manual parsing for YYYY-MM-DD HH:MM:SS format
    if (typeof dateString === 'string') {
        const match = dateString.match(/(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/);
        if (match) {
            const [, year, month, day, hour, minute, second] = match;
            date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), parseInt(second));
            if (!isNaN(date.getTime()) && date.getFullYear() > 1990) {
                return date;
            }
        }
    }
    
    // If all methods fail, return current date as fallback
    console.warn('Failed to parse date:', dateString, typeof dateString);
    return new Date(); // Always return a valid Date object
};

export const Employee = ({refreshEmployeeData}) => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [employeeData, setEmployeeData] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null); // Store selected employee for edit
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [userPosition, setUserPosition] = useState(null);
    const [cfvStartDate, setCfvStartDate] = useState(null); // State for baseline start date
    const [cfvEndDate, setCfvEndDate] = useState(null); // State for baseline end date
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

    // Function to fetch employee data with baseline period filter
    const fetchEmployeeData = async () => {
        setIsLoading(true);
        try {
            const data = await getEmployeeData();
            if (data && cfvStartDate && cfvEndDate) {
                // For employee data, we'll filter based on period_date which appears to be the month field
                const startDate = new Date(cfvStartDate);
                const endDate = new Date(cfvEndDate);
                
                const filteredData = data.filter(employee => {
                    // Convert period_date (which might be in format like "2023-01") to a comparable date
                    // Assuming period_date is in YYYY-MM format
                    const periodParts = employee.period_date.split('-');
                    if (periodParts.length >= 2) {
                        // Create a date for the 1st of the month represented by period_date
                        const periodDate = new Date(
                            parseInt(periodParts[0]),     // Year
                            parseInt(periodParts[1]) - 1, // Month (0-indexed)
                            1                            // Day
                        );
                        
                        // Check if this month falls within the baseline period
                        return periodDate >= startDate && periodDate <= endDate;
                    }
                    return false; // Skip if period_date format is unexpected
                });
                
                setEmployeeData(filteredData);
            } else if (data) {
                // If no baseline dates available yet, show all data
                setEmployeeData(data);
            }
        } catch (error) {
            console.error('Error fetching employee data:', error);
            setErrorMessage('無法獲取員工數據');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch baseline data on component mount
    useEffect(() => {
        getBaseline();
    }, []);

    // Fetch employee data when baseline dates change
    useEffect(() => {
        fetchEmployeeData();
    }, [cfvStartDate, cfvEndDate]);

    // Function to delete an employee record
    const deleteEmployee = async (employee_id) => {
        if (!window.confirm('確定要刪除這筆員工資料嗎？')) {
            return; // User cancelled the deletion
        }

        setIsLoading(true);
        setErrorMessage('');
        
        try {
            const response = await fetch(`http://localhost:8000/delete_employee`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ employee_id: employee_id }),
            });

            if (response.ok) {
                // Update local state to remove the deleted item
                setEmployeeData(prevData => 
                    prevData.filter(employee => employee.employee_id !== employee_id)
                );
                
                // If parent component provided a refresh function, call it
                if (typeof refreshEmployeeData === 'function') {
                    refreshEmployeeData();
                } else {
                    // Otherwise fetch data again
                    fetchEmployeeData();
                }
            } else {
                const errorData = await response.json();
                setErrorMessage(`刪除失敗: ${errorData.detail || response.statusText}`);
                console.error(`Error ${response.status}: ${errorData.detail || response.statusText}`);
            }
        } catch (error) {
            setErrorMessage('連接伺服器時發生錯誤');
            console.error('Error deleting employee:', error);
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
                            <th>月份</th>
                            <th>員工數</th>
                            <th>每日工時</th>
                            <th>每月工作日數</th>
                            <th>總加班時數</th>
                            <th>總病假時數</th>
                            <th>總事假時數</th>
                            <th>總出差時數</th>
                            <th>總婚喪時數</th>
                            <th>總特休時數</th>
                            <th>備註</th>
                            <th>圖片</th>
                            <th>最近編輯</th>
                            {hasEditPermission && <th>操作</th>}
                        </tr>
                    </CTableHead>
                    <CTableBody className={styles.activityTableBody}>
                        {employeeData.length > 0 ? (
                            employeeData.map((employee, index) => (
                                <tr key={employee.employee_id || index}>
                                    <td>{employee.period_date}</td>
                                    <td>{employee.employee_number}</td>
                                    <td>{employee.daily_hours}</td>
                                    <td>{employee.workday}</td>
                                    <td>{employee.overtime}</td>
                                    <td>{employee.sick_leave}</td>
                                    <td>{employee.personal_leave}</td>
                                    <td>{employee.business_trip}</td>
                                    <td>{employee.wedding_and_funeral}</td>
                                    <td>{employee.special_leave}</td>
                                    <td>{employee.remark}</td>

                                    <td>
                                        <Zoom>
                                            <img src={`fastapi/${employee.img_path}`} alt="image" width="100" height="100" />
                                        </Zoom>
                                    </td>

                                    <td>
                                        {employee.username}<br />
                                        {(() => {
                                            try {
                                                const parsedDate = parseEditTime(employee.edit_time);
                                                return parsedDate.toLocaleString('zh-TW', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit',
                                                    hour12: false
                                                });
                                            } catch (error) {
                                                console.error('Error parsing edit_time:', employee.edit_time, error);
                                                return '日期解析錯誤';
                                            }
                                        })()}
                                    </td>

                                    {hasEditPermission && (
                                        <td>
                                            <FontAwesomeIcon 
                                                icon={faPenToSquare} 
                                                className={styles.iconPen} 
                                                onClick={() => {
                                                    setSelectedEmployee(employee.employee_id);
                                                    setEditModalVisible(true);
                                                }} 
                                            />
                                            <FontAwesomeIcon 
                                                icon={faTrashCan} 
                                                className={styles.iconTrash} 
                                                onClick={() => deleteEmployee(employee.employee_id)}
                                            />
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={hasEditPermission ? "14" : "13"} style={{ textAlign: 'center', padding: '20px' }}>
                                    目前沒有符合基準期間的員工資料
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
                    selectedEmployee={selectedEmployee} // Pass selected employee to modal
                    refreshEmployeeData={refreshEmployeeData || fetchEmployeeData}
                />
            )}
        </div>
    );
};