package com.construction.management.controller;

import com.construction.management.entity.Expense;
import com.construction.management.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @GetMapping
    public List<Expense> getAll() { return expenseService.getAll(); }

    @PostMapping
    public Expense create(@RequestBody Expense expense) { return expenseService.save(expense); }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        expenseService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Deleted successfully"));
    }
}
