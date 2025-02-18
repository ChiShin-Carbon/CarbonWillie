import React, { useState } from 'react'
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

const AddFillModal = ({ isAddFillModalVisible, setAddFillModalVisible, selectedElectricityId }) => {
  const addFillClose = () => setAddFillModalVisible(false)
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

  const [previewImage, setPreviewImage] = useState(null) // 用來存儲圖片的
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setPreviewImage(previewUrl)

      // Trigger OCR API call
      handleC8image(e)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault() // Prevent default form submission behavior.

    const formData = new FormData()
    formData.append('user_id', window.sessionStorage.getItem('user_id'))
    formData.append('electricity_id', selectedElectricityId)
    formData.append('Doc_date', document.getElementById('date').value)
    formData.append('Doc_number', document.getElementById('num').value)
    formData.append('period_start', document.getElementById('start').value)
    formData.append('period_end', document.getElementById('end').value)
    formData.append('electricity_type', document.getElementById('electricityType').value)
    formData.append('usage', document.getElementById('usage').value)
    formData.append('amount', document.getElementById('amount').value)
    formData.append('carbon_emission', document.getElementById('carbon_emission').value)
    formData.append('remark', document.getElementById('remark').value)
    formData.append('image', document.getElementById('C8image').files[0])

    try {
      const res = await fetch('http://localhost:8000/insert_electricity_usage', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        console.log('Form submitted successfully', data)
        setAddFillModalVisible(false) // Close the modal after successful submission.
      } else {
        const errorData = await res.json()
        console.error('Failed to submit form data', errorData.detail)
      }
    } catch (error) {
      console.error('Error submitting form data', error)
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

  return (
    <CModal
      backdrop="static"
      visible={isAddFillModalVisible}
      onClose={addFillClose}
      aria-labelledby="ActivityModalLabel"
      size="xl"
    >
      <CModalHeader>
        <h5>
          <b>新增填充紀錄</b>
        </h5>
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
                <CFormLabel
                  htmlFor="datestart"
                  className={`col-sm-2 col-form-label ${styles.addlabel}`}
                >
                  用電期間(起)*
                </CFormLabel>
                <CCol>
                  <CFormInput className={styles.addinput} type="date" id="start" required />
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
                  <CFormInput className={styles.addinput} type="date" id="end" required />
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
                    id="electricityType"
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
                      id="usage"
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
                      id="amount"
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
                    id="carbon_emission"
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
                  <CFormTextarea className={styles.addinput} type="text" id="remark" rows={3} />
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
          <CButton className="modalbutton1" onClick={addFillClose}>
            取消
          </CButton>
          <CButton className="modalbutton2" type="submit" onClick={handleSubmit}>
            儲存
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  )
}

export default AddFillModal
