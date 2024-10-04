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
    FunctionOne, FunctionTwo, FunctionThree, FunctionFour, FunctionFive, FunctionSix, FunctionSeven, FunctionEight,
    FunctionNine, FunctionTen, FunctionEleven, FunctionTwelve, FunctionThirteen, FunctionForteen, FunctionFifteen, FunctionSixteen
    , FunctionSeventeen
} from './活動數據盤點function.js';

import 'primereact/resources/themes/saga-blue/theme.css';  // 主题样式
import 'primereact/resources/primereact.min.css';          // 核心 CSS
import 'primeicons/primeicons.css';                        // 图标样式

import styles from '../../../../scss/活動數據盤點.module.css'

import ActivityModal from './活動數據盤點新增modal.js';


const Tabs = () => {
    const [currentFunction, setCurrentFunction] = useState('one');
    const [currentTitle, setCurrentTitle] = useState('公務車(汽油)');


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
                        <div className={styles.buttonRight}>
                            <button>盤點完成</button>
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
                        {currentFunction === 'nine' && <FunctionNine />}
                        {currentFunction === 'ten' && <FunctionTen />}
                        {currentFunction === 'eleven' && <FunctionEleven />}
                        {currentFunction === 'twelve' && <FunctionTwelve />}
                        {currentFunction === 'thirteen' && <FunctionThirteen />}
                        {currentFunction === 'forteen' && <FunctionForteen />}
                        {currentFunction === 'fifteen' && <FunctionFifteen />}
                        {currentFunction === 'sixteen' && <FunctionSixteen />}
                        {currentFunction === 'seventeen' && <FunctionSeventeen />}
                    </div>
                </CCard>


                <CCard className={styles.activityNav}>
                    <div>
                        <h5 className={styles.navTitle}>範疇一</h5>
                        <hr className={styles.hr}></hr>

                        <div className={`${styles.navContent} ${currentFunction === 'one' ? styles.navContentChoose : ''}`} onClick={() => handleFunctionChange('one', '公務車(汽油)')} > 公務車(汽油)</div>
                        <div className={`${styles.navContent} ${currentFunction === 'two' ? styles.navContentChoose : ''}`} onClick={() => handleFunctionChange('two', '公務車(柴油)')}>公務車(柴油)</div>
                        <div className={`${styles.navContent} ${currentFunction === 'three' ? styles.navContentChoose : ''}`} onClick={() => handleFunctionChange('three', '滅火器')}>滅火器</div>
                        <div className={`${styles.navContent} ${currentFunction === 'four' ? styles.navContentChoose : ''}`} onClick={() => handleFunctionChange('four', '工作時數(員工)')}>工作時數(員工)</div>
                        <div className={`${styles.navContent} ${currentFunction === 'five' ? styles.navContentChoose : ''}`} onClick={() => handleFunctionChange('five', '工作時數(非員工)')}>工作時數(非員工)</div>
                        <div className={`${styles.navContent} ${currentFunction === 'six' ? styles.navContentChoose : ''}`} onClick={() => handleFunctionChange('six', '冷媒')}>冷媒</div>
                        <div className={`${styles.navContent} ${currentFunction === 'seven' ? styles.navContentChoose : ''}`} onClick={() => handleFunctionChange('seven', '固定式燃燒')}>固定式燃燒</div>
                        <div className={`${styles.navContent} ${currentFunction === 'eight' ? styles.navContentChoose : ''}`} onClick={() => handleFunctionChange('eight', '產生溫室氣體的排放製程')}>產生溫室氣體的排放製程</div>
                        <div className={`${styles.navContent} ${currentFunction === 'nine' ? styles.navContentChoose : ''}`} onClick={() => handleFunctionChange('nine', '廠內機具')}>廠內機具</div>
                        <div className={`${styles.navContent} ${currentFunction === 'ten' ? styles.navContentChoose : ''}`} onClick={() => handleFunctionChange('ten', '緊急發電機')}>緊急發電機</div>
                        <div className={`${styles.navContent} ${currentFunction === 'eleven' ? styles.navContentChoose : ''}`} onClick={() => handleFunctionChange('eleven', '焊條')}>焊條</div>
                        <div className={`${styles.navContent} ${currentFunction === 'twelve' ? styles.navContentChoose : ''}`} onClick={() => handleFunctionChange('twelve', '氣體斷路器(GCB)')}>氣體斷路器(GCB)</div>
                        <div className={`${styles.navContent} ${currentFunction === 'thirteen' ? styles.navContentChoose : ''}`} onClick={() => handleFunctionChange('thirteen', '其他')}>其他</div>
                    </div>
                    <div>
                        <h5 className={styles.navTitle}>範疇二</h5>
                        <hr className={styles.hr}></hr>

                        <div className={`${styles.navContent} ${currentFunction === 'forteen' ? styles.navContentChoose : ''}`} onClick={() => handleFunctionChange('forteen', '電力使用量')}>電力使用量</div>
                        <div className={`${styles.navContent} ${currentFunction === 'fiteen' ? styles.navContentChoose : ''}`} onClick={() => handleFunctionChange('fifteen', '間接蒸氣(有做溫室氣體盤查)')}>間接蒸氣<span>(汽電共生廠有做溫室氣體盤查)</span></div>
                        <div className={`${styles.navContent} ${currentFunction === 'sixteen' ? styles.navContentChoose : ''}`} onClick={() => handleFunctionChange('sixteen', '間接蒸氣(沒有做溫室氣體盤查)')}>間接蒸氣<span>(汽電共生廠沒有做溫室氣體盤查)</span></div>
                        <div className={`${styles.navContent} ${currentFunction === 'seventeen' ? styles.navContentChoose : ''}`} onClick={() => handleFunctionChange('seventeen', '其他')}>其他</div>
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
