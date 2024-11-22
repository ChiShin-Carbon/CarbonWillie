import React, { useState, useEffect } from 'react';  // Added `useEffect` import
import {
    CTable, CTableHead, CTableBody, CModal, CButton,
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import styles from '../../../../../scss/活動數據盤點.module.css';
import EditModal from './編輯Modal.js';

import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

export const OperationalWaste = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [operationalWasteData, setOperationalWasteData] = useState([]);  // State to hold fetched operational waste data

    // Function to fetch operational waste data
    const getOperationalWasteData = async () => {
        try {
            const response = await fetch('http://localhost:8000/Operational_Waste', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();

            if (response.ok) {
                setOperationalWasteData(data.Operational_Waste);  // Set operational waste data to state
            } else {
                console.error(`Error ${response.status}: ${data.detail}`);
            }
        } catch (error) {
            console.error('Error fetching operational waste data:', error);
        }
    };

    // Fetch operational waste data on component mount
    useEffect(() => {
        getOperationalWasteData();
    }, []);

    return (
        <div>
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
                    {operationalWasteData.map((waste, index) => (
                        <tr key={index}>
                            <td>{waste.waste_item}</td>
                            <td>{waste.remark}</td>
                            <td>
                                <Zoom>
                                    <img src={waste.img_path} alt="image" />
                                </Zoom>
                            </td>
                            <td>{waste.edit_time}</td>
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
