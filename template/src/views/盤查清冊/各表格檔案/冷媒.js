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

export const Refrigerant = () => {

    return (
        <div>
            <CTable bordered className={styles.table}>
                <CTableHead className={styles.tableHead}>
                    <tr>
                        <th>設備類型</th>
                        <th>設備位置</th>
                        <th>冷媒類型</th>
                        <th>填充量單位</th>
                        <th>填充量</th>
                        <th>數量</th>
                        <th>逸散率(%)</th>
                        <th>備註</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.tableBody}>
                    <tr>
                            <td colSpan="8" style={{ textAlign: 'center' }}>此年份無冷媒資料</td>
                        </tr>
                </CTableBody>
            </CTable>

        </div>
    )
}
