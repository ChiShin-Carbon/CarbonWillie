import React, { useState } from 'react'
import {
    CRow, CCol, CCard, CFormSelect, CTab, CTabList, CTabs,
    CTable, CTableBody, CTableHead, CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CButton, CFormCheck
    , CForm, CFormLabel, CFormInput, CFormTextarea,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilDataTransferDown } from '@coreui/icons'

import '../../../../scss/碳盤查系統.css'
import styles from '../../../../scss/顧問system.module.css'
import { Link } from 'react-router-dom'


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faCircleXmark,faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';


const Tabs = () => {
    // 定義 useState 來控制 Modal 的顯示
    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const [isEditModalVisible, setEditModalVisible] = useState(false);

    return (
        <main>
            <CTabs activeItemKey={1}>
                <CTabList variant="underline-border" className="system-tablist">
                    <Link to="." className="system-tablist-link">
                        <CTab aria-controls="tab1" itemKey={1} className="system-tablist-choose">排放源鑑別</CTab>
                    </Link>
                    <Link to="/碳盤查系統/system/活動數據分配" className="system-tablist-link">
                        <CTab aria-controls="tab3" itemKey={4} className="system-tablist-choose">ddd</CTab>
                    </Link>
                    <Link to="/碳盤查系統/system/活動數據盤點" className="system-tablist-link">
                        <CTab aria-controls="tab3" itemKey={2} className="system-tablist-choose">ddd</CTab>
                    </Link>
                </CTabList>
            </CTabs>


            <div className="system-titlediv">
                <div>
                    <h4 className="system-title">排放源鑑別</h4>
                    <hr className="system-hr"></hr>
                </div>
                <button className="system-save">儲存</button>
            </div>
            <div className={styles.cardRow}>
                <CCard className={styles.card}>
                    <CTable hover className={styles.table}>
                        <CTableHead className={styles.tableHead}>
                            <tr>
                                <th style={{width:'15%'}}>填寫進度</th>
                                <th>製程</th>
                                <th>設備</th>
                                <th>原燃物料或產品</th>
                            </tr>
                        </CTableHead>
                        <CTableBody className={styles.tableBody}>
                            <tr>
                                <td><FontAwesomeIcon icon={faCircleCheck} className={styles.iconCorrect} /></td>
                                <td>水肥處理程序</td>
                                <td>化糞池</td>
                                <td>水肥</td>
                            </tr>
                            <tr>
                                <td><FontAwesomeIcon icon={faCircleXmark} className={styles.iconWrong} /></td>
                                <td>冷媒補充</td>
                                <td>家用冷凍、冷藏裝備</td>
                                <td>HFC-134a/R-134a，四氟乙烷HFC-134a/R-1</td>
                            </tr>
                        </CTableBody>
                    </CTable>
                </CCard>

                <CCard className={styles.card}>
                </CCard>
            </div>

        </main>

    );
}

export default Tabs;

