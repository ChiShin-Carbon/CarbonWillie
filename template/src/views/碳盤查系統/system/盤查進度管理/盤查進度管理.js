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
        return '已審核-審核成功'
      case 3:
        return '已審核-審核失敗'
      default:
        return '其他'
    }
  }

  // 過濾後的表格資料，排除 status 欄位的搜尋
  const filteredData = tableData.filter(
    (row) =>
      (row.table_name.includes(searchValue) ||
        row.username.includes(searchValue) ||
        row.authorized_record_id||
        getDepartmentName(row.department).includes(searchValue) || // 使用轉換後的部門名稱
        getReview(row.review).includes(searchValue) //|| // 使用轉換後的部門名稱
        //row.completed_at.includes(searchValue)  先註解因為只要table裡面有completed_at==null時就會失敗
      )&&
      (selectedFeedback === '' || (row.review === 1 ? '尚未審核' : '已審核') === selectedFeedback),
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
                        {/* 排放源項目 */}{/*測試用 {row.review} */}
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

                          {/* 正式的 */}
                          {row.completed_at ? (
                              row.review === 1 ? (
                                <>
                                  <button className={styles.aza1} style={{ marginRight: '10px' }} onClick={() => setTrueIsModalOpen(row.authorized_record_id)}>
                                    審核成功
                                  </button>
                                  <button className={styles.aza2} onClick={() => setFalseIsModalOpen(row.authorized_record_id)}>
                                    審核失敗
                                  </button>
                                  <EditSuccessModal isOpen={isTrueModalOpen === row.authorized_record_id} onClose={() => setTrueIsModalOpen(null)} authorizedRecordId={row.authorized_record_id}/>
                                  <EditFalseModal isOpen={isFalseModalOpen === row.authorized_record_id} onClose={() => setFalseIsModalOpen(null)} authorizedRecordId={row.authorized_record_id}/>
                                </>
                              ) : row.review === 2 ? (
                                <button className={styles.aza1}>審核成功</button>
                              ) : row.review === 3 ? (
                                <button className={styles.aza2}>審核失敗</button>
                              ) : (
                                getReview(row.review)
                              )
                            ) : (
                              <button className={styles.aza3}>尚未完成</button>
                            )
                          }

                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="9" className="text-center">
                        沒有找到符合條件的資料
                      </CTableDataCell>
                    </CTableRow>
                  )
                  }
                </CTableBody>
              </CTable>
              {/* 盤點完成button */}
              {/* <div style={{ textAlign: 'center' }}>
                <button className={styles.complete} onClick={() => setVisible(!visible)}>盤點完成</button>
              </div> */}
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}
export default Tabs
