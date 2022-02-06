import express from "express";
import dotenv from "dotenv";
import colors from 'colors';
import connectDB from './config/db.js';

import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

// express는 스프링과 다르게 handler를 등록하는 순서가 중요하다.
// 모든 url을 처리하는 handler등록전에 parameter가 3개인 핸들러를 등록하면 request filter역할을 한다.
// 모든 url을 처라한 후 등록되는 handler는 response filter역할이다.
// parameter가 4개인 핸들러는 error handler이다. => 그렇지만 이 핸들러의 위치에 따라 처리하는 scope(영역)이 다르다.
// 그리고 다른 handler가 실행되게 하려면 next()를 넣어주어야 한다.

// 미들웨어로 filter역할을 할 메소드를 등록한다.
// 다른 request를 처리하는 로직전에 지정하면, request를 처리하기 전에 실행된다.
app.use((req, res, next) => {
  console.log(req.originalUrl);
  next();
})


app.get("/", (req, res) => {
  res.send("App is running");
});


app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes)

app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
})

// fake paypal javascript
app.get("/sdk/js", (req, res) => {
  const { "client-id" : clientId } = req.query;
  if(clientId !== process.env.PAYPAL_CLIENT_ID){
    res.status(404);
    throw new Error("client-id error");
  }
  res.send(null);
})

// 여기 전에 등록되어 있는 handler에서 해당되는 url이 없을 경우 실행 된다.
app.use(notFound)


// error handler를 등록한다.
// Error-handling middleware always takes four arguments.
app.use(errorHandler)

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Sever running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);
