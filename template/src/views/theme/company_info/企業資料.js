import React from 'react'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CTab,
  CTabContent,
  CTabList,
  CTabPanel,
  CTabs,
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CFormSelect,
} from '@coreui/react'
import '../../../scss/個人&企業資料.css'
import { useEffect, useState } from 'react'

const Tabs = () => {
  const [businessID, setBusinessID] = useState('')
  const [registration_number, setRegistrationNumber] = useState('')
  const [org_name, setOrgName] = useState('')
  const [factory_number, setFactoryNumber] = useState('')
  const [county, setCounty] = useState('')
  const [town, setTown] = useState('')
  const [postal_code, setPostalCode] = useState('')
  const [org_address, setOrgAddress] = useState('')
  const [charge_person, setChargePerson] = useState('')
  const [org_email, setOrgEmail] = useState('')
  const [industry_code, setIndustryCode] = useState('')
  const [industry_name, setIndustryName] = useState('')
  const [contact_person, setContactPerson] = useState('')
  const [telephone, setTelephone] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [reasonID, setReasonID] = useState('')
  const [reason, setReason] = useState('')
  const [GHG_Reg_Guide, setGHGRegGuide] = useState(false)
  const [ISO_CNS_14064_1, setISOCNS] = useState(false)
  const [GHG_Protocol, setGHGProtocol] = useState(false)
  const [specifications, setSpecifications] = useState('') // 盤查依據規範(GHG_Reg_Guide、ISO_CNS_14064_1、GHG_Protocol)
  const [verification, setVerification] = useState(false)
  const [inspection_agencyID, setInspectionAgencyID] = useState('')
  const [inspection_agency, setInspectionAgency] = useState('')
  const [significance, setSignificance] = useState('')
  const [materiality, setMateriality] = useState('')
  const [exclusion, setExclusion] = useState('')
  const [GWP_version, setGWPversion] = useState('')

  const getcompanyinfo = async () => {
    try {
      const response = await fetch('http://localhost:8000/companyinfo', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ business_id: '00993654' }),
      })
      const data = await response.json()
      console.log(data)
      if (response.ok) {
        console.log(data)
        setBusinessID(data.company.business_id)
        setRegistrationNumber(data.company.registration_number)
        setOrgName(data.company.org_name)
        setFactoryNumber(data.company.factory_number)
        setCounty(data.company.county)
        setTown(data.company.town)
        setPostalCode(data.company.postal_code)
        setOrgAddress(data.company.org_address)
        setChargePerson(data.company.charge_person)
        setOrgEmail(data.company.org_email)
        setIndustryCode(data.company.industry_code)
        setIndustryName(data.company.industry_name)
        setContactPerson(data.company.contact_person)
        setTelephone(data.company.telephone)
        setEmail(data.company.email)
        setPhone(data.company.phone)
        setReasonID(data.company.reason)
        setGHGRegGuide(data.company.GHG_Reg_Guide)
        setISOCNS(data.company.ISO_CNS_14064_1)
        setGHGProtocol(data.company.GHG_Protocol)
        setVerification(data.company.verification)
        setInspectionAgencyID(data.company.inspection_agency)
        setSignificance(data.company.significance)
        setMateriality(data.company.materiality)
        setExclusion(data.company.exclusion)
        setGWPversion(data.company.GWP_version)
      } else {
        console.log(response.status)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const setreason = () => {
    if (reasonID === 1) {
      setReason('自願性登錄')
    } else if (reasonID === 2) {
      setReason('環評承諾')
    } else if (reasonID === 3) {
      setReason('依法登錄')
    } else if (reasonID === 4) {
      setReason('其他')
    }
  }

  const setSpec = () => {
    let SpecList = []
    if (GHG_Reg_Guide === true) {
      SpecList.push('溫室氣體排放量盤查登錄管理辦法/溫室氣體盤查登錄作業指引')
    }
    if (ISO_CNS_14064_1 === true) {
      SpecList.push('ISO/CNS 14064-1')
    }
    if (GHG_Protocol === true) {
      SpecList.push('溫室氣體盤查議定書-企業會計與報告標準')
    }
    if (SpecList.length === false) {
      return '無'
    }
    return SpecList.join('、')
  }

  const setIA = () => {
    if (inspection_agencyID === 1) {
      setInspectionAgency('艾法諾國際股份有限公司(AFNOR)')
    } else if (inspection_agencyID === 2) {
      setInspectionAgency('香港商英國標準協會太平洋有限公司台灣分公司(Bsi)')
    } else if (inspection_agencyID === 3) {
      setInspectionAgency('台灣衛理國際品保驗證股份有限公司(BV)')
    } else if (inspection_agencyID === 4) {
      setInspectionAgency('立恩威國際驗證股份有限公司(DNV GL)')
    } else if (inspection_agencyID === 5) {
      setInspectionAgency('英商勞氏檢驗股份有限公司台灣分公司(LRQA)')
    } else if (inspection_agencyID === 6) {
      setInspectionAgency('台灣檢驗科技股份有限公司(SGS)')
    } else if (inspection_agencyID === 7) {
      setInspectionAgency('台灣德國萊因技術監護顧問股份有限公司(TÜV-Rh)')
    } else if (inspection_agencyID === 8) {
      setInspectionAgency('其他')
    }
  }

  const setverification = () => {
    setVerification(verification === false ? '否' : '是')
  }

  const handlesubmit = async (e) => {
    e.preventDefault()
    try {
      const user_id = window.sessionStorage.getItem('user_id')
      const org_name =
        document.getElementById('edit_org_name').value ||
        document.getElementById('edit_org_name').placeholder
      const county =
        document.getElementById('edit_county').value ||
        document.getElementById('edit_county').placeholder
      const town =
        document.getElementById('edit_town').value ||
        document.getElementById('edit_town').placeholder
      const postal_code =
        document.getElementById('edit_postal_code').value ||
        document.getElementById('edit_postal_code').placeholder
      const org_address =
        document.getElementById('edit_org_address').value ||
        document.getElementById('edit_org_address').placeholder
      const charge_person =
        document.getElementById('edit_charge_person').value ||
        document.getElementById('edit_charge_person').placeholder
      const org_email =
        document.getElementById('edit_org_email').value ||
        document.getElementById('edit_org_email').placeholder
      const contact_person =
        document.getElementById('edit_contact_person').value ||
        document.getElementById('edit_contact_person').placeholder
      const telephone =
        document.getElementById('edit_telephone').value ||
        document.getElementById('edit_telephone').placeholder
      const email =
        document.getElementById('edit_email').value ||
        document.getElementById('edit_email').placeholder
      const phone =
        document.getElementById('edit_phone').value ||
        document.getElementById('edit_phone').placeholder

      const response = await fetch('http://localhost:8000/editcompanyinfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          org_name: org_name,
          county: county,
          town: town,
          postal_code: postal_code,
          org_address: org_address,
          charge_person: charge_person,
          org_email: org_email,
          contact_person: contact_person,
          telephone: telephone,
          email: email,
          phone: phone,
        }),
      })

      const data = await response.json()
      console.log(data)

      if (response.ok) {
        alert('修改成功')
        window.location.reload() // Refresh the page
      } else {
        console.log(response.status)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    getcompanyinfo()
  }, [])

  useEffect(() => {
    setreason()
  }, [reasonID])

  useEffect(() => {
    setSpecifications(setSpec())
  }, [GHG_Reg_Guide, ISO_CNS_14064_1, GHG_Protocol])

  useEffect(() => {
    setIA()
  }, [inspection_agencyID])

  useEffect(() => {
    setverification()
  }, [verification])

  return (
    <CRow>
      <CCol xs={12}>
        <CTabs activeItemKey={1}>
          <CTabList variant="underline-border" className="custom-tablist">
            <CTab aria-controls="home-tab-pane" itemKey={1}>
              企業資料
            </CTab>
            <CTab aria-controls="profile-tab-pane" itemKey={2}>
              修改企業資料
            </CTab>
            <CTab aria-controls="profile-tab-pane" itemKey={3}>
              修改盤查資訊
            </CTab>
          </CTabList>
          <CTabContent>
            <CTabPanel className="py-3" aria-labelledby="home-tab-pane" itemKey={1}>
              <CCard className="mb-4 customCard">
                <CCardBody className="customCard2">
                  <div className="customCardHeader">
                    <strong className="customtitlebottom">企業資料</strong>
                  </div>
                  <div className="customCardBody">
                    <CForm>
                      <CRow className="mb-3">
                        <CCol sm={12}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>機構名稱</strong>
                            </CFormLabel>
                            <CFormInput
                              type="text"
                              id="org_name"
                              value={org_name}
                              disabled
                              readOnly
                            />
                          </div>
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CCol sm={4}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>統一編號</strong>
                            </CFormLabel>
                            <CFormInput
                              type="text"
                              id="business_id"
                              value={businessID}
                              disabled
                              readOnly
                            />
                          </div>
                        </CCol>
                        <CCol sm={4}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>管制編號</strong>
                            </CFormLabel>
                            <CFormInput
                              type="text"
                              id="registration_number"
                              value={registration_number}
                              disabled
                              readOnly
                            />
                          </div>
                        </CCol>
                        <CCol sm={4}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>工廠登記證編號</strong>
                            </CFormLabel>
                            <CFormInput
                              type="text"
                              id="factory_number"
                              value={factory_number}
                              disabled
                              readOnly
                            />
                          </div>
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CCol sm={4}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>縣市別</strong>
                            </CFormLabel>
                            <CFormInput type="text" id="county" value={county} disabled readOnly />
                          </div>
                        </CCol>
                        <CCol sm={4}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>鄉鎮別</strong>
                            </CFormLabel>
                            <CFormInput type="text" id="town" value={town} disabled readOnly />
                          </div>
                        </CCol>
                        <CCol sm={4}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>郵遞區號</strong>
                            </CFormLabel>
                            <CFormInput
                              type="post_code"
                              id="postal_code"
                              value={postal_code}
                              disabled
                              readOnly
                            />
                          </div>
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CCol sm={12}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>地址</strong>
                            </CFormLabel>
                            <CFormInput
                              type="org_address"
                              id="org_address"
                              value={org_address}
                              disabled
                              readOnly
                            />
                          </div>
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CCol sm={6}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>負責人姓名</strong>
                            </CFormLabel>
                            <CFormInput
                              type="text"
                              id="responsible_person"
                              value={charge_person}
                              disabled
                              readOnly
                            />
                          </div>
                        </CCol>
                        <CCol sm={6}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>公私場所電子信箱</strong>
                            </CFormLabel>
                            <CFormInput
                              type="email"
                              id="org_email"
                              value={org_email}
                              disabled
                              readOnly
                            />
                          </div>
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CCol sm={6}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>聯絡人姓名</strong>
                            </CFormLabel>
                            <CFormInput
                              type="text"
                              id="contact_person"
                              value={contact_person}
                              disabled
                              readOnly
                            />
                          </div>
                        </CCol>
                        <CCol sm={6}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>Email</strong>
                            </CFormLabel>
                            <CFormInput type="email" id="email" value={email} disabled readOnly />
                          </div>
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CCol sm={6}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>電話</strong>
                            </CFormLabel>
                            <CFormInput
                              type="text"
                              id="telephone"
                              value={telephone}
                              disabled
                              readOnly
                            />
                          </div>
                        </CCol>
                        <CCol sm={6}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>手機</strong>
                            </CFormLabel>
                            <CFormInput type="text" id="phone" value={phone} disabled readOnly />
                          </div>
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CCol sm={6}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>行業代碼</strong>
                            </CFormLabel>
                            <CFormInput
                              type="text"
                              id="industry_code"
                              value={industry_code}
                              disabled
                              readOnly
                            />
                          </div>
                        </CCol>
                        <CCol sm={6}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>行業名稱</strong>
                            </CFormLabel>
                            <CFormInput
                              type="text"
                              id="industry_name"
                              value={industry_name}
                              disabled
                              readOnly
                            />
                          </div>
                        </CCol>
                      </CRow>
                    </CForm>
                  </div>
                </CCardBody>
              </CCard>
              {/* 盤查資訊 */}
              <CCard className="mb-4 customCard">
                <CCardBody className="customCard2">
                  <div className="customCardHeader">
                    <strong className="customtitlebottom">盤查資訊</strong>
                  </div>
                  <div className="customCardBody">
                    <CForm>
                      <CRow className="mb-3">
                        <CCol sm={4}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>登錄原因</strong>
                            </CFormLabel>
                            <CFormInput type="text" id="reason" value={reason} disabled readOnly />
                          </div>
                        </CCol>
                        <CCol sm={8}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>選用GWP版本</strong>
                            </CFormLabel>
                            <CFormInput
                              type="text"
                              id="GWP_version"
                              value={GWP_version}
                              disabled
                              readOnly
                            />
                          </div>
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CCol sm={12}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>盤查依據規範</strong>
                            </CFormLabel>
                            <CFormInput
                              type="text"
                              id="specifications"
                              value={specifications}
                              disabled
                              readOnly
                            />
                          </div>
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CCol sm={4}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>是否經第三方查證</strong>
                            </CFormLabel>
                            <CFormInput
                              type="verification"
                              id="verification"
                              value={verification}
                              disabled
                              readOnly
                            />
                          </div>
                        </CCol>
                        <CCol sm={8}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>查驗機構名稱</strong>
                            </CFormLabel>
                            <CFormInput
                              type="text"
                              id="inspection_agency"
                              value={inspection_agency}
                              disabled
                              readOnly
                            />
                          </div>
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CCol sm={4}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>顯著性門檻</strong>
                            </CFormLabel>
                            <CFormInput
                              type="text"
                              id="significance"
                              value={significance}
                              disabled
                              readOnly
                            />
                          </div>
                        </CCol>
                        <CCol sm={4}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>實質性門檻</strong>
                            </CFormLabel>
                            <CFormInput
                              type="text"
                              id="materiality"
                              value={materiality}
                              disabled
                              readOnly
                            />
                          </div>
                        </CCol>
                        <CCol sm={4}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>排除門檻</strong>
                            </CFormLabel>
                            <CFormInput
                              type="text"
                              id="exclusion"
                              value={exclusion}
                              disabled
                              readOnly
                            />
                          </div>
                        </CCol>
                      </CRow>
                    </CForm>
                  </div>
                </CCardBody>
              </CCard>
            </CTabPanel>
            {/* 修改企業資料 */}
            <CTabPanel className="py-3" aria-labelledby="profile-tab-pane" itemKey={2}>
              <CCard className="mb-4 customCard">
                <CCardBody className="customCard2">
                  <div className="customCardHeader">
                    <strong className="customtitlebottom">修改企業資料</strong>
                  </div>
                  <div className="customCardBody">
                    <CForm>
                      <CRow className="mb-3">
                        <CCol sm={12}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>機構名稱</strong>
                            </CFormLabel>
                            <CFormInput
                              type="text"
                              id="edit_org_name"
                              value={org_name}
                              onChange={(e) => setOrgName(e.target.value)}
                            />
                          </div>
                        </CCol>
                      </CRow>
                      {/* <CRow className="mb-3">
                        <CCol sm={6}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>管制編號</strong>
                            </CFormLabel>
                            <CFormInput type="registrationNo" id="registrationNo" />
                          </div>
                        </CCol>
                        <CCol sm={6}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>工廠登記證編號</strong>
                            </CFormLabel>
                            <CFormInput type="factory_registrationNo" id="factory_registrationNo" />
                          </div>
                        </CCol>
                      </CRow> */}
                      <CRow className="mb-3">
                        <CCol sm={4}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>縣市別</strong>
                            </CFormLabel>
                            <CFormInput
                              type="county"
                              id="edit_county"
                              value={county}
                              onChange={(e) => setCounty(e.target.value)}
                            />
                          </div>
                        </CCol>
                        <CCol sm={4}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>鄉鎮別</strong>
                            </CFormLabel>
                            <CFormInput
                              type="township"
                              id="edit_town"
                              value={town}
                              onChange={(e) => setTown(e.target.value)}
                            />
                          </div>
                        </CCol>
                        <CCol sm={4}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>郵遞區號</strong>
                            </CFormLabel>
                            <CFormInput
                              type="text"
                              id="edit_postal_code"
                              value={postal_code}
                              onChange={(e) => setPostalCode(e.target.value)}
                            />
                          </div>
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CCol sm={12}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>地址</strong>
                            </CFormLabel>
                            <CFormInput
                              type="text"
                              id="edit_org_address"
                              value={org_address}
                              onChange={(e) => setOrgAddress(e.target.value)}
                            />
                          </div>
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CCol sm={6}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>負責人姓名</strong>
                            </CFormLabel>
                            <CFormInput
                              type="text"
                              id="edit_charge_person"
                              value={charge_person}
                              onChange={(e) => setChargePerson(e.target.value)}
                            />
                          </div>
                        </CCol>
                        <CCol sm={6}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>公私場所電子信箱</strong>
                            </CFormLabel>
                            <CFormInput
                              type="text"
                              id="edit_org_email"
                              value={org_email}
                              onChange={(e) => setOrgEmail(e.target.value)}
                            />
                          </div>
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CCol sm={6}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>聯絡人姓名</strong>
                            </CFormLabel>
                            <CFormInput
                              type="text"
                              id="edit_contact_person"
                              value={contact_person}
                              onChange={(e) => setContactPerson(e.target.value)}
                            />
                          </div>
                        </CCol>
                        <CCol sm={6}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>Email</strong>
                            </CFormLabel>
                            <CFormInput
                              type="email"
                              id="edit_email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CCol sm={6}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>電話</strong>
                            </CFormLabel>
                            <CFormInput
                              type="text"
                              id="edit_telephone"
                              value={telephone}
                              onChange={(e) => setTelephone(e.target.value)}
                            />
                          </div>
                        </CCol>
                        <CCol sm={6}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>手機</strong>
                            </CFormLabel>
                            <CFormInput
                              type="text"
                              id="edit_phone"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                            />
                          </div>
                        </CCol>
                      </CRow>
                      {/* <CRow className="mb-3">
                        <CCol sm={6}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>行業名稱</strong>
                            </CFormLabel>
                            <CFormInput type="industry_name" id="industry_name" />
                          </div>
                        </CCol>
                        <CCol sm={6}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>行業代碼</strong>
                            </CFormLabel>
                            <CFormInput type="industry_code" id="industry_code" />
                          </div>
                        </CCol>
                      </CRow> */}
                      <div className="col-auto text-center">
                        <CButton type="submit" className="mb-3 customButton" onClick={handlesubmit}>
                          保存資料
                        </CButton>
                      </div>
                    </CForm>
                  </div>
                </CCardBody>
              </CCard>
            </CTabPanel>
            <CTabPanel className="py-3" aria-labelledby="contact-tab-pane" itemKey={3}>
              <CCard className="mb-4 customCard">
                <CCardBody className="customCard2">
                  <div className="customCardHeader">
                    <strong className="customtitlebottom">盤查資訊</strong>
                  </div>
                  <div className="customCardBody">
                    <CForm>
                      <CRow className="mb-3">
                        <CCol sm={3}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>登錄原因</strong>
                            </CFormLabel>
                            <CFormSelect>
                              <option value="0">自願性登錄</option>
                              <option value="1">環評承諾</option>
                              <option value="2">依法登錄</option>
                              <option value="3">其他</option>
                            </CFormSelect>
                          </div>
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CCol sm={12}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>盤查依據規範</strong>
                            </CFormLabel>
                            <CFormSelect>
                              <option value="0">
                                溫室氣體排放量盤查登錄管理辦法/溫室氣體盤查登錄作業指引
                              </option>
                              <option value="1">ISO / CNS 14064-1</option>
                              <option value="2">溫室氣體盤查議定書-企業會計與報告標準</option>
                            </CFormSelect>
                          </div>
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CCol sm={4}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>是否經第三方查證</strong>
                            </CFormLabel>
                            <CFormSelect>
                              <option value="0">是</option>
                              <option value="1">否</option>
                            </CFormSelect>
                          </div>
                        </CCol>
                        <CCol sm={8}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>查驗機構名稱</strong>
                            </CFormLabel>
                            <CFormSelect>
                              <option value="0">艾法諾國際股份有限公司(AFNOR)</option>
                              <option value="1">
                                香港商英國標準協會太平洋有限公司台灣分公司(Bsi)
                              </option>
                              <option value="2">台灣衛理國際品保驗證股份有限公司(BV)</option>
                              <option value="3">立恩威國際驗證股份有限公司(DNV GL)</option>
                              <option value="4">英商勞氏檢驗股份有限公司台灣分公司(LRQA)</option>
                              <option value="5">台灣檢驗科技股份有限公司(SGS)</option>
                              <option value="6">
                                台灣德國萊因技術監護顧問股份有限公司(TÜV-Rh)
                              </option>
                              <option value="7">其他</option>
                            </CFormSelect>
                          </div>
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CCol sm={4}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>顯著性門檻</strong>
                            </CFormLabel>
                            <CFormInput type="significance" id="significance" />
                          </div>
                        </CCol>
                        <CCol sm={4}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>實質性門檻</strong>
                            </CFormLabel>
                            <CFormInput type="materiality" id="materiality" />
                          </div>
                        </CCol>
                        <CCol sm={4}>
                          <div className="mb-3">
                            <CFormLabel>
                              <strong>排除門檻</strong>
                            </CFormLabel>
                            <CFormInput type="exclusion" id="exclusion" />
                          </div>
                        </CCol>
                      </CRow>
                    </CForm>
                  </div>
                </CCardBody>
              </CCard>
            </CTabPanel>
          </CTabContent>
        </CTabs>
      </CCol>
    </CRow>
  )
}

export default Tabs
