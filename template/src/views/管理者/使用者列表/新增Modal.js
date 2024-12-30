import React, { useState } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CFormSelect, CForm
} from '@coreui/react';
import styles from '../../../scss/管理者.module.css';

const AddModal = ({ isAddModalVisible, setAddModalVisible, businessId,onSuccess }) => {
    const handleClose = () => setAddModalVisible(false);

    // 表單欄位狀態
    const [address, setAddress] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [department, setDepartment] = useState('');
    const [position, setPosition] = useState('');
    const [telephone, setTelephone] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); // 阻止表單的默認提交行為

        // 使用原生 HTML 的驗證機制
        if (e.target.checkValidity()) {
            const userData = {
                business_id: businessId,
                username: username,
                telephone: telephone,
                email: email,
                phone: phone,
                department: department,
                position: position,
                address: address,
                password: password,
            };

            try {
                const response = await fetch('http://localhost:8000/insert_adminUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                });

                if (response.ok) {
                    alert('使用者資料已新增');
                    setAddModalVisible(false);
                    // 新增成功後執行回調函數 (例如重新獲取數據)
                    onSuccess();
                } else {
                    const responseText = await response.text();
                    try {
                        const errorData = JSON.parse(responseText);
                        console.log('新增失敗，請稍後再試:', errorData);
                    } catch (err) {
                        console.log('Response is not JSON:', responseText);
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                console.log('新增失敗，請稍後再試:', error.message);
            }
        } else {
            console.log('表單驗證未通過');
        }
    };

    return (
        <CModal visible={isAddModalVisible} onClose={handleClose} className={styles.modal}  backdrop="static">
            <CModalHeader>
                <h5><b>新增使用者資料</b></h5>
            </CModalHeader>
            <CForm onSubmit={handleSubmit}>
                <CModalBody>
                    <div className={styles.addmodal}>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="username" className={`col-sm-2 col-form-label ${styles.addlabel}`} >姓名</CFormLabel>
                            <CCol>
                                <CFormInput
                                    className={styles.addinput}
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="email" className={`col-sm-2 col-form-label ${styles.addlabel}`} >電子郵件</CFormLabel>
                            <CCol>
                                <CFormInput
                                    className={styles.addinput}
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="telephone" className={`col-sm-2 col-form-label ${styles.addlabel}`} >辦公室電話</CFormLabel>
                            <CCol>
                                <CFormInput
                                    className={styles.addinput}
                                    type="text"
                                    id="telephone"
                                    value={telephone}
                                    onChange={(e) => setTelephone(e.target.value)}
                                    required
                                />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="phone" className={`col-sm-2 col-form-label ${styles.addlabel}`} >手機</CFormLabel>
                            <CCol>
                                <CFormInput
                                    className={styles.addinput}
                                    type="text"
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="department" className={`col-sm-2 col-form-label ${styles.addlabel}`} >所屬部門</CFormLabel>
                            <CCol>
                                <CFormSelect
                                    aria-label="Default select example"
                                    id="department"
                                    className={styles.addinput}
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                >
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
                                <CFormSelect
                                    aria-label="Default select example"
                                    id="position"
                                    className={styles.addinput}
                                    value={position}
                                    onChange={(e) => setPosition(e.target.value)}
                                >
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
                            <CFormLabel htmlFor="address" className={`col-sm-2 col-form-label ${styles.addlabel}`} >帳號</CFormLabel>
                            <CCol>
                                <CFormInput
                                    className={styles.addinput}
                                    type="text"
                                    id="address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="password" className={`col-sm-2 col-form-label ${styles.addlabel}`} >密碼</CFormLabel>
                            <CCol>
                                <CFormInput
                                    className={styles.addinput}
                                    type="text"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </CCol>
                        </CRow>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton className="modalbutton1" onClick={handleClose}>取消</CButton>
                    <CButton className="modalbutton2" type="submit">新增</CButton>
                </CModalFooter>
            </CForm>
        </CModal>
    );
};

export default AddModal;
