
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
                act95down: '', act95up: '', actSource: '', actUnit: '',
                green: 'CH4', greenNum: '', green95down: '', green95up: '', greenSource: '', greenUnit: '',
                single95down: '', single95up: '',
                singleEmi95down: '', singeEmi95up: '',
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

                                    </div>
                                </div>
                                <div className={styles.block}>
                                    <div className={styles.blockHead}>
                                        <h5>設備</h5>
                                    </div>
                                    <div className={styles.blockBody}>
                                        <div><span>編號:</span><p>{selectedRowData.equipNum}</p></div>
                                    </div>
                                </div>
                                <div className={styles.block}>
                                    <div className={styles.blockHead}>
                                        <h5>原燃物料或產品</h5>
                                    </div>
                                    <div className={styles.blockBody}>

                                        <div><span>代碼:</span><p>{selectedRowData.matCode}</p></div>
                                        <div><span>名稱:</span><p>{selectedRowData.matName}</p></div>
                                    </div>
                                </div>
                                <div className={styles.block}>
                                    <div className={styles.blockHead}>
                                        <h5>活動數據之不確定性</h5>
                                    </div>
                                    <div className={styles.blockBody}>
                                        <div><span>95%信賴區間之下限:</span>
                                            <CFormInput className={styles.input} value={selectedRowData.act95down}
                                                onChange={(e) => handleInputChange(e, 'act95down')} />
                                        </div>
                                        <div><span>95%信賴區間之上限:</span>
                                            <CFormInput className={styles.input} value={selectedRowData.act95up}
                                                onChange={(e) => handleInputChange(e, 'act95up')} />
                                        </div>
                                        <div><span>數據來源:</span>
                                            <CFormInput className={styles.input} value={selectedRowData.actSource}
                                                onChange={(e) => handleInputChange(e, 'actSource')} />
                                        </div>
                                        <div><span>活動數據保存單位:</span>
                                            <CFormInput className={styles.input} value={selectedRowData.actUnit}
                                                onChange={(e) => handleInputChange(e, 'actUnit')} />
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.block}>
                                    <div className={styles.blockHead}>
                                        <h5>排放係數不確定性</h5>
                                    </div>
                                    <div className={styles.blockBodySpecial}>
                                        <div className={styles.blockBodyTitle}>
                                            <div className={styles.line}></div>
                                            <div className={styles.titleBox}><span>溫室氣體#1</span></div>
                                            <div className={styles.line}></div>
                                        </div>
                                        <div className={styles.blockBody}>
                                            <div><span>溫室氣體:</span><p>{selectedRowData.green}</p></div>
                                            <div><span>溫室氣體排放當量(噸CO2e/年):</span><p>{selectedRowData.greenNum}</p></div>
                                            <div><span>95%信賴區間之下限:</span>
                                                <CFormInput className={styles.input} value={selectedRowData.green95down}
                                                    onChange={(e) => handleInputChange(e, 'green95down')} />
                                            </div>
                                            <div><span>95%信賴區間之上限:</span>
                                                <CFormInput className={styles.input} value={selectedRowData.green95up}
                                                    onChange={(e) => handleInputChange(e, 'green95up')} />
                                            </div>
                                            <div><span>係數不確定性資料來源:</span>
                                                <CFormInput className={styles.input} value={selectedRowData.greenSource}
                                                    onChange={(e) => handleInputChange(e, 'greenSource')} />
                                            </div>
                                            <div><span>排放係數保存單位:</span>
                                                <CFormInput className={styles.input} value={selectedRowData.greenUnit}
                                                    onChange={(e) => handleInputChange(e, 'greenUnit')} />
                                            </div>
                                            <div><span>單一溫室氣體不確定性<br/>95%信賴區間之下限:</span><p>{selectedRowData.single95down}</p></div>
                                            <div><span>單一溫室氣體不確定性<br/>95%信賴區間之上限:</span><p>{selectedRowData.single95up}</p></div>
                                        </div>
                                        <hr />
                                    </div>



                                </div>

                                <div className={styles.block}>
                                    <div className={styles.blockHead}>
                                        <h5>單一排放源不確定性</h5>
                                    </div>
                                    <div className={styles.blockBody}>
                                        <div><span>95%信賴區間之下限:</span><p>{selectedRowData.singeEmi95down}</p></div>
                                        <div><span>95%信賴區間之上限:</span><p>{selectedRowData.singeEmi95up}</p></div>
                                        
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

