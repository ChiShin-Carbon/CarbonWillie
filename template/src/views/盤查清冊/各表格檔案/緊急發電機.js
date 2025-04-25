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

export const EmergencyGenerator = ({ year }) => {
    const [generatorData, setGeneratorData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 當年份變更時獲取資料
    useEffect(() => {
        if (!year) return;

        const fetchGeneratorData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`http://127.0.0.1:8000/generator_data_by_year/${year}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) {
                    throw new Error(`獲取資料失敗：${response.status}`);
                }

                const data = await response.json();
                setGeneratorData(data);
            } catch (err) {
                console.error("獲取緊急發電機資料發生錯誤:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGeneratorData();
    }, [year]);

    if (loading) return <div>載入資料中...</div>;

    return (
        <div>
            <CTable bordered className={styles.table}>
                <CTableHead className={styles.tableHead}>
                    <tr>
                        <th>發票/收據日期</th>
                        <th>發票號碼</th>
                        <th>使用量(公升)</th>
                        <th>備註</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.tableBody}>
                    {generatorData.length > 0 ? (
                        generatorData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.doc_date}</td>
                                <td>{item.doc_number}</td>
                                <td>{item.usage}</td>
                                <td>{item.remark || '-'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center' }}>此年份無緊急發電機資料</td>
                        </tr>
                    )}
                </CTableBody>
            </CTable>
        </div>
    )
}