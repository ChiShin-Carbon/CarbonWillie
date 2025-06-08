import React, { useState, useEffect } from 'react';

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
import { ElectricityAdd } from './電力使用量/新增Modal.js'
import { CommutingAdd } from './員工通勤/新增Modal.js'
import { BusinessTripAdd } from './商務旅行/新增Modal.js'
import { OperationalWasteAdd } from './營運產生廢棄物/新增Modal.js'
import { SellingWasteAdd } from './銷售產品的廢棄物/新增Modal.js'

import { useRefreshData } from './refreshdata.js'

import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'

import styles from '../../../../scss/活動數據盤點.module.css'

// Map function names to their Chinese titles
const functionTitlesMap = {
  'Vehicle': '公務車',
  'FireExtinguisher': '滅火器',
  'Employee': '工作時數(員工)',
  'NonEmployee': '工作時數(非員工)',
  'Refrigerant': '冷媒',
  'Machinery': '廠內機具',
  'EmergencyGenerator': '緊急發電機',
  'Electricity': '電力使用量',
  'Commuting': '員工通勤',
  'BusinessTrip': '商務旅行',
  'OperationalWaste': '營運產生廢棄物',
  'SellingWaste': '銷售產品的廢棄物'
};

// Map Chinese table names to their function names
const chineseToFunctionMap = {
  '公務車': 'Vehicle',
  '滅火器': 'FireExtinguisher',
  '工作時數(員工)': 'Employee',
  '工作時數(非員工)': 'NonEmployee',
  '冷媒': 'Refrigerant',
  '廠內機具': 'Machinery',
  '緊急發電機': 'EmergencyGenerator',
  '電力使用量': 'Electricity',
  '員工通勤': 'Commuting',
  '商務旅行': 'BusinessTrip',
  '營運產生廢棄物': 'OperationalWaste',
  '銷售產品的廢棄物': 'SellingWaste'
};

