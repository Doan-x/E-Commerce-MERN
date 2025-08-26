const express = require('express');
require('dotenv').config();
const dbconnect = require('./config/dbconnect');
const initRoute = require('./routes')
const cookieParser = require('cookie-parser')
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cookieParser());
// đọc data theo kiểu urlencoded
app.use(express.urlencoded({ extended: true }));
dbconnect();
initRoute(app);

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});