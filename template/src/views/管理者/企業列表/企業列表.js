
import React, { useState, useEffect } from 'react'
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


    const [companyList, setCompanyList] = useState([]);
    // 獲取企業資料的函數
    const fetchCompanyInfo = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/adminCompany', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                setCompanyList(data.companies); // 修正為 data.companies
            } else {
                console.log(`Error: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching company info:', error);
        }
    };
    useEffect(() => {
        fetchCompanyInfo();
    }, []);


    const [selectedRowData, setSelectedRowData] = useState(null);
    const handleRowClick = (row) => {
        setSelectedRowData(row);
        console.log(selectedRowData)
    };

    ///////////////////////////////刪除////////////////////////////////////////////////
    const deleteCompanyInfo = async (businessID) => {
        try {
            const response = await fetch(`http://localhost:8000/delete_adminCompany/${businessID}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            const result = await response.json()
            if (response.ok) {
                console.log(result.message)
                // Refresh records after deletion
                refreshAuthorizedRecords()
            } else {
                console.error('Failed to delete record:', result.detail)
            }
        } catch (error) {
            console.error('Error deleting record:', error)
        }
    }
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)
    const [selectedbusinessID, setSelectedbusinessID] = useState(null)

    const openDeleteModal = (businessID) => {
        setSelectedbusinessID(businessID)
        setDeleteModalVisible(true)
    }

    // 刪除紀錄的函數
    const deleteAndClose = (businessID) => {
        deleteCompanyInfo(businessID)
        setDeleteModalVisible(false) // 關閉 Modal
    }


    ///重整頁面用
    const refreshAuthorizedRecords = () => {
        fetchCompanyInfo()
    }

    useEffect(() => {
        if (selectedRowData) {
            const updatedRowData = companyList.find(
                (row) => row.business_id === selectedRowData.business_id
            );
            if (updatedRowData) {
                setSelectedRowData(updatedRowData);
            }
        }
    }, [companyList]);


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
                            {companyList.map((row, index) => (
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
                                    <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} onClick={() => openDeleteModal(selectedRowData.business_id)} />
                                </div>
                            </div>

                            <div className={styles.cardBody}>
                                <div className={styles.block}>
                                    <div className={styles.blockBody1}>
                                        <div><span>公私場所名稱:</span><p>{selectedRowData.org_name}</p></div>
                                    </div>
                                </div>
                                <div className={styles.block}>
                                    <div className={styles.blockBody3}>
                                        <div><span>統一編號:</span><p>{selectedRowData.business_id}</p></div>
                                        <div><span>管制編號:</span><p>{selectedRowData.registration_number}</p></div>
                                        <div><span>工廠登記證編號:</span><p>{selectedRowData.factory_number}</p></div>
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
                                        <div><span>行業名稱:</span><p>{selectedRowData.industry_name}</p></div>
                                        <div><span>行業代碼:</span><p>{selectedRowData.industry_code}</p></div>
                                    </div>
                                </div>
                                <hr />
                                <div className={styles.block}>
                                    <div className={styles.blockBody2}>
                                        <div><span>聯絡人姓名:</span><p>{selectedRowData.contact_person}</p></div>
                                        <div><span>聯絡人電子信箱:</span><p>{selectedRowData.email}</p></div>
                                    </div>
                                </div>
                                <div className={styles.block}>
                                    <div className={styles.blockBody2}>
                                        <div><span>聯絡人電話:</span><p>{selectedRowData.telephone}</p></div>
                                        <div><span>聯絡人手機:</span><p>{selectedRowData.phone}</p></div>
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
                selectedRowData={selectedRowData}
                onSuccess={refreshAuthorizedRecords}
            />

            <AddModal
                isAddModalVisible={isAddModalVisible}
                setAddModalVisible={setAddModalVisible}
                onSuccess={refreshAuthorizedRecords}
            />


            <CModal
                backdrop="static"
                visible={isDeleteModalVisible}
                onClose={() => setDeleteModalVisible(false)}
                aria-labelledby="StaticBackdropExampleLabel3"
            >
                <CModalHeader>
                    <CModalTitle id="StaticBackdropExampleLabel3">
                        <b>提醒</b>
                    </CModalTitle>
                </CModalHeader>
                <CModalBody>確定要刪除該企業資料嗎?</CModalBody>
                <CModalFooter>
                    <CButton className="modalbutton1" onClick={() => setDeleteModalVisible(false)} >
                        取消
                    </CButton>
                    <CButton className="modalbutton2" onClick={() => deleteAndClose(selectedbusinessID)} >
                        確認
                    </CButton>
                </CModalFooter>
            </CModal>

        </main >

    );
}

export default Tabs;

