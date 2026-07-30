package com.construction.management.controller;

import com.construction.management.entity.Project;
import com.construction.management.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public List<Project> getAll() { return projectService.getAll(); }

    @GetMapping("/active")
    public List<Project> getActive() { return projectService.getActive(); }

    @GetMapping("/{id}")
    public Project getById(@PathVariable Long id) { return projectService.getById(id); }

    @PostMapping
    public Project create(@RequestBody Project project) { return projectService.save(project); }

    @PutMapping("/{id}")
    public Project update(@PathVariable Long id, @RequestBody Project project) {
        return projectService.update(id, project);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { projectService.delete(id); }
}
