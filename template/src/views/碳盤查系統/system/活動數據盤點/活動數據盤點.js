import React, { useRef } from 'react'
import { useState } from 'react'

import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CFormSelect,
  CTab,
  CTabContent,
  CTabList,
  CTabPanel,
  CTabs,
  CForm,
  CFormLabel,
  CFormInput,
  CFormTextarea,
  CCardSubtitle,
  CCardText,
  CCardTitle,
  CButton,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilDataTransferDown } from '@coreui/icons'

import '../../../../scss/碳盤查系統.css'
import { Link } from 'react-router-dom'

import { Vehicle } from './公務車/公務車.js'
import { FireExtinguisher } from './滅火器/滅火器.js'
import { Employee } from './工作時數(員工)/工作時數(員工).js'
import { NonEmployee } from './工作時數(非員工)/工作時數(非員工).js'
import { Refrigerant } from './冷媒/冷媒.js'
import { Machinery } from './廠內機具/廠內機具.js'
import { EmergencyGenerator } from './緊急發電機/緊急發電機.js'
// import { ElectricityUsage } from './電力使用/電力使用量.js'
import { Electricity } from './電力使用量/電力使用量.js'
import { Commuting } from './員工通勤/員工通勤.js'
import { BusinessTrip } from './商務旅行/商務旅行.js'
import { OperationalWaste } from './營運產生廢棄物/營運產生廢棄物.js'
import { SellingWaste } from './銷售產品的廢棄物/銷售產品的廢棄物.js'

import { VehicleAdd } from './公務車/新增Modal.js'
import { FireExtinguisherAdd } from './滅火器/新增Modal.js'
import { EmployeeAdd } from './工作時數(員工)/新增Modal.js'
import { NonEmployeeAdd } from './工作時數(非員工)/新增Modal.js'
import { RefrigerantAdd } from './冷媒/新增Modal.js'
import { MachineryAdd } from './廠內機具/新增Modal.js'
import { EmergencyGeneratorAdd } from './緊急發電機/新增Modal.js'
// import { ElectricityUsageAdd } from './電力使用/新增Modal.js'
import { ElectricityAdd } from './電力使用量/新增Modal.js'
import { CommutingAdd } from './員工通勤/新增Modal.js'
import { BusinessTripAdd } from './商務旅行/新增Modal.js'
import { OperationalWasteAdd } from './營運產生廢棄物/新增Modal.js'
import { SellingWasteAdd } from './銷售產品的廢棄物/新增Modal.js'

import 'primereact/resources/themes/saga-blue/theme.css' // 主题样式
import 'primereact/resources/primereact.min.css' // 核心 CSS
import 'primeicons/primeicons.css' // 图标样式

import styles from '../../../../scss/活動數據盤點.module.css'

// import ActivityModal from './活動數據盤點新增modal.js';

