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

export const BusinessTrip = ({ year }) => {
    const [businessTripData, setBusinessTripData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 交通方式對應的顯示文字
    const transportationMap = {
        1: '汽車',
        2: '機車',
        3: '公車',
        4: '捷運',
        5: '火車',
        6: '高鐵',
        7: '客運',
        8: '飛機',
        9: '輪船'
    };

    // 油種對應的顯示文字
    const oilSpeciesMap = {
        1: '無',
        2: '汽油',
        3: '柴油'
    };

    // 當年份變更時獲取資料
    useEffect(() => {
        if (!year) return;

        const fetchBusinessTripData = async () => {
            setLoading(true);
            setError(null);

            setBusinessTripData([]);
            try {
                const response = await fetch(`http://127.0.0.1:8000/businesstrip_data_by_year/${year}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                console.log("Response status:", response.status);
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Error response:", errorText);
                    throw new Error(`獲取資料失敗：${response.status} - ${errorText}`);
                }

                const data = await response.json();
                console.log("Received data:", data);
                setBusinessTripData(data);
            } catch (err) {
                console.error("獲取商務旅行資料發生錯誤:", err);
                setError(err.message);

                setBusinessTripData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBusinessTripData();
    }, [year]);

    if (loading) return <div>載入資料中...</div>;

    return (
        <div>
            <CTable bordered className={styles.table}>
                <CTableHead className={styles.tableHead}>
                    <tr>
                        <th>交通方式</th>
                        <th>公里數</th>
                        <th>油種</th>
                        <th>備註</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.tableBody}>
                    {businessTripData.length > 0 ? (
                        businessTripData.map((item, index) => (
                            <tr key={index}>
                                <td>{transportationMap[item.transportation] || '未知'}</td>
                                <td>{item.kilometers}</td>
                                <td>{oilSpeciesMap[item.oil_species] || '未知'}</td>
                                <td>{item.remark || '-'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center' }}>此年份無商務旅行資料</td>
                        </tr>
                    )}
                </CTableBody>
            </CTable>
        </div>
    )
}