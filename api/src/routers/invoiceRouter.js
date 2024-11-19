// src/routes/invoiceRoutes.js
import express from "express";
import { generateInvoice } from "../../controllers/invoiceController.js";

const invoiceRouter = express.Router();

invoiceRouter.get("/generate-invoice-project/:id", generateInvoice);

export default invoiceRouter;
