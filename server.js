const express = require('express');

const authRouter = require('./router/authRouter');
const productRouter = require('./router/productRouter');
const categoryRouter = require('./router/categoryRouter');

const multer = require('multer');
const bodyParser = require('body-parser')
const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
const dotenv = require("dotenv")
dotenv.config()
const connectDB = require("./config/database")
connectDB()
app.use(express.urlencoded({ extended: true }))

app.use('/uploads', express.static('uploads'));

app.use(authRouter);
app.use( productRouter);
app.use(categoryRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running at  http://localhost:${PORT}`)
});
