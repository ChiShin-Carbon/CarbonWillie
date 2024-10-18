import React, { useRef } from 'react'
import { useState } from 'react';


import {
    CRow, CCol, CCard, CCardBody, CCardHeader, CFormSelect, CTab, CTabContent, CTabList, CTabPanel, CTabs, CForm, CFormLabel, CFormInput, CFormTextarea,
    CCardSubtitle, CCardText, CCardTitle, CButton,
    CTable, CTableBody, CTableCaption, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilDataTransferDown } from '@coreui/icons'

import '../../../../scss/碳盤查系統.css'
import { Link } from 'react-router-dom'
import {
    FunctionOne, FunctionTwo, FunctionThree, FunctionFour, FunctionFive, FunctionSix, FunctionSeven, FunctionEight
} from './活動數據盤點function.js';


import 'primereact/resources/themes/saga-blue/theme.css';  // 主题样式
import 'primereact/resources/primereact.min.css';          // 核心 CSS
import 'primeicons/primeicons.css';                        // 图标样式

import styles from '../../../../scss/活動數據盤點.module.css'

import ActivityModal from './活動數據盤點新增modal.js';


const Tabs = () => {
    const [currentFunction, setCurrentFunction] = useState('');
    const [currentTitle, setCurrentTitle] = useState('');


    // 點擊處理函數
    const handleFunctionChange = (func, title) => {
        setCurrentFunction(func);
        setCurrentTitle(title);
    };


    const [isAddModalVisible, setAddModalVisible] = useState(false);



    return (
        <main>
            <CTabs activeItemKey={1}>
                <CTabList variant="underline-border" className="system-tablist">
                    <div className={styles.tabsContainer}>
                        <div className={styles.tabsLeft}>
                            <Link to="/碳盤查系統/system" className="system-tablist-link"><CTab aria-controls="tab1" itemKey={3} className="system-tablist-choose">
                                基準年&邊界設定
                            </CTab></Link>
                            <Link to="/碳盤查系統/system/活動數據分配" className="system-tablist-link"><CTab aria-controls="tab3" itemKey={4} className="system-tablist-choose">
                                活動數據分配
                            </CTab></Link>
                            <Link to="." className="system-tablist-link"><CTab aria-controls="tab3" itemKey={1} className="system-tablist-choose">
                                活動數據盤點
                            </CTab></Link>
                        </div>
                        <div className={styles.tabsRight}>
                            <Link to="/碳盤查系統/system/盤查進度管理" className="system-tablist-link"><CTab aria-controls="tab3" itemKey={5} className="system-tablist-choose">
                                盤查進度管理
                            </CTab></Link>
                        </div>
                    </div>
                </CTabList>

            </CTabs>


            <div className="system-titlediv">
                <div>
                    <h4 className="system-title">活動數據盤點</h4>
                    <hr className="system-hr"></hr>
                </div>
                <button className="system-save">儲存</button>
            </div>

            <div className={styles.activityData}>
                <CCard className={styles.activityCard}>
                    {currentFunction ? (
                        <>
                            <div className={styles.activityCardHead}>
                                <div className={styles.activityCardHeadTitle}>{currentTitle}</div>
                                <button className={styles.activityAddButton} onClick={() => setAddModalVisible(true)}>新增</button>
                            </div>
                            <div className={styles.activityCardBody}>
                                {currentFunction === 'one' && <FunctionOne />}
                                {currentFunction === 'two' && <FunctionTwo />}
                                {currentFunction === 'three' && <FunctionThree />}
                                {currentFunction === 'four' && <FunctionFour />}
                                {currentFunction === 'five' && <FunctionFive />}
                                {currentFunction === 'six' && <FunctionSix />}
                                {currentFunction === 'seven' && <FunctionSeven />}
                                {currentFunction === 'eight' && <FunctionEight />}
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
                        <div className={`${styles.navContent} ${currentFunction === 'one' ? styles.navContentChoose : ''}`} onClick={() => handleFunctionChange('one', '公務車(汽油)')} > 公務車</div>
                        <div className={`${styles.navContent} ${currentFunction === 'two' ? styles.navContentChoose : ''}`} onClick={() => handleFunctionChange('two', '滅火器')}>滅火器</div>
                        <div className={`${styles.navContent} ${currentFunction === 'three' ? styles.navContentChoose : ''}`} onClick={() => handleFunctionChange('three', '工作時數(員工)')}>工作時數(員工)</div>
                        <div className={`${styles.navContent} ${currentFunction === 'four' ? styles.navContentChoose : ''}`} onClick={() => handleFunctionChange('four', '工作時數(非員工)')}>工作時數(非員工)</div>
                        <div className={`${styles.navContent} ${currentFunction === 'five' ? styles.navContentChoose : ''}`} onClick={() => handleFunctionChange('five', '冷媒')}>冷媒</div>

                        <div className={`${styles.navContent} ${currentFunction === 'six' ? styles.navContentChoose : ''}`} onClick={() => handleFunctionChange('six', '廠內機具')}>廠內機具</div>
                        <div className={`${styles.navContent} ${currentFunction === 'seven' ? styles.navContentChoose : ''}`} onClick={() => handleFunctionChange('seven', '緊急發電機')}>緊急發電機</div>
                        <h6>範疇二</h6>
                        <div className={`${styles.navContent} ${currentFunction === 'eight' ? styles.navContentChoose : ''}`} onClick={() => handleFunctionChange('eight', '電力使用量')}>電力使用量</div>
                        <h6>範疇三</h6>
                    </div>
                </CCard>
            </div>




            <ActivityModal
                isAddModalVisible={isAddModalVisible}
                setAddModalVisible={setAddModalVisible}
                currentFunction={currentFunction}
            />

        </main>
    );
}

export default Tabs;
