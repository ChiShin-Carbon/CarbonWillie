import React, { useState } from 'react'
import styles from '../../scss/聊天機器人.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot,faLocationArrow } from '@fortawesome/free-solid-svg-icons';


export default function Robot() {

    const [chatVisible, setChatVisible] = useState(true);
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
                            聊天內容
                        </div>
                        <div className={styles.chatFooter}>
                            <form>
                                <input type='text' placeholder='請輸入訊息'/>
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