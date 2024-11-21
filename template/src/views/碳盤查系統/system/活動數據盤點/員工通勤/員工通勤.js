import React, { useState, useEffect } from 'react'; // Added `useEffect` import
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

export const Commuting = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [Commute, setCommute] = useState([]);  // State to hold fetched commute data

    // Function to fetch commute data
    const getCommuteData = async () => {
        try {
            const response = await fetch('http://localhost:8000/Commute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();

            if (response.ok) {
                setCommute(data.Commute);  // Set commute data to state
            } else {
                console.error(`Error ${response.status}: ${data.detail}`);
            }
        } catch (error) {
            console.error('Error fetching commute data:', error);
        }
    };

    // Fetch commute data on component mount
    useEffect(() => {
        getCommuteData();
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
                    {Commute.map((commute, index) => (
                        <tr key={index}>
                            <td>{commute.transportation}</td>
                            <td>{commute.kilometer}</td>
                            <td>{commute.oil_species ? '柴油' : '汽油'}</td>
                            <td>{commute.remark}</td>
                            <td>
                                <Zoom>
                                    <img src={commute.img_path} alt="image" />
                                </Zoom>
                            </td>
                            <td>{commute.edit_time}</td>
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
