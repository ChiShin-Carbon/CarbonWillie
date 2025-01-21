import React, { useState, useEffect } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CFormSelect, CForm, CCollapse, CCard, CCardBody
} from '@coreui/react';
import styles from '../../../../../scss/活動數據盤點.module.css';

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const EditFillModal = ({ isEditFillModalVisible, setEditFillModalVisible,selectedFillId }) => {
    const editFillClose = () => setEditFillModalVisible(false);
    const [collapseVisible, setCollapseVisible] = useState(false)
    const [formValues, setFormValues] = useState({
        Doc_date: '',
        Doc_number: '',
        usage: '',
        escape_rate: '',
        remark: '',
        img_path: '',
    });


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
        form.append('fillrec_id', selectedFillId);
        form.append('user_id', window.sessionStorage.getItem('user_id'));
        form.append('Doc_date', formValues.Doc_date);
        form.append('Doc_number', formValues.Doc_number);
        form.append('usage', formValues.usage);
        form.append('escape_rate', formValues.escape_rate);
        form.append('remark', formValues.remark);
        form.append('image', document.getElementById('C1image').files[0]);
        

        for (let [key, value] of form.entries()) {
            console.log(`${key}:`, value); // Debugging output
        }

        try {
            const response = await fetch('http://localhost:8000/edit_RefFill', {
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

        }
    };

    useEffect(() => {
        const fetchRefFillData = async () => {
          if (!selectedFillId) return;
    
          try {
            const response = await fetch('http://localhost:8000/RefFill_findone', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ Fill_id: selectedFillId }),
            });
    
            if (response.ok) {
              const data = await response.json();
              const RefFillData = data.RefFill[0];
              setFormValues({
                Doc_date: RefFillData?.Doc_date || '',
                Doc_number: RefFillData?.Doc_number || '',
                usage: RefFillData?.usage || '',
                escape_rate: RefFillData?.escape_rate || '',
                remark: RefFillData?.remark || '',
                img_path: '',
              });
              setPreviewImage(RefFillData?.img_path || null);
            } else {
              console.error('Error fetching Ref data:', await response.text());
            }
          } catch (error) {
            console.error('Error fetching Ref data:', error);
          }
        };
    
        fetchRefFillData();
      }, [selectedFillId]);

    return (
        <CModal
            backdrop="static"
            visible={isEditFillModalVisible} onClose={editFillClose}
            aria-labelledby="ActivityModalLabel"
            size="xl"
        >
            <CModalHeader>
                <h5><b>編輯填充紀錄</b></h5>
            </CModalHeader>
            <CForm onSubmit={handleEditSubmit}>
                <CModalBody>
                    <div className={styles.addmodal}>
                        <div className={styles.modalLeft}>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="month" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票/收據日期*</CFormLabel>
                                <CCol><CFormInput 
                                className={styles.addinput} 
                                type="date" 
                                id="Doc_date" 
                                value={formValues.Doc_date}
                                onChange={handleInputChange}
                                required /></CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="num" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票號碼/收據編號*</CFormLabel>
                                <CCol><CFormInput 
                                className={styles.addinput} 
                                type="text" 
                                id="Doc_number" 
                                value={formValues.Doc_number}
                                onChange={handleInputChange}
                                required /></CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="num" className={`col-sm-2 col-form-label ${styles.addlabel}`} >填充量*</CFormLabel>
                                <CCol><CFormInput 
                                className={styles.addinput} 
                                type="number" 
                                id="usage" 
                                value={formValues.usage}
                                onChange={handleInputChange}
                                required /></CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="percent" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    逸散率<br /><span className={styles.Note2} onClick={() => setCollapseVisible(!collapseVisible)}>逸散率(%)建議表格</span></CFormLabel>
                                <CCol>
                                    <CFormInput 
                                    className={styles.addinput} 
                                    type="number" 
                                    min='0' 
                                    id="escape_rate" 
                                    value={formValues.escape_rate}
                                    onChange={handleInputChange}
                                    required />
                                </CCol>
                                <CCollapse visible={collapseVisible}>
                                    <CCard className="mt-3">
                                        <CCardBody>
                                            <img src='/src/assets/images/逸散率建議表格.png' />
                                        </CCardBody>
                                    </CCard>
                                </CCollapse>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="explain" className={`col-sm-2 col-form-label ${styles.addlabel}`} >備註</CFormLabel>
                                <CCol><CFormTextarea 
                                className={styles.addinput} 
                                type="text" 
                                id="remark" 
                                rows={3} 
                                value={formValues.remark}
                                onChange={handleInputChange}
                                /></CCol>
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
                    <CButton className="modalbutton1" onClick={editFillClose}>取消</CButton>
                    <CButton className="modalbutton2" type="submit">儲存</CButton>
                </CModalFooter>
            </CForm>
        </CModal>
    );
};


export default EditFillModal;