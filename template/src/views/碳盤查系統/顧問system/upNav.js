import React, { useState, useEffect } from 'react'
import {
    CRow, CCol, CCard, CFormSelect, CTab, CTabList, CTabs,
    CTable, CTableBody, CTableHead, CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CButton, CFormCheck
    , CForm, CFormLabel, CFormInput, CFormTextarea, CToast, CToastBody, CToastHeader
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilDataTransferDown } from '@coreui/icons'

import '../../../scss/碳盤查系統.css'
import styles from '../../../scss/顧問system.module.css'

import { Link, useNavigate } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faCircleXmark, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';

export const UpNav = () => {
    const [visible, setVisible] = useState(false)
    const [baselineId, setBaselineId] = useState(null)
    const [baselineYear, setBaselineYear] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isGeneratingExcel, setIsGeneratingExcel] = useState(false)
    const [toastVisible, setToastVisible] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [toastType, setToastType] = useState('success') // 'success' or 'danger'
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

    // Excel生成狀態輪詢
    useEffect(() => {
        let intervalId

        if (isGeneratingExcel && baselineYear) {
            // 開始輪詢
            intervalId = setInterval(async () => {
                try {
                    const response = await fetch(`http://localhost:8000/check_excel_status/${baselineYear}`)
                    const data = await response.json()
                    
                    if (response.ok) {
                        if (data.exists) {
                            // Excel文件已生成完成
                            console.log('Excel檔案已成功生成:', data.file_path)
                            showToast(`${baselineYear}年度盤查清冊已成功生成！`, 'success')
                            setIsGeneratingExcel(false)
                            clearInterval(intervalId)
                        }
                    } else {
                        console.error('檢查Excel狀態失敗:', data.message)
                    }
                } catch (error) {
                    console.error('輪詢Excel狀態時發生錯誤:', error)
                }
            }, 3000) // 每3秒檢查一次
        }

        // 組件卸載或狀態變更時清除輪詢
        return () => {
            if (intervalId) {
                clearInterval(intervalId)
            }
        }
    }, [isGeneratingExcel, baselineYear])

    // 顯示提示訊息
    const showToast = (message, type = 'success') => {
        setToastMessage(message)
        setToastType(type)
        setToastVisible(true)
        
        // 5秒後自動隱藏
        setTimeout(() => {
            setToastVisible(false)
        }, 5000)
    }

    // Generate inventory excel
    const generateInventoryExcel = async () => {
        try {
            const response = await fetch('http://localhost:8000/generate_inventory_excel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            const data = await response.json()
            
            if (response.ok) {
                console.log('Excel generation initiated:', data)
                // 啟動輪詢機制
                setIsGeneratingExcel(true)
                showToast('已開始生成盤查清冊，請稍候...', 'info')
                return true
            } else {
                console.error('Failed to generate Excel:', data.message)
                showToast(`生成盤查清冊失敗: ${data.message}`, 'danger')
                return false
            }
        } catch (error) {
            console.error('Error generating inventory Excel:', error)
            showToast(`生成盤查清冊時發生錯誤: ${error.message}`, 'danger')
            return false
        }
    }

    // Handle completion of baseline
    const handleCompleteBaseline = async () => {
        if (!baselineId) {
            console.error('No baseline ID available')
            showToast("沒有可用的基準年ID", "danger")
            return
        }

        setIsLoading(true)
        try {
            // First generate the inventory excel
            const excelGenerated = await generateInventoryExcel()
            
            // Then mark the baseline as complete
            const response = await fetch(`http://localhost:8000/baseline/${baselineId}/complete`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    is_completed: true
                }),
            })

            if (response.ok) {
                console.log('Baseline marked as complete')
                showToast("盤查已標記為完成" + (excelGenerated ? "，盤查清冊生成中" : ""), "success")
                setVisible(false)
               
            } else {
                console.error('Failed to update baseline completion status:', response.status)
                showToast("更新基準年完成狀態失敗", "danger")
            }
        } catch (error) {
            console.error('Error updating baseline completion status:', error)
            showToast(`處理過程中發生錯誤: ${error.message}`, "danger")
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
                            <button className={styles.tabsDone} onClick={() => setVisible(!visible)}>
                                完成盤查</button>
                        </div>
                    </div>
                </CTabList>
            </CTabs>

            {/* 提示訊息 Toast */}
            <CToast 
                visible={toastVisible} 
                className={`bg-${toastType} text-white`}
                style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    zIndex: 9999
                }}
            >
                <CToastHeader closeButton>
                    <strong className="me-auto">通知</strong>
                </CToastHeader>
                <CToastBody>{toastMessage}</CToastBody>
            </CToast>

            <CModal
                visible={visible}
                onClose={() => setVisible(false)}
                aria-labelledby="LiveDemoExampleLabel"
            >
                <CModalHeader>
                    <CModalTitle id="LiveDemoExampleLabel"><b>注意!</b></CModalTitle>
                </CModalHeader>
                <CModalBody>確認將完成本年度的盤查嗎? 同時將生成本年度盤查文件。</CModalBody>
                <CModalFooter>
                    <CButton className="modalbutton1" onClick={() => setVisible(false)}>
                        取消
                    </CButton>
                    <CButton 
                        className="modalbutton2" 
                        onClick={handleCompleteBaseline}
                        disabled={isLoading}
                    >
                        {isLoading ? '處理中...' : '完成'}
                    </CButton>
                </CModalFooter>
            </CModal>

        </main>
    );
}
export default UpNav;