import React, { useRef } from 'react'
import { useState } from 'react';


import {
    CRow, CCol, CCard, CCardBody, CCardHeader, CFormSelect, CTab, CTabContent, CTabList, CTabPanel, CTabs, CForm, CFormLabel, CFormInput, CFormTextarea,
    CCardSubtitle, CCardText, CCardTitle, CButton,
    CTable, CTableBody, CTableCaption, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilDataTransferDown } from '@coreui/icons'

import '../../../../scss/碳盤查系統.css'
import { Link } from 'react-router-dom'


import 'primereact/resources/themes/saga-blue/theme.css';  // 主题样式
import 'primereact/resources/primereact.min.css';          // 核心 CSS
import 'primeicons/primeicons.css';                        // 图标样式

import styles from '../../../../scss/活動數據盤點.module.css'


const Tabs = () => {
    const [date, setDate] = useState(null);


    return (
        <main>
            <CTabs activeItemKey={1}>
                <CTabList variant="underline-border" className="system-tablist">
                    <Link to="/theme/system" className="system-tablist-link"><CTab aria-controls="tab1" itemKey={3} className="system-tablist-choose">
                        資訊填寫
                    </CTab></Link>
                    <Link to="/theme/system/邊界設定" className="system-tablist-link"><CTab aria-controls="tab2" itemKey={2} className="system-tablist-choose">
                        邊界設定
                    </CTab></Link>
                    <Link to="." className="system-tablist-link"><CTab aria-controls="tab3" itemKey={1} className="system-tablist-choose">
                        活動數據盤點
                    </CTab></Link>
                </CTabList>

            </CTabs>


            <div className="system-titlediv">
                <div>
                    <h4 className="system-title">活動數據盤點</h4>
                    <hr className="system-hr"></hr>
                </div>
                <button className="system-save">儲存</button>
            </div>

            <div className={styles.activityData}>
                <CCard className={styles.activityCard}>
                    5555

                </CCard>
                <CCard className={styles.activityNav}>
                    5555

                </CCard>
            </div>
        </main>
    );
}

export default Tabs;
