import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))
const Try_411402601 = React.lazy(() => import('./views/theme/try_411402601/Try'))
const 個人資料 = React.lazy(() => import('./views/theme/user_info/個人資料'))
const 企業資料 = React.lazy(() => import('./views/theme/company_info/企業資料'))
const 盤查結果查詢 = React.lazy(() => import('./views/theme/search/盤查結果查詢'))
const 碳費資訊 = React.lazy(() => import('./views/theme/carbon_fee/碳費資訊'))
const 排放係數_GWP值 = React.lazy(() => import('./views/theme/carbon_factor/排放係數_GWP值'))
const 常見問題 = React.lazy(() => import('./views/theme/qa/常見問題'))
const 首頁 = React.lazy(() => import('./views/theme/dashboard/首頁'))

//碳盤查系統

const 碳盤查系統 = React.lazy(() => import('./views/碳盤查系統/system/碳盤查系統'))
const 活動數據盤點 = React.lazy(() => import('./views/碳盤查系統/system/活動數據盤點/活動數據盤點'))
const 活動數據分配 = React.lazy(() => import('./views/碳盤查系統/system/活動數據分配/活動數據分配'))
const 盤查進度管理 = React.lazy(() => import('./views/碳盤查系統/system/盤查進度管理/盤查進度管理'))

//碳盤查系統顧問
const 排放源鑑別 = React.lazy(() => import('./views/碳盤查系統/顧問system/排放源鑑別/排放源鑑別'))
const 活動數據 = React.lazy(() => import('./views/碳盤查系統/顧問system/活動數據/活動數據'))
const 全廠電力蒸汽供需情況 = React.lazy(() => import('./views/碳盤查系統/顧問system/全廠電力蒸汽供需情況/全廠電力蒸汽供需情況'))
const 定量盤查 = React.lazy(() => import('./views/碳盤查系統/顧問system/定量盤查/定量盤查'))
const 數據品質管理 = React.lazy(() => import('./views/碳盤查系統/顧問system/數據品質管理/數據品質管理'))
const 不確定性量化評估 = React.lazy(() => import('./views/碳盤查系統/顧問system/不確定性量化評估/不確定性量化評估'))

//盤查報告書
const 盤查報告書 = React.lazy(() => import('./views/盤查報告書/盤查報告書'))
const test報告書 = React.lazy(() => import('./views/test報告書/test報告書'))

//盤查報告書
const 盤查清冊 = React.lazy(() => import('./views/盤查清冊/盤查清冊'))

//管理者
const 企業列表 = React.lazy(() => import('./views/管理者/企業列表/企業列表'))
const 使用者列表 = React.lazy(() => import('./views/管理者/使用者列表/使用者列表'))
const 顧問列表 = React.lazy(() => import('./views/管理者/顧問列表/顧問列表'))

// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  //新增
  { path: '/theme/home', name: '首頁', element: 首頁 },
  { path: '/theme/qa', name: '常見問題', element: 常見問題 },
  { path: '/theme/try_411402601', name: 'Try', element: Try_411402601 },
  { path: '/theme/user_info', name: '個人資料', element: 個人資料 },
  { path: '/theme/company_info', name: '企業資料', element: 企業資料 },
  { path: '/theme/search', name: '盤查結果查詢', element: 盤查結果查詢 },
  { path: '/theme/carbon_fee', name: '碳費資訊', element: 碳費資訊 },
  { path: '/theme/carbon_factor', name: '排放係數_GWP值', element: 排放係數_GWP值 },
  //碳盤查系統
  { path: '/碳盤查系統/system', name: '碳盤查系統', element: 碳盤查系統 },
  { path: '/碳盤查系統/system/活動數據盤點', name: '活動數據盤點', element: 活動數據盤點 },
  { path: '/碳盤查系統/system/活動數據分配', name: '活動數據分配', element: 活動數據分配 },
  { path: '/碳盤查系統/system/盤查進度管理', name: '盤查進度管理', element: 盤查進度管理 },
  //碳盤查系統顧問
  { path: '/碳盤查系統/顧問system/排放源鑑別', name: '活排放源鑑別', element: 排放源鑑別 },
  { path: '/碳盤查系統/顧問system/活動數據', name: '活動數據', element: 活動數據 },
  { path: '/碳盤查系統/顧問system/全廠電力蒸汽供需情況', name: '全廠電力蒸汽供需情況', element: 全廠電力蒸汽供需情況 },
  { path: '/碳盤查系統/顧問system/定量盤查', name: '定量盤查', element: 定量盤查 },
  { path: '/碳盤查系統/顧問system/不確定性量化評估', name: '不確定性量化評估', element: 不確定性量化評估 },
  { path: '/碳盤查系統/顧問system/數據品質管理', name: '數據品質管理', element: 數據品質管理 },
  //盤查報告書
  { path: '/盤查報告書', name: '盤查報告書', element: 盤查報告書 },
  { path: '/test報告書', name: 'test盤告書', element: test報告書 },

  //盤查清冊
  { path: '/盤查清冊', name: '盤查清冊', element: 盤查清冊 },
  //管理者
  { path: '/管理者/企業列表', name: '企業列表', element: 企業列表 },
  { path: '/管理者/使用者列表', name: '使用者列表', element: 使用者列表 },
  { path: '/管理者/顧問列表', name: '顧問列表', element: 顧問列表 },

  //
  { path: '/base', name: 'Base', element: Cards, exact: true },
  { path: '/base/accordion', name: 'Accordion', element: Accordion },
  { path: '/base/cards', name: 'Cards', element: Cards },
  { path: '/base/carousels', name: 'Carousel', element: Carousels },
  { path: '/base/collapses', name: 'Collapse', element: Collapses },
  { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  { path: '/base/navs', name: 'Navs', element: Navs },
  { path: '/base/paginations', name: 'Paginations', element: Paginations },
  { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  { path: '/base/popovers', name: 'Popovers', element: Popovers },
  { path: '/base/progress', name: 'Progress', element: Progress },
  { path: '/base/spinners', name: 'Spinners', element: Spinners },
  { path: '/base/tabs', name: 'Tabs', element: Tabs },
  { path: '/base/tables', name: 'Tables', element: Tables },
  { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },
  { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  { path: '/charts', name: 'Charts', element: Charts },
  { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  { path: '/forms/select', name: 'Select', element: Select },
  { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  { path: '/forms/range', name: 'Range', element: Range },
  { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  { path: '/forms/layout', name: 'Layout', element: Layout },
  { path: '/forms/validation', name: 'Validation', element: Validation },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', element: Flags },
  { path: '/icons/brands', name: 'Brands', element: Brands },
  { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  { path: '/widgets', name: 'Widgets', element: Widgets },
]

export default routes
