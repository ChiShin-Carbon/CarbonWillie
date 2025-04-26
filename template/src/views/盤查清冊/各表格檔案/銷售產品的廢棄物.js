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

export const SellingWaste = ({ year }) => {
    const [wasteData, setWasteData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 當年份變更時獲取資料
    useEffect(() => {
        if (!year) return;

        const fetchWasteData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`http://127.0.0.1:8000/selling_waste_data_by_year/${year}`, {
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
                console.log("Received selling waste data:", data);
                setWasteData(data);
            } catch (err) {
                console.error("獲取銷售廢棄物資料發生錯誤:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWasteData();
    }, [year]);

    if (loading) return <div>載入資料中...</div>;

    return (
        <div>
            <CTable bordered className={styles.table}>
                <CTableHead className={styles.tableHead}>
                    <tr>
                        <th>廢棄物項目</th>
                        <th>備註</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.tableBody}>
                    {wasteData.length > 0 ? (
                        wasteData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.waste_item}</td>
                                <td>{item.remark || '-'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2" style={{ textAlign: 'center' }}>此年份無銷售廢棄物資料</td>
                        </tr>
                    )}
                </CTableBody>
            </CTable>
        </div>
    )
}