package com.construction.management.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    private final Path uploadDir;

    public ImageController(@Value("${app.upload.dir:uploads}") String uploadDirPath) throws IOException {
        this.uploadDir = Paths.get(uploadDirPath).toAbsolutePath().normalize();
        Files.createDirectories(this.uploadDir);
    }

    @PostMapping("/upload")
    public Map<String, String> upload(@RequestParam("file") MultipartFile file,
                                      @RequestParam(value = "category", defaultValue = "general") String category) throws IOException {
        String ext = Optional.ofNullable(file.getOriginalFilename())
                .filter(f -> f.contains("."))
                .map(f -> f.substring(f.lastIndexOf('.')))
                .orElse(".jpg");
        String filename = category + "_" + UUID.randomUUID() + ext;
        Files.copy(file.getInputStream(), uploadDir.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
        return Map.of("filename", filename, "url", "/api/images/" + filename);
    }

    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> serve(@PathVariable String filename) throws IOException {
        Path file = uploadDir.resolve(filename).normalize();
        Resource resource = new UrlResource(file.toUri());
        if (!resource.exists()) return ResponseEntity.notFound().build();
        String contentType = Files.probeContentType(file);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType != null ? contentType : "application/octet-stream"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .body(resource);
    }

    @GetMapping
    public List<Map<String, String>> listImages() throws IOException {
        if (!Files.exists(uploadDir)) return List.of();
        return Files.list(uploadDir)
                .filter(p -> !Files.isDirectory(p))
                .map(p -> Map.of("filename", p.getFileName().toString(), "url", "/api/images/" + p.getFileName()))
                .collect(Collectors.toList());
    }

    @DeleteMapping("/{filename:.+}")
    public Map<String, String> delete(@PathVariable String filename) throws IOException {
        Files.deleteIfExists(uploadDir.resolve(filename).normalize());
        return Map.of("message", "Deleted");
    }
}
