// functions.js
import React, { useState } from 'react'; // 確保引入 useState
import {
    CTable, CTableHead, CTableBody, CFormSelect, CModal, CModalBody, CModalFooter, CModalHeader, CForm, CButton,
    CFormLabel, CFormInput, CFormTextarea, CRow, CCol,CCollapse,CCard,CCardBody
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import styles from '../../../../scss/活動數據盤點.module.css';
import EditModal from './活動數據盤點編輯modal.js';


import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

export const FunctionOne = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const currentFunction = 'one'; // 定義 currentFunction

    return (
        <div>
            <CTable hover className={styles.activityTable1}>
                <CTableHead className={styles.activityTableHead}>
                    <tr>
                        <th>發票/收據日期</th>
                        <th>發票號碼/收據編號</th>
                        <th>油種</th>
                        <th>單位</th>
                        <th>公升數/金額</th>
                        <th>備註</th>
                        <th>圖片</th>
                        <th>最近編輯</th>
                        <th>操作</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.activityTableBody}>
                    <tr>
                        <td>2023/01/15</td>
                        <td>XXXXX</td>
                        <td>柴油</td>
                        <td>公升</td>
                        <td>XXXXXX</td>
                        <td>讚</td>
                        <td><Zoom><img src="https://i.pinimg.com/564x/2a/4c/cb/2a4ccb65cc3cc47bbccca96dd230bd22.jpg" alt="image" /></Zoom></td>
                        <td>蔡沂庭<br />2024/10/16 12:09</td>
                        <td>
                            <FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} onClick={() => setEditModalVisible(true)} />
                            <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                        </td>
                    </tr>
                </CTableBody>
            </CTable>
            <EditModal
                isEditModalVisible={isEditModalVisible}
                setEditModalVisible={setEditModalVisible}
                currentFunction={currentFunction}
            />
        </div>
    );
};

