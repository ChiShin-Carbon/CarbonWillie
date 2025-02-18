import React, { useState } from 'react'
import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CButton,
  CFormLabel,
  CFormInput,
  CFormTextarea,
  CRow,
  CCol,
  CCard,
  CFormSelect,
  CTab,
  CTabList,
  CTabs,
  CTable,
  CTableBody,
  CTableHead,
  CFormCheck,
  CCollapse,
  CForm,
  CCardBody,
} from '@coreui/react'

import styles from '../../../../../scss/活動數據盤點.module.css'

import 'react-medium-image-zoom/dist/styles.css'

export const ElectricityAdd = ({ isAddModalVisible, setAddModalVisible }) => {
  const handleClose = () => setAddModalVisible(false)

  const [recognizedText, setRecognizedText] = useState('')

  const handleC8Submit = async (e) => {
    e.preventDefault()

    // Get form elements by their IDs
    const customer_number = document.getElementById('customer_number').value
    const explain = document.getElementById('explain').value

    // Prepare form data
    const formData = new FormData()
    formData.append('user_id', window.sessionStorage.getItem('user_id'))
    formData.append('customer_number', customer_number)
    formData.append('explain', explain)

    try {
      // Send form data to the backend
      const res = await fetch('http://localhost:8000/insert_electricity', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        console.log('Form submitted successfully:', data)
        alert('Form submitted successfully')
      } else {
        console.error('Failed to submit form data')
        alert('Failed to submit form data')
      }
    } catch (error) {
      console.error('Error submitting form data', error)
      alert('Error submitting form data')
    }
  }

  return (
    <CModal
      backdrop="static"
      visible={isAddModalVisible}
      onClose={() => setAddModalVisible(false)}
      aria-labelledby="ActivityModalLabel"
      size="xl"
    >
      <CModalHeader>
        <CModalTitle id="ActivityModalLabel">
          <b>新增數據</b>
        </CModalTitle>
      </CModalHeader>
      <CForm>
        <CModalBody>
          <div className={styles.addmodal}>
            <div className={styles.modalLeft}>
              <CRow className="mb-3">
                <CFormLabel
                  htmlFor="customer_number"
                  className={`col-sm-2 col-form-label ${styles.addlabel}`}
                >
                  電號*
                </CFormLabel>
                <CCol>
                  <CFormInput
                    className={styles.addinput}
                    type="text"
                    id="customer_number"
                    required
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel
                  htmlFor="explain"
                  className={`col-sm-2 col-form-label ${styles.addlabel}`}
                >
                  備註
                </CFormLabel>
                <CCol>
                  <CFormTextarea className={styles.addinput} type="text" id="explain" rows={3} />
                </CCol>
              </CRow>
              <br />
              <div style={{ textAlign: 'center' }}>*為必填欄位</div>
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton className="modalbutton1" onClick={handleClose}>
            取消
          </CButton>
          <CButton type="submit" className="modalbutton2" onClick={handleC8Submit}>
            新增
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  )
}

export default ElectricityAdd
