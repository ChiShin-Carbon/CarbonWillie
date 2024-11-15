
import React, { useState } from 'react'
import {
    CRow, CCol, CCard, CFormSelect, CTab, CTabList, CTabs,
    CTable, CTableBody, CTableHead, CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CButton, CFormCheck
    , CForm, CFormLabel, CFormInput, CFormTextarea, CInputGroup, CInputGroupText
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilDataTransferDown } from '@coreui/icons'

import '../../../scss/碳盤查系統.css'
import styles from '../../../scss/管理者.module.css'
import { Link } from 'react-router-dom'


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';

import EditModal from './編輯Modal.js';
import AddModal from './新增Modal.js';


const Tabs = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [isAddModalVisible, setAddModalVisible] = useState(false);
    // 設定 state 來儲存選擇的行數據，初始值為 null
    const [selectedRowData, setSelectedRowData] = useState(null);

    // 模擬表格數據
    const tableData = [
        {
            org_name: "XXXXX股份有限公司",
            details: {
                org_name: "XXXXX股份有限公司", registration_number: "XXX", factory_number: "XXX",
                county: "XXX", town: "XXX", postal_code: "XXX",
                org_address: "XXdddddddddddddX", charge_person: "XXX", org_email: "XXX",
                contact_person: "XXX", email: "XXXdfdsf@gmail.com", telephone: "295115315",
                phone: "080790909", industry_name: "XXX", industry_code: "XXX",
            }
        },
        {
            org_name: "ABCV股份有限公司",
            details: {
                org_name: "ABCV股份有限公司", registration_number: "asd", factory_number: "qwe",
                county: "Xddd", town: "zxcxX", postal_code: "dfdf",
                org_address: "XXaaaaaaadsa ao7o7oo7o7X", charge_person: "BBB", org_email: "XXX",
                contact_person: "153X", email: "5656@gmail.com", telephone: "59012312132",
                phone: "0890909X", industry_name: "AAA", industry_code: "BBB",
            }
        },
    ];


    const handleRowClick = (row) => {
        setSelectedRowData(row.details);
    };



    return (
        <main>
            <div className="system-titlediv">
                <div>
                    <h4 className="system-title">系統現有企業列表</h4>
                    <hr className="system-hr"></hr>
                </div>
                {/* <button className="system-save">儲存</button> */}
            </div>
            <div className={styles.searchAndUpdate}>
                <CInputGroup className={styles.searchAndUpdateLeft}>
                    <CFormInput type="search" placeholder="Search" aria-label="Search" />
                    <CButton type="button" color="secondary" variant="outline">
                        <i className="pi pi-search" />
                    </CButton>
                </CInputGroup>

                <button className={styles.searchAndUpdateButton} onClick={() => setAddModalVisible(true)}>
                    新增企業資料
                </button>
            </div>

            <div className={styles.cardRow}>
                <CCard className={styles.cardLeft}>
                    <CTable hover className={styles.table}>
                        <CTableHead className={styles.tableHead}>
                            <tr>
                                <th>企業名稱</th>
                            </tr>
                        </CTableHead>
                        <CTableBody className={styles.tableBody}>
                            {tableData.map((row, index) => (
                                <tr key={index} onClick={() => handleRowClick(row)}>
                                    <td>{row.org_name}</td>
                                </tr>
                            ))}

                        </CTableBody>
                    </CTable>


                </CCard>

                <CCard className={styles.cardRight}>

                    {selectedRowData ? (
                        <>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardTitle}>
                                    <h5>企業詳細資料</h5>

                                </div>
                                <div className={styles.cardOperation}>
                                    <FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} onClick={() => setEditModalVisible(true)} />
                                    <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                                </div>
                            </div>

                            <div className={styles.cardBody}>
                                <div className={styles.block}>
                                    <div className={styles.blockBody1}>
                                        <div><span>公私場所名稱:</span><p>{selectedRowData.org_name}</p></div>
                                    </div>
                                </div>
                                <div className={styles.block}>
                                    <div className={styles.blockBody2}>
                                        <div><span>管制編號:</span><p>{selectedRowData.registration_number}</p></div>
                                        <div><span>核准字號:</span><p>{selectedRowData.factory_number}</p></div>
                                    </div>
                                </div>
                                <div className={styles.block}>
                                    <div className={styles.blockBody3}>
                                        <div><span>縣市別:</span><p>{selectedRowData.county}</p></div>
                                        <div><span>鄉鎮地區別:</span><p>{selectedRowData.town}</p></div>
                                        <div><span>郵遞區號:</span><p>{selectedRowData.postal_code}</p></div>
                                    </div>
                                </div>
                                <div className={styles.block}>
                                    <div className={styles.blockBody1}>
                                        <div><span>地址:</span><p>{selectedRowData.org_address}</p></div>
                                    </div>
                                </div>
                                <div className={styles.block}>
                                    <div className={styles.blockBody2}>
                                        <div><span>負責人姓名:</span><p>{selectedRowData.charge_person}</p></div>
                                        <div><span>公私場所電子信箱:</span><p>{selectedRowData.org_email}</p></div>
                                    </div>
                                </div>
                                <div className={styles.block}>
                                    <div className={styles.blockBody2}>
                                        <div><span>聯絡人姓名:</span><p>{selectedRowData.contact_person}</p></div>
                                        <div><span>電子信箱:</span><p>{selectedRowData.email}</p></div>
                                    </div>
                                </div>
                                <div className={styles.block}>
                                    <div className={styles.blockBody2}>
                                        <div><span>電話:</span><p>{selectedRowData.telephone}</p></div>
                                        <div><span>手機:</span><p>{selectedRowData.phone}</p></div>
                                    </div>
                                </div>
                                <div className={styles.block}>
                                    <div className={styles.blockBody2}>
                                        <div><span>行業名稱:</span><p>{selectedRowData.industry_name}</p></div>
                                        <div><span>行業代碼:</span><p>{selectedRowData.industry_code}</p></div>
                                    </div>
                                </div>


                            </div>
                            <div className={styles.userList}>
                                <div><Link to="../管理者/使用者列表"><FontAwesomeIcon icon={faUsers} /> 該企業使用者資料列表</Link></div>
                            </div>
                        </>

                    ) : (
                        <div style={{ width: '100%', height: '100%', textAlign: 'center', alignContent: 'center', fontWeight: 'bold', fontSize: 'large' }}>
                            請選取內容!</div>
                    )}
                </CCard>
            </div>

            <EditModal
                isEditModalVisible={isEditModalVisible}
                setEditModalVisible={setEditModalVisible}
            />

            <AddModal
                isAddModalVisible={isAddModalVisible}
                setAddModalVisible={setAddModalVisible}
            />

        </main >

    );
}

export default Tabs;

