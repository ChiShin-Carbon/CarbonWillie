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

export const NonEmployee = ({ year }) => {
    const [nonemployeeData, setNonemployeeData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 當年份變更時獲取資料
    useEffect(() => {
        if (!year) return;

        const fetchNonemployeeData = async () => {
            setLoading(true);
            setError(null);

            setNonemployeeData([]);


            try {
                const response = await fetch(`http://127.0.0.1:8000/nonemployee_data_by_year/${year}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) {
                    throw new Error(`獲取資料失敗：${response.status}`);
                }

                const data = await response.json();
                setNonemployeeData(data);
            } catch (err) {
                console.error("獲取非員工資料發生錯誤:", err);
                setError(err.message);

                setNonemployeeData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchNonemployeeData();
    }, [year]);

    if (loading) return <div>載入資料中...</div>;

    return (
        <div>
            <CTable bordered className={styles.table}>
                <CTableHead className={styles.tableHead}>
                    <tr>
                        <th>月份</th>
                        <th>人數</th>
                        <th>總工作時數</th>
                        <th>總工作天數</th>
                        <th>備註</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.tableBody}>
                    {nonemployeeData.length > 0 ? (
                        nonemployeeData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.month}</td>
                                <td>{item.nonemployee_number}</td>
                                <td>{item.total_hours}</td>
                                <td>{item.total_days}</td>
                                <td>{item.remark || '-'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center' }}>此年份無非員工資料</td>
                        </tr>
                    )}
                </CTableBody>
            </CTable>
        </div>
    )
}