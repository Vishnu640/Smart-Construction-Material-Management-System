package com.construction.management.controller;

import com.construction.management.entity.UsageRecord;
import com.construction.management.repository.UsageRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final UsageRecordRepository usageRecordRepository;
    private final RestTemplate restTemplate;

    @GetMapping("/predict")
    public ResponseEntity<?> predict() {
        List<UsageRecord> records = usageRecordRepository.findAll();

        List<Map<String, Object>> usageData = records.stream()
                .filter(r -> r.getMaterial() != null && r.getUsedDate() != null)
                .map(r -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("material", r.getMaterial().getMaterialName());
                    m.put("usedQuantity", r.getUsedQuantity());
                    m.put("usedDate", r.getUsedDate().toString());
                    return m;
                }).toList();

        Map<String, Object> payload = Map.of("usageRecords", usageData);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    "http://localhost:5000/predict", entity, Map.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(503)
                    .body(Map.of("error", "AI service unavailable. Start the Python service: cd ai-service && python app.py"));
        }
    }
}
