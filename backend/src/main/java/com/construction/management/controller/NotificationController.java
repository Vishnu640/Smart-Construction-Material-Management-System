package com.construction.management.controller;

import com.construction.management.entity.Notification;
import com.construction.management.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public List<Notification> getAll() {
        return notificationService.getAll();
    }

    @GetMapping("/unread")
    public List<Notification> getUnread() {
        return notificationService.getUnread();
    }

    @GetMapping("/count")
    public Map<String, Long> getCount() {
        return Map.of("count", notificationService.getUnreadCount());
    }

    @PutMapping("/mark-all-read")
    public Map<String, String> markAllRead() {
        notificationService.markAllRead();
        return Map.of("message", "All notifications marked as read");
    }

    @PutMapping("/{id}/read")
    public Map<String, String> markRead(@PathVariable Long id) {
        notificationService.markRead(id);
        return Map.of("message", "Notification marked as read");
    }

    @DeleteMapping
    public Map<String, String> deleteAll() {
        notificationService.deleteAll();
        return Map.of("message", "All notifications cleared");
    }
}