export const FunctionTwo = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null); // 用於追蹤展開的列
    const currentFunction = 'two';

    const [isEditFillVisible, setEditFillVisible] = useState(false);
    const editFillClose = () => setEditFillVisible(false);
    const [isAddFillVisible, setAddFillVisible] = useState(false);
    const addFillClose = () => setAddFillVisible(false);

    const mockData = [
        {
            id: 1,
            date: '2023/01/15',
            invoiceNumber: '12345',
            productName: '產品A',
            ingredient: 'CO2',
            spec: '500g',
            note: '無',
            imageUrl: 'https://i.pinimg.com/564x/35/a9/aa/35a9aa483e73b94c8b8605ed9107a381.jpg',
            lastEditor: '蔡沂庭',
            lastEditDate: '2024/10/16 12:09'
        },
        {
            id: 2,
            date: '2023/02/20',
            invoiceNumber: '67890',
            productName: '產品B',
            ingredient: 'H2O',
            spec: '250ml',
            note: '重要',
            imageUrl: 'https://i.pinimg.com/564x/35/a9/aa/35a9aa483e73b94c8b8605ed9107a381.jpg',
            lastEditor: '張偉',
            lastEditDate: '2024/10/17 09:15'
        },
        // 可以添加更多假資料
    ];

    const toggleRow = (index) => {
        setSelectedRow(selectedRow === index ? null : index);
    };

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
                    {mockData.map((item, index) => (
                        <React.Fragment key={item.id}>
                            <tr onClick={() => toggleRow(index)} className={styles.trChoose}>
                                <td>{item.productName}</td>
                                <td>{item.ingredient}</td>
                                <td>{item.spec}</td>
                                <td>{item.note}</td>
                                <td><Zoom><img src={item.imageUrl} alt="image" /></Zoom></td>
                                <td>{item.lastEditor}<br />{item.lastEditDate}</td>
                                <td>
                                    <FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} onClick={() => setEditModalVisible(true)} />
                                    <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                                </td>
                            </tr>
                            {selectedRow === index && (
                                <td colSpan="9">
                                    <div className={styles.expandedContent}>
                                        {/* 在展開的區塊中放置你需要的內容 */}
                                        <div className={styles.fill}>
                                            <div>填充紀錄</div>
                                            <button onClick={() => setAddFillVisible(true)}>新增</button>
                                        </div>
                                        <table>
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
                                                <td>2023/01/15</td>
                                                <td>XXXXX</td>
                                                <td>XXX</td>
                                                <td>讚</td>
                                                <td><Zoom><img src="https://i.pinimg.com/564x/f3/d9/27/f3d92764f7e4d8ab25835b39f20e2e0f.jpg" alt="image" /></Zoom></td>
                                                <td>蔡沂庭<br />2024/10/16 12:09</td>
                                                <td>
                                                    <FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} onClick={() => setEditFillVisible(true)} />
                                                    <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                                                </td>
                                            </tr>
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
            />


            {/* 填充新增編輯modal */}
            <CModal visible={isEditFillVisible} onClose={editFillClose} className={styles.modal}>
                <CModalHeader>
                    <h5><b>編輯填充紀錄</b></h5>
                </CModalHeader>
                <CForm>
                    <CModalBody>
                        <div className={styles.addmodal}>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="month" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票/收據日期*</CFormLabel>
                                <CCol><CFormInput className={styles.addinput} type="date" id="date" required />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="num" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票號碼/收據編號*</CFormLabel>
                                <CCol>
                                    <CFormInput className={styles.addinput} type="text" id="num" required />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="num" className={`col-sm-2 col-form-label ${styles.addlabel}`} >填充量*</CFormLabel>
                                <CCol>
                                    <CFormInput className={styles.addinput} type="number" id="num" required />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="explain" className={`col-sm-2 col-form-label ${styles.addlabel}`} >備註</CFormLabel>
                                <CCol>
                                    <CFormTextarea className={styles.addinput} type="text" id="explain" rows={3} />

                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="photo" className={`col-sm-2 col-form-label ${styles.addlabel}`} >圖片*</CFormLabel>
                                <CCol>
                                    <CFormInput type="file" id="photo" required />
                                </CCol>
                            </CRow>
                            <br />
                            <div style={{ textAlign: 'center' }}>*為必填欄位</div>

                        </div>
                    </CModalBody>
                    <CModalFooter>
                        <CButton className="modalbutton1" onClick={editFillClose}>取消</CButton>
                        <CButton className="modalbutton2" type="submit">儲存</CButton>
                    </CModalFooter>
                </CForm>
            </CModal>

            <CModal visible={isAddFillVisible} onClose={addFillClose} className={styles.modal}>
                <CModalHeader>
                    <h5><b>新增填充紀錄</b></h5>
                </CModalHeader>
                <CForm>
                    <CModalBody>
                        <div className={styles.addmodal}>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="month" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票/收據日期*</CFormLabel>
                                <CCol><CFormInput className={styles.addinput} type="date" id="date" required />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="num" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票號碼/收據編號*</CFormLabel>
                                <CCol>
                                    <CFormInput className={styles.addinput} type="text" id="num" required />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="num" className={`col-sm-2 col-form-label ${styles.addlabel}`} >填充量*</CFormLabel>
                                <CCol>
                                    <CFormInput className={styles.addinput} type="number" id="num" required />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="explain" className={`col-sm-2 col-form-label ${styles.addlabel}`} >備註</CFormLabel>
                                <CCol>
                                    <CFormTextarea className={styles.addinput} type="text" id="explain" rows={3} />

                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="photo" className={`col-sm-2 col-form-label ${styles.addlabel}`} >圖片*</CFormLabel>
                                <CCol>
                                    <CFormInput type="file" id="photo" required />
                                </CCol>
                            </CRow>
                            <br />
                            <div style={{ textAlign: 'center' }}>*為必填欄位</div>

                        </div>
                    </CModalBody>
                    <CModalFooter>
                        <CButton className="modalbutton1" onClick={addFillClose}>取消</CButton>
                        <CButton className="modalbutton2" type="submit">儲存</CButton>
                    </CModalFooter>
                </CForm>
            </CModal>


        </div>
    );
};

export const FunctionThree = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const currentFunction = 'three'; // 定義 currentFunction

    return (
        <div>
            <CTable hover className={styles.activityTable1}>
                <CTableHead className={styles.activityTableHead}>
                    <tr>
                        <th>月份</th>
                        <th>員工數</th>
                        <th>每日工時</th>
                        <th>每月工作日數</th>
                        <th>總加班時數</th>
                        <th>總病假時數</th>
                        <th>總事假時數</th>
                        <th>總出差時數</th>
                        <th>總婚喪時數</th>
                        <th>總特休時數</th>
                        <th>備註</th>
                        <th>圖片</th>
                        <th>操作</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.activityTableBody}>
                    <tr>
                        <td>一月</td>
                        <td>24</td>
                        <td>8</td>
                        <td>22</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>讚</td>
                        <td><Zoom><img src="https://i.pinimg.com/564x/35/a9/aa/35a9aa483e73b94c8b8605ed9107a381.jpg" alt="image" /></Zoom></td>
                        <td>
                            <FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} onClick={() => setEditModalVisible(true)} />
                            <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                        </td>
                    </tr>
                </CTableBody>
            </CTable>
            <EditModal
                isEditModalVisible={isEditModalVisible}
                setEditModalVisible={setEditModalVisible}
                currentFunction={currentFunction}
            />
        </div>
    );
};