const Tabs = () => {
  const [currentFunction, setCurrentFunction] = useState('')
  const [currentTitle, setCurrentTitle] = useState('')
  const [authorizedTables, setAuthorizedTables] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState(null)
  const [userPosition, setUserPosition] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  // Check if user has permission to add/edit/delete - hide button for position=1 or role=0 or role=1
  const hasEditPermission = userPosition !== 1 && userRole !== 0 && userRole !== 1

  const {
    vehicle,
    extinguishers,
    employees,
    nonemployees,
    refrigerants,
    machinery,
    Emergency_Generator,
    electricity,
    commute,
    business_trip,
    operationalwaste,
    sellingwaste,
    refreshVehicleData,
    refreshFireExtinguisherData,
    refreshEmployeeData,
    refreshNonEmployeeData,
    refreshRefrigerantData,
    refreshMachineryData,
    refreshEmergency_GeneratorData,
    refreshElectricityData,
    refreshCommuteData,
    refreshBusinessTripData,
    refreshWasteData,
    refreshSellingWasteData
  } = useRefreshData();

  // Fetch user ID and authorized tables on component mount
  useEffect(() => {
    // Get user ID from sessionStorage
    const storedUserId = window.sessionStorage.getItem('user_id');
    const storedUserPosition = parseInt(window.sessionStorage.getItem('position'), 10);
    const storedUserRole = parseInt(window.sessionStorage.getItem('role'), 10);
    
    console.log('Position from sessionStorage:', storedUserPosition);
    console.log('Role from sessionStorage:', storedUserRole);
    
    if (storedUserId) {
      const parsedUserId = parseInt(storedUserId, 10);
      setUserId(parsedUserId);
      setUserPosition(storedUserPosition);
      setUserRole(storedUserRole);
      
      // Fetch authorized tables for this user
      fetchAuthorizedTables(parsedUserId);
    } else {
      console.error('User ID not found in sessionStorage');
      setIsLoading(false);
    }
  }, []);

  // Function to fetch authorized tables from the API
  const fetchAuthorizedTables = async (userId) => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      // Use the same endpoint as in the first file
      const response = await fetch('http://localhost:8000/authorizedTable', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(response.status);
        setErrorMessage(`Error: ${errorData.detail || 'Unknown error'}`);
        setAuthorizedTables([]);
        return;
      }

      const data = await response.json();
      console.log('All authorized records:', data);

      // Filter records for the current user
      const userAuthorizedTables = data.filter(record => record.user_id === userId);
      console.log('User authorized tables:', userAuthorizedTables);

      setAuthorizedTables(userAuthorizedTables);
      setErrorMessage('');
    } catch (error) {
      console.error('Error fetching authorized tables:', error);
      setErrorMessage('Error fetching authorized tables');
      setAuthorizedTables([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if a function/table is authorized for the current user
  const isAuthorized = (functionName) => {
    // If Position is 1 (admin), grant access to all tables
    if (userPosition === 1 || userRole === 1) return true;
    
    // For other positions, check authorized tables
    if (!authorizedTables.length) return false;

    // Convert function name to Chinese title
    const chineseTitle = functionTitlesMap[functionName];
    return authorizedTables.some(table => table.table_name === chineseTitle);
  };

  // Handle clicking on a function item
  const handleFunctionChange = (func, title) => {
    if (isAuthorized(func)) {
      setCurrentFunction(func);
      setCurrentTitle(title);
    } else {
      // Optionally show unauthorized message
      alert('您沒有權限查看此項目');
    }
  };

  // Add a key state to force component re-renders
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Initial data loading for tables
    refreshFireExtinguisherData();
    refreshEmployeeData();
    refreshNonEmployeeData();
    refreshRefrigerantData();
    refreshMachineryData();
    refreshEmergency_GeneratorData();
  }, [
    refreshVehicleData, refreshFireExtinguisherData, refreshEmployeeData,
    refreshNonEmployeeData, refreshRefrigerantData, refreshMachineryData,
    refreshEmergency_GeneratorData, refreshCommuteData, refreshBusinessTripData,
    refreshWasteData, refreshSellingWasteData, refreshElectricityData
  ]);

  // Update key when extinguishers data changes
  useEffect(() => {
    if (extinguishers && extinguishers.length > 0) {
      setRefreshKey(prevKey => prevKey + 1);
    }
  }, [extinguishers]);

  // Update key when refrigerant data changes
  useEffect(() => {
    if (refrigerants && refrigerants.length > 0) {
      setRefreshKey(prevKey => prevKey + 1);
    }
  }, [refrigerants]);

  // Update status in Authorized_Table when a table is completed
  const updateTableStatus = async (functionName, isDone) => {
    // Find the authorized_record_id for the current function
    const tableName = functionTitlesMap[functionName];
    const authorizedItem = authorizedTables.find(item => item.table_name === tableName);

    if (!authorizedItem) {
      console.error(`No authorized record found for ${tableName}`);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/authorized-tables/${authorizedItem.authorized_record_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_done: isDone }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      // Refresh the authorized tables after update
      fetchAuthorizedTables(userId);

      console.log(`Status updated for ${tableName}: ${isDone ? 'Completed' : 'Incomplete'}`);
    } catch (error) {
      console.error('Error updating table status:', error);
    }
  };

  const [isAddModalVisible, setAddModalVisible] = useState(false)

  const renderModalComponent = () => {
    switch (currentFunction) {
      case 'Vehicle':
        return (
          <VehicleAdd
            isAddModalVisible={isAddModalVisible}
            setAddModalVisible={setAddModalVisible}
            refreshVehicleData={refreshVehicleData}
            setCurrentFunction={setCurrentFunction}
            setCurrentTitle={setCurrentTitle}
          />
        )
      case 'FireExtinguisher':
        return (
          <FireExtinguisherAdd
            isAddModalVisible={isAddModalVisible}
            setAddModalVisible={setAddModalVisible}
            refreshFireExtinguisherData={refreshFireExtinguisherData}
            setCurrentFunction={setCurrentFunction}
            setCurrentTitle={setCurrentTitle}
          />
        )
      case 'Employee':
        return (
          <EmployeeAdd
            isAddModalVisible={isAddModalVisible}
            setAddModalVisible={setAddModalVisible}
            refreshEmployeeData={refreshEmployeeData}
            setCurrentFunction={setCurrentFunction}
            setCurrentTitle={setCurrentTitle}
          />
        )
      case 'NonEmployee':
        return (
          <NonEmployeeAdd
            isAddModalVisible={isAddModalVisible}
            setAddModalVisible={setAddModalVisible}
            refreshNonEmployeeData={refreshNonEmployeeData}
            setCurrentFunction={setCurrentFunction}
            setCurrentTitle={setCurrentTitle}
          />
        )
      case 'Refrigerant':
        return (
          <RefrigerantAdd
            isAddModalVisible={isAddModalVisible}
            setAddModalVisible={setAddModalVisible}
            refreshRefrigerantData={refreshRefrigerantData}
            setCurrentFunction={setCurrentFunction}
            setCurrentTitle={setCurrentTitle}
          />
        )
      case 'Machinery':
        return (
          <MachineryAdd
            isAddModalVisible={isAddModalVisible}
            setAddModalVisible={setAddModalVisible}
            refreshMachineryData={refreshMachineryData}
            setCurrentFunction={setCurrentFunction}
            setCurrentTitle={setCurrentTitle}
          />
        )
      case 'EmergencyGenerator':
        return (
          <EmergencyGeneratorAdd
            isAddModalVisible={isAddModalVisible}
            setAddModalVisible={setAddModalVisible}
            refreshEmergency_GeneratorData={refreshEmergency_GeneratorData}
            setCurrentFunction={setCurrentFunction}
            setCurrentTitle={setCurrentTitle}
          />
        )
      case 'Electricity':
        return (
          <ElectricityAdd
            isAddModalVisible={isAddModalVisible}
            setAddModalVisible={setAddModalVisible}
            refreshElectricityData={refreshElectricityData}
            setCurrentFunction={setCurrentFunction}
            setCurrentTitle={setCurrentTitle}
          />
        )
      case 'Commuting':
        return (
          <CommutingAdd
            isAddModalVisible={isAddModalVisible}
            setAddModalVisible={setAddModalVisible}
            refreshCommuteData={refreshCommuteData}
            setCurrentFunction={setCurrentFunction}
            setCurrentTitle={setCurrentTitle}
          />
        )
      case 'BusinessTrip':
        return (
          <BusinessTripAdd
            isAddModalVisible={isAddModalVisible}
            setAddModalVisible={setAddModalVisible}
            refreshBusinessTripData={refreshBusinessTripData}
            setCurrentFunction={setCurrentFunction}
            setCurrentTitle={setCurrentTitle}
          />
        )
      case 'OperationalWaste':
        return (
          <OperationalWasteAdd
            isAddModalVisible={isAddModalVisible}
            setAddModalVisible={setAddModalVisible}
            refreshWasteData={refreshWasteData}
            setCurrentFunction={setCurrentFunction}
            setCurrentTitle={setCurrentTitle}
          />
        )
      case 'SellingWaste':
        return (
          <SellingWasteAdd
            isAddModalVisible={isAddModalVisible}
            setAddModalVisible={setAddModalVisible}
            refreshSellingWasteData={refreshSellingWasteData}
            setCurrentFunction={setCurrentFunction}
            setCurrentTitle={setCurrentTitle}
          />
        )
      default:
        return null
    }
  }

  // Render a nav item with conditional styling based on authorization
  const renderNavItem = (functionName, title) => {
    const isAuthorizedItem = isAuthorized(functionName);
    
    // Get completion status if authorized
    let isCompleted = false;
    if (isAuthorizedItem && authorizedTables.length > 0) {
      const chineseTitle = functionTitlesMap[functionName];
      const authorizedItem = authorizedTables.find(table => table.table_name === chineseTitle);
      isCompleted = authorizedItem ? authorizedItem.is_done : false;
    }

    return (
      <div
        className={`${styles.navContent} 
                   ${currentFunction === functionName ? styles.navContentChoose : ''} 
                   ${!isAuthorizedItem ? styles.navContentDisabled : ''}
                   ${isCompleted ? styles.navContentCompleted : ''}`}
        onClick={() => isAuthorizedItem && handleFunctionChange(functionName, title)}
        style={{
          cursor: isAuthorizedItem ? 'pointer' : 'not-allowed',
          opacity: isAuthorizedItem ? 1 : 0.5,
          backgroundColor: isCompleted ? '#d4edda' : '',
          borderLeft: isCompleted ? '4px solid #28a745' : ''
        }}
      >
        {title}
        {isCompleted && <span style={{ color: '#28a745', marginLeft: '8px' }}>✓</span>}
      </div>
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <CTabs activeItemKey={1}>
        <CTabList variant="underline-border" className="system-tablist">
          <div className={styles.tabsContainer}>
            <div className={styles.tabsLeft}>
              <Link to="/碳盤查系統/system/基準年設定" className="system-tablist-link">
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
        {currentFunction && (
          <button
            className="system-save"
            onClick={() => updateTableStatus(currentFunction, true)}
          >
            完成填寫
          </button>
        )}
      </div>

      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}

      <div className={styles.activityData}>
        <CCard className={styles.activityCard}>
          {currentFunction ? (
            <>
              <div className={styles.activityCardHead}>
                <div className={styles.activityCardHeadTitle}>{currentTitle}</div>
                {hasEditPermission && (
                  <button
                    className={styles.activityAddButton}
                    onClick={() => setAddModalVisible(true)}
                  >
                    新增
                  </button>
                )}
              </div>
              <div className={styles.activityCardBody}>
                {currentFunction === 'Vehicle' &&
                  <Vehicle
                    key={JSON.stringify(vehicle)}
                    vehicle={vehicle}
                    refreshVehicleData={refreshVehicleData}
                  />}
                {currentFunction === 'FireExtinguisher' &&
                  <FireExtinguisher
                    key={refreshKey}
                    extinguishers={extinguishers}
                    refreshFireExtinguisherData={refreshFireExtinguisherData}
                  />}
                {currentFunction === 'Employee' && (
                  <Employee
                    key={JSON.stringify(employees)}
                    employees={employees}
                    refreshEmployeeData={refreshEmployeeData}
                  />
                )}
                {currentFunction === 'NonEmployee' && (
                  <NonEmployee
                    key={JSON.stringify(nonemployees)}
                    nonemployees={nonemployees}
                    refreshNonEmployeeData={refreshNonEmployeeData}
                  />
                )}
                {currentFunction === 'Refrigerant' &&
                  <Refrigerant
                    key={refreshKey}
                    refrigerants={refrigerants}
                    refreshRefrigerantData={refreshRefrigerantData}
                  />
                }
                {currentFunction === 'Machinery' &&
                  <Machinery
                    key={JSON.stringify(machinery)}
                    machinery={machinery}
                    refreshMachineryData={refreshMachineryData}
                  />}
                {currentFunction === 'EmergencyGenerator' &&
                  <EmergencyGenerator
                    key={JSON.stringify(Emergency_Generator)}
                    Emergency_Generator={Emergency_Generator}
                    refreshEmergency_GeneratorData={refreshEmergency_GeneratorData}
                  />}
                {currentFunction === 'Electricity' &&
                  <Electricity
                    key={JSON.stringify(electricity)}
                    electricity={electricity}
                    refreshElectricityData={refreshElectricityData}
                  />}
                {currentFunction === 'Commuting' &&
                  <Commuting
                    key={JSON.stringify(commute)}
                    commute={commute}
                    refreshCommuteData={refreshCommuteData}
                  />}
                {currentFunction === 'BusinessTrip' &&
                  <BusinessTrip
                    key={JSON.stringify(business_trip)}
                    business_trip={business_trip}
                    refreshBusinessTripData={refreshBusinessTripData}
                  />}
                {currentFunction === 'OperationalWaste' &&
                  <OperationalWaste
                    key={JSON.stringify(operationalwaste)}
                    operationalwaste={operationalwaste}
                    refreshWasteData={refreshWasteData}
                  />}
                {currentFunction === 'SellingWaste' &&
                  <SellingWaste
                    key={JSON.stringify(sellingwaste)}
                    sellingwaste={sellingwaste}
                    refreshSellingWasteData={refreshSellingWasteData}
                  />}
              </div>
            </>
          ) : (
            <div className={styles.noChoose}>
              {!(userPosition === 1 || userRole === 1) && authorizedTables.length === 0
                ? '您目前沒有任何授權項目。請聯繫管理員獲取權限。'
                : '請選擇一個項目!'}
            </div>
          )}
        </CCard>

        <CCard className={styles.activityNav}>
          <div>
            <h5 className={styles.navTitle}>健檢主要項目</h5>
            <hr className={styles.hr}></hr>
            <h6>範疇一</h6>
            {renderNavItem('Vehicle', '公務車')}
            {renderNavItem('FireExtinguisher', '滅火器')}
            {renderNavItem('Employee', '工作時數(員工)')}
            {renderNavItem('NonEmployee', '工作時數(非員工)')}
            {renderNavItem('Refrigerant', '冷媒')}
            {renderNavItem('Machinery', '廠內機具')}
            {renderNavItem('EmergencyGenerator', '緊急發電機')}
            <h6>範疇二</h6>
            {renderNavItem('Electricity', '電力使用量')}
            <h6>範疇三</h6>
            {renderNavItem('Commuting', '員工通勤')}
            {renderNavItem('BusinessTrip', '商務旅行')}
            {renderNavItem('OperationalWaste', '營運產生廢棄物')}
            {renderNavItem('SellingWaste', '銷售產品的廢棄物')}
          </div>
        </CCard>
      </div>

      {hasEditPermission && renderModalComponent()}
    </main>
  )
}

export default Tabs