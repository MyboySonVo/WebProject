package com.booking.api.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "nha_cung_cap")
@JsonIgnoreProperties({"vehicles"})
public class Provider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "provider_id")
    private Long id;

    @Column(name = "provider_name", nullable = false)
    private String providerName;

    @Column(name = "provider_type")
    private String providerType;

    @Column(name = "contact_info")
    private String contactInfo;

    @OneToMany(mappedBy = "provider", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Vehicle> vehicles;
}
