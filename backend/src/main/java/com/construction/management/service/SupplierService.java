package com.construction.management.service;

import com.construction.management.entity.Supplier;
import com.construction.management.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public List<Supplier> getAll() { return supplierRepository.findAll(); }

    public Supplier getById(Long id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found: " + id));
    }

    public Supplier save(Supplier supplier) { return supplierRepository.save(supplier); }

    public Supplier update(Long id, Supplier updated) {
        Supplier existing = getById(id);
        existing.setSupplierName(updated.getSupplierName());
        existing.setPhone(updated.getPhone());
        existing.setAddress(updated.getAddress());
        return supplierRepository.save(existing);
    }

    public void delete(Long id) { supplierRepository.deleteById(id); }
}
