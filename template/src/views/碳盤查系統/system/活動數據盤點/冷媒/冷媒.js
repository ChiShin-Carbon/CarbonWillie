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
import AddFillModal from './新增填充Modal.js';
import EditFillModal from './編輯填充Modal.js';


import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'






export const Refrigerant = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null); // 用於追蹤展開的列
    const currentFunction = 'Refrigerant';

    const [isAddFillModalVisible, setAddFillModalVisible] = useState(false);
    const [isEditFillModalVisible, setEditFillModalVisible] = useState(false);

    const mockData = [
        {
            id: 1,
            equipmentType: '冰箱',
            location: 'XXX',
            refrigerantType: 'R11',
            note: '讚',
            imageUrl: 'https://i.pinimg.com/736x/c9/be/70/c9be70ef20f18513f025856d69034dcb.jpg',
            lastEditor: '蔡沂庭',
            lastEditDate: '2024/10/16 12:09'
        },
        {
            id: 1,
            equipmentType: '冷氣',
            location: 'XXX',
            refrigerantType: 'R11',
            note: '讚',
            imageUrl: 'https://i.pinimg.com/736x/c9/be/70/c9be70ef20f18513f025856d69034dcb.jpg',
            lastEditor: '張偉',
            lastEditDate: '2024/10/16 12:09'
        },
        // 可以添加更多假資料
    ];

    const toggleRow = (index) => {
        setSelectedRow(selectedRow === index ? null : index);
    };

   
    return (
        <div>
            <CTable hover className={styles.activityTable1}>
                <CTableHead className={styles.activityTableHead}>
                    <tr>
                        <th>設備類型</th>
                        <th>設備位置</th>
                        <th>冷媒類型</th>
                        <th>備註</th>
                        <th>圖片</th>
                        <th>最近編輯</th>
                        <th>操作</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.activityTableBody}>
                    {mockData.map((item, index) => (
                        <React.Fragment key={item.id}>
                            <tr onClick={() => toggleRow(index)} className={styles.trChoose}>
                                <td>{item.equipmentType}</td>
                                <td>{item.location}</td>
                                <td>{item.refrigerantType}</td>
                                <td>{item.note}</td>
                                <td><Zoom><img src={item.imageUrl} alt="image" /></Zoom></td>
                                <td>{item.lastEditor}<br />{item.lastEditDate}</td>
                                <td>
                                    <FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} onClick={() => setEditModalVisible(true)} />
                                    <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                                </td>
                            </tr>
                            {selectedRow === index && (
                                <td colSpan="7">
                                    <div className={styles.expandedContent}>
                                        {/* 在展開的區塊中放置你需要的內容 */}
                                        <div className={styles.fill}>
                                            <div>填充紀錄</div>
                                            <button onClick={() => setAddFillModalVisible(true)}>新增</button>
                                        </div>
                                        <table>
                                            <tr>
                                                <th>發票/收據日期</th>
                                                <th>發票號碼/收據編號</th>
                                                <th>填充量</th>
                                                <th>逸散率(%)</th>
                                                <th>備註</th>
                                                <th>圖片</th>
                                                <th>最近編輯</th>
                                                <th>操作</th>
                                            </tr>
                                            <tr>
                                                <td>2023/01/15</td>
                                                <td>XXXXX</td>
                                                <td>XXX</td>
                                                <td>XXX</td>
                                                <td>讚</td>
                                                <td><Zoom><img src="https://i.pinimg.com/564x/f3/d9/27/f3d92764f7e4d8ab25835b39f20e2e0f.jpg" alt="image" /></Zoom></td>
                                                <td>蔡沂庭<br />2024/10/16 12:09</td>
                                                <td>
                                                    <FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} onClick={() => setEditFillModalVisible(true)} />
                                                    <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </td>
                            )}
                        </React.Fragment>
                    ))}
                </CTableBody>
            </CTable>
            <EditModal
                isEditModalVisible={isEditModalVisible}
                setEditModalVisible={setEditModalVisible}
                currentFunction={currentFunction}
            />



            {/* 填充新增編輯modal */}
            <AddFillModal
                isAddFillModalVisible={isAddFillModalVisible}
                setAddFillModalVisible={setAddFillModalVisible}
            />

            <EditFillModal
                isEditFillModalVisible={isEditFillModalVisible}
                setEditFillModalVisible={setEditFillModalVisible}
            />





        </div>
    )
};