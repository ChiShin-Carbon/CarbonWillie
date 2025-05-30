import React, { useRef, useEffect, useState } from 'react'

import {
  CRow,
  CCol,
  CCard,
  CTab,
  CTabList,
  CTabs,
  CButton,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
} from '@coreui/react'

import '../../../../scss/碳盤查系統.css'
import styles from '../../../../scss/活動數據盤點.module.css'
import { Link } from 'react-router-dom'

import 'primereact/resources/themes/saga-blue/theme.css' // 主题样式
import 'primereact/resources/primereact.min.css' // 核心 CSS
import 'primeicons/primeicons.css' // 图标样式

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons'

import AddModal from './新增Modal' // Import the AddModal component
import EditModal from './編輯Modal'

const Tabs = () => {
  const addModalRef = useRef()
  const handleOpenAddModal = () => {
    addModalRef.current.openModal()
  }
  const editModalRef = useRef()
  const handleOpenEditModal = (tableName, usernames) => {
    editModalRef.current.openModal(tableName, usernames)
  }

  // 設定用來儲存授權記錄的狀態
  const [authorizedRecords, setAuthorizedRecords] = useState([])
  const [uniqueTableNames, setUniqueTableNames] = useState([]) // 用來儲存去重后的table_name
  const [errorMessage, setErrorMessage] = useState('') // 添加錯誤訊息狀態
  
  const getAuthorizedRecords = async () => {
    try {
      const response = await fetch('http://localhost:8000/authorizedTable', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        console.log(response.status)
        setErrorMessage(`Error: ${errorData.detail || 'Unknown error'}`)
        return // 如果請求不成功，直接返回
      }
      
      const data = await response.json()
      
      // 获取所有的 table_name 并去重
      const tableNames = data.map((record) => record.table_name)
      const uniqueTableNames = [...new Set(tableNames)] // 去重
      setUniqueTableNames(uniqueTableNames) // 存储去重后的table_name

      // 將每個記錄的 departmentID 轉換為部門名稱
      const recordsWithDepartments = data.map((record) => ({
        ...record,
        department: getDepartmentName(record.department), // 使用函數獲取部門名稱
      }))
      setAuthorizedRecords(recordsWithDepartments)
      setErrorMessage('') // 成功時清除錯誤訊息
    } catch (error) {
      console.error('Error fetching authorized records:', error)
      setErrorMessage('Error fetching authorized records')
      // 發生錯誤時，確保將資料設為空陣列，而不是保留舊資料
      setAuthorizedRecords([])
      setUniqueTableNames([])
    }
  }
  
  useEffect(() => {
    getAuthorizedRecords()
  }, [])

  // 將部門ID轉換為部門名稱的函數
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
  
  // 分类表名对应的范围
  const categoryMapping = {
    範疇一: [
      '公務車',
      '滅火器',
      '工作時數(員工)',
      '工作時數(非員工)',
      '冷媒',
      '廠內機具',
      '緊急發電機',
    ],
    範疇二: ['電力使用量'],
    範疇三: ['員工通勤', '商務旅行', '營運產生廢棄物', '銷售產品的廢棄物'],
  }

  // 用来追踪每个表名对应的记录
  const recordMap = {}

  // 遍历授权记录以合并相同 table_name 的记录
  authorizedRecords.forEach((record) => {
    const { table_name, username, department } = record

    // 确定记录属于哪个範疇
    for (const [category, tables] of Object.entries(categoryMapping)) {
      if (tables.includes(table_name)) {
        if (!recordMap[table_name]) {
          recordMap[table_name] = {
            category,
            usernames: {
              管理部門: '無',
              資訊部門: '無',
              業務部門: '無',
              門診部門: '無',
              健檢部門: '無',
              檢驗部門: '無',
            },
          }
        }
        // 更新用户名
        recordMap[table_name].usernames[department] = username || '無'
        break
      }
    }
  })

  // 将 recordMap 转换为数组以用于渲染
  const uniqueRecords = Object.entries(recordMap).map(([table_name, record]) => ({
    table_name,
    ...record,
  }))

  // 定義一個回調函數來刷新授權記錄
  const refreshAuthorizedRecords = () => {
    getAuthorizedRecords()
  }

  ///////////////////////////////刪除////////////////////////////////////////////////
  const deleteRecordByTableName = async (table_name) => {
    try {
      const response = await fetch(`http://localhost:8000/delete_authorized/${table_name}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Failed to delete record:', errorData.detail || 'Unknown error')
        return false
      }
      
      const result = await response.json()
      console.log(result.message)
      // Refresh records after deletion
      refreshAuthorizedRecords()
      return true
    } catch (error) {
      console.error('Error deleting record:', error)
      return false
    }
  }

  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)
  const [selectedTableName, setSelectedTableName] = useState(null)

  const openDeleteModal = (tableName) => {
    setSelectedTableName(tableName)
    setDeleteModalVisible(true)
  }

  // 刪除紀錄的函數
  const deleteAndClose = async (tableName) => {
    const success = await deleteRecordByTableName(tableName)
    if (success) {
      setDeleteModalVisible(false) // 關閉 Modal
    }
  }

  return (
    <main>
      <CTabs activeItemKey={1}>
        <CTabList variant="underline-border" className="system-tablist">
          <div className={styles.tabsContainer}>
            <div className={styles.tabsLeft}>
              <Link to="/碳盤查系統/system/基準年設定" className="system-tablist-link">
                <CTab aria-controls="tab1" itemKey={3} className="system-tablist-choose">
                  基準年&邊界設定
                </CTab>
              </Link>
              <Link to="." className="system-tablist-link">
                <CTab aria-controls="tab3" itemKey={1} className="system-tablist-choose">
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
              <Link to="/碳盤查系統/system/盤查進度管理" className="system-tablist-link">
                <CTab aria-controls="tab3" itemKey={5} className="system-tablist-choose">
                  盤查進度管理
                </CTab>
              </Link>
            </div>
          </div>
        </CTabList>
      </CTabs>

      <div className="system-titlediv">
        <div>
          <h4 className="system-title">活動數據分配</h4>
          <hr className="system-hr"></hr>
        </div>
      </div>
      
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
      
      <CCard className={`mb-4 ${styles.activityCard2}`}>
        <div>
          <div className={styles.activityCard2Head}>
            <strong className={styles.activityCard2HeadTitle}>範疇一</strong>
            {window.sessionStorage.getItem("position") == 1 ? (
              <button className={styles.activityAddButton} onClick={handleOpenAddModal}>
                新增
              </button>
            ) : null}
          </div>

          <div className={styles.activityCardBody2}>
            <div className={styles.activityAccordionDiv}>
              {uniqueRecords
                .filter((record) => categoryMapping['範疇一'].includes(record.table_name)) // 確保範疇一的項目
                .map((record) => (
                  <CAccordion key={record.table_name} className={styles.activityAccordion}>
                    <CAccordionItem
                      itemKey={record.table_name}
                      className={styles.activityAccordionItem}
                    >
                      <CAccordionHeader>{record.table_name}</CAccordionHeader>
                      <CAccordionBody>
                        <div className={styles.AccordionBodyItem}>
                          <h6>各部門填寫人</h6>
                          <hr />
                          <div className={styles.departmentList}>
                            <div className={styles.departmentItem}>
                              <span>管理部門:</span>
                              <span>{record.usernames.管理部門}</span>
                            </div>
                            <div className={styles.departmentItem}>
                              <span>資訊部門:</span>
                              <span>{record.usernames.資訊部門}</span>
                            </div>
                            <div className={styles.departmentItem}>
                              <span>業務部門:</span>
                              <span>{record.usernames.業務部門}</span>
                            </div>
                            <div className={styles.departmentItem}>
                              <span>門診部門:</span>
                              <span>{record.usernames.門診部門}</span>
                            </div>
                            <div className={styles.departmentItem}>
                              <span>健檢部門:</span>
                              <span>{record.usernames.健檢部門}</span>
                            </div>
                            <div className={styles.departmentItem}>
                              <span>檢驗部門:</span>
                              <span>{record.usernames.檢驗部門}</span>
                            </div>
                          </div>

                          {window.sessionStorage.getItem("position") == 1 ? (
                            <div style={{ textAlign: 'right' }}>
                              <FontAwesomeIcon
                                icon={faPenToSquare}
                                className={styles.iconPen}
                                onClick={() =>
                                  handleOpenEditModal(record.table_name, record.usernames)
                                }
                              />
                              <FontAwesomeIcon
                                icon={faTrashCan}
                                className={styles.iconTrash}
                                onClick={() => openDeleteModal(record.table_name)}
                              />
                            </div>
                          ) : null}
                        </div>
                      </CAccordionBody>
                    </CAccordionItem>
                  </CAccordion>
                ))}
            </div>
          </div>
        </div>

        <div>
          <div className={styles.activityCard2Head}>
            <strong className={styles.activityCard2HeadTitle}>範疇二</strong>
          </div>

          <div className={styles.activityCardBody2}>
            <div className={styles.activityAccordionDiv}>
              {uniqueRecords
                .filter((record) => categoryMapping['範疇二'].includes(record.table_name)) // 根據範疇二的記錄進行過濾
                .map((record) => (
                  <CAccordion key={record.table_name} className={styles.activityAccordion}>
                    <CAccordionItem
                      itemKey={record.table_name}
                      className={styles.activityAccordionItem}
                    >
                      <CAccordionHeader>{record.table_name}</CAccordionHeader>
                      <CAccordionBody>
                        <div className={styles.AccordionBodyItem}>
                          <h6>各部門填寫人</h6>
                          <hr />
                          <div className={styles.departmentList}>
                            <div className={styles.departmentItem}>
                              <span>管理部門:</span>
                              <span>{record.usernames.管理部門}</span>
                            </div>
                            <div className={styles.departmentItem}>
                              <span>資訊部門:</span>
                              <span>{record.usernames.資訊部門}</span>
                            </div>
                            <div className={styles.departmentItem}>
                              <span>業務部門:</span>
                              <span>{record.usernames.業務部門}</span>
                            </div>
                            <div className={styles.departmentItem}>
                              <span>門診部門:</span>
                              <span>{record.usernames.門診部門}</span>
                            </div>
                            <div className={styles.departmentItem}>
                              <span>健檢部門:</span>
                              <span>{record.usernames.健檢部門}</span>
                            </div>
                            <div className={styles.departmentItem}>
                              <span>檢驗部門:</span>
                              <span>{record.usernames.檢驗部門}</span>
                            </div>
                          </div>
                          {window.sessionStorage.getItem("position") == 1 ? (
                            <div style={{ textAlign: 'right' }}>
                              <FontAwesomeIcon
                                icon={faPenToSquare}
                                className={styles.iconPen}
                                onClick={() =>
                                  handleOpenEditModal(record.table_name, record.usernames)
                                }
                              />
                              <FontAwesomeIcon
                                icon={faTrashCan}
                                className={styles.iconTrash}
                                onClick={() => openDeleteModal(record.table_name)}
                              />
                            </div>
                          ) : null}
                        </div>
                      </CAccordionBody>
                    </CAccordionItem>
                  </CAccordion>
                ))}
            </div>
          </div>
        </div>

        <div>
          <div className={styles.activityCard2Head}>
            <strong className={styles.activityCard2HeadTitle}>範疇三</strong>
          </div>
          <div className={styles.activityCardBody2}>
            <div className={styles.activityAccordionDiv}>
              {uniqueRecords
                .filter((record) => categoryMapping['範疇三'].includes(record.table_name)) // 根據範疇三的記錄過濾
                .map((record) => (
                  <CAccordion key={record.table_name} className={styles.activityAccordion}>
                    <CAccordionItem
                      itemKey={record.table_name}
                      className={styles.activityAccordionItem}
                    >
                      <CAccordionHeader>{record.table_name}</CAccordionHeader>
                      <CAccordionBody>
                        <div className={styles.AccordionBodyItem}>
                          <h6>各部門填寫人</h6>
                          <hr />
                          <div className={styles.departmentList}>
                            <div className={styles.departmentItem}>
                              <span>管理部門:</span>
                              <span>{record.usernames.管理部門}</span>
                            </div>
                            <div className={styles.departmentItem}>
                              <span>資訊部門:</span>
                              <span>{record.usernames.資訊部門}</span>
                            </div>
                            <div className={styles.departmentItem}>
                              <span>業務部門:</span>
                              <span>{record.usernames.業務部門}</span>
                            </div>
                            <div className={styles.departmentItem}>
                              <span>門診部門:</span>
                              <span>{record.usernames.門診部門}</span>
                            </div>
                            <div className={styles.departmentItem}>
                              <span>健檢部門:</span>
                              <span>{record.usernames.健檢部門}</span>
                            </div>
                            <div className={styles.departmentItem}>
                              <span>檢驗部門:</span>
                              <span>{record.usernames.檢驗部門}</span>
                            </div>
                          </div>

                          {window.sessionStorage.getItem("position") == 1 ? (
                            <div style={{ textAlign: 'right' }}>
                              <FontAwesomeIcon
                                icon={faPenToSquare}
                                className={styles.iconPen}
                                onClick={() =>
                                  handleOpenEditModal(record.table_name, record.usernames)
                                }
                              />
                              <FontAwesomeIcon
                                icon={faTrashCan}
                                className={styles.iconTrash}
                                onClick={() => openDeleteModal(record.table_name)}
                              />
                            </div>
                          ) : null}
                        </div>
                      </CAccordionBody>
                    </CAccordionItem>
                  </CAccordion>
                ))}
            </div>
          </div>
        </div>
      </CCard>

      <CModal
        backdrop="static"
        visible={isDeleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        aria-labelledby="StaticBackdropExampleLabel3"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel3">
            <b>提醒</b>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>確定要刪除該項目嗎?</CModalBody>
        <CModalFooter>
          <CButton className="modalbutton1" onClick={() => setDeleteModalVisible(false)}>
            取消
          </CButton>
          <CButton className="modalbutton2" onClick={() => deleteAndClose(selectedTableName)}>
            確認
          </CButton>
        </CModalFooter>
      </CModal>

      <AddModal
        ref={addModalRef}
        onSuccess={refreshAuthorizedRecords}
        uniqueTableNames={uniqueTableNames}
      />
      <EditModal ref={editModalRef} onSuccess={refreshAuthorizedRecords} />
    </main>
  )
}

export default Tabs