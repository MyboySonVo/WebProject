package com.booking.api.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "khuyen_mai")
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "level_id")
    private Long id;

    @Column(name = "level_name")
    private String levelName;

    @Column(name = "discount_percent")
    private Double discountPercent;

    @OneToMany(mappedBy = "promotion", cascade = CascadeType.ALL)
    private List<User> users;
}
