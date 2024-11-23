import React, { useState, useEffect } from 'react'; // Ensure useEffect is imported
import {
    CTable, CTableHead, CTableBody, CModal, CModalBody, CModalFooter, CModalHeader, CButton
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import styles from '../../../../../scss/活動數據盤點.module.css';
import EditModal from './編輯Modal.js';

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css';

export const NonEmployee = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [employeeData, setEmployeeData] = useState([]); // State to store fetched employee data

    const getEmployeeData = async () => {
        try {
            const response = await fetch('http://localhost:8000/NonEmployee', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();

            if (response.ok) {
                setEmployeeData(data.Nonemployees); // Set employee data to state
            } else {
                console.error(`Error ${response.status}: ${data.detail}`);
            }
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    };

    // Fetch employee data when the component mounts
    useEffect(() => {
        getEmployeeData();
    }, []);

    return (
        <div>
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
                    {employeeData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.period_date}</td>
                            <td>{item.nonemployee_number}</td>
                            <td>{item.total_hours}</td>
                            <td>{item.total_days}</td>
                            <td>{item.remark}</td>
                            <td>
                                <Zoom>
                                    <img src={item.img_path} alt="image" width="100" />
                                </Zoom>
                            </td>

                            <td>{item.edit_time}</td>

                            <td>
                                <FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} onClick={() => setEditModalVisible(true)} />
                                <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                            </td>
                        </tr>
                    ))}
                </CTableBody>
            </CTable>
            <EditModal
                isEditModalVisible={isEditModalVisible}
                setEditModalVisible={setEditModalVisible}
            />
        </div>
    );
};
