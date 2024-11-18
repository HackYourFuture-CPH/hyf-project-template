// src/services/pdfService.js
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateInvoicePDF = (invoiceData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 }); // Add margin for spacing
      const outputPath = path.resolve("./output/invoice.pdf");
      const writeStream = fs.createWriteStream(outputPath);

      // Pipe the PDF stream to a file
      doc.pipe(writeStream);

      // Add header section
      doc
        .fontSize(20)
        .font("Helvetica-Bold")
        .text("Invoice", { align: "center" })
        .moveDown(1);

      doc
        .fontSize(12)
        .font("Helvetica")
        .text(`Invoice Number: ${invoiceData.invoiceNumber}`, { align: "left" })
        .text(`Date: ${invoiceData.date}`, { align: "left" })
        .moveDown(1);

      // Add line separator
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke("#aaaaaa").moveDown(1);

      // Add items table header
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Description", 50, doc.y)
        .text("Quantity", 300, doc.y, { width: 90, align: "right" })
        .text("Price", 400, doc.y, { width: 90, align: "right" })
        .text("Total", 500, doc.y, { width: 90, align: "right" })
        .moveDown(0.5);

      // Add another line separator
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke("#000000");

      // Add items table rows
      doc.font("Helvetica");
      invoiceData.items.forEach((item) => {
        const itemTotal = (item.quantity * item.price).toFixed(2);
        doc
          .text(item.description, 50)
          .text(item.quantity, 300, doc.y, { width: 90, align: "right" })
          .text(`$${item.price.toFixed(2)}`, 400, doc.y, {
            width: 90,
            align: "right",
          })
          .text(`$${itemTotal}`, 500, doc.y, { width: 90, align: "right" });
      });

      // Add another line separator
      doc
        .moveTo(50, doc.y + 10)
        .lineTo(550, doc.y + 10)
        .stroke("#aaaaaa");

      // Add total amount
      doc
        .moveDown(1)
        .fontSize(14)
        .font("Helvetica-Bold")
        .text(`Total: $${invoiceData.total.toFixed(2)}`, { align: "right" });

      // Footer
      doc
        .moveDown(2)
        .fontSize(10)
        .font("Helvetica")
        .fillColor("gray")
        .text("Thank you for your business!", { align: "center" });

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
