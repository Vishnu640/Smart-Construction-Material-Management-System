package com.construction.management.repository;

import com.construction.management.entity.UsageRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface UsageRecordRepository extends JpaRepository<UsageRecord, Long> {

    List<UsageRecord> findByMaterial_MaterialId(Long materialId);

    @Query("SELECT SUM(u.usedQuantity) FROM UsageRecord u WHERE u.material.materialId = :materialId")
    Integer totalUsedByMaterial(Long materialId);
}
