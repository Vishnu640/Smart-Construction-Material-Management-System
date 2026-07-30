package com.construction.management.controller;

import com.construction.management.entity.Material;
import com.construction.management.service.MaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/materials")
@RequiredArgsConstructor
public class MaterialController {

    private final MaterialService materialService;

    @GetMapping
    public List<Material> getAll() { return materialService.getAll(); }

    @GetMapping("/{id}")
    public Material getById(@PathVariable Long id) { return materialService.getById(id); }

    @PostMapping
    public Material create(@RequestBody Material material) { return materialService.save(material); }

    @PutMapping("/{id}")
    public Material update(@PathVariable Long id, @RequestBody Material material) {
        return materialService.update(id, material);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        materialService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Deleted successfully"));
    }

    @GetMapping("/low-stock")
    public List<Material> getLowStock(@RequestParam(defaultValue = "100") int threshold) {
        return materialService.getLowStock(threshold);
    }

    @GetMapping("/{id}/stock")
    public Map<String, Integer> getStock(@PathVariable Long id) {
        return Map.of("availableStock", materialService.getAvailableStock(id));
    }
}
