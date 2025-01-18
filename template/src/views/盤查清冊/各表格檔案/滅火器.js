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

export const FireExtinguisher = () => {

    return (
        <div>
            <CTable bordered className={styles.table}>
                <CTableHead className={styles.tableHead}>
                    <tr>
                        <th>品名</th>
                        <th>成分</th>
                        <th>規格(重量)</th>
                        <th>單位</th>
                        <th>使用量(支)</th>
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
                        <td>123</td>
                    </tr>
                </CTableBody>
            </CTable>

        </div>
    )
}
