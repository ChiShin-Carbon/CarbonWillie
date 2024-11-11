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

export const NonEmployee = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);

    return (
        <div>
            <CTable hover className={styles.activityTableShort}>
                <CTableHead className={styles.activityTableHead}>
                    <tr>
                        <th>月份</th>
                        <th>人數</th>
                        <th>總工作時數</th>
                        <th>總工作人天</th>
                        <th>備註</th>
                        <th>圖片</th>
                        <th>操作</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.activityTableBody}>
                    <tr>
                        <td>一月</td>
                        <td>24</td>
                        <td>8</td>
                        <td>22</td>
                        <td>讚</td>
                        <td><Zoom><img src="https://i.pinimg.com/736x/5d/a8/60/5da8608aab2a2ebb0bb9e56ee9401414.jpg" alt="image" /></Zoom></td>
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