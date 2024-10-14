import React, { useState } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CFormSelect,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormCheck,
  CInputGroup,
  CInputGroupText
} from '@coreui/react';
import 'primereact/resources/themes/saga-blue/theme.css'; 
import 'primereact/resources/primereact.min.css'; 
import 'primeicons/primeicons.css'; 

import '../../../scss/碳盤查系統.css'
import styles from '../../../scss/活動數據盤點.module.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faCircleXmark, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';

const FormControl = () => {
  const [selectedCities, setSelectedCities] = useState(null);
  const [searchValue, setSearchValue] = useState(""); // 用於儲存搜尋的值

  // 表格資料
  const tableData = [
    { item: '公務車', fuel: '燃料油-車用汽油', department: '資訊部門', person: '蔡xx', date: '2024/10/5', status:<FontAwesomeIcon icon={faCircleCheck} className={styles.iconCorrect} />, feedback: '已審核', overtime: '未超時' },
    { item: '冷氣', fuel: '冷媒', department: '管理部門', person: '陳xx', date: '2024/9/30', status: <FontAwesomeIcon icon={faCircleXmark} className={styles.iconWrong} />, feedback: '待補件', overtime: '已超時' },
    { item: '公務車', fuel: '燃料油-車用汽油', department: '健檢部門', person: '陳xx', date: '2024/9/1', status: <FontAwesomeIcon icon={faCircleCheck} className={styles.iconCorrect} />, feedback: '已審核', overtime: '未超時' },
    { item: '冷氣', fuel: '冷媒', department: '健檢部門', person: '詹xx', date: '2024/8/31', status: <FontAwesomeIcon icon={faCircleCheck} className={styles.iconCorrect} />, feedback: '已審核', overtime: '未超時' },
    { item: '公務車', fuel: '燃料油-車用汽油', department: '健檢部門', person: '鄭xx', date: '2024/9/3', status: <FontAwesomeIcon icon={faCircleXmark} className={styles.iconWrong} />, feedback: '尚未審核', overtime: '未超時' }
  ];

  // 過濾後的表格資料，排除 status 欄位的搜尋
  const filteredData = tableData.filter(row => 
    row.item.includes(searchValue) ||
    row.fuel.includes(searchValue) ||
    row.department.includes(searchValue) ||
    row.person.includes(searchValue) ||
    row.date.includes(searchValue) ||
    row.feedback.includes(searchValue) ||  
    row.overtime.includes(searchValue)     
  );

  // handleSearch 函數處理輸入變化
  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    console.log("Search Value:", e.target.value);
  };

  return (
    <CRow>
      <h4><strong>資料進度管理</strong></h4>
      <CCol xs={12}>
        <div className="d-flex align-items-center">
          <CCol sm={6}>
            {/* 搜尋框與圖標 */}
            <CInputGroup>
              <CInputGroupText style={{ borderRadius: '25px 0 0 25px', padding: '0.5rem' }}>
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
          
          <CCol sm={3}>
            <CFormSelect aria-label="Default select example" style={{borderRadius: '25px'}}>
              <option>資料回報狀態</option>
              <option value="1">已完成</option>
              <option value="2">未完成</option>
              <option value="3">編輯中</option>
            </CFormSelect>
          </CCol>
          
          <CCol sm={3}>
            <CFormSelect floatingLabel="是否超時" aria-label="Default select example" style={{borderRadius: '25px'}}> 
              <option>全部</option>
              <option value="1">是</option>
              <option value="2">否</option>
            </CFormSelect>
          </CCol>
        </div>
      </CCol>
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
                    <CTableHeaderCell scope="col">資料回饋狀態</CTableHeaderCell>
                    <CTableHeaderCell scope="col">是否超時</CTableHeaderCell>
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
                      <CTableDataCell>{row.overtime}</CTableDataCell>
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
