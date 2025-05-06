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

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faCircleXmark, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';

export const UpNav = () => {
    const [visible, setVisible] = useState(false)
    const [baselineId, setBaselineId] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    // Fetch the latest baseline ID when component mounts
    useEffect(() => {
        const fetchBaselineId = async () => {
            try {
                const response = await fetch('http://localhost:8000/baseline')
                if (response.ok) {
                    const data = await response.json()
                    setBaselineId(data.baseline.baseline_id)
                } else {
                    console.error('Failed to fetch baseline:', response.status)
                }
            } catch (error) {
                console.error('Error fetching baseline:', error)
            }
        }

        fetchBaselineId()
    }, [])

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
                return true
            } else {
                console.error('Failed to generate Excel:', data.message)
                return false
            }
        } catch (error) {
            console.error('Error generating inventory Excel:', error)
            return false
        }
    }

    // Handle completion of baseline
    const handleCompleteBaseline = async () => {
        if (!baselineId) {
            console.error('No baseline ID available')
            console.log("沒有可用的基準年ID", "danger")
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
                console.log("盤查已標記為完成" + (excelGenerated ? "，盤查清冊生成中" : ""))
                setVisible(false)
               
            } else {
                console.error('Failed to update baseline completion status:', response.status)
                console.log("更新基準年完成狀態失敗", "danger")
            }
        } catch (error) {
            console.error('Error updating baseline completion status:', error)
            console.log(`處理過程中發生錯誤: ${error.message}`, "danger")
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

            <CModal
                visible={visible}
                onClose={() => setVisible(false)}
                aria-labelledby="LiveDemoExampleLabel"
            >
                <CModalHeader>
                    <CModalTitle id="LiveDemoExampleLabel"><b>注意!</b></CModalTitle>
                </CModalHeader>
                <CModalBody>確認將完成本年度的盤查嗎? 同時將生成盤查清冊Excel檔案。</CModalBody>
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