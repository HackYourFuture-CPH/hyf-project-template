import { generateInvoicePDF } from "../services/pdfService.js";
import fs from "fs";

export const generateInvoice = async (req, res) => {
  try {
    const invoiceData = {
      invoiceNumber: "INV12345",
      date: new Date().toISOString().split("T")[0],
      items: [
        { description: "Web Development Services", quantity: 1, price: 1500.0 },
        { description: "UI/UX Design", quantity: 2, price: 750.0 },
        { description: "Content Writing", quantity: 5, price: 100.0 },
      ],
      total: 3200.0,
    };

    const filePath = await generateInvoicePDF(invoiceData);

    res.setHeader("Content-Type", "application/pdf");
    // eslint-disable-next-line quotes
    res.setHeader("Content-Disposition", 'attachment; filename="invoice.pdf"');
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on("end", () => {
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error("Error generating invoice:", error);
    res.status(500).json({ error: "Failed to generate invoice" });
  }
};
