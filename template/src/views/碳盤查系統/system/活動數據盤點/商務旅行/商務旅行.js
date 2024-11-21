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

export const BusinessTrip = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [BT, setBT] = useState([]);  // State to hold fetched vehicle data

    // Function to fetch vehicle data
    const getBusiness_TripData = async () => {
        try {
            const response = await fetch('http://localhost:8000/Business_Trip', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();

            if (response.ok) {
                setBT(data.Business_Trip);  // Set vehicle data to state
            } else {
                console.error(`Error ${response.status}: ${data.detail}`);
            }
        } catch (error) {
            console.error('Error fetching business Trip data:', error);
        }
    };

    // Fetch vehicle data on component mount
    useEffect(() => {
        getBusiness_TripData();
    }, []);

    return (
        <div>
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
                    {BT.map((Business_Trip, index) => ( 
                        <tr key={index}>
                            <td>{Business_Trip.transportation}</td>
                            <td>{Business_Trip.kilometer}</td>
                            <td>{Business_Trip.oil_species ? '柴油' : '汽油'}</td>
                            <td>{Business_Trip.remark}</td>
                            <td>
                                <Zoom>
                                    <img src={Business_Trip.img_path} alt="image" />
                                </Zoom>
                            </td>
                            <td>{Business_Trip.edit_time}</td>
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
