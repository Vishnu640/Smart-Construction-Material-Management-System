package com.construction.management.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "expenses")
@Data
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long expenseId;

    private String description;
    private double amount;
    private LocalDate expenseDate;
    private String category = "OTHER"; // MATERIAL, LABOUR, TRANSPORT, OTHER
    private String projectName;
}
