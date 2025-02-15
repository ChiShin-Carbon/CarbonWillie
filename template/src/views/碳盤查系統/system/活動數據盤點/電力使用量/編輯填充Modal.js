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

const EditFillModal = ({ isEditFillModalVisible, setEditFillModalVisible, selectedFill }) => {
  const editFillClose = () => setEditFillModalVisible(false)
  const [previewImage, setPreviewImage] = useState(null) // 用來存儲圖片的
  const [FormValues, setFormValues] = useState({
    Doc_date: '',
    Doc_number: '',
    period_start: '',
    period_end: '',
    electricity_type: '',
    usage: '',
    amount: '',
    carbon_emission: '',
    remark: '',
    img_path: '',
  })
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file) // 創建圖片預覽 URL
      setPreviewImage(previewUrl) // 保存 URL 到狀態
    }
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormValues((prevValues) => ({ ...prevValues, [id]: value }))
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()

    const form = new FormData()
    form.append('usage_id', selectedFill)
    form.append('user_id', window.sessionStorage.getItem('user_id'))
    form.append('Doc_date', FormValues.Doc_date)
    form.append('Doc_number', FormValues.Doc_number)
    form.append('period_start', FormValues.period_start)
    form.append('period_end', FormValues.period_end)
    form.append('electricity_type', FormValues.electricity_type)
    form.append('usage', FormValues.usage)
    form.append('amount', FormValues.amount)
    form.append('carbon_emission', FormValues.carbon_emission)
    form.append('remark', FormValues.remark)
    form.append('image', e.target.image.files[0]) // Assuming the image is selected

    for (let [key, value] of form.entries()) {
      console.log(`${key}:`, value) // Debugging output
    }

    try {
      const response = await fetch('http://localhost:8000/edit_ElectricityUsage', {
        method: 'POST',
        body: form, // Send FormData directly
      })

      const data = await response.json()
      if (response.ok && data.status === 'success') {
        alert('Electricity record updated successfully!')
        handleClose()
      } else {
        alert(data.message || 'Failed to update electricity record.')
      }
    } catch (error) {}
  }

  useEffect(() => {
    const fetchElectricityFillData = async () => {
      console.log('Fetching Electricity data for ID:', selectedFill)
      if (!selectedFill) return

      try {
        const response = await fetch('http://localhost:8000/ElectricityFill_findone', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ElectricityFill_id: selectedFill }),
        })

        if (response.ok) {
          const data = await response.json()
          const ElectricityFillData = data.ElectricityFill[0]
          setFormValues({
            Doc_date: ElectricityFillData?.Doc_date || '',
            Doc_number: ElectricityFillData?.Doc_number || '',
            period_start: ElectricityFillData?.period_start || '',
            period_end: ElectricityFillData?.period_end || '',
            usage: ElectricityFillData?.usage || '',
            amount: ElectricityFillData?.amount || '',
            carbon_emission: ElectricityFillData?.carbon_emission || '',
            remark: ElectricityFillData?.remark || '',
            img_path: ElectricityFillData?.img_path || '',
          })
          setPreviewImage(ElectricityFillData?.img_path || null)
          console.log('Fetched Electricity data:', ElectricityFillData)
        } else {
          console.error('Error fetching Electricity data:', await response.text())
        }
      } catch (error) {
        console.error('Error fetching Electricity data:', error)
      }
    }

    fetchElectricityFillData()
  }, [selectedFill])

  return (
    <CModal
      backdrop="static"
      visible={isEditFillModalVisible}
      onClose={editFillClose}
      aria-labelledby="ActivityModalLabel"
      size="xl"
      className={styles.modal}
    >
      <CModalHeader>
        <h5>
          <b>編輯電力使用量</b>
        </h5>
      </CModalHeader>
      <CForm onSubmit={handleEditSubmit}>
        <CModalBody>
          <div className={styles.addmodal}>
            <div className={styles.modalLeft}>
              <CRow className="mb-3">
                <CFormLabel
                  htmlFor="month"
                  className={`col-sm-2 col-form-label ${styles.addlabel}`}
                >
                  發票/收據日期*
                </CFormLabel>
                <CCol>
                  <CFormInput
                    className={styles.addinput}
                    type="date"
                    id="Doc_date"
                    value={FormValues.Doc_date}
                    onChange={handleInputChange}
                    required
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="num" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                  發票號碼/收據編號*
                </CFormLabel>
                <CCol>
                  <CFormInput
                    className={styles.addinput}
                    type="text"
                    id="Doc_number"
                    value={FormValues.Doc_number}
                    onChange={handleInputChange}
                    required
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel
                  htmlFor="datestart"
                  className={`col-sm-2 col-form-label ${styles.addlabel}`}
                >
                  用電期間(起)*
                </CFormLabel>
                <CCol>
                  <CFormInput
                    className={styles.addinput}
                    type="date"
                    id="datestart"
                    value={FormValues.period_start}
                    onChange={handleInputChange}
                    required
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel
                  htmlFor="dateend"
                  className={`col-sm-2 col-form-label ${styles.addlabel}`}
                >
                  用電期間(迄)*
                </CFormLabel>
                <CCol>
                  <CFormInput
                    className={styles.addinput}
                    type="date"
                    id="dateend"
                    value={FormValues.period_end}
                    onChange={handleInputChange}
                    required
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="type" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                  填寫類型*
                  <span className={styles.Note}> 選擇填寫請以*用電度數*作為優先填寫項目</span>
                </CFormLabel>
                <CCol>
                  <CFormSelect
                    aria-label="Default select example"
                    id="type"
                    className={styles.addinput}
                    value={FormValues.electricity_type}
                    onChange={handleInputChange}
                  >
                    <option value="1">用電度數</option>
                    <option value="2">用電金額</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              {FormValues.electricity_type === '1' && (
                <CRow className="mb-3">
                  <CFormLabel
                    htmlFor="C8usage"
                    className={`col-sm-2 col-form-label ${styles.addlabel}`}
                  >
                    當月總用電量
                  </CFormLabel>
                  <CCol>
                    <CFormInput
                      className={styles.addinput}
                      type="number"
                      min="0"
                      id="C8usage"
                      value={FormValues.usage}
                      onChange={handleInputChange}
                    />
                  </CCol>
                </CRow>
              )}
              {FormValues.electricity_type === '2' && (
                <CRow className="mb-3">
                  <CFormLabel
                    htmlFor="C8amount"
                    className={`col-sm-2 col-form-label ${styles.addlabel}`}
                  >
                    當月總金額
                  </CFormLabel>
                  <CCol>
                    <CFormInput
                      className={styles.addinput}
                      type="number"
                      min="0"
                      id="C8amount"
                      value={FormValues.amount}
                      onChange={handleInputChange}
                    />
                  </CCol>
                </CRow>
              )}
              <CRow className="mb-3">
                <CFormLabel
                  htmlFor="C8emission"
                  className={`col-sm-2 col-form-label ${styles.addlabel}`}
                >
                  當月總金額
                </CFormLabel>
                <CCol>
                  <CFormInput
                    className={styles.addinput}
                    type="number"
                    min="0"
                    id="C8emission"
                    value={FormValues.carbon_emission}
                    onChange={handleInputChange}
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
              <CRow className="mb-3">
                <CFormLabel
                  htmlFor="image"
                  className={`col-sm-2 col-form-label ${styles.addlabel}`}
                >
                  圖片*
                </CFormLabel>
                <CCol>
                  <CFormInput type="file" id="image" onChange={handleImageChange} required />
                </CCol>
              </CRow>
              <br />
              <div style={{ textAlign: 'center' }}>*為必填欄位</div>
            </div>
            <div className={styles.modalRight}>
              <CFormLabel className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                圖片預覽
              </CFormLabel>
              <div className={styles.imgBlock}>
                {previewImage && (
                  <Zoom>
                    <img src={previewImage} alt="Uploaded Preview" />
                  </Zoom>
                )}
              </div>

              <CFormLabel className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                偵測錯誤提醒
              </CFormLabel>
              <div className={styles.errorMSG}>
                {/* 偵測日期:{C1date}  <span>{dateincorrectmessage}</span><br />
                                偵測號碼:{C1num}  <span>{numincorrectmessage}</span> */}
              </div>
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton className="modalbutton1" onClick={editFillClose}>
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

export default EditFillModal
