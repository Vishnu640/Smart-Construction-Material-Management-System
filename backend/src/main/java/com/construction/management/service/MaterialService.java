package com.construction.management.service;

import com.construction.management.entity.Material;
import com.construction.management.repository.MaterialRepository;
import com.construction.management.repository.PurchaseRepository;
import com.construction.management.repository.UsageRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MaterialService {

    private final MaterialRepository materialRepository;
    private final PurchaseRepository purchaseRepository;
    private final UsageRecordRepository usageRecordRepository;

    public List<Material> getAll() { return materialRepository.findAll(); }

    public Material getById(Long id) {
        return materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found: " + id));
    }

    public Material save(Material material) { return materialRepository.save(material); }

    public Material update(Long id, Material updated) {
        Material existing = getById(id);
        existing.setMaterialName(updated.getMaterialName());
        existing.setCategory(updated.getCategory());
        existing.setQuantity(updated.getQuantity());
        existing.setPrice(updated.getPrice());
        existing.setSupplier(updated.getSupplier());
        return materialRepository.save(existing);
    }

    public void delete(Long id) { materialRepository.deleteById(id); }

    public List<Material> getLowStock(int threshold) {
        return materialRepository.findByQuantityLessThan(threshold);
    }

    public int getAvailableStock(Long materialId) {
        Integer totalUsed = usageRecordRepository.totalUsedByMaterial(materialId);
        Material material = getById(materialId);
        return material.getQuantity() - (totalUsed != null ? totalUsed : 0);
    }
}
