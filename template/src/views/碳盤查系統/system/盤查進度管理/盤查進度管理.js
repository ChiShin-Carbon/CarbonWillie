import React, { useState } from 'react';
import {
    CCard,
    CCardBody,
    CCol,
    CForm,
    CFormInput,
    CRow,
    CFormSelect,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CFormCheck,
    CInputGroup,
    CInputGroupText,
    CTabs, CTabList, CTab,
    CButton
} from '@coreui/react';
import { Link } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import '../../../../scss/盤查進度管理.css'
import '../../../../scss/碳盤查系統.css'
import styles from '../../../../scss/活動數據盤點.module.css'

import { cilCheckAlt, cilPencil, cilX } from '@coreui/icons';

const Tabs = () => {
    const [searchInput, setSearchInput] = useState(''); // 存放輸入框的臨時搜尋值
    const [searchValue, setSearchValue] = useState(''); // 觸發搜尋的值
    const [selectedFeedback, setSelectedFeedback] = useState('');

    // 表格資料
    const tableData = [
        { item: '公務車', fuel: '燃料油-車用汽油', department: '資訊部門', person: '蔡xx', date: '2024/10/5', status: <div className="check_icon"><CIcon icon={cilCheckAlt} className="check" /></div>, feedback: '已審核' },
        { item: '冷氣', fuel: '冷媒', department: '管理部門', person: '陳xx', date: '2024/9/30', status: <div className="x_icon"><CIcon icon={cilX} className="x" /></div>, feedback: '待補件' },
        { item: '公務車', fuel: '燃料油-車用汽油', department: '健檢部門', person: '陳xx', date: '2024/9/1', status: <div className="check_icon"><CIcon icon={cilCheckAlt} className="check" /></div>, feedback: '已審核' },
        { item: '冷氣', fuel: '冷媒', department: '健檢部門', person: '詹xx', date: '2024/8/31', status: <div className="check_icon"><CIcon icon={cilCheckAlt} className="check" /></div>, feedback: '已審核' },
        { item: '公務車', fuel: '燃料油-車用汽油', department: '健檢部門', person: '鄭xx', date: '2024/9/3', status: <div className="edit_icon"><CIcon icon={cilPencil} className="edit" /></div>, feedback: '尚未審核' }
    ];

    // 過濾後的表格資料，排除 status 欄位的搜尋
    const filteredData = tableData.filter(row =>
        (row.item.includes(searchValue) ||
            row.fuel.includes(searchValue) ||
            row.department.includes(searchValue) ||
            row.person.includes(searchValue) ||
            row.date.includes(searchValue) ||
            row.feedback.includes(searchValue)) &&
        (selectedFeedback === '' || row.feedback === selectedFeedback)  // 新增的篩選條件，資料回報狀態
    );

    // handleSearchInput 處理輸入框變化
    const handleSearchInput = (e) => {
        setSearchInput(e.target.value); // 更新輸入框的值
    };

    // handleSearch 按下按鈕時觸發
    const handleSearch = () => {
        setSearchValue(searchInput); // 將輸入框的值更新到 searchValue
    };
    // handleSearch 函數處理輸入變化
    /*
        const handleSearch = (e) => {
        setSearchValue(e.target.value);
        console.log("Search Value:", e.target.value);
        };
    */

    // 監聽鍵盤事件以判斷是否按下 Enter 鍵
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // 防止表單默認提交行為
            handleSearch(); // 呼叫搜尋函數
        }
    };

    // handleFeedbackChange 函數處理下拉選單變化
    const handleFeedbackChange = (e) => {
        setSelectedFeedback(e.target.value);
        //console.log("Selected Feedback:", e.target.value);
    };

    return (
        <CRow>
            <CTabs activeItemKey={1}>
                <CTabList variant="underline-border" className="system-tablist">
                    <div className={styles.tabsContainer}>
                        <div className={styles.tabsLeft}>
                            <Link to="/碳盤查系統/system" className="system-tablist-link"><CTab aria-controls="tab1" itemKey={3} className="system-tablist-choose">
                                基準年&邊界設定
                            </CTab></Link>
                            <Link to="/碳盤查系統/system/活動數據分配" className="system-tablist-link"><CTab aria-controls="tab3" itemKey={4} className="system-tablist-choose">
                                活動數據分配
                            </CTab></Link>
                            <Link to="." className="system-tablist-link"><CTab aria-controls="tab3" itemKey={2} className="system-tablist-choose">
                                活動數據盤點
                            </CTab></Link>
                        </div>
                        <div className={styles.tabsRight}>
                            <Link to="." className="system-tablist-link"><CTab aria-controls="tab3" itemKey={1} className="system-tablist-choose">
                                盤查進度管理
                            </CTab></Link>
                        </div>
                    </div>
                </CTabList>
            </CTabs>

            <div className="system-titlediv">
                <div>
                    <h4 className="system-title">盤查進度管理</h4>
                    <hr className="system-hr"></hr>
                </div>
            </div>
            <CCol xs={12}>
                <div className="d-flex align-items-center">
                    <CCol sm={8}>
                        {/* 搜尋框與圖標 */}
                        <CInputGroup>
                            <CInputGroupText style={{ borderRadius: '25px 0 0 25px', padding: '0.5rem', backgroundColor: 'white' }}>
                                <i className="pi pi-search" />
                            </CInputGroupText>
                            <CFormInput
                                type="search"
                                placeholder="Search"
                                aria-label="Search"
                                //onChange={handleSearch} // 綁定搜尋事件
                                onChange={handleSearchInput} // 綁定輸入框的臨時搜尋事件
                                onKeyDown={handleKeyDown} // 監聽 Enter 鍵
                            />
                            <CButton
                                type="button"
                                color="secondary"
                                variant="outline"
                                onClick={handleSearch} // 按下按鈕後執行搜尋
                                style={{ borderRadius: '0 25px 25px 0' }}
                            >
                                <i className="pi pi-search" />
                            </CButton>
                        </CInputGroup>
                    </CCol>
                    <CCol sm={1}></CCol>
                    <CCol sm={3}>
                        <CFormSelect
                            aria-label="Default select example"
                            style={{ borderRadius: '25px' }}
                            onChange={handleFeedbackChange}  // 綁定資料回報狀態選擇事件
                        >
                            <option value="">資料回報狀態</option>
                            <option value="已審核">已審核</option>
                            <option value="待補件">待補件</option>
                            <option value="尚未審核">尚未審核</option>
                        </CFormSelect>
                    </CCol>
                </div>
            </CCol>
            <CRow><br /></CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardBody>
                        <CForm>
                            <CTable>
                                <CTableHead color="light">
                                    <CTableRow>
                                        <CTableHeaderCell scope="col">勾選</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">項目</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">排放源</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">填寫單位</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">負責人</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">資料蒐集完成日</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">狀態</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">資料回報狀態</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {filteredData.length > 0 ? filteredData.map((row, index) => (
                                        <CTableRow key={index}>
                                            <CTableDataCell><CFormCheck style={{ borderColor: 'black' }} /></CTableDataCell>
                                            <CTableDataCell>{row.item}</CTableDataCell>
                                            <CTableDataCell>{row.fuel}</CTableDataCell>
                                            <CTableDataCell>{row.department}</CTableDataCell>
                                            <CTableDataCell>{row.person}</CTableDataCell>
                                            <CTableDataCell>{row.date}</CTableDataCell>
                                            <CTableDataCell>{row.status}</CTableDataCell>
                                            <CTableDataCell>{row.feedback}</CTableDataCell>
                                        </CTableRow>
                                    )) : (
                                        <CTableRow>
                                            <CTableDataCell colSpan="9" className="text-center">沒有找到符合條件的資料</CTableDataCell>
                                        </CTableRow>
                                    )}
                                {/** ))} */}
                                </CTableBody>
                            </CTable>
                            <div style={{textAlign:'center'}}><button className={styles.complete}>盤點完成</button></div>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default Tabs;
