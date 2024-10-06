
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
                gaseType: ["CH4"],
                steamEle: '否', remark: '化糞池'
            }
        },
        {
            status: "not completed", process: "冷媒補充", equipment: "家用冷凍、冷藏裝備", material: "HFC-134a/R-134a，四氟乙烷HFC-134a/R-1", details: {
                processNum: 'G02', processCode: 'G00099', processName: '冷媒補充',
                equipNum: 'GF02', equipCode: '4097', equipName: '家用冷凍、冷藏裝備',
                matType: '原燃物料', matCode: 'GG1835', matName: 'HFC-134a/R-134a，四氟乙烷HFC-134a/R-1', matbio: 'no',
                sourceClass: '類別1', sourceType: '逸散', sourcePower: '溶劑、噴霧劑及冷媒排放源',
                gaseType: ["HFCS"],
                steamEle: '否', remark: '二樓冰箱，西屋/RT-5603GSC(2004出產)'
            }
        },
        {
            status: "not completed", process: "交通運輸活動", equipment: "汽油引擎", material: "車用汽油", details: {
                processNum: 'G03', processCode: 'G20900', processName: '交通運輸活動',
                equipNum: 'GV01', equipCode: '0200', equipName: '汽油引擎',
                matType: '原燃物料', matCode: '170001', matName: '車用汽油', matbio: 'no',
                sourceClass: '類別1', sourceType: '移動', sourcePower: '無',
                gaseType: ["CO2", "CH4", "N2O"],
                steamEle: '否', remark: '公務車-汽油'
            }
        },
    ];

    // 這裡設置 sourceType 和 sourcePower 的選項
    const sourceTypeOptions = {
        "類別1": ["固定", "移動", "製程", "逸散"],
        "類別2": ["外購電力", "外購蒸氣"],
        "類別3": ["上游的運輸與配送", "下游的運輸與配送", "員工通勤", "客戶及訪客運輸", "商務旅行"],
        "類別4": ["採購之商品", "資本財", "廢棄物處置", "資產使用", "採購之能源", "其他服務"],
        "類別5": ["產品使用", "下游租賃資產", "產品壽命終止階段", "加盟/各項投資"],
        "類別6": ["其他排放"],
    };

    const sourcePowerOptions = {
        "製程": ["水泥製程", "鋼鐵製程-使用造渣劑", "鋼鐵製程-使用添加劑", "鋼鐵製程-金屬進料", "鋼鐵製程-外售含碳產品(已知CO2排放係數", "鋼鐵製程-使用添加劑(預焙陽極炭塊與煤碳電極", 
            "鋼鐵製程--外售含碳產品(已知含碳率)", "半導體光電製程", "石灰製程", "碳酸鈉製程-碳酸鈉製造", "碳酸鈉製程-碳酸鈉使用"
            , "碳化物鈉製程-碳化矽製造", "碳化物鈉製程-碳化鈣製造", "碳化物鈉製程-碳化鈣使用", "碳酸製程", "已二酸製程", "二氟一氯甲烷", "乙炔-焊接維修製程", "濕式排煙脫硫-石灰石製程", "其他"
        ],
        "逸散": ["廢棄物排放源", "廢水排放源", "廢棄污泥排放源", "溶劑、噴霧劑及冷媒排放源", "VOCs未經燃燒且含CH4", "已知VOCs濃度", "未知VOCs濃度已知CO2排放係數", "化糞池排放源", "其他"],
        "外購電力": ["併網", "離網"],
    };

    const handleRowClick = (row) => {
        setSelectedRowData(row.details);
    };

    const handleInputChange = (e, field) => {
        const value = e.target.value;
        setSelectedRowData((prevData) => ({
            ...prevData,
            [field]: value,
            ...(field === 'sourceClass' && { sourceType: sourceTypeOptions[value][0] || '' }), // 根據類別設置初始的 sourceType
            ...(field === 'sourceType' && { sourcePower: '' }) // 選擇 sourceType 後清空 sourcePower
        }));
    };

    const handleGasChange = (gas) => {
        setSelectedRowData((prevData) => {
            const newGaseType = prevData.gaseType.includes(gas)
                ? prevData.gaseType.filter(g => g !== gas) // 如果已選中，則移除
                : [...prevData.gaseType, gas]; // 否則添加
            return { ...prevData, gaseType: newGaseType }; // 更新 gaseType
        });
    };



    return (
        <main>
            <CTabs activeItemKey={1}>
                <CTabList variant="underline-border" className="system-tablist">
                    <Link to="." className="system-tablist-link">
                        <CTab aria-controls="tab1" itemKey={1} className="system-tablist-choose">排放源鑑別</CTab>
                    </Link>
                    <Link to="/碳盤查系統/顧問system/活動數據" className="system-tablist-link">
                        <CTab aria-controls="tab3" className="system-tablist-choose">活動數據</CTab>
                    </Link>
                    <Link to="/碳盤查系統/system/活動數據盤點" className="system-tablist-link">
                        <CTab aria-controls="tab3" className="system-tablist-choose">ddd</CTab>
                    </Link>
                </CTabList>
            </CTabs>


            <div className="system-titlediv">
                <div>
                    <h4 className="system-title">排放源鑑別</h4>
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
                                        <div><span>類別:</span>
                                            <CFormSelect className={styles.input}
                                                value={selectedRowData.matType}
                                                onChange={(e) => handleInputChange(e, 'matType')} // 更新 matType
                                            >
                                                <option value="原燃物料">原燃物料</option>
                                                <option value="產品">產品</option>
                                            </CFormSelect><p></p></div>
                                        <div><span>代碼:</span><p>{selectedRowData.matCode}</p></div>
                                        <div><span>名稱:</span><p>{selectedRowData.matName}</p></div>
                                        <div><span>是否屬生質能源:</span>
                                            <CFormSelect className={styles.input} value={selectedRowData.matbio}
                                                onChange={(e) => handleInputChange(e, 'matbio')}>
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
                                        <div>
                                            <span>類別:</span>
                                            <CFormSelect className={styles.input} value={selectedRowData.sourceClass}
                                                onChange={(e) => handleInputChange(e, 'sourceClass')}>
                                                <option value="類別1">類別1</option>
                                                <option value="類別2">類別2</option>
                                                <option value="類別3">類別3</option>
                                                <option value="類別4">類別4</option>
                                                <option value="類別5">類別5</option>
                                                <option value="類別6">類別6</option>
                                            </CFormSelect>
                                        </div>
                                        <div>
                                            <span>排放型式:</span>
                                            <CFormSelect className={styles.input} value={selectedRowData.sourceType}
                                                onChange={(e) => handleInputChange(e, 'sourceType')}>
                                                {sourceTypeOptions[selectedRowData.sourceClass]?.map(type => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </CFormSelect>
                                        </div>
                                        <div>
                                            <span>製程/逸散/外購電力類別:</span>
                                            <CFormSelect className={styles.input} value={selectedRowData.sourcePower}
                                                onChange={(e) => handleInputChange(e, 'sourcePower')}>
                                                {sourcePowerOptions[selectedRowData.sourceType]?.map(power => (
                                                    <option key={power} value={power}>{power}</option>
                                                ))}
                                            </CFormSelect>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.block}>
                                    <div className={styles.blockHead}>
                                        <h5>可能產生溫室氣體種類</h5>
                                    </div>
                                    <div className={styles.blockBody}>
                                        {["CO2", "CH4", "N2O", "HFCS", "PFCS", "SF6", "NF3"].map((gas) => (
                                            <div key={gas}>
                                                <CFormCheck
                                                    id={gas}
                                                    label={gas}
                                                    checked={selectedRowData.gaseType.includes(gas)} // 預選邏輯
                                                    onChange={() => handleGasChange(gas)} // 添加 onChange 事件
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.block}>
                                    <div className={styles.blockHead}>
                                        <h5>是否屬汽電共生設備</h5>
                                    </div>
                                    <div className={styles.blockBody}>
                                        <div>
                                            <CFormSelect className={styles.input} value={selectedRowData.steamEle}
                                                onChange={(e) => handleInputChange(e, 'steamEle')}>
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

