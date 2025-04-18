import React from 'react'
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
          component: CNavItem,
          name: '碳盤查–組織內',
          to: '/碳盤查系統/system',
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

const _nav = window.sessionStorage.getItem("role") == 0 ? getAdminNavItems() : getNormalNavItems();

export default _nav;


   // {
  //   component: CNavTitle,
  //   name: 'Theme',
  // },
  // {
  //   component: CNavItem,
  //   name: '碳盤查系統',
  //   to: '/theme/system',
  //   icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  // },

  // {
  //   component: CNavTitle,
  //   name: 'Components',
  // },
  // {
  //   component: CNavItem,
  //   name: 'Login',
  //   to: '/login',
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Base',
  //   to: '/base',
  //   icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Accordion',
  //       to: '/base/accordion',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Breadcrumb',
  //       to: '/base/breadcrumbs',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Cards',
  //       to: '/base/cards',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Carousel',
  //       to: '/base/carousels',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Collapse',
  //       to: '/base/collapses',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'List group',
  //       to: '/base/list-groups',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Navs & Tabs',
  //       to: '/base/navs',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Pagination',
  //       to: '/base/paginations',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Placeholders',
  //       to: '/base/placeholders',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Popovers',
  //       to: '/base/popovers',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Progress',
  //       to: '/base/progress',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Spinners',
  //       to: '/base/spinners',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Tables',
  //       to: '/base/tables',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Tabs',
  //       to: '/base/tabs',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Tooltips',
  //       to: '/base/tooltips',
  //     },
  //   ],
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Buttons',
  //   to: '/buttons',
  //   icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Buttons',
  //       to: '/buttons/buttons',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Buttons groups',
  //       to: '/buttons/button-groups',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Dropdowns',
  //       to: '/buttons/dropdowns',
  //     },
  //   ],
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Forms',
  //   icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Form Control',
  //       to: '/forms/form-control',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Select',
  //       to: '/forms/select',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Checks & Radios',
  //       to: '/forms/checks-radios',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Range',
  //       to: '/forms/range',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Input Group',
  //       to: '/forms/input-group',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Floating Labels',
  //       to: '/forms/floating-labels',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Layout',
  //       to: '/forms/layout',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Validation',
  //       to: '/forms/validation',
  //     },
  //   ],
  // },
  // {
  //   component: CNavItem,
  //   name: 'Charts',
  //   to: '/charts',
  //   icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Icons',
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'CoreUI Free',
  //       to: '/icons/coreui-icons',
  //       badge: {
  //         color: 'success',
  //         text: 'NEW',
  //       },
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'CoreUI Flags',
  //       to: '/icons/flags',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'CoreUI Brands',
  //       to: '/icons/brands',
  //     },
  //   ],
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Notifications',
  //   icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Alerts',
  //       to: '/notifications/alerts',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Badges',
  //       to: '/notifications/badges',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Modal',
  //       to: '/notifications/modals',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Toasts',
  //       to: '/notifications/toasts',
  //     },
  //   ],
  // },
  // {
  //   component: CNavItem,
  //   name: 'Widgets',
  //   to: '/widgets',
  //   icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
  //   badge: {
  //     color: 'info',
  //     text: 'NEW',
  //   },
  // },
  // {
  //   component: CNavItem,
  //   name: 'Dashboard',
  //   to: '/dashboard',
  //   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  //   badge: {
  //     color: 'info',
  //     text: 'NEW',
  //   },
  // },

  // {
  //   component: CNavItem,
  //   name: 'Colors',
  //   to: '/theme/colors',
  //   icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'Typography',
  //   to: '/theme/typography',
  //   icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  // },

  // {
  //   component: CNavTitle,
  //   name: 'Extras',
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Pages',
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Register',
  //       to: '/register',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Error 404',
  //       to: '/404',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Error 500',
  //       to: '/500',
  //     },
  //   ],
  // },
  // {
  //   component: CNavItem,
  //   name: 'Docs',
  //   href: 'https://coreui.io/react/docs/templates/installation/',
  //   icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  // },