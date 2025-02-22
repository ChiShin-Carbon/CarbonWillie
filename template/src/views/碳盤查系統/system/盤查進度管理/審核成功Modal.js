import React , { useState, useEffect }from 'react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react';
import '../../../../scss/盤查進度管理.css'
import '../../../../scss/碳盤查系統.css'
import styles from '../../../../scss/活動數據盤點.module.css'

const EditSuccessModal = ({ isOpen, onClose }) => {
  return (
    <CModal visible={isOpen} onClose={onClose}>
      <CModalHeader>
        <CModalTitle id="LiveDemoExampleLabel"></CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="d-flex flex-column align-items-center"><center>確定為審核成功嗎?</center></div>
      </CModalBody>
      <CModalFooter>
        <CButton className="modalbutton1" onClick={onClose}>
            關閉
        </CButton>
        <CButton className="modalbutton2" onClick={onClose}>確定</CButton>
      </CModalFooter>
    </CModal>
  );
};

export default EditSuccessModal;


{/* 審核成功model */}
            //   <CModal
            //     visible={successbutton}
            //     onClose={() => setsuccessVisible(false)}
            //     aria-labelledby="LiveDemoExampleLabel"
            //   >
            //     <CModalHeader>
            //       <CModalTitle id="LiveDemoExampleLabel"></CModalTitle>
            //     </CModalHeader>
            //     <CModalBody>
            //       <div className="d-flex flex-column align-items-center"><center>確定為審核成功嗎?</center></div>
            //     </CModalBody>
            //     <CModalFooter>
            //       <CButton className="modalbutton1" onClick={() => setsuccessVisible(false)}>
            //         關閉
            //       </CButton>
            //       <CButton className="modalbutton2">確定</CButton>
            //     </CModalFooter>
            //   </CModal>
            //     {/* 審核失敗model */}
            //   <CModal
            //     visible={falsebutton}
            //     onClose={() => setfalseVisible(false)}
            //     aria-labelledby="LiveDemoExampleLabel"
            //   >
            //     <CModalHeader>
            //       <CModalTitle id="LiveDemoExampleLabel"></CModalTitle>
            //     </CModalHeader>
            //     <CModalBody>
            //       <div className="d-flex flex-column align-items-center"><center>確定為審核失敗嗎?</center></div>
            //     </CModalBody>
            //     <CModalFooter>
            //       <CButton className="modalbutton1" onClick={() => setfalseVisible(false)}>
            //         關閉
            //       </CButton>
            //       <CButton className="modalbutton2">確定</CButton>
            //     </CModalFooter>
            //   </CModal>