// functions.js
import React, { useState } from 'react'; // 確保引入 useState
import {
    CTable, CTableHead, CTableBody, CFormSelect,
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import styles from '../../../../scss/活動數據盤點.module.css';
import EditModal from './活動數據盤點編輯modal.js';


import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

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
                        <th>油種</th>
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
                        <td>柴油</td>
                        <td>公升</td>
                        <td>XXXXXX</td>
                        <td>讚</td>
                        <td><Zoom><img src="https://i.pinimg.com/564x/2a/4c/cb/2a4ccb65cc3cc47bbccca96dd230bd22.jpg" alt="image" /></Zoom></td>
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
                        <td><Zoom><img src="https://i.pinimg.com/564x/aa/d2/35/aad235f4fa78994b5cc04b34b57d9047.jpg" alt="image" /></Zoom></td>
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
                        <td><Zoom><img src="https://i.pinimg.com/564x/35/a9/aa/35a9aa483e73b94c8b8605ed9107a381.jpg" alt="image" /></Zoom></td>
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
                        <td><Zoom><img src="https://i.pinimg.com/564x/35/a9/aa/35a9aa483e73b94c8b8605ed9107a381.jpg" alt="image" /></Zoom></td>
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
            <CTable hover className={styles.activityTableShort}>
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
                        <td><Zoom><img src="https://i.pinimg.com/736x/5d/a8/60/5da8608aab2a2ebb0bb9e56ee9401414.jpg" alt="image" /></Zoom></td>
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

export const FunctionSix = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const currentFunction = 'six'; // 定義 currentFunction

    return (
        <div>
            <CTable hover className={styles.activityTable1}>
                <CTableHead className={styles.activityTableHead}>
                    <tr>
                        <th>設備類型</th>
                        <th>設備位置</th>
                        <th>冷媒類型</th>
                        <th>填充量(公克)</th>
                        <th>數量</th>
                        <th>逸散率</th>
                        <th>備註</th>
                        <th>圖片</th>
                        <th>操作</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.activityTableBody}>
                    <tr>
                        <td>冰箱</td>
                        <td>XXX</td>
                        <td>R11</td>
                        <td>XXX</td>
                        <td>X</td>
                        <td>X</td>
                        <td>讚</td>
                        <td><Zoom><img src="https://i.pinimg.com/736x/c9/be/70/c9be70ef20f18513f025856d69034dcb.jpg" alt="image" /></Zoom></td>
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

export const FunctionSeven = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const currentFunction = 'seven'; // 定義 currentFunction

    return (
        <div>
            <CTable hover className={styles.activityTableShort}>
                <CTableHead className={styles.activityTableHead}>
                    <tr>
                        <th>設備類型</th>
                        <th>能源類型</th>
                        <th>時期</th>
                        <th>使用量(公克)</th>
                        <th>備註</th>
                        <th>圖片</th>
                        <th>操作</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.activityTableBody}>
                    <tr>
                        <td>XXX</td>
                        <td>柴油</td>
                        <td>1月</td>
                        <td>XXX</td>
                        <td>讚</td>
                        <td><Zoom><img src="https://i.pinimg.com/564x/8b/7d/0c/8b7d0c88227abf5a237870b047677b4b.jpg" alt="image" /></Zoom></td>
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

export const FunctionEight = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const currentFunction = 'eight'; // 定義 currentFunction

    return (
        <div>
            <CTable hover className={styles.activityTableShort}>
                <CTableHead className={styles.activityTableHead}>
                    <tr>
                        <th>日期</th>
                        <th>使用原料</th>
                        <th>使用量(公克)</th>
                        <th>備註</th>
                        <th>圖片</th>
                        <th>操作</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.activityTableBody}>
                    <tr>
                        <td>2024/07/08</td>
                        <td>天然氣</td>
                        <td>XXX</td>
                        <td>讚</td>
                        <td><Zoom><img src="https://i.pinimg.com/564x/e7/c8/4a/e7c84a29e5b0d84c8230ea5fd487495b.jpg" alt="image" /></Zoom></td>
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

export const FunctionNine = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const currentFunction = 'nine'; // 定義 currentFunction

    return (
        <div>
            <CTable hover className={styles.activityTable1}>
                <CTableHead className={styles.activityTableHead}>
                    <tr>
                        <th>設備位置 </th>
                        <th>能源類型</th>
                        <th>月份</th>
                        <th>使用量</th>
                        <th>備註</th>
                        <th>圖片</th>
                        <th>操作</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.activityTableBody}>
                    <tr>
                        <td>XXX</td>
                        <td>柴油</td>
                        <td>1月</td>
                        <td>XXX</td>
                        <td>讚</td>
                        <td><Zoom><img src="https://i.pinimg.com/564x/9c/30/c7/9c30c7c2e3d7b90544f4b3e3f59e3ca0.jpg" alt="image" /></Zoom></td>
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

export const FunctionTen = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const currentFunction = 'ten'; // 定義 currentFunction

    return (
        <div>
            <CTable hover className={styles.activityTableShort}>
                <CTableHead className={styles.activityTableHead}>
                    <tr>
                        <th>發票/收據日期</th>
                        <th>發票號碼/收據編號</th>
                        <th>使用量(公升)</th>
                        <th>備註</th>
                        <th>圖片</th>
                        <th>操作</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.activityTableBody}>
                    <tr>
                        <td>2023/01/15</td>
                        <td>XXXXX</td>
                        <td>XXX</td>
                        <td>讚</td>
                        <td><Zoom><img src="https://i.pinimg.com/564x/d3/40/13/d340135e73f8ffcc48667c3063fb9f25.jpg" alt="image" /></Zoom></td>
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

export const FunctionEleven = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const currentFunction = 'eleven'; // 定義 currentFunction

    return (
        <div>
            <CTable hover className={styles.activityTable1}>
                <CTableHead className={styles.activityTableHead}>
                    <tr>
                        <th>進貨日期</th>
                        <th>供應商</th>
                        <th>品名/型號/規格</th>
                        <th>含碳率C%</th>
                        <th>公斤/盒</th>
                        <th>數量(盒)</th>
                        <th>備註</th>
                        <th>圖片</th>
                        <th>操作</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.activityTableBody}>
                    <tr>
                        <td>2023/01/15</td>
                        <td>XXXXX</td>
                        <td>XXXXX</td>
                        <td>X</td>
                        <td>X</td>
                        <td>X</td>
                        <td>讚</td>
                        <td><Zoom><img src="https://i.pinimg.com/736x/cd/fb/de/cdfbde16d8860668c51c5a5e3b0ce482.jpg" alt="image" /></Zoom></td>
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

export const FunctionTwelve = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const currentFunction = 'twelve'; // 定義 currentFunction

    return (
        <div>
            <CTable hover className={styles.activityTableShort}>
                <CTableHead className={styles.activityTableHead}>
                    <tr>
                        <th>品名</th>
                        <th>填充日期</th>
                        <th>填充量(公克)</th>
                        <th>備註</th>
                        <th>圖片</th>
                        <th>操作</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.activityTableBody}>
                    <tr>
                        <td>XXXXX</td>
                        <td>2023/01/15</td>
                        <td>X</td>
                        <td>讚</td>
                        <td><Zoom><img src="https://i.pinimg.com/564x/5a/7a/d6/5a7ad69d72d35dd45659fbf04bd96217.jpg" alt="image" /></Zoom></td>
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

export const FunctionThirteen = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const currentFunction = 'thirteen'; // 定義 currentFunction

    return (
        <div>
            其他
        </div>
    );
};

