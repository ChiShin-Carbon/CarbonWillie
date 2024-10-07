
import React, { useState } from 'react'
import {
    CRow, CCol, CCard, CFormSelect, CTab, CTabList, CTabs,
    CTable, CTableBody, CTableHead, CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CButton, CFormCheck
    , CForm, CFormLabel, CFormInput, CFormTextarea,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilDataTransferDown } from '@coreui/icons'

import '../../../../scss/碳盤查系統.css'
import styles from '../../../../scss/顧問system.module.css'
import { Link } from 'react-router-dom'


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faCircleXmark, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';



const Tabs = () => {
    // 定義 useState 來控制 Modal 的顯示
    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [isAddModalVisible2, setAddModalVisible2] = useState(false);
    const [isEditModalVisible2, setEditModalVisible2] = useState(false);


    return (
        <main>
            <CTabs activeItemKey={1}>
                <CTabList variant="underline-border" className="system-tablist">
                    <Link to="/碳盤查系統/顧問system/排放源鑑別" className="system-tablist-link">
                        <CTab aria-controls="tab1" className="system-tablist-choose">排放源鑑別</CTab>
                    </Link>
                    <Link to="/碳盤查系統/顧問system/活動數據" className="system-tablist-link">
                        <CTab aria-controls="tab3" className="system-tablist-choose">活動數據</CTab>
                    </Link>
                    <Link to="/碳盤查系統/system/活動數據盤點" className="system-tablist-link">
                        <CTab aria-controls="tab3" className="system-tablist-choose">ddd</CTab>
                    </Link>
                    <Link to="." className="system-tablist-link">
                        <CTab aria-controls="tab3" itemKey={1} className="system-tablist-choose">全廠電力蒸汽供需情況 </CTab>
                    </Link>

                </CTabList>
            </CTabs>

            <div className="system-titlediv">
                <div>
                    <h4 className="system-title">全廠電力、蒸汽供需情況</h4>
                    <hr className="system-hr"></hr>
                </div>
                <button className="system-save">儲存</button>
            </div>
            <CCard className="mb-4 systemCard">
                <div className="systemCardBody">
                    <CRow className="mb-3">
                        <CCol>
                            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#625F5F', display: 'inline' }}>
                                能源生產一覽表</div> <span style={{ fontWeight: 'bold' }}>-離網電力供應者或及蒸汽生產者應填寫本表</span>

                        </CCol>
                        <CCol style={{ textAlign: 'right' }}>
                            <button className="systembutton" onClick={() => setAddModalVisible(true)}>新增</button>
                        </CCol>
                    </CRow>

                    <CTable hover className="systemTable">
                        <CTableHead >
                            <tr>
                                <th>生產能源類別</th>
                                <th>產量</th>
                                <th>自用量</th>
                                <th>外售量</th>
                                <th>單位</th>
                                <th>操作</th>
                            </tr>
                        </CTableHead>
                        <CTableBody>
                            <tr>
                                <td>電力</td>
                                <td>XXXXXX</td>
                                <td>XXX</td>
                                <td>XXX</td>
                                <td>千立方公尺</td>
                                <td><FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} onClick={() => setEditModalVisible(true)} />
                                    <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} /></td>
                            </tr>
                            <tr>
                                <td>蒸汽</td>
                                <td>XXXXXX</td>
                                <td>XXX</td>
                                <td>XXX</td>
                                <td>公噸</td>
                                <td><FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} onClick={() => setEditModalVisible(true)} />
                                    <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} /></td>
                            </tr>
                        </CTableBody>
                    </CTable>
                </div>

                <br /> <br /> <br /> <br />

                <div className="systemCardBody">
                    <CRow className="mb-3">
                        <CCol>
                            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#625F5F', display: 'inline' }}>
                                說明電力/蒸汽外售對象</div> <span style={{ fontWeight: 'bold' }}>(若為併網電力供應者，毋需填寫)</span>

                        </CCol>
                        <CCol style={{ textAlign: 'right' }}>
                            <button className="systembutton" onClick={() => setAddModalVisible2(true)}>新增</button>
                        </CCol>
                    </CRow>

                    <CTable hover className="systemTable">
                        <CTableHead >
                            <tr>
                                <th>外售能源類別</th>
                                <th>外售對象</th>
                                <th>外售量</th>
                                <th>單位</th>
                                <th>操作</th>
                            </tr>
                        </CTableHead>
                        <CTableBody>
                            <tr>
                                <td>電力</td>
                                <td>XXXXXX</td>
                                <td>XXX</td>
                                <td>千立方公尺</td>
                                <td><FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} onClick={() => setEditModalVisible2(true)} />
                                    <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} /></td>
                            </tr>
                            <tr>
                                <td>蒸汽</td>
                                <td>XXXXXX</td>
                                <td>XXX</td>
                                <td>公噸</td>
                                <td><FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} onClick={() => setEditModalVisible2(true)} />
                                    <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} /></td>
                            </tr>
                        </CTableBody>
                    </CTable>
                </div>
            </CCard>

            {/* 上方表格 Modal*/}
            <CModal
                backdrop="static"
                visible={isAddModalVisible}
                onClose={() => setAddModalVisible(false)}
                aria-labelledby="StaticBackdropExampleLabel"
            >
                <CModalHeader>
                    <CModalTitle id="StaticBackdropExampleLabel"><b>新增項目</b></CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm >

                        <CRow className="mb-3">
                            <CFormLabel htmlFor="type" className={`col-sm-2 col-form-label ${styles.label}`}  >生產能源類別</CFormLabel>
                            <CCol>
                                <CFormSelect className={styles.input} id='type'>
                                    <option value="1">電力</option>
                                    <option value="2">蒸汽</option>
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="produce" className={`col-sm-2 col-form-label ${styles.label}`}  >產量</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.input} type="num" id="produce" />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="use" className={`col-sm-2 col-form-label ${styles.label}`}  >自用量</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.input} type="num" id="use" />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="sale" className={`col-sm-2 col-form-label ${styles.label}`}  >外售量</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.input} type="num" id="sale" />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="unit" className={`col-sm-2 col-form-label ${styles.label}`}  >單位</CFormLabel>
                            <CCol>
                                <CFormSelect className={styles.input} id='unit'>
                                    <option value="1">千度</option>
                                    <option value="2">千立方公尺</option>
                                    <option value="3">公噸</option>
                                </CFormSelect>
                            </CCol>
                        </CRow>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton className="modalbutton1" onClick={() => setAddModalVisible(false)}>
                        取消
                    </CButton>
                    <CButton className="modalbutton2">新增</CButton>
                </CModalFooter>
            </CModal>
            <CModal
                backdrop="static"
                visible={isEditModalVisible}
                onClose={() => setEditModalVisible(false)}
                aria-labelledby="StaticBackdropExampleLabel2"
            >
                <CModalHeader>
                    <CModalTitle id="StaticBackdropExampleLabel2"><b>編輯項目</b></CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm >

                        <CRow className="mb-3">
                            <CFormLabel htmlFor="type" className={`col-sm-2 col-form-label ${styles.label}`}  >生產能源類別</CFormLabel>
                            <CCol>
                                <CFormSelect className={styles.input} id='type'>
                                    <option value="1">電力</option>
                                    <option value="2">蒸汽</option>
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="produce" className={`col-sm-2 col-form-label ${styles.label}`}  >產量</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.input} type="num" id="produce" />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="use" className={`col-sm-2 col-form-label ${styles.label}`}  >自用量</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.input} type="num" id="use" />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="sale" className={`col-sm-2 col-form-label ${styles.label}`}  >外售量</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.input} type="num" id="sale" />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="unit" className={`col-sm-2 col-form-label ${styles.label}`}  >單位</CFormLabel>
                            <CCol>
                                <CFormSelect className={styles.input} id='unit'>
                                    <option value="1">千度</option>
                                    <option value="2">千立方公尺</option>
                                    <option value="3">公噸</option>
                                </CFormSelect>
                            </CCol>
                        </CRow>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton className="modalbutton1" onClick={() => setEditModalVisible(false)}>
                        取消
                    </CButton>
                    <CButton className="modalbutton2">確認</CButton>
                </CModalFooter>
            </CModal>
            {/* 上方表格 Modal END*/}

            {/* 下方表格 Modal*/}
            <CModal
                backdrop="static"
                visible={isAddModalVisible2}
                onClose={() => setAddModalVisible2(false)}
                aria-labelledby="StaticBackdropExampleLabel"
            >
                <CModalHeader>
                    <CModalTitle id="StaticBackdropExampleLabel"><b>新增項目</b></CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm >

                        <CRow className="mb-3">
                            <CFormLabel htmlFor="type" className={`col-sm-2 col-form-label ${styles.label}`}  >外售能源類別</CFormLabel>
                            <CCol>
                                <CFormSelect className={styles.input} id='type'>
                                    <option value="1">電力</option>
                                    <option value="2">蒸汽</option>
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="salewho" className={`col-sm-2 col-form-label ${styles.label}`}  >外售對象</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.input} type="num" id="salewho" />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="sale" className={`col-sm-2 col-form-label ${styles.label}`}  >外售量</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.input} type="num" id="sale" />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="unit" className={`col-sm-2 col-form-label ${styles.label}`}  >單位</CFormLabel>
                            <CCol>
                                <CFormSelect className={styles.input} id='unit'>
                                    <option value="1">千度</option>
                                    <option value="2">千立方公尺</option>
                                    <option value="3">公噸</option>
                                </CFormSelect>
                            </CCol>
                        </CRow>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton className="modalbutton1" onClick={() => setAddModalVisible2(false)}>
                        取消
                    </CButton>
                    <CButton className="modalbutton2">新增</CButton>
                </CModalFooter>
            </CModal>
            
            <CModal
                backdrop="static"
                visible={isEditModalVisible2}
                onClose={() => setEditModalVisible2(false)}
                aria-labelledby="StaticBackdropExampleLabel2"
            >
                <CModalHeader>
                    <CModalTitle id="StaticBackdropExampleLabel2"><b>編輯項目</b></CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm >

                        <CRow className="mb-3">
                            <CFormLabel htmlFor="type" className={`col-sm-2 col-form-label ${styles.label}`}  >外售能源類別</CFormLabel>
                            <CCol>
                                <CFormSelect className={styles.input} id='type'>
                                    <option value="1">電力</option>
                                    <option value="2">蒸汽</option>
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="salewho" className={`col-sm-2 col-form-label ${styles.label}`}  >外售對象</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.input} type="num" id="salewho" />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="sale" className={`col-sm-2 col-form-label ${styles.label}`}  >外售量</CFormLabel>
                            <CCol>
                                <CFormInput className={styles.input} type="num" id="sale" />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="unit" className={`col-sm-2 col-form-label ${styles.label}`}  >單位</CFormLabel>
                            <CCol>
                                <CFormSelect className={styles.input} id='unit'>
                                    <option value="1">千度</option>
                                    <option value="2">千立方公尺</option>
                                    <option value="3">公噸</option>
                                </CFormSelect>
                            </CCol>
                        </CRow>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton className="modalbutton1" onClick={() => setEditModalVisible2(false)}>
                        取消
                    </CButton>
                    <CButton className="modalbutton2">確認</CButton>
                </CModalFooter>
            </CModal>
            {/* 下方表格 Modal END*/}
        </main >

    );
}
export default Tabs;

