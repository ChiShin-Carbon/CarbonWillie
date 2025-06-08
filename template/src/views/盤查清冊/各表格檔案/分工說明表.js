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

export const Division = ({ year }) => {
    const [authorizedUsers, setAuthorizedUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 定義表單類別和排序順序
    const categoryMapping = {
        '公務車': '類別一-公務車',
        '滅火器': '類別一-滅火器',
        '工作時數(員工)': '類別一-工作時數(員工)',
        '工作時數(非員工)': '類別一-工作時數(非員工)',
        '冷媒': '類別一-冷媒',
        '廠內機具': '類別一-廠內機具',
        '緊急發電機': '類別一-緊急發電機',
        '電力使用量': '類別二-電力使用量',
        '員工通勤': '類別三-員工通勤',
        '商務旅行': '類別三-商務旅行',
        '營運產生廢棄物': '類別三-營運產生廢棄物',
        '銷售產品的廢棄物': '類別三-銷售產品的廢棄物'
    };

    // 定義類別順序
    const categoryOrder = [
        '類別一-公務車',
        '類別一-滅火器',
        '類別一-工作時數(員工)',
        '類別一-工作時數(非員工)',
        '類別一-冷媒',
        '類別一-廠內機具',
        '類別一-緊急發電機',
        '類別二-電力使用量',
        '類別三-員工通勤',
        '類別三-商務旅行',
        '類別三-營運產生廢棄物',
        '類別三-銷售產品的廢棄物'
    ];

    // 當年份變更時獲取資料
    useEffect(() => {
        if (!year) return;

        const fetchAuthorizedUsers = async () => {
            setLoading(true);
            setError(null);

            setAuthorizedUsers([]);

            try {
                const response = await fetch(`http://127.0.0.1:8000/authorized_users_by_year/${year}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) {
                    throw new Error(`獲取資料失敗：${response.status}`);
                }

                const data = await response.json();
                setAuthorizedUsers(data);
            } catch (err) {
                console.error("獲取授權使用者資料發生錯誤:", err);
                setError(err.message);

                setAuthorizedUsers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAuthorizedUsers();
    }, [year]);

    // 根據類別映射和排序規則處理數據
    const processedUsers = [...authorizedUsers].map(user => {
        // 嘗試從表單名稱中找到對應的類別
        let categoryPrefix = '其他';
        for (const [key, value] of Object.entries(categoryMapping)) {
            if (user.table_name.includes(key)) {
                categoryPrefix = value;
                break;
            }
        }
        return {
            ...user,
            displayTableName: categoryPrefix,
            originalTableName: user.table_name,
            sortOrder: categoryOrder.indexOf(categoryPrefix) !== -1 ?
                categoryOrder.indexOf(categoryPrefix) : Number.MAX_SAFE_INTEGER
        };
    }).sort((a, b) => a.sortOrder - b.sortOrder);

    if (loading) return <div>載入資料中...</div>;

    return (
        <div>
            <CTable bordered className={styles.table}>
                <CTableHead className={styles.tableHead}>
                    <tr>
                        <th>表單名稱</th>
                        <th>部門</th>
                        <th>姓名(主要填寫人)</th>
                        <th>電子郵件</th>
                        <th>電話及分機號碼</th>
                        <th>平台帳號</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.tableBody}>
                    {processedUsers.length > 0 ? (
                        processedUsers.map((user, index) => (
                            <tr key={index}>
                                <td>{user.displayTableName}</td>
                                <td>{user.department_name}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.telephone || '-'}</td>
                                <td>{user.address}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center' }}>此年份無授權使用者資料</td>
                        </tr>
                    )}
                </CTableBody>
            </CTable>
        </div>
    )
}