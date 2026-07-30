package com.construction.management.repository;

import com.construction.management.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MaterialRepository extends JpaRepository<Material, Long> {
    List<Material> findByQuantityLessThan(int threshold);
    List<Material> findByCategoryIgnoreCase(String category);
}
