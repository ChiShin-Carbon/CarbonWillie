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
} from '@coreui/react';
import { MultiSelect } from 'primereact/multiselect';
import 'primereact/resources/themes/saga-blue/theme.css'; 
import 'primereact/resources/primereact.min.css'; 
import 'primeicons/primeicons.css'; 

const FormControl = () => {
  const [selectedCities, setSelectedCities] = useState(null);
  const [searchValue, setSearchValue] = useState(""); // 用於儲存搜尋的值
  const cities = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
  ];

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
            {/* 搜尋框 */}
            <CFormInput 
              type="search" 
              placeholder="Search" 
              aria-label="Search" 
              onChange={handleSearch} // 綁定搜尋事件
              style={{borderRadius: '25px'}}
            />
          </CCol>
          
          <CCol sm={3}>
            <CFormSelect aria-label="Default select example" style={{borderRadius: '25px'}}>{/**style={{height:'58px'}} */}
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
      {/* 其餘部分保持不變 */}
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardBody>
            <CForm>
              {/* 其他表單元素 */}
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
                  <CTableRow>
                    <CTableDataCell><CFormCheck id="flexCheckDefault" style={{borderColor:'black'}}/></CTableDataCell>
                    <CTableDataCell>公務車</CTableDataCell>
                    <CTableDataCell>燃料油-車用汽油</CTableDataCell>
                    <CTableDataCell>資訊部門</CTableDataCell>
                    <CTableDataCell>蔡xx</CTableDataCell>
                    <CTableDataCell>2024/10/5</CTableDataCell>
                    <CTableDataCell>//cilCheckCircle</CTableDataCell>
                    <CTableDataCell>已審核</CTableDataCell>
                    <CTableDataCell>未超時</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell><CFormCheck id="flexCheckDefault" style={{borderColor:'black'}}/></CTableDataCell>
                    <CTableDataCell>冷氣</CTableDataCell>
                    <CTableDataCell>冷媒</CTableDataCell>
                    <CTableDataCell>管理部門</CTableDataCell>
                    <CTableDataCell>陳xx</CTableDataCell>
                    <CTableDataCell>2024/9/30</CTableDataCell>
                    <CTableDataCell>//cilCheckCircle</CTableDataCell>
                    <CTableDataCell>待補件</CTableDataCell>
                    <CTableDataCell style={{color:'red'}}>已超時</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell><CFormCheck id="flexCheckDefault" style={{borderColor:'black'}}/></CTableDataCell>
                    <CTableDataCell colSpan={2}>Larry the Bird</CTableDataCell>
                    <CTableDataCell>@twitter</CTableDataCell>
                  </CTableRow>
                </CTableBody>
                <CTableHead>
                  <CTableRow>
                    <CTableDataCell><CFormCheck id="flexCheckDefault" style={{borderColor:'black'}}/></CTableDataCell>
                    <CTableDataCell>Footer</CTableDataCell>
                    <CTableDataCell>Footer</CTableDataCell>
                    <CTableDataCell>Footer</CTableDataCell>
                  </CTableRow>
                </CTableHead>
              </CTable>
              <div className="col-auto text-center">
                <CButton color="primary" type="submit" className="mb-3">
                  保存資料
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default FormControl;
