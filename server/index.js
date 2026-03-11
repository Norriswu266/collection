const express = require('express');
const cors = require('cors');
const client = require('prom-client');
const app = express();
const port = 3000;

client.collectDefaultMetrics();

const httpRequestsTotal = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
});

app.use(cors());

app.use((req, res, next) => {
    res.on('finish', () => {
        httpRequestsTotal.inc({
            method: req.method,
            route: req.path,
            status_code: res.statusCode,
        });
    });
    next();
});

// 推薦項目資料
const recommendations = [
    { id: 1, title: '優質書籍' },
    { id: 2, title: '熱門電影' },
    { id: 3, title: '實用工具' },
    { id: 4, title: '精選網站' },
    { id: 5, title: '熱門應用程式' }
];

app.get('/metrics', async (_req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.send(await client.register.metrics());
});

// API 路由
app.get('/api/recommendations', (req, res) => {
    res.json(recommendations);
});

app.get('/', (req, res) => {
  res.send('Hello AKS 🚀')
})

// 測試用：模擬 500 錯誤
app.get('/test/error', (req, res) => {
  res.status(500).json({ error: 'Internal Server Error' });
})

// app.listen(port, () => {
//     console.log(`推薦 API 已啟動於 http://localhost:${port}`);
// });


app.listen(port, "0.0.0.0", () => {
    console.log(`推薦 API 已啟動於 http://0.0.0.0:${port}`);
});