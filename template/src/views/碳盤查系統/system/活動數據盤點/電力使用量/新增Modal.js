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

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

export const ElectricityUsageAdd = ({ isAddModalVisible, setAddModalVisible }) => {
  const handleClose = () => setAddModalVisible(false)
  const [C8date, setC8date] = useState('')
  const [C8num, setC8num] = useState('')
  const [electricityType, setElectricityType] = useState('1')
  const [usage, setUsage] = useState(0) // 當月總用電量
  const [amount, setAmount] = useState(0) // 當月總金額
  const [carbon_emission, setCarbonEmission] = useState(0) // 當月總金額
  const [isdatecorrect, setIsdatecorrect] = useState(true)
  const [dateincorrectmessage, setDateincorrectmessage] = useState('')
  const [isnumcorrect, setIsnumcorrect] = useState(true)
  const [numincorrectmessage, setNumincorrectmessage] = useState('')

  const [recognizedText, setRecognizedText] = useState('')

  const handleC8Submit = async (e) => {
    if (isdatecorrect == true || isnumcorrect == true) {
      e.preventDefault()

      const formData = new FormData()
      // formData.append("user_id", 1);
      formData.append('user_id', window.sessionStorage.getItem('user_id'))
      formData.append('date', document.getElementById('date').value)
      formData.append('number', document.getElementById('num').value)
      formData.append('start', document.getElementById('C8datestart').value)
      formData.append('end', document.getElementById('C8dateend').value)
      formData.append('electricity_type', document.getElementById('C8type').value)
      // formData.append('usage', document.getElementById('C8usage').value)
      // formData.append('amount', document.getElementById('C8amount').value)
      if (electricityType === '1') {
        formData.append('usage', usage)
        formData.append('amount', 0)
      } else if (electricityType === '2') {
        formData.append('amount', amount)
        formData.append('usage', 0)
      }
      formData.append('carbon_emission', carbon_emission)
      formData.append('remark', document.getElementById('C8explain').value)

      // Check if image file is provided
      const imageFile = document.getElementById('C8image').files[0]
      if (imageFile) {
        formData.append('image', imageFile)
      }

      try {
        const res = await fetch('http://localhost:8000/insert_electricity', {
          method: 'POST',
          body: formData,
        })
        const data = await res.json()

        if (res.ok) {
          console.log('Form submitted successfully', data)
          setAddModalVisible(false) // Close modal on success
        } else {
          console.error('Failed to submit form data', data.detail)
        }
      } catch (error) {
        console.error('Error submitting form data', error)
      }
    }
  }

  const handleC8image = async (e) => {
    e.preventDefault()

    const imageElement = document.getElementById('C8image')

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
        setC8date(data.response_content[0])
        setC8num(data.response_content[1])
        console.log('Data submitted successfully')

        if (data.response_content[0] != document.getElementById('date').value) {
          setIsdatecorrect(false)
          setDateincorrectmessage('日期不正確')
        }

        if (data.response_content[1] != document.getElementById('num').value) {
          setIsnumcorrect(false)
          setNumincorrectmessage('發票號碼不正確')
        }
      } else {
        console.error('Failed to submit data')
      }
    } catch (error) {
      console.error('Error submitting data', error)
    }
  }

  const datecorrect = () => {
    if (C8date == document.getElementById('date').value) {
      setDateincorrectmessage('')
      setIsnumcorrect(true)
    }
  }

  const numcorrect = () => {
    if (C8num == document.getElementById('num').value) {
      setNumincorrectmessage('')
      setIsnumcorrect(true)
    }
  }

  const [previewImage, setPreviewImage] = useState(null) // 用來存儲圖片的
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file) // 創建圖片預覽 URL
      setPreviewImage(previewUrl) // 保存 URL 到狀態
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
                  htmlFor="month"
                  className={`col-sm-2 col-form-label ${styles.addlabel}`}
                >
                  發票/收據日期*
                </CFormLabel>
                <CCol>
                  <CFormInput
                    className={styles.addinput}
                    type="date"
                    id="date"
                    required
                    onChange={datecorrect}
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
                    id="num"
                    required
                    onChange={numcorrect}
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
                  <CFormInput className={styles.addinput} type="date" id="C8datestart" required />
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
                  <CFormInput className={styles.addinput} type="date" id="C8dateend" required />
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
                    id="C8type"
                    className={styles.addinput}
                    value={electricityType}
                    onChange={(e) => setElectricityType(e.target.value)}
                  >
                    <option value="1">用電度數</option>
                    <option value="2">用電金額</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              {electricityType === '1' && (
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
                      id="C8usage"
                      value={usage}
                      onChange={(e) => setUsage(e.target.value)}
                      min="0"
                    />
                  </CCol>
                </CRow>
              )}
              {electricityType === '2' && (
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
                      id="C8amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="0"
                    />
                  </CCol>
                </CRow>
              )}
              <CRow className="mb-3">
                <CFormLabel
                  htmlFor="C8emission"
                  className={`col-sm-2 col-form-label ${styles.addlabel}`}
                >
                  當月碳排量
                </CFormLabel>
                <CCol>
                  <CFormInput
                    className={styles.addinput}
                    type="number"
                    id="C8emission"
                    value={carbon_emission}
                    onChange={(e) => setCarbonEmission(e.target.value)}
                    min="0"
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
                  <CFormTextarea className={styles.addinput} type="text" id="C8explain" rows={3} />
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
                  <CFormInput
                    type="file"
                    id="C8image"
                    onChange={(e) => (handleImageChange(e), handleC8image(e))}
                    required
                  />
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
                {previewImage && ( // 如果有圖片 URL，則顯示預覽
                  <Zoom>
                    <img src={previewImage} alt="Uploaded Preview" />
                  </Zoom>
                )}
              </div>

              <CFormLabel className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                偵測錯誤提醒
              </CFormLabel>
              <div className={styles.errorMSG}>
                偵測日期:{C8date} <span>{dateincorrectmessage}</span>
                <br />
                偵測號碼:{C8num} <span>{numincorrectmessage}</span>
              </div>
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

export default ElectricityUsageAdd
