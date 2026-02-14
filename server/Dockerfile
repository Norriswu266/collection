# 使用 Node.js 官方映像檔
FROM node:18-alpine

# 設定工作目錄
WORKDIR /app

# 複製 package.json 與 package-lock.json
COPY package*.json ./

# 安裝依賴
RUN npm install

# 複製所有程式碼
COPY . .

# 開放 3000 port
EXPOSE 3000

# 啟動服務
CMD ["node", "index.js"]
