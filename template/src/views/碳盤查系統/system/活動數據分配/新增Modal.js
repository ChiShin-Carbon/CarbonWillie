// AddModal.js
import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CForm, CRow, CFormLabel, CCol, CFormSelect, CButton } from '@coreui/react';
import styles from '../../../../scss/活動數據盤點.module.css'

const AddModal = forwardRef((props, ref) => {
    // Expose a method to open the modal
    useImperativeHandle(ref, () => ({
        openModal() {
            setAddModalVisible(true);
        },
    }));

    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const [category, setCategory] = useState("1");
    const [emissionSourceOptions, setEmissionSourceOptions] = useState([]);

    const handleCategoryChange = (event) => {
        const selectedCategory = event ? event.target.value : category;

        setCategory(selectedCategory);

        if (selectedCategory === '1') {
            setEmissionSourceOptions([
                { value: '1', label: '公務車' },
                { value: '2', label: '滅火器' },
                { value: '3', label: '工作時數(員工)' },
                { value: '4', label: '工作時數(非員工)' },
                { value: '5', label: '冷媒' },
                { value: '6', label: '廠內機具' },
                { value: '7', label: '緊急發電機' }
            ]);
        } else if (selectedCategory === '2') {
            setEmissionSourceOptions([{ value: '1', label: '電力使用量' }]);
        } else if (selectedCategory === '3') {
            setEmissionSourceOptions([
                { value: '1', label: '員工通勤' },
                { value: '2', label: '商務旅行' },
                { value: '3', label: '營運產生廢棄物' },
                { value: '4', label: '銷售產品的廢棄物' }
            ]);
        }
    };
    useEffect(() => {
        // 初始化時調用 handleCategoryChange
        handleCategoryChange();
    }, []);
    
    // //--------------------------------資料庫----------------------
    // const [users, setUsers] = useState([]);
    // // Function to fetch users from the backend
    // const fetchUsers = async () => {
    //     try {
    //         const response = await fetch('http://localhost:8001/s', {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         });
    //         const data = await response.json();
    //         if (data.users) {
    //             setUsers(data.users);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching users:', error);
    //     }
    // };

    // useEffect(() => {
    //     fetchUsers(); // Fetch users when component mounts
    //     handleCategoryChange(); // Initialize category options
    // }, []);

    
    return (
        <CModal
            backdrop="static"
            visible={isAddModalVisible}
            onClose={() => setAddModalVisible(false)}
            aria-labelledby="StaticBackdropExampleLabel"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel"><b>新增排放源與填寫人</b></CModalTitle>
            </CModalHeader>
            <CModalBody style={{ padding: '10px 50px' }}>
                <CForm >
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="sitename" className={`col-sm-2 col-form-label ${styles.addlabel}`} >排放類別</CFormLabel>
                        <CCol>
                            <CFormSelect aria-label="Default select example" className={styles.addinput} onChange={handleCategoryChange}>
                                <option value="1">範疇一</option>
                                <option value="2">範疇二</option>
                                <option value="3">範疇三</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CFormLabel htmlFor="emissionSource" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
                            排放源
                        </CFormLabel>
                        <CCol>
                            <CFormSelect aria-label="Default select example" className={styles.addinput}>
                                {emissionSourceOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <hr />
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="sitename" className={`col-sm-2 col-form-label ${styles.addlabel}`} >管理部門</CFormLabel>
                        <CCol>
                            <CFormSelect aria-label="Default select example" className={styles.addinput}>
                                <option value="1">無</option>
                                <option value="2">...</option>
                                <option value="3">...</option>
                                <option value="4">...</option>
                                <option value="5">...</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="sitename" className={`col-sm-2 col-form-label ${styles.addlabel}`} >資訊部門</CFormLabel>
                        <CCol>
                            <CFormSelect aria-label="Default select example" className={styles.addinput}>
                                <option value="1">無</option>
                                <option value="2">...</option>
                                <option value="3">...</option>
                                <option value="4">...</option>
                                <option value="5">...</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="sitename" className={`col-sm-2 col-form-label ${styles.addlabel}`} >門診部門</CFormLabel>
                        <CCol>
                            <CFormSelect aria-label="Default select example" className={styles.addinput}>
                                <option value="1">無</option>
                                <option value="2">...</option>
                                <option value="3">...</option>
                                <option value="4">...</option>
                                <option value="5">...</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="sitename" className={`col-sm-2 col-form-label ${styles.addlabel}`} >健檢部門</CFormLabel>
                        <CCol>
                            <CFormSelect aria-label="Default select example" className={styles.addinput}>
                                <option value="1">無</option>
                                <option value="2">...</option>
                                <option value="3">...</option>
                                <option value="4">...</option>
                                <option value="5">...</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="sitename" className={`col-sm-2 col-form-label ${styles.addlabel}`} >檢驗部門</CFormLabel>
                        <CCol>
                            <CFormSelect aria-label="Default select example" className={styles.addinput}>
                                <option value="1">無</option>
                                <option value="2">...</option>
                                <option value="3">...</option>
                                <option value="4">...</option>
                                <option value="5">...</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="sitename" className={`col-sm-2 col-form-label ${styles.addlabel}`} >業務部門</CFormLabel>
                        <CCol>
                            <CFormSelect aria-label="Default select example" className={styles.addinput}>
                                <option value="1">無</option>
                                <option value="2">...</option>
                                <option value="3">...</option>
                                <option value="4">...</option>
                                <option value="5">...</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>

                </CForm>
            </CModalBody>
            <CModalFooter>
                <CButton className="modalbutton1" onClick={() => setAddModalVisible(false)}>
                    取消
                </CButton>
                <CButton className="modalbutton2">新增</CButton>
            </CModalFooter>
        </CModal>
    );
});

export default AddModal;
