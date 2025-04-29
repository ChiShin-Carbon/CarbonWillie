from openpyxl import Workbook
import requests
import sys

# 修改API端點常數
API_BASE_URL = "http://localhost:8000"

def get_baseline_year():
    """從API獲取最新的基準年份"""
    try:
        response = requests.get(f"{API_BASE_URL}/latest_baseline_year")
        if response.status_code == 200:
            data = response.json()
            return data["year"]
        else:
            print(f"獲取基準年份失敗，狀態碼: {response.status_code}，錯誤訊息: {response.text}")
            return None
    except Exception as e:
        print(f"連接基準年份API時發生錯誤: {e}")
        return None

def main():
    # 獲取基準年份
    year = get_baseline_year()
    if not year:
        print("無法獲取基準年份，使用預設年份 2024")
        year = 2024
    
    print(f"使用基準年份: {year}")
    
    try:
        wb = Workbook()
        wb.remove(wb.active)  # 移除預設的工作表
        
        # 匯入各模組並使用年份參數建立工作表
        # 匯入車輛資料模組
        import vehicle_sheet
        vehicle_data = vehicle_sheet.get_vehicle_data(year)
        if vehicle_data:
            vehicle_sheet.create_sheet1(wb, vehicle_data)
        else:
            print(f"無法獲取 {year} 年的車輛資料")
        
        # 匯入員工資料模組
        import employee_sheet
        employee_data = employee_sheet.get_employee_data(year)
        if employee_data:
            employee_sheet.create_work_hours_sheet(wb, employee_data)
        else:
            print(f"無法獲取 {year} 年的員工資料")
        
        # # 匯入非員工資料模組
        # import nonemployee_module
        # nonemployee_data = nonemployee_module.get_nonemployee_data(year)
        # if nonemployee_data:
        #     nonemployee_module.create_nonemployee_work_hours_sheet(wb, nonemployee_data)
        # else:
        #     print(f"無法獲取 {year} 年的非員工資料")
        
        # 儲存 Excel 檔案
        output_filename = f"碳盤查基準活動數據清冊_{year}.xlsx"
        wb.save(output_filename)
        print(f"Excel 檔案已生成: {output_filename}")
        
    except Exception as e:
        print(f"生成Excel檔案時發生錯誤: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()