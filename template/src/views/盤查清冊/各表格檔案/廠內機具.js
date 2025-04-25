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

export const Machinery = ({ year }) => {
    const [machineryData, setMachineryData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 能源類型代碼對應的顯示文字
    const energyTypeMap = {
        1: '柴油',
        2: '汽油',
        3: '其他'
    };

    // 當年份變更時獲取資料
    useEffect(() => {
        if (!year) return;

        const fetchMachineryData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`http://127.0.0.1:8000/machinery_data_by_year/${year}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) {
                    throw new Error(`獲取資料失敗：${response.status}`);
                }

                const data = await response.json();
                setMachineryData(data);
            } catch (err) {
                console.error("獲取廠內機具資料發生錯誤:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMachineryData();
    }, [year]);

    if (loading) return <div>載入資料中...</div>;

    return (
        <div>
            <CTable bordered className={styles.table}>
                <CTableHead className={styles.tableHead}>
                    <tr>
                        <th>月份</th>
                        <th>設備位置</th>
                        <th>能源類型</th>
                        <th>使用量</th>
                        <th>單位</th>
                        <th>備註</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.tableBody}>
                    {machineryData.length > 0 ? (
                        machineryData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.doc_date.split('-')[1]}月</td>
                                <td>{item.machinery_location}</td>
                                <td>{energyTypeMap[item.energy_type] || '未知'}</td>
                                <td>{item.usage}</td>
                                <td>公升</td>
                                <td>{item.remark || '-'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center' }}>此年份無廠內機具資料</td>
                        </tr>
                    )}
                </CTableBody>
            </CTable>
        </div>
    )
}