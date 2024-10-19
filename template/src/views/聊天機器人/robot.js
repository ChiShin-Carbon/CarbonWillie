import React, { useState } from 'react'
import styles from '../../scss/聊天機器人.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faLocationArrow } from '@fortawesome/free-solid-svg-icons';


export default function Robot() {

    const [chatVisible, setChatVisible] = useState(false);
    const chatShow = () => {
        setChatVisible(open => !open);
    }

    return (
        <div className={styles.main}>
            {chatVisible ? (
                <div className={styles.chatContainer}>
                    <div className={styles.chatBox}>
                        <div className={styles.chatHeader}>
                            <h6>AI機器人-碳智郎</h6>
                        </div>


                        <div className={styles.chatContent}>
                            <div className={styles.messageContainer}>
                                <div className={styles.head}><FontAwesomeIcon icon={faRobot} /></div>
                                <div className={styles.message}>碳智郎歡迎您~請問要問什麼呢?</div>
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
                            </div>
                        </div>


                        <div className={styles.chatFooter}>
                            <form>
                                <input type='text' placeholder='請輸入訊息' />
                                <button type='submit'><FontAwesomeIcon icon={faLocationArrow} /></button>
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