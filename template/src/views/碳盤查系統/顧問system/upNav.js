// UpNav.js
import React, { useState, useEffect } from 'react'
import {
    CRow, CCol, CCard, CFormSelect, CTab, CTabList, CTabs,
    CTable, CTableBody, CTableHead, CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CButton, CFormCheck
    , CForm, CFormLabel, CFormInput, CFormTextarea
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilDataTransferDown } from '@coreui/icons'

import '../../../scss/碳盤查系統.css'
import styles from '../../../scss/顧問system.module.css'

import { Link, useNavigate } from 'react-router-dom'
import { useNotification } from '../../../NotificationContext' // 導入全域通知系統

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faCircleXmark, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';

export const UpNav = () => {
    const [visible, setVisible] = useState(false)
    const [baselineId, setBaselineId] = useState(null)
    const [baselineYear, setBaselineYear] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    
    // 使用全域通知系統
    const { completeBaseline, isGeneratingExcel, isGeneratingWord } = useNotification()
    
    const navigate = useNavigate()

    // Fetch the latest baseline ID when component mounts
    useEffect(() => {
        const fetchBaselineId = async () => {
            try {
                const response = await fetch('http://localhost:8000/baseline')
                if (response.ok) {
                    const data = await response.json()
                    setBaselineId(data.baseline.baseline_id)
                    
                    // 從日期中提取年份
                    if (data.baseline.cfv_start_date) {
                        const dateStr = data.baseline.cfv_start_date
                        let year
                        if (dateStr.includes('-')) {
                            year = parseInt(dateStr.split('-')[0])
                        } else if (dateStr.includes('/')) {
                            year = parseInt(dateStr.split('/')[0])
                        } else {
                            year = parseInt(dateStr.substring(0, 4))
                        }
                        setBaselineYear(year)
                    }
                } else {
                    console.error('Failed to fetch baseline:', response.status)
                }
            } catch (error) {
                console.error('Error fetching baseline:', error)
            }
        }

        fetchBaselineId()
    }, [])

    // Handle completion of baseline - 使用全域通知系統
    const handleCompleteBaseline = async () => {
        setIsLoading(true)
        try {
            const success = await completeBaseline(baselineId)
            if (success) {
                setVisible(false)
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main>
            <CTabs activeItemKey={1}>
                <CTabList variant="underline-border" className="system-tablist">
                    <div className={styles.tabsContainer}>
                        <div className={styles.tabsLeft}>
                            <Link to="/碳盤查系統/顧問system/排放源鑑別" className="system-tablist-link">
                                <CTab aria-controls="tab1" itemKey={2} className="system-tablist-choose">排放源鑑別</CTab>
                            </Link>
                            <Link to="/碳盤查系統/顧問system/活動數據" className="system-tablist-link">
                                <CTab aria-controls="tab3" itemKey={3} className="system-tablist-choose">活動數據</CTab>
                            </Link>
                            <Link to="/碳盤查系統/顧問system/定量盤查" className="system-tablist-link">
                                <CTab aria-controls="tab3" itemKey={4} className="system-tablist-choose">定量盤查</CTab>
                            </Link>
                            <Link to="/碳盤查系統/顧問system/數據品質管理" className="system-tablist-link">
                                <CTab aria-controls="tab3" itemKey={5} className="system-tablist-choose">數據品質管理</CTab>
                            </Link>
                            <Link to="/碳盤查系統/顧問system/不確定性量化評估" className="system-tablist-link">
                                <CTab aria-controls="tab3" itemKey={6} className="system-tablist-choose">不確定性量化評估</CTab>
                            </Link>
                        </div>

                        <div className={styles.tabsRight}>
                            <button 
                                className={styles.tabsDone} 
                                onClick={() => setVisible(!visible)}
                                disabled={isGeneratingExcel || isGeneratingWord}
                            >
                                {(isGeneratingExcel || isGeneratingWord) ? '生成中...' : '完成盤查'}
                            </button>
                        </div>
                    </div>
                </CTabList>
            </CTabs>

            <CModal
                visible={visible}
                onClose={() => setVisible(false)}
                aria-labelledby="LiveDemoExampleLabel"
            >
                <CModalHeader>
                    <CModalTitle id="LiveDemoExampleLabel"><b>注意!</b></CModalTitle>
                </CModalHeader>
                <CModalBody>
                    確認將完成本年度的盤查嗎? 
                    <br />
                    將先生成盤查清冊，完成後再生成盤查報告書。
                    {(isGeneratingExcel || isGeneratingWord) && (
                        <div className="mt-2 text-info">
                            <small>
                                {isGeneratingExcel && "📊 盤查清冊生成中... "}
                                {isGeneratingWord && "📄 報告書生成中... "}
                            </small>
                        </div>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton className="modalbutton1" onClick={() => setVisible(false)}>
                        取消
                    </CButton>
                    <CButton 
                        className="modalbutton2" 
                        onClick={handleCompleteBaseline}
                        disabled={isLoading || isGeneratingExcel || isGeneratingWord}
                    >
                        {isLoading ? '處理中...' : '完成'}
                    </CButton>
                </CModalFooter>
            </CModal>

        </main>
    );
}

export default UpNav;