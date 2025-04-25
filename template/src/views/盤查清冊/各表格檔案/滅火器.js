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

export const FireExtinguisher = () => {
    const [extinguisherData, setExtinguisherData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 成分代碼對應的顯示文字
    const ingredientMap = {
        1: 'CO2',
        2: 'HFC-236ea',
        3: 'HFC-236fa',
        4: 'HFC-227ea',
        5: 'CF3CHFCF3',
        6: 'CHF3',
        7: '其他'
    };

    // 元件載入時獲取資料
    useEffect(() => {
        const fetchExtinguisherData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`http://127.0.0.1:8000/fire_extinguisher_data`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) {
                    throw new Error(`獲取資料失敗：${response.status}`);
                }

                const data = await response.json();
                setExtinguisherData(data);
            } catch (err) {
                console.error("獲取滅火器資料發生錯誤:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchExtinguisherData();
    }, []);

    if (loading) return <div>載入資料中...</div>;

    return (
        <div>
            <CTable bordered className={styles.table}>
                <CTableHead className={styles.tableHead}>
                    <tr>
                        <th>品名</th>
                        <th>成分</th>
                        <th>規格(重量)</th>
                        <th>單位</th>
                        <th>使用量(支)</th>
                        <th>備註</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.tableBody}>
                    {extinguisherData.length > 0 ? (
                        extinguisherData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.item_name}</td>
                                <td>{ingredientMap[item.ingredient] || '未知'}</td>
                                <td>{item.specification}</td>
                                <td>公斤</td>
                                <td>1</td>
                                <td>{item.remark || '-'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center' }}>無滅火器資料</td>
                        </tr>
                    )}
                </CTableBody>
            </CTable>
        </div>
    )
}