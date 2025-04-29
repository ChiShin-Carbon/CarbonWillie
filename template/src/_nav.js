import React, { useState, useEffect } from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilBuilding,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilFile,
  cilGroup,
  cilHappy,
  cilHome,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSatelite,
  cilSearch,
  cilSpeedometer,
  cilStar,
  cilUser,
  cilCash,
  cilStorage,
  cilHandshake,
  cilList,
  cilBook,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

// Fixed component that checks baseline status and uses React Router navigation
const CarbonInventoryNavItem = (props) => {
  const [targetPath, setTargetPath] = useState('/碳盤查系統/system/');
  const navigate = useNavigate();
  
  // Function to determine the correct path
  const checkBaselineStatus = () => {
    axios.get('http://localhost:8000/baseline')
      .then(response => {
        console.log("API Response:", response.data);
        
        if (response.data && 
            response.data.baseline && 
            response.data.baseline.is_completed === 0) {
          // If is_completed is 0, set path to settings page
          setTargetPath('/碳盤查系統/system/基準年設定');
        } else {
          // Otherwise set path to main page
          setTargetPath('/碳盤查系統/system/');
        }
      })
      .catch(error => {
        console.error("Error checking baseline:", error);
        // Default to main page if there's an error
        setTargetPath('/碳盤查系統/system/');
      });
  };
  
  // Check baseline status when component mounts
  useEffect(() => {
    checkBaselineStatus();
  }, []);
  
  const handleClick = (e) => {
    e.preventDefault(); // Prevent default navigation
    
    // Use React Router navigation instead of window.location.href
    navigate(targetPath);
  };
  
  return (
    <CNavItem {...props} onClick={handleClick} to={targetPath} />
  );
};

const getAdminNavItems = () => {
  return [
    {
      component: CNavTitle,
      name: '管理者頁面',
    },
    {
      component: CNavItem,
      name: '企業與使用者列表',
      to: '/管理者/企業列表',
      icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: '顧問列表',
      to: '/管理者/顧問列表',
      icon: <CIcon icon={cilHandshake} customClassName="nav-icon" />,
    },
  ];
};

const getNormalNavItems = () => {
  return [
    {
      component: CNavItem,
      name: '首頁',
      to: '/theme/home',
      icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
    },
    {
      component: CNavGroup,
      name: '碳盤查系統',
      to: '/碳盤查系統',
      icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      items: [
        {
          component: CarbonInventoryNavItem,
          name: '碳盤查–組織內',
          // The 'to' prop will be set within the CarbonInventoryNavItem component
        },
        {
          component: CNavItem,
          name: '碳盤查–顧問',
          to: '/碳盤查系統/顧問system/排放源鑑別',
        },
      ],
    },
    {
      component: CNavItem,
      name: '盤查結果查詢',
      to: '/theme/search',
      icon: <CIcon icon={cilSearch} customClassName="nav-icon" />,
    },
    {
      component: CNavGroup,
      name: '碳盤查文件',
      to: '/碳盤查文件',
      icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: '盤查報告書',
          to: '/盤查報告書',
        },
        {
          component: CNavItem,
          name: '盤查清冊',
          to: '/盤查清冊',
        },
      ],
    },
    {
      component: CNavItem,
      name: '碳費資訊',
      to: '/theme/carbon_fee',
      icon: <CIcon icon={cilCash} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: '排放係數_GWP值',
      to: '/theme/carbon_factor',
      icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'try',
      to: '/theme/try_411402601',
      icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: '常見問題',
      to: '/theme/qa',
      icon: <CIcon icon={cilSatelite} customClassName="nav-icon" />,
    },
    {
      component: CNavTitle,
      name: '帳號管理',
    },
    {
      component: CNavItem,
      name: '個人資料',
      to: '/theme/user_info',
      icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: '企業資料',
      to: '/theme/company_info',
      icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
    },
  ];
};

// Use a function to determine the navigation items to avoid potential issues with sessionStorage
// not being available during server-side rendering
const getNavItems = () => {
  try {
    return window.sessionStorage.getItem("role") == 0 ? getAdminNavItems() : getNormalNavItems();
  } catch (error) {
    console.error("Error accessing sessionStorage:", error);
    return getNormalNavItems(); // Default to normal navigation if there's an error
  }
};

const _nav = getNavItems();

export default _nav;