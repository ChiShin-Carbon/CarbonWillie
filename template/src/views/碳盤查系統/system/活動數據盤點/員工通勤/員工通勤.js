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

import { getCommuteData } from '../fetchdata.js';

export const Commuting = ({refreshCommuteData}) => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [Commute, setCommute] = useState([]);  // State to hold fetched commute data
    const [selectedCommute, setSelectedCommute] = useState(null); // Store selected commute for edit

    // Fetch commute data on component mount
    useEffect(() => {
        const fetchData = async () => {
            const data = await getCommuteData();
            if (data) {
                setCommute(data);
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
                    {Commute.length > 0 ? (
                        Commute.map((commute, index) => (
                            <tr key={index}>
                                <td>{commute.transportation}</td>
                                <td>{commute.kilometer}</td>
                                <td>{commute.oil_species ? '柴油' : '汽油'}</td>
                                <td>{commute.remark}</td>
                                <td>
                                    <Zoom>
                                        <img src={`fastapi/${commute.img_path}`} alt="image" />
                                    </Zoom>
                                </td>
                                <td>{commute.edit_time}</td>
                                <td>
                                    <FontAwesomeIcon
                                        icon={faPenToSquare}
                                        className={styles.iconPen}
                                        onClick={() => {
                                            setEditModalVisible(true);
                                            setSelectedCommute(commute.commute_id);
                                            console.log(commute.commute_id);
                                        }}
                                    />
                                    <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="14" className={styles.noData}>目前沒有員工通勤資料</td>
                        </tr>
                    )}
                </CTableBody>
            </CTable>
            <EditModal
                isEditModalVisible={isEditModalVisible}
                setEditModalVisible={setEditModalVisible}
                selectedCommute={selectedCommute}
                refreshCommuteData={refreshCommuteData}
            />
        </div>
    );
};
