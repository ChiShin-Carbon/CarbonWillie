// functions.js
import React, { useState, useEffect } from 'react'
import {
  CTable,
  CTableHead,
  CTableBody,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CForm,
  CButton,
  CFormLabel,
  CFormInput,
  CFormTextarea,
  CRow,
  CCol,
  CCollapse,
  CCard,
  CCardBody,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import styles from '../../../../../scss/活動數據盤點.module.css'
import EditModal from './編輯Modal.js'
import AddFillModal from './新增填充Modal.js'
import EditFillModal from './編輯填充Modal.js'

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

export const FireExtinguisher = () => {
  const [isEditModalVisible, setEditModalVisible] = useState(false)
  const [isAddFillModalVisible, setAddFillModalVisible] = useState(false)
  const [isEditFillModalVisible, setEditFillModalVisible] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null) // 用於追蹤展開的列

  const ingredientMap = {
    1: 'CO2', // Replace with actual ingredient names
    2: 'HFC-236ea',
    3: 'HFC-236fa',
    4: 'HFC-227ea',
    5: 'CF3CFCF3',
    6: 'CHF3',
    7: '其他',
  }

  const [extinguishers, setExtinguishers] = useState([]) // State to hold fetched extinguisher data
  // Function to fetch extinguisher data
  const getExtinguisherData = async () => {
    try {
      const response = await fetch('http://localhost:8000/extinguisher', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      if (response.ok) {
        setExtinguishers(data.extinguishers) // Set extinguisher data to state
      } else {
        console.error(`Error ${response.status}: ${data.detail}`)
      }
    } catch (error) {
      console.error('Error fetching extinguisher data:', error)
    }
  }

  // Fetch extinguisher data on component mount
  useEffect(() => {
    getExtinguisherData()
  }, [])

  const toggleRow = (index) => {
    setSelectedRow(selectedRow === index ? null : index)
  }

  return (
    <div>
      <CTable hover className={styles.activityTable1}>
        <CTableHead className={styles.activityTableHead}>
          <tr>
            <th>品名</th>
            <th>成分</th>
            <th>規格(重量)</th>
            <th>備註</th>
            <th>圖片</th>
            <th>最近編輯</th>
            <th>操作</th>
          </tr>
        </CTableHead>
        <CTableBody className={styles.activityTableBody}>
          {extinguishers.map((extinguisher, extinguisher_id) => (
            <React.Fragment key={extinguisher.extinguisher_id}>
              <tr onClick={() => toggleRow(extinguisher_id)} className={styles.trChoose}>
                <td>{extinguisher.item_name}</td>
                <td>{ingredientMap[extinguisher.ingredient]}</td>
                <td>{extinguisher.specification}</td>
                <td>{extinguisher.remark}</td>
                <td>
                  <Zoom>
                    <img
                      src={`fastapi/${extinguisher.img_path}`}
                      alt="receipt"
                      style={{ width: '100px' }}
                    />
                  </Zoom>
                </td>
                <td>
                  {extinguisher.username}
                  <br />
                  {extinguisher.edit_time}
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
              {selectedRow === extinguisher_id && (
                <td colSpan="9">
                  <div className={styles.expandedContent}>
                    {/* 在展開的區塊中放置你需要的內容 */}
                    <div className={styles.fill}>
                      <div>填充紀錄</div>
                      <button onClick={() => setAddFillModalVisible(true)}>新增</button>
                    </div>
                    <table>
                      {extinguisher.fillrec && extinguisher.fillrec.length > 0 && (
                        <>
                          <tr>
                            <th>發票/收據日期</th>
                            <th>發票號碼/收據編號</th>
                            <th>填充量</th>
                            <th>備註</th>
                            <th>圖片</th>
                            <th>最近編輯</th>
                            <th>操作</th>
                          </tr>
                          {extinguisher.fillrec.map((fill, index) => (
                            <tr key={fill.fillrec_id}>
                              <td>{fill.Doc_date}</td>
                              <td>{fill.Doc_number}</td>
                              <td>{fill.usage}</td>
                              <td>{fill.fillrec_remark}</td>
                              <td>
                                <Zoom>
                                  <img
                                    src={`fastapi/${fill.fillrec_img_path}`}
                                    alt="receipt"
                                    style={{ width: '100px' }}
                                  />
                                </Zoom>
                              </td>
                              <td>
                                {fill.fillrec_username}
                                <br />
                                {fill.fillrec_edit_time}
                              </td>
                              <td>
                                <FontAwesomeIcon
                                  icon={faPenToSquare}
                                  className={styles.iconPen}
                                  onClick={() => setEditFillModalVisible(true)}
                                />
                                <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                              </td>
                            </tr>
                          ))}
                        </>
                      )}
                    </table>
                  </div>
                </td>
              )}
            </React.Fragment>
          ))}
        </CTableBody>
      </CTable>
      <EditModal
        isEditModalVisible={isEditModalVisible}
        setEditModalVisible={setEditModalVisible}
      />

      {/* 填充新增編輯modal */}
      <AddFillModal
        isAddFillModalVisible={isAddFillModalVisible}
        setAddFillModalVisible={setAddFillModalVisible}
      />

      <EditFillModal
        isEditFillModalVisible={isEditFillModalVisible}
        setEditFillModalVisible={setEditFillModalVisible}
      />
    </div>
  )
}
