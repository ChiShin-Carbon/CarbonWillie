// EditSuccessModal.js - Updated to use path parameters
import React from 'react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react';
import '../../../../scss/盤查進度管理.css';
import '../../../../scss/碳盤查系統.css';
import styles from '../../../../scss/活動數據盤點.module.css';

const EditSuccessModal = ({ isOpen, onClose, authorizedRecordId, reviewValue = 2, refreshData }) => {
  const handleConfirm = async () => {
    try {
      console.log("Sending review success request for ID:", authorizedRecordId); // 確保 ID 正確
      console.log("Review value:", reviewValue);  // 確認 review 值
      
      const url = `http://localhost:8000/update_review/${authorizedRecordId}/${reviewValue}`;
      console.log("Request URL:", url);
  
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 
          'Accept': 'application/json'
        }
        // No body needed since we're using path parameters
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response error:", errorText);
        throw new Error(`Failed to update review: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("Success:", result.message);
      
      // **更新後重新抓取資料**
      refreshData(); 
      
      // 關閉 modal
      onClose();
      
      // 顯示成功訊息
      alert('審核成功狀態已更新');
      
    } catch (error) {
      console.error('Error:', error);
      alert('更新失敗，請稍後再試: ' + error.message);
    }
  };

  return (
    <CModal visible={isOpen} onClose={onClose}>
      <CModalHeader>
        <CModalTitle id="LiveDemoExampleLabel">審核確認</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="d-flex flex-column align-items-center">
          <center>
            確定為審核成功嗎?
            <br />
            <small className="text-muted">
              此操作將確認該項目已通過審核
            </small>
          </center>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton className="modalbutton1" onClick={onClose}>關閉</CButton>
        <CButton className="modalbutton2" onClick={handleConfirm}>確定</CButton>
      </CModalFooter>
    </CModal>
  );
};

export default EditSuccessModal;