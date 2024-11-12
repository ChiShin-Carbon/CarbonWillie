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
  const [cfvStartDate, setCfvStartDate] = useState('')
  const [cfvEndDate, setCfvEndDate] = useState('')
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

  const fetchBaselineData = async () => {
    try {
      const response = await fetch('http://localhost:8000/baseline')
      if (response.ok) {
        const data = await response.json()
        setCfvStartDate(data.baseline.cfv_start_date)
        setCfvEndDate(data.baseline.cfv_end_date)
      } else {
        console.log('Failed to fetch baseline data:', response.status)
      }
    } catch (error) {
      console.error('Failed to fetch baseline data:', error)
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
          fetchBaselineData()
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
    getuserinfo()
  }, [])

  useEffect(() => {
    fetchBaselineData()
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
              <tr>
                <td>XXX大樓5F</td>
                <td>10491台北市中山區建國北路三段42號4樓</td>
                <td>讚</td>
                <td>
                  <FontAwesomeIcon icon={faCircleCheck} className={styles.iconCorrect} />
                </td>
                <td>
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    className={styles.iconPen}
                    onClick={() => setEditModalVisible(true)}
                  />
                  <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                </td>
              </tr>
              <tr>
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
              </tr>
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
            <CFormInput className={styles.addinput} type="text" id="sitename" />

            <CFormLabel htmlFor="site" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
              場域地址
            </CFormLabel>
            <CFormInput className={styles.addinput} type="text" id="site" />

            <CFormLabel
              htmlFor="siteexplain"
              className={`col-sm-2 col-form-label ${styles.addlabel}`}
            >
              備註
            </CFormLabel>
            <CFormTextarea className={styles.addinput} type="text" id="siteexplain" rows={3} />

            <br />

            <CFormCheck id="sitetrue" label="列入盤查" />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton className="modalbutton1" onClick={() => setAddModalVisible(false)}>
            取消
          </CButton>
          <CButton className="modalbutton2">新增</CButton>
        </CModalFooter>
      </CModal>

      <CModal
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
            <CFormInput className="systeminput" type="text" id="sitename" />

            <CFormLabel htmlFor="site" className="col-sm-2 col-form-label systemlabel">
              場域地址
            </CFormLabel>
            <CFormInput className="systeminput" type="text" id="site" />

            <CFormLabel htmlFor="siteexplain" className="col-sm-2 col-form-label systemlabel">
              備註
            </CFormLabel>
            <CFormTextarea className="systeminput" type="text" id="siteexplain" rows={3} />

            <br />

            <CFormCheck id="sitetrue" label="列入盤查" />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton className="modalbutton1" onClick={() => setEditModalVisible(false)}>
            取消
          </CButton>
          <CButton className="modalbutton2">確認</CButton>
        </CModalFooter>
      </CModal>
    </main>
  )
}

export default Tabs
