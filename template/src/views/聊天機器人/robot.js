import React, { useState, useRef, useEffect } from 'react'
import styles from '../../scss/聊天機器人.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faLocationArrow } from '@fortawesome/free-solid-svg-icons';

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
                                        <button>碳盤查 vs 碳足跡</button>
                                        <button>碳盤查範疇</button>
                                        <button>碳盤查流程</button>
                                        <button>碳盤查原則</button>
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
