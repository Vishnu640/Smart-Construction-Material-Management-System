package com.construction.management.service;

import com.construction.management.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final MaterialRepository materialRepository;
    private final PurchaseRepository purchaseRepository;
    private final UsageRecordRepository usageRecordRepository;
    private final ExpenseRepository expenseRepository;

    public Map<String, Object> getSummary() {
        LocalDate now = LocalDate.now();
        int month = now.getMonthValue();
        int year = now.getYear();

        long totalMaterials = materialRepository.count();
        int totalStock = materialRepository.findAll()
                .stream().mapToInt(m -> m.getQuantity()).sum();
        long lowStockItems = materialRepository.findByQuantityLessThan(100).size();

        Double monthlyExpense = purchaseRepository.sumCostByMonthAndYear(month, year);

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalMaterials", totalMaterials);
        summary.put("totalStock", totalStock);
        summary.put("lowStockItems", lowStockItems);
        summary.put("monthlyExpense", monthlyExpense != null ? monthlyExpense : 0.0);
        return summary;
    }
}
