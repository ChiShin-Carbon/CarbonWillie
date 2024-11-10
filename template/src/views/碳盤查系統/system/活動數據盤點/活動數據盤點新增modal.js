import React, { useState } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CCard, CFormSelect, CTab, CTabList, CTabs,
    CTable, CTableBody, CTableHead, CFormCheck, CCollapse
    , CForm, CCardBody,
} from '@coreui/react';

import styles from '../../../../scss/活動數據盤點.module.css'


const FunctionForms = ({ currentFunction }) => {
    const [recognizedText, setRecognizedText] = useState("");

    const handleC1Submit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append("user_id", 1);
        formData.append("date", document.getElementById("date").value);
        formData.append("number", document.getElementById("num").value);
        formData.append("oil_species", document.getElementById("type").value);
        formData.append("liters", document.getElementById("quantity").value);
        formData.append("remark", document.getElementById("explain").value);
        formData.append("image", document.getElementById("C1image").files[0]);
    
        try {
            const res = await fetch("http://localhost:8000/insert_vehicle", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                console.log("Form submitted successfully", data);
                setAddModalVisible(false);
            } else {
                console.error("Failed to submit form data", data.detail);
            }
        } catch (error) {
            console.error("Error submitting form data", error);
        }
    };

    const handleC2Submit = async (e) => {
        e.preventDefault();
    
        // Get form elements by their IDs
        const name = document.getElementById("name").value;
        const element = document.getElementById("element").value;
        const weight = document.getElementById("weight").value;
        const explain = document.getElementById("explain").value;
        const image = document.getElementById("C2image");
    
        // Check if the image file exists
        if (!image || !image.files || image.files.length === 0) {
            console.error("Image file not found");
            return;
        }
    
        // Prepare form data
        const formData = new FormData();
        formData.append("user_id", 1); // Example user_id, you should use the actual user ID
        formData.append("name", name);
        formData.append("element", element);
        formData.append("weight", weight);
        formData.append("explain", explain);
        formData.append("image", image.files[0]);
    
        try {
            // Send form data to the backend
            const res = await fetch("http://localhost:8000/insert_Extinguisher", {
                method: "POST",
                body: formData,
            });
    
            if (res.ok) {
                const data = await res.json();
                console.log("Form submitted successfully:", data);
            } else {
                console.error("Failed to submit form data");
            }
        } catch (error) {
            console.error("Error submitting form data", error);
        }
    };

    const handleC1image = async (e) => {
        e.preventDefault();

        const imageElement = document.getElementById("C1image");

        if (!imageElement || !imageElement.files) {
            console.error("Form elements or image files not found");
            return;
        }

        const formData = new FormData();
        formData.append("image", imageElement.files[0]);

        try {
            const res = await fetch("http://localhost:8000/ocrapi", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                setRecognizedText(data.recognized_text); // Set the recognized text in state
                console.log("Data submitted successfully");
            } else {
                console.error("Failed to submit data");
            }
        } catch (error) {
            console.error("Error submitting data", error);
        }
    };

    const handleC3Submit = async (e) => {
        e.preventDefault();
    
        // Gather form values
        const month = document.getElementById("C3month").value;
        const employee = document.getElementById("C3employee").value;
        const daily_hours = document.getElementById("C3daily_hours").value;
        const workday = document.getElementById("C3workday").value;
        const overtime = document.getElementById("C3overtime").value;
        const sick = document.getElementById("C3sick").value;
        const personal = document.getElementById("C3personal").value;
        const business = document.getElementById("C3business").value;
        const funeral = document.getElementById("C3funeral").value;
        const special = document.getElementById("C3special").value;
        const explain = document.getElementById("C3explain").value;
        const image = document.getElementById("C3image").files[0];
    
        // Prepare FormData for submission
        const formData = new FormData();
        formData.append("user_id", 1); // Set user_id as required
        formData.append("month", month);
        formData.append("employee", employee);
        formData.append("daily_hours", daily_hours);
        formData.append("workday", workday);
        formData.append("overtime", overtime);
        formData.append("sick", sick);
        formData.append("personal", personal);
        formData.append("business", business);
        formData.append("funeral", funeral);
        formData.append("special", special);
        formData.append("explain", explain);
        formData.append("image", image);
    
        try {
            // Send form data to the backend
            const response = await fetch("http://localhost:8000/insert_employee", {
                method: "POST",
                body: formData,
            });
    
            if (response.ok) {
                const result = await response.json();
                console.log("Employee data submitted successfully:", result);
            } else {
                console.error("Failed to submit employee data");
            }
        } catch (error) {
            console.error("Error submitting employee data:", error);
        }
    };

    const handleC5Submit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("user_id", 1);
        formData.append("date", document.getElementById("C5date").value);
        formData.append("number", document.getElementById("C5num").value);
        formData.append("device_type", document.getElementById("C5type").value);
        formData.append("device_location", document.getElementById("C5site").value);
        formData.append("refrigerant_type", document.getElementById("C5type2").value);
        formData.append("filling", document.getElementById("C5quantity").value);
        formData.append("quantity", document.getElementById("C5num").value);
        formData.append("leakage_rate", document.getElementById("C5percent").value);
        formData.append("remark", document.getElementById("C5explain").value);
        formData.append("image", document.getElementById("C5image").files[0]);

        try {
            const res = await fetch("http://localhost:8000/insert_refrigerant", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                console.log("Form submitted successfully", data);
                setAddModalVisible(false);
            } else {
                console.error("Failed to submit form data", data.detail);
            }
        } catch (error) {

            console.error("Error submitting form data", error);
        }
    };

    const handleC6Submit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("user_id", 1);
        formData.append("date", document.getElementById("C6date").value);
        formData.append("number", document.getElementById("C6num").value);
        formData.append("device_location", document.getElementById("C6site").value);
        formData.append("device_type", document.getElementById("C6type").value);
        formData.append("filling", document.getElementById("C6quantity").value);
        formData.append("remark", document.getElementById("C6explain").value);
        formData.append("image", document.getElementById("C6image").files[0]);

        try {
            const res = await fetch("http://localhost:8000/insert_refrigerant", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                console.log("Form submitted successfully", data);
                setAddModalVisible(false);
            } else {
                console.error("Failed to submit form data", data.detail);
            }
        } catch (error) {

            console.error("Error submitting form data", error);
        }
    };

    const handleC7Submit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("user_id", 1);
        formData.append("date", document.getElementById("C7date").value);
        formData.append("number", document.getElementById("C7num").value);
        formData.append("usage", document.getElementById("C7quantity").value);
        formData.append("remark", document.getElementById("C7explain").value);
        formData.append("image", document.getElementById("C7image").files[0]);

        try {
            const res = await fetch("http://localhost:8000/insert_emergency", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {

                console.log("Form submitted successfully", data);
                setAddModalVisible(false);
            } else {
                console.error("Failed to submit form data", data.detail);
            }
        } catch (error) {

            console.error("Error submitting form data", error);
        }
    };

    const handleC8Submit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("user_id", 1);
        formData.append("date", document.getElementById("C8date").value);
        formData.append("number", document.getElementById("C8num").value);
        formData.append("start", document.getElementById("C8datestart").value);
        formData.append("end", document.getElementById("C8dateend").value);
        formData.append("usage", document.getElementById("C8type").value);
        formData.append("amount", document.getElementById("C8monthusage").value);
        formData.append("remark", document.getElementById("C8explain").value);
        
        // Check if image file is provided
        const imageFile = document.getElementById("C8image").files[0];
        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            const res = await fetch("http://localhost:8000/insert_electricity", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (res.ok) {
                console.log("Form submitted successfully", data);
                setAddModalVisible(false); // Close modal on success
            } else {
                console.error("Failed to submit form data", data.detail);
            }
        } catch (error) {
            console.error("Error submitting form data", error);
        }
    };

    const handleC9Submit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("user_id", 1);
        formData.append("transportation", document.getElementById("C9type").value);
        formData.append("oil_species", document.getElementById("C9oil_type").value);
        formData.append("kilometers", document.getElementById("C9km").value);
        formData.append("remark", document.getElementById("C9explain").value);
        formData.append("image", document.getElementById("C9image").files[0]);

        try {
            const res = await fetch("http://localhost:8000/insert_commute", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                console.log("Form submitted successfully", data);
                setAddModalVisible(false);
            } else {
                console.error("Failed to submit form data", data.detail);
            }
        } catch (error) {
            console.error("Error submitting form data", error);
        }
    };
    
    const handleC10Submit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("user_id", 1);
        formData.append("transportation", document.getElementById("C10type").value);
        formData.append("oil_species", document.getElementById("C10oil_type").value);
        formData.append("kilometers", document.getElementById("C10km").value);
        formData.append("remark", document.getElementById("C10explain").value);
        formData.append("image", document.getElementById("C10image").files[0]);

        try {
            const res = await fetch("http://localhost:8000/insert_BusinessTrip", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                console.log("Form submitted successfully", data);
                setAddModalVisible(false);
            } else {
                console.error("Failed to submit form data", data.detail);
            }
        } catch (error) {
            console.error("Error submitting form data", error);
        }
    };
    

    const handleC11Submit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("user_id", 1);
        formData.append("waste_item", document.getElementById("C11item").value);
        formData.append("remark", document.getElementById("C11explain").value);
        formData.append("image", document.getElementById("C11image").files[0]);

        try {
            const res = await fetch("http://localhost:8000/insert_waste", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                console.log("Form submitted successfully", data);
                setAddModalVisible(false);
            } else {
                console.error("Failed to submit form data", data.detail);
            }
        } catch (error) {
            console.error("Error submitting form data", error);
        }
    };

    const handleC12Submit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("user_id", 1);
        formData.append("waste_item", document.getElementById("C12item").value);
        formData.append("remark", document.getElementById("C12explain").value);
        formData.append("image", document.getElementById("C12image").files[0]);

        try {
            const res = await fetch("http://localhost:8000/insert_Selling_waste", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                console.log("Form submitted successfully", data);
                setAddModalVisible(false);
            } else {
                console.error("Failed to submit form data", data.detail);
            }
        } catch (error) {
            console.error("Error submitting form data", error);
        }
    };

    const [transportType, setTransportType] = useState("1"); // 默認選擇汽車
    switch (currentFunction) {

        case 'one':
            return (
                <div className={styles.addmodal}>

                <form>

                    <CRow className="mb-3">
                        <CFormLabel htmlFor="month" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票/收據日期*</CFormLabel>
                        <CCol><CFormInput className={styles.addinput} type="date" id="date" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="num" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票號碼/收據編號*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="text" id="num" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="type" className={`col-sm-2 col-form-label ${styles.addlabel}`} >油種*</CFormLabel>
                        <CCol>
                            <CFormSelect aria-label="Default select example" id="type" className={styles.addinput}>
                                <option value="1">汽油</option>
                                <option value="2">柴油</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="unit" className={`col-sm-2 col-form-label ${styles.addlabel}`} >單位*<span className={styles.Note}> 選擇單位請以*公升*做為優先填寫項目</span></CFormLabel>
                        <CCol>
                            <CFormSelect aria-label="Default select example" id="unit" className={styles.addinput}>
                                <option value="1">公升</option>
                                <option value="2">金額</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="quantity" className={`col-sm-2 col-form-label ${styles.addlabel}`} >公升數/金額*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="quantity" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="explain" className={`col-sm-2 col-form-label ${styles.addlabel}`} >備註</CFormLabel>
                        <CCol>
                            <CFormTextarea className={styles.addinput} type="text" id="explain" rows={3} value={recognizedText} />

                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="photo" className={`col-sm-2 col-form-label ${styles.addlabel}`}  >圖片*</CFormLabel>
                        <CCol>
                            <CFormInput type="file" id="C1image" onChange={handleC1image} required />
                        </CCol>
                    </CRow>
                    <br />
                    <div style={{ textAlign: 'center' }}>*為必填欄位</div>

                <CButton type="submit" onClick={handleC1Submit}>新增</CButton>

                    </form>

                </div>
            );

            return (
                <div className={styles.addmodal}>

                    <CRow className="mb-3">
                        <CFormLabel htmlFor="month" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票/收據日期*</CFormLabel>
                        <CCol>
                            <CFormSelect aria-label="Default select example" id="month" className={styles.addinput} >
                                <option value="1">1月</option>
                                <option value="2">2月</option>
                                <option value="3">3月</option>
                                <option value="4">4月</option>
                                <option value="5">5月</option>
                                <option value="6">6月</option>
                                <option value="7">7月</option>
                                <option value="8">8月</option>
                                <option value="9">9月</option>
                                <option value="10">10月</option>
                                <option value="11">11月</option>
                                <option value="12">12月</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="num" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票號碼/收據編號*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="text" id="num" required />
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CFormLabel htmlFor="unit" className={`col-sm-2 col-form-label ${styles.addlabel}`} >單位*<span className={styles.Note}> 選擇單位請以*公升*做為優先填寫項目</span></CFormLabel>
                        <CCol>
                            <CFormSelect aria-label="Default select example" id="unit" className={styles.addinput}>
                                <option value="1">公升</option>
                                <option value="2">金額</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="quantity" className={`col-sm-2 col-form-label ${styles.addlabel}`} >公升數/金額*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="quantity" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="explain" className={`col-sm-2 col-form-label ${styles.addlabel}`} >備註</CFormLabel>
                        <CCol>
                            <CFormTextarea className={styles.addinput} type="text" id="explain" rows={3} />

                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="photo" className={`col-sm-2 col-form-label ${styles.addlabel}`}  >圖片*</CFormLabel>
                        <CCol>
                            <CFormInput type="file" id="photo" required />
                        </CCol>
                    </CRow>
                    <br />
                    <div style={{ textAlign: 'center' }}>*為必填欄位</div>




                </div>
            );
        case 'two':
            return (
                <div className={styles.addmodal}>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="name" className={`col-sm-2 col-form-label ${styles.addlabel}`} >品名*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="text" id="name" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="element" className={`col-sm-2 col-form-label ${styles.addlabel}`} >成分*</CFormLabel>
                        <CCol>
                            <CFormSelect aria-label="Default select example" id="element" className={styles.addinput}>
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
                        <CFormLabel htmlFor="weight" className={`col-sm-2 col-form-label ${styles.addlabel}`} >規格(重量)*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="weight" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="explain" className={`col-sm-2 col-form-label ${styles.addlabel}`} >備註</CFormLabel>
                        <CCol>
                            <CFormTextarea className={styles.addinput} type="text" id="explain" rows={3} />

                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="photo" className={`col-sm-2 col-form-label ${styles.addlabel}`} >圖片*</CFormLabel>
                        <CCol>
                            <CFormInput type="file" id="C2image" required />
                        </CCol>
                    </CRow>
                    <br />
                    <div style={{ textAlign: 'center' }}>*為必填欄位</div>

                    <CButton type="submit" onClick={handleC2Submit}>新增</CButton>

                </div>
            );

        case 'three':
            return (
                <div className={styles.addmodal}>

                    <form onSubmit={handleC3Submit}>

                    <CRow className="mb-3">
                        <CFormLabel htmlFor="month" className={`col-sm-2 col-form-label ${styles.addlabel}`} >月份*</CFormLabel>
                        <CCol>
                            <CFormSelect aria-label="Default select example" id="C3month" className={styles.addinput} >
                                <option value="1">1月</option>
                                <option value="2">2月</option>
                                <option value="3">3月</option>
                                <option value="4">4月</option>
                                <option value="5">5月</option>
                                <option value="6">6月</option>
                                <option value="7">7月</option>
                                <option value="8">8月</option>
                                <option value="9">9月</option>
                                <option value="10">10月</option>
                                <option value="11">11月</option>
                                <option value="12">12月</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="people" className={`col-sm-2 col-form-label ${styles.addlabel}`} >員工數*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="C3employee" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="workhour" className={`col-sm-2 col-form-label ${styles.addlabel}`} >每日工時*<br /><span className={styles.Note}> 不含休息時間</span></CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="C3daily_hours" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="workday" className={`col-sm-2 col-form-label ${styles.addlabel}`} >每月工作日數*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="C3workday" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="plushou" className={`col-sm-2 col-form-label ${styles.addlabel}`} >總加班時數</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="C3overtime" />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="sickhour" className={`col-sm-2 col-form-label ${styles.addlabel}`} >總病假時數</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="C3sick" />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="personalhour" className={`col-sm-2 col-form-label ${styles.addlabel}`} >總事假時數</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="C3personal" />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="businesshour" className={`col-sm-2 col-form-label ${styles.addlabel}`} >總出差時數</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="C3business" />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="deadhour" className={`col-sm-2 col-form-label ${styles.addlabel}`} >總婚喪時數</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="C3funeral" />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="resthour" className={`col-sm-2 col-form-label ${styles.addlabel}`} >總特休時數</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="C3special" />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="explain" className={`col-sm-2 col-form-label ${styles.addlabel}`} >備註</CFormLabel>
                        <CCol>
                            <CFormTextarea className={styles.addinput} type="text" id="C3explain" rows={3} />

                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="photo" className={`col-sm-2 col-form-label ${styles.addlabel}`}  >圖片*</CFormLabel>
                        <CCol>
                            <CFormInput type="file" id="C3image" required />
                        </CCol>
                    </CRow>
                    <br />
                    <div style={{ textAlign: 'center' }}>*為必填欄位</div>

                    <CButton type="submit" onClick={handleC3Submit}>新增</CButton>


                    </form>

                </div>
            );
        case 'four':
            return (
                <div className={styles.addmodal}>

                    <CRow className="mb-3">
                        <CFormLabel htmlFor="month" className={`col-sm-2 col-form-label ${styles.addlabel}`} >月份*</CFormLabel>
                        <CCol>
                            <CFormSelect aria-label="Default select example" id="month" className={styles.addinput} >
                                <option value="1">1月</option>
                                <option value="2">2月</option>
                                <option value="3">3月</option>
                                <option value="4">4月</option>
                                <option value="5">5月</option>
                                <option value="6">6月</option>
                                <option value="7">7月</option>
                                <option value="8">8月</option>
                                <option value="9">9月</option>
                                <option value="10">10月</option>
                                <option value="11">11月</option>
                                <option value="12">12月</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="people" className={`col-sm-2 col-form-label ${styles.addlabel}`} >人數*<span className={styles.Note}>如保全、清潔等委外人員</span></CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="people" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="workhour" className={`col-sm-2 col-form-label ${styles.addlabel}`} >總工作時數*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="workhour" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="workday" className={`col-sm-2 col-form-label ${styles.addlabel}`} >總工作人天*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="workday" required />
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CFormLabel htmlFor="explain" className={`col-sm-2 col-form-label ${styles.addlabel}`} >備註</CFormLabel>
                        <CCol>
                            <CFormTextarea className={styles.addinput} type="text" id="explain" rows={3} />

                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="photo" className={`col-sm-2 col-form-label ${styles.addlabel}`}  >圖片*</CFormLabel>
                        <CCol>
                            <CFormInput type="file" id="photo" required />
                        </CCol>
                    </CRow>
                    <br />
                    <div style={{ textAlign: 'center' }}>*為必填欄位</div>




                </div>
            );
        case 'five':
            const [visible, setVisible] = useState(false)
            return (
                <div className={styles.addmodal}>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="month" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票/收據日期*</CFormLabel>
                        <CCol><CFormInput className={styles.addinput} type="date" id="C5date" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="num" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票號碼/收據編號*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="text" id="C5num" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="type" className={`col-sm-2 col-form-label ${styles.addlabel}`} >設備類型*</CFormLabel>
                        <CCol>
                            <CFormSelect aria-label="Default select example" id="C5type" className={styles.addinput} >
                                <option value="1">冰箱</option>
                                <option value="2">冷氣機</option>
                                <option value="3">飲水機</option>
                                <option value="4">冰水主機</option>
                                <option value="5">空壓機</option>
                                <option value="6">除濕機</option>
                                <option value="7">車用冷媒</option>
                                <option value="8">製冰機</option>
                                <option value="9">冰櫃</option>
                                <option value="10">冷凍櫃</option>
                                <option value="11">其他</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="site" className={`col-sm-2 col-form-label ${styles.addlabel}`} >設備位置*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="text" id="C5site" required />
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CFormLabel htmlFor="type2" className={`col-sm-2 col-form-label ${styles.addlabel}`} >冷媒類型*</CFormLabel>
                        <CCol>
                            <CFormSelect aria-label="Default select example" id="C5type2" className={styles.addinput} >
                                <option value="1">R11</option>
                                <option value="2">R12</option>
                                <option value="3">R22</option>
                                <option value="4">R-32</option>
                                <option value="5">R-123</option>
                                <option value="6">R-23</option>
                                <option value="7">R-134a</option>
                                <option value="8">R-404A</option>
                                <option value="9">R-407a</option>
                                <option value="10">R-410A</option>
                                <option value="11">R-600a</option>
                                <option value="12">R-417a</option>
                                <option value="13">F22</option>
                                <option value="14">HCR-600A</option>
                                <option value="15">HFC-134a</option>
                                <option value="16">R401A</option>
                                <option value="17">其他</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="quantity" className={`col-sm-2 col-form-label ${styles.addlabel}`} >填充料(公克)*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="C5quantity" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="num" className={`col-sm-2 col-form-label ${styles.addlabel}`} >數量*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="C5num" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="percent" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                            逸散率<br /><span className={styles.Note2} onClick={() => setVisible(!visible)}>逸散率(%)建議表格</span></CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="C5percent" required />
                        </CCol>
                        <CCollapse visible={visible}>
                            <CCard className="mt-3">
                                <CCardBody>
                                    <img src='/src/assets/images/逸散率建議表格.png' />
                                </CCardBody>
                            </CCard>
                        </CCollapse>
                    </CRow>

                    <CRow className="mb-3">
                        <CFormLabel htmlFor="explain" className={`col-sm-2 col-form-label ${styles.addlabel}`} >備註</CFormLabel>
                        <CCol>
                            <CFormTextarea className={styles.addinput} type="text" id="C5explain" rows={3} />

                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="photo" className={`col-sm-2 col-form-label ${styles.addlabel}`}  >圖片*</CFormLabel>
                        <CCol>
                            <CFormInput type="file" id="C5image" required />
                        </CCol>
                    </CRow>
                    <br />
                    <div style={{ textAlign: 'center' }}>*為必填欄位</div>

                    <CButton type="submit" onClick={handleC5Submit}>新增</CButton>

                </div>
            );
        case 'six':
            return (
                <div className={styles.addmodal}>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="month" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票/收據日期*</CFormLabel>
                        <CCol><CFormInput className={styles.addinput} type="date" id="C6date" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="num" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票號碼/收據編號*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="text" id="C6num" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="site" className={`col-sm-2 col-form-label ${styles.addlabel}`} >設備位置*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="text" id="C6site" required />
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CFormLabel htmlFor="type2" className={`col-sm-2 col-form-label ${styles.addlabel}`} >能源類型*</CFormLabel>
                        <CCol>
                            <CFormSelect aria-label="Default select example" id="C6type2" className={styles.addinput} >
                                <option value="1">柴油</option>
                                <option value="2">汽油</option>
                                <option value="3">其他</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="quantity" className={`col-sm-2 col-form-label ${styles.addlabel}`} >使用量(公克)*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="C6quantity" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="explain" className={`col-sm-2 col-form-label ${styles.addlabel}`} >備註</CFormLabel>
                        <CCol>
                            <CFormTextarea className={styles.addinput} type="text" id="C6explain" rows={3} />

                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="photo" className={`col-sm-2 col-form-label ${styles.addlabel}`}  >圖片*</CFormLabel>
                        <CCol>
                            <CFormInput type="file" id="C6image" required />
                        </CCol>
                    </CRow>
                    <br />
                    <div style={{ textAlign: 'center' }}>*為必填欄位</div>

                    <CButton type="submit" onClick={handleC6Submit}>新增</CButton>
                </div>
            );
        case 'seven':
            return (
                <div className={styles.addmodal}>

                    <CRow className="mb-3">
                        <CFormLabel htmlFor="date" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票/收據日期*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="date" id="C7date" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="num" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票號碼/收據編號*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="text" id="C7num" required />
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CFormLabel htmlFor="quantity" className={`col-sm-2 col-form-label ${styles.addlabel}`} >使用量(公升)*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="C7quantity" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="explain" className={`col-sm-2 col-form-label ${styles.addlabel}`} >備註</CFormLabel>
                        <CCol>
                            <CFormTextarea className={styles.addinput} type="text" id="C7explain" rows={3} />

                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="photo" className={`col-sm-2 col-form-label ${styles.addlabel}`}  >圖片*</CFormLabel>
                        <CCol>
                            <CFormInput type="file" id="C7image" required />
                        </CCol>
                    </CRow>
                    <br />
                    <div style={{ textAlign: 'center' }}>*為必填欄位</div>

                    <CButton type="submit" onClick={handleC7Submit}>新增</CButton>


                </div>
            );
        case 'eight':
            return (
                <div className={styles.addmodal}>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="month" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票/收據日期*</CFormLabel>
                        <CCol><CFormInput className={styles.addinput} type="date" id="C8date" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="num" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票號碼/收據編號*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="text" id="C8num" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="datestart" className={`col-sm-2 col-form-label ${styles.addlabel}`} >用電期間(起)*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="date" id="C8datestart" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="dateend" className={`col-sm-2 col-form-label ${styles.addlabel}`} >用電期間(迄)*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="date" id="C8dateend" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="type" className={`col-sm-2 col-form-label ${styles.addlabel}`} >填寫類型*<span className={styles.Note}> 選擇填寫請以*用電度數*作為優先填寫項目</span></CFormLabel>
                        <CCol>
                            <CFormSelect aria-label="Default select example" id="C8type" className={styles.addinput} >
                                <option value="1">用電度數</option>
                                <option value="2">用電金額</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>

                    
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="monthusage" className={`col-sm-2 col-form-label ${styles.addlabel}`} >當月總用電量或總金額</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="C8monthusage" />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="explain" className={`col-sm-2 col-form-label ${styles.addlabel}`} >備註</CFormLabel>
                        <CCol>
                            <CFormTextarea className={styles.addinput} type="text" id="C8explain" rows={3} />

                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="photo" className={`col-sm-2 col-form-label ${styles.addlabel}`}  >圖片*</CFormLabel>
                        <CCol>
                            <CFormInput type="file" id="C8image" required />
                        </CCol>
                    </CRow>
                    <br />
                    <div style={{ textAlign: 'center' }}>*為必填欄位</div>

                    <CButton type="submit" onClick={handleC8Submit}>新增</CButton>

                </div>
            );

            return (
                <div className={styles.addmodal}>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="month" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票/收據日期*</CFormLabel>
                        <CCol><CFormInput className={styles.addinput} type="date" id="date" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="num" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票號碼/收據編號*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="text" id="num" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="name" className={`col-sm-2 col-form-label ${styles.addlabel}`} >原燃物料名稱*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="text" min='0' id="name" />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="usage" className={`col-sm-2 col-form-label ${styles.addlabel}`} >使用量*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="usage" required />
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CFormLabel htmlFor="explain" className={`col-sm-2 col-form-label ${styles.addlabel}`} >備註</CFormLabel>
                        <CCol>
                            <CFormTextarea className={styles.addinput} type="text" id="explain" rows={3} />

                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="photo" className={`col-sm-2 col-form-label ${styles.addlabel}`}  >圖片*</CFormLabel>
                        <CCol>
                            <CFormInput type="file" id="photo" required />
                        </CCol>
                    </CRow>
                    <br />
                    <div style={{ textAlign: 'center' }}>*為必填欄位</div>
                </div>
            );
        case 'nine':
            return (
                <div className={styles.addmodal}>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="type" className={`col-sm-2 col-form-label ${styles.addlabel}`} >交通方式*</CFormLabel>
                        <CCol>
                            <CFormSelect aria-label="Default select example" id="C9type" className={styles.addinput}
                                onChange={(e) => setTransportType(e.target.value)} >
                                <option value="1">汽車</option>
                                <option value="2">機車</option>
                                <option value="3">公車</option>
                                <option value="4">捷運</option>
                                <option value="5">火車</option>
                                <option value="6">高鐵</option>
                                <option value="7">客運</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="oil" className={`col-sm-2 col-form-label ${styles.addlabel}`} >油種*<span className={styles.Note}>僅汽/機車須填寫</span></CFormLabel>
                        <CCol>
                            <CFormSelect aria-label="Default select example" id="C9oil_type" className={styles.addinput} disabled={!(transportType === "1" || transportType === "2")} >
                                <option value="1">無</option>
                                <option value="2">汽油</option>
                                <option value="3">柴油</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="km" className={`col-sm-2 col-form-label ${styles.addlabel}`} >公里數*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="C9number" id="C9km" required />
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CFormLabel htmlFor="explain" className={`col-sm-2 col-form-label ${styles.addlabel}`} >備註</CFormLabel>
                        <CCol>
                            <CFormTextarea className={styles.addinput} type="text" id="C9explain" rows={3} />

                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="photo" className={`col-sm-2 col-form-label ${styles.addlabel}`}  >圖片*</CFormLabel>
                        <CCol>
                            <CFormInput type="file" id="C9image" required />
                        </CCol>
                    </CRow>
                    <br />
                    <div style={{ textAlign: 'center' }}>*為必填欄位</div>

                    <CButton type="submit" onClick={handleC9Submit}>新增</CButton>
                </div>
            );


            return (
                <div className={styles.addmodal}>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="month" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票/收據日期*</CFormLabel>
                        <CCol><CFormInput className={styles.addinput} type="date" id="date" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="num" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票號碼/收據編號*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="text" id="num" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="datestart" className={`col-sm-2 col-form-label ${styles.addlabel}`} >用電期間(起)*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="date" id="datestart" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="dateend" className={`col-sm-2 col-form-label ${styles.addlabel}`} >用電期間(迄)*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="date" id="dateend" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="type" className={`col-sm-2 col-form-label ${styles.addlabel}`} >填寫類型*<span className={styles.Note}> 選擇填寫請以*用電度數*作為優先填寫項目</span></CFormLabel>
                        <CCol>
                            <CFormSelect aria-label="Default select example" id="type" className={styles.addinput} >
                                <option value="1">用電度數</option>
                                <option value="2">用電金額</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CFormLabel htmlFor="quantity" className={`col-sm-2 col-form-label ${styles.addlabel}`} >尖峰度數*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="quantity" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="quantity2" className={`col-sm-2 col-form-label ${styles.addlabel}`} >半尖峰度數</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="quantity2" />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="quantity3" className={`col-sm-2 col-form-label ${styles.addlabel}`} >周六尖峰度數</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="quantity3" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="quantity4" className={`col-sm-2 col-form-label ${styles.addlabel}`} >離峰度數</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="quantity4" required />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="monthusage" className={`col-sm-2 col-form-label ${styles.addlabel}`} >當月總用電量或總金額</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" min='0' id="monthusage" />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="explain" className={`col-sm-2 col-form-label ${styles.addlabel}`} >備註</CFormLabel>
                        <CCol>
                            <CFormTextarea className={styles.addinput} type="text" id="explain" rows={3} />

                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="photo" className={`col-sm-2 col-form-label ${styles.addlabel}`}  >圖片*</CFormLabel>
                        <CCol>
                            <CFormInput type="file" id="photo" required />
                        </CCol>
                    </CRow>
                    <br />
                    <div style={{ textAlign: 'center' }}>*為必填欄位</div>
                </div>
            );
        case 'ten':


            return (
                <div className={styles.addmodal}>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="type" className={`col-sm-2 col-form-label ${styles.addlabel}`} >交通方式*</CFormLabel>
                        <CCol>
                            <CFormSelect aria-label="Default select example" id="C10type" className={styles.addinput}
                                onChange={(e) => setTransportType(e.target.value)} >
                                <option value="1">汽車</option>
                                <option value="2">機車</option>
                                <option value="3">公車</option>
                                <option value="4">捷運</option>
                                <option value="5">火車</option>
                                <option value="6">高鐵</option>
                                <option value="7">客運</option>
                                <option value="8">飛機</option>
                                <option value="9">輪船</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="oil" className={`col-sm-2 col-form-label ${styles.addlabel}`} >油種*<span className={styles.Note}>僅汽/機車須填寫</span></CFormLabel>
                        <CCol>
                            <CFormSelect aria-label="Default select example" id="C10oil_type" className={styles.addinput} disabled={!(transportType === "1" || transportType === "2")} >
                                <option value="1">無</option>
                                <option value="2">汽油</option>
                                <option value="3">柴油</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="km" className={`col-sm-2 col-form-label ${styles.addlabel}`} >公里數*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" id="C10km" required />
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CFormLabel htmlFor="explain" className={`col-sm-2 col-form-label ${styles.addlabel}`} >備註</CFormLabel>
                        <CCol>
                            <CFormTextarea className={styles.addinput} type="text" id="C10explain" rows={3} />

                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="photo" className={`col-sm-2 col-form-label ${styles.addlabel}`}  >圖片*</CFormLabel>
                        <CCol>
                            <CFormInput type="file" id="C10image" required />
                        </CCol>
                    </CRow>
                    <br />
                    <div style={{ textAlign: 'center' }}>*為必填欄位</div>

                    <CButton type="submit" onClick={handleC10Submit}>新增</CButton>
                </div>
            );
        case 'eleven':
            return (
                <div className={styles.addmodal}>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="item" className={`col-sm-2 col-form-label ${styles.addlabel}`} >廢棄物項目*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="text" id="C11item" required />
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CFormLabel htmlFor="explain" className={`col-sm-2 col-form-label ${styles.addlabel}`} >備註</CFormLabel>
                        <CCol>
                            <CFormTextarea className={styles.addinput} type="text" id="C11explain" rows={3} />

                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="photo" className={`col-sm-2 col-form-label ${styles.addlabel}`}  >圖片*</CFormLabel>
                        <CCol>
                            <CFormInput type="file" id="C11image" required />
                        </CCol>
                    </CRow>
                    <br />
                    <div style={{ textAlign: 'center' }}>*為必填欄位</div>
                    <CButton type="submit" onClick={handleC11Submit}>新增</CButton>
                </div>
                
            );
        case 'twelve':
            return (
                <div className={styles.addmodal}>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="item" className={`col-sm-2 col-form-label ${styles.addlabel}`} >廢棄物項目*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="text" id="C12item" required />
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CFormLabel htmlFor="explain" className={`col-sm-2 col-form-label ${styles.addlabel}`} >備註</CFormLabel>
                        <CCol>
                            <CFormTextarea className={styles.addinput} type="text" id="C12explain" rows={3} />

                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="photo" className={`col-sm-2 col-form-label ${styles.addlabel}`}  >圖片*</CFormLabel>
                        <CCol>
                            <CFormInput type="file" id="C12image" required />
                        </CCol>
                    </CRow>
                    <br />
                    <div style={{ textAlign: 'center' }}>*為必填欄位</div>

                    <CButton type="submit" onClick={handleC12Submit}>新增</CButton>
                </div>
            );

        default:
            return <div>未選擇項目</div>;
    }
};

const ActivityModal = ({ isAddModalVisible, setAddModalVisible, currentFunction }) => {
    return (
        <CModal
            backdrop="static"
            visible={isAddModalVisible}
            onClose={() => setAddModalVisible(false)}
            aria-labelledby="ActivityModalLabel"
        >
            <CModalHeader>
                <CModalTitle id="ActivityModalLabel"><b>新增數據</b></CModalTitle>
            </CModalHeader>
            <CForm>
                <CModalBody>
                    {/* Dynamically render form based on currentFunction */}
                    <FunctionForms currentFunction={currentFunction} />
                </CModalBody>
                <CModalFooter>
                    <CButton className="modalbutton1" onClick={() => setAddModalVisible(false)}>
                        取消
                    </CButton>
                    <CButton className="modalbutton2" type="submit">新增</CButton>
                </CModalFooter>
            </CForm>
        </CModal>
    );
};

export default ActivityModal;
