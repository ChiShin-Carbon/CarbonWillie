import React, { useRef } from 'react'
import {
    CRow, CCol, CCard, CCardBody, CCardHeader, CFormSelect, CTab, CTabContent, CTabList, CTabPanel, CTabs, CForm, CFormLabel, CFormInput,
    CCardSubtitle, CCardText, CCardTitle, CButton,
    CTable, CTableBody, CTableCaption, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilDataTransferDown } from '@coreui/icons'

import '../../../../scss/碳盤查系統.css'
import { Link } from 'react-router-dom'

const Tabs = () => {
    // 定義 useRef 來取得每個 section 的 DOM 節點


    return (
        <main>
            <CTabs activeItemKey={1}>
                <CTabList variant="underline-border" className="system-tablist">
                    <Link to="/theme/system" className="system-tablist-link"><CTab aria-controls="tab1" itemKey={2} className="system-tablist-choose">
                        資訊填寫
                    </CTab></Link>
                    <Link to="./邊界設定" className="system-tablist-link"><CTab aria-controls="tab2" itemKey={1} className="system-tablist-choose">
                        邊界設定
                    </CTab></Link>
                    <Link to="." className="system-tablist-link"><CTab aria-controls="tab3" itemKey={3} className="system-tablist-choose">
                        個人資料
                    </CTab></Link>
                </CTabList>

            </CTabs>

            <div>
                <div>
                    <h3>邊界設定</h3>
                </div>
                <CCard className="mb-4 systemCard">
                    <div className="systemCardBody">
                        <h1>React 書籤範例</h1>


                    </div>
                </CCard>
            </div>
        </main>
    );
}

export default Tabs;
