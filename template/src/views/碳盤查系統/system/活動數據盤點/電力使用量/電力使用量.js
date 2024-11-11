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

export const ElectricityUsage = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);

    return (
        <div>
            <CTable hover className={styles.activityTableLong}>
                <CTableHead className={styles.activityTableHead}>
                    <tr>
                        <th>收據月份</th>
                        <th>收據編號</th>
                        <th>用電期間(起)</th>
                        <th>用電期間(迄)</th>
                        <th>填寫類型</th>
                        <th>尖峰度數</th>
                        <th>半尖峰度數</th>
                        <th>週六半尖峰度數</th>
                        <th>離峰度數</th>
                        <th>當月總用電量/總金額</th>
                        <th>備註</th>
                        <th>圖片</th>
                        <th>最近編輯</th>
                        <th>操作</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.activityTableBody}>
                    <tr>
                        <td>1月</td>
                        <td>XXXXX</td>
                        <td>2024/01/12</td>
                        <td>2024/02/12</td>
                        <td>用電度數</td>
                        <td>20600</td>
                        <td>20600</td>
                        <td>20600</td>
                        <td>20600</td>
                        <td>20600</td>
                        <td>讚</td>
                        <td><Zoom><img src="https://i.pinimg.com/564x/6a/e2/41/6ae2418f5b68d216f68e7ed2ab349e0c.jpg" alt="image" /></Zoom></td>
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