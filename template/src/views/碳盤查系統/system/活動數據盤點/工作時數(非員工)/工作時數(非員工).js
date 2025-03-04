import React, { useState, useEffect } from 'react'; // Ensure useEffect is imported
import {
    CTable, CTableHead, CTableBody, CModal, CModalBody, CModalFooter, CModalHeader, CButton
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import styles from '../../../../../scss/活動數據盤點.module.css';
import EditModal from './編輯Modal.js';

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css';

import { getNonEmployeeData } from '../fetchdata.js';

export const NonEmployee = ({refreshNonEmployeeData}) => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [selectedNonemployeeId, setSelectedNonemployeeId] = useState(null) // State to store selected vehicle ID
    const [nonemployeeData, setNonEmployeeData] = useState([]);


    // Fetch employee data when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            const data = await getNonEmployeeData();
            if (data) {
                setNonEmployeeData(data);
            }
        };
        fetchData();
    }, []);

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
                        <th>最近編輯</th>
                        <th>操作</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.activityTableBody}>
                    {nonemployeeData.length > 0 ? (
                        nonemployeeData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.period_date}</td>
                                <td>{item.nonemployee_number}</td>
                                <td>{item.total_hours}</td>
                                <td>{item.total_days}</td>
                                <td>{item.remark}</td>
                                <td>
                                    <Zoom>
                                        <img src={`fastapi/${item.img_path}`} alt="image" width="100" />
                                    </Zoom>
                                </td>
                                <td>{item.edit_time}</td>
                                <td>
                                    <FontAwesomeIcon
                                        icon={faPenToSquare}
                                        className={styles.iconPen}
                                        onClick={() => {
                                            setSelectedNonemployeeId(item.nonemployee_id) // Set the selected vehicle ID
                                            setEditModalVisible(true) // Open the modal
                                        }}
                                    />
                                    <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="14" className="text-center">目前沒有非員工資料</td>
                        </tr>
                    )}
                </CTableBody>
            </CTable>
            <EditModal
                isEditModalVisible={isEditModalVisible}
                setEditModalVisible={setEditModalVisible}
                selectedNonemployeeId={selectedNonemployeeId}
                refreshNonEmployeeData={refreshNonEmployeeData}
            />
        </div>
    );
};
