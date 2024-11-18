// src/controllers/pdfController.js
import { generateInvoicePDF } from "../services/pdfService.js";
import fs from "fs";

export const generateInvoice = async (req, res) => {
  try {
    const invoiceData = {
      invoiceNumber: "INV12345",
      date: new Date().toISOString().split("T")[0],
      items: [
        { description: "Widget A", quantity: 2, price: 20.5 },
        { description: "Widget B", quantity: 1, price: 15.0 },
        { description: "Service C", quantity: 3, price: 10.0 },
      ],
      total: 76.0,
    };

    const filePath = await generateInvoicePDF(invoiceData);

    // Send the PDF as a response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="invoice.pdf"');
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // Optionally, delete the file after sending
    fileStream.on("end", () => {
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error("Error generating invoice:", error);
    res.status(500).json({ error: "Failed to generate invoice" });
  }
};
