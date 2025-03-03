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

import { getBusiness_TripData } from '../fetchdata.js';

export const BusinessTrip = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [BT, setBT] = useState([]);  // State to hold fetched vehicle data
    const [selectedbusiness, setSelectedbusiness] = useState(null);


    // Fetch commute data on component mount
    useEffect(() => {
        const fetchData = async () => {
            const data = await getBusiness_TripData();
            if (data) {
                setBT(data);
            }
        };
        fetchData();
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
                    {BT.length > 0 ? (
                        BT.map((Business_Trip, index) => (
                            <tr key={index}>
                                <td>{Business_Trip.transportation}</td>
                                <td>{Business_Trip.kilometer}</td>
                                <td>{Business_Trip.oil_species ? '柴油' : '汽油'}</td>
                                <td>{Business_Trip.remark}</td>
                                <td>
                                    <Zoom>
                                        <img src={`fastapi/${Business_Trip.img_path}`} alt="image" />
                                    </Zoom>
                                </td>
                                <td>{Business_Trip.edit_time}</td>
                                <td>
                                    <FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} onClick={() => {
                                        setEditModalVisible(true)
                                        setSelectedbusiness(Business_Trip.business_id)
                                    }} />
                                    <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                                </td>
                            </tr>
                        ))
                    ) : (
                        // You should add an empty state here
                        <tr>
                            <td colSpan="14" className={styles.noData}>目前沒有商務旅行資料</td>
                        </tr>
                    )}
                </CTableBody>
            </CTable>
            <EditModal
                isEditModalVisible={isEditModalVisible}
                setEditModalVisible={setEditModalVisible}
                selectedbusiness={selectedbusiness}
            />
        </div>
    );
};
