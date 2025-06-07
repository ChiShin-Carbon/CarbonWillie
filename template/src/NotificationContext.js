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
      console.log('開始輪詢Word/PDF生成狀態...')
      
      intervalId = setInterval(async () => {
        try {
          console.log(`正在檢查Word/PDF狀態: ${baselineYear}`)
          const response = await fetch(`http://localhost:8000/check_word_status/${baselineYear}`)
          
          if (response.ok) {
            const data = await response.json()
            console.log('Word/PDF狀態響應:', data)
            
            if (data.exists) {
              console.log('Word/PDF檔案已成功生成:', data.file_path)
              showToast(`${baselineYear}年度盤查報告書已成功生成！`, 'success')
              setIsGeneratingWord(false)
              clearInterval(intervalId)
            } else {
              console.log('Word/PDF檔案尚未生成，繼續等待...')
            }
          } else {
            console.error('檢查Word/PDF狀態API響應錯誤:', response.status)
          }
        } catch (error) {
          console.error('輪詢Word狀態時發生錯誤:', error)
        }
      }, 3000)

      // 設置最大輪詢時間為5分鐘，避免無限輪詢
      const maxTimeout = setTimeout(() => {
        if (isGeneratingWord) {
          console.log('Word/PDF生成超時，停止輪詢')
          showToast(`${baselineYear}年度盤查報告書生成時間較長，請稍後手動檢查檔案`, 'warning')
          setIsGeneratingWord(false)
          clearInterval(intervalId)
        }
      }, 300000) // 5分鐘超時

      return () => {
        clearInterval(intervalId)
        clearTimeout(maxTimeout)
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
  const startExcelGeneration = async (userId = 1) => {
    try {
      const response = await fetch(`http://localhost:8000/generate_inventory_excel/${userId}`, {
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
      console.log('開始調用Word/PDF生成API...')
      const response = await fetch(`http://localhost:8000/generate_word/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      console.log('Word/PDF生成API響應:', data)
      
      if (response.ok) {
        setIsGeneratingWord(true)
        showToast('已開始生成盤查報告書，請稍候...', 'info')
        return true
      } else {
        showToast(`生成盤查報告書失敗: ${data.message}`, 'danger')
        return false
      }
    } catch (error) {
      console.error('調用Word/PDF生成API時發生錯誤:', error)
      showToast(`生成盤查報告書時發生錯誤: ${error.message}`, 'danger')
      return false
    }
  }

  // 並行生成Excel和Word/PDF
  const generateBothDocuments = async (userId = 1) => {
    try {
      // 使用 Promise.allSettled 同時執行兩個生成任務
      // 這樣即使其中一個失敗，另一個仍會繼續執行
      const results = await Promise.allSettled([
        startExcelGeneration(userId),
        startWordGeneration(userId)
      ])
      
      const [excelResult, wordResult] = results
      
      // 檢查結果並顯示適當的通知
      let successCount = 0
      let failureMessages = []
      
      if (excelResult.status === 'fulfilled' && excelResult.value) {
        successCount++
      } else {
        failureMessages.push('盤查清冊生成啟動失敗')
      }
      
      if (wordResult.status === 'fulfilled' && wordResult.value) {
        successCount++
      } else {
        failureMessages.push('盤查報告書生成啟動失敗')
      }
      
      if (successCount === 2) {
        
        return true
      } else if (successCount === 1) {
        showToast(`部分生成任務啟動成功，但有錯誤：${failureMessages.join(', ')}`, 'warning')
        return true
      } else {
        showToast(`所有生成任務都啟動失敗：${failureMessages.join(', ')}`, 'danger')
        return false
      }
    } catch (error) {
      console.error('並行生成文檔時發生錯誤:', error)
      showToast(`生成文檔時發生錯誤: ${error.message}`, 'danger')
      return false
    }
  }

  // 完成盤查 - 修改為並行生成
  const completeBaseline = async (baselineId) => {
    if (!baselineId) {
      showToast("沒有可用的基準年ID", "danger")
      return false
    }

    try {
      // 並行開始生成Excel和Word/PDF
      const documentsGenerated = await generateBothDocuments()
      
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
        if (documentsGenerated) {
          message += "，盤查清冊和報告書正在同時生成中"
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
    generateBothDocuments, // 新增的並行生成方法
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