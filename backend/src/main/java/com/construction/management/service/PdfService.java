package com.construction.management.service;

import com.construction.management.entity.*;
import com.construction.management.repository.*;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PdfService {

    private final MaterialRepository materialRepository;
    private final PurchaseRepository purchaseRepository;
    private final UsageRecordRepository usageRecordRepository;
    private final ExpenseRepository expenseRepository;
    private final SupplierRepository supplierRepository;

    private static final Font TITLE_FONT = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD, new BaseColor(26, 26, 46));
    private static final Font SUBTITLE_FONT = new Font(Font.FontFamily.HELVETICA, 11, Font.NORMAL, new BaseColor(113, 128, 150));
    private static final Font HEADER_FONT = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, BaseColor.WHITE);
    private static final Font CELL_FONT = new Font(Font.FontFamily.HELVETICA, 9, Font.NORMAL, new BaseColor(45, 55, 72));
    private static final Font TOTAL_FONT = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, new BaseColor(26, 26, 46));
    private static final BaseColor HEADER_BG = new BaseColor(26, 26, 46);
    private static final BaseColor ROW_ALT = new BaseColor(247, 250, 252);
    private static final BaseColor ACCENT = new BaseColor(233, 69, 96);

    private void addHeader(Document doc, String title, String subtitle) throws DocumentException {
        // Title bar
        PdfPTable titleBar = new PdfPTable(1);
        titleBar.setWidthPercentage(100);
        PdfPCell titleCell = new PdfPCell();
        titleCell.setBackgroundColor(HEADER_BG);
        titleCell.setPadding(16);
        titleCell.setBorder(Rectangle.NO_BORDER);
        Paragraph p = new Paragraph();
        p.add(new Chunk("🏗️  ", new Font(Font.FontFamily.HELVETICA, 16)));
        p.add(new Chunk("ConstructPro — " + title, TITLE_FONT));
        titleCell.addElement(p);
        Paragraph sub = new Paragraph(subtitle + "  |  Generated: " + LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy")),
                new Font(Font.FontFamily.HELVETICA, 9, Font.NORMAL, new BaseColor(160, 174, 192)));
        sub.setSpacingBefore(4);
        titleCell.addElement(sub);
        titleBar.addCell(titleCell);
        doc.add(titleBar);
        doc.add(Chunk.NEWLINE);
    }

    private PdfPCell headerCell(String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text, HEADER_FONT));
        cell.setBackgroundColor(HEADER_BG);
        cell.setPadding(8);
        cell.setBorderColor(new BaseColor(15, 52, 96));
        return cell;
    }

    private PdfPCell dataCell(String text, boolean alt) {
        PdfPCell cell = new PdfPCell(new Phrase(text, CELL_FONT));
        cell.setPadding(7);
        cell.setBackgroundColor(alt ? ROW_ALT : BaseColor.WHITE);
        cell.setBorderColor(new BaseColor(226, 232, 240));
        return cell;
    }

    private PdfPCell totalCell(String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text, TOTAL_FONT));
        cell.setPadding(8);
        cell.setBackgroundColor(new BaseColor(235, 248, 255));
        cell.setBorderColor(new BaseColor(190, 227, 248));
        return cell;
    }

    private void addFooter(Document doc, int count, String unit) throws DocumentException {
        doc.add(Chunk.NEWLINE);
        PdfPTable footer = new PdfPTable(1);
        footer.setWidthPercentage(100);
        PdfPCell cell = new PdfPCell(new Phrase("Total Records: " + count + " " + unit +
                "   |   Smart Construction Material Management System   |   Confidential",
                new Font(Font.FontFamily.HELVETICA, 8, Font.ITALIC, new BaseColor(113, 128, 150))));
        cell.setBorder(Rectangle.TOP);
        cell.setBorderColor(new BaseColor(226, 232, 240));
        cell.setPadding(8);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        footer.addCell(cell);
        doc.add(footer);
    }

    // ─── 1. Material Stock Report ───────────────────────────────────────────────
    public byte[] generateMaterialReport() throws Exception {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document doc = new Document(PageSize.A4.rotate(), 30, 30, 30, 30);
        PdfWriter.getInstance(doc, out);
        doc.open();

        addHeader(doc, "Material Stock Report", "Complete inventory of all construction materials");

        List<Material> materials = materialRepository.findAll();

        PdfPTable table = new PdfPTable(6);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{0.5f, 2.5f, 1.5f, 1f, 1f, 1.5f});

        table.addCell(headerCell("#"));
        table.addCell(headerCell("Material Name"));
        table.addCell(headerCell("Category"));
        table.addCell(headerCell("Quantity"));
        table.addCell(headerCell("Price ($)"));
        table.addCell(headerCell("Supplier"));

        double totalValue = 0;
        for (int i = 0; i < materials.size(); i++) {
            Material m = materials.get(i);
            boolean alt = i % 2 != 0;
            table.addCell(dataCell(String.valueOf(i + 1), alt));
            table.addCell(dataCell(m.getMaterialName(), alt));
            table.addCell(dataCell(m.getCategory() != null ? m.getCategory() : "-", alt));

            PdfPCell qtyCell = new PdfPCell(new Phrase(String.valueOf(m.getQuantity()),
                    m.getQuantity() < 100 ? new Font(Font.FontFamily.HELVETICA, 9, Font.BOLD, ACCENT) : CELL_FONT));
            qtyCell.setPadding(7);
            qtyCell.setBackgroundColor(alt ? ROW_ALT : BaseColor.WHITE);
            qtyCell.setBorderColor(new BaseColor(226, 232, 240));
            table.addCell(qtyCell);

            table.addCell(dataCell(String.format("%.2f", m.getPrice()), alt));
            table.addCell(dataCell(m.getSupplier() != null ? m.getSupplier() : "-", alt));
            totalValue += m.getQuantity() * m.getPrice();
        }

        // Total row
        table.addCell(totalCell(""));
        table.addCell(totalCell("TOTAL STOCK VALUE"));
        table.addCell(totalCell(""));
        table.addCell(totalCell(String.valueOf(materials.stream().mapToInt(Material::getQuantity).sum())));
        table.addCell(totalCell(""));
        table.addCell(totalCell(String.format("$%.2f", totalValue)));

        doc.add(table);
        addFooter(doc, materials.size(), "materials");
        doc.close();
        return out.toByteArray();
    }

    // ─── 2. Purchase Report ─────────────────────────────────────────────────────
    public byte[] generatePurchaseReport() throws Exception {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document doc = new Document(PageSize.A4.rotate(), 30, 30, 30, 30);
        PdfWriter.getInstance(doc, out);
        doc.open();

        addHeader(doc, "Purchase Report", "All material purchase transactions");

        List<Purchase> purchases = purchaseRepository.findAll();

        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{0.5f, 2.5f, 1f, 1.5f, 1.5f});

        table.addCell(headerCell("#"));
        table.addCell(headerCell("Material"));
        table.addCell(headerCell("Quantity"));
        table.addCell(headerCell("Total Cost ($)"));
        table.addCell(headerCell("Purchase Date"));

        double grandTotal = 0;
        for (int i = 0; i < purchases.size(); i++) {
            Purchase p = purchases.get(i);
            boolean alt = i % 2 != 0;
            table.addCell(dataCell(String.valueOf(i + 1), alt));
            table.addCell(dataCell(p.getMaterial() != null ? p.getMaterial().getMaterialName() : "-", alt));
            table.addCell(dataCell(String.valueOf(p.getQuantity()), alt));
            table.addCell(dataCell(String.format("$%.2f", p.getTotalCost()), alt));
            table.addCell(dataCell(p.getPurchaseDate() != null ? p.getPurchaseDate().toString() : "-", alt));
            grandTotal += p.getTotalCost();
        }

        table.addCell(totalCell(""));
        table.addCell(totalCell("GRAND TOTAL"));
        table.addCell(totalCell(String.valueOf(purchases.stream().mapToInt(Purchase::getQuantity).sum())));
        table.addCell(totalCell(String.format("$%.2f", grandTotal)));
        table.addCell(totalCell(""));

        doc.add(table);
        addFooter(doc, purchases.size(), "purchases");
        doc.close();
        return out.toByteArray();
    }

    // ─── 3. Usage Report ────────────────────────────────────────────────────────
    public byte[] generateUsageReport() throws Exception {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document doc = new Document(PageSize.A4.rotate(), 30, 30, 30, 30);
        PdfWriter.getInstance(doc, out);
        doc.open();

        addHeader(doc, "Daily Usage Report", "Material consumption across all projects");

        List<UsageRecord> records = usageRecordRepository.findAll();

        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{0.5f, 2f, 1.5f, 1f, 1.5f});

        table.addCell(headerCell("#"));
        table.addCell(headerCell("Material"));
        table.addCell(headerCell("Project"));
        table.addCell(headerCell("Used Qty"));
        table.addCell(headerCell("Date"));

        int totalUsed = 0;
        for (int i = 0; i < records.size(); i++) {
            UsageRecord r = records.get(i);
            boolean alt = i % 2 != 0;
            table.addCell(dataCell(String.valueOf(i + 1), alt));
            table.addCell(dataCell(r.getMaterial() != null ? r.getMaterial().getMaterialName() : "-", alt));
            table.addCell(dataCell(r.getProjectName() != null ? r.getProjectName() : "-", alt));
            table.addCell(dataCell(String.valueOf(r.getUsedQuantity()), alt));
            table.addCell(dataCell(r.getUsedDate() != null ? r.getUsedDate().toString() : "-", alt));
            totalUsed += r.getUsedQuantity();
        }

        table.addCell(totalCell(""));
        table.addCell(totalCell("TOTAL USED"));
        table.addCell(totalCell(""));
        table.addCell(totalCell(String.valueOf(totalUsed)));
        table.addCell(totalCell(""));

        doc.add(table);
        addFooter(doc, records.size(), "usage records");
        doc.close();
        return out.toByteArray();
    }

    // ─── 4. Expense Report ──────────────────────────────────────────────────────
    public byte[] generateExpenseReport() throws Exception {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document doc = new Document(PageSize.A4, 30, 30, 30, 30);
        PdfWriter.getInstance(doc, out);
        doc.open();

        addHeader(doc, "Expense Report", "All project expenses and costs");

        List<Expense> expenses = expenseRepository.findAll();

        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{0.5f, 3.5f, 1.5f, 1.5f});

        table.addCell(headerCell("#"));
        table.addCell(headerCell("Description"));
        table.addCell(headerCell("Amount ($)"));
        table.addCell(headerCell("Date"));

        double total = 0;
        for (int i = 0; i < expenses.size(); i++) {
            Expense e = expenses.get(i);
            boolean alt = i % 2 != 0;
            table.addCell(dataCell(String.valueOf(i + 1), alt));
            table.addCell(dataCell(e.getDescription() != null ? e.getDescription() : "-", alt));
            table.addCell(dataCell(String.format("$%.2f", e.getAmount()), alt));
            table.addCell(dataCell(e.getExpenseDate() != null ? e.getExpenseDate().toString() : "-", alt));
            total += e.getAmount();
        }

        table.addCell(totalCell(""));
        table.addCell(totalCell("TOTAL EXPENSES"));
        table.addCell(totalCell(String.format("$%.2f", total)));
        table.addCell(totalCell(""));

        doc.add(table);
        addFooter(doc, expenses.size(), "expenses");
        doc.close();
        return out.toByteArray();
    }

    // ─── 5. Supplier Report ─────────────────────────────────────────────────────
    public byte[] generateSupplierReport() throws Exception {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document doc = new Document(PageSize.A4, 30, 30, 30, 30);
        PdfWriter.getInstance(doc, out);
        doc.open();

        addHeader(doc, "Supplier Report", "All registered material suppliers");

        List<Supplier> suppliers = supplierRepository.findAll();

        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{0.5f, 2.5f, 1.5f, 3f});

        table.addCell(headerCell("#"));
        table.addCell(headerCell("Supplier Name"));
        table.addCell(headerCell("Phone"));
        table.addCell(headerCell("Address"));

        for (int i = 0; i < suppliers.size(); i++) {
            Supplier s = suppliers.get(i);
            boolean alt = i % 2 != 0;
            table.addCell(dataCell(String.valueOf(i + 1), alt));
            table.addCell(dataCell(s.getSupplierName(), alt));
            table.addCell(dataCell(s.getPhone() != null ? s.getPhone() : "-", alt));
            table.addCell(dataCell(s.getAddress() != null ? s.getAddress() : "-", alt));
        }

        doc.add(table);
        addFooter(doc, suppliers.size(), "suppliers");
        doc.close();
        return out.toByteArray();
    }
}
