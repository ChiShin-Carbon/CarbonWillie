import React from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
  cilAccountLogout,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import styles from '/src/scss/雜區.module.css'

import profile from './../../assets/images/avatars/profile.jpg'

import { useEffect, useState } from 'react'

const AppHeaderDropdown = () => {
  const [org_name, setOrgName] = useState('')
  const [name, setName] = useState('')
  const [departmentID, setDepartmentID] = useState('')
  const [department, setDepartment] = useState('')
  const [positionID, setPositionID] = useState('')
  const [position, setPosition] = useState('')
  const [role, setRole] = useState(false)

  const getcompanyinfo = async () => {
    try {
      const response = await fetch('http://localhost:8000/companyinfo', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ business_id: '00993654' }),
      })
      const data = await response.json()
      console.log(data)
      if (response.ok) {
        console.log(data)
        setOrgName(data.company.org_name)
      } else {
        console.log(response.status)
      }
    } catch (error) {
      console.error('Error:', error)
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
      })
      const data = await response.json()
      console.log(data)
      if (response.ok) {
        console.log(data)
        setName(data.user.username)
        setDepartmentID(data.user.department)
        setPositionID(data.user.position)
        setRole(data.user.role)
      } else {
        console.log(response.status)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleLogout = () => {
    try {
      // Clear all possible storage types
      // Session storage
      window.sessionStorage.clear();
      
      // Local storage (in case you store anything there)
      window.localStorage.clear();
      
      // Clear cookies (for cookie-based authentication)
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      });
      
      // If you're using JWT tokens or other auth mechanisms stored elsewhere, clear those too
      
      // Force redirect to login page
      window.location.replace('/#/Login');
      
      // In case the redirect doesn't work for some reason, force a full page reload
      setTimeout(() => {
        window.location.href = '/#/Login';
        window.location.reload(true); // true forces reload from server, not cache
      }, 100);
      
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again or close your browser.");
      
      // Last resort - try simple redirect
      window.location.href = '/#/Login';
    }
  };

  const setdept = () => {
    if (departmentID === 1) {
      setDepartment('管理部門')
    } else if (departmentID === 2) {
      setDepartment('資訊部門')
    } else if (departmentID === 3) {
      setDepartment('業務部門')
    } else if (departmentID === 4) {
      setDepartment('門診部門')
    } else if (departmentID === 5) {
      setDepartment('健檢部門')
    } else if (departmentID === 6) {
      setDepartment('檢驗部門')
    } else {
      setDepartment('其他')
    }
  }

  const setposition = () => {
    if (positionID === 1) {
      setPosition('總經理')
    } else if (positionID === 2) {
      setPosition('副總經理')
    } else if (positionID === 3) {
      setPosition('主管')
    } else if (positionID === 4) {
      setPosition('副主管')
    } else if (positionID === 5) {
      setPosition('組長')
    } else {
      setPosition('其他')
    }
  }

  useEffect(() => {
    getcompanyinfo()
    getuserinfo()
  }, [])

  useEffect(() => {
    setdept()
  }, [departmentID])

  useEffect(() => {
    setposition()
  }, [positionID])

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={profile} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
        <div className={styles.profile}>
          {role == 0 ? (
            <div>管理員</div>
          ) : role == 1 ? (
            <div>顧問</div>
          ) : (
            <>
              <div>{org_name}</div>
              <div>{department}</div>
              <div>{position}</div>
            </>
          )}
          <div>{name}</div>
        </div>


        {/* <CDropdownItem href="#">
          <CIcon icon={cilBell} className="me-2" />
          Updates
          <CBadge color="info" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilEnvelopeOpen} className="me-2" />
          Messages
          <CBadge color="success" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilTask} className="me-2" />
          Tasks
          <CBadge color="danger" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilCommentSquare} className="me-2" />
          Comments
          <CBadge color="warning" className="ms-2">
            42
          </CBadge>
        </CDropdownItem> */}

        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>

        <CDropdownItem href="/#/theme/user_info">
          <CIcon icon={cilUser} className="me-2" />
          個人檔案
        </CDropdownItem>
        {/* <CDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilCreditCard} className="me-2" />
          Payments
          <CBadge color="secondary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilFile} className="me-2" />
          Projects
          <CBadge color="primary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem> */}
        <CDropdownDivider />
        <CDropdownItem href="#" onClick={handleLogout}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          登出
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
