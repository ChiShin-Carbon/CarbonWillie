import React, { useState, useEffect } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CFormSelect, CForm
} from '@coreui/react';
import styles from '../../../scss/管理者.module.css';
import Select from 'react-select';

const AddModal = ({ isAddModalVisible, setAddModalVisible, onSuccess }) => {
    const handleClose = () => setAddModalVisible(false);

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
                } else {
                    console.error(`Error fetching companies: ${data.detail || 'Unknown error'}`);
                }
            } catch (error) {
                console.error('Error fetching companies:', error);
            }
        };

        fetchCompanies();
    }, []); // 僅在組件初次加載時執行


    //////////////////////////////////////////////////////

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = {
            address: document.getElementById('address').value,
            password: document.getElementById('password').value,
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            responsible_companies: selectedOptions.map(option => option.value), // 將選中的企業 value 傳遞
        };

        console.log(formData)

        try {
            const response = await fetch('http://127.0.0.1:8000/insert_adminConsultant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                alert('顧問資料已新增');
                setAddModalVisible(false);
                // 新增成功後執行回調函數 (例如重新獲取數據)
                onSuccess();
            } else {
                console.log(`Error: ${data.detail}`);
                console.log(data)
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };



    return (
        <CModal visible={isAddModalVisible} onClose={handleClose} className={styles.modal} backdrop="static">
            <CModalHeader>
                <h5><b>新增顧問資料</b></h5>
            </CModalHeader>
            <CForm onSubmit={handleSubmit}>
                <CModalBody>
                    <div className={styles.addmodal}>

                        <CRow className="mb-3">
                            <CFormLabel htmlFor="address" className={`col-sm-2 col-form-label ${styles.addlabel}`} >帳號</CFormLabel>
                            <CCol><CFormInput className={styles.addinput} type="text" id="address" required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="username" className={`col-sm-2 col-form-label ${styles.addlabel}`} >姓名</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="text" id="username" required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="email" className={`col-sm-2 col-form-label ${styles.addlabel}`} >電子郵件</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="email" id="email" required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="phone" className={`col-sm-2 col-form-label ${styles.addlabel}`} >手機</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="text" id="phone" required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="password" className={`col-sm-2 col-form-label ${styles.addlabel}`} >密碼</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.addinput} type="text" id="password" required />
                            </CCol>
                        </CRow>
                        <hr />
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="" className={`col-sm-2 col-form-label ${styles.addlabel}`} >負責企業</CFormLabel>
                            <Select
                                className={styles.addinput}
                                options={options}
                                isMulti
                                onChange={handleChange}
                                closeMenuOnSelect={false}
                            />
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