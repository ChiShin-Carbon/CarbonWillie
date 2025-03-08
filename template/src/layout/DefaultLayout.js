import React,{ useState } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

import Robot from '../views/聊天機器人/robot'

const DefaultLayout = () => {

  const [showRobot, setShowRobot] = useState(false)

  const toggleRobot = () => {
    setShowRobot((prev) => !prev)
  }

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader toggleRobot={toggleRobot} />
        <div className="body flex-grow-1">
          <AppContent />

          {showRobot && <Robot />} {/* 根據狀態決定是否顯示 Robot */}
          
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
