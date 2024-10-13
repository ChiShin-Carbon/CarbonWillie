
import React, { useState } from 'react'
import {
    CRow, CCol, CCard, CFormSelect, CTab, CTabList, CTabs,
    CTable, CTableBody, CTableHead, CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CButton, CFormCheck
    , CForm, CFormLabel, CFormInput, CFormTextarea,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilDataTransferDown } from '@coreui/icons'

import '../../../../scss/碳盤查系統.css'
import styles from '../../../../scss/顧問system.module.css'
import { Link } from 'react-router-dom'


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faCircleXmark, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';


const Tabs = () => {
    // 設定 state 來儲存選擇的行數據，初始值為 null
    const [selectedRowData, setSelectedRowData] = useState(null);

    // 模擬表格數據
    const tableData = [
        {
            status: "not completed", process: "水肥處理程序", equipment: "化糞池", material: "水肥",
            details: {
                processNum: 'G01', processCode: '370004', processName: '水肥處理程序',
                equipNum: 'GF01', equipCode: '9795', equipName: '化糞池',
                matCode: '36006', matName: '水肥', matbio: '否',
                sourceClass: '類別1', sourceType: '逸散', sourcePower: '化糞池排放源', sourceSupply: '',
                annual1: '23802.5', annual2: '100%', annual3: '人小時', annual4: '', annual5: '人事考勤系統',
                annual6: '管理部', annual7: '自行評估', annual8: '', annual9: 'Kcal/人小時',
                annual10: '', annual11: '',
                remark: '化糞池'
            }
        },
        {
            status: "completed", process: "冷媒補充", equipment: "家用冷凍、冷藏裝備", material: "HFC-134a/R-134a，四氟乙烷HFC-134a/R-1", details: {
                processNum: 'G02', processCode: 'G00099', processName: '冷媒補充',
                equipNum: 'GF02', equipCode: '4097', equipName: '家用冷凍、冷藏裝備',
                matCode: 'GG1835', matName: 'HFC-134a/R-134a，四氟乙烷HFC-134a/R-1', matbio: '否',
                sourceClass: '類別1', sourceType: '逸散', sourcePower: '溶劑、噴霧劑及冷媒排放源', sourceSupply: '',
                annual1: '0.00015', annual2: '0.3%', annual3: '千度', annual4: '', annual5: '冷媒銘牌填充量',
                annual6: '管理部', annual7: '自行評估', annual8: '', annual9: 'Kcal/千度',
                annual10: '', annual11: '',
                remark: '二樓冰箱，西屋/RT-5603GSC(2004出產)'
            }
        },
    ];


    const handleRowClick = (row) => {
        setSelectedRowData(row.details);
    };

    const handleInputChange = (e, field) => {
        const value = e.target.value;
        setSelectedRowData((prevData) => ({
            ...prevData,
            [field]: value,
            ...(field === 'annual3' && { annual9: `Kcal/${value}` }),

        }));
    };



    return (
        <main>
            <CTabs activeItemKey={1}>
                <CTabList variant="underline-border" className="system-tablist">
                    <Link to="/碳盤查系統/顧問system/排放源鑑別" className="system-tablist-link">
                        <CTab aria-controls="tab1" itemKey={4} className="system-tablist-choose">排放源鑑別</CTab>
                    </Link>
                    <Link to="." className="system-tablist-link">
                        <CTab aria-controls="tab3" itemKey={1} className="system-tablist-choose">活動數據</CTab>
                    </Link>
                    <Link to="/碳盤查系統/顧問system/定量盤查" className="system-tablist-link">
                        <CTab aria-controls="tab3" itemKey={2} className="system-tablist-choose">定量盤查</CTab>
                    </Link>
                    <Link to="/碳盤查系統/顧問system/數據品質管理" className="system-tablist-link">
                        <CTab aria-controls="tab3" itemKey={5} className="system-tablist-choose">數據品質管理</CTab>
                    </Link>
                    <Link to="/碳盤查系統/顧問system/不確定性量化評估" className="system-tablist-link">
                        <CTab aria-controls="tab3" itemKey={6} className="system-tablist-choose">不確定性量化評估</CTab>
                    </Link>
                    <Link to="/碳盤查系統/顧問system/全廠電力蒸汽供需情況 " className="system-tablist-link">
                        <CTab aria-controls="tab3" itemKey={3} className="system-tablist-choose">全廠電力蒸汽供需情況 </CTab>
                    </Link>
                    
                </CTabList>
            </CTabs>


            <div className="system-titlediv">
                <div>
                    <h4 className="system-title">活動數據</h4>
                    <hr className="system-hr"></hr>
                </div>
                {/* <button className="system-save">儲存</button> */}
            </div>
            <div className={styles.cardRow}>
                <CCard className={styles.card}>
                    <div className={styles.cardBody}>
                        <CTable hover className={styles.table}>
                            <CTableHead className={styles.tableHead}>
                                <tr>
                                    <th style={{ width: '15%' }}>填寫進度</th>
                                    <th>製程</th>
                                    <th>設備</th>
                                    <th>原燃物料或產品</th>
                                </tr>
                            </CTableHead>
                            <CTableBody className={styles.tableBody}>
                                {tableData.map((row, index) => (
                                    <tr key={index} onClick={() => handleRowClick(row)}>
                                        <td>
                                            <FontAwesomeIcon icon={row.status === "completed" ? faCircleCheck : faCircleXmark} className={row.status === "completed" ? styles.iconCorrect : styles.iconWrong} />
                                        </td>
                                        <td>{row.process}</td>
                                        <td>{row.equipment}</td>
                                        <td>{row.material}</td>
                                    </tr>
                                ))}

                            </CTableBody>
                        </CTable>
                    </div>

                    <div className={styles.submitTable}><button className={styles.button}>全部完成</button></div>

                </CCard>

                <CCard className={styles.card}>
                    {selectedRowData ? (
                        <>
                            <CForm>
                                <div className={styles.block}>
                                    <div className={styles.blockHead}>
                                        <h5>製程</h5>
                                    </div>
                                    <div className={styles.blockBody}>
                                        <div><span>編號:</span><p>{selectedRowData.processCode}</p></div>
                                        <div><span>代碼:</span><p>{selectedRowData.processNum}</p></div>
                                        <div><span>名稱:</span><p>{selectedRowData.processName}</p></div>

                                    </div>
                                </div>
                                <div className={styles.block}>
                                    <div className={styles.blockHead}>
                                        <h5>設備</h5>
                                    </div>
                                    <div className={styles.blockBody}>
                                        <div><span>編號:</span><p>{selectedRowData.equipCode}</p></div>
                                        <div><span>代碼:</span><p>{selectedRowData.equipNum}</p></div>
                                        <div><span>名稱:</span><p>{selectedRowData.equipName}</p></div>
                                    </div>
                                </div>
                                <div className={styles.block}>
                                    <div className={styles.blockHead}>
                                        <h5>原燃物料或產品</h5>
                                    </div>
                                    <div className={styles.blockBody}>

                                        <div><span>代碼:</span><p>{selectedRowData.matCode}</p></div>
                                        <div><span>名稱:</span><p>{selectedRowData.matName}</p></div>
                                        <div><span>是否屬生質能源:</span><p>{selectedRowData.matbio}</p></div>
                                    </div>
                                </div>
                                <div className={styles.block}>
                                    <div className={styles.blockHead}>
                                        <h5>排放源資料</h5>
                                    </div>
                                    <div className={styles.blockBody}>
                                        <div><span>範疇別:</span><p>{selectedRowData.sourceClass}</p></div>
                                        <div><span>排放型式:</span><p>{selectedRowData.sourceType}</p></div>
                                        <div><span>製程/逸散/外購電力類別:</span><p>{selectedRowData.sourcePower}</p></div>
                                        <div><span>電力/蒸汽供應商名稱:</span>
                                            <CFormInput className={styles.input} value={selectedRowData.sourceSupply}
                                                onChange={(e) => handleInputChange(e, 'sourceSupply')} />
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.block}>
                                    <div className={styles.blockHead}>
                                        <h5>年活動數據資訊</h5>
                                    </div>
                                    <div className={styles.blockBody}>
                                        <div><span>活動數據:</span>
                                            <CFormInput className={styles.input} value={selectedRowData.annual1}
                                                onChange={(e) => handleInputChange(e, 'annual1')} />
                                        </div>
                                        <div><span>活動數據分配比率%:</span>
                                            <CFormInput className={styles.input} value={selectedRowData.annual2}
                                                onChange={(e) => handleInputChange(e, 'annual2')} />
                                        </div>
                                        <div><span>活動數據單位:</span>
                                            <CFormSelect className={styles.input} value={selectedRowData.annual3}
                                                onChange={(e) => handleInputChange(e, 'annual3')}>
                                                <option value="公秉">公秉</option>
                                                <option value="千立方公尺">千立方公尺</option>
                                                <option value="千度">千度</option>
                                                <option value="人小時">人小時</option>
                                                <option value="tkm">tkm</option>
                                                <option value="pkm">pkm</option>
                                                <option value="tCO2e">tCO2e</option>
                                                <option value="其他">其他</option>
                                            </CFormSelect>
                                        </div>
                                        <div><span>其他單位名稱:</span>
                                            <CFormInput className={styles.input} value={selectedRowData.annual4}
                                                onChange={(e) => handleInputChange(e, 'annual4')} />
                                        </div>
                                        <div><span>數據來源表單名稱:</span>
                                            <CFormInput className={styles.input} value={selectedRowData.annual5}
                                                onChange={(e) => handleInputChange(e, 'annual5')} />
                                        </div>
                                        <div><span>保存單位:</span>
                                            <CFormInput className={styles.input} value={selectedRowData.annual6}
                                                onChange={(e) => handleInputChange(e, 'annual6')} />
                                        </div>
                                        <div><span>活動數據種類:</span>
                                            <CFormSelect className={styles.input} value={selectedRowData.annual7}
                                                onChange={(e) => handleInputChange(e, 'annual7')}>
                                                <option value="連續量測">連續量測</option>
                                                <option value="定期(間歇)量測">定期(間歇)量測</option>
                                                <option value="財務會計推估">財務會計推估</option>
                                                <option value="自行評估">自行評估</option>
                                            </CFormSelect>
                                        </div>
                                        <div><span>燃料熱值數值:</span>
                                            <CFormInput className={styles.input} value={selectedRowData.annual8}
                                                onChange={(e) => handleInputChange(e, 'annual8')} />
                                        </div>
                                        <div><span>燃料熱值單位:</span><p>{selectedRowData.annual9}</p></div>

                                        <div><span>含水量(%):</span>
                                            <CFormInput className={styles.input} value={selectedRowData.annual10}
                                                onChange={(e) => handleInputChange(e, 'annual10')} />
                                        </div>
                                        <div><span>含碳量(%):</span>
                                            <CFormInput className={styles.input} value={selectedRowData.annual11}
                                                onChange={(e) => handleInputChange(e, 'annual11')} />
                                        </div>

                                    </div>
                                </div>
                                <div className={styles.block}>
                                    <div className={styles.blockHead}>
                                        <h5>備註</h5>
                                    </div>
                                    <div className={styles.blockBody1}>
                                        <div>
                                            <CFormTextarea className={styles.input} type="text" rows={2} value={selectedRowData.remark}
                                                onChange={(e) => handleInputChange(e, 'remark')} />
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.submit}><button className={styles.button} type='submit'>儲存</button></div>
                            </CForm>
                        </>
                    ) : (
                        <div style={{ width: '100%', height: '100%', textAlign: 'center', alignContent: 'center', fontWeight: 'bold', fontSize: 'large' }}>
                            請選取內容!</div>
                    )}
                </CCard>
            </div>

        </main>

    );
}

export default Tabs;

