import React, { useState, useEffect } from 'react';
import {
    CTable, CTableHead, CTableBody, CModal, CModalBody, CModalFooter, CModalHeader, CButton,
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import styles from '../../../../../scss/活動數據盤點.module.css';
import EditModal from './編輯Modal.js';

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css';

export const Machinery = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [machineryData, setMachineryData] = useState([]);  // Updated state name for clarity

    // Function to fetch Machinery data
    const getMachineryData = async () => {
        try {
            const response = await fetch('http://localhost:8000/Machinery', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();

            if (response.ok) {
                setMachineryData(data.Machinery);  // Set data to state
            } else {
                console.error(`Error ${response.status}: ${data.detail}`);
            }
        } catch (error) {
            console.error('Error fetching Machinery data:', error);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        getMachineryData();
    }, []);

    return (
        <div>
            <CTable hover className={styles.activityTable1}>
                <CTableHead className={styles.activityTableHead}>
                    <tr>
                        <th>發票/收據日期</th>
                        <th>發票號碼/收據編號</th>
                        <th>設備位置</th>
                        <th>能源類型</th>
                        <th>使用量</th>
                        <th>備註</th>
                        <th>圖片</th>
                        <th>最近編輯</th>
                        <th>操作</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.activityTableBody}>
                    {machineryData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.Doc_date}</td>
                            <td>{item.Doc_number}</td>
                            <td>{item.machinery_location}</td>
                            <td>{item.energy_type}</td>
                            <td>{item.usage ?? 'N/A'}</td>
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
