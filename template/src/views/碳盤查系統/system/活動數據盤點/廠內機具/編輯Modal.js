import React, { useState, useEffect } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CFormSelect, CForm
} from '@coreui/react';
import styles from '../../../../../scss/活動數據盤點.module.css';

import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';


const EditModal = ({ isEditModalVisible, setEditModalVisible, selectedMachinery }) => {
    const [FormValues, setFormValues] = useState({
        Doc_date: '',
        Doc_number: '',
        machinery_location: '',
        energy_type: '',
        usage: '',
        remark: '',
        img_path: '',
    });
    const handleClose = () => setEditModalVisible(false);

    const [previewImage, setPreviewImage] = useState(null); // 用來存儲圖片的 
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file); // 創建圖片預覽 URL
            setPreviewImage(previewUrl); // 保存 URL 到狀態
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormValues((prevValues) => ({ ...prevValues, [id]: value }));
    };


    const handleEditSubmit = async (e) => {
        e.preventDefault();

        const form = new FormData();
        form.append("machine_id", selectedMachinery);
        form.append("user_id", window.sessionStorage.getItem('user_id'));
        form.append("date", FormValues.Doc_date);
        form.append("number", FormValues.Doc_number);
        form.append("location", FormValues.machinery_location);
        form.append("type", FormValues.energy_type);
        form.append("usage", FormValues.usage);
        form.append("remark", FormValues.remark);
        form.append("image", e.target.C1image.files[0]);

        for (let [key, value] of form.entries()) {
            console.log(`${key}:`, value); // Debugging output
        }

        try {
            const response = await fetch('http://localhost:8000/edit_machine', {
                method: 'POST',
                body: form, // Send FormData directly
            });

            const data = await response.json();
            if (response.ok && data.status === "success") {
                alert("Employee record updated successfully!");
                handleClose();
            } else {
                alert(data.message || "Failed to update employee record.");
            }
        } catch (error) {
            console.error("Error updating employee record:", error);
            alert("An error occurred while updating the employee record.");
        }
    };


    useEffect(() => {
        const fetchMachineryData = async () => {
            if (!selectedMachinery) return;

            try {
                const response = await fetch('http://localhost:8000/Machinery_findone', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ Machinery_id: selectedMachinery }),
                });

                if (response.ok) {
                    const data = await response.json();
                    const machineryData = data.Machinery[0];
                    setFormValues({
                        Doc_date: machineryData?.Doc_date || '',
                        Doc_number: machineryData?.Doc_number || '',
                        machinery_location: machineryData?.machinery_location || '',
                        energy_type: machineryData?.energy_type || '',
                        usage: machineryData?.usage || '',
                        remark: machineryData?.remark || '',
                        img_path: machineryData?.img_path || '',
                    });
                    setPreviewImage(machineryData?.img_path || null);
                } else {
                    console.error('Error fetching machinery data:', await response.text());
                }
            } catch (error) {
                console.error('Error fetching machinery data:', error);
            }
        };

        fetchMachineryData();
    }, [selectedMachinery]);

    return (
        <CModal backdrop="static" visible={isEditModalVisible} onClose={handleClose} className={styles.modal} size='xl'>
            <CModalHeader>
                <h5><b>編輯數據-廠內機具</b></h5>
            </CModalHeader>
            <CForm onSubmit={handleEditSubmit}>
                <CModalBody>
                    <div className={styles.addmodal}>
                        <div className={styles.modalLeft}>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="Doc_date" className={`col-sm-2 col-form-label ${styles.addlabel}`}>發票/收據日期*</CFormLabel>
                                <CCol>
                                    <CFormInput
                                        className={styles.addinput}
                                        type="date"
                                        id="Doc_date"
                                        value={FormValues.Doc_date}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="Doc_number" className={`col-sm-2 col-form-label ${styles.addlabel}`}>發票號碼/收據編號*</CFormLabel>
                                <CCol>
                                    <CFormInput
                                        className={styles.addinput}
                                        type="text"
                                        id="Doc_number"
                                        value={FormValues.Doc_number}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="machinery_location" className={`col-sm-2 col-form-label ${styles.addlabel}`}>設備位置*</CFormLabel>
                                <CCol>
                                    <CFormInput
                                        className={styles.addinput}
                                        type="text"
                                        id="machinery_location"
                                        value={FormValues.machinery_location}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="energy_type" className={`col-sm-2 col-form-label ${styles.addlabel}`}>能源類型*</CFormLabel>
                                <CCol>
                                    <CFormSelect
                                        id="energy_type"
                                        className={styles.addinput}
                                        value={FormValues.energy_type}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">請選擇</option>
                                        <option value="0">柴油</option>
                                        <option value="1">汽油</option>
                                        <option value="2">其他</option>
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="usage" className={`col-sm-2 col-form-label ${styles.addlabel}`}>使用量(公克)*</CFormLabel>
                                <CCol>
                                    <CFormInput
                                        className={styles.addinput}
                                        type="number"
                                        min="0"
                                        id="usage"
                                        value={FormValues.usage}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="remark" className={`col-sm-2 col-form-label ${styles.addlabel}`}>備註</CFormLabel>
                                <CCol>
                                    <CFormTextarea
                                        className={styles.addinput}
                                        id="remark"
                                        value={FormValues.remark}
                                        onChange={handleInputChange}
                                        rows={3}
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