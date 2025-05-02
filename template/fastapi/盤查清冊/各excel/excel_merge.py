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
        vehicle_sheet.create_sheet1(wb, vehicle_data)
        print(f"已生成車輛資料作表")
        
        # 匯入員工資料模組
        import employee_sheet
        employee_data = employee_sheet.get_employee_data(year)
        employee_sheet.create_work_hours_sheet(wb, employee_data)
        print(f"已生成員工資料作表")
        
        # 匯入非員工資料模組
        import nonemployee_sheet
        nonemployee_data = nonemployee_sheet.get_nonemployee_data(year)
        nonemployee_sheet.create_nonemployee_work_hours_sheet(wb, nonemployee_data)
        print(f"已生成非員工資料作表")

        # 匯入滅火器資料模組
        import fireextinguisher_sheet
        fireextinguisher_data = fireextinguisher_sheet.get_fireextinguisher_data()
        fireextinguisher_sheet.create_fire_extinguisher_sheet(wb, fireextinguisher_data)
        print(f"已生成滅火器工作表")

        # 匯入廠內機具資料模組
        import machinery_sheet
        machinery_data = machinery_sheet.get_machinery_data(year)
        machinery_sheet.create_internal_machinery_sheet(wb, machinery_data)
        print(f"已生成廠內機具工作表")





        # 匯入員工通勤資料模組
        import commute_sheet
        commute_data = commute_sheet.get_commute_data(year)
        # 不需要檢查commute_data是否為None，直接傳入create_commute_sheet
        commute_sheet.create_commute_sheet(wb, commute_data)
        print(f"已生成員工通勤工作表")
        
        
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