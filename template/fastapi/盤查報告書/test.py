import os

# 使用相對路徑計算 UPLOAD_FOLDER
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # 取得 `template` 目錄
UPLOAD_FOLDER = os.path.join(BASE_DIR, "..", "..", "public", "version_report")  # 指向 `public/version_report`

print(UPLOAD_FOLDER)