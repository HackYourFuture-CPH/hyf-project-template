import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateInvoicePDF = (invoiceData, filePath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margin: 50,
        size: "A4",
      });

      // const outputPath = path.resolve("./output/invoice.pdf");
      // const writeStream = fs.createWriteStream(outputPath);
      const writeStream = fs.createWriteStream(filePath);
      const logoPath = path.resolve("./public/logo.png");

      doc.image(logoPath, 50, 50, { width: 60 }); // Add logo at top left

      doc.pipe(writeStream);

      // Helper function for drawing lines
      const drawLine = (yPosition) => {
        doc
          .strokeColor("#E5E7EB")
          .lineWidth(1)
          .moveTo(50, yPosition)
          .lineTo(550, yPosition)
          .stroke();
      };

      // Header section with proper spacing
      const pageTop = 50; // Start from absolute position
      doc
        .font("Helvetica-Bold")
        .fontSize(28)
        .text("INVOICE", { align: "center" })
        .moveDown(0.5) // Reduced space between title and number
        .fontSize(12)
        .fillColor("#6B7280")
        .text(`#${invoiceData.invoiceNumber}`, { align: "center" });

      // Invoice details section with fixed positioning
      const detailsTop = pageTop + 100; // Fixed position for details section

      // Left side - Date Issued
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor("#374151")
        .text("Date Issued", 50, detailsTop)
        .font("Helvetica")
        .fontSize(10)
        .fillColor("#6B7280")
        .text(invoiceData.date, 50, detailsTop + 15);

      // Right side - Due Date
      const dueDate = new Date(
        new Date(invoiceData.date).getTime() + 30 * 24 * 60 * 60 * 1000
      ).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor("#374151")
        .text("Due Date", 400, detailsTop)
        .font("Helvetica")
        .fontSize(10)
        .fillColor("#6B7280")
        .text(dueDate, 400, detailsTop + 15);

      // Items table header with fixed positioning
      const tableTop = detailsTop + 60; // Fixed position for table
      doc.fillColor("#F3F4F6").rect(50, tableTop, 500, 30).fill();

      // Table headers with proper width allocation
      const colDesc = 50;
      const colQty = 320;
      const colPrice = 400;
      const colTotal = 470;

      doc
        .fillColor("#374151")
        .font("Helvetica-Bold")
        .fontSize(10)
        .text("Description", colDesc + 15, tableTop + 10)
        .text("Quantity", colQty, tableTop + 10)
        .text("Price", colPrice, tableTop + 10)
        .text("Total", colTotal, tableTop + 10);

      // Items table rows with proper spacing
      let yPosition = tableTop + 40;

      invoiceData.items.forEach((item, index) => {
        const itemTotal = formatCurrencyDKK(
          Number(item.quantity) * Number(item.price)
        );

        // Alternate row background
        if (index % 2 === 0) {
          doc
            .fillColor("#F9FAFB")
            .rect(50, yPosition - 10, 500, 30)
            .fill();
        }

        doc
          .fillColor("#374151")
          .font("Helvetica")
          .fontSize(10)
          .text(item.description, colDesc + 15, yPosition, { width: 270 })
          .text(item.quantity.toString(), colQty, yPosition)
          .text(`${formatCurrencyDKK(Number(item.price))}`, colPrice, yPosition)
          .text(`${itemTotal}`, colTotal, yPosition);

        yPosition += 30;
      });

      // Draw bottom line
      drawLine(yPosition + 10);

      // Totals section with fixed positioning
      const totalsStartY = yPosition + 30;

      // Subtotal
      doc
        .font("Helvetica")
        .text("Subtotal:", 400, totalsStartY)
        .text(
          `${formatCurrencyDKK(Number(invoiceData.total))}`,
          470,
          totalsStartY
        );

      // Tax
      doc
        .text("Tax (0%):", 400, totalsStartY + 20)
        .text("0.00", 470, totalsStartY + 20);

      // Total line
      drawLine(totalsStartY + 35);

      // Final total with proper spacing
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .text("Total:", 400, totalsStartY + 50)
        .text(
          `${formatCurrencyDKK(Number(invoiceData.total))}`,
          470,
          totalsStartY + 50
        );

      // Footer with fixed positioning
      const footerTop = totalsStartY + 120;
      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("#6B7280")
        .text("Thank you for your business!", 50, footerTop, {
          align: "center",
          width: 500,
        })
        .moveDown(0.5)
        .text("Questions? Email support@YARsolutions.com", 50, footerTop + 20, {
          align: "center",
          width: 500,
        });

      // Finalize PDF
      doc.end();

      writeStream.on("finish", () => {
        resolve(filePath);
      });

      writeStream.on("error", (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};

const formatCurrencyDKK = (amount) => {
  return new Intl.NumberFormat("da-DK", {
    style: "currency",
    currency: "DKK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
