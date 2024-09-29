// functions.js
import React from 'react';
import {
    CRow, CCol, CCard, CFormSelect, CTab, CTabList, CTabs,
    CTable, CTableBody, CTableHead, CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CButton, CFormCheck
    , CForm, CFormLabel, CFormInput, CFormTextarea,
} from '@coreui/react'



import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';

import styles from '../../../../scss/活動數據盤點.module.css'

export const FunctionOne = () => (
    <CTable hover className={styles.activityTable1}>
        <CTableHead className={styles.activityTableHead}>
            <tr>
                <th >發票/收據日期<br /></th>
                <th >發票號碼/收據編號</th>
                <th >單位</th>
                <th >公升數/金額</th>
                <th >備註</th>
                <th >圖片</th>
                <th >操作</th>
            </tr>
        </CTableHead>
        <CTableBody className={styles.activityTableBody}>
            <tr>
                <td>2023/01/15</td>
                <td>XXXXX</td>
                <td>公升</td>
                <td>XXXXXX</td>
                <td>讚</td>
                <td><img src="https://i.pinimg.com/564x/2a/4c/cb/2a4ccb65cc3cc47bbccca96dd230bd22.jpg"></img></td>
                <td><FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} />
                    <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} /></td>
            </tr>

        </CTableBody>
    </CTable>
);

export const FunctionTwo = () => (
    <CTable hover className={styles.activityTable1}>
        <CTableHead className={styles.activityTableHead}>
            <tr>
                <th >發票/收據日期<br /></th>
                <th >發票號碼/收據編號</th>
                <th >單位</th>
                <th >公升數/金額</th>
                <th >備註</th>
                <th >圖片</th>
                <th >操作</th>
            </tr>
        </CTableHead>
        <CTableBody className={styles.activityTableBody}>
            <tr>
                <td>2023/01/15</td>
                <td>XXXXX</td>
                <td>公升</td>
                <td>XXXXXX</td>
                <td>讚</td>
                <td><img src="https://i.pinimg.com/564x/2a/4c/cb/2a4ccb65cc3cc47bbccca96dd230bd22.jpg"></img></td>
                <td><FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} />
                    <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} /></td>
            </tr>

        </CTableBody>
    </CTable>
);

export const FunctionThree = () => (
    <div>
        <h2>這是功能三的內容</h2>
        <p>功能三的描述...</p>
    </div>
);

export const FunctionFour = () => (
    <div>
        <h2>這是功能4的內容</h2>
    </div>
);
export const FunctionFive = () => (
    <div>
        <h2>這是功能5的內容</h2>
    </div>
);
export const FunctionSix = () => (
    <div>
        <h2>這是功能6的內容</h2>
    </div>
);
export const FunctionSeven = () => (
    <div>
        <h2>這是功能7的內容</h2>
    </div>
);
export const FunctionEight = () => (
    <div>
        <h2>這是功能8的內容</h2>
    </div>
);
export const FunctionNine = () => (
    <div>
        <h2>這是功能9的內容</h2>
    </div>
);
export const FunctionTen = () => (
    <div>
        <h2>這是功能10的內容</h2>
    </div>
);
export const FunctionEleven = () => (
    <div>
        <h2>這是功能11的內容</h2>
    </div>
);

export const FunctionTwelve = () => (
    <div>
        <h2>這是功能12的內容</h2>
    </div>
);

export const FunctionThirteen = () => (
    <div>
        <h2>這是功能13的內容</h2>
    </div>
);
export const FunctionForteen = () => (
    <div>
        <h2>這是功能14的內容</h2>
    </div>
);
export const FunctionFifteen = () => (
    <div>
        <h2>這是功能15的內容</h2>
    </div>
);
export const FunctionSixteen = () => (
    <div>
        <h2>這是功能16的內容</h2>
    </div>
);
export const FunctionSeventeen = () => (
    <div>
        <h2>這是功能17的內容</h2>
    </div>
);
