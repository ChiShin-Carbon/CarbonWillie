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

import { getSellingWasteData } from '../fetchdata.js';

export const SellingWaste = ({refreshSellingWasteData}) => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [sellingWasteData, setSellingWasteData] = useState([]);  // State to hold fetched selling waste data
    const [selectedWaste, setSelectedWaste] = useState(null); // Store selected waste for edit

    // Fetch commute data on component mount
    useEffect(() => {
        const fetchData = async () => {
            const data = await getSellingWasteData();
            if (data) {
                setSellingWasteData(data);
            }
        };
        fetchData();
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
                    {sellingWasteData.length > 0 ?
                        sellingWasteData.map((waste, index) => (
                            <tr key={index}>
                                <td>{waste.waste_item}</td>
                                <td>{waste.remark}</td>
                                <td>
                                    <Zoom>
                                        <img src={`fastapi/${waste.img_path}`} alt="image" />
                                    </Zoom>
                                </td>
                                <td>{waste.edit_time}</td>
                                <td>
                                    <FontAwesomeIcon
                                        icon={faPenToSquare}
                                        className={styles.iconPen}
                                        onClick={() => {
                                            setEditModalVisible(true);
                                            setSelectedWaste(waste.waste_id);
                                            console.log(waste.waste_id);
                                        }}
                                    />
                                    <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                                </td>
                            </tr>
                        ))
                        : (
                            <tr>
                                <td colSpan="14" className={styles.noDataMessage}>目前沒有銷售產品的廢棄物資料</td>
                            </tr>
                        )
                    }
                </CTableBody>
            </CTable>
            <EditModal
                isEditModalVisible={isEditModalVisible}
                setEditModalVisible={setEditModalVisible}
                selectedWaste={selectedWaste}
                refreshSellingWasteData={refreshSellingWasteData}
            />
        </div>
    );
};
