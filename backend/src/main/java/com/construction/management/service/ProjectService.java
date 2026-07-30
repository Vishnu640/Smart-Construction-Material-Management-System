package com.construction.management.service;

import com.construction.management.entity.Project;
import com.construction.management.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    public List<Project> getAll() { return projectRepository.findAll(); }

    public Project getById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found: " + id));
    }

    public Project save(Project project) { return projectRepository.save(project); }

    public Project update(Long id, Project updated) {
        Project existing = getById(id);
        existing.setProjectName(updated.getProjectName());
        existing.setLocation(updated.getLocation());
        existing.setEngineer(updated.getEngineer());
        existing.setStartDate(updated.getStartDate());
        existing.setEndDate(updated.getEndDate());
        existing.setProgress(updated.getProgress());
        existing.setMaterialRequirements(updated.getMaterialRequirements());
        existing.setStatus(updated.getStatus());
        return projectRepository.save(existing);
    }

    public void delete(Long id) { projectRepository.deleteById(id); }

    public List<Project> getActive() { return projectRepository.findByStatus("ACTIVE"); }
}
