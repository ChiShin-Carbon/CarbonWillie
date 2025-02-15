import React, { useState, useEffect } from 'react'
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
  CFormSelect,
  CForm,
} from '@coreui/react'
import styles from '../../../../../scss/活動數據盤點.module.css'

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const EditModal = ({ isEditModalVisible, setEditModalVisible, selectedElectricity }) => {
  const handleClose = () => setEditModalVisible(false)
  const [FormValues, setFormValues] = useState({
    customer_number: '',
    remark: '',
  })

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormValues((prevValues) => ({ ...prevValues, [id]: value }))
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()

    const form = new FormData()
    form.append('electricity_id', selectedElectricity)
    form.append('user_id', window.sessionStorage.getItem('user_id'))
    form.append('customer_number', FormValues.customer_number)
    form.append('remark', FormValues.remark)

    for (let [key, value] of form.entries()) {
      console.log(`${key}:`, value) // Debugging output
    }

    try {
      const response = await fetch('http://localhost:8000/edit_electricity', {
        method: 'POST',
        body: form, // Send FormData directly
      })

      const data = await response.json()
      if (response.ok && data.status === 'success') {
        alert('Employee record updated successfully!')
        handleClose()
      } else {
        alert(data.message || 'Failed to update employee record.')
      }
    } catch (error) {
      console.error('Error updating employee record:', error)
      alert('An error occurred while updating the employee record.')
    }
  }

  useEffect(() => {
    const fetchElectricityData = async () => {
      if (!selectedElectricity) return

      try {
        const response = await fetch('http://localhost:8000/Electricity_findone', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ Electricity_id: selectedElectricity }),
        })

        if (response.ok) {
          const data = await response.json()
          const ElectricityData = data.Electricity[0]
          setFormValues({
            customer_number: ElectricityData?.customer_number || '',
            remark: ElectricityData?.remark || '',
          })
        } else {
          console.error('Error fetching Electricity data:', await response.text())
        }
      } catch (error) {
        console.error('Error fetching Electricity data:', error)
      }
    }

    fetchElectricityData()
  }, [selectedElectricity])

  return (
    <CModal
      backdrop="static"
      visible={isEditModalVisible}
      onClose={handleClose}
      aria-labelledby="ActivityModalLabel"
      size="xl"
      className={styles.modal}
    >
      <CModalHeader>
        <h5>
          <b>編輯數據-電力</b>
        </h5>
      </CModalHeader>
      <CForm onSubmit={handleEditSubmit}>
        <CModalBody>
          <div className={styles.addmodal}>
            <div className={styles.modalLeft}>
              <CRow className="mb-3">
                <CFormLabel htmlFor="name" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                  電號*
                </CFormLabel>
                <CCol>
                  <CFormInput
                    className={styles.addinput}
                    type="text"
                    id="customer_number"
                    value={FormValues.customer_number}
                    onChange={handleInputChange}
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
                  <CFormTextarea
                    className={styles.addinput}
                    type="text"
                    id="remark"
                    value={FormValues.remark}
                    onChange={handleInputChange}
                    rows={3}
                  />
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
          <CButton className="modalbutton2" type="submit">
            儲存
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  )
}

export default EditModal
