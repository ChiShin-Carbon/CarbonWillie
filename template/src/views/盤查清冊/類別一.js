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

import { Vehicle } from './各表格檔案/公務車.js';
import { FireExtinguisher } from './各表格檔案/滅火器.js';
import { Employee } from './各表格檔案/工作時數(員工).js';
import { NonEmployee } from './各表格檔案/工作時數(非員工).js';
import { Refrigerant } from './各表格檔案/冷媒.js';
import { Machinery } from './各表格檔案/廠內機具.js';
import { EmergencyGenerator } from './各表格檔案/緊急發電機.js';

export const ClassOne = ({ year }) => {
    const [activeTab, setActiveTab] = useState('tab1') // 記錄當前活動的分頁

    return (
        <div>
            <div className={styles.classNav}>
                <div active={activeTab === 'tab1'}
                    onClick={() => setActiveTab('tab1')}
                    className={`${styles.classNavItem} ${activeTab === 'tab1' ? styles.itemChoose : styles.itemNoChoose}`}
                >
                    公務車
                </div>
                <div active={activeTab === 'tab2'}
                    onClick={() => setActiveTab('tab2')}
                    className={`${styles.classNavItem} ${activeTab === 'tab2' ? styles.itemChoose : styles.itemNoChoose}`}
                >
                    滅火器
                </div>
                <div active={activeTab === 'tab3'}
                    onClick={() => setActiveTab('tab3')}
                    className={`${styles.classNavItem} ${activeTab === 'tab3' ? styles.itemChoose : styles.itemNoChoose}`}
                >
                    工作時數(員工)
                </div>
                <div active={activeTab === 'tab4'}
                    onClick={() => setActiveTab('tab4')}
                    className={`${styles.classNavItem} ${activeTab === 'tab4' ? styles.itemChoose : styles.itemNoChoose}`}
                >
                    工作時數(非員工)
                </div>
                <div active={activeTab === 'tab5'}
                    onClick={() => setActiveTab('tab5')}
                    className={`${styles.classNavItem} ${activeTab === 'tab5' ? styles.itemChoose : styles.itemNoChoose}`}
                >
                    冷媒
                </div>
                <div active={activeTab === 'tab6'}
                    onClick={() => setActiveTab('tab6')}
                    className={`${styles.classNavItem} ${activeTab === 'tab6' ? styles.itemChoose : styles.itemNoChoose}`}
                >
                    廠內機具
                </div>
                <div active={activeTab === 'tab7'}
                    onClick={() => setActiveTab('tab7')}
                    className={`${styles.classNavItem} ${activeTab === 'tab7' ? styles.itemChoose : styles.itemNoChoose}`}
                >
                    緊急發電機
                </div>
            </div>

            <div>
                {activeTab === 'tab1' && (
                    <>
                        <Vehicle year={year} />
                    </>
                )}
                {activeTab === 'tab2' && (
                    <>
                        <FireExtinguisher year={year} />
                    </>
                )}

                {activeTab === 'tab3' && (
                    <>
                        <Employee year={year} />
                    </>
                )}
                {activeTab === 'tab4' && (
                    <>
                        <NonEmployee year={year} />
                    </>
                )}
                {activeTab === 'tab5' && (
                    <>
                        <Refrigerant year={year} />
                    </>
                )}
                {activeTab === 'tab6' && (
                    <>
                        <Machinery year={year} />
                    </>
                )}
                {activeTab === 'tab7' && (
                    <>
                        <EmergencyGenerator year={year} />
                    </>
                )}
            </div>


        </div>
    )
}