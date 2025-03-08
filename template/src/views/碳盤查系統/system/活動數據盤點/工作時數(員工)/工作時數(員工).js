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

export const Employee = ({refreshEmployeeData}) => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [employeeData, setEmployeeData] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null); // Store selected employee for edit
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Function to fetch employee data
    const fetchEmployeeData = async () => {
        setIsLoading(true);
        try {
            const data = await getEmployeeData();
            if (data) {
                setEmployeeData(data);
            }
        } catch (error) {
            console.error('Error fetching employee data:', error);
            setErrorMessage('無法獲取員工數據');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchEmployeeData();
    }, []);

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
                            <th>操作</th>
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
                                        {new Date(employee.edit_time).toLocaleString('zh-TW', {
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
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="14" style={{ textAlign: 'center', padding: '20px' }}>
                                    目前沒有員工資料
                                </td>
                            </tr>
                        )}
                    </CTableBody>
                </CTable>
            )}
            
            <EditModal
                isEditModalVisible={isEditModalVisible}
                setEditModalVisible={setEditModalVisible}
                selectedEmployee={selectedEmployee} // Pass selected employee to modal
                refreshEmployeeData={refreshEmployeeData || fetchEmployeeData}
            />
        </div>
    );
};