export const FunctionFour = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const currentFunction = 'four'; // 定義 currentFunction

    return (
        <div>
            <CTable hover className={styles.activityTableShort}>
                <CTableHead className={styles.activityTableHead}>
                    <tr>
                        <th>月份</th>
                        <th>人數</th>
                        <th>總工作時數</th>
                        <th>總工作人天</th>
                        <th>備註</th>
                        <th>圖片</th>
                        <th>操作</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.activityTableBody}>
                    <tr>
                        <td>一月</td>
                        <td>24</td>
                        <td>8</td>
                        <td>22</td>
                        <td>讚</td>
                        <td><Zoom><img src="https://i.pinimg.com/736x/5d/a8/60/5da8608aab2a2ebb0bb9e56ee9401414.jpg" alt="image" /></Zoom></td>
                        <td>
                            <FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} onClick={() => setEditModalVisible(true)} />
                            <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                        </td>
                    </tr>
                </CTableBody>
            </CTable>
            <EditModal
                isEditModalVisible={isEditModalVisible}
                setEditModalVisible={setEditModalVisible}
                currentFunction={currentFunction}
            />
        </div>
    );
};

export const FunctionFive = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null); // 用於追蹤展開的列
    const currentFunction = 'five';

    const [isEditFillVisible, setEditFillVisible] = useState(false);
    const editFillClose = () => setEditFillVisible(false);
    const [isAddFillVisible, setAddFillVisible] = useState(false);
    const addFillClose = () => setAddFillVisible(false);

    const mockData = [
        {
            id: 1,
            equipmentType: '冰箱',
            location: 'XXX',
            refrigerantType: 'R11',
            note: '讚',
            imageUrl: 'https://i.pinimg.com/736x/c9/be/70/c9be70ef20f18513f025856d69034dcb.jpg',
            lastEditor: '蔡沂庭',
            lastEditDate: '2024/10/16 12:09'
        },
        {
            id: 1,
            equipmentType: '冷氣',
            location: 'XXX',
            refrigerantType: 'R11',
            note: '讚',
            imageUrl: 'https://i.pinimg.com/736x/c9/be/70/c9be70ef20f18513f025856d69034dcb.jpg',
            lastEditor: '張偉',
            lastEditDate: '2024/10/16 12:09'
        },
        // 可以添加更多假資料
    ];

    const toggleRow = (index) => {
        setSelectedRow(selectedRow === index ? null : index);
    };

    const [collapseVisible, setCollapseVisible] = useState(false)

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
                    {mockData.map((item, index) => (
                        <React.Fragment key={item.id}>
                            <tr onClick={() => toggleRow(index)} className={styles.trChoose}>
                                <td>{item.equipmentType}</td>
                                <td>{item.location}</td>
                                <td>{item.refrigerantType}</td>
                                <td>{item.note}</td>
                                <td><Zoom><img src={item.imageUrl} alt="image" /></Zoom></td>
                                <td>{item.lastEditor}<br />{item.lastEditDate}</td>
                                <td>
                                    <FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} onClick={() => setEditModalVisible(true)} />
                                    <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                                </td>
                            </tr>
                            {selectedRow === index && (
                                <td colSpan="7">
                                    <div className={styles.expandedContent}>
                                        {/* 在展開的區塊中放置你需要的內容 */}
                                        <div className={styles.fill}>
                                            <div>填充紀錄</div>
                                            <button onClick={() => setAddFillVisible(true)}>新增</button>
                                        </div>
                                        <table>
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
                                            <tr>
                                                <td>2023/01/15</td>
                                                <td>XXXXX</td>
                                                <td>XXX</td>
                                                <td>XXX</td>
                                                <td>讚</td>
                                                <td><Zoom><img src="https://i.pinimg.com/564x/f3/d9/27/f3d92764f7e4d8ab25835b39f20e2e0f.jpg" alt="image" /></Zoom></td>
                                                <td>蔡沂庭<br />2024/10/16 12:09</td>
                                                <td>
                                                    <FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} onClick={() => setEditFillVisible(true)} />
                                                    <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                                                </td>
                                            </tr>
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
            />


            {/* 填充新增編輯modal */}
            <CModal visible={isEditFillVisible} onClose={editFillClose} className={styles.modal}>
                <CModalHeader>
                    <h5><b>編輯填充紀錄</b></h5>
                </CModalHeader>
                <CForm>
                    <CModalBody>
                        <div className={styles.addmodal}>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="month" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票/收據日期*</CFormLabel>
                                <CCol><CFormInput className={styles.addinput} type="date" id="date" required /></CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="num" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票號碼/收據編號*</CFormLabel>
                                <CCol><CFormInput className={styles.addinput} type="text" id="num" required /></CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="num" className={`col-sm-2 col-form-label ${styles.addlabel}`} >填充量*</CFormLabel>
                                <CCol><CFormInput className={styles.addinput} type="number" id="num" required /></CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="percent" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    逸散率<br /><span className={styles.Note2} onClick={() => setCollapseVisible(!collapseVisible)}>逸散率(%)建議表格</span></CFormLabel>
                                <CCol>
                                    <CFormInput className={styles.addinput} type="number" min='0' id="percent" required />
                                </CCol>
                                <CCollapse visible={collapseVisible}>
                                    <CCard className="mt-3">
                                        <CCardBody>
                                            <img src='/src/assets/images/逸散率建議表格.png' />
                                        </CCardBody>
                                    </CCard>
                                </CCollapse>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="explain" className={`col-sm-2 col-form-label ${styles.addlabel}`} >備註</CFormLabel>
                                <CCol><CFormTextarea className={styles.addinput} type="text" id="explain" rows={3} /></CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="photo" className={`col-sm-2 col-form-label ${styles.addlabel}`} >圖片*</CFormLabel>
                                <CCol><CFormInput type="file" id="photo" required /></CCol>
                            </CRow>
                            <br />
                            <div style={{ textAlign: 'center' }}>*為必填欄位</div>
                        </div>
                    </CModalBody>
                    <CModalFooter>
                        <CButton className="modalbutton1" onClick={editFillClose}>取消</CButton>
                        <CButton className="modalbutton2" type="submit">儲存</CButton>
                    </CModalFooter>
                </CForm>
            </CModal>

            <CModal visible={isAddFillVisible} onClose={addFillClose} className={styles.modal}>
                <CModalHeader>
                    <h5><b>新增填充紀錄</b></h5>
                </CModalHeader>
                <CForm>
                    <CModalBody>
                        <div className={styles.addmodal}>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="month" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票/收據日期*</CFormLabel>
                                <CCol><CFormInput className={styles.addinput} type="date" id="date" required /></CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="num" className={`col-sm-2 col-form-label ${styles.addlabel}`} >發票號碼/收據編號*</CFormLabel>
                                <CCol><CFormInput className={styles.addinput} type="text" id="num" required /></CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="num" className={`col-sm-2 col-form-label ${styles.addlabel}`} >填充量*</CFormLabel>
                                <CCol><CFormInput className={styles.addinput} type="number" id="num" required /></CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="percent" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                                    逸散率<br /><span className={styles.Note2} onClick={() => setCollapseVisible(!collapseVisible)}>逸散率(%)建議表格</span></CFormLabel>
                                <CCol>
                                    <CFormInput className={styles.addinput} type="number" min='0' id="percent" required />
                                </CCol>
                                <CCollapse visible={collapseVisible}>
                                    <CCard className="mt-3">
                                        <CCardBody>
                                            <img src='/src/assets/images/逸散率建議表格.png' />
                                        </CCardBody>
                                    </CCard>
                                </CCollapse>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="explain" className={`col-sm-2 col-form-label ${styles.addlabel}`} >備註</CFormLabel>
                                <CCol><CFormTextarea className={styles.addinput} type="text" id="explain" rows={3} /></CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="photo" className={`col-sm-2 col-form-label ${styles.addlabel}`} >圖片*</CFormLabel>
                                <CCol><CFormInput type="file" id="photo" required /></CCol>
                            </CRow>
                            <br />
                            <div style={{ textAlign: 'center' }}>*為必填欄位</div>
                        </div>
                    </CModalBody>
                    <CModalFooter>
                        <CButton className="modalbutton1" onClick={addFillClose}>取消</CButton>
                        <CButton className="modalbutton2" type="submit">新增</CButton>
                    </CModalFooter>
                </CForm>
            </CModal>

        </div>
    )
};

export const FunctionSix = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const currentFunction = 'six'; // 定義 currentFunction

    return (
        <div>
            <CTable hover className={styles.activityTable1}>
                <CTableHead className={styles.activityTableHead}>
                    <tr>
                        <th>發票/收據日期</th>
                        <th>發票號碼/收據編號</th>
                        <th>設備位置 </th>
                        <th>能源類型</th>
                        <th>使用量</th>
                        <th>備註</th>
                        <th>圖片</th>
                        <th>最近編輯</th>
                        <th>操作</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.activityTableBody}>
                    <tr>
                        <td>1月</td>
                        <td>XXXXX</td>
                        <td>XXX</td>
                        <td>柴油</td>
                        <td>XXX</td>
                        <td>讚</td>
                        <td><Zoom><img src="https://i.pinimg.com/564x/9c/30/c7/9c30c7c2e3d7b90544f4b3e3f59e3ca0.jpg" alt="image" /></Zoom></td>
                        <td>蔡沂庭<br />2024/10/16 12:09</td>
                        <td>
                            <FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} onClick={() => setEditModalVisible(true)} />
                            <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                        </td>
                    </tr>
                </CTableBody>
            </CTable>
            <EditModal
                isEditModalVisible={isEditModalVisible}
                setEditModalVisible={setEditModalVisible}
                currentFunction={currentFunction}
            />
        </div>
    );
};

