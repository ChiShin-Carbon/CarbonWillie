import React, { useState, useEffect } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CFormSelect, CForm
    , CModalTitle
} from '@coreui/react';
import styles from '../../../../../scss/活動數據盤點.module.css';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const EditModal = ({ isEditModalVisible, setEditModalVisible, selectedVehicleId }) => {
    const [vehicles, setVehicles] = useState([]); // State to hold fetched vehicle data
    const [previewImage, setPreviewImage] = useState(null); // State for image preview
    const [formValues, setFormValues] = useState({
        date: '',
        num: '',
        type: '',
        quantity: '',
        explain: '',
        image: null,
    });

    // Handle closing the modal
    const handleClose = () => {
        setEditModalVisible(false);
        setPreviewImage(null);
        setFormValues({
            date: '',
            num: '',
            type: '',
            quantity: '',
            explain: '',
            image: null,
        });
    };

    // Handle image change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setPreviewImage(previewUrl);
            setFormValues((prev) => ({ ...prev, image: file }));
        }
    };


    // Fetch vehicle data when selectedVehicleId changes
    useEffect(() => {
        const fetchVehicleData = async () => {
            if (!selectedVehicleId) return;
            try {
                const response = await fetch('http://localhost:8000/vehicle_findone', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ vehicle_id: selectedVehicleId }),
                });
                const data = await response.json();
                if (response.ok) {
                    setVehicles(data); // Assuming the response contains vehicle details
                    // Populate form with fetched data
                    const vehicle = data[0];
                    setFormValues({
                        date: vehicle?.Doc_date || '',
                        num: vehicle?.Doc_number || '',
                        type: vehicle?.oil_species ? '1' : '2', // Map to options
                        quantity: vehicle?.liters || '',
                        explain: vehicle?.remark || '',
                        image: vehicle?.img_path || null,
                    });
                    setPreviewImage(`fastapi/${vehicle?.img_path}` || null);
                } else {
                    console.error(`Error ${response.status}: ${data.detail}`);
                }
            } catch (error) {
                console.error('Error fetching vehicle data:', error);
            }
        };

        fetchVehicleData();
    }, [selectedVehicleId]);

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        if (!formValues.date || !formValues.num || !formValues.type || !formValues.quantity) {
            alert("Please fill in all required fields.");
            return;
        }

        const form = new FormData();
        form.append("vehicle_id", selectedVehicleId);
        form.append("user_id", window.sessionStorage.getItem('user_id'));
        form.append("date", formValues.date);
        form.append("number", formValues.num);
        form.append("oil_species", formValues.type);
        form.append("liters", formValues.quantity);
        form.append("remark", formValues.explain);
        if (formValues.image) {
            form.append("image", formValues.image);
        }

        for (let [key, value] of form.entries()) {
            console.log(`${key}:`, value); // Debugging output
        }

        try {
            const response = await fetch('http://localhost:8000/edit_vehicle', {
                method: 'POST',
                body: form, // Send FormData directly
            });

            const data = await response.json();
            if (response.ok && data.status === "success") {
                alert("Vehicle record updated successfully!");
                handleClose();
            } else {
                alert(data.message || "Failed to update vehicle record.");
            }
        } catch (error) {
            console.error("Error updating vehicle record:", error);
            alert("An error occurred while updating the vehicle record.");
        }
    };



    // Handle form input changes
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormValues((prev) => ({ ...prev, [id]: value }));
    };

    return (
        <CModal
            backdrop="static"
            visible={isEditModalVisible}
            onClose={handleClose}
            aria-labelledby="ActivityModalLabel"
            size="xl"
            className={styles.modal}
        >
            <CModalHeader>
                <CModalTitle id="ActivityModalLabel">
                    <h5><b>編輯數據-公務車</b></h5>
                </CModalTitle>
            </CModalHeader>
            <CForm onSubmit={handleEditSubmit}>
                <CModalBody>
                    <div className={styles.addmodal}>
                        <div className={styles.modalLeft}>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="date" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    發票/收據日期*
                                </CFormLabel>
                                <CCol>
                                    <CFormInput
                                        className={styles.addinput}
                                        type="date"
                                        id="date"
                                        value={formValues.date}
                                        onChange={handleChange}
                                        required
                                    />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="num" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    發票號碼/收據編號*
                                </CFormLabel>
                                <CCol>
                                    <CFormInput
                                        className={styles.addinput}
                                        type="text"
                                        id="num"
                                        value={formValues.num}
                                        onChange={handleChange}
                                        required
                                    />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="type" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    油種*
                                </CFormLabel>
                                <CCol>
                                    <CFormSelect
                                        id="type"
                                        className={styles.addinput}
                                        value={formValues.type}
                                        onChange={handleChange}
                                    >
                                        <option value="1">汽油</option>
                                        <option value="2">柴油</option>
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="quantity" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    公升數
                                </CFormLabel>
                                <CCol>
                                    <CFormInput
                                        className={styles.addinput}
                                        type="number"
                                        id="quantity"
                                        min="0"
                                        value={formValues.quantity}
                                        onChange={handleChange}
                                        required
                                    />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="explain" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    備註
                                </CFormLabel>
                                <CCol>
                                    <CFormTextarea
                                        className={styles.addinput}
                                        id="explain"
                                        rows={3}
                                        value={formValues.explain}
                                        onChange={handleChange}
                                    />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="image" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    圖片*
                                </CFormLabel>
                                <CCol>
                                    <CFormInput type="file" id="image" onChange={handleImageChange} required />
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
                                {previewImage && (
                                    <Zoom>
                                        <img src={previewImage} alt="Uploaded Preview" />
                                    </Zoom>
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
                    <CButton className="modalbutton2" type="submit">
                        儲存
                    </CButton>
                </CModalFooter>
            </CForm>
        </CModal>
    );
};

export default EditModal;
