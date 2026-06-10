require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorMiddleware');
const {globalLimite} = require('./middleware/rateLimiterMiddleware');
const app = express();

const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const cartRouter = require('./routes/cartRoutes');
const orderRouter = require('./routes/orderRoutes');
 

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(globalLimite)
app.get('/', (req, res) => {
     res.json({
    success: true,
    message: "E-commerce Backend API Running 🚀"
  });
})

app.use('/user', userRouter);
app.use('/product', productRouter);
app.use('/cart', cartRouter);
app.use('/order', orderRouter);
 
app.use(errorHandler);

module.exports = app;