import React, { useState } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CCard, CFormSelect, CTab, CTabList, CTabs,
    CTable, CTableBody, CTableHead, CFormCheck, CCollapse
    , CForm, CCardBody,
} from '@coreui/react';

import styles from '../../../../../scss/活動數據盤點.module.css'

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

import { useRefreshData } from '../refreshdata';

export const EmployeeAdd = ({
    isAddModalVisible,
    setAddModalVisible,
    refreshEmployeeData,
    setCurrentFunction,
    setCurrentTitle // Added missing prop
}) => {

    const [formData, setFormData] = useState({
        name: '',
        employee: '',
        daily_hours: '',
        workday: '',
        overtime: '',
        sick:'',
        personal:'',
        business:'',
        funeral:'',
        special:'',
        explain:'',
        image: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleClose = () => setAddModalVisible(false);

    const handleC3Submit = async (e) => {
        e.preventDefault();
    
        // Prevent double submissions
        if (isSubmitting) return;
        setIsSubmitting(true);
    
        try {
            // Prepare form data using state values instead of directly accessing DOM
            const formDataToSend = new FormData();
            formDataToSend.append("user_id", window.sessionStorage.getItem("user_id"));
            formDataToSend.append("month", formData.month);
            formDataToSend.append("employee", formData.employee);
            formDataToSend.append("daily_hours", formData.daily_hours);
            formDataToSend.append("workday", formData.workday);
            formDataToSend.append("overtime", formData.overtime);
            formDataToSend.append("sick", formData.sick);
            formDataToSend.append("personal", formData.personal);
            formDataToSend.append("business", formData.business);
            formDataToSend.append("funeral", formData.funeral);
            formDataToSend.append("special", formData.special);
            formDataToSend.append("explain", formData.explain);
    
            // Ensure image is selected
            if (!formData.image) {
                console.error("Image file not found");
                alert("Please select an image file");
                setIsSubmitting(false);
                return;
            }
    
            formDataToSend.append("image", formData.image);
    
            // Send form data to the backend
            const res = await fetch("http://localhost:8000/insert_employee", {
                method: "POST",
                body: formDataToSend,
            });
    
            if (res.ok) {
                // Close modal first
                setAddModalVisible(false);
    
                // Clear form data
                setFormData({
                    month: '',
                    employee: '',
                    daily_hours: '',
                    workday: '',
                    overtime: '',
                    sick: '',
                    personal: '',
                    business: '',
                    funeral: '',
                    special: '',
                    explain: '',
                    image: null,
                });
                setPreviewImage(null);
    
                // Wait a moment before refreshing data
                setTimeout(async () => {
                    try {
                        await refreshEmployeeData();
                        // Change function after data is refreshed
                        setCurrentFunction("Employee");
                        if (setCurrentTitle) {
                            setCurrentTitle("員工工時");
                        }
                        alert("Form submitted successfully");
                    } catch (refreshError) {
                        console.error("Error refreshing data:", refreshError);
                        alert("Data submitted but there was an error refreshing the display");
                    }
                }, 500); // Short delay to allow backend to process
    
            } else {
                console.error("Failed to submit employee data");
                console.log(formData)
                alert("Failed to submit employee data");
            }
        } catch (error) {
            console.error("Error submitting employee data:", error);
            alert("An error occurred while submitting the form");
        } finally {
            setIsSubmitting(false);
        }
    };
    const [previewImage, setPreviewImage] = useState(null); // 用來存儲圖片的 
    // Handle image changes
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file
            }));
            const previewUrl = URL.createObjectURL(file);
            setPreviewImage(previewUrl);
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };


    return (
        <CModal
            backdrop="static"
            visible={isAddModalVisible}
            onClose={() => setAddModalVisible(false)}
            aria-labelledby="ActivityModalLabel"
            size='xl'
        >
            <CModalHeader>
                <CModalTitle id="ActivityModalLabel"><b>新增數據</b></CModalTitle>
            </CModalHeader>
            <CForm>
                <CModalBody>
                    <div className={styles.addmodal}>
                        <div className={styles.modalLeft}>
                            <form onSubmit={handleC3Submit}>
                                <CRow className="mb-3">
                                    <CFormLabel htmlFor="month" className={`col-sm-2 col-form-label ${styles.addlabel}`} >月份*</CFormLabel>
                                    <CCol><CFormInput 
                                    className={styles.addinput} 
                                    type="month" 
                                    id="month" 
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
                                        id="employee"
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
                                        id="daily_hours" 
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
                                        id="overtime" 
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
                                        id="sick" 
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
                                        id="personal" 
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
                                        id="business" 
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
                                        id="funeral" 
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
                                        id="special" 
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
                                        <CFormInput type="file" id="image" onChange={(e) => (handleImageChange(e), handleC1image(e))} required />
                                    </CCol>
                                </CRow>
                                <br />
                                <div style={{ textAlign: 'center' }}>*為必填欄位</div>
                            </form>
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
                    <CButton className="modalbutton1" onClick={handleClose}>
                        取消
                    </CButton>
                    <CButton type="submit" className="modalbutton2" onClick={handleC3Submit}>新增</CButton>

                </CModalFooter>
            </CForm>
        </CModal >
    );
};

export default EmployeeAdd;
