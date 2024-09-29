import React, { useRef } from 'react'
import { useState } from 'react';


import {
    CRow, CCol, CCard, CCardBody, CCardHeader, CFormSelect, CTab, CTabContent, CTabList, CTabPanel, CTabs, CForm, CFormLabel, CFormInput,CFormTextarea,
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

import { Calendar } from 'primereact/calendar';


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
                        活動數據分配
                    </CTab></Link>
                    <Link to="/theme/system/活動數據盤點" className="system-tablist-link"><CTab aria-controls="tab3" itemKey={4} className="system-tablist-choose">
                        活動數據盤點
                    </CTab></Link>
                </CTabList>

            </CTabs>


            <div className="system-titlediv">
                <div>
                    <h4 className="system-title">活動數據分配</h4>
                    <hr className="system-hr"></hr>
                </div>
                <button className="system-save">儲存</button>
            </div>
            <CCard className="mb-4 systemCard">
                <div className="systemCardBody">
                    <CForm>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="projectname" className="col-sm-2 col-form-label systemlabel" >使用者帳號</CFormLabel>
                            <CCol>
                                <CFormInput className="systeminput" type="text" id="projectname" />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="projectstart" className="col-sm-2 col-form-label systemlabel" >盤查期間(開始)</CFormLabel>
                            <CCol>
                                <CFormInput className="systeminput" type="date" id="projectstart" />
                            </CCol>

                            <CCol sm={1}></CCol>

                            <CFormLabel htmlFor="projectend" className="col-sm-2 col-form-label systemlabel" >盤查期間(結束)</CFormLabel>
                            <CCol>
                                <CFormInput className="systeminput" type="date" id="projectend" />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="projectexplain" className="col-sm-2 col-form-label systemlabel" >詳細說明</CFormLabel>
                            <CCol>
                                <CFormTextarea className="systeminput" type="text" id="projectexplain" rows={5} />
                            </CCol>
                        </CRow>

                    </CForm>
                </div>
            </CCard>

        </main>
    );
}

export default Tabs;
