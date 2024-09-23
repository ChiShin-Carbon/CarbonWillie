import React, { useRef } from 'react'
import {
    CRow, CCol, CCard, CCardBody, CCardHeader, CFormSelect, CTab, CTabContent, CTabList, CTabPanel, CTabs, CForm, CFormLabel, CFormInput,
    CCardSubtitle, CCardText, CCardTitle, CButton,
    CTable, CTableBody, CTableCaption, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilDataTransferDown } from '@coreui/icons'

import '../../../scss/碳盤查系統.css'

const Tabs = () => {
    // 定義 useRef 來取得每個 section 的 DOM 節點
    const section1Ref = useRef(null);
    const section2Ref = useRef(null);
    const section3Ref = useRef(null);

    // 定義一個函數，用來滾動到指定的 section
    const scrollToSection = (ref) => {
        ref.current.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <main>
            <div className="system-tablist">
                <div className="system-tablist-item">
                    <a className="system-tablist-a" onClick={() => scrollToSection(section1Ref)}>表格呈現</a>
                </div>
                <div className="system-tablist-item">
                    <a href="#">表格呈現</a>
                </div>
            </div>

            <CCard className="mb-4 customCard">
                <div className="customCardBody">
                    <h1>React 書籤範例</h1>

                    {/* 替換 href 書籤為 onClick 滾動功能 */}
                    <p>
                        <button >跳轉到 Section 1</button>
                    </p>
                    <p>
                        <button onClick={() => scrollToSection(section2Ref)}>跳轉到 Section 2</button>
                    </p>
                    <p>
                        <button onClick={() => scrollToSection(section3Ref)}>跳轉到 Section 3</button>
                    </p>

                    {/* 插入一些空白來展示滾動效果 */}
                    <div style={{ height: '800px' }}></div>

                    {/* 使用 ref 來標記每個 section 的 DOM 節點 */}
                    <div ref={section1Ref}>
                        <h2>Section 1</h2>
                        <p>這是 Section 1 的內容。</p>
                    </div>

                    <div style={{ height: '800px' }}></div>

                    <div ref={section2Ref}>
                        <h2>Section 2</h2>
                        <p>這是 Section 2 的內容。</p>
                    </div>

                    <div style={{ height: '800px' }}></div>

                    <div ref={section3Ref}>
                        <h2>Section 3</h2>
                        <p>這是 Section 3 的內容。</p>
                    </div>
                </div>
            </CCard>
        </main>
    );
}

export default Tabs;
