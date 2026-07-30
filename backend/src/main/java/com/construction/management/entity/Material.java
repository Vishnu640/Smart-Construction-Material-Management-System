package com.construction.management.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "materials")
@Data
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long materialId;

    @Column(nullable = false)
    private String materialName;

    private String category;
    private int quantity;
    private double price;
    private String supplier;
    private int minStock = 100;
}
