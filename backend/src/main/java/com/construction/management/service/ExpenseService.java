package com.construction.management.service;

import com.construction.management.entity.Expense;
import com.construction.management.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public List<Expense> getAll() { return expenseRepository.findAll(); }

    public Expense save(Expense expense) { return expenseRepository.save(expense); }

    public void delete(Long id) { expenseRepository.deleteById(id); }

    public Double getMonthlyTotal(int month, int year) {
        Double total = expenseRepository.sumByMonthAndYear(month, year);
        return total != null ? total : 0.0;
    }
}
