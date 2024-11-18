// src/routes/invoiceRoutes.js
import express from "express";
import { generateInvoice } from "../../controllers/invoiceController.js";

const invoiceRouter = express.Router();

// Define route to generate the invoice PDF
invoiceRouter.get("/generate-invoice", generateInvoice);

export default invoiceRouter;
