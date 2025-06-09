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
import EditSuccessModal from './審核成功Modal.js'
import EditFalseModal from './審核失敗Modal.js'
import { cilCheckAlt, cilX } from '@coreui/icons'

const Tabs = () => {
  const [isTrueModalOpen, setTrueIsModalOpen] = useState(null)
  const [isFalseModalOpen, setFalseIsModalOpen] = useState(null)

  const [searchInput, setSearchInput] = useState('') // 存放輸入框的臨時搜尋值
  const [searchValue, setSearchValue] = useState('') // 觸發搜尋的值
  const [selectedFeedback, setSelectedFeedback] = useState('') // 資料回報狀態
  const [tableData, setTableData] = useState([]) // 新增狀態來存放從後端獲取的資料
  const [authorizedID, setAuthorizedID] = useState([]) // 新增來存放從後端獲取的資料

  // Get user position and role from sessionStorage
  const storedUserPosition = parseInt(window.sessionStorage.getItem('position'), 10);
  const storedUserRole = parseInt(window.sessionStorage.getItem('role'), 10);
  
  // Check if user has permission to review (position === 1)
  const canReview = storedUserPosition === 1;
  
  console.log('User permissions:', {
    position: storedUserPosition,
    role: storedUserRole,
    canReview: canReview
  });

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

      // Ensure data is an array before setting state
      if (Array.isArray(data)) {
        setTableData(data) // Set table data only if it's an array
      } else if (data && Array.isArray(data.data)) {
        // Handle case where API returns { data: [...] }
        setTableData(data.data)
      } else {
        console.error('API did not return an array:', data)
        setTableData([]) // Set to empty array as fallback
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setTableData([]) // Set to empty array on error
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
        return '已審核-審核成功'
      case 3:
        return '已審核-審核失敗'
      default:
        return '其他'
    }
  }

  // 過濾後的表格資料，排除 status 欄位的搜尋
  const filteredData = Array.isArray(tableData)
    ? tableData.filter(
      (row) =>
        (row.table_name?.includes(searchValue) ||
          row.username?.includes(searchValue) ||
          row.authorized_record_id ||
          getDepartmentName(row.department)?.includes(searchValue) ||
          getReview(row.review)?.includes(searchValue)
        ) &&
        (selectedFeedback === '' || (row.review === 1 ? '尚未審核' : '已審核') === selectedFeedback)
    )
    : [];

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

  // Handle review button clicks with permission check
  const handleReviewButtonClick = (action, recordId) => {
    if (!canReview) {
      alert('您沒有權限執行審核操作，僅限主管使用 (position = 1)');
      return;
    }
    
    if (action === 'success') {
      setTrueIsModalOpen(recordId);
    } else if (action === 'failed') {
      setFalseIsModalOpen(recordId);
    }
  };

  const handleComplete = () => {
    if (selectedItems.length === 0) {
      setShowAlert(true);
      return;
    }
    setShowModal(true);
  };

  return (
    <CRow>
      <CTabs activeItemKey={1}>
        <CTabList variant="underline-border" className="system-tablist">
          <div className={styles.tabsContainer}>
            <div className={styles.tabsLeft}>
              <Link to="/碳盤查系統/system/基準年設定" className="system-tablist-link">
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
                    filteredData.map((row, index) => {
                      // Add debugging for each row
                      console.log(`Row ${index}:`, {
                        id: row.authorized_record_id,
                        table_name: row.table_name,
                        is_done: row.is_done,
                        review: row.review,
                        review_type: typeof row.review
                      });

                      return (
                        <CTableRow key={index}>
                          {/* 排放源項目 */}
                          <CTableDataCell>
                            {row.table_name}
                          </CTableDataCell>
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
                            {(() => {
                              console.log(`Processing row ${row.authorized_record_id}:`, {
                                is_done: row.is_done,
                                review: row.review
                              });

                              // Check review status first
                              if (row.review === 2) {
                                console.log(`Row ${row.authorized_record_id}: Showing 審核成功 (review=2)`);
                                return <button className={styles.aza1}>審核成功</button>;
                              } else if (row.review === 3) {
                                console.log(`Row ${row.authorized_record_id}: Showing 審核失敗 (review=3)`);
                                return (
                                  <div>
                                    <button className={styles.aza2} style={{ marginBottom: '5px', display: 'block' }}>
                                      審核失敗
                                    </button>
                                  </div>
                                );
                              } else if (row.is_done && row.review === 1) {
                                console.log(`Row ${row.authorized_record_id}: Showing review buttons (completed, pending review)`);
                                return (
                                  <>
                                    <button 
                                      className={styles.aza1} 
                                      style={{ 
                                        marginRight: '10px',
                                        opacity: canReview ? 1 : 0.5,
                                        cursor: canReview ? 'pointer' : 'not-allowed',
                                        filter: canReview ? 'none' : 'grayscale(50%)'
                                      }} 
                                      onClick={() => handleReviewButtonClick('success', row.authorized_record_id)}
                                      disabled={!canReview}
                                      title={canReview ? '審核成功' : '您沒有審核權限 (需要 position = 1)'}
                                    >
                                      審核成功
                                    </button>
                                    <button 
                                      className={styles.aza2} 
                                      style={{
                                        opacity: canReview ? 1 : 0.5,
                                        cursor: canReview ? 'pointer' : 'not-allowed',
                                        filter: canReview ? 'none' : 'grayscale(50%)'
                                      }}
                                      onClick={() => handleReviewButtonClick('failed', row.authorized_record_id)}
                                      disabled={!canReview}
                                      title={canReview ? '審核失敗' : '您沒有審核權限 (需要 position = 1)'}
                                    >
                                      審核失敗
                                    </button>
                                    {/* Only render modals if user has permission */}
                                    {canReview && (
                                      <>
                                        <EditSuccessModal 
                                          isOpen={isTrueModalOpen === row.authorized_record_id} 
                                          onClose={() => setTrueIsModalOpen(null)} 
                                          authorizedRecordId={row.authorized_record_id} 
                                          refreshData={getAuthorizedRecords} 
                                        />
                                        <EditFalseModal 
                                          isOpen={isFalseModalOpen === row.authorized_record_id} 
                                          onClose={() => setFalseIsModalOpen(null)} 
                                          authorizedRecordId={row.authorized_record_id} 
                                          refreshData={getAuthorizedRecords} 
                                        />
                                      </>
                                    )}
                                  </>
                                );
                              } else {
                                console.log(`Row ${row.authorized_record_id}: Showing 尚未完成 (not completed)`);
                                return <button className={styles.aza3}>尚未完成</button>;
                              }
                            })()}
                          </CTableDataCell>
                        </CTableRow>
                      );
                    })
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="6" className="text-center">
                        沒有找到符合條件的資料
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}
export default Tabs