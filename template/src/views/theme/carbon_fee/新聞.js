import React, { useState, useEffect } from 'react'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardTitle,
  CButton,  
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilMenu,
  cilSearch,
  cilArrowCircleRight,
} from '@coreui/icons'

import styles from '../../../scss/盤查結果查詢.module.css'

const 新聞 = () => {
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
        // 格式化日期為 'YYYY-MM-DD' 格式
        const formattedDate = new Date(newsData.news_date).toISOString().split('T')[0]; // 這樣會得到 '2024-12-31' 格式的日期

        // 更新 newsData 以包含格式化後的日期
        const updatedNewsData = { ...newsData, news_date: formattedDate };

        // 儲存到資料庫
        const response = await fetch("http://127.0.0.1:8000/news", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedNewsData),
        });

        if (!response.ok) {
            throw new Error("Failed to save news to the database: " + response.statusText);
        }

        console.log("News saved successfully.", updatedNewsData);
    } catch (error) {
        console.error("Error saving news:", error);
    }
};

  return (
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
                .sort((a, b) => {
                    const dateA = new Date(a.news_date);
                    const dateB = new Date(b.news_date);
                    return dateB - dateA; // 從新到舊排序
                })
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
  );
};

export default 新聞;
