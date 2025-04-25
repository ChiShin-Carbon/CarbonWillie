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

export const Employee = ({ year }) => {
    const [employeeData, setEmployeeData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 當年份變更時獲取資料
    useEffect(() => {
        if (!year) return;

        const fetchEmployeeData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`http://127.0.0.1:8000/employee_data_by_year/${year}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) {
                    throw new Error(`獲取資料失敗：${response.status}`);
                }

                const data = await response.json();
                setEmployeeData(data);
            } catch (err) {
                console.error("獲取員工資料發生錯誤:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployeeData();
    }, [year]);

    if (loading) return <div>載入資料中...</div>;

    return (
        <div>
            <CTable bordered className={styles.table}>
                <CTableHead className={styles.tableHead}>
                    <tr>
                        <th>月份</th>
                        <th>員工數</th>
                        <th>每日工時</th>
                        <th>每月工作日數</th>
                        <th>總加班時數</th>
                        <th>總病假時數</th>
                        <th>總事假時數</th>
                        <th>總出差時數</th>
                        <th>總婚喪時數</th>
                        <th>總特休時數</th>
                        <th>備註</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.tableBody}>
                    {employeeData.length > 0 ? (
                        employeeData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.period_date}</td>
                                <td>{item.employee_number}</td>
                                <td>{item.daily_hours}</td>
                                <td>{item.workday}</td>
                                <td>{item.overtime || '-'}</td>
                                <td>{item.sick_leave || '-'}</td>
                                <td>{item.personal_leave || '-'}</td>
                                <td>{item.business_trip || '-'}</td>
                                <td>{item.wedding_and_funeral || '-'}</td>
                                <td>{item.special_leave || '-'}</td>
                                <td>{item.remark || '-'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="11" style={{ textAlign: 'center' }}>此年份無員工資料</td>
                        </tr>
                    )}
                </CTableBody>
            </CTable>
        </div>
    )
}