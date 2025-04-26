import React, { useState } from 'react'
import {
  CButton,
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

import '../../../scss/碳盤查系統.css'
import styles from '../../../scss/組織盤查首頁.module.css'

const CarbonInventoryFlow = () => {
  const [showModal, setShowModal] = useState(false)
  
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
      isActive: false,
      isCompleted: false,
    },
    {
      icon: faChartLine,
      title: '確認進度',
      description: '確認被指派到的主管群填寫是否完成',
      role: '組織負責人',
      isActive: false,
      isCompleted: false,
    },
    {
      icon: faUserGear,
      title: '數值確認與維護',
      description: '進行',
      role: '顧問',
      isActive: false,
      isCompleted: false,
    },
    {
      icon: faCheckCircle,
      title: '完成整個盤點',
      description: '確認完所有數值後進行最終的完成盤查確認',
      role: '顧問',
      isActive: false,
      isCompleted: false,
    },
    {
      icon: faFileLines,
      title: '產出結果與報告',
      description: '產出本年度盤查結果數據與圖表，以及生成報告與清冊',
      role: '系統',
      isActive: false,
      isCompleted: false,
    },
  ]

  return (
    <div className={styles.carbonInventoryContainer}>
      <div className={styles.flowContainer}>
        <h3 className={styles.flowTitle}>本系統碳盤查流程</h3>
        <div className={styles.flowSteps}>
          {flowSteps.map((step, index) => (
            <div 
              key={index} 
              className={`${styles.flowStep} ${styles.active} `}
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
        <div className={styles.nextYearLabel}>下一盤查年度：2025年</div>
      </div>
      
      <div className={styles.actionContainer}>
        <CButton className={styles.newYearButton} onClick={() => setShowModal(true)}>
          開啟新一年度盤查
        </CButton>
      </div>
    </div>
  )
}

export default CarbonInventoryFlow