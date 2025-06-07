// contexts/NotificationContext.js
import React, { createContext, useContext, useState, useEffect } from 'react'
import { CToast, CToastBody, CToastHeader } from '@coreui/react'

// 創建通知上下文
const NotificationContext = createContext()

// 自定義 Hook 來使用通知上下文
export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}

// 通知提供者組件
export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])
  const [isGeneratingExcel, setIsGeneratingExcel] = useState(false)
  const [isGeneratingWord, setIsGeneratingWord] = useState(false)
  const [baselineYear, setBaselineYear] = useState(null)

  // 初始化時獲取基準年
  useEffect(() => {
    const fetchBaselineYear = async () => {
      try {
        const response = await fetch('http://localhost:8000/baseline')
        if (response.ok) {
          const data = await response.json()
          if (data.baseline.cfv_start_date) {
            const dateStr = data.baseline.cfv_start_date
            let year
            if (dateStr.includes('-')) {
              year = parseInt(dateStr.split('-')[0])
            } else if (dateStr.includes('/')) {
              year = parseInt(dateStr.split('/')[0])
            } else {
              year = parseInt(dateStr.substring(0, 4))
            }
            setBaselineYear(year)
          }
        }
      } catch (error) {
        console.error('Error fetching baseline year:', error)
      }
    }

    fetchBaselineYear()
  }, [])

  // Excel生成狀態輪詢
  useEffect(() => {
    let intervalId

    if (isGeneratingExcel && baselineYear) {
      intervalId = setInterval(async () => {
        try {
          const response = await fetch(`http://localhost:8000/check_excel_status/${baselineYear}`)
          const data = await response.json()
          
          if (response.ok && data.exists) {
            console.log('Excel檔案已成功生成:', data.file_path)
            showToast(`${baselineYear}年度盤查清冊已成功生成！`, 'success')
            setIsGeneratingExcel(false)
            clearInterval(intervalId)
            
            // Excel完成後開始生成Word/PDF
            startWordGeneration()
          }
        } catch (error) {
          console.error('輪詢Excel狀態時發生錯誤:', error)
        }
      }, 3000)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [isGeneratingExcel, baselineYear])

  // Word/PDF生成狀態輪詢
  useEffect(() => {
    let intervalId

    if (isGeneratingWord && baselineYear) {
      intervalId = setInterval(async () => {
        try {
          const response = await fetch(`http://localhost:8000/check_word_status/${baselineYear}`)
          
          if (response.ok) {
            const data = await response.json()
            if (data.exists) {
              console.log('Word/PDF檔案已成功生成:', data.file_path)
              showToast(`${baselineYear}年度盤查報告書已成功生成！`, 'success')
              setIsGeneratingWord(false)
              clearInterval(intervalId)
            }
          }
        } catch (error) {
          console.error('輪詢Word狀態時發生錯誤:', error)
        }
      }, 3000)

      // 如果API不存在，設定預估完成時間
      const fallbackTimeout = setTimeout(() => {
        if (isGeneratingWord) {
          showToast(`${baselineYear}年度盤查報告書生成中，請稍後檢查檔案`, 'info')
          setIsGeneratingWord(false)
          clearInterval(intervalId)
        }
      }, 30000)

      return () => {
        clearTimeout(fallbackTimeout)
      }
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [isGeneratingWord, baselineYear])

  // 顯示通知
  const showToast = (message, type = 'success') => {
    const newToast = {
      id: Date.now() + Math.random(),
      message,
      type,
      visible: true
    }
    
    setToasts(prevToasts => [...prevToasts, newToast])
    
    // 10秒後自動隱藏
    setTimeout(() => {
      setToasts(prevToasts => 
        prevToasts.map(toast => 
          toast.id === newToast.id 
            ? { ...toast, visible: false }
            : toast
        )
      )
      
      setTimeout(() => {
        setToasts(prevToasts => 
          prevToasts.filter(toast => toast.id !== newToast.id)
        )
      }, 500)
    }, 10000)
  }

  // 手動關閉通知
  const closeToast = (toastId) => {
    setToasts(prevToasts => 
      prevToasts.map(toast => 
        toast.id === toastId 
          ? { ...toast, visible: false }
          : toast
      )
    )
    
    setTimeout(() => {
      setToasts(prevToasts => 
        prevToasts.filter(toast => toast.id !== toastId)
      )
    }, 500)
  }

  // 開始Excel生成
  const startExcelGeneration = async () => {
    try {
      const response = await fetch('http://localhost:8000/generate_inventory_excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      
      if (response.ok) {
        setIsGeneratingExcel(true)
        showToast('已開始生成盤查清冊，請稍候...', 'info')
        return true
      } else {
        showToast(`生成盤查清冊失敗: ${data.message}`, 'danger')
        return false
      }
    } catch (error) {
      showToast(`生成盤查清冊時發生錯誤: ${error.message}`, 'danger')
      return false
    }
  }

  // 開始Word/PDF生成
  const startWordGeneration = async (userId = 1) => {
    try {
      const response = await fetch(`http://localhost:8000/generate_word/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      
      if (response.ok) {
        setIsGeneratingWord(true)
        showToast('已開始生成盤查報告書，請稍候...', 'info')
        return true
      } else {
        showToast(`生成盤查報告書失敗: ${data.message}`, 'danger')
        return false
      }
    } catch (error) {
      showToast(`生成盤查報告書時發生錯誤: ${error.message}`, 'danger')
      return false
    }
  }

  // 完成盤查
  const completeBaseline = async (baselineId) => {
    if (!baselineId) {
      showToast("沒有可用的基準年ID", "danger")
      return false
    }

    try {
      // 先生成Excel
      const excelGenerated = await startExcelGeneration()
      
      // 標記baseline為完成
      const response = await fetch(`http://localhost:8000/baseline/${baselineId}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_completed: true
        }),
      })

      if (response.ok) {
        let message = "盤查已標記為完成"
        if (excelGenerated) {
          message += "，盤查清冊生成中，完成後將自動開始生成報告書"
        }
        showToast(message, "success")
        return true
      } else {
        showToast("更新基準年完成狀態失敗", "danger")
        return false
      }
    } catch (error) {
      showToast(`處理過程中發生錯誤: ${error.message}`, "danger")
      return false
    }
  }

  const contextValue = {
    // 狀態
    toasts,
    isGeneratingExcel,
    isGeneratingWord,
    
    // 方法
    showToast,
    closeToast,
    startExcelGeneration,
    startWordGeneration,
    completeBaseline
  }

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      
      {/* 全域通知顯示 */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {toasts.map((toast) => (
          <CToast 
            key={toast.id}
            visible={toast.visible}
            className={`bg-${toast.type} text-white`}
            style={{
              minWidth: '300px',
              transform: toast.visible ? 'translateX(0)' : 'translateX(100%)',
              transition: 'transform 0.3s ease-in-out'
            }}
          >
            <CToastHeader 
              closeButton
              onClose={() => closeToast(toast.id)}
            >
              <strong className="me-auto">通知</strong>
            </CToastHeader>
            <CToastBody>{toast.message}</CToastBody>
          </CToast>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}