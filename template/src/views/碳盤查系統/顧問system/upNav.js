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
    const [isGeneratingWord, setIsGeneratingWord] = useState(false) // 新增Word生成狀態
    const [toastVisible, setToastVisible] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [toastType, setToastType] = useState('success') // 'success' or 'danger'
    const navigate = useNavigate()

    // 假設的user_id，實際應該從認證系統獲取
    const [userId] = useState(1) // 請根據實際情況設定

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

    // Word/PDF生成狀態輪詢
    useEffect(() => {
        let intervalId

        if (isGeneratingWord && baselineYear) {
            // 開始輪詢
            intervalId = setInterval(async () => {
                try {
                    const response = await fetch(`http://localhost:8000/check_word_status/${baselineYear}`)
                    
                    if (response.ok) {
                        const data = await response.json()
                        if (data.exists) {
                            // Word/PDF文件已生成完成
                            console.log('Word/PDF檔案已成功生成:', data.file_path)
                            showToast(`${baselineYear}年度盤查報告書已成功生成！`, 'success')
                            setIsGeneratingWord(false)
                            clearInterval(intervalId)
                        }
                    } else {
                        // 如果API還沒有check_word_status，我們可以用簡單的時間估計
                        // 這是臨時方案，建議後端實現對應的狀態檢查API
                        console.log('Word狀態檢查API尚未實現，使用預估時間')
                    }
                } catch (error) {
                    console.error('輪詢Word狀態時發生錯誤:', error)
                    // 如果API不存在，我們設定一個預估時間（比如30秒後停止輪詢）
                    // 這是臨時方案
                }
            }, 3000) // 每3秒檢查一次

            // 如果沒有狀態檢查API，設定一個預估的完成時間（30秒）
            const fallbackTimeout = setTimeout(() => {
                if (isGeneratingWord) {
                    showToast(`${baselineYear}年度盤查報告書生成中，請稍後檢查檔案`, 'info')
                    setIsGeneratingWord(false)
                    clearInterval(intervalId)
                }
            }, 30000) // 30秒後停止輪詢

            return () => {
                clearTimeout(fallbackTimeout)
            }
        }

        // 組件卸載或狀態變更時清除輪詢
        return () => {
            if (intervalId) {
                clearInterval(intervalId)
            }
        }
    }, [isGeneratingWord, baselineYear])

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

    // Generate Word/PDF report
    const generateWordReport = async () => {
        try {
            const response = await fetch(`http://localhost:8000/generate_word/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            const data = await response.json()
            
            if (response.ok) {
                console.log('Word/PDF generation initiated:', data)
                // 啟動輪詢機制
                setIsGeneratingWord(true)
                showToast('已開始生成盤查報告書，請稍候...', 'info')
                return true
            } else {
                console.error('Failed to generate Word/PDF:', data.message)
                showToast(`生成盤查報告書失敗: ${data.message}`, 'danger')
                return false
            }
        } catch (error) {
            console.error('Error generating Word/PDF report:', error)
            showToast(`生成盤查報告書時發生錯誤: ${error.message}`, 'danger')
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
            // 同時生成Excel和Word/PDF
            const excelGenerated = await generateInventoryExcel()
            const wordGenerated = await generateWordReport()
            
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
                let message = "盤查已標記為完成"
                if (excelGenerated && wordGenerated) {
                    message += "，盤查清冊和報告書生成中"
                } else if (excelGenerated) {
                    message += "，盤查清冊生成中"
                } else if (wordGenerated) {
                    message += "，報告書生成中"
                }
                showToast(message, "success")
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
                <CModalBody>
                    確認將完成本年度的盤查嗎? 
                    <br />
                    同時將生成本年度盤查清冊和盤查報告書。
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