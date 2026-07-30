package com.construction.management.service;

import com.construction.management.entity.Material;
import com.construction.management.entity.Notification;
import com.construction.management.repository.MaterialRepository;
import com.construction.management.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final MaterialRepository materialRepository;
    private final NotificationRepository notificationRepository;

    // Run every 30 seconds
    @Scheduled(fixedRate = 30000)
    public void checkLowStock() {
        List<Material> materials = materialRepository.findAll();
        for (Material m : materials) {
            if (m.getQuantity() < m.getMinStock()) {
                // Only create if no unread alert exists for this material
                if (!notificationRepository.existsByMaterialIdAndIsReadFalse(m.getMaterialId())) {
                    Notification n = new Notification();
                    n.setTitle("⚠️ Low Stock Alert: " + m.getMaterialName());
                    n.setMessage("Only " + m.getQuantity() + " units remaining. Minimum required: "
                            + m.getMinStock() + ". Please purchase more.");
                    n.setType("LOW_STOCK");
                    n.setMaterialId(m.getMaterialId());
                    notificationRepository.save(n);
                    log.warn("Low stock alert created for: {}", m.getMaterialName());
                }
            }
        }
    }

    public List<Notification> getUnread() {
        return notificationRepository.findByIsReadFalseOrderByCreatedAtDesc();
    }

    public List<Notification> getAll() {
        return notificationRepository.findAllByOrderByCreatedAtDesc();
    }

    public long getUnreadCount() {
        return notificationRepository.countByIsReadFalse();
    }

    public void markAllRead() {
        List<Notification> unread = notificationRepository.findByIsReadFalseOrderByCreatedAtDesc();
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    public void markRead(Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    public void deleteAll() {
        notificationRepository.deleteAll();
    }
}
