package com.construction.management.controller;

import com.construction.management.service.PdfService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports/pdf")
@RequiredArgsConstructor
public class PdfController {

    private final PdfService pdfService;

    @GetMapping("/materials")
    public ResponseEntity<byte[]> materialReport() throws Exception {
        return pdfResponse(pdfService.generateMaterialReport(), "material_stock_report.pdf");
    }

    @GetMapping("/purchases")
    public ResponseEntity<byte[]> purchaseReport() throws Exception {
        return pdfResponse(pdfService.generatePurchaseReport(), "purchase_report.pdf");
    }

    @GetMapping("/usage")
    public ResponseEntity<byte[]> usageReport() throws Exception {
        return pdfResponse(pdfService.generateUsageReport(), "usage_report.pdf");
    }

    @GetMapping("/expenses")
    public ResponseEntity<byte[]> expenseReport() throws Exception {
        return pdfResponse(pdfService.generateExpenseReport(), "expense_report.pdf");
    }

    @GetMapping("/suppliers")
    public ResponseEntity<byte[]> supplierReport() throws Exception {
        return pdfResponse(pdfService.generateSupplierReport(), "supplier_report.pdf");
    }

    private ResponseEntity<byte[]> pdfResponse(byte[] pdf, String filename) {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
