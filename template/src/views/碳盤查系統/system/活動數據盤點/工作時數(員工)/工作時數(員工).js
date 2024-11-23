import React, { useState, useEffect } from 'react';
import {
    CTable, CTableHead, CTableBody, CButton,
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import styles from '../../../../../scss/活動數據盤點.module.css';
import EditModal from './編輯Modal.js';

import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

export const Employee = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [employeeData, setEmployeeData] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null); // Store selected employee for edit

    const getEmployeeData = async () => {
        try {
            const response = await fetch('http://localhost:8000/employee', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();

            if (response.ok) {
                setEmployeeData(data.employees);
            } else {
                console.error(`Error ${response.status}: ${data.detail}`);
            }
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    };

    useEffect(() => {
        getEmployeeData();
    }, []);

    const handleEditClick = (employee) => {
        setSelectedEmployee(employee); // Set selected employee for editing
        setEditModalVisible(true);
    };

    return (
        <div>
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
                    {employeeData.map((employee, index) => (
                        <tr key={index}>
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
                                    <img src={employee.img_path} alt="image" width="100" height="100" />
                                </Zoom>
                            </td>

                            <td>
                                {employee.username}<br />
                                {new Date(employee.edit_time).toLocaleString()} {/* Format date */}
                            </td>

                            <td>
                                <FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} onClick={() => handleEditClick(employee)} />
                                <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                            </td>
                        </tr>
                    ))}
                </CTableBody>
            </CTable>
            <EditModal
                isEditModalVisible={isEditModalVisible}
                setEditModalVisible={setEditModalVisible}
                employee={selectedEmployee} // Pass selected employee to modal
            />
        </div>
    );
};
