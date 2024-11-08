from flask import Flask, jsonify, request
from newsapi import NewsApiClient
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # 啟用 CORS

API_KEY = '63be5a783b9e43879fe815bc139a77d9'
my_news_api = NewsApiClient(api_key=API_KEY)

@app.route('/news', methods=['GET'])
def get_news():
    query = request.args.get('q', '碳費')  # 從請求中取得查詢字串，預設為 '台灣碳費'

    # 查詢 "碳費" 相關的新聞，不使用日期範圍
    articles = my_news_api.get_everything(
        q=query,
        sort_by='relevancy',  # 使用 relevancy 來提升相關性
        language='zh'         # 設定語言為中文
    )
    
    return jsonify(articles)  # 返回 JSON 格式的新聞資料

if __name__ == '__main__':
    app.run(debug=True)