const Tabs = () => {
  const [currentFunction, setCurrentFunction] = useState('')
  const [currentTitle, setCurrentTitle] = useState('')

  // 點擊處理函數
  const handleFunctionChange = (func, title) => {
    setCurrentFunction(func)
    setCurrentTitle(title)
  }

  const [isAddModalVisible, setAddModalVisible] = useState(false)

  const renderModalComponent = () => {
    switch (currentFunction) {
      case 'Vehicle':
        return (
          <VehicleAdd
            isAddModalVisible={isAddModalVisible}
            setAddModalVisible={setAddModalVisible}
          />
        )
      case 'FireExtinguisher':
        return (
          <FireExtinguisherAdd
            isAddModalVisible={isAddModalVisible}
            setAddModalVisible={setAddModalVisible}
          />
        )
      case 'Employee':
        return (
          <EmployeeAdd
            isAddModalVisible={isAddModalVisible}
            setAddModalVisible={setAddModalVisible}
          />
        )
      case 'NonEmployee':
        return (
          <NonEmployeeAdd
            isAddModalVisible={isAddModalVisible}
            setAddModalVisible={setAddModalVisible}
          />
        )
      case 'Refrigerant':
        return (
          <RefrigerantAdd
            isAddModalVisible={isAddModalVisible}
            setAddModalVisible={setAddModalVisible}
          />
        )
      case 'Machinery':
        return (
          <MachineryAdd
            isAddModalVisible={isAddModalVisible}
            setAddModalVisible={setAddModalVisible}
          />
        )
      case 'EmergencyGenerator':
        return (
          <EmergencyGeneratorAdd
            isAddModalVisible={isAddModalVisible}
            setAddModalVisible={setAddModalVisible}
          />
        )
      // case 'ElectricityUsage':
      //   return (
      //     <ElectricityUsageAdd
      //       isAddModalVisible={isAddModalVisible}
      //       setAddModalVisible={setAddModalVisible}
      //     />
      //   )
      case 'Electricity':
        return (
          <ElectricityAdd
            isAddModalVisible={isAddModalVisible}
            setAddModalVisible={setAddModalVisible}
          />
        )
      case 'Commuting':
        return (
          <CommutingAdd
            isAddModalVisible={isAddModalVisible}
            setAddModalVisible={setAddModalVisible}
          />
        )
      case 'BusinessTrip':
        return (
          <BusinessTripAdd
            isAddModalVisible={isAddModalVisible}
            setAddModalVisible={setAddModalVisible}
          />
        )
      case 'OperationalWaste':
        return (
          <OperationalWasteAdd
            isAddModalVisible={isAddModalVisible}
            setAddModalVisible={setAddModalVisible}
          />
        )
      case 'SellingWaste':
        return (
          <SellingWasteAdd
            isAddModalVisible={isAddModalVisible}
            setAddModalVisible={setAddModalVisible}
          />
        )

      default:
        return null
    }
  }

  return (
    <main>
      <CTabs activeItemKey={1}>
        <CTabList variant="underline-border" className="system-tablist">
          <div className={styles.tabsContainer}>
            <div className={styles.tabsLeft}>
              <Link to="/碳盤查系統/system" className="system-tablist-link">
                <CTab aria-controls="tab1" itemKey={3} className="system-tablist-choose">
                  基準年&邊界設定
                </CTab>
              </Link>
              <Link to="/碳盤查系統/system/活動數據分配" className="system-tablist-link">
                <CTab aria-controls="tab3" itemKey={4} className="system-tablist-choose">
                  活動數據分配
                </CTab>
              </Link>
              <Link to="." className="system-tablist-link">
                <CTab aria-controls="tab3" itemKey={1} className="system-tablist-choose">
                  活動數據盤點
                </CTab>
              </Link>
            </div>
            <div className={styles.tabsRight}>
              <Link to="/碳盤查系統/system/盤查進度管理" className="system-tablist-link">
                <CTab aria-controls="tab3" itemKey={5} className="system-tablist-choose">
                  盤查進度管理
                </CTab>
              </Link>
            </div>
          </div>
        </CTabList>
      </CTabs>

      <div className="system-titlediv">
        <div>
          <h4 className="system-title">活動數據盤點</h4>
          <hr className="system-hr"></hr>
        </div>
        <button className="system-save">完成填寫</button>
      </div>

      <div className={styles.activityData}>
        <CCard className={styles.activityCard}>
          {currentFunction ? (
            <>
              <div className={styles.activityCardHead}>
                <div className={styles.activityCardHeadTitle}>{currentTitle}</div>
                <button
                  className={styles.activityAddButton}
                  onClick={() => setAddModalVisible(true)}
                >
                  新增
                </button>
              </div>
              <div className={styles.activityCardBody}>
                {currentFunction === 'Vehicle' && <Vehicle />}
                {currentFunction === 'FireExtinguisher' && <FireExtinguisher />}
                {currentFunction === 'Employee' && <Employee />}
                {currentFunction === 'NonEmployee' && <NonEmployee />}
                {currentFunction === 'Refrigerant' && <Refrigerant />}
                {currentFunction === 'Machinery' && <Machinery />}
                {currentFunction === 'EmergencyGenerator' && <EmergencyGenerator />}
                {/* {currentFunction === 'ElectricityUsage' && <ElectricityUsage />} */}
                {currentFunction === 'Electricity' && <Electricity />}
                {currentFunction === 'Commuting' && <Commuting />}
                {currentFunction === 'BusinessTrip' && <BusinessTrip />}
                {currentFunction === 'OperationalWaste' && <OperationalWaste />}
                {currentFunction === 'SellingWaste' && <SellingWaste />}
              </div>
            </>
          ) : (
            <div className={styles.noChoose}>請先選擇項目!</div>
          )}
        </CCard>

        <CCard className={styles.activityNav}>
          <div>
            <h5 className={styles.navTitle}>健檢主要項目</h5>
            <hr className={styles.hr}></hr>
            <h6>範疇一</h6>
            <div
              className={`${styles.navContent} ${currentFunction === 'Vehicle' ? styles.navContentChoose : ''}`}
              onClick={() => handleFunctionChange('Vehicle', '公務車')}
            >
              {' '}
              公務車
            </div>
            <div
              className={`${styles.navContent} ${currentFunction === 'FireExtinguisher' ? styles.navContentChoose : ''}`}
              onClick={() => handleFunctionChange('FireExtinguisher', '滅火器')}
            >
              滅火器
            </div>
            <div
              className={`${styles.navContent} ${currentFunction === 'Employee' ? styles.navContentChoose : ''}`}
              onClick={() => handleFunctionChange('Employee', '工作時數(員工)')}
            >
              工作時數(員工)
            </div>
            <div
              className={`${styles.navContent} ${currentFunction === 'NonEmployee' ? styles.navContentChoose : ''}`}
              onClick={() => handleFunctionChange('NonEmployee', '工作時數(非員工)')}
            >
              工作時數(非員工)
            </div>
            <div
              className={`${styles.navContent} ${currentFunction === 'Refrigerant' ? styles.navContentChoose : ''}`}
              onClick={() => handleFunctionChange('Refrigerant', '冷媒')}
            >
              冷媒
            </div>
            <div
              className={`${styles.navContent} ${currentFunction === 'Machinery' ? styles.navContentChoose : ''}`}
              onClick={() => handleFunctionChange('Machinery', '廠內機具')}
            >
              廠內機具
            </div>
            <div
              className={`${styles.navContent} ${currentFunction === 'EmergencyGenerator' ? styles.navContentChoose : ''}`}
              onClick={() => handleFunctionChange('EmergencyGenerator', '緊急發電機')}
            >
              緊急發電機
            </div>
            <h6>範疇二</h6>
            {/* <div
              className={`${styles.navContent} ${currentFunction === 'ElectricityUsage' ? styles.navContentChoose : ''}`}
              onClick={() => handleFunctionChange('ElectricityUsage', '電力使用')}
            >
              電力使用
            </div> */}
            <div
              className={`${styles.navContent} ${currentFunction === 'Electricity' ? styles.navContentChoose : ''}`}
              onClick={() => handleFunctionChange('Electricity', '電力使用量')}
            >
              電力使用量
            </div>
            <h6>範疇三</h6>
            <div
              className={`${styles.navContent} ${currentFunction === 'Commuting' ? styles.navContentChoose : ''}`}
              onClick={() => handleFunctionChange('Commuting', '員工通勤')}
            >
              員工通勤
            </div>
            <div
              className={`${styles.navContent} ${currentFunction === 'BusinessTrip' ? styles.navContentChoose : ''}`}
              onClick={() => handleFunctionChange('BusinessTrip', '商務旅行')}
            >
              商務旅行
            </div>
            <div
              className={`${styles.navContent} ${currentFunction === 'OperationalWaste' ? styles.navContentChoose : ''}`}
              onClick={() => handleFunctionChange('OperationalWaste', '營運產生廢棄物')}
            >
              營運產生廢棄物
            </div>
            <div
              className={`${styles.navContent} ${currentFunction === 'SellingWaste' ? styles.navContentChoose : ''}`}
              onClick={() => handleFunctionChange('SellingWaste', '銷售產品的廢棄物')}
            >
              銷售產品的廢棄物
            </div>
          </div>
        </CCard>
      </div>

      {renderModalComponent()}
    </main>
  )
}

export default Tabs
