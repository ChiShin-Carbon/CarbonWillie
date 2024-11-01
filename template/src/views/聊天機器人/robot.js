import React, { useState, useRef, useEffect } from 'react'
import styles from '../../scss/聊天機器人.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faLocationArrow } from '@fortawesome/free-solid-svg-icons';
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

export default function Robot() {
    const [chatOpenTime, setChatOpenTime] = useState("");
    const [chatVisible, setChatVisible] = useState(false);
    const [inputMessage, setInputMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([]); // 存儲使用者和機器人的訊息對

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

                // 添加機器人的回覆到 chatHistory
                setChatHistory(prevHistory => [
                    ...prevHistory,
                    { sender: 'bot', message: data.response, time: botResponseTime }
                ]);
            } else {
                console.error("Failed to submit data", res.statusText);
            }
        } catch (error) {
            console.error("Error submitting data", error);
        }
    }

    const displayContent = (content) => {
        const botResponseTime = formatTime();
        setChatHistory(prevHistory => [
            ...prevHistory,
            { sender: 'bot', message: content, time: botResponseTime }
        ]);
    }
    const handleFAQClick = (faq) => {
        let content;
        switch (faq) {
            case '碳盤查 vs 碳足跡':
                content = (
                    <div>
                        <h4>碳盤查 vs 碳足跡</h4>
                        碳盤查是一種蒐集和計算溫室氣體排放數據的方法。依據《溫室氣體排放量盤查作業指引》、溫室氣體盤查議定書(GHG Protocol)以及ISO/CNS 14064-1標準執行。透過蒐集活動數據進行彙整與計算，並檢視和評估營運過程中直接或間接溫室氣體的排放量及其排放源分布對環境之影響，進而識別高排放熱點，制定相應的減排策略，以促進永續發展。
                        <br />
                        碳足跡是指以二氧化碳當量(CO2e)計量的溫室氣體總排放量，常用於標示個人活動或產品/服務生命週期中的碳排放總量。
                        <CTable bordered borderColor='dark'>
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
                    </div>
                );
                break;
            case '碳盤查範疇':
                content = (
                    <div>
                        <h4>碳盤查範疇</h4>
                        參考溫室氣體盤查議定書(GHG Protocol)分類之三個範疇：
                        <br />
                        ●範疇一：直接排放<br />
                        因製程或廠房設施直接產生的溫室氣體，主要來自企業自身可控或擁有的排放來源。<br />
                        例如：燃燒燃料、 公務車移動所產生的廢氣。<br />
                        ●範疇二：間接排放<br />
                        企業從外部購買能源時，該外部能源的製造過程中所產生的碳排放。<br />
                        主要來自企業上游供應商，例如： 電力、冷氣、蒸汽等。<br />
                        ●範疇三：其他間接排放<br />
                        此範疇包含上述兩範疇以外之所有間接排放，包含企業組織的上下游廠商的各種活動。
                        例如：上游廠商的運輸配送活動、下游廠商為產品加工等。
                        <Zoom><CCardImage orientation="top" src={碳盤查範疇} /></Zoom>
                    </div>
                );
                break;
            case '碳盤查流程':
                content = (
                    <div>
                        <h4>碳盤查流程</h4>
                        <div>
                            <CCard className="mb-4 customCard" style={{ borderColor: 'black' }}>
                                <CCardBody >
                                    一、邊界設定
                                </CCardBody>
                            </CCard>
                            <CIcon icon={icon.cilArrowThickBottom} size="xxl" />
                            <CCard className="mb-4 customCard" style={{ borderColor: 'black' }}>
                                <CCardBody >
                                    二、基準年設定
                                </CCardBody>
                            </CCard>
                            <CIcon icon={icon.cilArrowThickBottom} size="xxl" />
                            <CCard className="mb-4 customCard" style={{ borderColor: 'black' }}>
                                <CCardBody >
                                    三、排放源鑑別
                                </CCardBody>
                            </CCard>
                            <CIcon icon={icon.cilArrowThickBottom} size="xxl" />
                            <CCard className="mb-4 customCard" style={{ borderColor: 'black' }}>
                                <CCardBody >
                                    四、排放量計算
                                </CCardBody>
                            </CCard>
                            <CIcon icon={icon.cilArrowThickBottom} size="xxl" />
                            <CCard className="mb-4 customCard" style={{ borderColor: 'black' }}>
                                <CCardBody >
                                    五、數據品質管理
                                </CCardBody>
                            </CCard>
                            <CIcon icon={icon.cilArrowThickBottom} size="xxl" />
                            <CCard className="mb-4 customCard" style={{ borderColor: 'black' }}>
                                <CCardBody >
                                    六、文件化與紀錄過程
                                </CCardBody>
                            </CCard>
                        </div>
                    </div>
                );
                break;
            case '碳盤查原則':
                content = (
                    <div>
                        <h4>碳盤查原則</h4>
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
                    </div>
                );
                break;
            default:
                content = <p>請選擇有效的問題。</p>;
        }

        displayContent(content);
    }


    // 在 chatHistory 更新後滾動到最底部
    useEffect(() => {
        if (chatContentRef.current) {
            chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
        }
    }, [chatHistory]);

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
                                        <div className={styles.message}>{chat.message}</div>
                                        <div className={styles.time}>{chat.time}</div>
                                    </div>
                                ) : (
                                    <div key={index} className={styles.myMessageContainer}>
                                        <div className={styles.time}>{chat.time}</div>
                                        <div className={styles.myMessage}>{chat.message}</div>
                                    </div>
                                )
                            ))}
                        </div>

                        <div className={styles.chatFooter}>
                            <form>
                                <input
                                    type='text'
                                    placeholder='請輸入訊息'
                                    value={inputMessage}
                                    onChange={handleInputChange}
                                />
                                <button type='submit' onClick={handleSubmit}>
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
