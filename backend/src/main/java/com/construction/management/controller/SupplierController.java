package com.construction.management.controller;

import com.construction.management.entity.Supplier;
import com.construction.management.service.SupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    @GetMapping
    public List<Supplier> getAll() { return supplierService.getAll(); }

    @GetMapping("/{id}")
    public Supplier getById(@PathVariable Long id) { return supplierService.getById(id); }

    @PostMapping
    public Supplier create(@RequestBody Supplier supplier) { return supplierService.save(supplier); }

    @PutMapping("/{id}")
    public Supplier update(@PathVariable Long id, @RequestBody Supplier supplier) {
        return supplierService.update(id, supplier);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        supplierService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Deleted successfully"));
    }
}
