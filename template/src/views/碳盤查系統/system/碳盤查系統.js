import React, { useState, useEffect } from 'react'
import {
  CRow,
  CCol,
  CCard,
  CFormSelect,
  CTab,
  CTabList,
  CTabs,
  CTable,
  CTableBody,
  CTableHead,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CButton,
  CFormCheck,
  CForm,
  CFormLabel,
  CFormInput,
  CFormTextarea,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilDataTransferDown } from '@coreui/icons'

import '../../../scss/碳盤查系統.css'
import styles from '../../../scss/活動數據盤點.module.css'
import { Link } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleCheck,
  faCircleXmark,
  faPenToSquare,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons'

const Tabs = () => {
  // 定義 useState 來控制 Modal 的顯示
  const [isAddModalVisible, setAddModalVisible] = useState(false)
  const [isEditModalVisible, setEditModalVisible] = useState(false)

  // position-編輯權限
  const [positionID, setPositionID] = useState('')
  const getuserinfo = async () => {
    try {
      const response = await fetch('http://localhost:8000/userinfo', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: window.sessionStorage.getItem('user_id'),
        }),
      })
      const data = await response.json()
      console.log(data)
      if (response.ok) {
        console.log(data)
        setPositionID(data.user.position)
      } else {
        console.log(response.status)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }
  useEffect(() => {
    getuserinfo()
  }, [])

  // Baseline
  const [baseline_id, setBaseline] = useState('')
  const [cfvStartDate, setCfvStartDate] = useState('')
  const [cfvEndDate, setCfvEndDate] = useState('')

  const getBaseline = async () => {
    try {
      const response = await fetch('http://localhost:8000/baseline')
      if (response.ok) {
        const data = await response.json()
        setBaseline(data.baseline.baseline_id)
        setCfvStartDate(data.baseline.cfv_start_date)
        setCfvEndDate(data.baseline.cfv_end_date)
      } else {
        console.log(response.status)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }
  const handleCreateBaseline = async () => {
    if (cfvStartDate && cfvEndDate) {
      try {
        const response = await fetch('http://localhost:8000/baseline', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: window.sessionStorage.getItem('user_id'),
            cfv_start_date: cfvStartDate,
            cfv_end_date: cfvEndDate,
          }),
        })
        if (response.ok) {
          alert('基準年設定成功')
          getBaseline()
          setAddModalVisible(false)
        }
      } catch (error) {
        console.error('Error creating baseline:', error)
      }
    } else {
      alert('請填寫完整的盤查期間')
    }
  }

  useEffect(() => {
    getBaseline()
  }, [])

  // Boundary
  // const [field_name, setFieldName] = useState('')
  // const [field_address, setFieldAddress] = useState('')
  // const [is_inclusion, setIsInclusion] = useState(false)
  // const [remark, setRemark] = useState('')
  // const [boundary, setBoundary] = useState(false)
  const [boundaries, setBoundaries] = useState([])

  const getBoundary = async () => {
    try {
      const response = await fetch('http://localhost:8000/boundary')
      if (response.ok) {
        const data = await response.json()
        setBoundaries(data.boundaries)
        // setFieldName(data.boundary.field_name)
        // setFieldAddress(data.boundary.field_address)
        // setIsInclusion(data.boundary.is_inclusion ? true : false)
        // setRemark(data.boundary.remark)
        // setBoundary(true)
      } else if (response.status === 404) {
        // setBoundary(false)
        setBoundaries([])
      } else {
        console.log(response.status)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const [new_field_name, setNewFieldName] = useState('')
  const [new_field_address, setNewFieldAddress] = useState('')
  const [new_is_inclusion, setNewIsInclusion] = useState(false)
  const [new_remark, setNewRemark] = useState('')
  const handleCreateBoundary = async () => {
    try {
      const response = await fetch('http://localhost:8000/boundary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          baseline_id: baseline_id,
          user_id: window.sessionStorage.getItem('user_id'),
          field_name: new_field_name,
          field_address: new_field_address,
          is_inclusion: new_is_inclusion,
          remark: new_remark,
        }),
      })
      if (response.ok) {
        alert('邊界設定成功')
        getBaseline()
        setAddModalVisible(false)
      }
    } catch (error) {
      console.error('Error creating boundary:', error)
    }
  }

  // const handleEditBoundary = async (boundary_id) => {
  //   try {
  //     const response = await fetch(`http://localhost:8000/boundary/${boundary_id}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         user_id: window.sessionStorage.getItem('user_id'),
  //         field_name,
  //         field_address,
  //         is_inclusion,
  //         remark,
  //       }),
  //     })
  //     if (response.ok) {
  //       alert('邊界修改成功')
  //       getBoundary()
  //       setEditModalVisible(false)
  //     }
  //   } catch (error) {
  //     console.error('Error updating boundary:', error)
  //   }
  // }

  // const handleDeleteBoundary = async (boundary_id) => {
  //   if (window.confirm('確定刪除此邊界設定嗎？')) {
  //     try {
  //       const response = await fetch(`http://localhost:8000/boundary/${boundary_id}`, {
  //         method: 'DELETE',
  //       })
  //       if (response.ok) {
  //         alert('邊界刪除成功')
  //         getBoundary()
  //       }
  //     } catch (error) {
  //       console.error('Error deleting boundary:', error)
  //     }
  //   }
  // }

  useEffect(() => {
    getBoundary()
  }, [])

  return (
    <main>
      <CTabs activeItemKey={1}>
        <CTabList variant="underline-border" className="system-tablist">
          <div className={styles.tabsContainer}>
            <div className={styles.tabsLeft}>
              <Link to="." className="system-tablist-link">
                <CTab aria-controls="tab1" itemKey={1} className="system-tablist-choose">
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
          <h4 className="system-title">基準年設定</h4>
          <hr className="system-hr"></hr>
        </div>
        {positionID === 1 && (
          <button className="system-save" onClick={handleCreateBaseline}>
            儲存
          </button>
        )}
      </div>
      <CCard className="mb-4 systemCard1" style={{ height: '100px' }}>
        <div className="systemCardBody">
          <CForm>
            <CRow className="mb-3">
              <CFormLabel htmlFor="projectstart" className="col-sm-2 col-form-label systemlabel">
                盤查期間(開始)
              </CFormLabel>
              <CCol>
                <CFormInput
                  className="systeminput"
                  type="date"
                  id="projectstart"
                  value={cfvStartDate}
                  onChange={(e) => setCfvStartDate(e.target.value)}
                  disabled={positionID !== 1}
                />
              </CCol>

              <CCol sm={1}></CCol>

              <CFormLabel htmlFor="projectend" className="col-sm-2 col-form-label systemlabel">
                盤查期間(結束)
              </CFormLabel>
              <CCol>
                <CFormInput
                  className="systeminput"
                  type="date"
                  id="projectend"
                  value={cfvEndDate}
                  onChange={(e) => setCfvEndDate(e.target.value)}
                  disabled={positionID !== 1}
                />
              </CCol>
            </CRow>
          </CForm>
        </div>
      </CCard>

      <div className="system-titlediv">
        <div>
          <h4 className="system-title">邊界設定</h4>
          <hr className="system-hr"></hr>
        </div>
        {/* <button className="system-save">儲存</button> */}
      </div>
      <CCard className="mb-4 systemCard">
        <div className="systemCardBody">
          <CRow className="mb-3">
            <CCol>
              <CFormSelect className="select" disabled>
                <option value="1">營運控制法</option>
                <option value="2">所有權法</option>
                <option value="3">財務控制法</option>
              </CFormSelect>
              {/* <div style={{ border: '1px solid black', padding: '10px 20px', width: '30%', borderRadius: '30px', textAlign: 'center', fontWeight: 'bold' }}>
                                使用: 營運控制法</div> */}
            </CCol>

            <CCol style={{ textAlign: 'right' }}>
              <button className="systembutton" onClick={() => setAddModalVisible(true)}>
                新增地點
              </button>
            </CCol>
          </CRow>

          <CTable hover className="systemTable">
            <CTableHead>
              <tr>
                <th style={{ width: '20%' }}>場域名稱</th>
                <th style={{ width: '35%' }}>場域地址</th>
                <th style={{ width: '25%' }}>備註</th>
                <th style={{ width: '10%' }}>列入盤查</th>
                <th style={{ width: '20%' }}>操作</th>
              </tr>
            </CTableHead>
            <CTableBody>
              {boundaries.length > 0 ? (
                boundaries.map((boundary) => (
                  <tr key={boundary.boundary_id}>
                    <td>{boundary.field_name}</td>
                    <td>{boundary.field_address}</td>
                    <td>{boundary.remark}</td>
                    <td>
                      <FontAwesomeIcon
                        icon={boundary.is_inclusion ? faCircleCheck : faCircleXmark}
                        className={boundary.is_inclusion ? styles.iconCorrect : styles.iconWrong}
                      />
                    </td>
                    <td>
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        className={styles.iconPen}
                        onClick={() => handleEditBoundary(boundary.boundary_id)}
                      />
                      <FontAwesomeIcon
                        icon={faTrashCan}
                        className={styles.iconTrash}
                        onClick={() => handleDeleteBoundary(boundary.boundary_id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'gray' }}>
                    請新增邊界設定
                  </td>
                </tr>
              )}
              {/* <tr>
                <td>XXX大樓5F</td>
                <td>10491台北市中山區建國北路三段42號4樓</td>
                <td>讚</td>
                <td>
                  <FontAwesomeIcon icon={faCircleXmark} className={styles.iconWrong} />
                </td>
                <td>
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    className={styles.iconPen}
                    onClick={() => setEditModalVisible(true)}
                  />
                  <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                </td>
              </tr> */}
            </CTableBody>
          </CTable>
        </div>
      </CCard>
      <CModal
        backdrop="static"
        visible={isAddModalVisible}
        onClose={() => setAddModalVisible(false)}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">
            <b>新增地點</b>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel htmlFor="sitename" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
              場域名稱
            </CFormLabel>
            <CFormInput
              className={styles.addinput}
              type="text"
              id="sitename"
              onChange={(e) => setNewFieldName(e.target.value)}
            />

            <CFormLabel htmlFor="site" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
              場域地址
            </CFormLabel>
            <CFormInput
              className={styles.addinput}
              type="text"
              id="site"
              onChange={(e) => setNewFieldAddress(e.target.value)}
            />

            <CFormLabel
              htmlFor="siteexplain"
              className={`col-sm-2 col-form-label ${styles.addlabel}`}
            >
              備註
            </CFormLabel>
            <CFormTextarea
              className={styles.addinput}
              type="text"
              id="siteexplain"
              rows={3}
              onChange={(e) => setNewRemark(e.target.value)}
            />

            <br />

            <CFormCheck
              id="sitetrue"
              label="列入盤查"
              onChange={(e) => setNewIsInclusion(e.target.checked)}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton className="modalbutton1" onClick={() => setAddModalVisible(false)}>
            取消
          </CButton>
          <CButton className="modalbutton2" onClick={handleCreateBoundary}>
            新增
          </CButton>
        </CModalFooter>
      </CModal>

      {/* <CModal
        backdrop="static"
        visible={isEditModalVisible}
        onClose={() => setEditModalVisible(false)}
        aria-labelledby="StaticBackdropExampleLabel2"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel2">
            <b>編輯地點</b>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel htmlFor="sitename" className="col-sm-2 col-form-label systemlabel">
              場域名稱
            </CFormLabel>
            <CFormInput
              className="systeminput"
              type="text"
              id="sitename"
              value={boundary.field_name}
              onChange={(e) => setFieldName(e.target.value)}
            />

            <CFormLabel htmlFor="site" className="col-sm-2 col-form-label systemlabel">
              場域地址
            </CFormLabel>
            <CFormInput
              className="systeminput"
              type="text"
              id="site"
              value={boundary.field_address}
              onChange={(e) => setFieldAddress(e.target.value)}
            />

            <CFormLabel htmlFor="siteexplain" className="col-sm-2 col-form-label systemlabel">
              備註
            </CFormLabel>
            <CFormTextarea
              className="systeminput"
              type="text"
              id="siteexplain"
              rows={3}
              value={boundary.remark}
              onChange={(e) => setRemark(e.target.value)}
            />

            <br />

            <CFormCheck
              id="sitetrue"
              label="列入盤查"
              value={boundary.is_inclusion}
              onChange={(e) => setIsInclusion(e.target.value)}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton className="modalbutton1" onClick={() => setEditModalVisible(false)}>
            取消
          </CButton>
          <CButton className="modalbutton2" onClick={() => handleEditBoundary()}>
            確認
          </CButton>
        </CModalFooter>
      </CModal> */}
    </main>
  )
}

export default Tabs
