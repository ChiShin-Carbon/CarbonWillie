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
} from '@coreui/react';
import CIcon from '@coreui/icons-react'
import '../../../scss/盤查進度管理.css'

import { cilCheckAlt, cilPencil, cilX } from '@coreui/icons';

const FormControl = () => {
  const [searchValue, setSearchValue] = useState(""); // 用於儲存搜尋的值
  const [selectedFeedback, setSelectedFeedback] = useState(''); // 新增的state，用來儲存選擇的資料回報狀態

  // 表格資料
  const tableData = [
    { item: '公務車', fuel: '燃料油-車用汽油', department: '資訊部門', person: '蔡xx', date: '2024/10/5', status:<div className="check_icon"><CIcon icon={cilCheckAlt} className="check"/></div>, feedback: '已審核' },
    { item: '冷氣', fuel: '冷媒', department: '管理部門', person: '陳xx', date: '2024/9/30', status: <div className="x_icon"><CIcon icon={cilX} className="x"/></div>, feedback: '待補件' },
    { item: '公務車', fuel: '燃料油-車用汽油', department: '健檢部門', person: '陳xx', date: '2024/9/1', status: <div className="check_icon"><CIcon icon={cilCheckAlt} className="check"/></div>, feedback: '已審核' },
    { item: '冷氣', fuel: '冷媒', department: '健檢部門', person: '詹xx', date: '2024/8/31', status: <div className="check_icon"><CIcon icon={cilCheckAlt} className="check"/></div>, feedback: '已審核' },
    { item: '公務車', fuel: '燃料油-車用汽油', department: '健檢部門', person: '鄭xx', date: '2024/9/3', status: <div className="edit_icon"><CIcon icon={cilPencil} className="edit"/></div>, feedback: '尚未審核' }
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

  // handleSearch 函數處理輸入變化
  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    console.log("Search Value:", e.target.value);
  };

  // handleFeedbackChange 函數處理下拉選單變化
  const handleFeedbackChange = (e) => {
    setSelectedFeedback(e.target.value);
    console.log("Selected Feedback:", e.target.value);
  };

  return (
    <CRow>
      <h4><strong>資料進度管理</strong></h4>
      <CCol xs={12}>
        <div className="d-flex align-items-center">
          <CCol sm={8}>
            {/* 搜尋框與圖標 */}
            <CInputGroup>
              <CInputGroupText style={{ borderRadius: '25px 0 0 25px', padding: '0.5rem',backgroundColor:'white' }}>
                <i className="pi pi-search" />
              </CInputGroupText>
              <CFormInput 
                type="search" 
                placeholder="Search" 
                aria-label="Search" 
                onChange={handleSearch} // 綁定搜尋事件
                style={{borderRadius: '0 25px 25px 0'}} // 這裡調整邊角的樣式
              />
            </CInputGroup>
          </CCol>
          <CCol sm={1}></CCol>
          <CCol sm={3}>
            <CFormSelect 
              aria-label="Default select example" 
              style={{borderRadius: '25px'}} 
              onChange={handleFeedbackChange}  // 綁定資料回報狀態選擇事件
            >
              <option value="">資料回報狀態</option>  {/* 預設選項 */}
              <option value="已審核">已審核</option>
              <option value="待補件">待補件</option>
              <option value="尚未審核">尚未審核</option>
            </CFormSelect>
          </CCol>
        </div>
      </CCol>
      <CRow><br/></CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardBody>
            <CForm>
              <CTable>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell scope="col">勾選</CTableHeaderCell>
                    <CTableHeaderCell scope="col">項目</CTableHeaderCell>
                    <CTableHeaderCell scope="col">排放遷</CTableHeaderCell>
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
                      <CTableDataCell><CFormCheck id={`flexCheckDefault-${index}`} style={{borderColor:'black'}}/></CTableDataCell>
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
                </CTableBody>
              </CTable>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default FormControl;
