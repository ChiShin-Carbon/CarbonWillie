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

import { getRefrigerantData } from '../fetchdata.js'

export const Refrigerant = ({refreshRefrigerantData}) => {
  const [isEditModalVisible, setEditModalVisible] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null) // 用於追蹤展開的列
  const currentFunction = 'Refrigerant'

  const [isAddFillModalVisible, setAddFillModalVisible] = useState(false)
  const [isEditFillModalVisible, setEditFillModalVisible] = useState(false)

  const [selectedRefId, setSelectedRefId] = useState(null)
  const [selectedFillId, setSelectedFillId] = useState(null)
  const [selectedRef, setSelectedRef] = useState(null)

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

  // Add this function inside your Refrigerant component
  const toggleRow = (rowIndex) => {
    if (selectedRow === rowIndex) {
      // If the clicked row is already selected, close it
      setSelectedRow(null);
    } else {
      // Otherwise, select the clicked row
      setSelectedRow(rowIndex);
    }
  };

  const [refrigerants, setRefrigerants] = useState([]) // State to hold fetched refrigerant data

  // Fetch employee data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const data = await getRefrigerantData();
      if (data) {
        setRefrigerants(data);
      }
    };
    fetchData();
  }, []);

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
          {refrigerants.length > 0 ? (
            refrigerants.map((refrigerant, refrigerant_id) => (
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
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row toggle when clicking the edit icon
                        setEditModalVisible(true);
                        setSelectedRef(refrigerant.refrigerant_id);
                      }}
                    />
                    <FontAwesomeIcon
                      icon={faTrashCan}
                      className={styles.iconTrash}
                      onClick={(e) => e.stopPropagation()} // Prevent row toggle when clicking the trash icon
                    />
                  </td>
                </tr>
                {selectedRow === refrigerant_id && (
                  <tr>
                    <td colSpan="7">
                      <div className={styles.expandedContent}>
                        <div className={styles.fill}>
                          <div>填充紀錄</div>
                          <button onClick={() => {
                            setAddFillModalVisible(true);
                            const selectedRefId = refrigerant.refrigerant_id;
                            setSelectedRefId(selectedRefId);
                            console.log(selectedRefId);
                          }}>新增</button>
                        </div>
                        <table>
                          {refrigerant.fillrec && refrigerant.fillrec.length > 0 && (
                            <>
                              <thead>
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
                              </thead>
                              <tbody>
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
                                        onClick={(e) => {
                                          e.stopPropagation(); // Prevent row toggle
                                          setEditFillModalVisible(true);
                                          setSelectedFillId(fill.fillrec_id);
                                        }}
                                      />
                                      <FontAwesomeIcon
                                        icon={faTrashCan}
                                        className={styles.iconTrash}
                                        onClick={(e) => e.stopPropagation()} // Prevent row toggle
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </>
                          )}
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="14" className="text-center">目前沒有冷媒資料</td>
            </tr>
          )}
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
        refreshRefrigerantData={refreshRefrigerantData}
        />

      <EditFillModal
        isEditFillModalVisible={isEditFillModalVisible}
        setEditFillModalVisible={setEditFillModalVisible}
        selectedFillId={selectedFillId}
      />
    </div>
  )
}
