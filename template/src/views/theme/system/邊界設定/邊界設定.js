import React, { useState } from 'react'
import {
    CRow, CCol, CCard, CFormSelect, CTab, CTabList, CTabs,
    CTable, CTableBody, CTableHead, CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CButton, CFormCheck
    , CForm, CFormLabel, CFormInput, CFormTextarea,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilDataTransferDown } from '@coreui/icons'

import '../../../../scss/碳盤查系統.css'
import { Link } from 'react-router-dom'


const Tabs = () => {
    // 定義 useState 來控制 Modal 的顯示
    const [visible, setVisible] = useState(false);

    return (
        <main>
            <CTabs activeItemKey={1}>
                <CTabList variant="underline-border" className="system-tablist">
                    <Link to="/theme/system" className="system-tablist-link"><CTab aria-controls="tab1" itemKey={3} className="system-tablist-choose">
                        資訊填寫
                    </CTab></Link>
                    <Link to="." className="system-tablist-link"><CTab aria-controls="tab2" itemKey={1} className="system-tablist-choose">
                        邊界設定
                    </CTab></Link>
                    <Link to="/theme/system/活動數據盤點" className="system-tablist-link"><CTab aria-controls="tab3" itemKey={2} className="system-tablist-choose">
                        活動數據盤點
                    </CTab></Link>
                </CTabList>
            </CTabs>

            <div className="system-titlediv">
                <div>
                    <h4 className="system-title">邊界設定</h4>
                    <hr className="system-hr"></hr>
                </div>
                <button className="system-save">儲存</button>
            </div>
            <CCard className="mb-4 systemCard">
                <div className="systemCardBody">
                    <CRow className="mb-3">
                        <CCol>
                            <CFormSelect className="select">
                                <option value="1">營運控制法</option>
                                <option value="2">所有權法</option>
                                <option value="3" disabled>財務控制法</option>
                            </CFormSelect>
                        </CCol>

                        <CCol style={{ textAlign: 'right' }}>
                            <button className="bt1" disabled>刪除地點</button>
                            <button className="bt2" onClick={() => setVisible(!visible)}>新增地點</button>
                        </CCol>
                    </CRow>

                    <CTable hover className="systemTable">
                        <CTableHead >
                            <tr>
                                <th style={{width:'5%'}}>#</th>
                                <th style={{width:'20%'}}>場域名稱</th>
                                <th style={{width:'45%'}}>場域地址</th>
                                <th style={{width:'30%'}}>備註</th>
                            </tr>
                        </CTableHead>
                        <CTableBody>
                            <tr>
                                <td><CFormCheck id="flexCheckDefault" /></td>
                                <td>XXX大樓5F</td>
                                <td>10491台北市中山區建國北路三段42號4樓</td>
                                <td>讚</td>
                            </tr>
                            <tr>
                                <td><CFormCheck id="flexCheckDefault" /></td>
                                <td>XXX大樓5F</td>
                                <td>10491台北市中山區建國北路三段42號4樓</td>
                                <td>讚</td>
                            </tr>
                        </CTableBody>
                    </CTable>
                </div>
            </CCard>



            <CModal
                backdrop="static"
                visible={visible}
                onClose={() => setVisible(false)}
                aria-labelledby="StaticBackdropExampleLabel"
            >
                <CModalHeader>
                    <CModalTitle id="StaticBackdropExampleLabel"><b>新增地點</b></CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CFormLabel htmlFor="sitename" className="col-sm-2 col-form-label systemlabel" >場域名稱</CFormLabel>
                        <CFormInput className="systeminput" type="text" id="sitename" />

                        <CFormLabel htmlFor="site" className="col-sm-2 col-form-label systemlabel" >場域地址</CFormLabel>
                        <CFormInput className="systeminput" type="text" id="site" />

                        <CFormLabel htmlFor="siteexplain" className="col-sm-2 col-form-label systemlabel" >備註</CFormLabel>
                        <CFormTextarea className="systeminput" type="text" id="siteexplain" rows={3} />

                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton className="modalbutton1" onClick={() => setVisible(false)}>
                        取消
                    </CButton>
                    <CButton className="modalbutton2">新增</CButton>
                </CModalFooter>
            </CModal>
        </main>

    );
}

export default Tabs;

