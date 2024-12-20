import React, { useState, useEffect } from 'react'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CFormSelect,
  CNav,
  CNavItem,
  CNavLink,
  CForm,
  CFormLabel,
  CFormInput,
  CCardSubtitle,
  CCardText,
  CCardTitle,
  CButton,
  CTable,
  CTableBody,
  CTableCaption,
  CTableHead,
  CTableHeaderCell,
  CTableDataCell,
  CTableRow,
  CInputGroup,
  CInputGroupText,
  CListGroup,
  CListGroupItem,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import {
  CChartBar,
  CChartDoughnut,
  CChartLine,
  CChartPie,
  CChartPolarArea,
  CChartRadar,
} from '@coreui/react-chartjs'
import { Chart } from 'chart.js'
import { DocsCallout } from 'src/components'
import { DocsExample } from 'src/components'
import CIcon from '@coreui/icons-react'
import {
  cilDataTransferDown,
  cilDataTransferUp,
  cilMenu,
  cilChartPie,
  cilSearch,
  cilArrowCircleRight,
} from '@coreui/icons'
// import { freeSet } from '@coreui/icons'
// import { getIconsView } from '../brands/Brands.js'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTableList,
  faChartPie,
  faNewspaper,
  faCircleInfo,
} from '@fortawesome/free-solid-svg-icons'

import styles from '../../../scss/盤查結果查詢.module.css'

