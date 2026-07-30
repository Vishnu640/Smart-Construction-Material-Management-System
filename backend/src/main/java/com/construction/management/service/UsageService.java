package com.construction.management.service;

import com.construction.management.entity.Material;
import com.construction.management.entity.UsageRecord;
import com.construction.management.repository.MaterialRepository;
import com.construction.management.repository.UsageRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsageService {

    private final UsageRecordRepository usageRecordRepository;
    private final MaterialRepository materialRepository;

    public List<UsageRecord> getAll() { return usageRecordRepository.findAll(); }

    public UsageRecord save(UsageRecord record) {
        UsageRecord saved = usageRecordRepository.save(record);
        // Deduct from material stock
        Material material = saved.getMaterial();
        int newQty = material.getQuantity() - saved.getUsedQuantity();
        material.setQuantity(Math.max(newQty, 0));
        materialRepository.save(material);
        return saved;
    }

    public void delete(Long id) { usageRecordRepository.deleteById(id); }

    public List<UsageRecord> getByMaterial(Long materialId) {
        return usageRecordRepository.findByMaterial_MaterialId(materialId);
    }
}
