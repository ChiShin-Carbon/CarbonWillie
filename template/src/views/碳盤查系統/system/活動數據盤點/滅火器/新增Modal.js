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

export const FireExtinguisherAdd = ({
    isAddModalVisible,
    setAddModalVisible,
    refreshFireExtinguisherData,
    setCurrentFunction,
    setCurrentTitle // Added missing prop
}) => {
    const [formData, setFormData] = useState({
        name: '',
        element: '1', // Default to first option
        weight: '',
        explain: '',
        image: null,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);


    const handleClose = () => setAddModalVisible(false);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Prevent double submissions
        if (isSubmitting) return;
        setIsSubmitting(true);
    
        try {
            // Prepare form data using state values instead of accessing DOM
            const formDataToSend = new FormData();
            formDataToSend.append("user_id", window.sessionStorage.getItem("user_id"));
            formDataToSend.append("name", formData.name);
            formDataToSend.append("element", formData.element);
            formDataToSend.append("weight", formData.weight);
            formDataToSend.append("explain", formData.explain);
            
            // Check if image exists
            if (!formData.image) {
                console.error("Image file not found");
                alert("Please select an image file");
                setIsSubmitting(false);
                return;
            }
            
            formDataToSend.append("image", formData.image);
    
            // Send form data to the backend
            const res = await fetch("http://localhost:8000/insert_Extinguisher", {
                method: "POST",
                body: formDataToSend,
            });
    
            if (res.ok) {
                // Close modal first
                setAddModalVisible(false);
                
                // Clear the form data
                setFormData({
                    name: '',
                    element: '1',
                    weight: '',
                    explain: '',
                    image: null,
                });
                setPreviewImage(null);
                
                // Wait a moment before refreshing data
                setTimeout(async () => {
                    try {
                        await refreshFireExtinguisherData();
                        setCurrentFunction("FireExtinguisher");
                        if (setCurrentTitle) {
                            setCurrentTitle("滅火器");
                        }
                        alert("Form submitted successfully");
                    } catch (refreshError) {
                        console.error("Error refreshing data:", refreshError);
                        alert("Data submitted but there was an error refreshing the display");
                    }
                }, 500); // Increased timeout to give backend more time to process
                
            } else {
                console.error("Failed to submit form data");
                alert("Failed to submit form data");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An error occurred while submitting the form");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isAddModalVisible) return null;
    

    return (
        <CModal
            backdrop="static"
            visible={isAddModalVisible}
            onClose={() => setAddModalVisible(false)}
            aria-labelledby="ActivityModalLabel"
            size="xl"
        >
            <CModalHeader>
                <CModalTitle id="ActivityModalLabel"><b>新增數據</b></CModalTitle>
            </CModalHeader>
            <CForm onSubmit={handleSubmit}>
                <CModalBody>
                    <div className={styles.addmodal}>
                        <div className={styles.modalLeft}>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="name" className={`col-sm-2 col-form-label ${styles.addlabel}`}>品名*</CFormLabel>
                                <CCol>
                                    <CFormInput 
                                        className={styles.addinput} 
                                        type="text" 
                                        id="name" 
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required 
                                    />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="element" className={`col-sm-2 col-form-label ${styles.addlabel}`}>成分*</CFormLabel>
                                <CCol>
                                    <CFormSelect 
                                        aria-label="Default select example" 
                                        id="element" 
                                        className={styles.addinput}
                                        value={formData.element}
                                        onChange={handleInputChange}
                                    >
                                        <option value="1">CO2</option>
                                        <option value="2">HFC-236ea</option>
                                        <option value="3">HFC-236fa</option>
                                        <option value="4">HFC-227ea</option>
                                        <option value="5">CF3CHFCF3</option>
                                        <option value="6">CHF3</option>
                                        <option value="7">其他</option>
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="weight" className={`col-sm-2 col-form-label ${styles.addlabel}`}>規格(重量)*</CFormLabel>
                                <CCol>
                                    <CFormInput 
                                        className={styles.addinput} 
                                        type="number" 
                                        min='0' 
                                        id="weight" 
                                        value={formData.weight}
                                        onChange={handleInputChange}
                                        required 
                                    />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="explain" className={`col-sm-2 col-form-label ${styles.addlabel}`}>備註</CFormLabel>
                                <CCol>
                                    <CFormTextarea 
                                        className={styles.addinput} 
                                        id="explain" 
                                        rows={3}
                                        value={formData.explain}
                                        onChange={handleInputChange}
                                    />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel
                                    htmlFor="image"
                                    className={`col-sm-2 col-form-label ${styles.addlabel}`}
                                >
                                    圖片*
                                </CFormLabel>
                                <CCol>
                                    <CFormInput 
                                        type="file" 
                                        id="image" 
                                        onChange={handleImageChange} 
                                        required 
                                    />
                                </CCol>
                            </CRow>

                            <br />
                            <div style={{ textAlign: 'center' }}>*為必填欄位</div>
                        </div>
                        <div className={styles.modalRight}>
                            <CFormLabel className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                圖片預覽
                            </CFormLabel>
                            <div className={styles.imgBlock}>
                                {previewImage && (
                                    <Zoom><img src={previewImage} alt="Uploaded Preview" /></Zoom>
                                )}
                            </div>

                            <CFormLabel className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                偵測錯誤提醒
                            </CFormLabel>
                            <div className={styles.errorMSG}>
                                {/* Error messages can be displayed here */}
                            </div>
                        </div>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton className="modalbutton1" onClick={handleClose}>
                        取消
                    </CButton>
                    <CButton type="submit" className="modalbutton2">新增</CButton>
                </CModalFooter>
            </CForm>
        </CModal>
    );
};

export default FireExtinguisherAdd;