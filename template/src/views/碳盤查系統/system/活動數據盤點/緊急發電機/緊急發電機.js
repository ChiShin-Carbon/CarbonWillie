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

export const EmergencyGenerator = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [Emergency_Generator, setEmergency_Generator] = useState([]);  // Set default as an empty array
    const [selectedGenerator, setSelectedGenerator] = useState(null);
    

    // Function to fetch generator data
    const getEmergency_GeneratorData = async () => {
        try {
            const response = await fetch('http://localhost:8000/Emergency_Generator', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();

            if (response.ok) {
                setEmergency_Generator(data.Emergency_Generator || []);  // Ensure data is an array
            } else {
                console.error(`Error ${response.status}: ${data.detail}`);
            }
        } catch (error) {
            console.error('Error fetching generator data:', error);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        getEmergency_GeneratorData();
    }, []);

    return (
        <div>
            <CTable hover className={styles.activityTableShort}>
                <CTableHead className={styles.activityTableHead}>
                    <tr>
                        <th>發票/收據日期</th>
                        <th>發票號碼/收據編號</th>
                        <th>使用量(公升)</th>
                        <th>備註</th>
                        <th>圖片</th>
                        <th>最近編輯</th>
                        <th>操作</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.activityTableBody}>
                    {Emergency_Generator.length > 0 ? (
                        Emergency_Generator.map((record, index) => (
                            <tr key={index}>
                                <td>{record.Doc_date}</td>
                                <td>{record.Doc_number}</td>
                                <td>{record.usage}</td>
                                <td>{record.remark}</td>
                                <td><Zoom><img src={`fastapi/${record.img_path}`} alt="Generator usage" /></Zoom></td>
                                <td>{record.edit_time}</td>
                                <td>
                                    <FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} onClick={() => {
                                        setEditModalVisible(true)
                                        setSelectedGenerator(record.generator_id)
                                        }} />
                                    <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" style={{ textAlign: 'center' }}>No data available</td>
                        </tr>
                    )}
                </CTableBody>
            </CTable>
            <EditModal
                isEditModalVisible={isEditModalVisible}
                setEditModalVisible={setEditModalVisible}
                selectedGenerator={selectedGenerator}
            />
        </div>
    );
};
