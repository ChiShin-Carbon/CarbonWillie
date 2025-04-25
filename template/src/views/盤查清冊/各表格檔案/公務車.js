import React, { useState, useEffect } from 'react'
import {
    CTable,
    CTableHead,
    CTableBody,
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
import styles from '../../../scss/盤查清冊.module.css'

export const Vehicle = ({ year }) => {
    const [vehicleData, setVehicleData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 油種代碼對應的顯示文字
    const oilTypeMap = {
        0: '汽油',
        1: '柴油'
    };

    // 當年份變更時獲取資料
    useEffect(() => {
        if (!year) return;

        const fetchVehicleData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`http://127.0.0.1:8000/vehicle_data_by_year/${year}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) {
                    throw new Error(`獲取資料失敗：${response.status}`);
                }

                const data = await response.json();
                setVehicleData(data);
            } catch (err) {
                console.error("獲取車輛資料發生錯誤:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicleData();
    }, [year]);

    if (loading) return <div>載入資料中...</div>;
    

    return (
        <div>
            <CTable bordered className={styles.table}>
                <CTableHead className={styles.tableHead}>
                    <tr>
                        <th>發票/收據日期</th>
                        <th>油種</th>
                        <th>單位</th>
                        <th>公升數</th>
                        <th>備註</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.tableBody}>
                    {vehicleData.length > 0 ? (
                        vehicleData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.doc_date}</td>
                                <td>{oilTypeMap[item.oil_species] || '未知'}</td>
                                <td>公升</td>
                                <td>{item.liters}</td>
                                <td>{item.remark || '-'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center' }}>此年份無公務車資料</td>
                        </tr>
                    )}
                </CTableBody>
            </CTable>
        </div>
    )
}