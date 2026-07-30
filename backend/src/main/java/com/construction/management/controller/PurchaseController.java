package com.construction.management.controller;

import com.construction.management.entity.Purchase;
import com.construction.management.service.PurchaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/purchases")
@RequiredArgsConstructor
public class PurchaseController {

    private final PurchaseService purchaseService;

    @GetMapping
    public List<Purchase> getAll() { return purchaseService.getAll(); }

    @PostMapping
    public Purchase create(@RequestBody Purchase purchase) { return purchaseService.save(purchase); }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        purchaseService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Deleted successfully"));
    }

    @GetMapping("/monthly-expense")
    public Map<String, Double> getMonthlyExpense(@RequestParam int month, @RequestParam int year) {
        return Map.of("total", purchaseService.getMonthlyExpense(month, year));
    }
}
