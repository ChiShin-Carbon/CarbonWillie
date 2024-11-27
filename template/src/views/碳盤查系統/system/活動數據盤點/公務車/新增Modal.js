import React, { useState, useEffect } from 'react'
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

export const VehicleAdd = ({ isAddModalVisible, setAddModalVisible }) => {
  const [C1date, setC1date] = useState('')
  const [C1num, setC1num] = useState('')
  const handleClose = () => setAddModalVisible(false)

  const [recognizedText, setRecognizedText] = useState('')

  const handleC1Submit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    // formData.append('user_id', 1)
    formData.append('user_id', window.sessionStorage.getItem('user_id'))
    formData.append('date', document.getElementById('date').value)
    formData.append('number', document.getElementById('num').value)
    formData.append('oil_species', document.getElementById('type').value)
    formData.append('liters', document.getElementById('quantity').value)
    formData.append('remark', document.getElementById('explain').value)
    formData.append('image', document.getElementById('C1image').files[0])

    try {
      const res = await fetch('http://localhost:8000/insert_vehicle', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (res.ok) {
        console.log('Form submitted successfully', data)
        setAddModalVisible(false)
        getVehicleData()
      } else {
        console.error('Failed to submit form data', data.detail)
      }
    } catch (error) {
      console.error('Error submitting form data', error)
    }
  }

  const handleC1image = async (e) => {
    e.preventDefault()

    const imageElement = document.getElementById('C1image')

    if (!imageElement || !imageElement.files) {
      console.error('Form elements or image files not found')
      return
    }

    const formData = new FormData()
    formData.append('image', imageElement.files[0])

    try {
      const res = await fetch('http://localhost:8000/ocrapi', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        setC1date(data.response_content[0])
        setC1num(data.response_content[1])
        console.log('Data submitted successfully')
      } else {
        console.error('Failed to submit data')
      }
    } catch (error) {
      console.error('Error submitting data', error)
    }
  }

  return (
    <CModal
      backdrop="static"
      visible={isAddModalVisible}
      onClose={() => setAddModalVisible(false)}
      aria-labelledby="ActivityModalLabel"
    >
      <CModalHeader>
        <CModalTitle id="ActivityModalLabel">
          <b>新增數據</b>
        </CModalTitle>
      </CModalHeader>
      <CForm>
        <CModalBody>
          <div className={styles.addmodal}>
            <form>
              <CRow className="mb-3">
                <CFormLabel
                  htmlFor="month"
                  className={`col-sm-2 col-form-label ${styles.addlabel}`}
                >
                  發票/收據日期*
                </CFormLabel>
                <CCol>
                  <CFormInput className={styles.addinput} type="date" id="date" required />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="num" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                  發票號碼/收據編號*
                </CFormLabel>
                <CCol>
                  <CFormInput className={styles.addinput} type="text" id="num" required />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="type" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                  油種*
                </CFormLabel>
                <CCol>
                  <CFormSelect
                    aria-label="Default select example"
                    id="type"
                    className={styles.addinput}
                  >
                    <option value="0">汽油</option>
                    <option value="1">柴油</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="unit" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                  單位*<span className={styles.Note}> 選擇單位請以*公升*做為優先填寫項目</span>
                </CFormLabel>
                <CCol>
                  <CFormSelect
                    aria-label="Default select example"
                    id="unit"
                    className={styles.addinput}
                  >
                    <option value="1">公升</option>
                    <option value="2">金額</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel
                  htmlFor="quantity"
                  className={`col-sm-2 col-form-label ${styles.addlabel}`}
                >
                  公升數/金額*
                </CFormLabel>
                <CCol>
                  <CFormInput
                    className={styles.addinput}
                    type="number"
                    min="0"
                    id="quantity"
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
              <CRow className="mb-3">
                <CFormLabel
                  htmlFor="photo"
                  className={`col-sm-2 col-form-label ${styles.addlabel}`}
                >
                  圖片*
                </CFormLabel>
                <CCol>
                  <CFormInput type="file" id="C1image" onChange={handleC1image} required />
                </CCol>
              </CRow>
              <br />
              <div style={{ textAlign: 'center' }}>*為必填欄位</div>
            </form>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton className="modalbutton1" onClick={handleClose}>
            取消
          </CButton>
          <CButton type="submit" className="modalbutton2" onClick={handleC1Submit}>
            新增
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  )
}

export default VehicleAdd
