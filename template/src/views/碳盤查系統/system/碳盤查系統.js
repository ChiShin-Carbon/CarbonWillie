import React, { useState, useEffect } from 'react'
import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CSpinner
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarDays,
  faBorderAll,
  faUserTie,
  faClipboardList,
  faChartLine,
  faUserGear,
  faCheckCircle,
  faFileLines,
} from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

import '../../../scss/碳盤查系統.css'
import styles from '../../../scss/組織盤查首頁.module.css'

const CarbonInventoryFlow = () => {
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentBaseline, setCurrentBaseline] = useState(null)
  const [nextYear, setNextYear] = useState("")
  
  // Add navigation hook
  const navigate = useNavigate()
  
  // Flow steps data
  const flowSteps = [
    {
      icon: faCalendarDays,
      title: '設定基準年',
      description: '設定開始&結束期間',
      role: '組織負責人',
      isActive: true,
      isCompleted: true,
    },
    {
      icon: faBorderAll,
      title: '設定邊界',
      description: '設定盤查範圍',
      role: '組織負責人',
      isActive: true,
      isCompleted: true,
    },
    {
      icon: faUserTie,
      title: '指派盤查項目',
      description: '分配盤查項目給組織主管群',
      role: '組織負責人',
      isActive: true,
      isCompleted: false,
    },
    {
      icon: faClipboardList,
      title: '進行數據填寫',
      description: '各主管根據分配到的項目進行新增數據與修改',
      role: '組織主管群',
      isActive: true,
      isCompleted: false,
    },
    {
      icon: faChartLine,
      title: '確認進度',
      description: '確認被指派到的主管群填寫是否完成',
      role: '組織負責人',
      isActive: true,
      isCompleted: false,
    },
    {
      icon: faUserGear,
      title: '數值確認與維護',
      description: '進行',
      role: '顧問',
      isActive: true,
      isCompleted: false,
    },
    {
      icon: faCheckCircle,
      title: '完成整個盤點',
      description: '確認完所有數值後進行最終的完成盤查確認',
      role: '顧問',
      isActive: true,
      isCompleted: false,
    },
    {
      icon: faFileLines,
      title: '產出結果與報告',
      description: '產出本年度盤查結果數據與圖表，以及生成報告與清冊',
      role: '系統',
      isActive: true,
      isCompleted: false,
    },
  ]

  // Fetch current baseline data
  useEffect(() => {
    fetchBaseline()
  }, [])

  const fetchBaseline = async () => {
    try {
      setLoading(true)
      console.log("Fetching baseline data...")
      const response = await axios.get('http://localhost:8000/baseline')
      console.log("Baseline data received:", response.data)
      
      setCurrentBaseline(response.data.baseline)
      
      // Calculate next year based on current baseline end date
      if (response.data.baseline) {
        const currentEndDate = new Date(response.data.baseline.cfv_end_date)
        console.log("Current end date:", currentEndDate)
        const nextYearValue = currentEndDate.getFullYear() + 1
        console.log("Next year value:", nextYearValue)
        setNextYear(nextYearValue.toString())
      } else {
        const currentYear = new Date().getFullYear()
        console.log("No baseline exists, using current year:", currentYear)
        setNextYear((currentYear + 1).toString())
      }
      
      setLoading(false)
    } catch (error) {
      console.error("Error fetching baseline:", error)
      if (error.response) {
        console.log("Error response data:", error.response.data)
        console.log("Error response status:", error.response.status)
      }
      setLoading(false)
      
      // If no baseline exists or error occurred, set next year to the next calendar year
      const currentYear = new Date().getFullYear()
      console.log("Using current year after error:", currentYear)
      setNextYear((currentYear + 1).toString())
    }
  }

  // Create new baseline for next year
  const createNewBaseline = async () => {
    try {
      setLoading(true)
      
      // Get user_id from sessionStorage
      let userId;
      try {
        userId = window.sessionStorage.getItem("user_id");
        // If user_id is null or undefined, use a default value
        if (!userId) {
          console.warn("No user_id found in sessionStorage, using default value");
          userId = 1; // Default value as fallback
        }
      } catch (e) {
        console.error("Error accessing sessionStorage:", e);
        userId = 1; // Default value as fallback
      }
      
      console.log("Using user_id:", userId);
      
      // RFC 3339 format with timezone info, required by FastAPI's datetime parsing
      const startDateStr = `${nextYear}-01-31T00:00:00+08:00`
      const endDateStr = `${nextYear}-12-31T23:59:59+08:00`
      
      console.log("Sending baseline data with formatted dates:", {
        user_id: userId,
        cfv_start_date: startDateStr,
        cfv_end_date: endDateStr
      })
      
      // Make the request with RFC 3339 formatted dates
      try {
        const response = await axios.post('http://localhost:8000/baseline', {
          user_id: parseInt(userId),
          cfv_start_date: startDateStr,
          cfv_end_date: endDateStr
        })
        
        console.log("Baseline creation response:", response.data)
        
        // Refresh baseline data
        await fetchBaseline()
        setShowModal(false)
        
        // Success alert
        alert("新年度盤查已成功建立！")
        
        // Redirect to baseline settings page
        navigate('/碳盤查系統/system/基準年設定')
      } catch (innerError) {
        console.error("Inner API call error:", innerError)
        
        if (innerError.response && innerError.response.data) {
          console.log("API error details:", innerError.response.data)
        }
        
        // If the first attempt fails, try with a different date format
        console.log("Trying alternative date format...")
        const altStartDate = `${nextYear}-01-31`
        const altEndDate = `${nextYear}-12-31`
        
        const retryResponse = await axios.post('http://localhost:8000/baseline', {
          user_id: parseInt(userId),
          cfv_start_date: altStartDate,
          cfv_end_date: altEndDate
        })
        
        console.log("Retry response:", retryResponse.data)
        await fetchBaseline()
        setShowModal(false)
        
        // Success alert
        alert("新年度盤查已成功建立！")
        
        // Redirect to baseline settings page
        navigate('/碳盤查系統/system/基準年設定')
      }
      
      setLoading(false)
    } catch (error) {
      console.error("Error creating new baseline:", error)
      
      // Full error diagnostics
      if (error.response) {
        console.log("Error response data:", error.response.data)
        console.log("Error response status:", error.response.status)
        
        if (error.response.data && error.response.data.detail) {
          console.log("Detailed error:", error.response.data.detail)
        }
      }
      
      // Construct error message
      let errorMessage = "建立新基準年時發生錯誤"
      if (error.response && error.response.data && error.response.data.detail) {
        errorMessage += ": " + error.response.data.detail
      } else if (error.message) {
        errorMessage += ": " + error.message
      }
      
      alert(errorMessage)
      setLoading(false)
    }
  }

  return (
    <div className={styles.carbonInventoryContainer}>
      <div className={styles.flowContainer}>
        <h3 className={styles.flowTitle}>本系統碳盤查流程</h3>
        <div className={styles.flowSteps}>
          {flowSteps.map((step, index) => (
            <div 
              key={index} 
              className={`${styles.flowStep} ${step.isActive ? styles.active : ''} `}
            >
              <div className={styles.stepIcon}>
                <FontAwesomeIcon icon={step.icon} />
              </div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>{step.title}</div>
                <div className={styles.stepDescription}>{step.description}</div>
                <div className={styles.stepRole}>{step.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className={styles.nextYearContainer}>
        <div className={styles.nextYearLabel}>下一盤查年度：{nextYear}年</div>
      </div>
      
      <div className={styles.actionContainer}>
        <CButton 
          className={styles.newYearButton} 
          onClick={() => setShowModal(true)}
          disabled={loading}
        >
          {loading ? <CSpinner size="sm" /> : '開啟新一年度盤查'}
        </CButton>
      </div>

      {/* Confirmation Modal */}
      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader>
          <CModalTitle>確認開啟新年度盤查</CModalTitle>
        </CModalHeader>
        <CModalBody>
          您確定要開啟 {nextYear} 年度的碳盤查嗎？
          <p className="mt-3">
            將會設定盤查期間從 {nextYear}/1/1 至 {nextYear}/12/31
          </p>
        </CModalBody>
        <CModalFooter>
          <CButton className="modalbutton1" onClick={() => setShowModal(false)}>
            取消
          </CButton>
          <CButton className="modalbutton2" onClick={createNewBaseline} disabled={loading}>
            {loading ? <CSpinner size="sm" /> : '確認'}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default CarbonInventoryFlow