
import React, { useState, useEffect } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CFormSelect, CForm
} from '@coreui/react';
import styles from '../../../scss/管理者.module.css';

const EditModal = ({ isEditModalVisible, setEditModalVisible, userInfo, onSuccess }) => {
    const handleClose = () => setEditModalVisible(false);

    //////////////////////////////////////////////////////////////////////////////////
    const [userId, setUserId] = useState('');
    const [address, setAddress] = useState('');
    const [username, setUsername] = useState('');
    const [telephone, setTelephone] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [department, setDepartment] = useState('');
    const [position, setPosition] = useState('');
    const [password, setPassword] = useState('');


    useEffect(() => {
        if (userInfo) {
            // 當 selectedRowData 存在時，更新表單欄位的 state
            setUserId(userInfo.user_id || '');
            setAddress(userInfo.address || '');
            setUsername(userInfo.username || '');
            setDepartment(userInfo.department || '');
            setPosition(userInfo.position || '');
            setTelephone(userInfo.telephone || '');
            setEmail(userInfo.email || '');
            setPhone(userInfo.phone || '');
            setPassword(userInfo.password || '');
        }
    }, [userInfo]); // 當 selectedRowData 變動時，更新表單欄位的值

    ////////////////////////////////////////////////////////////////
    const handleSubmit = async (e) => {
        e.preventDefault();  // 阻止表單的默認提交行為
    
        // 使用原生 HTML 的驗證機制
        if (e.target.checkValidity()) {
            const userData = {
                user_id: userId,  // 識別資料的唯一欄位
                address:address,
                password:password,
                department:department,
                position:position,
                username:username,
                telephone: telephone,
                email: email,
                phone: phone,
            };
    
            try {
                // 這裡的 URL 必須對應到 FastAPI 編輯資料的 API 路徑
                const response = await fetch('http://localhost:8000/edit_adminUser', {
                    method: 'PUT',  // 使用 PUT 方法來編輯資料
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),  // 傳送編輯後的資料
                });
    
                if (response.ok) {
                    alert('使用者資料已更新');
                    setEditModalVisible(false);  // 關閉編輯視窗
                    onSuccess()
                } else {
                    const responseText = await response.text();
                    try {
                        const errorData = JSON.parse(responseText);
                        console.log('更新失敗，請稍後再試:', errorData);
                    } catch (err) {
                        console.log('Response is not JSON:', responseText);
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                console.log('更新失敗，請稍後再試:', error.message);
            }
        } else {
            console.log('表單驗證未通過');
        }
    };


    return (
        <CModal visible={isEditModalVisible} onClose={handleClose} className={styles.modal} backdrop="static">
            <CModalHeader>
                <h5><b>編輯企業資料</b></h5>
            </CModalHeader>
            <CForm onSubmit={handleSubmit}>
                <CModalBody>
                    <div className={styles.addmodal}>

                        <CRow className="mb-3">
                            <CFormLabel htmlFor="address" className={`col-sm-2 col-form-label ${styles.addlabel}`} >帳號</CFormLabel>
                            <CCol><CFormInput className={styles.addinput} type="text" id="address"
                                value={address} onChange={(e) => setAddress(e.target.value)} required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="username" className={`col-sm-2 col-form-label ${styles.addlabel}`} >姓名</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="text" id="username"
                                 value={username} onChange={(e) => setUsername(e.target.value)} required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="email" className={`col-sm-2 col-form-label ${styles.addlabel}`} >電子郵件</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="email" id="email"
                                 value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="telephone" className={`col-sm-2 col-form-label ${styles.addlabel}`} >辦公室電話</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="text" id="telephone"
                                 value={telephone} onChange={(e) => setTelephone(e.target.value)} required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="phone" className={`col-sm-2 col-form-label ${styles.addlabel}`} >手機</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="text" id="phone"
                                 value={phone} onChange={(e) => setPhone(e.target.value)} required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="department" className={`col-sm-2 col-form-label ${styles.addlabel}`} >所屬部門</CFormLabel>
                            <CCol>
                                <CFormSelect aria-label="Default select example" id="department" className={styles.addinput}
                                 value={department} onChange={(e) => setDepartment(e.target.value)}>
                                    <option value="1">管理部門</option>
                                    <option value="2">資訊部門</option>
                                    <option value="3">業務部門</option>
                                    <option value="4">門診部門</option>
                                    <option value="5">健檢部門</option>
                                    <option value="6">檢驗部門</option>
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="position" className={`col-sm-2 col-form-label ${styles.addlabel}`} >職位</CFormLabel>
                            <CCol>
                                <CFormSelect aria-label="Default select example" id="position" className={styles.addinput}
                                 value={position} onChange={(e) => setPosition(e.target.value)}>
                                    <option value="1">總經理</option>
                                    <option value="2">副總經理</option>
                                    <option value="3">主管</option>
                                    <option value="4">副主管</option>
                                    <option value="5">組長</option>
                                    <option value="6">其他</option>
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="password" className={`col-sm-2 col-form-label ${styles.addlabel}`} >密碼</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="text" id="password"
                                 value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </CCol>
                        </CRow>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton className="modalbutton1" onClick={handleClose}>取消</CButton>
                    <CButton className="modalbutton2" type="submit">儲存</CButton>
                </CModalFooter>
            </CForm>
        </CModal>
    );
};


export default EditModal;