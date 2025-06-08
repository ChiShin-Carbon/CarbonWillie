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

import { ElectricityUsage } from './各表格檔案/電力使用量.js';

export const ClassTwo = ({ year }) => {

    return (
        <div>
            <div className={styles.classNav}>
                <div className={`${styles.classNavItem} ${styles.itemChoose}`}>
                    電力使用量
                </div>
            </div>
            <div>
                <ElectricityUsage year={year}/>
            </div>
        </div>
    )
}
