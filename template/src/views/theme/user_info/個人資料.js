import {
    CRow,
    CCol,
    CCard,
    CCardBody,
    CCardHeader,
    CTab,
    CTabContent,
    CTabList,
    CTabPanel,
    CTabs,
    CForm,
    CFormLabel,
    CFormInput,
    CButton,
} from '@coreui/react'
import '../../../scss/個人&企業資料.css';
import { useEffect, useState } from 'react';


const Tabs = () => {

    const [account, setAccount] = useState("");
    const [businessID, setBusinessID] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [telephone, setTelephone] = useState("");
    const [phone, setPhone] = useState("");
    const [departmentID, setDepartmentID] = useState("");
    const [department, setDepartment] = useState("");
    const [positionID, setPositionID] = useState("");
    const [position, setPosition] = useState("");


    const getuserinfo = async () => {
        try {
            const response = await fetch('http://localhost:8000/userinfo', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: window.sessionStorage.getItem('user_id'),
                }),
            });
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                console.log(data);
                setAccount(data.user.account);
                setBusinessID(data.user.business_id);
                setName(data.user.username);
                setEmail(data.user.email);
                setTelephone(data.user.telephone);
                setPhone(data.user.phone);
                setDepartmentID(data.user.department);
                setPositionID(data.user.position);
            } else {
                console.log(response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const setdept = (e) => {
        if (departmentID === 1) {
            setDepartment('管理部門');
        } else if (departmentID === 2) {
            setDepartment('資訊部門');
        } else if (departmentID === 3) {
            setDepartment('門診部門');
        } else {
            setDepartment('其他');
        }
    }

    const setposition = (e) => {

        if (positionID === 1) {
            setPosition('主管');
        } else if (positionID === 2) {
            setPosition('副主管');
        } else if (positionID === 3) {
            setPosition('組長');
        } else {
            setPosition('其他');
        }
    }

    const handlesubmit = async (e) => {
        e.preventDefault();
        try {
            const user_id = window.sessionStorage.getItem('user_id');
            const username = document.getElementById('editusername').value || document.getElementById('editusername').placeholder;
            const email = document.getElementById('editemail').value || document.getElementById('editemail').placeholder;
            const telephone = document.getElementById('edittelephone').value || document.getElementById('edittelephone').placeholder;
            const phone = document.getElementById('editphone').value || document.getElementById('editphone').placeholder;

            const response = await fetch('http://localhost:8000/edituserinfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user_id,
                    username: username,
                    email: email,
                    telephone: telephone,
                    phone: phone,
                }),
            });

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                alert('修改成功');
                window.location.reload(); // Refresh the page
            } else {
                console.log(response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };




    useEffect(() => {
        getuserinfo();
    }, []);

    useEffect(() => {
        setdept();
    }
        , [departmentID]);

    useEffect(() => {
        setposition();
    }
        , [positionID]);




    return (
        <CRow>
            <CCol xs={12}>
                <CTabs activeItemKey={1}>
                    <CTabList variant="underline-border" className="custom-tablist">
                        <CTab aria-controls="tab1" itemKey={1} className="custom-tablist-choose">
                            個人資料
                        </CTab>
                        <CTab aria-controls="tab2" itemKey={2} className="custom-tablist-choose" id="editform">
                            修改個人資料
                        </CTab>
                        <CTab aria-controls="tab3" itemKey={3} className="custom-tablist-choose">
                            修改帳號密碼
                        </CTab>
                    </CTabList>
                    <CTabContent>
                        <CTabPanel className="py-3" aria-labelledby="home-tab-pane" itemKey={1}>

                            <CCard className="mb-4 customCard">

                                <CCardBody className="customCard2">
                                    <div className="customCardHeader">
                                        <strong className="customtitlebottom">個人資料</strong>
                                    </div>
                                    <div className="customCardBody">
                                        <CForm>

                                            <CRow className="mb-3">
                                                <CCol sm={5}>
                                                    <div className="mb-3">
                                                        <CFormLabel htmlFor="account"><strong>帳號</strong></CFormLabel>
                                                        <CFormInput type="text" id="account" value={account} disabled readOnly />
                                                    </div>
                                                </CCol>
                                                <CCol sm={2}></CCol>
                                                <CCol sm={5}>
                                                    <div className="mb-3">
                                                        <CFormLabel htmlFor="email"><strong>姓名</strong></CFormLabel>
                                                        <CFormInput type="text" id="name" value={name} disabled readOnly />
                                                    </div>
                                                </CCol>
                                            </CRow>

                                            <CRow className="mb-3">
                                                <CCol sm={5}>
                                                    <div className="mb-3">
                                                        <CFormLabel htmlFor="email"><strong>統編</strong></CFormLabel>
                                                        <CFormInput type="phone" id="phone" value={businessID} disabled readOnly />
                                                    </div>
                                                </CCol>
                                                <CCol sm={2}></CCol>
                                                <CCol sm={5}>
                                                    <div className="mb-3">
                                                        <CFormLabel htmlFor="account"><strong>電子郵件</strong></CFormLabel>
                                                        <CFormInput type="email" id="email" value={email} disabled readOnly />
                                                    </div>
                                                </CCol>
                                            </CRow>

                                            <CRow className="mb-3">
                                                <CCol sm={5}>
                                                    <div className="mb-3">
                                                        <CFormLabel htmlFor="account"><strong>辦公室電話</strong></CFormLabel>
                                                        <CFormInput type="email" id="telephone" value={telephone} disabled readOnly />
                                                    </div>
                                                </CCol>
                                                <CCol sm={2}></CCol>
                                                <CCol sm={5}>
                                                    <div className="mb-3">
                                                        <CFormLabel htmlFor="email"><strong>手機</strong></CFormLabel>
                                                        <CFormInput type="phone" id="name" value={phone} disabled readOnly />
                                                    </div>
                                                </CCol>
                                            </CRow>

                                            <CRow className="mb-3">
                                                <CCol sm={5}>
                                                    <div className="mb-3">
                                                        <CFormLabel htmlFor="account"><strong>所屬部門</strong></CFormLabel>
                                                        <CFormInput type="email" id="email" value={department} disabled readOnly />
                                                    </div>
                                                </CCol>
                                                <CCol sm={2}></CCol>
                                                <CCol sm={5}>
                                                    <div className="mb-3">
                                                        <CFormLabel htmlFor="email"><strong>職位</strong></CFormLabel>
                                                        <CFormInput type="phone" id="name" value={position} disabled readOnly />
                                                    </div>
                                                </CCol>
                                            </CRow>

                                        </CForm>
                                    </div>
                                </CCardBody>
                            </CCard>

                        </CTabPanel>
                        <CTabPanel className="py-3" aria-labelledby="profile-tab-pane" itemKey={2}>

                            <CCard className="mb-4 customCard">

                                <CCardBody className="customCard2">
                                    <div className="customCardHeader">
                                        <strong className="customtitlebottom">修改個人資料</strong>
                                    </div>
                                    <div className="customCardBody">
                                        <CForm>
                                            <CRow className="mb-3">
                                                <CCol sm={5}>
                                                    <div className="mb-3">
                                                        <CFormLabel htmlFor="username"><strong>姓名</strong></CFormLabel>
                                                        <CFormInput type="text" id="editusername" placeholder={name} />
                                                        </div>
                                                </CCol>
                                                <CCol sm={2}></CCol>
                                                <CCol sm={5}>
                                                    <div className="mb-3">
                                                        <CFormLabel htmlFor="email"><strong>電子郵件</strong></CFormLabel>
                                                        <CFormInput type="email" id="editemail" placeholder={email} />
                                                        </div>
                                                </CCol>
                                            </CRow>



                                            <CRow className="mb-3">
                                                <CCol sm={5}>
                                                    <div className="mb-3">
                                                        <CFormLabel htmlFor="telephone"><strong>辦公室電話</strong></CFormLabel>
                                                        <CFormInput type="text" id="edittelephone" placeholder={telephone} />
                                                        </div>
                                                </CCol>
                                                <CCol sm={2}></CCol>
                                                <CCol sm={5}>
                                                    <div className="mb-3">
                                                        <CFormLabel htmlFor="phone"><strong>手機</strong></CFormLabel>
                                                        <CFormInput type="phone" id="editphone" placeholder={phone} />
                                                        </div>
                                                </CCol>
                                            </CRow>
                                            <div className="col-auto text-center">
                                                <CButton type="submit" className="mb-3 customButton" onClick={handlesubmit}>
                                                    保存資料
                                                </CButton>
                                            </div>
                                        </CForm>
                                    </div>
                                </CCardBody>
                            </CCard>
                        </CTabPanel>
                        <CTabPanel className="py-3" aria-labelledby="contact-tab-pane" itemKey={3}>
                            <CCard className="mb-4 customCard">
                                <CCardBody className="customCard2">
                                    <div className="customCardHeader">
                                        <strong className="customtitlebottom">修改密碼</strong>
                                    </div>
                                    <div className="customCardBody">
                                        <CForm>
                                            <CRow className="mb-3">
                                                <CCol sm={3}></CCol>
                                                <CCol sm={6}>
                                                    <div className="mb-3">
                                                        <CFormLabel htmlFor="account"><strong>原本密碼</strong></CFormLabel>
                                                        <CFormInput type="password" id="account" />
                                                    </div>
                                                </CCol>
                                                <CCol sm={3}></CCol>
                                            </CRow>
                                            <CRow className="mb-3">
                                                <CCol sm={3}></CCol>

                                                <CCol sm={6}>
                                                    <div className="mb-3">
                                                        <CFormLabel htmlFor="email"><strong>新密碼</strong></CFormLabel>
                                                        <CFormInput type="password" id="name" />
                                                    </div>
                                                </CCol>
                                                <CCol sm={3}></CCol>
                                            </CRow>
                                            <CRow className="mb-3">
                                                <CCol sm={3}></CCol>
                                                <CCol sm={6}>
                                                    <div className="mb-3">
                                                        <CFormLabel htmlFor="account"><strong>確認新密碼</strong></CFormLabel>
                                                        <CFormInput type="password" id="email" />
                                                    </div>
                                                </CCol>
                                                <CCol sm={3}></CCol>
                                            </CRow>
                                            <div className="col-auto text-center">
                                                <CButton type="submit" className="mb-3 customButton">
                                                    保存資料
                                                </CButton>
                                            </div>
                                        </CForm>
                                    </div>
                                </CCardBody>
                            </CCard>
                        </CTabPanel>
                    </CTabContent>
                </CTabs>
            </CCol>
        </CRow>
    )
}

export default Tabs