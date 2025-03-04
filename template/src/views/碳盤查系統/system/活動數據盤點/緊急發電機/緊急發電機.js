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

import { getEmergency_GeneratorData } from '../fetchdata.js';

export const EmergencyGenerator = ({refreshEmergency_GeneratorData}) => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [Emergency_Generator, setEmergency_Generator] = useState([]);  // Set default as an empty array
    const [selectedGenerator, setSelectedGenerator] = useState(null);
    

    // Fetch data on component mount
    useEffect(() => {
        const fetchData = async () => {
          const data = await getEmergency_GeneratorData();
          if (data) {
            setEmergency_Generator(data);
          }
        };
        fetchData();
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
                            <td colSpan="14" style={{ textAlign: 'center' }}>目前沒有緊急發電機資料</td>
                        </tr>
                    )}
                </CTableBody>
            </CTable>
            <EditModal
                isEditModalVisible={isEditModalVisible}
                setEditModalVisible={setEditModalVisible}
                selectedGenerator={selectedGenerator}
                refreshEmergency_GeneratorData={refreshEmergency_GeneratorData}
            />
        </div>
    );
};
