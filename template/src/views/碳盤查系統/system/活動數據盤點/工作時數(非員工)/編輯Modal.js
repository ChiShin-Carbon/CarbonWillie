import React, { useState, useEffect } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CForm
} from '@coreui/react';
import styles from '../../../../../scss/活動數據盤點.module.css';

import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const EditModal = ({ isEditModalVisible, setEditModalVisible, selectedNonemployeeId }) => {
    const handleClose = () => setEditModalVisible(false);

    const [previewImage, setPreviewImage] = useState(null);
    const [formValues, setFormValues] = useState({
        period_date: '',
        nonemployee_number: '',
        total_hours: '',
        total_days: '',
        remark: '',
        img_path: '',
    });

    // Fetch data when selectedNonemployeeId changes
    useEffect(() => {
        const fetchNonemployeeData = async () => {
            if (!selectedNonemployeeId) return;

            try {
                const response = await fetch('http://localhost:8000/NonEmployee_findone', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ Nonemployee_id: selectedNonemployeeId }),
                });

                if (response.ok) {
                    const data = await response.json();
                    const nonemployee = data.Nonemployees[0]; // Ensure correct structure
                    const date = nonemployee?.period_date;
                    const month = date.slice(0, 7);

                    setFormValues({
                        period_date: month || '',
                        nonemployee_number: nonemployee?.nonemployee_number || '',
                        total_hours: nonemployee?.total_hours || '',
                        total_days: nonemployee?.total_days || '',
                        remark: nonemployee?.remark || '',
                        img_path: nonemployee?.img_path || '',
                    });
                    setPreviewImage(nonemployee?.img_path || null);
                } else {
                    console.error('Error fetching NonEmployee data:', await response.text());
                }
            } catch (error) {
                console.error('Error fetching NonEmployee data:', error);
            }
        };

        fetchNonemployeeData();
    }, [selectedNonemployeeId]);


    // Handle input changes
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormValues((prevValues) => ({ ...prevValues, [id]: value }));
    };

    // Handle image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setPreviewImage(previewUrl);
            setFormValues((prevValues) => ({ ...prevValues, img_path: file }));
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(formValues).forEach((key) => {
                formData.append(key, formValues[key]);
            });

            const response = await fetch('http://localhost:8000/Nonemployee_update', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert('Data updated successfully!');
                handleClose();
            } else {
                const errorData = await response.json();
                console.error(`Error ${response.status}: ${errorData.detail}`);
            }
        } catch (error) {
            console.error('Error updating Nonemployee data:', error);
        }
    };

    
    const handleEditSubmit = async (e) => {
        e.preventDefault();

        const form = new FormData();

        
        form.append("nonemployee_id", selectedNonemployeeId);
        form.append("user_id", window.sessionStorage.getItem('user_id'));
        form.append("month", formValues.period_date);
        form.append("nonemployee", formValues.nonemployee_number);
        form.append("total_hours", formValues.total_hours);
        form.append("total_day", formValues.total_days);
        form.append("explain", formValues.remark);
        if (formValues.img_path) {
            form.append("image", formValues.img_path);
        }
    
        for (let [key, value] of form.entries()) {
            console.log(`${key}:`, value); // Debugging output
        }

        try {
            const response = await fetch('http://localhost:8000/edit_nonemployee', {
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



    return (
        <CModal backdrop="static" visible={isEditModalVisible} onClose={handleClose} className={styles.modal} size='xl'>
            <CModalHeader>
                <h5><b>編輯數據-工作時數(非員工)</b></h5>
            </CModalHeader>
            <CForm onSubmit={handleEditSubmit}>
                <CModalBody>
                    <div className={styles.addmodal}>
                        <div className={styles.modalLeft}>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="period_date" className={`col-sm-2 col-form-label ${styles.addlabel}`}>月份*</CFormLabel>
                                <CCol>
                                    <CFormInput
                                        className={styles.addinput}
                                        type="month"
                                        id="period_date"
                                        value={formValues.period_date}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="nonemployee_number" className={`col-sm-2 col-form-label ${styles.addlabel}`}>人數*</CFormLabel>
                                <CCol>
                                    <CFormInput
                                        className={styles.addinput}
                                        type="number"
                                        id="nonemployee_number"
                                        value={formValues.nonemployee_number}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="total_hours" className={`col-sm-2 col-form-label ${styles.addlabel}`}>總工作時數*</CFormLabel>
                                <CCol>
                                    <CFormInput
                                        className={styles.addinput}
                                        type="number"
                                        id="total_hours"
                                        value={formValues.total_hours}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="total_days" className={`col-sm-2 col-form-label ${styles.addlabel}`}>總工作人天*</CFormLabel>
                                <CCol>
                                    <CFormInput
                                        className={styles.addinput}
                                        type="number"
                                        id="total_days"
                                        value={formValues.total_days}
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
                                        rows={3}
                                        value={formValues.remark}
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
