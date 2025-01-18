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

export const Division= () => {

    return (
        <div>
            <CTable bordered className={styles.table}>
                <CTableHead className={styles.tableHead}>
                    <tr>
                        <th>表單名稱</th>
                        <th>部門</th>
                        <th>姓名(主要填寫人) </th>
                        <th>電子郵件</th>
                        <th>電話及分機號碼</th>
                        <th>平台帳號</th>
                        <th>平台密碼</th>
                        <th>平台權限</th>
                        <th>備註</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.tableBody}>
                    <tr>
                        <td>類別一-公務車</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </CTableBody>
            </CTable>

        </div>
    )
}
