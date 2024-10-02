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
  CAccordion,
  CAccordionItem,  // 正確導入這些組件
  CAccordionHeader, 
  CAccordionBody,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CListGroup,
  CListGroupItem, CCardImage, CCardTitle, CCardText,
} from '@coreui/react';
import { MultiSelect } from 'primereact/multiselect'; // Import PrimeReact MultiSelect
import 'primereact/resources/themes/saga-blue/theme.css'; // PrimeReact CSS (如果還沒引入)
import 'primereact/resources/primereact.min.css'; 
import 'primeicons/primeicons.css'; 
import '../../../scss/常見問題.css';
import 碳盤查範疇 from 'src/assets/images/常見問題-碳盤查範疇.png'
//import { cilArrowThickFromBottom } from '@coreui/icons';


const FormControl = () => {
  const [selectedCities, setSelectedCities] = useState(null);
  

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
        
          <CCardHeader>
            <strong>背景知識</strong>
          </CCardHeader>
          <CCardBody>
            <CAccordion alwaysOpen>
                <CAccordionItem itemKey={1}>
                    <CAccordionHeader>碳盤查(Carbon Footprint Verification) vs 碳足跡（Carbon Footprint）</CAccordionHeader>
                    <CAccordionBody>
                    碳盤查是一種蒐集和計算溫室氣體排放數據的方法。依據《溫室氣體排放量盤查作業指引》、溫室氣體盤查議定書(GHG Protocol)以及ISO/CNS 14064-1標準執行。透過蒐集活動數據進行彙整與計算，並檢視和評估營運過程中直接或間接溫室氣體的排放量及其排放源分布對環境之影響，進而識別高排放熱點，制定相應的減排策略，以促進永續發展。
                    <br/>
                    碳足跡是指以二氧化碳當量(CO2e)計量的溫室氣體總排放量，常用於標示個人活動或產品/服務生命週期中的碳排放總量。
                    <CTable bordered>
                        <CTableHead>
                        <CTableRow active>
                            <CTableHeaderCell scope="col"></CTableHeaderCell>
                            <CTableHeaderCell scope="col">碳盤查</CTableHeaderCell>
                            <CTableHeaderCell scope="col">碳足跡</CTableHeaderCell>
                        </CTableRow>
                        </CTableHead>
                        <CTableBody>
                        <CTableRow >
                            <CTableHeaderCell scope="row" className="table-background">目的</CTableHeaderCell>
                            <CTableDataCell colSpan={2} className="text-center">計算碳排放總量</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                            <CTableHeaderCell scope="row" className="table-background">對象</CTableHeaderCell>
                            <CTableDataCell>整個企業/組織</CTableDataCell>
                            <CTableDataCell>單一產品/服務</CTableDataCell>
                        </CTableRow>
                        </CTableBody>
                    </CTable>

                    </CAccordionBody>
                    </CAccordionItem>
                    <CAccordionItem itemKey={2}>
                    <CAccordionHeader>碳盤查範疇</CAccordionHeader>
                    <CAccordionBody>
                        參考溫室氣體盤查議定書(GHG Protocol)分類之三個範疇：
                        <br/>
                        ●範疇一：直接排放<br/>
                        因製程或廠房設施直接產生的溫室氣體，主要來自企業自身可控或擁有的排放來源。<br/>
                        例如：燃燒燃料、 公務車移動所產生的廢氣。<br/>
                        ●範疇二：間接排放<br/>
                        企業從外部購買能源時，該外部能源的製造過程中所產生的碳排放。<br/>
                        主要來自企業上游供應商，例如： 電力、冷氣、蒸汽等。<br/>
                        ●範疇三：其他間接排放<br/>
                        此範疇包含上述兩範疇以外之所有間接排放，包含企業組織的上下游廠商的各種活動。例如：上游廠商的運輸配送活動、下游廠商為產品加工等。
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <CCard style={{ width: '50rem' }}>
                                <CCardImage orientation="top" src={碳盤查範疇} />
                            </CCard>
                        </div>
                    </CAccordionBody>
                    </CAccordionItem>
                    <CAccordionItem itemKey={3}>
                    <CAccordionHeader>碳盤查流程</CAccordionHeader>
                    <CAccordionBody>
                        <CCol sm={12}>
                            <CCard className="mb-4 customCard" >
                                <CCardBody >
                                一、邊界設定
                                </CCardBody>
                            </CCard>
                        </CCol>
                        
                        <CCol sm={12}>
                            <CCard className="mb-4 customCard" >
                                <CCardBody >
                                二、基準年設定
                                </CCardBody>
                            </CCard>
                        </CCol>
                        <CCol sm={12}>
                            <CCard className="mb-4 customCard" >
                                <CCardBody >
                                三、排放源鑑別
                                </CCardBody>
                            </CCard>
                        </CCol>
                        <CCol sm={12}>
                            <CCard className="mb-4 customCard" >
                                <CCardBody >
                                四、排放量計算
                                </CCardBody>
                            </CCard>
                        </CCol>
                        <CCol sm={12}>
                            <CCard className="mb-4 customCard" >
                                <CCardBody >
                                五、數據品質管理
                                </CCardBody>
                            </CCard>
                        </CCol>
                        <CCol sm={12}>
                            <CCard className="mb-4 customCard" >
                                <CCardBody >
                                六、文件化與紀錄過程
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CAccordionBody>
                    </CAccordionItem>
                    <CAccordionItem itemKey={4}>
                        <CAccordionHeader>碳盤查原則</CAccordionHeader>
                        <CAccordionBody style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            
                            {[''].map((breakpoint, index) => (
                                <CListGroup className="mb-2" layout={`horizontal${breakpoint}`} key={index}>
                                <CListGroupItem className="list-group-title">相關性</CListGroupItem>
                                <CListGroupItem className="list-group-explanation">選擇適合預期使用者需求之溫室氣體源、<br/>溫室氣體匯、溫室氣體儲存庫、數據及方法。</CListGroupItem>
                                <CListGroupItem className="list-group-example">報告邊界</CListGroupItem>
                                </CListGroup>
                            ))}
                            {[''].map((breakpoint, index) => (
                                <CListGroup className="mb-2" layout={`horizontal${breakpoint}`} key={index}>
                                <CListGroupItem className="list-group-title">完整性</CListGroupItem>
                                <CListGroupItem className="list-group-explanation">納入所有相關的溫室氣體排除與移除。</CListGroupItem>
                                <CListGroupItem className="list-group-example">所有排放源</CListGroupItem>
                                </CListGroup>
                            ))}
                            {[''].map((breakpoint, index) => (
                                <CListGroup className="mb-2" layout={`horizontal${breakpoint}`} key={index}>
                                <CListGroupItem className="list-group-title">一致性</CListGroupItem>
                                <CListGroupItem className="list-group-explanation">每年使用一致的資料蒐集方法、量化方法以及管理文件，<br/>使溫室氣體相關資訊能有意義的比較。</CListGroupItem>
                                <CListGroupItem className="list-group-example">跨年度比較</CListGroupItem>
                                </CListGroup>
                            ))}
                            {[''].map((breakpoint, index) => (
                                <CListGroup className="mb-2" layout={`horizontal${breakpoint}`} key={index}>
                                <CListGroupItem className="list-group-title">透明度</CListGroupItem>
                                <CListGroupItem className="list-group-explanation">揭露充分且適當的溫室氣體相關資訊，<br/>使預期使用者做出合理可信之決策。</CListGroupItem>
                                <CListGroupItem className="list-group-example">外部查證</CListGroupItem>
                                </CListGroup>
                            ))}{[''].map((breakpoint, index) => (
                                <CListGroup className="mb-2" layout={`horizontal${breakpoint}`} key={index}>
                                <CListGroupItem className="list-group-title">準確性</CListGroupItem>
                                <CListGroupItem className="list-group-explanation">儘可能減少估計與猜測，依據實務減少偏差與不確定性。</CListGroupItem>
                                <CListGroupItem className="list-group-example">數據可信度</CListGroupItem>
                                </CListGroup>
                            ))}
                        </CAccordionBody>
                    </CAccordionItem>
                </CAccordion>
            </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default FormControl;
