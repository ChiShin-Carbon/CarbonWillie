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
import {poseidon1} from "poseidon-lite";



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
    const [accmessage, setaccMessage] = useState('');
    const [newpassword, setNewPassword] = useState('');
    const [pwmessage, setpwMessage] = useState('');
    const [accountempty, setAccountEmpty] = useState(false);
    const [checkpwempty, setCheckpwEmpty] = useState(false);
    const [originpwempty, setOriginpwEmpty] = useState(false);
    const [newpwempty, setNewpwEmpty] = useState(false);
    const [checknewpwempty, setChecknewpwEmpty] = useState(false);

    const [hash, setHash] = useState("");
    const [hex, setHex] = useState(false);

    function computeHash(password, hex = false) {
        const len = password.length;
    
        // Check if password is empty
        if (len === 0) {
            setHash("");
            return;
        }
    
        // Validate the length of the password
        if (len < 1 || len > 16) {
            setHash("Invalid number of hash elements");
            return;
        }
    
        try {
            // Choose base: 16 for hex, 10 for decimal
            const base = hex ? 16 : 10;
    
            // Convert password to BigInt by converting each character to its ASCII value
            const values = password.split('').map(char => BigInt(char.charCodeAt(0)));
    
            // Compute the hash using Poseidon
            // const result = (poseidon[`poseidon${len}`](values)).toString(base);
    
            // Set the computed hash
            // setHash(result);
        } catch (error) {
            console.error('Error computing hash:', error);
            setHash("Cannot convert characters");
        }
    }
    
    

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

    const setdept = () => {
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

    const setposition = () => {

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

    const editaccount = async (e) => {
        e.preventDefault(); // Prevent form submission

        const isCorrect = await isPasswordCorrect(document.getElementById('checkpw').value);
        const AccnotEmpty = document.getElementById('editaccount').value !== '';
        const CheckpwnotEmpty = document.getElementById('checkpw').value !== '';

        const AccAndPwNotEmpty = AccnotEmpty && CheckpwnotEmpty;

        if (!AccnotEmpty) {
            setAccountEmpty("請輸入帳號");
        }

        if (!CheckpwnotEmpty) {
            setCheckpwEmpty("請輸入密碼");
        }

        if (AccAndPwNotEmpty) {
            if (isCorrect) {
                try {
                    const response = await fetch('http://localhost:8000/editaccount', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            user_id: window.sessionStorage.getItem('user_id'),
                            account: document.getElementById('editaccount').value,
                        }),
                    });

                    if (response.ok) {
                        alert('修改成功');
                        window.location.reload(); // Refresh the page
                        window.sessionStorage.setItem('account', document.getElementById('editaccount').value);
                    } else {
                        console.error('Failed to update account:', response.status);
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        }
    };

    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    function stringToBigInt(str) {
        let concatenatedString = '';

        // Loop through each character of the string
        for (let char of str) {
            // Get the Unicode (or ASCII) value and concatenate it as a string
            concatenatedString += char.charCodeAt(0).toString();
        }
    
        // Convert the concatenated string of numbers to a BigInt
        const bigIntValue = BigInt(concatenatedString);
    
        return bigIntValue;
    }

    const editpassword = async (e) => {
        console.log(document.getElementById('NewPassword').value);
        const hash = computeHash(document.getElementById('NewPassword').value);
        console.log(stringToBigInt(document.getElementById('NewPassword').value))
        console.log(poseidon1([stringToBigInt(document.getElementById('NewPassword').value)]));
        console.log("Computed Hash:", hash);
        e.preventDefault(); // Prevent form submission

        const isCorrect = await isPasswordCorrect(document.getElementById('OriginPassword').value);

        const originnotEmpty = document.getElementById('OriginPassword').value !== '';
        const newpwnotEmpty = document.getElementById('NewPassword').value !== '';
        const checknewpwnotEmpty = document.getElementById('checkNewPassword').value !== '';

        const isNotEmpty = originnotEmpty && newpwnotEmpty && checknewpwnotEmpty;

        if (!originnotEmpty) {
            setOriginpwEmpty('請輸入原密碼');
        }

        if (!newpwnotEmpty) {
            setNewpwEmpty('請輸入新密碼');
        }

        if (!checknewpwnotEmpty) {
            setChecknewpwEmpty('請輸入確認新密碼');
        }

        if (isNotEmpty) {
            if (isCorrect) {
                if (newpassword === document.getElementById('checkNewPassword').value) {
                    try {
                        const HashPassword = poseidon1([stringToBigInt(document.getElementById('NewPassword').value)]);
                        const response = await fetch('http://localhost:8000/editpassword', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                user_id: window.sessionStorage.getItem('user_id'),
                                password: HashPassword.toString(),
                            }),
                        });

                        if (response.ok) {
                            alert('密碼修改成功');
                            window.location.reload(); // Refresh the page
                        }
                    } catch (error) {
                        console.error('Error:', error);
                    }
                } else {
                    setpwMessage('密碼不一致');
                }
            }
            else {
                setpwMessage('原始密碼錯誤');
            }
        }
    };




    const isPasswordCorrect = async (password) => {
        try {
            const pwresponse = await fetch('http://localhost:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: window.sessionStorage.getItem('user_id'),
                    account: window.sessionStorage.getItem('account'),
                    password: password,
                }),
            });

            if (pwresponse.ok) {
                return true;
            } else {
                setaccMessage("密碼錯誤");
                return false;
            }

        } catch (error) {
            console.error('密碼錯誤');
            return false;
        }
    };




    const handle_accsubmit = async (e) => {
        e.preventDefault();
        try {
            const user_id = window.sessionStorage.getItem('user_id');
            const account = document.getElementById('account').value || document.getElementById('account').placeholder;
            const password = document.getElementById('Password').value || document.getElementById('Password').placeholder;



            const response = await fetch('http://localhost:8000/editaccount', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user_id,
                    account: account,
                }),
            });
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
                                        <strong className="customtitlebottom">修改帳號密碼</strong>
                                    </div>


                                    <div className="customCardBody">
                                        <CForm>
                                            <CRow className="mb-3">
                                                <CCol sm={3}></CCol>
                                                <CCol sm={6}>
                                                    <div className="mb-3">
                                                        <CFormLabel htmlFor="account"><strong>修改帳號</strong></CFormLabel>
                                                        <CFormInput
                                                            type="text"
                                                            id="editaccount"
                                                            placeholder={window.sessionStorage.getItem('account')}
                                                        />
                                                        <p style={{ color: 'red' }}>{accountempty}</p>
                                                    </div>
                                                </CCol>
                                                <CCol sm={3}></CCol>
                                            </CRow>
                                            <CRow className="mb-3">
                                                <CCol sm={3}></CCol>

                                                <CCol sm={6}>
                                                    <div className="mb-3">
                                                        <CFormLabel htmlFor="email"><strong>輸入密碼</strong></CFormLabel>
                                                        <CFormInput type="password" id="checkpw" />
                                                        <p style={{ color: 'red' }}>{checkpwempty}</p>
                                                    </div>
                                                </CCol>
                                                <CCol sm={3}></CCol>
                                            </CRow>



                                            <CRow className="mb-3">
                                                <CCol sm={3}></CCol>
                                                <CCol sm={6}>
                                                    <div className="mb-3" align="center">
                                                        <p style={{ color: 'red' }}>{accmessage}</p>
                                                    </div>
                                                </CCol>
                                                <CCol sm={3}></CCol>
                                            </CRow>


                                            <div className="col-auto text-center">
                                                <CButton type="submit" className="mb-3 customButton" onClick={editaccount}>
                                                    保存資料
                                                </CButton>
                                            </div>
                                        </CForm>
                                    </div>

                                    <hr />


                                    <div className="customCardBody">
                                        <CForm>
                                            <CRow className="mb-3">
                                                <CCol sm={3}></CCol>
                                                <CCol sm={6}>
                                                    <div className="mb-3">
                                                        <CFormLabel htmlFor="account"><strong>原本密碼</strong></CFormLabel>
                                                        <CFormInput type="password" id="OriginPassword" />
                                                        <p style={{ color: 'red' }}>{originpwempty}</p>
                                                    </div>
                                                </CCol>
                                                <CCol sm={3}></CCol>
                                            </CRow>
                                            <CRow className="mb-3">
                                                <CCol sm={3}></CCol>

                                                <CCol sm={6}>
                                                    <div className="mb-3">
                                                        <CFormLabel htmlFor="email"><strong>新密碼</strong></CFormLabel>
                                                        <CFormInput type="password" id="NewPassword" onChange={handleNewPasswordChange} />
                                                        <p style={{ color: 'red' }}>{newpwempty}</p>
                                                    </div>
                                                </CCol>
                                                <CCol sm={3}></CCol>
                                            </CRow>
                                            <CRow className="mb-3">
                                                <CCol sm={3}></CCol>
                                                <CCol sm={6}>
                                                    <div className="mb-3">
                                                        <CFormLabel htmlFor="account"><strong>確認新密碼</strong></CFormLabel>
                                                        <CFormInput type="password" id="checkNewPassword" />
                                                        <p style={{ color: 'red' }}>{checknewpwempty}</p>
                                                    </div>
                                                </CCol>
                                                <CCol sm={3}></CCol>
                                            </CRow>


                                            <CRow className="mb-3">
                                                <CCol sm={3}></CCol>
                                                <CCol sm={6}>
                                                    <div className="mb-3" align="center">
                                                        <p style={{ color: 'red' }}>{pwmessage}</p>
                                                    </div>
                                                </CCol>
                                                <CCol sm={3}></CCol>
                                            </CRow>


                                            <div className="col-auto text-center">
                                                <CButton type="submit" className="mb-3 customButton" onClick={editpassword}>
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