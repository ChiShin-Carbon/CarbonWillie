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

  //   const mockData = [
  //     {
  //       id: 1,
  //       date: '2023/01/15',
  //       invoiceNumber: '12345',
  //       productName: '產品A',
  //       ingredient: 'CO2',
  //       spec: '500g',
  //       note: '無',
  //       imageUrl: 'https://i.pinimg.com/564x/35/a9/aa/35a9aa483e73b94c8b8605ed9107a381.jpg',
  //       lastEditor: '蔡沂庭',
  //       lastEditDate: '2024/10/16 12:09',
  //     },
  //     {
  //       id: 2,
  //       date: '2023/02/20',
  //       invoiceNumber: '67890',
  //       productName: '產品B',
  //       ingredient: 'H2O',
  //       spec: '250ml',
  //       note: '重要',
  //       imageUrl: 'https://i.pinimg.com/564x/35/a9/aa/35a9aa483e73b94c8b8605ed9107a381.jpg',
  //       lastEditor: '張偉',
  //       lastEditDate: '2024/10/17 09:15',
  //     },
  //     // 可以添加更多假資料
  //   ]

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
                <td>{extinguisher.ingredient}</td>
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
                  {extinguisher.user_id}
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
                      {extinguisher.fillrec && (
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
                          <tr>
                            <td>extinguisher.fillrec.Doc_date</td>
                            <td>extinguisher.fillrec.Doc_number</td>
                            <td>extinguisher.fillrec.usage</td>
                            <td>extinguisher.fillrec.remark</td>
                            <td>
                              <Zoom>
                                <img
                                  src="https://i.pinimg.com/564x/f3/d9/27/f3d92764f7e4d8ab25835b39f20e2e0f.jpg"
                                  alt="image"
                                />
                              </Zoom>
                            </td>
                            <td>
                              extinguisher.fillrec.user_id
                              <br />
                              extinguisher.fillrec.edit_time
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
