package com.construction.management.controller;

import com.construction.management.entity.UsageRecord;
import com.construction.management.service.UsageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usage")
@RequiredArgsConstructor
public class UsageController {

    private final UsageService usageService;

    @GetMapping
    public List<UsageRecord> getAll() { return usageService.getAll(); }

    @PostMapping
    public UsageRecord create(@RequestBody UsageRecord record) { return usageService.save(record); }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        usageService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Deleted successfully"));
    }

    @GetMapping("/material/{materialId}")
    public List<UsageRecord> getByMaterial(@PathVariable Long materialId) {
        return usageService.getByMaterial(materialId);
    }
}
