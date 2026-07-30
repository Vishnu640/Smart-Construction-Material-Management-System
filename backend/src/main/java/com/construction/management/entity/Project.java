package com.construction.management.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "projects")
@Data
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long projectId;

    @Column(nullable = false)
    private String projectName;

    private String location;
    private String engineer;
    private LocalDate startDate;
    private LocalDate endDate;
    private int progress; // 0-100

    @Column(length = 1000)
    private String materialRequirements; // JSON string: [{"material":"Steel","qty":5000}]

    private String status = "ACTIVE"; // ACTIVE, COMPLETED, ON_HOLD
}