export const FunctionSeven = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const currentFunction = 'seven'; // 定義 currentFunction

    return (
        <div>
            <CTable hover className={styles.activityTableShort}>
                <CTableHead className={styles.activityTableHead}>
                    <tr>
                        <th>發票/收據日期</th>
                        <th>發票號碼/收據編號</th>
                        <th>使用量(公升)</th>
                        <th>備註</th>
                        <th>圖片</th>
                        <th>最近編輯</th>
                        <th>操作</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.activityTableBody}>
                    <tr>
                        <td>2023/01/15</td>
                        <td>XXXXX</td>
                        <td>XXX</td>
                        <td>讚</td>
                        <td><Zoom><img src="https://i.pinimg.com/564x/d3/40/13/d340135e73f8ffcc48667c3063fb9f25.jpg" alt="image" /></Zoom></td>
                        <td>蔡沂庭<br />2024/10/16 12:09</td>
                        <td>
                            <FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} onClick={() => setEditModalVisible(true)} />
                            <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                        </td>
                    </tr>
                </CTableBody>
            </CTable>
            <EditModal
                isEditModalVisible={isEditModalVisible}
                setEditModalVisible={setEditModalVisible}
                currentFunction={currentFunction}
            />
        </div>
    );
};

export const FunctionEight = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const currentFunction = 'eight'; // 定義 currentFunction

    return (
        <div>
            <CTable hover className={styles.activityTableLong}>
                <CTableHead className={styles.activityTableHead}>
                    <tr>
                        <th>收據月份</th>
                        <th>收據編號</th>
                        <th>用電期間(起)</th>
                        <th>用電期間(迄)</th>
                        <th>填寫類型</th>
                        <th>尖峰度數</th>
                        <th>半尖峰度數</th>
                        <th>週六半尖峰度數</th>
                        <th>離峰度數</th>
                        <th>當月總用電量/總金額</th>
                        <th>備註</th>
                        <th>圖片</th>
                        <th>最近編輯</th>
                        <th>操作</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.activityTableBody}>
                    <tr>
                        <td>1月</td>
                        <td>XXXXX</td>
                        <td>2024/01/12</td>
                        <td>2024/02/12</td>
                        <td>用電度數</td>
                        <td>20600</td>
                        <td>20600</td>
                        <td>20600</td>
                        <td>20600</td>
                        <td>20600</td>
                        <td>讚</td>
                        <td><Zoom><img src="https://i.pinimg.com/564x/6a/e2/41/6ae2418f5b68d216f68e7ed2ab349e0c.jpg" alt="image" /></Zoom></td>
                        <td>蔡沂庭<br />2024/10/16 12:09</td>
                        <td>
                            <FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} onClick={() => setEditModalVisible(true)} />
                            <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                        </td>
                    </tr>
                </CTableBody>
            </CTable>
            <EditModal
                isEditModalVisible={isEditModalVisible}
                setEditModalVisible={setEditModalVisible}
                currentFunction={currentFunction}
            />
        </div>
    );
};

