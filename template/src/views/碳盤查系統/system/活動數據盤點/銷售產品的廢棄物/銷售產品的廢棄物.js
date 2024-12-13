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

export const SellingWaste = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [sellingWasteData, setSellingWasteData] = useState([]);  // State to hold fetched selling waste data
    const [selectedWaste, setSelectedWaste] = useState(null); // Store selected waste for edit

    // Function to fetch selling waste data
    const getSellingWasteData = async () => {
        try {
            const response = await fetch('http://localhost:8000/Selling_waste', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();

            if (response.ok) {
                setSellingWasteData(data.Selling_Waste);  // Set selling waste data to state
            } else {
                console.error(`Error ${response.status}: ${data.detail}`);
            }
        } catch (error) {
            console.error('Error fetching selling waste data:', error);
        }
    };

    // Fetch selling waste data on component mount
    useEffect(() => {
        getSellingWasteData();
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
                    {sellingWasteData.map((waste, index) => (
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
                                <FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} onClick={() => {
                                    setEditModalVisible(true)
                                    setSelectedWaste(waste.waste_id)
                                    console.log(waste.waste_id)
                                    }} />
                                <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                            </td>
                        </tr>
                    ))}
                </CTableBody>
            </CTable>
            <EditModal
                isEditModalVisible={isEditModalVisible}
                setEditModalVisible={setEditModalVisible}
                selectedWaste={selectedWaste}
            />
        </div>
    );
};
