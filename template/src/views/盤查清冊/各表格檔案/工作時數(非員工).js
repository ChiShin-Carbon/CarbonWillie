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
import styles from '../../../scss/盤查清冊.module.css'

export const NonEmployee = () => {

    return (
        <div>
            <CTable bordered className={styles.table}>
                <CTableHead className={styles.tableHead}>
                    <tr>
                        <th>月份</th>
                        <th>人數</th>
                        <th>總工作時數</th>
                        <th>總工作人天</th>
                        <th>備註</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.tableBody}>
                    <tr>
                        <td>123</td>
                        <td>123</td>
                        <td>123</td>
                        <td>123</td>
                        <td>123</td>
                    </tr>
                </CTableBody>
            </CTable>

        </div>
    )
}
