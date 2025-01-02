
import React, { useState, useEffect } from 'react'
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

    const [userList, setUserList] = useState([]);
    const [noData, setNoData] = useState(false); // 新增一個狀態來判斷是否有資料

    // 獲取顧問資料的函數
    const fetchUserInfo = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/adminConsultant`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                if (data.users && data.users.length > 0) {
                    // 合併相同 user_id 的資料
                    const mergedUsers = data.users.reduce((acc, user) => {
                        const existingUser = acc.find(item => item.user_id === user.user_id);
                        if (existingUser) {
                            existingUser.businesses.push({
                                org_name: user.org_name,
                                assigned_date: user.assigned_date,
                            });
                        } else {
                            acc.push({
                                ...user,
                                businesses: [{
                                    org_name: user.org_name,
                                    assigned_date: user.assigned_date,
                                }],
                            });
                        }
                        return acc;
                    }, []);
                    setUserList(mergedUsers);
                    setNoData(false); // 資料有顯示時設為 false
                } else {
                    setUserList([]); // 沒有資料清空 userList
                    setNoData(true); // 設定無資料提示為 true
                }
            } else {
                console.log(`Error: ${response.status}`);
                setNoData(true); // 如果錯誤狀態也顯示無資料
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
            setNoData(true); // 出現錯誤時顯示無資料
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []); // 加載時執行資料獲取


    ///////////////////////////////刪除////////////////////////////////////////////////
        const deleteUserInfo = async (user_id) => {
            try {
                const response = await fetch(`http://localhost:8000/delete_adminconsultant/${user_id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
    
                const result = await response.json()
                if (response.ok) {
                    console.log(result.message)
                    // Refresh records after deletion
                    refreshAuthorizedRecords()
                } else {
                    console.error('Failed to delete record:', result.detail)
                }
            } catch (error) {
                console.error('Error deleting record:', error)
            }
        }
        const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)
        const [selecteduserId, setSelecteduserId] = useState(null)
    
        const openDeleteModal = (user_id) => {
            setSelecteduserId(user_id)
            setDeleteModalVisible(true)
        }
    
        // 刪除紀錄的函數
        const deleteAndClose = (user_id) => {
            deleteUserInfo(user_id)
            setDeleteModalVisible(false) // 關閉 Modal
        }
    
    
        ///重整頁面用
        const refreshAuthorizedRecords = () => {
            fetchUserInfo()
        }

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
                                <th>負責企業 / 指派日期</th>
                                <th>操作</th>
                            </tr>
                        </CTableHead>
                        <CTableBody className={styles.userTableBody}>
                            {noData ? (
                                <tr>
                                    <td colSpan="6" className={styles.noDataMessage}>無顧問資料</td>
                                </tr>
                            ) : (
                                userList.map((user, index) => (
                                    <tr key={index}>
                                        <td>{user.address}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone}</td>
                                        <td>
                                            {user.businesses.map((business, i) => (
                                                <React.Fragment key={i}>
                                                    {business.org_name} / {business.assigned_date}
                                                    <br />
                                                </React.Fragment>
                                            ))}
                                        </td>
                                        <td>
                                            <FontAwesomeIcon
                                                icon={faPenToSquare}
                                                className={styles.iconPen}
                                            />
                                            <FontAwesomeIcon
                                                icon={faTrashCan}
                                                className={styles.iconTrash}
                                                onClick={() => openDeleteModal(user.user_id)}
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
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


            <CModal
                backdrop="static"
                visible={isDeleteModalVisible}
                onClose={() => setDeleteModalVisible(false)}
                aria-labelledby="StaticBackdropExampleLabel3"
            >
                <CModalHeader>
                    <CModalTitle id="StaticBackdropExampleLabel3">
                        <b>提醒</b>
                    </CModalTitle>
                </CModalHeader>
                <CModalBody>確定要刪除該顧問資料嗎?</CModalBody>
                <CModalFooter>
                    <CButton className="modalbutton1" onClick={() => setDeleteModalVisible(false)} >
                        取消
                    </CButton>
                    <CButton className="modalbutton2" onClick={() => deleteAndClose(selecteduserId)} >
                        確認
                    </CButton>
                </CModalFooter>
            </CModal>

        </main>
    );
};

export default Tabs;
