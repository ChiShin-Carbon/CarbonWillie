// functions.js
import React, { useState } from 'react'; // 確保引入 useState
import {
    CTable, CTableHead, CTableBody, CFormSelect,
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import styles from '../../../../scss/活動數據盤點.module.css';
import EditModal from './活動數據盤點編輯modal.js';

export const FunctionOne = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const currentFunction = 'one'; // 定義 currentFunction

    return (
        <div>
            <CTable hover className={styles.activityTable1}>
                <CTableHead className={styles.activityTableHead}>
                    <tr>
                        <th>發票/收據日期</th>
                        <th>發票號碼/收據編號</th>
                        <th>單位</th>
                        <th>公升數/金額</th>
                        <th>備註</th>
                        <th>圖片</th>
                        <th>操作</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.activityTableBody}>
                    <tr>
                        <td>2023/01/15</td>
                        <td>XXXXX</td>
                        <td>公升</td>
                        <td>XXXXXX</td>
                        <td>讚</td>
                        <td><img src="https://i.pinimg.com/564x/2a/4c/cb/2a4ccb65cc3cc47bbccca96dd230bd22.jpg" alt="image" /></td>
                        <td>
                            <FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} onClick={() => setEditModalVisible(true)} />
                            <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                        </td>
                    </tr>
                </CTableBody>
            </CTable>
            <EditModal
                isEditModalVisible={isEditModalVisible}
                setEditModalVisible={setEditModalVisible}
                currentFunction={currentFunction}
            />
        </div>
    );
};

export const FunctionTwo = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const currentFunction = 'two'; // 定義 currentFunction

    return (
        <div>
            <CTable hover className={styles.activityTable1}>
                <CTableHead className={styles.activityTableHead}>
                    <tr>
                        <th>發票/收據日期</th>
                        <th>發票號碼/收據編號</th>
                        <th>單位</th>
                        <th>公升數/金額</th>
                        <th>備註</th>
                        <th>圖片</th>
                        <th>操作</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.activityTableBody}>
                    <tr>
                        <td>2023/01/15</td>
                        <td>XXXXX</td>
                        <td>公升</td>
                        <td>XXXXXX</td>
                        <td>讚</td>
                        <td><img src="https://i.pinimg.com/564x/aa/d2/35/aad235f4fa78994b5cc04b34b57d9047.jpg" alt="image" /></td>
                        <td>
                            <FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} onClick={() => setEditModalVisible(true)} />
                            <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                        </td>
                    </tr>
                </CTableBody>
            </CTable>
            <EditModal
                isEditModalVisible={isEditModalVisible}
                setEditModalVisible={setEditModalVisible}
                currentFunction={currentFunction}
            />
        </div>
    );
};


export const FunctionThree = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const currentFunction = 'three'; // 定義 currentFunction

    return (
        <div>
            <CTable hover className={styles.activityTable1}>
                <CTableHead className={styles.activityTableHead}>
                    <tr>
                        <th>品名</th>
                        <th>成分</th>
                        <th>規格(重量)</th>
                        <th>使用量(支)</th>
                        <th>備註</th>
                        <th>圖片</th>
                        <th>操作</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.activityTableBody}>
                    <tr>
                        <td>XXXXX</td>
                        <td>CO2</td>
                        <td>XXX</td>
                        <td>5</td>
                        <td>讚</td>
                        <td><img src="https://i.pinimg.com/564x/35/a9/aa/35a9aa483e73b94c8b8605ed9107a381.jpg" alt="image" /></td>
                        <td>
                            <FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} onClick={() => setEditModalVisible(true)} />
                            <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                        </td>
                    </tr>
                </CTableBody>
            </CTable>
            <EditModal
                isEditModalVisible={isEditModalVisible}
                setEditModalVisible={setEditModalVisible}
                currentFunction={currentFunction}
            />
        </div>
    );
};


