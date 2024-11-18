// src/services/pdfService.js
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateInvoicePDF = (invoiceData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const outputPath = path.resolve("./output/invoice.pdf"); // Adjust as needed
      const writeStream = fs.createWriteStream(outputPath);

      // Pipe the PDF stream to a file
      doc.pipe(writeStream);

      // Header
      doc.fontSize(20).text("Invoice", { align: "center" });
      doc.moveDown();

      // Invoice Details
      doc.fontSize(12).text(`Invoice Number: ${invoiceData.invoiceNumber}`);
      doc.text(`Date: ${invoiceData.date}`);
      doc.moveDown();

      // Items Table
      doc.text("Items:");
      invoiceData.items.forEach((item) => {
        doc.text(`${item.description}: ${item.quantity} x $${item.price}`);
      });

      doc.moveDown();

      // Total
      doc.fontSize(14).text(`Total: $${invoiceData.total}`, { align: "right" });

      // Finalize and save
      doc.end();

      // Resolve the promise when the write stream finishes
      writeStream.on("finish", () => {
        resolve(outputPath);
      });

      writeStream.on("error", (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};
