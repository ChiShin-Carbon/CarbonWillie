import React, { useState, useEffect } from 'react'
import {
    CTable,
    CTableHead,
    CTableBody,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CForm,
    CButton,
    CFormLabel,
    CFormInput,
    CFormTextarea,
    CRow,
    CCol,
    CCollapse,
    CCard,
    CCardBody,
} from '@coreui/react'
import styles from '../../scss/盤查清冊.module.css'

import { Commuting } from './各表格檔案/員工通勤.js';
import { BusinessTrip } from './各表格檔案/商務旅行.js';
import { OperationalWaste } from './各表格檔案/營運產生廢棄物.js';
import { SellingWaste } from './各表格檔案/銷售產品的廢棄物.js';


export const ClassThree = () => {
    const [activeTab, setActiveTab] = useState('tab1') // 記錄當前活動的分頁

    return (
        <div>
            <div className={styles.classNav}>
                <div active={activeTab === 'tab1'}
                    onClick={() => setActiveTab('tab1')}
                    className={`${styles.classNavItem} ${activeTab === 'tab1' ? styles.itemChoose : styles.itemNoChoose}`}
                >
                    員工通勤
                </div>
                <div active={activeTab === 'tab2'}
                    onClick={() => setActiveTab('tab2')}
                    className={`${styles.classNavItem} ${activeTab === 'tab2' ? styles.itemChoose : styles.itemNoChoose}`}
                >
                    商務旅行
                </div>
                <div active={activeTab === 'tab3'}
                    onClick={() => setActiveTab('tab3')}
                    className={`${styles.classNavItem} ${activeTab === 'tab3' ? styles.itemChoose : styles.itemNoChoose}`}
                >
                    營運產生廢棄物
                </div>
                <div active={activeTab === 'tab4'}
                    onClick={() => setActiveTab('tab4')}
                    className={`${styles.classNavItem} ${activeTab === 'tab4' ? styles.itemChoose : styles.itemNoChoose}`}
                >
                    銷售產品的廢棄物
                </div>
                
            </div>

            <div>
                {activeTab === 'tab1' && (
                    <>
                        <Commuting/>
                    </>
                )}
                {activeTab === 'tab2' && (
                    <>
                        <BusinessTrip />
                    </>
                )}

                {activeTab === 'tab3' && (
                    <>
                        <OperationalWaste />
                    </>
                )}
                {activeTab === 'tab4' && (
                    <>
                        <SellingWaste />
                    </>
                )}
            </div>


        </div>
    )
}