const Tabs = () => {
  const [activeTab, setActiveTab] = useState('tab1') // 記錄當前活動的分頁
  const cellStyle = {
    border: '1px solid white',
    textAlign: 'center',
    verticalAlign: 'middle',
    height: '40px',
  }
  const rankingstyle = { border: '1px solid white', textAlign: 'center', verticalAlign: 'middle' }

  const [visible1, setVisible1] = useState(false) // 削減率計算公式model
  const [visible2, setVisible2] = useState(false) // 削減率計算公式model
  const [visible3, setVisible3] = useState(false) // 削減率計算公式model

  //新聞const
  const [news, setNews] = useState([]) // 定義狀態變數
  const [query, setQuery] = useState('碳費') // 預設搜尋關鍵字
  const [searchInput, setSearchInput] = useState('') // 儲存搜尋框的暫存值
  const [loading, setLoading] = useState(false) // 加載狀態
  const [summary, setSummary] = useState('') //摘要總結
  //搜尋
  const handleSearchInput = (e) => {
    setSearchInput(e.target.value) // 更新輸入框的值
  }
  const handleSearch = () => {
    setQuery(searchInput) // 將暫存的搜尋框值設定到 query
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault() // 防止表單默認提交行為
      handleSearch() // 呼叫搜尋函數
    }
  }
  // 假設 ChatGPT API 實現

  // 碳費百科
  // Carbon Price定義(from WorldBank) 20140603
  const carbonfee1 = () => {
    window.open(
      'https://www.worldbank.org/en/programs/pricing-carbon',
      '_blank',
      'noopener,noreferrer',
    )
  }
  // 什麼是碳定價? 20210615
  const carbonfee2 = () => {
    window.open(
      'https://csrone.com/topics/6941#:~:text=%E3%80%8C%E7%A2%B3%E5%AE%9A%E5%83%B9%E3%80%8D%EF%BC%88Carbon%20Pricing%EF%BC%89%E6%84%8F%E5%8D%B3%E3%80%8C%E7%82%BA%E4%BA%8C%E6%B0%A7%E5%8C%96%EE%80%80%E7%A2%B3%EE%80%81%E5%88%B6%E5%AE%9A%E4%B8%80%E5%80%8B%E5%83%B9%E6%A0%BC%E3%80%8D%EF%BC%88putting',
      '_blank',
      'noopener,noreferrer',
    )
  }
  // 碳費制度上路正式邁入碳定價時代 20241011
  const carbonfee3 = () => {
    window.open(
      'https://service.cca.gov.tw/File/Get/cca/zh-tw/oOC06indxnu6vqt',
      '_blank',
      'noopener,noreferrer',
    )
  }
  // 碳費制度(含CBAM) 20240925
  const carbonfee4 = () => {
    window.open(
      'https://service.cca.gov.tw/File/Get/cca/zh-tw/cFRixd4MsiJO56M',
      '_blank',
      'noopener,noreferrer',
    )
  }
  // 臺灣2050淨零排放路徑及策略總說明 20220330
  const carbonfee5 = () => {
    window.open(
      'https://ws.ndc.gov.tw/Download.ashx?u=LzAwMS9hZG1pbmlzdHJhdG9yLzEwL3JlbGZpbGUvMC8xNTA0MC82Yzg4MWJlZC04ZDBlLTRhZmEtOGY4ZC02NTI5ZTE1MjViMTQucGRm&n=6Ie654GjMjA1MOa3qOmbtuaOkuaUvui3r%2bW%2bkeWPiuetlueVpee4veiqquaYjl%2fnsKHloLEucGRm&icon=.pdf',
      '_blank',
      'noopener,noreferrer',
    )
  }

  //news
  useEffect(() => {
    const fetchOrGenerateNews = async () => {
        setLoading(true);
        try {
            // 檢查今天是否有新聞
            const today = new Date().toISOString().split('T')[0];
            const response = await fetch(`http://127.0.0.1:8000/filtered-news?today_news_date=${today}`);
            const data = await response.json();

            console.log('API response data:', data);  // 檢查回應資料結構

            if (data.news.length > 0) {
                // 資料庫中已有新聞，直接設置到狀態
                setNews(data.news);
                console.log('Updated news state:', data.news); // 確認狀態是否更新
                setSummary(data.news[0].news_summary || "摘要不可用");
            } else {
                // 若無新聞，生成並儲存
                await fetchNewsAndGenerateSummary();
            }
        } catch (error) {
            console.error("Error fetching or generating news:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchNewsAndGenerateSummary = async () => {
        if (!query) return; // 如果沒有 query，就不執行

        setLoading(true);
        try {
            // Fetch news from API
            const response = await fetch(`http://127.0.0.1:5000/news?q=${query}`);
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            const data = await response.json();

            // 篩選符合條件的文章
            const filteredArticles = data.articles.filter((article) => {
                const isYahooWithValidExtension =
                    !(article.url.includes("yahoo") && !/\.(png|html)$/.test(article.url));
                const hasKeywordInTitle = article.title.includes(query);
                const isTitleLengthValid = article.title.length <= 30; // 新增篩選條件：標題長度小於等於 30 字元
                return isYahooWithValidExtension && hasKeywordInTitle && isTitleLengthValid;
            });

            setNews(filteredArticles);

            // Generate summary if filtered articles are available
            let summaryResult = "目前沒有可用的新聞標題供摘要。";
            if (filteredArticles.length > 0) {
                const filteredTitles = filteredArticles.map((article) => article.title);
                summaryResult = await generateSummary(filteredTitles);
                setSummary(summaryResult);
            } else {
                setSummary(summaryResult);
            }

            // Save filtered articles to database
            filteredArticles.forEach((article) => {
                saveNewsToDatabase({
                    news_title: article.title,
                    news_url: article.url,
                    news_summary: summaryResult, // 針對每條新聞保存摘要
                    news_date: article.publishedAt || new Date().toISOString().split('T')[0], // 改用正確屬性//article.news_date || new Date().toISOString().split('T')[0], // 使用新聞發布日期
                });
            });
        } catch (error) {
            console.error("Fetch error: ", error);
        } finally {
            setLoading(false);
        }
    };

    fetchOrGenerateNews();
}, [query]); // 只有當 query 改變時才會觸發

const generateSummary = async (titles) => {
    if (titles.length === 0) return "目前沒有可用的新聞標題供摘要。";
    try {
        const response = await fetch("http://127.0.0.1:8000/langchaingpt", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: `請根據以下標題生成摘要：${titles.join(", ")}`,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to generate summary from API: " + response.statusText);
        }

        const data = await response.json();
        return data.response; // 返回從 OpenAI API 獲得的摘要
    } catch (error) {
        console.error("Error generating summary: ", error);
        return "摘要生成失敗，請稍後再試。";
    }
};

const saveNewsToDatabase = async (newsData) => {
    try {
        const response = await fetch("http://127.0.0.1:8000/news", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newsData),
        });

        if (!response.ok) {
            throw new Error("Failed to save news to the database: " + response.statusText);
        }

        console.log("News saved successfully.", newsData);
    } catch (error) {
        console.error("Error saving news:", error);
    }
};

  return (
    <CRow>
      <div className={styles.systemTablist}>
        <div className={styles.tabsLeft}>
          <div style={{ width: '250px', display: 'flex', justifyContent: 'left' }}>
            <strong
              style={{ fontSize: '1.0rem', display: 'flex', alignItems: 'center', padding: '5px' }}
            >
              選擇年分
            </strong>
            <CCol style={{ justifyContent: 'left', alignItems: 'center', padding: '0' }}>
              <CFormSelect style={{ width: '120px' }}>
                <option>2025</option>
                <option value="1">2024</option>
                <option value="2">2023</option>
                <option value="3">2022</option>
              </CFormSelect>
            </CCol>
          </div>
          <div style={{ width: '300px', display: 'flex', justifyContent: 'left' }}>
            <strong
              style={{ fontSize: '1.0rem', display: 'flex', alignItems: 'center', padding: '5px' }}
            >
              參考標準
            </strong>
            <CCol style={{ justifyContent: 'left', alignItems: 'center', padding: '0' }}>
              <CFormSelect style={{ width: '90px' }}>
                <option>台灣</option>
                <option value="1">歐盟</option>
                <option value="2">xx2023盤查報告</option>
                <option value="3">xx2022盤查報告</option>
              </CFormSelect>
            </CCol>
          </div>
        </div>
        {/* <div className={styles.buttonRight}>
                    <button>
                        <CIcon style={{ display: 'inline' }} icon={cilDataTransferUp} className="me-2" />
                        上傳檔案
                    </button>
                </div> */}
      </div>
      <div style={{ height: '10px' }}></div>
      <CCol xs={12}>
        <CNav variant="tabs" className="card-header-tabs">
          <CNavItem>
            <CNavLink
              active={activeTab === 'tab1'}
              onClick={() => setActiveTab('tab1')}
              className={activeTab === 'tab1' ? styles.tabChoose : styles.tabNoChoose}
            >
              <div>
                <FontAwesomeIcon icon={faTableList} />
                &nbsp;碳費計算
              </div>
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              active={activeTab === 'tab2'}
              onClick={() => setActiveTab('tab2')}
              className={activeTab === 'tab2' ? styles.tabChoose : styles.tabNoChoose}
            >
              <div>
                <FontAwesomeIcon icon={faChartPie} />
                &nbsp;碳費分析
              </div>
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              active={activeTab === 'tab3'}
              onClick={() => setActiveTab('tab3')}
              className={activeTab === 'tab3' ? styles.tabChoose : styles.tabNoChoose}
            >
              <div>
                <FontAwesomeIcon icon={faNewspaper} />
                &nbsp;碳費新聞
              </div>
            </CNavLink>
          </CNavItem>
        </CNav>

        <div className={styles.body}>
          {/* /*碳費計算 */}
          {activeTab === 'tab1' && (
            <>
              <div className={styles.titleContainer}>
                <div className={styles.leftItem}>
                  <div>
                    <strong>xx2024碳費計算</strong>
                  </div>
                  <div>
                    <CFormSelect size="sm" className={styles.input}>
                      <option>全部表格</option>
                      <option value="1">表1</option>
                      <option value="2">表2</option>
                      <option value="3">表3</option>
                    </CFormSelect>
                  </div>
                </div>
                <div className={styles.rightItem}>
                  <button>
                    <CIcon icon={cilDataTransferDown} className="me-2" />
                    下載全部
                  </button>
                </div>
              </div>
              {/* 總覽 */}
              <CCard style={{ width: '100%' }}>
                <CCardTitle>
                  <div style={{ display: 'flex', flexDireaction: 'row' }}>
                    <div
                      style={{
                        fontWeight: 'bold',
                        fontSize: '1.5rem',
                        color: 'white',
                        backgroundColor: '#9D6B6B',
                        borderTopLeftRadius: '5px',
                        borderBottomRightRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 40px 10px 40px',
                      }}
                    >
                      總覽
                    </div>
                    <CButton
                      style={{
                        position: 'absolute',
                        right: '30px',
                        width: '40px',
                        backgroundColor: '#9D6B6B',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: '10px',
                      }}
                    >
                      <b>
                        <CIcon icon={cilDataTransferDown} className="me-2" />
                      </b>
                    </CButton>
                  </div>
                  {/* <div style={{ width: '100%', height: '50px', display: 'grid', alignItems: 'center', }}>
                                        <strong style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', padding: '5px' }}>總覽</strong>
                                        <CButton style={{ position: 'absolute', right: '30px', width: '40px', backgroundColor: '#9D6B6B', color: 'white', display: 'flex', alignItems: 'center' }}>
                                            <b><CIcon icon={cilDataTransferDown} className="me-2" /></b>
                                        </CButton>
                                    </div> */}
                </CCardTitle>
                <CCardBody>
                  <table style={{ fontSize: '1.2rem' }}>
                    <thead
                      style={{
                        border: '1px solid white',
                        backgroundColor: '#339933',
                        color: 'white',
                      }}
                    >
                      <tr>
                        <th scope="col" style={cellStyle} rowSpan={2}></th>
                        <th scope="col" style={cellStyle} rowSpan={2}>
                          排放當量<br></br>(公噸CO2e/年)
                        </th>
                        <th scope="col" style={cellStyle} rowSpan={2}>
                          百分比<br></br>(%)
                        </th>
                        <th scope="col" style={cellStyle} rowSpan={2}>
                          一般費率<br></br>(300元/公噸CO2e)
                        </th>
                        <th scope="col" style={cellStyle} colSpan={2}>
                          優惠費率
                        </th>
                      </tr>
                      <tr>
                        <th scope="col" style={cellStyle}>
                          達技術標竿<br></br>(100元/公噸CO2e)
                        </th>
                        <th scope="col" style={cellStyle}>
                          達行業別目標<br></br>(50元/公噸CO2e)
                        </th>
                      </tr>
                    </thead>
                    <tbody style={{ border: '1px solid white', backgroundColor: '#ccffcc' }}>
                      <tr>
                        <td style={{ border: '1px solid white' }}>
                          <b>總排放量</b>
                        </td>
                        <td style={cellStyle}>244.774</td>
                        <td style={cellStyle}>100%</td>
                        <td style={cellStyle}>{(244.744 * 300 * 1).toLocaleString()}</td>
                        <td style={cellStyle}>{(244.744 * 100 * 1).toLocaleString()}</td>
                        <td style={cellStyle}>{(244.744 * 50 * 1).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid white' }}>
                          <b>
                            <div>
                              <CRow>
                                <div style={{ width: '140px' }}>直接排放</div>
                                <div style={{ width: '100px' }}>/範疇一</div>
                              </CRow>
                            </div>
                          </b>
                        </td>
                        <td style={cellStyle}>47.0206</td>
                        <td style={cellStyle}>19.21%</td>
                        <td style={cellStyle}>{(47.0206 * 300 * 1).toLocaleString()}</td>
                        <td style={cellStyle}>{(47.0206 * 100 * 1).toLocaleString()}</td>
                        <td style={cellStyle}>{(47.0206 * 50 * 1).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid white' }}>
                          <b>
                            <div>
                              <CRow>
                                <div style={{ width: '140px' }}>間接排放</div>
                                <div style={{ width: '100px' }}>/範疇二</div>
                              </CRow>
                            </div>
                          </b>
                        </td>
                        <td style={cellStyle}>197.7533</td>
                        <td style={cellStyle}>80.79%</td>
                        <td style={cellStyle}>{(197.7533 * 300 * 1).toLocaleString()}</td>
                        <td style={cellStyle}>{(197.7533 * 100 * 1).toLocaleString()}</td>
                        <td style={cellStyle}>{(197.7533 * 50 * 1).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid white' }}>
                          <b>
                            <div>
                              <CRow>
                                <div style={{ width: '140px' }}>其他間接排放</div>
                                <div style={{ width: '100px' }}>/範疇三</div>
                              </CRow>
                            </div>
                          </b>
                        </td>
                        <td style={cellStyle}>-----</td>
                        <td style={cellStyle}>-----</td>
                        <td style={cellStyle}>-----</td>
                        <td style={cellStyle}>-----</td>
                        <td style={cellStyle}>-----</td>
                      </tr>
                    </tbody>
                  </table>
                  <br />
                </CCardBody>
              </CCard>
              <br></br>
              {/* 技術標竿指定削減率 */}
              <CCard style={{ width: '100%' }}>
                <CCardTitle>
                  <div style={{ display: 'flex', flexDireaction: 'row' }}>
                    <div
                      style={{
                        fontWeight: 'bold',
                        fontSize: '1.5rem',
                        color: 'white',
                        backgroundColor: '#9D6B6B',
                        borderTopLeftRadius: '5px',
                        borderBottomRightRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 30px 10px 30px',
                      }}
                    >
                      技術標竿指定削減率
                    </div>
                    <CButton
                      style={{
                        height: '18px',
                        width: '18px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '28px',
                      }}
                      onClick={() => setVisible1(!visible1)}
                    >
                      <FontAwesomeIcon
                        icon={faCircleInfo}
                        style={{ width: '20px', height: '20px' }}
                      />
                    </CButton>
                    <CModal visible={visible1} onClose={() => setVisible1(false)}>
                      <CModalHeader>
                        <CModalTitle><b>技術標竿指定削減率</b></CModalTitle>
                      </CModalHeader>
                      <CModalBody><ul>
                                  <li>以<b>107~111年為基準年</b>，考量各排放源排放形式，包括燃料種類、製程、電力使用等訂定減量目標，適用<b>優惠費率B</b>。
                                  <br/><font style={{backgroundColor:'#DCDCDC'}}>削減率 = [(基準年-當年分) / 基準年]*100%</font><br/>
                                  </li>
                                  <li>目標年溫室氣體年排放量削減率相對基準年應達6%。<br></br>
                                  <font style={{backgroundColor:'#DCDCDC'}}>目標年溫室氣體排放量 = [基準年固定燃料燃燒溫室氣體年排放量*(1-削減率)]+[基準年製程溫室氣體年排放量*(1-削減率)]
                                      +[基準年使用電力之溫室氣體年排放量*(1-削減率)]+[逸散及移動排放源基準年溫室氣體年排放量]</font><br/>
                                  </li></ul>
                      </CModalBody>
                      <CModalFooter>
                        <CButton color="secondary" onClick={() => setVisible1(false)}>
                          關閉
                        </CButton>
                      </CModalFooter>
                    </CModal>
                    <CButton
                      style={{
                        position: 'absolute',
                        right: '30px',
                        width: '40px',
                        backgroundColor: '#9D6B6B',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: '10px',
                      }}
                    >
                      <b>
                        <CIcon icon={cilDataTransferDown} className="me-2" />
                      </b>
                    </CButton>
                  </div>
                </CCardTitle>
                <CCardBody>
                  <table style={{ fontSize: '1.2rem' }}>
                    <thead
                      style={{
                        border: '1px solid white',
                        backgroundColor: '#339933',
                        color: 'white',
                      }}
                    >
                      <tr>
                        <th scope="col" style={cellStyle} colSpan={2}></th>
                        <th scope="col" style={cellStyle}>
                          基準年排放當量<br></br>(公噸CO2e/年)
                        </th>
                        <th scope="col" style={cellStyle}>
                          排放當量<br></br>(公噸CO2e/年)
                        </th>
                        <th scope="col" style={cellStyle}>
                          削減率<br></br>(%)
                        </th>
                        <th scope="col" style={cellStyle}>
                          目標年削減率<br></br>(%)
                        </th>
                      </tr>
                    </thead>
                    <tbody style={{ border: '1px solid white', backgroundColor: '#ccffcc' }}>
                      <tr>
                        <td
                          style={{
                            border: '1px solid white',
                            width: '170px',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                          }}
                          colSpan={2}
                        >
                          <b>使用電力間接排放</b>
                        </td>
                        <td style={cellStyle}>197.7533</td>
                        <td style={cellStyle}>197.7533</td>
                        <td style={cellStyle}>0%</td>
                        <td style={cellStyle}>
                          <b>6%</b>
                        </td>
                      </tr>
                      {/* <tr>
                                            <td style={{ border: '1px solid white', width:'200px', textAlign: 'center', verticalAlign: 'middle'}} colSpan={2}><b>直接排放：<br></br>固定燃燒排放源</b></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}>需計算</td>
                                        </tr>
                                        <tr>
                                            <td style={{ border: '1px solid white', width: '100px', textAlign: 'center', verticalAlign: 'middle'}} rowSpan={3}><b>直接排放：<br></br>製程排放</b></td>
                                            <td style={{border: '1px solid white', textAlign: 'center', verticalAlign: 'middle', height: '40px',width:'100px'}}><b>含氟氣體</b></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}>85%</td>
                                        </tr>
                                        <tr>
                                            <td style={cellStyle}><b>氧化亞氮</b></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}>50%</td>
                                        </tr>
                                        <tr>
                                            <td style={cellStyle}><b>其他製程</b></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}></td>
                                            <td style={cellStyle}>3%</td>
                                        </tr> */}
                    </tbody>
                  </table>
                  <br />
                </CCardBody>
              </CCard>
              <br></br>
              {/* 行業別指定削減率 */}
              <CCard style={{ width: '100%' }}>
                <CCardTitle>
                  <div style={{ display: 'flex', flexDireaction: 'row' }}>
                    <div
                      style={{
                        fontWeight: 'bold',
                        fontSize: '1.5rem',
                        color: 'white',
                        backgroundColor: '#9D6B6B',
                        borderTopLeftRadius: '5px',
                        borderBottomRightRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 30px 10px 30px',
                      }}
                    >
                      行業別指定削減率
                    </div>
                    <CButton
                      style={{
                        height: '18px',
                        width: '18px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '28px',
                      }}
                      onClick={() => setVisible2(!visible2)}
                    >
                      <FontAwesomeIcon
                        icon={faCircleInfo}
                        style={{ width: '20px', height: '20px' }}
                      />
                    </CButton>
                    <CModal visible={visible2} onClose={() => setVisible2(false)}>
                      <CModalHeader>
                        <CModalTitle><b>行業別指定削減率</b></CModalTitle>
                      </CModalHeader>
                      <CModalBody><ul>
                                  <li>以<b>110年為基準年</b>，此目標參酌國際間科技基礎減量目標(SBT)訂定，適用<b>優惠費率A</b>。
                                  <br/><font style={{backgroundColor:'#DCDCDC'}}>削減率 = [(基準年-當年分) / 基準年]*100%</font><br/>
                                  </li>
                                  <li>目標年訂為119年，目標年溫室氣體年排放量削減率相對基準年應達42%。<br/>
                                  <font style={{backgroundColor:'#DCDCDC'}}>目標年溫室氣體排放量 = 基準年溫室氣體年排放量*(1-削減率)</font><br/>
                                  </li></ul>
                      </CModalBody>
                      <CModalFooter>
                        <CButton color="secondary" onClick={() => setVisible2(false)}>
                          關閉
                        </CButton>
                      </CModalFooter>
                    </CModal>
                    <CButton
                      style={{
                        position: 'absolute',
                        right: '30px',
                        width: '40px',
                        backgroundColor: '#9D6B6B',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: '10px',
                      }}
                    >
                      <b>
                        <CIcon icon={cilDataTransferDown} className="me-2" />
                      </b>
                    </CButton>
                  </div>
                </CCardTitle>
                <CCardBody>
                  <table style={{ fontSize: '1.2rem' }}>
                    <thead
                      style={{
                        border: '1px solid white',
                        backgroundColor: '#339933',
                        color: 'white',
                      }}
                    >
                      <tr>
                        <th scope="col" style={cellStyle} colSpan={2}></th>
                        <th scope="col" style={cellStyle}>
                          基準年排放當量<br></br>(公噸CO2e/年)
                        </th>
                        <th scope="col" style={cellStyle}>
                          排放當量<br></br>(公噸CO2e/年)
                        </th>
                        <th scope="col" style={cellStyle}>
                          削減率<br></br>(%)
                        </th>
                        <th scope="col" style={cellStyle}>
                          目標年削減率<br></br>(%)
                        </th>
                      </tr>
                    </thead>
                    <tbody style={{ border: '1px solid white', backgroundColor: '#ccffcc' }}>
                      <tr>
                        <td
                          style={{
                            border: '1px solid white',
                            width: '120px',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                          }}
                          colSpan={2}
                        >
                          <b>其他行業別</b>
                        </td>
                        <td style={cellStyle}>244.744</td>
                        <td style={cellStyle}>244.744</td>
                        <td style={cellStyle}>0%</td>
                        <td style={cellStyle}>
                          <b>42%</b>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <br />
                </CCardBody>
              </CCard>
              <br></br>
              <br></br>
            </>
          )}

          {/* /*碳費分析&圖表呈現頁 */}
          {activeTab === 'tab2' && (
            <>
              <div className={styles.titleContainer}>
                <div className={styles.leftItem}>
                  <div>
                    <strong>xx2024碳費分析</strong>
                  </div>
                  <div>
                    <CFormSelect size="sm" className={styles.input}>
                      <option>全部圖形</option>
                      <option value="1">表1</option>
                      <option value="2">表2</option>
                      <option value="3">表3</option>
                    </CFormSelect>
                  </div>
                </div>
                <div className={styles.rightItem}>
                  <button>
                    <CIcon icon={cilDataTransferDown} className="me-2" />
                    下載全部
                  </button>
                </div>
              </div>
              <CRow>
                {/* 圓餅圖 */}
                <CCol xs={12}>
                  <CCard className="mb-4">
                    <CCardHeader
                      style={{
                        backgroundColor: '#9D6B6B',
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <strong
                        style={{
                          fontSize: '1.5rem',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '5px',
                        }}
                      >
                        統計圖表 /{' '}
                      </strong>
                      <strong style={{ fontSize: '1.3rem', color: 'white', padding: '5px' }}>
                        圓餅圖
                      </strong>
                      <CButton
                        style={{
                          position: 'absolute',
                          right: '10px',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <b>
                          <CIcon icon={cilDataTransferDown} style={{ fontSize: '24px' }} />
                        </b>
                      </CButton>
                    </CCardHeader>
                    <CCardBody
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                      }}
                    >
                      <div style={{ width: '350px', height: '350px' }}>
                        <CChartPie
                          data={{
                            labels: ['電力使用', '冷媒', '滅火器'],
                            datasets: [
                              {
                                data: [80.79, 8.52, 4.44],
                                backgroundColor: ['#d882c0', '#FFB3FF', '#FFB6C1'],
                                hoverBackgroundColor: ['#d882c0', '#FFB3FF', '#FFB6C1'],
                              },
                            ],
                          }}
                          options={{
                            responsive: true,
                            plugins: {
                              legend: {
                                display: true,
                                position: 'right', // 圖例位置
                                labels: {
                                  boxWidth: 25,
                                },
                              },
                              tooltip: {
                                enabled: true, // 顯示提示框
                              },
                            },
                            // 開啟數據標籤
                            datalabels: {
                              display: true,
                              color: 'black', // 設定標籤顏色
                              font: {
                                weight: 'bold', // 設定字體粗細
                              },
                              formatter: (value) => `${value}%`, // 顯示百分比或其他格式
                            },
                            responsive: true,
                            maintainAspectRatio: true,
                          }}
                        />
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
              {/* 碳費分析 */}
              <CCard style={{ width: '100%' }}>
                <CCardTitle>
                  <div style={{ display: 'flex', flexDireaction: 'row' }}>
                    <div
                      style={{
                        fontWeight: 'bold',
                        fontSize: '1.5rem',
                        color: 'white',
                        backgroundColor: '#9D6B6B',
                        borderTopLeftRadius: '5px',
                        borderBottomRightRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 30px 10px 30px',
                      }}
                    >
                      分析總覽
                    </div>
                    <CButton
                      style={{
                        height: '18px',
                        width: '18px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '28px',
                      }}
                      onClick={() => setVisible3(!visible3)}
                    >
                      <FontAwesomeIcon
                        icon={faCircleInfo}
                        style={{ width: '20px', height: '20px' }}
                      />
                    </CButton>
                    <CModal visible={visible3} onClose={() => setVisible3(false)}>
                      <CModalHeader>
                        <CModalTitle><b>碳費&排放當量</b></CModalTitle>
                      </CModalHeader>
                      <CModalBody><ul><li>
                                  <font style={{backgroundColor:'#DCDCDC'}}>碳費 = 收費排放量*徵收費率</font>
                                  </li>
                                  <li><font style={{backgroundColor:'#DCDCDC'}}>收費排放量 = [年排放當量-K值]*排放量調整係數</font>
                                  <br/><b>非高碳洩漏風險者K值為25,000公噸</b>；高碳洩漏風險者K值為0公噸二氧化碳當量。<br/>
                                  <b>非高碳洩漏風險者的排放量調整係數為0</b>；高碳洩漏風險行業在初期適用0.2的排放量調整係數，第二期與第三期分別為0.4和0.6​。
                                  </li></ul>
                      </CModalBody>
                      <CModalFooter>
                        <CButton color="secondary" onClick={() => setVisible3(false)}>
                          關閉
                        </CButton>
                      </CModalFooter>
                    </CModal>
                    <CButton
                      style={{
                        position: 'absolute',
                        right: '30px',
                        width: '40px',
                        backgroundColor: '#9D6B6B',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: '10px',
                      }}
                    >
                      <b>
                        <CIcon icon={cilDataTransferDown} className="me-2" />
                      </b>
                    </CButton>
                  </div>
                </CCardTitle>
                <CCardBody>
                  <table style={{ fontSize: '1.2rem' }}>
                    <thead
                      style={{
                        border: '1px solid white',
                        backgroundColor: '#339933',
                        color: 'white',
                      }}
                    >
                      <tr>
                        <th scope="col" style={cellStyle} rowSpan={2}></th>
                        <th scope="col" style={cellStyle} rowSpan={2}>
                          範疇
                        </th>
                        <th scope="col" style={cellStyle} rowSpan={2}>
                          類型
                        </th>
                        <th scope="col" style={cellStyle} rowSpan={2}>
                          排放當量<br></br>(公噸CO2e/年)
                        </th>
                        <th scope="col" style={cellStyle} rowSpan={2}>
                          百分比<br></br>(%)
                        </th>
                        <th scope="col" style={cellStyle} rowSpan={2}>
                          一般費率<br></br>(300元/公噸CO2e)
                        </th>
                        <th scope="col" style={cellStyle} colSpan={2}>
                          優惠費率
                        </th>
                      </tr>
                      <tr>
                        <th scope="col" style={cellStyle}>
                          達技術標竿<br></br>(100元/公噸CO2e)
                        </th>
                        <th scope="col" style={cellStyle}>
                          達行業別目標<br></br>(50元/公噸CO2e)
                        </th>
                      </tr>
                    </thead>
                    <tbody style={{ border: '1px solid white', backgroundColor: '#ccffcc' }}>
                      <tr>
                        <td
                          style={{
                            border: '1px solid white',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                          }}
                        >
                          <b>1</b>
                        </td>
                        <td style={cellStyle}>二</td>
                        <td style={cellStyle}>外購電力</td>
                        <td style={cellStyle}>197.7533</td>
                        <td style={cellStyle}>80.79%</td>
                        <td style={cellStyle}>{(197.7533 * 300 * 1).toLocaleString()}</td>
                        <td style={cellStyle}>{(197.7533 * 100 * 1).toLocaleString()}</td>
                        <td style={cellStyle}>{(197.7533 * 50 * 1).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td style={rankingstyle}>
                          <b>2</b>
                        </td>
                        <td style={cellStyle}>一</td>
                        <td style={cellStyle}>冷媒</td>
                        <td style={cellStyle}>20.8505</td>
                        <td style={cellStyle}>8.52%</td>
                        <td style={cellStyle}>{(20.8505 * 300 * 1).toLocaleString()}</td>
                        <td style={cellStyle}>{(20.8505 * 100 * 1).toLocaleString()}</td>
                        <td style={cellStyle}>{(20.8505 * 50 * 1).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td style={rankingstyle}>
                          <b>3</b>
                        </td>
                        <td style={cellStyle}>一</td>
                        <td style={cellStyle}>滅火器</td>
                        <td style={cellStyle}>10.8795</td>
                        <td style={cellStyle}>4.44%</td>
                        <td style={cellStyle}>{(10.8795 * 300 * 1).toLocaleString()}</td>
                        <td style={cellStyle}>{(10.8795 * 100 * 1).toLocaleString()}</td>
                        <td style={cellStyle}>{(10.8795 * 50 * 1).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td style={rankingstyle}>
                          <b>4</b>
                        </td>
                        <td style={cellStyle}>一</td>
                        <td style={cellStyle}>公務車</td>
                        <td style={cellStyle}>10.0595</td>
                        <td style={cellStyle}>4.11%</td>
                        <td style={cellStyle}>{(10.0595 * 300 * 1).toLocaleString()}</td>
                        <td style={cellStyle}>{(10.0595 * 100 * 1).toLocaleString()}</td>
                        <td style={cellStyle}>{(10.0595 * 50 * 1).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td style={rankingstyle}>
                          <b>5</b>
                        </td>
                        <td style={cellStyle}>一</td>
                        <td style={cellStyle}>化糞池</td>
                        <td style={cellStyle}>5.2186</td>
                        <td style={cellStyle}>2.13%</td>
                        <td style={cellStyle}>{(5.2186 * 300 * 1).toLocaleString()}</td>
                        <td style={cellStyle}>{(5.2186 * 100 * 1).toLocaleString()}</td>
                        <td style={cellStyle}>{(5.2186 * 50 * 1).toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                  <br />
                </CCardBody>
              </CCard>
              <br></br>
            </>
          )}
          {/* 碳費新聞 */}
          {activeTab === 'tab3' && (
            <>
              {/* 搜尋&篩選器 先註解掉*/}
              {/* <div style={{ width: '70%' }}>
                                <CInputGroup className="mb-3">
                                    <CFormInput
                                        type="search"
                                        placeholder="搜尋..."
                                        className="search-input"
                                        value={searchInput} // 綁定輸入框的暫存值
                                        onChange={handleSearchInput} // 更新輸入框的值
                                        onKeyDown={handleKeyDown} // 監聽 Enter 鍵
                                    />
                                    <CButton type="button" color="secondary" variant="outline" onClick={handleSearch}>
                                        <i className="pi pi-search" />
                                    </CButton>
                                </CInputGroup>
                            </div> */}
              {/* 碳費新聞 */}
              <CCard style={{ width: '100%' }}>
                <CCardTitle>
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div
                      style={{
                        fontWeight: 'bold',
                        fontSize: '1.5rem',
                        color: 'white',
                        backgroundColor: '#00a000',
                        borderTopLeftRadius: '5px',
                        borderBottomRightRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 40px',
                      }}
                    >
                      {/* 根據搜尋內容動態顯示標題 */}
                      {query || '搜尋結果'}新聞
                    </div>
                  </div>
                </CCardTitle>
                <CCardBody>
                  <CCardBody
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                  >
                    <CCard style={{ width: '1100px', fontSize: '1.2rem' }}>
                      <CCardBody>
                        {loading ? (
                          <center>
                            <p>正在載入新聞...</p>
                          </center>
                        ) : news.length === 0 ? ( // 如果篩選後的新聞數量為 0
                          <center>
                            <p>暫無新聞!</p>
                            <p>可搜尋關鍵字!</p>
                          </center>
                        ) : (
                          news
                            .map((article, index) => (
                              <li
                                key={index}
                                style={{
                                  marginBottom: '10px',
                                  listStyleType: 'none',
                                  borderBottom: '1px solid lightgray',
                                  paddingBottom: '10px',
                                }}
                              >
                                <a
                                  href={article.news_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    textDecoration: 'none',
                                    color: '#00a000',
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                  }}
                                ></a>
                                <CRow>
                                  <div
                                    style={{
                                      width: '100%',
                                      height: '50px',
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: '10px',
                                        height: '100%',
                                        backgroundColor: '#00a000',
                                        borderRadius: '4px',
                                      }}
                                    ></div>
                                    <div
                                      style={{
                                        display: 'flex',
                                        flex: 1,
                                        marginLeft: '20px',
                                        flexDirection: 'column',
                                      }}
                                    >
                                      <p style={{ color: 'green', fontWeight: 'bold', margin: 0 }}>
                                      {article.news_date}
                                        {/** {new Date(article.publishedAt).toLocaleDateString()}*/}
                                      
                                      </p>
                                      <p style={{ fontWeight: 'bold', margin: 0 }}>
                                        {article.news_title}
                                      </p>
                                    </div>
                                    <CButton
                                      style={{
                                        height: '60px',
                                        width: '60px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                      }}
                                      onClick={() => window.open(article.news_url, '_blank')}
                                    >
                                      <CIcon
                                        icon={cilArrowCircleRight}
                                        style={{ width: '55px', height: '55px' }}
                                      />
                                    </CButton>
                                  </div>
                                </CRow>
                              </li>
                            ))
                        )}
                      </CCardBody>
                    </CCard>
                  </CCardBody>
                  <br />
                </CCardBody>
              </CCard>
              <br></br>
              {/**新聞摘要看看 */}
              <CCard style={{ width: '100%' }}>
                <CCardTitle>
                  <div style={{ display: 'flex', flexDireaction: 'row' }}>
                    <div
                      style={{
                        fontWeight: 'bold',
                        fontSize: '1.5rem',
                        color: 'white',
                        backgroundColor: '#9999CC',
                        borderTopLeftRadius: '5px',
                        borderBottomRightRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 40px 10px 40px',
                      }}
                    >
                      {query || '搜尋結果'}AI摘要
                    </div>
                  </div>
                </CCardTitle>
                <CCardBody>
                  <CCardBody
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                  >
                    <CCard style={{ width: '1100px', fontSize: '1.2rem' }}>
                      <CRow>
                        <CCol sm={12}>
                          <CCard style={{ width: '100%', fontSize: '1.2rem' }}>
                            <CCardBody>
                              <CRow>
                                {/* 左側：日期與標題 */}
                                <div
                                  style={{
                                    display: 'flex',
                                    flex: 1,
                                    marginLeft: '20px',
                                    flexDirection: 'column',
                                  }}
                                >
                                  {loading ? (
                                    <center>
                                      <p>正在載入摘要...</p>
                                    </center>
                                  ) : (
                                    <p style={{ fontWeight: 'bold', margin: 0 }}>{summary}</p>
                                    )
                                  }
                                </div>
                              </CRow>
                            </CCardBody>
                          </CCard>
                        </CCol>
                      </CRow>
                    </CCard>
                  </CCardBody>
                </CCardBody>
              </CCard>
              <br></br>
              {/* 碳費百科 */}
              <CCard className="mb-4">
                <CCardTitle>
                  <div style={{ display: 'flex', flexDireaction: 'row' }}>
                    <div
                      style={{
                        fontWeight: 'bold',
                        fontSize: '1.5rem',
                        color: 'white',
                        backgroundColor: '#d882c0',
                        borderTopLeftRadius: '5px',
                        borderBottomRightRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 40px 10px 40px',
                      }}
                    >
                      碳費百科
                    </div>
                  </div>
                </CCardTitle>
                <CCardBody>
                  <CCardBody
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                  >
                    <CRow>
                      <CCol sm={12}>
                        <CCard style={{ width: '100%', fontSize: '1.2rem' }}>
                          <CCardBody>
                            <CRow>
                              <div
                                style={{
                                  width: '100%',
                                  height: '50px',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}
                              >
                                <div
                                  style={{
                                    width: '10px',
                                    height: '100%',
                                    backgroundColor: '#d882c0',
                                    borderRadius: '4px',
                                  }}
                                ></div>{' '}
                                {/* 左側粉色 bar */}
                                {/* 左側：日期與標題 */}
                                <div
                                  style={{
                                    display: 'flex',
                                    flex: 1,
                                    marginLeft: '20px',
                                    flexDirection: 'column',
                                  }}
                                >
                                  {/* 日期 */}
                                  <p style={{ color: '#d882c0', fontWeight: 'bold', margin: 0 }}>
                                    2014/06/03
                                  </p>
                                  {/* 標題 */}
                                  <p style={{ fontWeight: 'bold', margin: 0 }}>
                                    Carbon Pricing_WorldBank
                                  </p>
                                </div>
                                {/* 右側：箭頭按鈕 */}
                                <CButton
                                  style={{
                                    height: '60px',
                                    width: '60px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}
                                >
                                  <CIcon
                                    icon={cilArrowCircleRight}
                                    onClick={carbonfee1}
                                    style={{ width: '55px', height: '55px' }}
                                  />
                                </CButton>
                              </div>
                            </CRow>
                          </CCardBody>
                        </CCard>
                      </CCol>
                      <CCol sm={12}>
                        <CCard style={{ width: '100%', fontSize: '1.2rem' }}>
                          <CCardBody>
                            <CRow>
                              <div
                                style={{
                                  width: '100%',
                                  height: '50px',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}
                              >
                                <div
                                  style={{
                                    width: '10px',
                                    height: '100%',
                                    backgroundColor: '#d882c0',
                                    borderRadius: '4px',
                                  }}
                                ></div>{' '}
                                {/* 左側粉色 bar */}
                                {/* 左側：日期與標題 */}
                                <div
                                  style={{
                                    display: 'flex',
                                    flex: 1,
                                    marginLeft: '20px',
                                    flexDirection: 'column',
                                  }}
                                >
                                  {/* 日期 */}
                                  <p style={{ color: '#d882c0', fontWeight: 'bold', margin: 0 }}>
                                    2021/06/15
                                  </p>
                                  {/* 標題 */}
                                  <p style={{ fontWeight: 'bold', margin: 0 }}>
                                    什麼是碳定價?_永訊智庫
                                  </p>
                                </div>
                                {/* 右側：箭頭按鈕 */}
                                <CButton
                                  style={{
                                    height: '60px',
                                    width: '60px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}
                                >
                                  <CIcon
                                    icon={cilArrowCircleRight}
                                    onClick={carbonfee2}
                                    style={{ width: '55px', height: '55px' }}
                                  />
                                </CButton>
                              </div>
                            </CRow>
                          </CCardBody>
                        </CCard>
                      </CCol>
                      <CCol sm={12}>
                        <CCard style={{ width: '100%', fontSize: '1.2rem' }}>
                          <CCardBody>
                            <CRow>
                              <div
                                style={{
                                  width: '100%',
                                  height: '50px',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}
                              >
                                <div
                                  style={{
                                    width: '10px',
                                    height: '100%',
                                    backgroundColor: '#d882c0',
                                    borderRadius: '4px',
                                  }}
                                ></div>{' '}
                                {/* 左側粉色 bar */}
                                {/* 左側：日期與標題 */}
                                <div
                                  style={{
                                    display: 'flex',
                                    flex: 1,
                                    marginLeft: '20px',
                                    flexDirection: 'column',
                                  }}
                                >
                                  {/* 日期 */}
                                  <p style={{ color: '#d882c0', fontWeight: 'bold', margin: 0 }}>
                                    2024/10/11
                                  </p>
                                  {/* 標題 */}
                                  <p style={{ fontWeight: 'bold', margin: 0 }}>
                                    碳費制度上路正式邁入碳定價時代_環境部
                                  </p>
                                </div>
                                {/* 右側：箭頭按鈕 */}
                                <CButton
                                  style={{
                                    height: '60px',
                                    width: '60px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}
                                >
                                  <CIcon
                                    icon={cilArrowCircleRight}
                                    onClick={carbonfee3}
                                    style={{ width: '55px', height: '55px' }}
                                  />
                                </CButton>
                              </div>
                            </CRow>
                          </CCardBody>
                        </CCard>
                      </CCol>
                      <CCol sm={12}>
                        <CCard style={{ width: '100%', fontSize: '1.2rem' }}>
                          <CCardBody>
                            <CRow>
                              <div
                                style={{
                                  width: '100%',
                                  height: '50px',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}
                              >
                                <div
                                  style={{
                                    width: '10px',
                                    height: '100%',
                                    backgroundColor: '#d882c0',
                                    borderRadius: '4px',
                                  }}
                                ></div>{' '}
                                {/* 左側粉色 bar */}
                                {/* 左側：日期與標題 */}
                                <div
                                  style={{
                                    display: 'flex',
                                    flex: 1,
                                    marginLeft: '20px',
                                    flexDirection: 'column',
                                  }}
                                >
                                  {/* 日期 */}
                                  <p style={{ color: '#d882c0', fontWeight: 'bold', margin: 0 }}>
                                    2024/09/25
                                  </p>
                                  {/* 標題 */}
                                  <p style={{ fontWeight: 'bold', margin: 0 }}>
                                    台灣碳費制度(含CBAM)_環境部
                                  </p>
                                </div>
                                {/* 右側：箭頭按鈕 */}
                                <CButton
                                  style={{
                                    height: '60px',
                                    width: '60px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}
                                >
                                  <CIcon
                                    icon={cilArrowCircleRight}
                                    onClick={carbonfee4}
                                    style={{ width: '55px', height: '55px' }}
                                  />
                                </CButton>
                              </div>
                            </CRow>
                          </CCardBody>
                        </CCard>
                      </CCol>
                      <CCol sm={12}>
                        <CCard style={{ width: '100%', fontSize: '1.2rem' }}>
                          <CCardBody>
                            <CRow>
                              <div
                                style={{
                                  width: '100%',
                                  height: '50px',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}
                              >
                                <div
                                  style={{
                                    width: '10px',
                                    height: '100%',
                                    backgroundColor: '#d882c0',
                                    borderRadius: '4px',
                                  }}
                                ></div>{' '}
                                {/* 左側粉色 bar */}
                                {/* 左側：日期與標題 */}
                                <div
                                  style={{
                                    display: 'flex',
                                    flex: 1,
                                    marginLeft: '20px',
                                    flexDirection: 'column',
                                  }}
                                >
                                  {/* 日期 */}
                                  <p style={{ color: '#d882c0', fontWeight: 'bold', margin: 0 }}>
                                    2022/03/30
                                  </p>
                                  {/* 標題 */}
                                  <p style={{ fontWeight: 'bold', margin: 0 }}>
                                    臺灣2050淨零排放路徑及策略總說明_環境部
                                  </p>
                                </div>
                                {/* 右側：箭頭按鈕 */}
                                <CButton
                                  style={{
                                    height: '60px',
                                    width: '60px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}
                                >
                                  <CIcon
                                    icon={cilArrowCircleRight}
                                    onClick={carbonfee5}
                                    style={{ width: '55px', height: '55px' }}
                                  />
                                </CButton>
                              </div>
                            </CRow>
                          </CCardBody>
                        </CCard>
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCardBody>
              </CCard>
              <br></br>
            </>
          )}
        </div>
      </CCol>
    </CRow>
  )
}

export default Tabs
