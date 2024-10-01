import React, { useState } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
} from '@coreui/react';
import { MultiSelect } from 'primereact/multiselect'; // Import PrimeReact MultiSelect
import 'primereact/resources/themes/saga-blue/theme.css'; // PrimeReact CSS (如果還沒引入)
import 'primereact/resources/primereact.min.css'; 
import 'primeicons/primeicons.css'; 

const FormControl = () => {
  const [selectedCities, setSelectedCities] = useState(null);
  const cities = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
  ];

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>修改個人資料</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CRow className="mb-3">
                <CCol sm={4}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="account">帳號</CFormLabel>
                    <CFormInput type="email" id="account" />
                  </div>
                </CCol>
                <CCol sm={2}></CCol>
                <CCol sm={4}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="name">姓名</CFormLabel>
                    <CFormInput type="text" id="name" />
                  </div>
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol sm={4}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="email">電子郵件</CFormLabel>
                    <CFormInput type="email" id="email" placeholder="name@example.com" />
                  </div>
                </CCol>
                <CCol sm={2}></CCol>
                <CCol sm={4}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="phone">辦公室電話</CFormLabel>
                    <CFormInput type="tel" id="phone" />
                  </div>
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol sm={4}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="department">所屬部門</CFormLabel>
                    <CFormInput type="text" id="department" />
                  </div>
                </CCol>
                <CCol sm={2}></CCol>
                <CCol sm={4}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="occupation">職業</CFormLabel>
                    <CFormInput type="text" id="occupation" />
                  </div>
                </CCol>
              </CRow>

              {/* 新增的 MultiSelect */}
              <CRow className="mb-3">
                <CCol sm={4}>
                  <CFormLabel htmlFor="cities">選擇城市</CFormLabel>
                  <MultiSelect
                    value={selectedCities}
                    onChange={(e) => setSelectedCities(e.value)}
                    options={cities}
                    optionLabel="name"
                    display="chip"
                    placeholder="Select Cities"
                    maxSelectedLabels={3}
                    className="w-full"
                  />
                </CCol>
              </CRow>

              <div className="col-auto text-center">
                <CButton color="primary" type="submit" className="mb-3">
                  保存資料
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default FormControl;
