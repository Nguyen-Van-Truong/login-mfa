// login-backend\index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const mfaRoutes = require('./routes/mfaRoutes');
const userRoutes = require('./routes/userRoutes');
const cookieParser = require('cookie-parser');

const app = express();

// Cấu hình cors và body-parser
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(bodyParser.json());

app.use('', authRoutes);
app.use('', mfaRoutes);
app.use('', userRoutes);

app.listen(3000, () => {
    console.log('Server đang chạy tại cổng 3000');
});
