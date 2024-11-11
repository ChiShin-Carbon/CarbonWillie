// functions.js
import React, { useState } from 'react'; // 確保引入 useState
import {
    CTable, CTableHead, CTableBody, CFormSelect, CModal, CModalBody, CModalFooter, CModalHeader, CForm, CButton,
    CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CCollapse, CCard, CCardBody
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import styles from '../../../../../scss/活動數據盤點.module.css';
import EditModal from './編輯Modal.js';


import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'


export const Commuting = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);

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
                    <tr>
                        <td>汽車</td>
                        <td>XXX</td>
                        <td>柴油</td>
                        <td>讚</td>
                        <td><Zoom><img src="https://i.pinimg.com/564x/8b/7d/0c/8b7d0c88227abf5a237870b047677b4b.jpg" alt="image" /></Zoom></td>
                        <td>蔡沂庭<br />2024/10/16 12:09</td>
                        <td>
                            <FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} onClick={() => setEditModalVisible(true)} />
                            <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                        </td>
                    </tr>
                </CTableBody>
            </CTable>
            <EditModal
                isEditModalVisible={isEditModalVisible}
                setEditModalVisible={setEditModalVisible}
            />
        </div>
    );
};