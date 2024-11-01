import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

// import Robot from '../views/聊天機器人/robot'

const DefaultLayout = () => {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />

          {/* <Robot /> */}
          
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
