
import React, { useState, useEffect } from 'react'
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
                processNum: 'G01', processCode: '370004',
                equipNum: 'GF01', equipCode: '9795',
                matCode: '36006', matName: '水肥', matClassLevel: '3', matBelType: '未進行儀器校正或未進行紀錄彙整者', matBelLevel: '3',
                matInfo: '', matUnit: '',
                sourceClass: '類別1', sourceType: '逸散',
                emiCoeClass: '國家排放係數', emiLevel: '3',
                manage1: '27', manage2: '', manage3: '3', manage4: '',
            }
        },
        {
            status: "completed", process: "冷媒補充", equipment: "家用冷凍、冷藏裝備", material: "HFC-134a/R-134a，四氟乙烷HFC-134a/R-1",
            details: {
                processNum: 'G02', processCode: 'G00099',
                equipNum: 'GF02', equipCode: '4097',
                matCode: 'GG1835', matName: 'HFC-134a/R-134a，四氟乙烷HFC-134a/R-1', matClassLevel: '3', matBelType: '未進行儀器校正或未進行紀錄彙整者', matBelLevel: '3',
                matInfo: '', matUnit: '',
                sourceClass: '類別1', sourceType: '逸散',
                emiCoeClass: '國家排放係數', emiLevel: '3',
                manage1: '27', manage2: '', manage3: '3', manage4: '',
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
            ...(field === 'matBelType' && {
                matBelLevel: value === "有進行外部校正或有多組數據茲佐證者" ? '1' :
                    value === "有進行內部校正或經過會計簽證等証明者" ? '2' :
                        '3'
            }),
        }));
    };
    useEffect(() => {
        if (selectedRowData) {
            const { matBelLevel, matClassLevel, emiLevel } = selectedRowData;
            if (matBelLevel && matClassLevel && emiLevel) {
                const manage1Value = parseInt(matBelLevel) * parseInt(matClassLevel) * parseInt(emiLevel);
                setSelectedRowData((prevData) => ({
                    ...prevData,
                    manage1: manage1Value,
                }));
            }
        }
    }, [selectedRowData?.matBelLevel, selectedRowData?.matClassLevel, selectedRowData?.emiLevel]);

    useEffect(() => {
        if (selectedRowData) {
            const manage1Value = parseInt(selectedRowData.manage1, 10);
            let manage3Value;
            if (manage1Value < 10) {
                manage3Value = "1";
            } else if (manage1Value < 19) {
                manage3Value = "2";
            } else if (manage1Value >= 27) {
                manage3Value = "3";
            } else {
                manage3Value = "";
            }
            setSelectedRowData((prevData) => ({
                ...prevData,
                manage3: manage3Value,
            }));
        }
    }, [selectedRowData?.manage1]);

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
                        <CTab aria-controls="tab3" itemKey={5} className="system-tablist-choose">定量盤查</CTab>
                    </Link>
                    <Link to="." className="system-tablist-link">
                        <CTab aria-controls="tab3" itemKey={1} className="system-tablist-choose">數據品質管理</CTab>
                    </Link>
                    <Link to="/碳盤查系統/顧問system/不確定性量化評估" className="system-tablist-link">
                        <CTab aria-controls="tab3" itemKey={6} className="system-tablist-choose">不確定性量化評估</CTab>
                    </Link>
                    <Link to="/碳盤查系統/顧問system/全廠電力蒸汽供需情況 " className="system-tablist-link">
                        <CTab aria-controls="tab3" itemKey={2} className="system-tablist-choose">全廠電力蒸汽供需情況 </CTab>
                    </Link>

                </CTabList>
            </CTabs>


            <div className="system-titlediv">
                <div>
                    <h4 className="system-title">數據品質管理</h4>
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
                                        <div><span>代碼:</span><p>{selectedRowData.processCode}</p></div>

                                    </div>
                                </div>
                                <div className={styles.block}>
                                    <div className={styles.blockHead}>
                                        <h5>設備</h5>
                                    </div>
                                    <div className={styles.blockBody}>
                                        <div><span>編號:</span><p>{selectedRowData.equipNum}</p></div>
                                        <div><span>代碼:</span><p>{selectedRowData.equipCode}</p></div>
                                    </div>
                                </div>
                                <div className={styles.block}>
                                    <div className={styles.blockHead}>
                                        <h5>原燃物料或產品</h5>
                                    </div>
                                    <div className={styles.blockBody}>

                                        <div><span>代碼:</span><p>{selectedRowData.matCode}</p></div>
                                        <div><span>名稱:</span><p>{selectedRowData.matName}</p></div>
                                        <div><span>活動數據種類等級:</span><p>{selectedRowData.matClassLevel}</p></div>
                                        <div><span>活動數據可信種類(儀器校正誤差等級):</span>
                                            <CFormSelect className={styles.input} value={selectedRowData.matBelType}
                                                onChange={(e) => handleInputChange(e, 'matBelType')}>
                                                <option value="有進行外部校正或有多組數據茲佐證者">有進行外部校正或有多組數據茲佐證者</option>
                                                <option value="有進行內部校正或經過會計簽證等証明者">有進行內部校正或經過會計簽證等証明者</option>
                                                <option value="未進行儀器校正或未進行紀錄彙整者">未進行儀器校正或未進行紀錄彙整者</option>
                                            </CFormSelect>
                                        </div>
                                        <div><span>活動數據可信等級:</span><p>{selectedRowData.matBelLevel}</p></div>
                                        <div><span>數據可信度資訊說明:</span>
                                            <CFormInput className={styles.input} value={selectedRowData.matInfo}
                                                onChange={(e) => handleInputChange(e, 'matInfo')} /></div>
                                        <div><span>負責單位或保存單位:</span>
                                            <CFormInput className={styles.input} value={selectedRowData.matUnit}
                                                onChange={(e) => handleInputChange(e, 'matUnit')} />
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.block}>
                                    <div className={styles.blockHead}>
                                        <h5>排放源資料</h5>
                                    </div>
                                    <div className={styles.blockBody}>
                                        <div><span>範疇別:</span><p>{selectedRowData.sourceClass}</p></div>
                                        <div><span>排放型式:</span><p>{selectedRowData.sourceType}</p></div>
                                    </div>
                                </div>

                                <div className={styles.block}>
                                    <div className={styles.blockHead}>
                                        <h5>排放係數</h5>
                                    </div>
                                    <div className={styles.blockBody}>
                                        <div><span>係數種類:</span><p>{selectedRowData.emiCoeClass}</p></div>
                                        <div><span>係數種類等級:</span><p>{selectedRowData.emiLevel}</p></div>
                                    </div>
                                </div>

                                <div className={styles.block}>
                                    <div className={styles.blockHead}>
                                        <h5>數據品質管理</h5>
                                    </div>
                                    <div className={styles.blockBody}>
                                        <div><span>單一排放源數據誤差等級:</span><p>{selectedRowData.manage1}</p></div>
                                        <div><span>單一排放源占排放總量比(%):</span><p>{selectedRowData.manage2}</p></div>
                                        <div><span>評分區間範圍:</span><p>{selectedRowData.manage3}</p></div>
                                        <div><span>排放量占比加權平均:</span><p>{selectedRowData.manage4}</p></div>
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

