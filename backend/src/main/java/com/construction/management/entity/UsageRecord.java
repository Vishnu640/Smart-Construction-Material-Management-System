package com.construction.management.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "usage_records")
@Data
public class UsageRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long usageId;

    @ManyToOne
    @JoinColumn(name = "material_id")
    private Material material;

    private int usedQuantity;
    private LocalDate usedDate;
    private String projectName;
}
