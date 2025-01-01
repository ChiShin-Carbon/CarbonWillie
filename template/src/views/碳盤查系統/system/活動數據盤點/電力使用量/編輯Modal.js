import React, { useState, useEffect } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CFormSelect, CForm
} from '@coreui/react';
import styles from '../../../../../scss/活動數據盤點.module.css';

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const EditModal = ({ isEditModalVisible, setEditModalVisible, selectedUsage }) => {
    const handleClose = () => setEditModalVisible(false);

    const [previewImage, setPreviewImage] = useState(null); // 用來存儲圖片的 
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file); // 創建圖片預覽 URL
            setPreviewImage(previewUrl); // 保存 URL 到狀態
        }
    };

    const [FormValues, setFormValues] = useState({
        Doc_date: '',
        Doc_number: '',
        period_start: '',
        period_end: '',
        usage: '',
        amount: '',
        remark: '',
    });



    useEffect(() => {
        const fetchElectricityData = async () => {
            if (!selectedUsage) return;

            try {
                const response = await fetch('http://localhost:8000/Electricity_Usage_findone', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ electricity_id: selectedUsage }),
                });

                if (response.ok) {
                    const data = await response.json();
                    const UsageData = data.Electricity_Usage[0];
                    setFormValues({
                        Doc_date: UsageData?.Doc_date || '',
                        Doc_number: UsageData?.Doc_number || '',
                        period_start: UsageData?.period_start || '',
                        period_end: UsageData?.period_end || '',
                        usage: UsageData?.usage || '',
                        amount: UsageData?.amount || '',
                        remark: UsageData?.remark || '',
                    });
                    setPreviewImage(UsageData?.img_path || null);
                } else {
                    console.error('Error fetching machinery data:', await response.text());
                }
            } catch (error) {
                console.error('Error fetching machinery data:', error);
            }
        };

        fetchElectricityData();
    }, [selectedUsage]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormValues((prevValues) => ({ ...prevValues, [id]: value }));
    };


    return (
        <CModal backdrop="static" visible={isEditModalVisible} onClose={handleClose} className={styles.modal} size='xl'>
            <CModalHeader>
                <h5><b>編輯數據-電力使用量</b></h5>
            </CModalHeader>
            <CForm>
                <CModalBody>
                    <div className={styles.addmodal}>
                        <div className={styles.modalLeft}>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="month" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票/收據日期*</CFormLabel>
                                <CCol><CFormInput
                                    className={styles.addinput}
                                    type="date"
                                    id="date"
                                    value={FormValues.Doc_date}
                                    onChange={handleInputChange}
                                    required />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="num" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票號碼/收據編號*</CFormLabel>
                                <CCol>
                                    <CFormInput
                                        className={styles.addinput}
                                        type="text"
                                        id="num"
                                        value={FormValues.Doc_number}
                                        onChange={handleInputChange}
                                        required />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="datestart" className={`col-sm-2 col-form-label ${styles.addlabel}`} >用電期間(起)*</CFormLabel>
                                <CCol>
                                    <CFormInput
                                        className={styles.addinput}
                                        type="date"
                                        id="datestart"
                                        value={FormValues.period_start}
                                        onChange={handleInputChange}
                                        required />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="dateend" className={`col-sm-2 col-form-label ${styles.addlabel}`} >用電期間(迄)*</CFormLabel>
                                <CCol>
                                    <CFormInput
                                        className={styles.addinput}
                                        type="date"
                                        id="dateend"
                                        value={FormValues.period_end}
                                        onChange={handleInputChange}
                                        required />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="type" className={`col-sm-2 col-form-label ${styles.addlabel}`} >填寫類型*<span className={styles.Note}> 選擇填寫請以*用電度數*作為優先填寫項目</span></CFormLabel>
                                <CCol>
                                    <CFormSelect
                                        aria-label="Default select example"
                                        id="type"
                                        className={styles.addinput}
                                        value={FormValues.usage}
                                        onChange={handleInputChange}
                                    >
                                        <option value="1">用電度數</option>
                                        <option value="2">用電金額</option>
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="monthusage" className={`col-sm-2 col-form-label ${styles.addlabel}`} >當月總用電量或總金額</CFormLabel>
                                <CCol>
                                    <CFormInput
                                        className={styles.addinput}
                                        type="number"
                                        min='0'
                                        id="monthusage"
                                        value={FormValues.amount}
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
                                        id="explain" rows={3}
                                        value={FormValues.remark}
                                        onChange={handleInputChange}
                                    />

                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel
                                    htmlFor="photo"
                                    className={`col-sm-2 col-form-label ${styles.addlabel}`}
                                >
                                    圖片*
                                </CFormLabel>
                                <CCol>
                                    <CFormInput type="file" id="C1image" onChange={(e) => (handleImageChange(e), handleC1image(e))} required />
                                </CCol>
                            </CRow>
                            <br />
                            <div style={{ textAlign: 'center' }}>*為必填欄位</div>
                        </div>
                        <div className={styles.modalRight}>
                            <CFormLabel className={`col-sm-2 col-form-label ${styles.addlabel}`} >
                                圖片預覽
                            </CFormLabel>
                            <div className={styles.imgBlock}>
                                {previewImage && ( // 如果有圖片 URL，則顯示預覽
                                    <Zoom><img src={previewImage} alt="Uploaded Preview" /></Zoom>
                                )}
                            </div>

                            <CFormLabel className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                偵測錯誤提醒
                            </CFormLabel>
                            <div className={styles.errorMSG}>
                                {/* 偵測日期:{C1date}  <span>{dateincorrectmessage}</span><br />
                                偵測號碼:{C1num}  <span>{numincorrectmessage}</span> */}
                            </div>

                        </div>
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