/* eslint-disable no-undef */
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

// Import middleware
import verifyJWT from './middleware/jwtMiddleware.js';
import verifyTokenRoute from './Routes/v2/routes/verifyToken.routes.js';

//routes import
import authRoutes from './Routes/auth.routes.js';
import tenantRoutes from './Routes/tenant.routes.js';
import landLordRoutes from './Routes/landLord.routes.js';
import paymentsRoutes from './Routes/payment.routes.js';
import housesRoutes from './Routes/house.routes.js';
import kraRoutes from './Routes/kra.routes.js';
import apartmentRoutes from './Routes/v2/routes/Apartment.routes.js';

//v2 tenants
import v2TenantRoutes from './Routes/v2/routes/tenant.routes.js';
import v2PaymentRoutes from './Routes/v2/routes/payment.routes.js';
import InvoiceRoutes from './Routes/v2/routes/invoice.routes.js';
import floorRoutes from './Routes/v2/routes/floor.routes.js';

import clearanceRoutes from './Routes/v2/routes/clearance.routes.js';
import { restoreScheduledJobs } from './controllers/v2/controllers/tenant.controller.js';

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

// Apply the JWT middleware globally (except for /api/auth)
app.use(verifyJWT);

//db connection
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log('success db connection');
    // Call to restore any scheduled jobs on server startup
    restoreScheduledJobs();

    app.listen(port, () => {
      console.log(`server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log('error connecting to db: ', err);
  });

//routes
app.use('/api/jwt', verifyTokenRoute);
app.use('/api/auth', authRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/landlords', landLordRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/houses', housesRoutes);
app.use('/api/kra', kraRoutes);

//v2 routes
app.use('/api/v2/tenants', v2TenantRoutes);
app.use('/api/v2/payments', v2PaymentRoutes);
app.use('/api/v2/apartments', apartmentRoutes);
app.use('/api/v2/invoices', InvoiceRoutes);
app.use('/api/v2/clearance', clearanceRoutes);
app.use('/api/v2/floors', floorRoutes);
