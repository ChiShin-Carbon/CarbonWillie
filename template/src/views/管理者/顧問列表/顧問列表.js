
import React, { useState } from 'react'
import {
    CRow, CCol, CCard, CFormSelect, CTab, CTabList, CTabs,
    CTable, CTableBody, CTableHead, CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CButton, CFormCheck
    , CForm, CFormLabel, CFormInput, CFormTextarea, CInputGroup, CInputGroupText,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilDataTransferDown } from '@coreui/icons'

import '../../../scss/碳盤查系統.css'
import styles from '../../../scss/管理者.module.css'
import { Link } from 'react-router-dom'


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrashCan, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import EditModal from './編輯Modal.js';
import AddModal from './新增Modal.js';

const Tabs = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [isAddModalVisible, setAddModalVisible] = useState(false);
    return (
        <main>
            <div className="system-titlediv">
                <div>
                    <h4 className="system-title">顧問列表</h4>
                    <hr className="system-hr"></hr>
                </div>
            </div>


            <CCard className={styles.userCard}>
             
                <div className={styles.userCardBody}>
                    <div className={styles.searchAndUpdate}>
                        <CInputGroup className={styles.searchAndUpdateLeft}>
                            <CFormInput type="search" placeholder="Search" aria-label="Search" />
                            <CButton type="button" color="secondary" variant="outline">
                                <i className="pi pi-search" />
                            </CButton>
                        </CInputGroup>

                        <button className={styles.searchAndUpdateButton} onClick={() => setAddModalVisible(true)}>
                            新增顧問資料
                        </button>
                    </div>

                    <CTable hover className={styles.userTable}>
                        <CTableHead className={styles.userTableHead}>
                            <tr>
                                <th>帳號</th>
                                <th>姓名</th>
                                <th>電子郵件</th>
                                <th>手機</th>
                                <th>負責企業</th>
                                <th>操作</th>
                            </tr>
                        </CTableHead>
                        <CTableBody className={styles.userTableBody}>
                            <tr>
                                <td>XXXXXXXX</td>
                                <td>XXX</td>
                                <td>XXXXX@gmail.com</td>
                                <td>12131564</td>
                                <th>A股份有限公司<br/>B診所</th>
                                <td>
                                    <FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} onClick={() => setEditModalVisible(true)} />
                                    <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                                </td>
                            </tr>
                        </CTableBody>
                    </CTable>

                </div>

            </CCard>

            <EditModal
                isEditModalVisible={isEditModalVisible}
                setEditModalVisible={setEditModalVisible}
            />

            <AddModal
                isAddModalVisible={isAddModalVisible}
                setAddModalVisible={setAddModalVisible}
            />


        </main >

    );
}

export default Tabs;

