// EditFalseModal.js - Updated to use path parameters
import React from 'react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react';
import '../../../../scss/盤查進度管理.css'
import '../../../../scss/碳盤查系統.css'
import styles from '../../../../scss/活動數據盤點.module.css'

const EditFalseModal = ({ isOpen, onClose, authorizedRecordId, refreshData }) => {
  const handleConfirm = async () => {
    try {
      console.log("=== REACT DEBUG INFO ===");
      console.log("authorizedRecordId:", authorizedRecordId, "Type:", typeof authorizedRecordId);
      
      const reviewValue = 3; // 審核失敗
      const url = `http://localhost:8000/update_review/${authorizedRecordId}/${reviewValue}`;
      console.log("Request URL:", url);
  
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 
          'Accept': 'application/json'
        }
        // No body needed since we're using path parameters
      });
      
      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response text:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log("Success response:", result);

      // Check if the operation was actually successful
      if (result.message && result.message.includes("審核失敗")) {
        console.log("✅ Review failed status updated successfully!");
      } else {
        console.log("⚠️ Unexpected response message:", result.message);
      }

      // 重新抓取資料
      console.log("Calling refreshData...");
      refreshData(); 
      
      // 關閉 modal
      onClose();
      
      // 顯示成功訊息
      alert('審核失敗狀態已更新，該項目需要重新完成');
      
    } catch (error) {
      console.error('=== ERROR DETAILS ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      alert('更新失敗，請稍後再試: ' + error.message);
    }
  };

  // Also log when modal opens
  React.useEffect(() => {
    if (isOpen) {
      console.log("=== MODAL OPENED ===");
      console.log("authorizedRecordId:", authorizedRecordId);
      console.log("isOpen:", isOpen);
    }
  }, [isOpen, authorizedRecordId]);

  return (
    <CModal visible={isOpen} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>審核確認</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="d-flex flex-column align-items-center">
          <center>
            確定為審核失敗嗎?
            <br />
            <small className="text-muted">
              此操作將會將項目標記為未完成狀態，需要重新填寫
            </small>
          </center>
        </div>
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
