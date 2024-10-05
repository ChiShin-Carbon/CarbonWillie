
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
            status: "completed", process: "水肥處理程序", equipment: "化糞池", material: "水肥",
            details: {
                processNum: 'G01', processCode: '370004', processName: '水肥處理程序',
                equipNum: 'GF01', equipCode: '9795', equipName: '化糞池',
                matType: '原燃物料', matCode: '36006', matName: '水肥', matbio: 'no',
                sourceClass: '類別1', sourceType: '逸散', sourcePower: '化糞池排放源',
                steamEle: '否', remark: '化糞池'
            }
        },
        {
            status: "not completed", process: "冷媒補充", equipment: "家用冷凍、冷藏裝備", material: "HFC-134a", details: {
                processNum: 'G02', processCode: 'G00099', processName: '冷媒補充',
                equipNum: 'GF02', equipCode: '4097', equipName: '家用冷凍、冷藏裝備',
                matType: '原燃物料', matCode: 'GG1835', matName: 'HFC-134a/R-134a，四氟乙烷HFC-134a/R-1', matbio: 'no',
                sourceClass: '類別1', sourceType: '逸散', sourcePower: '其他',
                steamEle: '否', remark: '二樓冰箱，西屋/RT-5603GSC(2004出產)'
            }
        },
       
    ];

    // 點擊表格行時，更新選擇的行數據
    const handleRowClick = (row) => {
        setSelectedRowData(row.details);
    };

    return (
        <main>
            <CTabs activeItemKey={1}>
                <CTabList variant="underline-border" className="system-tablist">
                    <Link to="." className="system-tablist-link">
                        <CTab aria-controls="tab1" itemKey={1} className="system-tablist-choose">排放源鑑別</CTab>
                    </Link>
                    <Link to="/碳盤查系統/system/活動數據分配" className="system-tablist-link">
                        <CTab aria-controls="tab3" itemKey={4} className="system-tablist-choose">ddd</CTab>
                    </Link>
                    <Link to="/碳盤查系統/system/活動數據盤點" className="system-tablist-link">
                        <CTab aria-controls="tab3" itemKey={2} className="system-tablist-choose">ddd</CTab>
                    </Link>
                </CTabList>
            </CTabs>


            <div className="system-titlediv">
                <div>
                    <h4 className="system-title">排放源鑑別</h4>
                    <hr className="system-hr"></hr>
                </div>
                <button className="system-save">儲存</button>
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
                                        <div><span>類別:</span>
                                            <CFormSelect className={styles.input} value={selectedRowData.matType}>
                                                <option value="原燃物料">原燃物料</option>
                                                <option value="產品">產品</option>
                                            </CFormSelect><p></p></div>
                                        <div><span>代碼:</span><p>{selectedRowData.matCode}</p></div>
                                        <div><span>名稱:</span><p>{selectedRowData.matName}</p></div>
                                        <div><span>是否屬生質能源:</span>
                                            <CFormSelect className={styles.input} value={selectedRowData.matbio}>
                                                <option value="是">是</option>
                                                <option value="否">否</option>
                                            </CFormSelect><p></p></div>
                                    </div>
                                </div>
                                <div className={styles.block}>
                                    <div className={styles.blockHead}>
                                        <h5>排放源資料</h5>
                                    </div>
                                    <div className={styles.blockBody}>
                                        <div><span>類別:</span>
                                            <CFormSelect className={styles.input} value={selectedRowData.sourceClass}>
                                                <option value="類別1">類別1</option>
                                                <option value="類別2">類別2</option>
                                                <option value="類別3">類別3</option>
                                                <option value="類別4">類別4</option>
                                                <option value="類別5">類別5</option>
                                                <option value="類別6">類別6</option>
                                            </CFormSelect><p></p></div>
                                        <div><span>排放型式:</span>
                                            <CFormSelect className={styles.input} value={selectedRowData.sourceType}>
                                                <option value="固定">固定</option>
                                                <option value="移動">移動</option>
                                                <option value="製程">製程</option>
                                                <option value="逸散">逸散</option>
                                            </CFormSelect><p></p></div>
                                        <div><span>製程/逸散/外購電力類別11:</span>
                                            <CFormSelect className={styles.input} value={selectedRowData.sourcePower}>
                                                <option value="廢水排放源">廢水排放源</option>
                                                <option value="廢棄污泥排放源">廢棄污泥排放源</option>
                                                <option value="溶劑、噴霧劑及冷媒排放源">溶劑、噴霧劑及冷媒排放源</option>
                                                <option value="VOCs未經燃燒且含CH4">VOCs未經燃燒且含CH4</option>
                                                <option value="已知VOCs濃度">已知VOCs濃度</option>
                                                <option value="未知VOCs濃度已知CO2排放係數">未知VOCs濃度已知CO2排放係數</option>
                                                <option value="化糞池排放源">化糞池排放源</option>
                                                <option value="其他">其他</option>
                                            </CFormSelect><p></p></div>
                                    </div>
                                </div>
                                <div className={styles.block}>
                                    <div className={styles.blockHead}>
                                        <h5>可能產生溫室氣體種類</h5>
                                    </div>
                                    <div className={styles.blockBody}>
                                        <div><CFormCheck id="flexCheckDefault" label="CO2" /></div>
                                        <div><CFormCheck id="flexCheckDefault" label="CH4" /></div>
                                        <div><CFormCheck id="flexCheckDefault" label="N2O" /></div>
                                        <div><CFormCheck id="flexCheckDefault" label="HFCS" /></div>
                                        <div><CFormCheck id="flexCheckDefault" label="PFCS" /></div>
                                        <div><CFormCheck id="flexCheckDefault" label="SF6" /></div>
                                        <div><CFormCheck id="flexCheckDefault" label="NF3" /></div>
                                    </div>
                                </div>

                                <div className={styles.block}>
                                    <div className={styles.blockHead}>
                                        <h5>是否屬汽電共生設備</h5>
                                    </div>
                                    <div className={styles.blockBody}>
                                        <div>
                                            <CFormSelect className={styles.input} value={selectedRowData.steamEle}>
                                                <option value="是">是</option>
                                                <option value="否">否</option>
                                            </CFormSelect><p></p></div>
                                    </div>
                                </div>

                                <div className={styles.block}>
                                    <div className={styles.blockHead}>
                                        <h5>備註</h5>
                                    </div>
                                    <div className={styles.blockBody1}>
                                        <div>
                                            <CFormTextarea className={styles.input} type="text" rows={2} value={selectedRowData.remark} />
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

