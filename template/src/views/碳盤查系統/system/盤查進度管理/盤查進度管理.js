import React, { useState, useEffect } from 'react'
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
  CTabs,
  CTabList,
  CTab,
  CButton,
  CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle
} from '@coreui/react'
import { Link } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import '../../../../scss/盤查進度管理.css'
import '../../../../scss/碳盤查系統.css'
import styles from '../../../../scss/活動數據盤點.module.css'

import { cilCheckAlt, cilX } from '@coreui/icons'

const Tabs = () => {
  const [visible, setVisible] = useState(false)
  const [checkedItems, setCheckedItems] = useState([]); // 存放已勾選的項目

  const [searchInput, setSearchInput] = useState('') // 存放輸入框的臨時搜尋值
  const [searchValue, setSearchValue] = useState('') // 觸發搜尋的值
  const [selectedFeedback, setSelectedFeedback] = useState('') // 資料回報狀態
  const [tableData, setTableData] = useState([]) // 新增狀態來存放從後端獲取的資料

  const formatDate = (isoDate) => {
    if (!isoDate) {
      return ''; // 如果 isoDate 为 null 或 undefined，则返回空字符串
    }
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要+1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  };

  // 呼叫 API 獲取資料
  const getAuthorizedRecords = async () => {
    try {
      const response = await fetch('http://localhost:8000/authorizedTable', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      setTableData(data) // 設置表格資料
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  // 使用 useEffect 在組件加載時呼叫 API
  useEffect(() => {
    getAuthorizedRecords()
  }, [])

  // 定義部門轉換函數
  const getDepartmentName = (departmentID) => {
    switch (departmentID) {
      case 1:
        return '管理部門'
      case 2:
        return '資訊部門'
      case 3:
        return '業務部門'
      case 4:
        return '門診部門'
      case 5:
        return '健檢部門'
      case 6:
        return '檢驗部門'
      default:
        return '其他'
    }
  }

  // 定義審核轉換函數
  const getReview = (reviewID) => {
    switch (reviewID) {
      case 1:
        return '尚未審核'
      case 2:
        return '待補件'
      case 3:
        return '已審核'
      default:
        return '其他'
    }
  }

  // 過濾後的表格資料，排除 status 欄位的搜尋
  const filteredData = tableData.filter(
    (row) =>
      (row.table_name.includes(searchValue) ||
        row.username.includes(searchValue) ||
        getDepartmentName(row.department).includes(searchValue) || // 使用轉換後的部門名稱
        getReview(row.review).includes(searchValue) //|| // 使用轉換後的部門名稱
        //row.completed_at.includes(searchValue)  先註解因為只要table裡面有completed_at==null時就會失敗
      )&&
      (selectedFeedback === '' || (row.is_done ? '已審核' : '尚未審核') === selectedFeedback),
  )

  // handleSearchInput 處理輸入框變化
  const handleSearchInput = (e) => {
    setSearchInput(e.target.value) // 更新輸入框的值
  }

  // handleSearch 按下按鈕時觸發
  const handleSearch = () => {
    setSearchValue(searchInput) // 將輸入框的值更新到 searchValue
    console.log('搜尋結果:', searchInput) // 偵錯用
  }

  // 監聽鍵盤事件以判斷是否按下 Enter 鍵
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault() // 防止表單默認提交行為
      handleSearch() // 呼叫搜尋函數
    }
  }

  // handleFeedbackChange 函數處理下拉選單變化
  const handleFeedbackChange = (e) => {
    setSelectedFeedback(e.target.value)
  }

  // 處理勾選框變化
  const handleCheckboxChange = (rowId) => {
    setCheckedItems((prevChecked) =>
      prevChecked.includes(rowId)
        ? prevChecked.filter((id) => id !== rowId) // 取消勾選
        : [...prevChecked, rowId] // 新增勾選
    );
  };

  return (
    <CRow>
      <CTabs activeItemKey={1}>
        <CTabList variant="underline-border" className="system-tablist">
          <div className={styles.tabsContainer}>
            <div className={styles.tabsLeft}>
              <Link to="/碳盤查系統/system" className="system-tablist-link">
                <CTab aria-controls="tab1" itemKey={3} className="system-tablist-choose">
                  基準年&邊界設定
                </CTab>
              </Link>
              <Link to="/碳盤查系統/system/活動數據分配" className="system-tablist-link">
                <CTab aria-controls="tab3" itemKey={4} className="system-tablist-choose">
                  活動數據分配
                </CTab>
              </Link>
              <Link to="/碳盤查系統/system/活動數據盤點" className="system-tablist-link">
                <CTab aria-controls="tab3" itemKey={2} className="system-tablist-choose">
                  活動數據盤點
                </CTab>
              </Link>
            </div>
            <div className={styles.tabsRight}>
              <Link to="." className="system-tablist-link">
                <CTab aria-controls="tab3" itemKey={1} className="system-tablist-choose">
                  盤查進度管理
                </CTab>
              </Link>
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
            <CInputGroup>
              <CInputGroupText
                style={{
                  borderRadius: '25px 0 0 25px',
                  padding: '0.5rem',
                  backgroundColor: 'white',
                }}
              >
                <i className="pi pi-search" />
              </CInputGroupText>
              <CFormInput
                type="search"
                placeholder="Search"
                aria-label="Search"
                onChange={handleSearchInput}
                onKeyDown={handleKeyDown}
              />
              <CButton
                type="button"
                color="secondary"
                variant="outline"
                onClick={handleSearch}
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
              onChange={handleFeedbackChange}
            >
              <option value="">資料回報狀態</option>
              <option value="已審核">已審核</option>
              <option value="尚未審核">尚未審核</option>
              <option value="待補件">待補件</option>
            </CFormSelect>
          </CCol>
        </div>
      </CCol>
      <CRow>
        <br />
      </CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardBody>
            <CForm>
              <CTable>
                <CTableHead color="light">
                  <CTableRow>
                    {/* <CTableHeaderCell scope="col">勾選</CTableHeaderCell> */}
                    <CTableHeaderCell scope="col">排放源項目</CTableHeaderCell>
                    <CTableHeaderCell scope="col">填寫單位</CTableHeaderCell>
                    <CTableHeaderCell scope="col">負責人</CTableHeaderCell>
                    <CTableHeaderCell scope="col">資料蒐集完成日</CTableHeaderCell>
                    <CTableHeaderCell scope="col">狀態</CTableHeaderCell>
                    <CTableHeaderCell scope="col">資料回報狀態</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredData.length > 0 ? (
                    filteredData.map((row, index) => (
                      <CTableRow key={index}>
                        {/* 勾選 
                        <CTableDataCell>
                          <CFormCheck style={{ borderColor: 'black' }} />
                        </CTableDataCell>*/}
                        {/* 排放源項目 */}
                        <CTableDataCell>{row.table_name}</CTableDataCell>
                        {/* 顯示部門名稱 */}
                        <CTableDataCell>{getDepartmentName(row.department)}</CTableDataCell>
                        {/* 負責人 */}
                        <CTableDataCell>{row.username}</CTableDataCell>
                        {/* 資料蒐集完成日 */}
                        <CTableDataCell>{formatDate(row.completed_at)}</CTableDataCell>
                        {/* 狀態 */}
                        <CTableDataCell>
                          {row.is_done ? (
                            <div className="check_icon">
                              <CIcon icon={cilCheckAlt} className="check" />
                            </div>
                          ) : (
                            <div className="x_icon">
                              <CIcon icon={cilX} className="x" />
                            </div>
                          )}
                        </CTableDataCell>
                        {/* 回報狀態 */}
                        <CTableDataCell>
                          {/* {getReview(row.review)} 
                          onClick={() => setVisible(!visible)}
                          */}
                          
                          {row.completed_at ? (
                            <>
                              <button className={styles.aza1} style={{ marginRight: '10px' }}>
                                審核成功
                              </button>
                              <button className={styles.aza2}>審核失敗</button>
                            </>
                          ) : (
                            '尚未完成'
                          )}
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="9" className="text-center">
                        沒有找到符合條件的資料
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
              {/* onClick={() => setVisible(!visible)} */}
              {/* <div style={{ textAlign: 'center' }}>
              
                <button className={styles.complete} onClick={() => setVisible(!visible)}>盤點完成</button>
              </div> */}
              <CModal
                visible={visible}
                onClose={() => setVisible(false)}
                aria-labelledby="LiveDemoExampleLabel"
              >
                <CModalHeader>
                  <CModalTitle id="LiveDemoExampleLabel">資料回報</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  
                  <div className="d-flex flex-column align-items-center">
                    <CFormCheck type="radio" name="exampleRadios" id="exampleRadios1" value="option1" label="已審核" defaultChecked/>
                    <CFormCheck type="radio" name="exampleRadios" id="exampleRadios2" value="option2" label="待補件"/>
                  </div>
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={() => setVisible(false)}>
                    關閉
                  </CButton>
                  <CButton color="primary">確定</CButton>
                </CModalFooter>
              </CModal>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}
// import { useState } from "react";
// import { CButton, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";

// const Tabs = () => {
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [showAlert, setShowAlert] = useState(false);

//   // 模擬表格數據
//   const data = [
//     { id: "1", name: "產品A" },
//     { id: "2", name: "產品B" },
//     { id: "3", name: "產品C" },
//   ];

//   // 處理勾選
//   const handleCheckboxChange = (id) => {
//     setSelectedItems((prev) =>
//       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
//     );
//   };
  

//   // 點擊「盤點完成」按鈕
//   const handleComplete = () => {
//     if (selectedItems.length === 0) {
//       setShowAlert(true);
//       return;
//     }
//     setShowModal(true);
//   };

//   return (
//     <div>
//       {/* 表格 */}
//       <CTable>
//         <CTableHead>
//           <CTableRow>
//             <CTableHeaderCell>選取</CTableHeaderCell>
//             <CTableHeaderCell>產品名稱</CTableHeaderCell>
//           </CTableRow>
//         </CTableHead>
//         <CTableBody>
//           {data.map((item) => (
//             <CTableRow key={item.id}>
//               <CTableDataCell>
//                 <input
//                   type="checkbox"
//                   checked={selectedItems.includes(item.id)}
//                   onChange={() => handleCheckboxChange(item.id)}
//                 />
//               </CTableDataCell>
//               <CTableDataCell>{item.name}</CTableDataCell>
//             </CTableRow>
//           ))}
//         </CTableBody>
//       </CTable>

//       {/* 按鈕 */}
//       <CButton color="primary" onClick={handleComplete}>
//         盤點完成
//       </CButton>

//       {/* 提示 Modal */}
//       <CModal visible={showModal} onClose={() => setShowModal(false)}>
//         <CModalHeader>
//           <CModalTitle>盤點結果</CModalTitle>
//         </CModalHeader>
//         <CModalBody>您已選擇 {selectedItems.length} 個項目</CModalBody>
//       </CModal>

//       {/* Alert 提示 */}
//       {showAlert && (
//         <div style={{ color: "red", marginTop: "10px" }}>請至少選擇一個項目！</div>
//       )}
//     </div>
//   );
// };

// export default Tabs; 
export default Tabs
