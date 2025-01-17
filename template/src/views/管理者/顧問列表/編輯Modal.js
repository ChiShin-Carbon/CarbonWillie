
import React, { useState, useEffect } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CFormSelect, CForm
} from '@coreui/react';
import styles from '../../../scss/管理者.module.css';
import Select from 'react-select';

const EditModal = ({ isEditModalVisible, setEditModalVisible, onSuccess, userInfo }) => {
    const handleClose = () => setEditModalVisible(false);
    ////////////////////////////////////////////////////////////////////////////////////////
    const [options, setOptions] = useState([]); // 儲存 API 回傳的選項資料
    const [selectedOptions, setSelectedOptions] = useState([]);
    const handleChange = (selected) => {
        setSelectedOptions(selected);
    };
    useEffect(() => {
        // 從 API 獲取企業資料
        const fetchCompanies = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/adminCompany', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
    
                if (response.ok && Array.isArray(data.companies)) {
                    // 將 API 回傳資料轉換為適合的選項格式
                    const formattedOptions = data.companies.map((company) => ({
                        value: company.business_id,
                        label: company.org_name,
                    }));
                    setOptions(formattedOptions);
    
                    // 當 userInfo 存在且包含 businesses 時，將其格式化並比對
                    if (userInfo && Array.isArray(userInfo.businesses)) {
                        const formattedSelectedOptions = userInfo.businesses.map((business) => {
                            const matchedOption = formattedOptions.find(
                                (option) => option.label === business.org_name
                            );
                            return {
                                value: matchedOption?.value || null, // 使用匹配到的 business_id，找不到時為 null
                                label: business.org_name,
                            };
                        });
    
                        // 過濾掉 value 和 label 為 null 的選項
                        const validSelectedOptions = formattedSelectedOptions.filter(
                            (option) => option.value !== null && option.label !== null
                        );
    
                        setSelectedOptions(validSelectedOptions);
                    }
                } else {
                    console.error(`Error fetching companies: ${data.detail || 'Unknown error'}`);
                }
            } catch (error) {
                console.error('Error fetching companies:', error);
            }
        };
    
        fetchCompanies();
    }, [userInfo]); // 當 userInfo 改變時重新執行
    ////////////////////////////////////////////////////////////////////////////////////////

    console.log(selectedOptions)

    const [userId, setUserId] = useState('');
    const [address, setAddress] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');


    useEffect(() => {
        if (userInfo) {
            // 當 selectedRowData 存在時，更新表單欄位的 state
            setUserId(userInfo.user_id || '');
            setAddress(userInfo.address || '');
            setUsername(userInfo.username || '');
            setEmail(userInfo.email || '');
            setPhone(userInfo.phone || '');
            setPassword(userInfo.password || '');
        }
    }, [userInfo]); // 當 selectedRowData 變動時，更新表單欄位的值
    /////////////////////////////////////////////////////////////////////////////////////////////

    const handleSubmit = async (e) => {
        e.preventDefault(); // 防止表單的默認提交行為
        try {
            const response = await fetch('http://127.0.0.1:8000/edit_adminConsultant', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    address,
                    username,
                    email,
                    phone,
                    password,
                    responsible_companies: selectedOptions.map(option => option.value), // 提取選中的企業 ID
                }),
            });

            const result = await response.json();
            if (response.ok) {
                alert("顧問資料修改成功!")
                onSuccess(); // 提交成功後的回調
                setEditModalVisible(false); // 關閉模態框
            } else {
                console.error('Error updating consultant:', result.detail);
            }
        } catch (error) {
            console.error('Error updating consultant:', error);
        }
    };



    return (
        <CModal visible={isEditModalVisible} onClose={handleClose} className={styles.modal}>
            <CModalHeader>
                <h5><b>編輯顧問資料</b></h5>
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
                            <CFormLabel htmlFor="phone" className={`col-sm-2 col-form-label ${styles.addlabel}`} >手機</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="text" id="phone"
                                    value={phone} onChange={(e) => setPhone(e.target.value)} required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="password" className={`col-sm-2 col-form-label ${styles.addlabel}`} >密碼</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="text" id="password"
                                    value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </CCol>
                        </CRow>
                        <hr />
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="" className={`col-sm-2 col-form-label ${styles.addlabel}`} >負責企業</CFormLabel>
                            <Select
                                className={styles.addinput}
                                options={options}
                                isMulti
                                value={selectedOptions}
                                onChange={handleChange}
                                closeMenuOnSelect={false}
                            />
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