import React, { useState, useEffect } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CFormSelect, CForm
} from '@coreui/react';
import styles from '../../../../../scss/活動數據盤點.module.css';

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const EditModal = ({ isEditModalVisible, setEditModalVisible, selectedEmployee }) => {
    const handleClose = () => setEditModalVisible(false);
    const [formValues, setFormValues] = useState({
        period_date: '',
        employee_number: '',
        daily_hours: '',
        workday: '',
        overtime: '',
        sick_leave: '',
        personal_leave: '',
        business_trip: '',
        wedding_and_funeral: '',
        special_leave: '',
        remark: '',
        img_path: null,
    });


    const [previewImage, setPreviewImage] = useState(null); // 用來存儲圖片的 

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setPreviewImage(previewUrl);
            setFormValues((prevValues) => ({ ...prevValues, img_path: file }));
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormValues((prevValues) => ({ ...prevValues, [id]: value }));
    };



    useEffect(() => {
        const fetchEmployeeData = async () => {
            if (!selectedEmployee) return;

            try {
                const response = await fetch('http://localhost:8000/employee_findone', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ Employee_id: selectedEmployee }),
                });

                if (response.ok) {
                    const data = await response.json();
                    const employee = data.employees[0]; // Ensure correct structure
                    setFormValues({
                        period_date: employee?.period_date || '',
                        employee_number: employee?.employee_number || '',
                        daily_hours: employee?.daily_hours || '',
                        workday: employee?.workday || '',
                        overtime: employee?.overtime || '',
                        sick_leave: employee?.sick_leave || '',
                        personal_leave: employee?.personal_leave || '',
                        business_trip: employee?.business_trip || '',
                        wedding_and_funeral: employee?.wedding_and_funeral || '',
                        special_leave: employee?.special_leave || '',
                        remark: employee?.remark || '',
                        img_path: employee?.img_path || '',

                    });
                    setPreviewImage(employee?.img_path || null);
                } else {
                    console.error('Error fetching Employee data:', await response.text());
                }
            } catch (error) {
                console.error('Error fetching Employee data:', error);
            }
        };

        fetchEmployeeData();
    }, [selectedEmployee]);

    return (
        <CModal backdrop="static" visible={isEditModalVisible} onClose={handleClose} className={styles.modal}>
            <CModalHeader>
                <h5><b>編輯數據-工作時數(員工)</b></h5>
            </CModalHeader>
            <CForm>
                <CModalBody>
                    <div className={styles.addmodal}>

                        <CRow className="mb-3">
                            <CFormLabel htmlFor="month" className={`col-sm-2 col-form-label ${styles.addlabel}`} >月份*</CFormLabel>
                            <CCol><CFormInput
                                className={styles.addinput}
                                type="month"
                                id="date"
                                value={formValues.period_date}
                                onChange={handleInputChange}
                                required /></CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="people" className={`col-sm-2 col-form-label ${styles.addlabel}`} >員工數*</CFormLabel>
                            <CCol>
                                <CFormInput
                                    className={styles.addinput}
                                    type="number"
                                    min='0'
                                    id="people"
                                    value={formValues.employee_number}
                                    onChange={handleInputChange}
                                    required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="workhour" className={`col-sm-2 col-form-label ${styles.addlabel}`} >每日工時*<br /><span className={styles.Note}> 不含休息時間</span></CFormLabel>
                            <CCol>
                                <CFormInput
                                    className={styles.addinput}
                                    type="number"
                                    min='0'
                                    id="workhour"
                                    value={formValues.daily_hours}
                                    onChange={handleInputChange}
                                    required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="workday" className={`col-sm-2 col-form-label ${styles.addlabel}`} >每月工作日數*</CFormLabel>
                            <CCol>
                                <CFormInput
                                    className={styles.addinput}
                                    type="number"
                                    min='0'
                                    id="workday"
                                    value={formValues.workday}
                                    onChange={handleInputChange}
                                    required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="plushou" className={`col-sm-2 col-form-label ${styles.addlabel}`} >總加班時數</CFormLabel>
                            <CCol>
                                <CFormInput
                                    className={styles.addinput}
                                    type="number"
                                    min='0'
                                    id="plushour"
                                    value={formValues.overtime}
                                    onChange={handleInputChange}
                                />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="sickhour" className={`col-sm-2 col-form-label ${styles.addlabel}`} >總病假時數</CFormLabel>
                            <CCol>
                                <CFormInput
                                    className={styles.addinput}
                                    type="number"
                                    min='0'
                                    id="sickhour"
                                    value={formValues.sick_leave}
                                    onChange={handleInputChange}
                                />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="personalhour" className={`col-sm-2 col-form-label ${styles.addlabel}`} >總事假時數</CFormLabel>
                            <CCol>
                                <CFormInput
                                    className={styles.addinput}
                                    type="number"
                                    min='0'
                                    id="personalhour"
                                    value={formValues.personal_leave}
                                    onChange={handleInputChange}
                                />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="businesshour" className={`col-sm-2 col-form-label ${styles.addlabel}`} >總出差時數</CFormLabel>
                            <CCol>
                                <CFormInput
                                    className={styles.addinput}
                                    type="number"
                                    min='0'
                                    id="businesshour"
                                    value={formValues.business_trip}
                                    onChange={handleInputChange}
                                />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="deadhour" className={`col-sm-2 col-form-label ${styles.addlabel}`} >總婚喪時數</CFormLabel>
                            <CCol>
                                <CFormInput
                                    className={styles.addinput}
                                    type="number"
                                    min='0'
                                    id="deadhour"
                                    value={formValues.wedding_and_funeral}
                                    onChange={handleInputChange}
                                />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="resthour" className={`col-sm-2 col-form-label ${styles.addlabel}`} >總特休時數</CFormLabel>
                            <CCol>
                                <CFormInput
                                    className={styles.addinput}
                                    type="number"
                                    min='0'
                                    id="resthour"
                                    value={formValues.special_leave}
                                    onChange={handleInputChange}
                                />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="explain" className={`col-sm-2 col-form-label ${styles.addlabel}`} >備註</CFormLabel>
                            <CCol>
                                <CFormTextarea
                                    className={styles.addinput}
                                    type="text"
                                    id="explain"
                                    rows={3}
                                    value={formValues.remark}
                                    onChange={handleInputChange}
                                />

                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="photo" className={`col-sm-2 col-form-label ${styles.addlabel}`}  >圖片*</CFormLabel>
                            <CCol>
                                <CFormInput
                                    type="file"
                                    id="photo"
                                    onChange={(e) => handleImageChange(e)}
                                    required
                                />
                            </CCol>
                        </CRow>
                        {previewImage && ( // 如果有圖片 URL，則顯示預覽
                            <CRow className="mb-3">
                                <CCol className="text-center">
                                    <Zoom><img src={previewImage} alt="Uploaded Preview" /></Zoom>
                                </CCol>
                            </CRow>
                        )}
                        <br />
                        <div style={{ textAlign: 'center' }}>*為必填欄位</div>

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