export const FunctionForteen = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const currentFunction = 'forteen'; // 定義 currentFunction

    return (
        <div>
            <CTable hover className={styles.activityTableLong}>
                <CTableHead className={styles.activityTableHead}>
                    <tr>
                        <th>收據月份</th>
                        <th>用電期間(起)</th>
                        <th>用電期間(迄)</th>
                        <th>填寫類型</th>
                        <th>尖峰度數</th>
                        <th>半尖峰度數</th>
                        <th>週六半尖峰度數</th>
                        <th>離峰度數</th>
                        <th>當月總用電量/總金額</th>
                        <th>備註</th>
                        <th>圖片</th>
                        <th>操作</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.activityTableBody}>
                    <tr>
                        <td>1月</td>
                        <td>2024/01/12</td>
                        <td>2024/02/12</td>
                        <td>用電度數</td>
                        <td>20600</td>
                        <td>20600</td>
                        <td>20600</td>
                        <td>20600</td>
                        <td>20600</td>
                        <td>讚</td>
                        <td><Zoom><img src="https://i.pinimg.com/564x/6a/e2/41/6ae2418f5b68d216f68e7ed2ab349e0c.jpg" alt="image" /></Zoom></td>
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

export const FunctionFifteen = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const currentFunction = 'fifteen'; // 定義 currentFunction

    return (
        <div>
            <CTable hover className={styles.activityTable1}>
                <CTableHead className={styles.activityTableHead}>
                    <tr>
                        <th>主要燃料</th>
                        <th>間接蒸氣購買量</th>
                        <th>蒸氣供應商名稱</th>
                        <th>蒸氣排放係數</th>
                        <th>月份</th>
                        <th>單位</th>
                        <th>備註</th>
                        <th>圖片</th>
                        <th>操作</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.activityTableBody}>
                    <tr>
                        <td>XXXXX</td>
                        <td>XXX</td>
                        <td>XXXXX</td>
                        <td>XXX</td>
                        <td>1月</td>
                        <td>kg CO2e/kg蒸氣</td>
                        <td>讚</td>
                        <td><Zoom><img src="https://i.pinimg.com/564x/f3/d9/27/f3d92764f7e4d8ab25835b39f20e2e0f.jpg" alt="image" /></Zoom></td>
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

export const FunctionSixteen = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const currentFunction = 'sixteen'; // 定義 currentFunction

    return (
        <div>
            <CTable hover className={styles.activityTableShort}>
                <CTableHead className={styles.activityTableHead}>
                    <tr>
                        <th>原物料名稱</th>
                        <th>使用量</th>
                        <th>備註</th>
                        <th>圖片</th>
                        <th>操作</th>
                    </tr>
                </CTableHead>
                <CTableBody className={styles.activityTableBody}>
                    <tr>
                        <td>XXXXX</td>
                        <td>XXX</td>
                        <td>讚</td>
                        <td><Zoom><img src="https://i.pinimg.com/564x/37/80/8a/37808aacec53abf11e28412f452ffb20.jpg" alt="image" /></Zoom></td>
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

export const FunctionSeventeen = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const currentFunction = 'seventeen'; // 定義 currentFunction

    return (
        <div>
            其他
        </div>
    );
};

