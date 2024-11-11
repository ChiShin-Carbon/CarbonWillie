import React, { useState } from 'react';
import {
    CModal, CModalHeader, CModalBody, CModalFooter, CButton, CFormLabel, CFormInput, CFormTextarea, CRow, CCol, CFormSelect, CForm
} from '@coreui/react';
import styles from '../../../../../scss/活動數據盤點.module.css';

const EditModal = ({ isEditModalVisible, setEditModalVisible }) => {
    const handleClose = () => setEditModalVisible(false);
    const [transportType, setTransportType] = useState("1"); // 默認選擇汽車
    return (
        <CModal visible={isEditModalVisible} onClose={handleClose} className={styles.modal}>
            <CModalHeader>
                <h5><b>編輯數據-員工通勤</b></h5>
            </CModalHeader>
            <CForm>
                <CModalBody>
                <div className={styles.addmodal}>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="type" className={`col-sm-2 col-form-label ${styles.addlabel}`} >交通方式*</CFormLabel>
                        <CCol>
                            <CFormSelect aria-label="Default select example" id="type" className={styles.addinput}
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
                            <CFormSelect aria-label="Default select example" id="type" className={styles.addinput} disabled={!(transportType === "1" || transportType === "2")} >
                                <option value="1">無</option>
                                <option value="2">汽油</option>
                                <option value="3">柴油</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="km" className={`col-sm-2 col-form-label ${styles.addlabel}`} >公里數*</CFormLabel>
                        <CCol>
                            <CFormInput className={styles.addinput} type="number" id="km" required />
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