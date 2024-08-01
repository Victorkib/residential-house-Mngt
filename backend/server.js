/* eslint-disable no-undef */
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

//routes import
import authRoutes from './Routes/auth.routes.js';
import tenantRoutes from './Routes/tenant.routes.js';
import landLordRoutes from './Routes/landLord.routes.js';
import paymentsRoutes from './Routes/payment.routes.js';

const app = express();
const port = process.env.PORT || 5500;
//middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

//db connection
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log('success db connection');
    app.listen(port, () => {
      console.log(`server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log('error connecting to db: ', err);
  });

//routes
app.use('/api/auth', authRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/landlords', landLordRoutes);
app.use('/api/payments', paymentsRoutes);