export const FunctionNine = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const currentFunction = 'nine'; // 定義 currentFunction

    return (
        <div>
            <CTable hover className={styles.activityTable1}>
                <CTableHead className={styles.activityTableHead}>
                    <tr>
                        <th>發票/收據日期</th>
                        <th>發票號碼/收據編號</th>
                        <th>設備類型</th>
                        <th>能源類型</th>
                        <th>使用量(公克)</th>
                        <th>備註</th>
                        <th>圖片</th>
                        <th>最近編輯</th>
                        <th>操作</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.activityTableBody}>
                    <tr>
                        <td>2023/01/15</td>
                        <td>XXXXX</td>
                        <td>XXX</td>
                        <td>柴油</td>
                        <td>XXX</td>
                        <td>讚</td>
                        <td><Zoom><img src="https://i.pinimg.com/564x/8b/7d/0c/8b7d0c88227abf5a237870b047677b4b.jpg" alt="image" /></Zoom></td>
                        <td>蔡沂庭<br />2024/10/16 12:09</td>
                        <td>
                            <FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} onClick={() => setEditModalVisible(true)} />
                            <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                        </td>
                    </tr>
                </CTableBody>
            </CTable>
            <EditModal
                isEditModalVisible={isEditModalVisible}
                setEditModalVisible={setEditModalVisible}
                currentFunction={currentFunction}
            />
        </div>
    );
};

