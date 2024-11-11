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


export const Machinery = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);

    return (
        <div>
            <CTable hover className={styles.activityTable1}>
                <CTableHead className={styles.activityTableHead}>
                    <tr>
                        <th>發票/收據日期</th>
                        <th>發票號碼/收據編號</th>
                        <th>設備位置 </th>
                        <th>能源類型</th>
                        <th>使用量</th>
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
                        <td>XXX</td>
                        <td>柴油</td>
                        <td>XXX</td>
                        <td>讚</td>
                        <td><Zoom><img src="https://i.pinimg.com/564x/9c/30/c7/9c30c7c2e3d7b90544f4b3e3f59e3ca0.jpg" alt="image" /></Zoom></td>
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