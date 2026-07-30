package com.construction.management.service;

import com.construction.management.entity.Material;
import com.construction.management.entity.Purchase;
import com.construction.management.repository.MaterialRepository;
import com.construction.management.repository.PurchaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final MaterialRepository materialRepository;

    public List<Purchase> getAll() { return purchaseRepository.findAll(); }

    public Purchase save(Purchase purchase) {
        Purchase saved = purchaseRepository.save(purchase);
        // Update material stock
        Material material = saved.getMaterial();
        material.setQuantity(material.getQuantity() + saved.getQuantity());
        materialRepository.save(material);
        return saved;
    }

    public void delete(Long id) { purchaseRepository.deleteById(id); }

    public Double getMonthlyExpense(int month, int year) {
        Double total = purchaseRepository.sumCostByMonthAndYear(month, year);
        return total != null ? total : 0.0;
    }
}
