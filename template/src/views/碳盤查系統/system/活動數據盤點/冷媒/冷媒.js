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

export const Refrigerant = () => {
  const [isEditModalVisible, setEditModalVisible] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null) // 用於追蹤展開的列
  const currentFunction = 'Refrigerant'

  const [isAddFillModalVisible, setAddFillModalVisible] = useState(false)
  const [isEditFillModalVisible, setEditFillModalVisible] = useState(false)

  const[selectedRefId, setSelectedRefId] = useState(null)
  const[selectedFillId, setSelectedFillId] = useState(null)
  const[selectedRef, setSelectedRef] = useState(null)

  const device_type_Map = {
    1: '冷氣機', // Replace with actual device_type names
    2: '飲水機',
    3: '車用冷媒',
    4: '其他',
  }

  const refrigerant_type_Map = {
    1: 'R11', // Replace with actual refrigerant_type names
    2: 'R12',
    3: 'R22',
    4: 'R-32',
    5: 'R-123',
    6: 'R-23',
    7: 'R-134a',
    8: 'R-404A',
    9: 'R-407C',
    10: 'R-410A',
    11: 'R-600a',
    12: 'R-417a',
    13: 'F22',
    14: 'HCR-600A',
    15: 'HFC-134a',
    16: 'R401A',
    17: '其他',
  }

  const [refrigerants, setRefrigerants] = useState([]) // State to hold fetched refrigerant data
  // Function to fetch refrigerant data
  const getRefrigerantData = async () => {
    try {
      const response = await fetch('http://localhost:8000/refrigerant', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      if (response.ok) {
        setRefrigerants(data.refrigerants) // Set refrigerant data to state
      } else {
        console.error(`Error ${response.status}: ${data.detail}`)
      }
    } catch (error) {
      console.error('Error fetching refrigerant data:', error)
    }
  }

  // Fetch refrigerant data on component mount
  useEffect(() => {
    getRefrigerantData()
  }, [])

  const toggleRow = (index) => {
    setSelectedRow(selectedRow === index ? null : index)
  }

  return (
    <div>
      <CTable hover className={styles.activityTable1}>
        <CTableHead className={styles.activityTableHead}>
          <tr>
            <th>設備類型</th>
            <th>設備位置</th>
            <th>冷媒類型</th>
            <th>備註</th>
            <th>圖片</th>
            <th>最近編輯</th>
            <th>操作</th>
          </tr>
        </CTableHead>
        <CTableBody className={styles.activityTableBody}>
          {refrigerants.map((refrigerant, refrigerant_id) => (
            <React.Fragment key={refrigerant.refrigerant_id}>
              <tr onClick={() => toggleRow(refrigerant_id)} className={styles.trChoose}>
                <td>{device_type_Map[refrigerant.device_type]}</td>
                <td>{refrigerant.device_location}</td>
                <td>{refrigerant_type_Map[refrigerant.refrigerant_type]}</td>
                <td>{refrigerant.remark}</td>
                <td>
                  <Zoom>
                    <img
                      src={`fastapi/${refrigerant.img_path}`}
                      alt="receipt"
                      style={{ width: '100px' }}
                    />
                  </Zoom>
                </td>
                <td>
                  {refrigerant.username}
                  <br />
                  {refrigerant.edit_time}
                </td>
                <td>
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    className={styles.iconPen}
                    onClick={() => 
                      {setEditModalVisible(true)
                      setSelectedRef(refrigerant.refrigerant_id)
                      }}
                  />
                  <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                </td>
              </tr>
              {selectedRow === refrigerant_id && (
                <td colSpan="7">
                  <div className={styles.expandedContent}>
                    {/* 在展開的區塊中放置你需要的內容 */}
                    <div className={styles.fill}>
                      <div>填充紀錄</div>
                      <button onClick={() => {
                        setAddFillModalVisible(true)
                        const selectedRefId = refrigerant.refrigerant_id
                        setSelectedRefId(selectedRefId)
                        console.log(selectedRefId)
                        }}>新增</button>
                    </div>
                    <table>
                      {refrigerant.fillrec && refrigerant.fillrec.length > 0 && (
                        <>
                          <tr>
                            <th>發票/收據日期</th>
                            <th>發票號碼/收據編號</th>
                            <th>填充量</th>
                            <th>逸散率(%)</th>
                            <th>備註</th>
                            <th>圖片</th>
                            <th>最近編輯</th>
                            <th>操作</th>
                          </tr>
                          {refrigerant.fillrec.map((fill, index) => (
                            <tr key={fill.fillrec_id}>
                              <td>{fill.Doc_date}</td>
                              <td>{fill.Doc_number}</td>
                              <td>{fill.usage}</td>
                              <td>{fill.escape_rate}</td>
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
                                  onClick={() => 
                                    {setEditFillModalVisible(true)
                                    setSelectedFillId(fill.fillrec_id)
                                    }}
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
        currentFunction={currentFunction}
        selectedRef={selectedRef}
      />

      {/* 填充新增編輯modal */}
      <AddFillModal
        isAddFillModalVisible={isAddFillModalVisible}
        setAddFillModalVisible={setAddFillModalVisible}
        selectedRefId={selectedRefId}
      />

      <EditFillModal
        isEditFillModalVisible={isEditFillModalVisible}
        setEditFillModalVisible={setEditFillModalVisible}
        selectedFillId={selectedFillId}
      />
    </div>
  )
}
