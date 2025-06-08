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

export const ElectricityUsage = ({ year }) => {
    const [electricityData, setElectricityData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 填寫類型對應表
    const electricityTypeMap = {
        1: "總用電量",
        2: "總金額"
    };

    // 格式化月份顯示
    const formatMonth = (dateString) => {
        if (!dateString) return '-';
        const parts = dateString.split('-');
        if (parts.length >= 2) {
            return `${parts[1]}月`;
        }
        return dateString;
    };

    // 當年份變更時獲取資料
    useEffect(() => {
        if (!year) return;

        const fetchElectricityData = async () => {
            setLoading(true);
            setError(null);
            // 關鍵修改：在開始載入新資料前先重置資料狀態
            setElectricityData([]);

            try {
                const response = await fetch(`http://127.0.0.1:8000/electricity_data_by_year/${year}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) {
                    throw new Error(`獲取資料失敗：${response.status}`);
                }

                const data = await response.json();
                setElectricityData(data);
            } catch (err) {
                console.error("獲取電力使用量資料發生錯誤:", err);
                setError(err.message);
                // 發生錯誤時也要確保資料為空陣列
                setElectricityData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchElectricityData();
    }, [year]);

    if (loading) return <div>載入資料中...</div>;

    return (
        <div>
            <CTable bordered className={styles.table}>
                <CTableHead className={styles.tableHead}>
                    <tr>
                        <th>收據月份</th>
                        <th>用電期間（起）</th>
                        <th>用電期間（迄）</th>
                        <th>填寫類型</th>
                        <th>當月總用電量或總金額</th>
                        <th>備註</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.tableBody}>
                    {electricityData.length > 0 ? (
                        electricityData.map((item, index) => (
                            <tr key={index}>
                                <td>{formatMonth(item.doc_date)}</td>
                                <td>{item.period_start}</td>
                                <td>{item.period_end}</td>
                                <td>{electricityTypeMap[item.electricity_type] || '未知'}</td>
                                <td>{item.value}</td>
                                <td>-</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center' }}>
                                此年份無電力使用量資料
                            </td>
                        </tr>
                    )}
                </CTableBody>
            </CTable>
        </div>
    )
}