export const FunctionTen = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const currentFunction = 'ten'; // 定義 currentFunction

    return (
        <div>
            <CTable hover className={styles.activityTable1}>
                <CTableHead className={styles.activityTableHead}>
                    <tr>
                        <th>發票/收據日期</th>
                        <th>發票號碼/收據編號</th>
                        <th>使用原料</th>
                        <th>使用量(公克)</th>
                        <th>備註</th>
                        <th>圖片</th>
                        <th>最近編輯</th>
                        <th>操作</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.activityTableBody}>
                    <tr>
                        <td>2023/01/15</td>
                        <td>XXXXX</td>
                        <td>天然氣</td>
                        <td>XXX</td>
                        <td>讚</td>
                        <td><Zoom><img src="https://i.pinimg.com/564x/e7/c8/4a/e7c84a29e5b0d84c8230ea5fd487495b.jpg" alt="image" /></Zoom></td>
                        <td>蔡沂庭<br />2024/10/16 12:09</td>
                        <td>
                            <FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} onClick={() => setEditModalVisible(true)} />
                            <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                        </td>
                    </tr>
                </CTableBody>
            </CTable>
            <EditModal
                isEditModalVisible={isEditModalVisible}
                setEditModalVisible={setEditModalVisible}
                currentFunction={currentFunction}
            />
        </div>
    );
};

export const FunctionEleven = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const currentFunction = 'eleven'; // 定義 currentFunction

    return (
        <div>
            <CTable hover className={styles.activityTableLong}>
                <CTableHead className={styles.activityTableHead}>
                    <tr>
                        <th>發票/收據日期</th>
                        <th>發票號碼/收據編號</th>
                        <th>供應商</th>
                        <th>品名/型號/規格</th>
                        <th>含碳率C%</th>
                        <th>公斤/盒</th>
                        <th>數量(盒)</th>
                        <th>備註</th>
                        <th>圖片</th>
                        <th>最近編輯</th>
                        <th>操作</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.activityTableBody}>
                    <tr>
                        <td>2023/01/15</td>
                        <td>XXXXX</td>
                        <td>XXXXX</td>
                        <td>XXXXX</td>
                        <td>X</td>
                        <td>X</td>
                        <td>X</td>
                        <td>讚</td>
                        <td><Zoom><img src="https://i.pinimg.com/736x/cd/fb/de/cdfbde16d8860668c51c5a5e3b0ce482.jpg" alt="image" /></Zoom></td>
                        <td>蔡沂庭<br />2024/10/16 12:09</td>
                        <td>
                            <FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} onClick={() => setEditModalVisible(true)} />
                            <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                        </td>
                    </tr>
                </CTableBody>
            </CTable>
            <EditModal
                isEditModalVisible={isEditModalVisible}
                setEditModalVisible={setEditModalVisible}
                currentFunction={currentFunction}
            />
        </div>
    );
};

