const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

// 推薦項目資料
const recommendations = [
    { id: 1, title: '優質書籍' },
    { id: 2, title: '熱門電影' },
    { id: 3, title: '實用工具' },
    { id: 4, title: '精選網站' },
    { id: 5, title: '熱門應用程式' }
];

// API 路由
app.get('/api/recommendations', (req, res) => {
    res.json(recommendations);
});

app.get('/', (req, res) => {
  res.send('Hello AKS 🚀')
})

// app.listen(port, () => {
//     console.log(`推薦 API 已啟動於 http://localhost:${port}`);
// });


app.listen(port, () => {
    console.log(`推薦 API 已啟動於 http://localhost:${port}`);
});
