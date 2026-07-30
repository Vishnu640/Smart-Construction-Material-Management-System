package com.construction.management.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 500)
    private String message;

    private String type; // LOW_STOCK, INFO, WARNING

    private boolean isRead = false;

    private LocalDateTime createdAt = LocalDateTime.now();

    private Long materialId;
}
