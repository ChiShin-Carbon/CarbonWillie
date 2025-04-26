
import React, { useState } from 'react'
import {
    CRow, CCol, CCard, CFormSelect, CTab, CTabList, CTabs,
    CTable, CTableBody, CTableHead, CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CButton, CFormCheck
    , CForm, CFormLabel, CFormInput, CFormTextarea,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilDataTransferDown } from '@coreui/icons'

import '../../../scss/碳盤查系統.css'
import styles from '../../../scss/顧問system.module.css'

import { Link } from 'react-router-dom'


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faCircleXmark, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';



export const UpNav = () => {

    const [visible, setVisible] = useState(false)
    return (
        <main>
            <CTabs activeItemKey={1}>
                <CTabList variant="underline-border" className="system-tablist">
                    <div className={styles.tabsContainer}>
                        <div className={styles.tabsLeft}>
                            <Link to="/碳盤查系統/顧問system/排放源鑑別" className="system-tablist-link">
                                <CTab aria-controls="tab1" itemKey={2} className="system-tablist-choose">排放源鑑別</CTab>
                            </Link>
                            <Link to="/碳盤查系統/顧問system/活動數據" className="system-tablist-link">
                                <CTab aria-controls="tab3" itemKey={3} className="system-tablist-choose">活動數據</CTab>
                            </Link>
                            <Link to="/碳盤查系統/顧問system/定量盤查" className="system-tablist-link">
                                <CTab aria-controls="tab3" itemKey={4} className="system-tablist-choose">定量盤查</CTab>
                            </Link>
                            <Link to="/碳盤查系統/顧問system/數據品質管理" className="system-tablist-link">
                                <CTab aria-controls="tab3" itemKey={5} className="system-tablist-choose">數據品質管理</CTab>
                            </Link>
                            <Link to="/碳盤查系統/顧問system/不確定性量化評估" className="system-tablist-link">
                                <CTab aria-controls="tab3" itemKey={6} className="system-tablist-choose">不確定性量化評估</CTab>
                            </Link>
                            {/* <Link to="." className="system-tablist-link">
                    <CTab aria-controls="tab3" itemKey={1} className="system-tablist-choose">全廠電力蒸汽供需情況 </CTab>
                </Link> */}
                        </div>

                        <div className={styles.tabsRight}>
                            <button className={styles.tabsDone} onClick={() => setVisible(!visible)}>
                                完成盤查</button>
                        </div>
                    </div>
                </CTabList>

            </CTabs>

            <CModal
                visible={visible}
                onClose={() => setVisible(false)}
                aria-labelledby="LiveDemoExampleLabel"
            >
                <CModalHeader>
                    <CModalTitle id="LiveDemoExampleLabel"><b>注意!</b></CModalTitle>
                </CModalHeader>
                <CModalBody>確認將完成本年度的盤查嗎?</CModalBody>
                <CModalFooter>
                    <CButton className="modalbutton1" onClick={() => setVisible(false)}>
                        取消
                    </CButton>
                    <CButton className="modalbutton2">完成</CButton>
                </CModalFooter>
            </CModal>

        </main>


    );
}
export default UpNav;

