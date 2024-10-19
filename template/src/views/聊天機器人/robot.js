import React, { useState, useRef, useEffect } from 'react'
import styles from '../../scss/聊天機器人.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import OpenAI from "openai";


export default function Robot() {
    const [chatOpenTime, setChatOpenTime] = useState(""); // 存儲打開聊天的時間
    const [messageTimes, setMessageTimes] = useState([]); // 存儲每條訊息的時間
    const [chatVisible, setChatVisible] = useState(true);
    const [inputMessage, setInputMessage] = useState(""); 
    const [messages, setMessages] = useState([]); 
    const chatContentRef = useRef(null); // 聊天内容的引用
    const [botText, setbotText] = useState(""); 

    const formatTime = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0'); // 24小時制
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    const handlemessage = async (e) => {

      };
      

    const chatShow = () => {
        setChatVisible(open => !open);
        if (!chatVisible) {
            const currentTime = formatTime();
            setChatOpenTime(currentTime);
        }
    }

    const handleInputChange = (e) => {
        setInputMessage(e.target.value); // 更新輸入框的內容
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); // 防止表單提交刷新頁面
        if (inputMessage.trim() === "") return; // 如果訊息為空則不處理
        const currentTime = formatTime();
        setMessages(prevMessages => [...prevMessages, inputMessage]); // 將新訊息加入訊息陣列
        setMessageTimes(prevTimes => [...prevTimes, currentTime]); // 新訊息的時間
        setInputMessage(""); // 清空輸入框


        e.preventDefault();
      
        try {
          const messageContent = document.getElementById("message").value; // Get the message value
      
          // Make sure you're sending the correct data format to your backend
          const res = await fetch("http://localhost:8000/botapi", {
            method: "POST",
            headers: {
              "Content-Type": "application/json", // Set the content type
            },
            body: JSON.stringify({ message: messageContent }), // Send the message in the request body
          });
      
          if (res.ok) {
            const data = await res.json();
            setbotText(data.response); // Set the response text in state
            console.log("Data submitted successfully:", data.response);
          } else {
            console.error("Failed to submit data", res.statusText);
          }
        } catch (error) {
          console.error("Error submitting data", error);
        }
    }

    // 使用 useEffect 在 messages 更新後滾動到最底部
    useEffect(() => {
        if (chatContentRef.current) {
            chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight; // 滾動到最底部
        }
    }, [messages]); // 當 messages 更新時觸發

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
                                    以下是常見問題，也可以輸入訊息獲得回覆輸入訊息哈裸你好可以輸入訊息哈裸你好可以輸入訊息哈裸你好可以輸入訊息哈
                                    <div className={styles.faq}>
                                        <button>碳盤查 vs 碳足跡</button>
                                        <button>碳盤查範疇</button>
                                        <button>碳盤查流程</button>
                                        <button>碳盤查原則</button>
                                    </div>
                                </div>
                                <div className={styles.time}>{chatOpenTime}</div>
                            </div>

                            {messages.map((message, index) => (
                                <div key={index} className={styles.myMessageContainer}>
                                    <div className={styles.time}>{messageTimes[index]}</div>
                                    <div className={styles.myMessage}>
                                        {message}
                                    </div>
                                </div>
                            ))}

                        </div>

                        <div className={styles.botMessageContainer}>
                            <div className={styles.botMessage}>
                                {botText}
                            </div>
                        </div>


                        <div className={styles.chatFooter}>
                            <form>
                                 <input 
                                    type='text' 
                                    placeholder='請輸入訊息' 
                                    id="message"
                                    value={inputMessage} // 綁定輸入框的值
                                    onChange={handleInputChange} // 監聽輸入框的變化
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
