package com.construction.management.repository;

import com.construction.management.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByIsReadFalseOrderByCreatedAtDesc();
    List<Notification> findAllByOrderByCreatedAtDesc();
    long countByIsReadFalse();
    boolean existsByMaterialIdAndIsReadFalse(Long materialId);
}
