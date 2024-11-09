//EditModal.js
import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CForm, CRow, CFormLabel, CCol, CFormSelect, CButton } from '@coreui/react';
import styles from '../../../../scss/活動數據盤點.module.css'

const EditModal = forwardRef((props, ref) => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [modalTableName, setModalTableName] = useState('');
    const [modalUserNames, setModalUserNames] = useState({});  //接收傳過來的值
    const [modalUserNamesOld, setModalUserNamesOld] = useState({});  //接收傳過來的值

    useImperativeHandle(ref, () => ({
        openModal(tableName, userNames) {
            setModalTableName(tableName);
            setModalUserNames(userNames);
            setModalUserNamesOld(userNames);
            setEditModalVisible(true);
        },
    }));

    // console.log(modalTableName);
    // console.log(modalUserNames);


    //////////////////抓Users的資料//////////////////////////////////
    const [userDepartments, setUserDepartments] = useState({});
    const [users, setUsers] = useState([]); // 儲存用戶資料

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8000/users', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();

            if (data.users) {
                setUsers(data.users); // 儲存用戶資料
                const departments = data.users.reduce((acc, user) => {
                    if (!acc[user.department]) {
                        acc[user.department] = [];
                    }
                    acc[user.department].push(user.username);
                    return acc;
                }, {});
                setUserDepartments(departments);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    //////////////////抓Users的資料END//////////////////////////////////

    const renderUserOptions = (departmentId) => {
        const departmentUsers = userDepartments[departmentId] || [];
        return (
            <>
                <option value="無">無</option>
                {departmentUsers.map((username, index) => (
                    <option key={index} value={username}>
                        {username}
                    </option>
                ))}
            </>
        );
    };

    const handleUserChange = async (department, value) => {
        // 更新狀態
        setModalUserNames(prevState => ({
            ...prevState,
            [department]: value,
        }));
    };

    ////////////////////////////////////////////////////////////////////////////////////////////
   
    const handleSubmit = () => {
        Object.keys(modalUserNames).forEach(department => {
            const oldUsername = modalUserNamesOld[department];  // 當前選擇的用戶名
            const newUsername = modalUserNames[department];  // 當前選擇的用戶名
            console.log(oldUsername, newUsername, modalTableName)

            // 檢查是否有變動
            if (oldUsername === '無' && newUsername !== '無') {
                // 從無選擇改成選擇用戶，則插入新的填寫人
                insertAuthorizedUser(modalTableName, newUsername);  // 使用 modalTableName 作為 tableName
            } else if (oldUsername !== newUsername && newUsername !== '無') {
                // 用戶名發生變動，則更新填寫人
                updateAuthorizedUser(modalTableName, oldUsername, newUsername);  // 使用 modalTableName 作為 tableName
            } else if (oldUsername !== '無' && newUsername === '無') {
                // 用戶名從 A 變成無，則刪除該用戶的紀錄
                deleteAuthorizedUser(modalTableName, oldUsername);  // 使用 modalTableName 作為 tableName
            }
        });

        // 關閉 Modal
        setEditModalVisible(false);
    };

    const insertAuthorizedUser = async (tableName, newUsername) => {
        const userId = users.find(user => user.username === newUsername)?.user_id;
        if (userId) {
            const isDone = 0; // 可以根據需求修改
            const completedAt = null; // 可以根據需求修改
    
            try {
                const response = await fetch(`http://localhost:8000/editInsert_authorized/${tableName}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        is_done: isDone,
                        completed_at: completedAt,
                    }),
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error Response:', errorData);
                    throw new Error(errorData.detail || 'Unknown error');
                }
                const result = await response.json();
                console.log('Server Response:', result);
    
                props.onSuccess(); // 呼叫父層的刷新函數
                alert('修改成功');
            } catch (error) {
                console.error('Error during the update:', error);
                setSuccessMessage('更新失敗，請稍後再試');
            }
        }
    };
    

    const updateAuthorizedUser = async (tableName, oldUsername, newUsername) => {
        const oldUserId = users.find(user => user.username === oldUsername)?.user_id;
        const newUserId = users.find(user => user.username === newUsername)?.user_id;
  

        if (oldUserId && newUserId) {
            try {
                const response = await fetch(`http://localhost:8000/editUpdate_authorized/${tableName}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        old_user_id: oldUserId,
                        new_user_id: newUserId,
                    }),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error Response:', errorData);
                    throw new Error(errorData.detail || 'Unknown error');
                }
                const result = await response.json();
                console.log('Server Response:', result);
    
                props.onSuccess(); // 呼叫父層的刷新函數
                alert('修改成功');
            } catch (error) {
                console.error('Error during the update:', error);
                setSuccessMessage('更新失敗，請稍後再試');
            }
        }
    };

    const deleteAuthorizedUser = async (tableName, oldUsername) => {
        const oldUserId = users.find(user => user.username === oldUsername)?.user_id;
        if (oldUserId) {
            try {
                const response = await fetch(`http://localhost:8000/editDelete_authorized/${tableName}?user_id=${oldUserId}`, {  // 使用 query parameter
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error Response:', errorData);
                    throw new Error(errorData.detail || 'Unknown error');
                }
    
                const result = await response.json();
                console.log('Server Response:', result);
    
                props.onSuccess(); // 刷新父層資料
                alert('修改成功');
            } catch (error) {
                console.error('Error during the deletion:', error);
                setSuccessMessage('修改失敗，請稍後再試');
            }
        }
    };
    


    return (
        <CModal
            backdrop="static"
            visible={isEditModalVisible}
            onClose={() => setEditModalVisible(false)}
            aria-labelledby="StaticBackdropExampleLabel2"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel2"><b>編輯各部門填寫人-{modalTableName}</b></CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CForm >
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="sitename" className={`col-sm-2 col-form-label ${styles.addlabel}`} >管理部門</CFormLabel>
                        <CCol>
                            <CFormSelect
                                aria-label="Default select example"
                                className={styles.addinput}
                                value={modalUserNames['管理部門']} // 預設選項值，如果沒有則為空
                                onChange={(e) => handleUserChange('管理部門', e.target.value)} // 更新選項
                            >
                                {renderUserOptions(0)}
                            </CFormSelect>
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CFormLabel htmlFor="sitename" className={`col-sm-2 col-form-label ${styles.addlabel}`} >業務部門</CFormLabel>
                        <CCol>
                            <CFormSelect
                                aria-label="Default select example"
                                className={styles.addinput}
                                value={modalUserNames['業務部門']}
                                onChange={(e) => handleUserChange('業務部門', e.target.value)}
                            >
                                {renderUserOptions(1)}
                            </CFormSelect>
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CFormLabel htmlFor="sitename" className={`col-sm-2 col-form-label ${styles.addlabel}`} >資訊部門</CFormLabel>
                        <CCol>
                            <CFormSelect
                                aria-label="Default select example"
                                className={styles.addinput}
                                value={modalUserNames['資訊部門']}
                                onChange={(e) => handleUserChange('資訊部門', e.target.value)}
                            >
                                {renderUserOptions(2)}
                            </CFormSelect>
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CFormLabel htmlFor="sitename" className={`col-sm-2 col-form-label ${styles.addlabel}`} >門診部門</CFormLabel>
                        <CCol>
                            <CFormSelect
                                aria-label="Default select example"
                                className={styles.addinput}
                                value={modalUserNames['門診部門']}
                                onChange={(e) => handleUserChange('門診部門', e.target.value)}
                            >
                                {renderUserOptions(3)}
                            </CFormSelect>
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CFormLabel htmlFor="sitename" className={`col-sm-2 col-form-label ${styles.addlabel}`} >健檢部門</CFormLabel>
                        <CCol>
                            <CFormSelect
                                aria-label="Default select example"
                                className={styles.addinput}
                                value={modalUserNames['健檢部門']}
                                onChange={(e) => handleUserChange('健檢部門', e.target.value)}
                            >
                                {renderUserOptions(4)}
                            </CFormSelect>
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CFormLabel htmlFor="sitename" className={`col-sm-2 col-form-label ${styles.addlabel}`} >檢驗部門</CFormLabel>
                        <CCol>
                            <CFormSelect
                                aria-label="Default select example"
                                className={styles.addinput}
                                value={modalUserNames['檢驗部門']}
                                onChange={(e) => handleUserChange('檢驗部門', e.target.value)}
                            >
                                {renderUserOptions(5)}
                            </CFormSelect>
                        </CCol>
                    </CRow>

                </CForm>
            </CModalBody>
            <CModalFooter>
                <CButton className="modalbutton1" onClick={() => setEditModalVisible(false)}>
                    取消
                </CButton>
                <CButton className="modalbutton2" onClick={handleSubmit} >確認</CButton>
            </CModalFooter>
        </CModal>
    );
});

export default EditModal;
