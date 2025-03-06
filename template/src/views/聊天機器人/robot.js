import React, { useState, useRef, useEffect } from 'react'
import styles from '../../scss/聊天機器人.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faLocationArrow, faSpinner } from '@fortawesome/free-solid-svg-icons';
import {
    CCard,
    CCardBody,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CListGroup,
    CListGroupItem,
    CCardImage,
} from '@coreui/react';
import 碳盤查範疇 from 'src/assets/images/常見問題-碳盤查範疇.png'
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

// Import ReactMarkdown for rendering markdown content
import ReactMarkdown from 'react-markdown'

export default function Robot() {
    const [chatOpenTime, setChatOpenTime] = useState("");
    const [chatVisible, setChatVisible] = useState(false);
    const [inputMessage, setInputMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([]); // 存儲使用者和機器人的訊息對
    const [isLoading, setIsLoading] = useState(false); // 添加加載狀態

    const chatContentRef = useRef(null);

    const formatTime = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    const chatShow = () => {
        setChatVisible(open => !open);
        if (!chatVisible) {
            const currentTime = formatTime();
            setChatOpenTime(currentTime);
        }
    }

    const handleInputChange = (e) => {
        setInputMessage(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (inputMessage.trim() === "") return;
        const currentTime = formatTime();

        // 添加使用者的訊息到 chatHistory
        setChatHistory(prevHistory => [
            ...prevHistory,
            { sender: 'user', message: inputMessage, time: currentTime }
        ]);

        setInputMessage(""); // 清空輸入框
        setIsLoading(true); // 設置加載狀態為 true

        try {
            const res = await fetch("http://localhost:8000/botapi", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: inputMessage }),
            });

            if (res.ok) {
                const data = await res.json();
                const botResponseTime = formatTime();

                // 添加機器人的回覆到 chatHistory，不需要修改這裡，因為我們會在渲染時處理 Markdown
                setChatHistory(prevHistory => [
                    ...prevHistory,
                    { sender: 'bot', message: data.response, time: botResponseTime }
                ]);
            } else {
                console.error("Failed to submit data", res.statusText);
            }
        } catch (error) {
            console.error("Error submitting data", error);
        } finally {
            setIsLoading(false); // 無論成功或失敗，都將加載狀態設為 false
        }
    }

    const displayContent = (content) => {
        const botResponseTime = formatTime();
        setChatHistory(prevHistory => [
            ...prevHistory,
            { sender: 'bot', message: content, time: botResponseTime }
        ]);
    }
    
    // 將 FAQ 內容轉換為 Markdown 格式的字符串
    const handleFAQClick = (faq) => {
        setIsLoading(true); // 設置 FAQ 點擊也顯示加載狀態
        
        // 模擬延遲以展示加載圖標（可選，實際使用可能不需要）
        setTimeout(() => {
            let content;
            switch (faq) {
                case '碳盤查 vs 碳足跡':
                    content = `
## 碳盤查 vs 碳足跡

### 定義

**碳盤查** 是一種蒐集和計算溫室氣體排放數據的方法。依據：
- 《溫室氣體排放量盤查作業指引》
- 溫室氣體盤查議定書 (GHG Protocol)
- ISO/CNS 14064-1標準

透過蒐集活動數據進行彙整與計算，並檢視和評估營運過程中直接或間接溫室氣體的排放量及其排放源分布對環境之影響，進而識別高排放熱點，制定相應的減排策略，以促進永續發展。

**碳足跡** 是指以二氧化碳當量(CO2e)計量的溫室氣體總排放量，常用於標示個人活動或產品/服務生命週期中的碳排放總量。

### 比較表

| 比較項目 | 碳盤查 | 碳足跡 |\n
| **目的** | 碳排放總量 | 碳排放總量 |\n
| **對象** | 整個企業/組織 | 單一產品/服務 |\n
| **範圍** | 組織邊界內的所有活動 | 產品/服務的生命週期 |\n
| **標準** | ISO 14064, GHG Protocol | ISO 14067, PAS 2050 |\n

### 主要差異

- **碳盤查**：關注於整體組織的排放
- **碳足跡**：關注於特定產品或服務的碳排放
`;
                    break;
                case '碳盤查範疇':
                    content = `
### 碳盤查範疇

參考溫室氣體盤查議定書(GHG Protocol)分類之三個範疇：

**範疇一：直接排放**
因製程或廠房設施直接產生的溫室氣體，主要來自企業自身可控或擁有的排放來源。
例如：燃燒燃料、公務車移動所產生的廢氣。

**範疇二：間接排放**
企業從外部購買能源時，該外部能源的製造過程中所產生的碳排放。
主要來自企業上游供應商，例如：電力、冷氣、蒸汽等。

**範疇三：其他間接排放**
此範疇包含上述兩範疇以外之所有間接排放，包含企業組織的上下游廠商的各種活動。
例如：上游廠商的運輸配送活動、下游廠商為產品加工等。

![碳盤查範疇](${碳盤查範疇})
`;
                    // 注意：圖片在 Markdown 中可能無法直接渲染，我們會在渲染組件中特別處理這個問題
                    break;
                case '碳盤查流程':
                    content = `
## 碳盤查流程

1. **邊界設定**
2. **基準年設定**
3. **排放源鑑別**
4. **排放量計算**
5. **數據品質管理**
6. **文件化與紀錄過程**
`;
                    break;
                case '碳盤查原則':
                    content = `
## 碳盤查原則

| 原則 | 說明 | 應用範例 |
|---|---|---|
| **相關性** | 選擇適合預期使用者需求之溫室氣體源、溫室氣體匯、溫室氣體儲存庫、數據及方法。 | 報告邊界 |
| **完整性** | 納入所有相關的溫室氣體排除與移除。 | 所有排放源 |
| **一致性** | 每年使用一致的資料蒐集方法、量化方法以及管理文件，使溫室氣體相關資訊能有意義的比較。 | 跨年度比較 |
| **透明度** | 揭露充分且適當的溫室氣體相關資訊，使預期使用者做出合理可信之決策。 | 外部查證 |
| **準確性** | 儘可能減少估計與猜測，依據實務減少偏差與不確定性。 | 數據可信度 |
`;
                    break;
                default:
                    content = "請選擇有效的問題。";
            }

            displayContent(content);
            setIsLoading(false); // 設置加載狀態為 false
        }, 500); // 模擬延遲，可以根據實際需求調整或移除
    }

    // 為了處理 Markdown 中的圖片，我們創建一個自定義渲染器
    const MarkdownImage = ({ src, alt }) => {
        // 如果是本地圖片引用，則直接使用 Zoom 組件
        if (src === `${碳盤查範疇}`) {
            return (
                <Zoom>
                    <CCardImage orientation="top" src={碳盤查範疇} alt={alt} />
                </Zoom>
            );
        }
        // 其他圖片正常渲染
        return <img src={src} alt={alt} style={{ maxWidth: '100%' }} />;
    };

    // 在 chatHistory 更新後滾動到最底部
    useEffect(() => {
        if (chatContentRef.current) {
            chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
        }
    }, [chatHistory]);

    // 檢查消息是否是 JSX 元素或 React 組件
    const isReactComponent = (message) => {
        return React.isValidElement(message);
    };

    return (
        <div className={styles.main}>
            {chatVisible ? (
                <div className={styles.chatContainer}>
                    <div className={styles.chatBox}>
                        <div className={styles.chatHeader}>
                            <h6>AI機器人-碳智郎</h6>
                        </div>

                        <div className={styles.chatContent} ref={chatContentRef}>
                            <div className={styles.messageContainer}>
                                <div className={styles.head}><FontAwesomeIcon icon={faRobot} /></div>
                                <div className={styles.message}>碳智郎歡迎您~請問要問什麼呢?</div>
                                <div className={styles.time}>{chatOpenTime}</div>
                            </div>

                            <div className={styles.messageContainer}>
                                <div className={styles.head}><FontAwesomeIcon icon={faRobot} /></div>
                                <div className={styles.message}>
                                    以下是常見問題，也可以輸入訊息獲得回覆
                                    <div className={styles.faq}>
                                        <button onClick={() => handleFAQClick('碳盤查 vs 碳足跡')}>碳盤查 vs 碳足跡</button>
                                        <button onClick={() => handleFAQClick('碳盤查範疇')}>碳盤查範疇</button>
                                        <button onClick={() => handleFAQClick('碳盤查流程')}>碳盤查流程</button>
                                        <button onClick={() => handleFAQClick('碳盤查原則')}>碳盤查原則</button>
                                    </div>
                                </div>
                                <div className={styles.time}>{chatOpenTime}</div>
                            </div>

                            {chatHistory.map((chat, index) => (
                                chat.sender === 'bot' ? (
                                    <div key={index} className={styles.messageContainer}>
                                        <div className={styles.head}><FontAwesomeIcon icon={faRobot} /></div>
                                        <div className={styles.message}>
                                            {isReactComponent(chat.message) ? (
                                                chat.message // 如果是 React 組件或 JSX 元素，直接渲染
                                            ) : (
                                                <ReactMarkdown 
                                                    components={{
                                                        // 自定義組件以處理圖片
                                                        img: MarkdownImage,
                                                        // 確保表格正確渲染
                                                        table: ({node, ...props}) => (
                                                            <CTable bordered borderColor='dark' {...props} />
                                                        ),
                                                        thead: ({node, ...props}) => <CTableHead {...props} />,
                                                        tbody: ({node, ...props}) => <CTableBody {...props} />,
                                                        tr: ({node, ...props}) => <CTableRow {...props} />,
                                                        th: ({node, ...props}) => <CTableHeaderCell scope="col" {...props} />,
                                                        td: ({node, ...props}) => <CTableDataCell {...props} />
                                                    }}
                                                >
                                                    {chat.message}
                                                </ReactMarkdown>
                                            )}
                                        </div>
                                        <div className={styles.time}>{chat.time}</div>
                                    </div>
                                ) : (
                                    <div key={index} className={styles.myMessageContainer}>
                                        <div className={styles.time}>{chat.time}</div>
                                        <div className={styles.myMessage}>{chat.message}</div>
                                    </div>
                                )
                            ))}
                            
                            {/* 添加加載指示器 */}
                            {isLoading && (
                                <div className={styles.messageContainer}>
                                    <div className={styles.head}><FontAwesomeIcon icon={faRobot} /></div>
                                    <div className={styles.message}>
                                        <FontAwesomeIcon icon={faSpinner} spin className={styles.loadingIcon} />
                                        <span className={styles.loadingText}>正在思考中...</span>
                                    </div>
                                    <div className={styles.time}>{formatTime()}</div>
                                </div>
                            )}
                        </div>

                        <div className={styles.chatFooter}>
                            <form>
                                <input
                                    type='text'
                                    placeholder='請輸入訊息'
                                    value={inputMessage}
                                    onChange={handleInputChange}
                                    disabled={isLoading} // 當加載時禁用輸入框
                                />
                                <button 
                                    type='submit' 
                                    onClick={handleSubmit} 
                                    disabled={isLoading} // 當加載時禁用發送按鈕
                                >
                                    <FontAwesomeIcon icon={faLocationArrow} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            ) : null}

            <div className={styles.robotContainer} onClick={chatShow}>
                <div className={styles.robot}>
                    <FontAwesomeIcon icon={faRobot} />
                </div>
            </div>
        </div> 
    )
}