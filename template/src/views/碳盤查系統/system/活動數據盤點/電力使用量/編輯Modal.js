import React, { useState, useEffect, useCallback } from 'react';
import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CButton,
  CFormLabel,
  CFormInput,
  CFormTextarea,
  CRow,
  CCol,
  CForm,
  CAlert,
  CModalTitle
} from '@coreui/react';
import styles from '../../../../../scss/活動數據盤點.module.css';
import { useRefreshData } from '../refreshdata';

const EditModal = ({
  isEditModalVisible,
  setEditModalVisible,
  selectedElectricity,
  refreshElectricityData,
  setCurrentFunction,
  setCurrentTitle
}) => {
  // Create a local refresh instance as backup
  const localRefreshData = useRefreshData();
  
  // Form state
  const [formValues, setFormValues] = useState({
    customer_number: '',
    remark: '',
  });

  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertColor, setAlertColor] = useState('danger');
  const [formErrors, setFormErrors] = useState({});

  // Handle closing the modal
  const handleClose = () => {
    setEditModalVisible(false);
    resetForm();
  };

  // Reset form
  const resetForm = useCallback(() => {
    setFormValues({
      customer_number: '',
      remark: '',
    });
    setFormErrors({});
    setShowAlert(false);
  }, []);

  // Safe refresh function that tries multiple approaches
  const safeRefresh = async () => {
    console.log("Attempting to refresh electricity data...");
    try {
      // First try the prop passed from parent
      if (typeof refreshElectricityData === 'function') {
        console.log("Using refreshElectricityData from props");
        await refreshElectricityData();
        return true;
      } 
      // Then try our local refresh
      else if (localRefreshData && typeof localRefreshData.refreshElectricityData === 'function') {
        console.log("Using localRefreshData.refreshElectricityData");
        await localRefreshData.refreshElectricityData();
        return true;
      }
      console.warn("No valid refresh function found");
      return false;
    } catch (error) {
      console.error("Error refreshing data:", error);
      return false;
    }
  };

  // Show alert with auto-hide
  const showFormAlert = (message, color) => {
    setAlertMessage(message);
    setAlertColor(color);
    setShowAlert(true);

    // Auto hide after 5 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    
    setFormValues(prev => ({
      ...prev,
      [id]: value
    }));

    // Clear validation error for this field
    if (formErrors[id]) {
      setFormErrors(prev => ({
        ...prev,
        [id]: undefined
      }));
    }
  };

  // Validate the form
  const validateForm = () => {
    const errors = {};
    
    if (!formValues.customer_number.trim()) errors.customer_number = '請輸入電號';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent double submissions
    if (isSubmitting) return;
    
    // Validate form
    if (!validateForm()) {
      showFormAlert('請填寫所有必填欄位', 'danger');
      return;
    }
    
    setIsSubmitting(true);

    try {
      showFormAlert('正在提交資料...', 'info');

      const form = new FormData();
      form.append('electricity_id', selectedElectricity);
      form.append('user_id', window.sessionStorage.getItem('user_id'));
      form.append('customer_number', formValues.customer_number);
      form.append('remark', formValues.remark || "");

      // Add debugging info
      console.log("Form data being sent:");
      for (let [key, value] of form.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await fetch('http://localhost:8000/edit_electricity', {
        method: 'POST',
        body: form, // Send FormData directly
      });

      const data = await response.json();
      
      if (response.ok && data.status === 'success') {
        // Close modal first
        setEditModalVisible(false);
        
        // Wait a moment before refreshing data
        setTimeout(async () => {
          const refreshSuccessful = await safeRefresh();
          
          // Update current function and title if available
          if (typeof setCurrentFunction === 'function') {
            setCurrentFunction("Electricity");
          }
          
          if (typeof setCurrentTitle === 'function') {
            setCurrentTitle("用電");
          }
          
          if (refreshSuccessful) {
            alert("資料提交成功！");
          } else {
            alert("資料已提交，但無法自動刷新頁面。請手動刷新。");
          }
        }, 500);
      } else {
        showFormAlert(data.message || '更新電號資料失敗。', 'danger');
      }
    } catch (error) {
      console.error('更新電號資料時發生錯誤:', error);
      showFormAlert(`提交時發生錯誤: ${error.message}`, 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch electricity data when selected electricity changes
  useEffect(() => {
    const fetchElectricityData = async () => {
      if (!selectedElectricity) return;

      resetForm(); // Reset form before fetching new data

      try {
        showFormAlert('載入中...', 'info');
        
        const response = await fetch('http://localhost:8000/Electricity_findone', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ Electricity_id: selectedElectricity }),
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data.Electricity && data.Electricity.length > 0) {
            const electricityData = data.Electricity[0];
            setFormValues({
              customer_number: electricityData?.customer_number || '',
              remark: electricityData?.remark || '',
            });
            setShowAlert(false); // Hide the loading alert
          } else {
            showFormAlert('找不到電號資料', 'danger');
          }
        } else {
          console.error('Error fetching electricity data:', await response.text());
          showFormAlert('擷取資料時發生錯誤', 'danger');
        }
      } catch (error) {
        console.error('Error fetching electricity data:', error);
        showFormAlert('擷取資料時發生錯誤', 'danger');
      }
    };

    if (isEditModalVisible && selectedElectricity) {
      fetchElectricityData();
    }
  }, [selectedElectricity, isEditModalVisible, resetForm]);

  return (
    <CModal
      backdrop="static"
      visible={isEditModalVisible}
      onClose={handleClose}
      aria-labelledby="EditElectricityModalLabel"
      size="xl"
      className={styles.modal}
    >
      <CModalHeader>
        <CModalTitle id="EditElectricityModalLabel">
          <b>編輯電號資料</b>
        </CModalTitle>
      </CModalHeader>
      
      <CForm onSubmit={handleEditSubmit}>
        <CModalBody>
          {showAlert && (
            <CAlert color={alertColor} dismissible>
              {alertMessage}
            </CAlert>
          )}
          
          <div className={styles.addmodal}>
            <div className={styles.modalLeft}>
              <CRow className="mb-3">
                <CFormLabel htmlFor="customer_number" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                  電號*
                </CFormLabel>
                <CCol>
                  <CFormInput
                    className={styles.addinput}
                    type="text"
                    id="customer_number"
                    value={formValues.customer_number}
                    onChange={handleInputChange}
                    invalid={!!formErrors.customer_number}
                  />
                  {formErrors.customer_number && (
                    <div className="invalid-feedback">{formErrors.customer_number}</div>
                  )}
                </CCol>
              </CRow>
              
              <CRow className="mb-3">
                <CFormLabel htmlFor="remark" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                  備註
                </CFormLabel>
                <CCol>
                  <CFormTextarea
                    className={styles.addinput}
                    type="text"
                    id="remark"
                    value={formValues.remark}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="選填，可記錄其他相關資訊"
                  />
                </CCol>
              </CRow>
              
              <div className="text-center mt-3">
                <small>*為必填欄位</small>
              </div>
            </div>
            
            <div className={styles.modalRight}>
              <CFormLabel className={styles.addlabel}>
                填表說明
              </CFormLabel>
              <div className={styles.infoBlock || 'p-3 border'}>
                <ul className="mb-0">
                  <li>電號為必填項目</li>
                  <li>請確保電號資料正確</li>
                  <li>備註可提供額外資訊，如使用位置等</li>
                  <li>提交後可在主頁面查看更新後的資料</li>
                </ul>
              </div>
            </div>
          </div>
        </CModalBody>
        
        <CModalFooter>
          <CButton
            className="modalbutton1"
            onClick={handleClose}
            disabled={isSubmitting}
            type="button"
          >
            取消
          </CButton>
          <CButton
            type="submit"
            className="modalbutton2"
            disabled={isSubmitting}
          >
            {isSubmitting ? '提交中...' : '儲存'}
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  );
};

export default EditModal;