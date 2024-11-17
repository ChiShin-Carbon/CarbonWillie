// AddModal.js
import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react'
import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CForm,
  CRow,
  CFormLabel,
  CCol,
  CFormSelect,
  CButton,
} from '@coreui/react'
import styles from '../../../../scss/活動數據盤點.module.css'

const AddModal = forwardRef((props, ref) => {
  // Expose a method to open the modal
  useImperativeHandle(ref, () => ({
    openModal() {
      setAddModalVisible(true)
      setCategory('1') // 重置 category 為範疇一
      setSelectedUsers({})
    },
  }))

  const { uniqueTableNames } = props // 从props中获取 uniqueTableName

  const [isAddModalVisible, setAddModalVisible] = useState(false)
  const [category, setCategory] = useState()
  const [emissionSourceOptions, setEmissionSourceOptions] = useState([])
  const [users, setUsers] = useState([]) // State to store users data
  const [selectedEmissionSource, setSelectedEmissionSource] = useState()

  const handleCategoryChange = (event) => {
    const selectedCategory = event ? event.target.value : category
    setCategory(selectedCategory)

    if (selectedCategory === '1') {
      setEmissionSourceOptions([
        { value: '1', label: '公務車' },
        { value: '2', label: '滅火器' },
        { value: '3', label: '工作時數(員工)' },
        { value: '4', label: '工作時數(非員工)' },
        { value: '5', label: '冷媒' },
        { value: '6', label: '廠內機具' },
        { value: '7', label: '緊急發電機' },
      ])
    } else if (selectedCategory === '2') {
      setEmissionSourceOptions([{ value: '1', label: '電力使用量' }])
    } else if (selectedCategory === '3') {
      setEmissionSourceOptions([
        { value: '1', label: '員工通勤' },
        { value: '2', label: '商務旅行' },
        { value: '3', label: '營運產生廢棄物' },
        { value: '4', label: '銷售產品的廢棄物' },
      ])
    }
  }

  useEffect(() => {
    // 每次 emissionSourceOptions 或 uniqueTableNames 變更時更新 selectedEmissionSource
    const availableOptions = emissionSourceOptions.filter(
      (option) => !uniqueTableNames.includes(option.label),
    )
    if (availableOptions.length > 0) {
      setSelectedEmissionSource(availableOptions[0].value) // 設定為第一個可用選項
    } else {
      setSelectedEmissionSource('') // 如果沒有可用選項，清空 selectedEmissionSource
    }
  }, [emissionSourceOptions, uniqueTableNames])

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      if (data.users) {
        // Store users' usernames and user_ids in state
        const usersData = data.users.map((user) => ({
          username: user.username,
          user_id: user.user_id,
        }))
        setUsers(usersData) // Store extracted username and user_id

        // Create a mapping of department -> usernames
        const departments = data.users.reduce((acc, user) => {
          if (!acc[user.department]) {
            acc[user.department] = []
          }
          acc[user.department].push(user.username)
          return acc
        }, {})
        setUserDepartments(departments)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  useEffect(() => {
    fetchUsers() // Fetch users when the component mounts
    handleCategoryChange() // 每次打開時，根據 category 設置排放源選項
  }, [category])

  const [userDepartments, setUserDepartments] = useState({}) // Store users' department mapping
  const renderUserOptions = (departmentId) => {
    // 获取对应部门的用户列表
    const departmentUsers = userDepartments[departmentId] || []
    return (
      <>
        <option value="1">無</option>
        {departmentUsers.length > 0
          ? departmentUsers.map((username, index) => (
              <option key={index} value={username}>
                {username}
              </option>
            ))
          : null}
      </>
    )
  }

  const [selectedUsers, setSelectedUsers] = useState({}) // 存儲各部門選中的用戶ID
  const handleUserChange = (departmentId, selectedUsername) => {
    const selectedUser = users.find((user) => user.username === selectedUsername)
    // 这里直接更新selectedUsers数组，而不是合并旧的数组
    if (selectedUser) {
      setSelectedUsers((prevState) => {
        // 将部门ID与对应的用户ID加入到选中的用户列表中
        return {
          ...prevState,
          [departmentId]: selectedUser.user_id,
        }
      })
    }
  }

  const handleSubmit = async () => {
    //測試可不可以輸出
    const selectedOption = emissionSourceOptions.find(
      (option) => option.value === selectedEmissionSource,
    )
    if (selectedOption) {
      console.log(selectedOption.label) // 打印選擇的排放源 label
    } else {
      console.log('未選擇排放源')
    }
    console.log('Selected Users:', selectedUsers)

    // 準備要提交的用戶資料
    const userData = Object.keys(selectedUsers).map((departmentId) => {
      return {
        user_id: selectedUsers[departmentId], // 用戶ID
        table_name: selectedOption.label, // 排放源名稱
        is_done: 0, // 設定預設值
        completed_at: null, // 可選填
      }
    })

    // 使用 FormData 來發送資料
    const formData = new FormData()
    userData.forEach((user, index) => {
      formData.append(`user_ids`, user.user_id)
      formData.append(`table_names`, user.table_name)
      formData.append(`is_done_list`, user.is_done)
    })

    // 發送 POST 請求到後端插入資料
    try {
      const response = await fetch('http://localhost:8000/insert_authorized', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error Response:', errorData)
        throw new Error(errorData.message || 'Unknown error')
      }

      const result = await response.json()
      console.log('Server Response:', result)

      // 成功後關閉 modal 並顯示成功訊息
      setAddModalVisible(false)
      props.onSuccess() // 呼叫父層的刷新函數
      alert('新增成功')
    } catch (error) {
      console.error('Error during the submission:', error)
    }
  }

  const [isDisabled, setIsDisabled] = useState(false)
  useEffect(() => {
    // 判断 `emissionSourceOptions` 是否有可选项
    setIsDisabled(
      emissionSourceOptions.filter((option) => !uniqueTableNames.includes(option.label)).length ===
        0,
    )
  }, [emissionSourceOptions, uniqueTableNames])

  return (
    <CModal
      backdrop="static"
      visible={isAddModalVisible}
      onClose={() => setAddModalVisible(false)}
      aria-labelledby="StaticBackdropExampleLabel"
    >
      <CModalHeader>
        <CModalTitle id="StaticBackdropExampleLabel">
          <b>新增排放源與填寫人</b>
        </CModalTitle>
      </CModalHeader>
      <CModalBody style={{ padding: '10px 50px' }}>
        <CForm>
          <CRow className="mb-3">
            <CFormLabel htmlFor="sitename" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
              排放類別
            </CFormLabel>
            <CCol>
              <CFormSelect
                aria-label="Default select example"
                className={styles.addinput}
                onChange={handleCategoryChange}
              >
                <option value="1">範疇一</option>
                <option value="2">範疇二</option>
                <option value="3">範疇三</option>
              </CFormSelect>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CFormLabel
              htmlFor="emissionSource"
              className={`col-sm-2 col-form-label ${styles.addlabel}`}
            >
              排放源
            </CFormLabel>
            <CCol>
              <CFormSelect
                aria-label="Default select example"
                className={styles.addinput}
                onChange={(e) => setSelectedEmissionSource(e.target.value)}
                disabled={isDisabled} // 如果没有可选项则禁用 select
              >
                {/* 如果没有可选项，则显示"無項目可以新增" */}
                {emissionSourceOptions.filter((option) => !uniqueTableNames.includes(option.label))
                  .length > 0 ? (
                  emissionSourceOptions
                    .filter((option) => !uniqueTableNames.includes(option.label)) // 过滤掉已存在的 table_name
                    .map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))
                ) : (
                  <option value="">無項目可以新增</option> // 禁用选项
                )}
              </CFormSelect>
            </CCol>
          </CRow>
          <hr />
          <CRow className="mb-3">
            <CFormLabel htmlFor="sitename" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
              管理部門
            </CFormLabel>
            <CCol>
              <CFormSelect
                aria-label="Default select example"
                className={styles.addinput}
                onChange={(e) => handleUserChange(1, e.target.value)}
                disabled={isDisabled}
              >
                {renderUserOptions(1)} {/* 渲染對應的部門選項 */}
              </CFormSelect>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CFormLabel htmlFor="sitename" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
              資訊部門
            </CFormLabel>
            <CCol>
              <CFormSelect
                aria-label="Default select example"
                className={styles.addinput}
                onChange={(e) => handleUserChange(2, e.target.value)}
                disabled={isDisabled}
              >
                {renderUserOptions(2)} {/* 渲染對應的部門選項 */}
              </CFormSelect>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CFormLabel htmlFor="sitename" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
              業務部門
            </CFormLabel>
            <CCol>
              <CFormSelect
                aria-label="Default select example"
                className={styles.addinput}
                onChange={(e) => handleUserChange(3, e.target.value)}
                disabled={isDisabled}
              >
                {renderUserOptions(3)} {/* 渲染對應的部門選項 */}
              </CFormSelect>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CFormLabel htmlFor="sitename" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
              門診部門
            </CFormLabel>
            <CCol>
              <CFormSelect
                aria-label="Default select example"
                className={styles.addinput}
                onChange={(e) => handleUserChange(4, e.target.value)}
                disabled={isDisabled}
              >
                {renderUserOptions(4)} {/* 渲染對應的部門選項 */}
              </CFormSelect>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CFormLabel htmlFor="sitename" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
              健檢部門
            </CFormLabel>
            <CCol>
              <CFormSelect
                aria-label="Default select example"
                className={styles.addinput}
                onChange={(e) => handleUserChange(5, e.target.value)}
                disabled={isDisabled}
              >
                {renderUserOptions(5)} {/* 渲染對應的部門選項 */}
              </CFormSelect>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CFormLabel htmlFor="sitename" className={`col-sm-2 col-form-label ${styles.addlabel}`}>
              檢驗部門
            </CFormLabel>
            <CCol>
              <CFormSelect
                aria-label="Default select example"
                className={styles.addinput}
                onChange={(e) => handleUserChange(6, e.target.value)}
                disabled={isDisabled}
              >
                {renderUserOptions(6)} {/* 渲染對應的部門選項 */}
              </CFormSelect>
            </CCol>
          </CRow>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton className="modalbutton1" onClick={() => setAddModalVisible(false)}>
          取消
        </CButton>
        <CButton className="modalbutton2" onClick={handleSubmit} disabled={isDisabled}>
          新增
        </CButton>
      </CModalFooter>
    </CModal>
  )
})

export default AddModal
