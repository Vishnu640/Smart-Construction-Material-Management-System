package com.construction.management.repository;

import com.construction.management.entity.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {

    @Query("SELECT SUM(p.totalCost) FROM Purchase p WHERE MONTH(p.purchaseDate) = :month AND YEAR(p.purchaseDate) = :year")
    Double sumCostByMonthAndYear(int month, int year);

    List<Purchase> findByMaterial_MaterialId(Long materialId);
}
