import React , { useState, useEffect }from 'react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react';
import '../../../../scss/盤查進度管理.css'
import '../../../../scss/碳盤查系統.css'
import styles from '../../../../scss/活動數據盤點.module.css'

const EditFalseModal = ({ isOpen, onClose, authorizedRecordId, reviewValue = 3, refreshData }) => {
  const handleConfirm = async () => {
    try {
      console.log("Sending request for ID:", authorizedRecordId); // 確保 ID 正確
      const requestBody = { 
        review: reviewValue // 傳遞 review 的動態值
      };
      console.log("Request Body:", requestBody);  // 確認送出的 JSON 資料
  
      const response = await fetch(`http://localhost:8000/update_review/${authorizedRecordId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)  // 確保 JSON 正確格式
      });
      
      if (!response.ok) {
        throw new Error('Failed to update review');
      }

      // **新增這行: 更新後重新抓取資料**
      refreshData(); 

      onClose();
    } catch (error) {
      console.error('Error:', error);
      alert('更新失敗，請稍後再試');
    }
  };

  return (
    <CModal visible={isOpen} onClose={onClose}>
      <CModalHeader>
        <CModalTitle id="LiveDemoExampleLabel">審核確認</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="d-flex flex-column align-items-center"><center>確定為審核失敗嗎?</center></div>
      </CModalBody>
      <CModalFooter>
        <CButton className="modalbutton1" onClick={onClose}>
            關閉
        </CButton>
        <CButton className="modalbutton2" onClick={handleConfirm}>確定</CButton>
      </CModalFooter>
    </CModal>
  );
};

export default EditFalseModal;