export const FunctionTwelve = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const currentFunction = 'twelve'; // 定義 currentFunction

    return (
        <div>
            <CTable hover className={styles.activityTable1}>
                <CTableHead className={styles.activityTableHead}>
                    <tr>
                        <th>發票/收據日期</th>
                        <th>發票號碼/收據編號</th>
                        <th>品名</th>
                        <th>填充量(公克)</th>
                        <th>備註</th>
                        <th>圖片</th>
                        <th>最近編輯</th>
                        <th>操作</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.activityTableBody}>
                    <tr>
                        <td>2023/01/15</td>
                        <td>XXXXX</td>
                        <td>XXXXX</td>
                        <td>X</td>
                        <td>讚</td>
                        <td><Zoom><img src="https://i.pinimg.com/564x/5a/7a/d6/5a7ad69d72d35dd45659fbf04bd96217.jpg" alt="image" /></Zoom></td>
                        <td>蔡沂庭<br />2024/10/16 12:09</td>
                        <td>
                            <FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} onClick={() => setEditModalVisible(true)} />
                            <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                        </td>
                    </tr>
                </CTableBody>
            </CTable>
            <EditModal
                isEditModalVisible={isEditModalVisible}
                setEditModalVisible={setEditModalVisible}
                currentFunction={currentFunction}
            />
        </div>
    );
};

export const FunctionThirteen = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const currentFunction = 'thirteen'; // 定義 currentFunction

    return (
        <div>
            <CTable hover className={styles.activityTableLong}>
                <CTableHead className={styles.activityTableHead}>
                    <tr>
                        <th>發票/收據日期</th>
                        <th>發票號碼/收據編號</th>
                        <th>主要燃料</th>
                        <th>間接蒸氣購買量</th>
                        <th>蒸氣供應商名稱</th>
                        <th>蒸氣排放係數</th>
                        <th>單位</th>
                        <th>備註</th>
                        <th>圖片</th>
                        <th>最近編輯</th>
                        <th>操作</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.activityTableBody}>
                    <tr>
                        <td>2023/01/15</td>
                        <td>XXXXX</td>
                        <td>XXXXX</td>
                        <td>XXX</td>
                        <td>XXXXX</td>
                        <td>XXX</td>
                        <td>kg CO2e/kg蒸氣</td>
                        <td>讚</td>
                        <td><Zoom><img src="https://i.pinimg.com/564x/f3/d9/27/f3d92764f7e4d8ab25835b39f20e2e0f.jpg" alt="image" /></Zoom></td>
                        <td>蔡沂庭<br />2024/10/16 12:09</td>
                        <td>
                            <FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} onClick={() => setEditModalVisible(true)} />
                            <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                        </td>
                    </tr>
                </CTableBody>
            </CTable>
            <EditModal
                isEditModalVisible={isEditModalVisible}
                setEditModalVisible={setEditModalVisible}
                currentFunction={currentFunction}
            />
        </div>
    );
};

export const FunctionForteen = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const currentFunction = 'forteen'; // 定義 currentFunction

    return (
        <div>
            <CTable hover className={styles.activityTable1}>
                <CTableHead className={styles.activityTableHead}>
                    <tr>
                        <th>發票/收據日期</th>
                        <th>發票號碼/收據編號</th>
                        <th>原物料名稱</th>
                        <th>使用量</th>
                        <th>備註</th>
                        <th>圖片</th>
                        <th>最近編輯</th>
                        <th>操作</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.activityTableBody}>
                    <tr>
                        <td>2023/01/15</td>
                        <td>XXXXX</td>
                        <td>XXXXX</td>
                        <td>XXX</td>
                        <td>讚</td>
                        <td><Zoom><img src="https://i.pinimg.com/564x/37/80/8a/37808aacec53abf11e28412f452ffb20.jpg" alt="image" /></Zoom></td>
                        <td>蔡沂庭<br />2024/10/16 12:09</td>
                        <td>
                            <FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} onClick={() => setEditModalVisible(true)} />
                            <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                        </td>
                    </tr>
                </CTableBody>
            </CTable>
            <EditModal
                isEditModalVisible={isEditModalVisible}
                setEditModalVisible={setEditModalVisible}
                currentFunction={currentFunction}
            />
        </div>
    );
};


