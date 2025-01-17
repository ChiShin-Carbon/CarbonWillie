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
import { useLocation } from 'react-router-dom';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrashCan, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import EditModal from './編輯Modal.js';
import AddModal from './新增Modal.js';

const Tabs = () => {
    const location = useLocation();
    const businessId = location.state?.business_id; // 取得傳遞的 business_id
    const orgName = location.state?.org_name;
    console.log(orgName)

    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [isAddModalVisible, setAddModalVisible] = useState(false);

    const [userList, setUserList] = useState([]);
    const [noData, setNoData] = useState(false); // 新增一個狀態來判斷是否有資料

    const [selectedUser, setSelectedUser] = useState(null); // 新增狀態存儲被選中的行資料
    // 編輯按鈕點擊事件
    const handleEditClick = (user) => {
        setSelectedUser(user); // 設置選中的行資料
        setEditModalVisible(true); // 顯示編輯 Modal
    };


    // 獲取企業使用者資料的函數
    const fetchUserInfo = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/adminUser/${businessId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                if (data.users && data.users.length > 0) {
                    setUserList(data.users); // 有資料就顯示使用者資料
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

    // 部門映射
    const departmentMap = {
        1: "管理部門",
        2: "資訊部門",
        3: "業務部門",
        4: "門診部門",
        5: "健檢部門",
        6: "檢驗部門",
        7: "其他"
    };

    // 職位映射
    const positionMap = {
        1: "總經理",
        2: "副總經理",
        3: "主管",
        4: "副主管",
        5: "組長",
        6: "其他"
    };



    ///////////////////////////////刪除////////////////////////////////////////////////
    const deleteUserInfo = async (user_id) => {
        try {
            const response = await fetch(`http://localhost:8000/delete_adminuser/${user_id}`, {
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

    const [searchQuery, setSearchQuery] = useState(""); // 儲存搜尋關鍵字
    // 處理搜尋關鍵字變更
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };
    // 過濾公司列表
    const filteredUserList = userList.filter((user) =>
        // 檢查所有欄位的值，並確保每個欄位都能正確處理 null 或 undefined
        Object.values(user).some(value =>
            value != null && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        // 檢查 departmentMap 和 positionMap 中對應的值
        (departmentMap[user.department] && departmentMap[user.department].toLowerCase().includes(searchQuery.toLowerCase())) ||
        (positionMap[user.position] && positionMap[user.position].toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <main>
            <div className="system-titlediv">
                <div>
                    <h4 className="system-title">企業使用者資料列表</h4>
                    <hr className="system-hr"></hr>
                </div>
                <div className={styles.backButton}><Link to="../管理者/企業列表"><FontAwesomeIcon icon={faArrowLeft} /> 返回企業列表</Link></div>
            </div>

            <CCard className={styles.userCard}>
                <div className={styles.userCardHead}>
                    {orgName}
                </div>
                <div className={styles.userCardBody}>
                    <div className={styles.searchAndUpdate}>
                        <CInputGroup className={styles.searchAndUpdateLeft}>
                            <CFormInput type="search" placeholder="Search" aria-label="Search" value={searchQuery} // 綁定搜尋關鍵字
                                onChange={handleSearchChange} // 處理搜尋變更 
                            />
                            <CButton type="button" color="secondary" variant="outline" disabled>
                                <i className="pi pi-search" />
                            </CButton>
                        </CInputGroup>

                        <button className={styles.searchAndUpdateButton} onClick={() => setAddModalVisible(true)}>
                            新增使用者資料
                        </button>
                    </div>

                    <CTable hover className={styles.userTable}>
                        <CTableHead className={styles.userTableHead}>
                            <tr>
                                <th>帳號</th>
                                <th>姓名</th>
                                <th>電子郵件</th>
                                <th>辦公室電話</th>
                                <th>手機</th>
                                <th>所屬部門</th>
                                <th>職位</th>
                                <th>操作</th>
                            </tr>
                        </CTableHead>
                        <CTableBody className={styles.userTableBody}>
                            {noData ? (
                                <tr>
                                    <td colSpan="8" className={styles.noDataMessage}>無該企業的使用者資料</td>
                                </tr>
                            ) : (
                                filteredUserList.map((user, index) => (
                                    <tr key={index}>
                                        <td>{user.address}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.telephone}</td>
                                        <td>{user.phone}</td>
                                        <td>{departmentMap[user.department] || '未指定'}</td>
                                        <td>{positionMap[user.position] || '未指定'}</td>
                                        <td>
                                            <FontAwesomeIcon
                                                icon={faPenToSquare}
                                                className={styles.iconPen}
                                                onClick={() => handleEditClick(user)} // 傳遞行資料
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
                onSuccess={refreshAuthorizedRecords}
                userInfo={selectedUser}
            />

            <AddModal
                isAddModalVisible={isAddModalVisible}
                setAddModalVisible={setAddModalVisible}
                businessId={businessId}
                onSuccess={refreshAuthorizedRecords}
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
                <CModalBody>確定要刪除該企業使用者資料嗎?</CModalBody>
                <CModalFooter>
                    <CButton className="modalbutton1" onClick={() => setDeleteModalVisible(false)} >
                        取消
                    </CButton>
                    <CButton className="modalbutton2" onClick={() => deleteAndClose(selecteduserId)} >
                        確認
                    </CButton>
                </CModalFooter>
            </CModal>


        </main >
    );
}

export default Tabs;