export const FunctionFour = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const currentFunction = 'four'; // 定義 currentFunction

    return (
        <div>
            <CTable hover className={styles.activityTable1}>
                <CTableHead className={styles.activityTableHead}>
                    <tr>
                        <th>月份</th>
                        <th>員工數</th>
                        <th>每日工時</th>
                        <th>每月工作日數</th>
                        <th>總加班時數</th>
                        <th>總病假時數</th>
                        <th>總事假時數</th>
                        <th>總出差時數</th>
                        <th>總婚喪時數</th>
                        <th>總特休時數</th>
                        <th>備註</th>
                        <th>圖片</th>
                        <th>操作</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.activityTableBody}>
                    <tr>
                        <td>一月</td>
                        <td>24</td>
                        <td>8</td>
                        <td>22</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>讚</td>
                        <td><img src="https://i.pinimg.com/564x/35/a9/aa/35a9aa483e73b94c8b8605ed9107a381.jpg" alt="image" /></td>
                        <td>
                            <FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} onClick={() => setEditModalVisible(true)} />
                            <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                        </td>
                    </tr>
                </CTableBody>
            </CTable>
            <EditModal
                isEditModalVisible={isEditModalVisible}
                setEditModalVisible={setEditModalVisible}
                currentFunction={currentFunction}
            />
        </div>
    );
};

export const FunctionFive = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const currentFunction = 'five'; // 定義 currentFunction

    return (
        <div>
            <CTable hover className={styles.activityTable1}>
                <CTableHead className={styles.activityTableHead}>
                    <tr>
                        <th>月份</th>
                        <th>人數</th>
                        <th>總工作時數</th>
                        <th>總工作人天</th>
                        <th>備註</th>
                        <th>圖片</th>
                        <th>操作</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.activityTableBody}>
                    <tr>
                        <td>一月</td>
                        <td>24</td>
                        <td>8</td>
                        <td>22</td>
                        <td>讚</td>
                        <td><img src="https://i.pinimg.com/736x/5d/a8/60/5da8608aab2a2ebb0bb9e56ee9401414.jpg" alt="image" /></td>
                        <td>
                            <FontAwesomeIcon icon={faPenToSquare} className={styles.iconPen} onClick={() => setEditModalVisible(true)} />
                            <FontAwesomeIcon icon={faTrashCan} className={styles.iconTrash} />
                        </td>
                    </tr>
                </CTableBody>
            </CTable>
            <EditModal
                isEditModalVisible={isEditModalVisible}
                setEditModalVisible={setEditModalVisible}
                currentFunction={currentFunction}
            />
        </div>
    );
};
export const FunctionSix = () => (
    <div>
        <h2>這是功能6的內容</h2>
    </div>
);
export const FunctionSeven = () => (
    <div>
        <h2>這是功能7的內容</h2>
    </div>
);
export const FunctionEight = () => (
    <div>
        <h2>這是功能8的內容</h2>
    </div>
);
export const FunctionNine = () => (
    <div>
        <h2>這是功能9的內容</h2>
    </div>
);
export const FunctionTen = () => (
    <div>
        <h2>這是功能10的內容</h2>
    </div>
);
export const FunctionEleven = () => (
    <div>
        <h2>這是功能11的內容</h2>
    </div>
);

export const FunctionTwelve = () => (
    <div>
        <h2>這是功能12的內容</h2>
    </div>
);

export const FunctionThirteen = () => (
    <div>
        <h2>這是功能13的內容</h2>
    </div>
);
export const FunctionForteen = () => (
    <div>
        <h2>這是功能14的內容</h2>
    </div>
);
export const FunctionFifteen = () => (
    <div>
        <h2>這是功能15的內容</h2>
    </div>
);
export const FunctionSixteen = () => (
    <div>
        <h2>這是功能16的內容</h2>
    </div>
);
export const FunctionSeventeen = () => (
    <div>
        <h2>這是功能17的內容</h2>
    </div>
);

