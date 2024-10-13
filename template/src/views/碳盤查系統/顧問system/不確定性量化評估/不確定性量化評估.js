
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
                sourceClass: '類別1', sourceType: '逸散',
                activity: '23,802.50', activityUnit: '人小時',
                emiCoe1: 'CH4', emiCoeType: '自訂', emiCoeNum: '0.0000015938', emiCoeSource: 'GHG排放係數管理表(6.04版),CH4公噸人-年0.003825,換算成每工時0.0000015938~!係數單位:公噸-CH4/人-每工時',
                emiCoeUnit: 'TCH4/人小時', emiCoeClass: '國家排放係數', emiCoeEmission: '0.0379', emiCoeGWP: '條件不符合', emiCoeEqu: '',
                other1: '', other2: '', other3: '',
            }
        },
        {
            status: "completed", process: "冷媒補充", equipment: "家用冷凍、冷藏裝備", material: "HFC-134a/R-134a，四氟乙烷HFC-134a/R-1",
            details: {
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
                        <CTab aria-controls="tab1" itemKey={3} className="system-tablist-choose">排放源鑑別</CTab>
                    </Link>
                    <Link to="/碳盤查系統/顧問system/活動數據" className="system-tablist-link">
                        <CTab aria-controls="tab3" itemKey={4} className="system-tablist-choose">活動數據</CTab>
                    </Link>
                    <Link to="/碳盤查系統/顧問system/定量盤查" className="system-tablist-link">
                        <CTab aria-controls="tab3" itemKey={6} className="system-tablist-choose">定量盤查</CTab>
                    </Link>
                    <Link to="/碳盤查系統/顧問system/數據品質管理" className="system-tablist-link">
                        <CTab aria-controls="tab3" itemKey={5} className="system-tablist-choose">數據品質管理</CTab>
                    </Link>
                    <Link to="." className="system-tablist-link">
                        <CTab aria-controls="tab3" itemKey={1} className="system-tablist-choose">不確定性量化評估</CTab>
                    </Link>
                    <Link to="/碳盤查系統/顧問system/全廠電力蒸汽供需情況 " className="system-tablist-link">
                        <CTab aria-controls="tab3" itemKey={2} className="system-tablist-choose">全廠電力蒸汽供需情況</CTab>
                    </Link>

                </CTabList>
            </CTabs>


            <div className="system-titlediv">
                <div>
                    <h4 className="system-title">定量盤查</h4>
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
                                        <div><span>編號:</span><p>{selectedRowData.processNum}</p></div>
                                        <div><span>名稱:</span><p>{selectedRowData.processName}</p></div>

                                    </div>
                                </div>
                                <div className={styles.block}>
                                    <div className={styles.blockHead}>
                                        <h5>設備</h5>
                                    </div>
                                    <div className={styles.blockBody}>
                                        <div><span>編號:</span><p>{selectedRowData.equipNum}</p></div>
                                        <div><span>名稱:</span><p>{selectedRowData.equipName}</p></div>
                                    </div>
                                </div>
                                <div className={styles.block}>
                                    <div className={styles.blockHead}>
                                        <h5>原燃物料或產品</h5>
                                    </div>
                                    <div className={styles.blockBody}>

                                        <div><span>代碼:</span><p>{selectedRowData.matNum}</p></div>
                                        <div><span>名稱:</span><p>{selectedRowData.matName}</p></div>
                                        <div><span>是否屬生質能源:</span><p>{selectedRowData.matbio}</p></div>
                                    </div>
                                </div>
                                <div className={styles.block}>
                                    <div className={styles.blockHead}>
                                        <h5>排放源資料</h5>
                                    </div>
                                    <div className={styles.blockBody}>
                                        <div><span>類別別:</span><p>{selectedRowData.sourceClass}</p></div>
                                        <div><span>排放型式:</span><p>{selectedRowData.sourceType}</p></div>
                                    </div>
                                </div>

                                <div className={styles.block}>
                                    <div className={styles.blockHead}>
                                        <h5>活動數據</h5>
                                    </div>
                                    <div className={styles.blockBody}>
                                        <div><span>活動數據:</span><p>{selectedRowData.activity}</p></div>
                                        <div><span>單位:</span><p>{selectedRowData.activityUnit}</p></div>
                                    </div>
                                </div>
                                <div className={styles.block}>
                                    <div className={styles.blockHead}>
                                        <h5>排放係數數據</h5>
                                    </div>


                                    <div className={styles.blockBodySpecial}>
                                        <div className={styles.blockBodyTitle}>
                                            <div className={styles.line}></div>
                                            <div className={styles.titleBox}><span>溫室氣體#1:{selectedRowData.emiCoe1}</span></div>
                                            <div className={styles.line}></div>
                                        </div>
                                        <div className={styles.blockBody}>
                                            <div><span>係數類型:</span>
                                                <CFormSelect className={styles.input} value={selectedRowData.emiCoeType}
                                                    onChange={(e) => handleInputChange(e, 'emiCoeType')}>
                                                    <option value="預設">預設</option>
                                                    <option value="自訂">自訂</option>
                                                </CFormSelect>
                                            </div>
                                            <div><span>{selectedRowData.emiCoeType === "自訂" ? "自訂排放係數" : "預設排放係數"}</span><p>{selectedRowData.emiCoeNum}</p></div>
                                            <div><span>{selectedRowData.emiCoeType === "自訂" ? "自訂排放來源" : "預設排放來源"}</span><p>{selectedRowData.emiCoeSource}</p></div>
                                            <div><span>係數單位:</span><p>{selectedRowData.emiCoeUnit}</p></div>
                                            <div><span>係數種類:</span>
                                                <CFormSelect className={styles.input} value={selectedRowData.emiCoeClass}
                                                    onChange={(e) => handleInputChange(e, 'emiCoeClass')}>
                                                    <option value="自廠發展係數/質量平衡所得係數">自廠發展係數/質量平衡所得係數</option>
                                                    <option value="同製程/設備經驗係數">同製程/設備經驗係數</option>
                                                    <option value="製造廠提供係數">製造廠提供係數</option>
                                                    <option value="區域排放係數">區域排放係數</option>
                                                    <option value="國家排放係數">國家排放係數</option>
                                                    <option value="國際排放係數">國際排放係數</option>
                                                </CFormSelect>
                                            </div>
                                            <div><span>排放量(公噸/年):</span><p>{selectedRowData.emiCoeEmission}</p></div>
                                            <div><span>GWP:</span><p>{selectedRowData.emiCoeEmission}</p></div>
                                            <div><span>排放當量(公噸CO2e/年):</span><p>{selectedRowData.emiCoeEqu}</p></div>
                                        </div>
                                        <hr />
                                    </div>
                                    


                                </div>

                                <div className={styles.block}>
                                    <div className={styles.blockHead}>
                                        <h5>其他</h5>
                                    </div>
                                    <div className={styles.blockBody1}>
                                        <div><span>單一排放源排放當量小計(CO2e公噸/年):</span><p>{selectedRowData.other1}</p></div>
                                        <div><span>單一排放源生質燃料之CO2排放當量小計(CO2e公噸/年):</span><p>{selectedRowData.other2}</p></div>
                                        <div><span>單一排放源占排放總量比(%):</span><p>{selectedRowData.other3}</p></div>
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

