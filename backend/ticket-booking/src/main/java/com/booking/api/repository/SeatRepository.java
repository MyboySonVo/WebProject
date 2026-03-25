package com.booking.api.repository;

import com.booking.api.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SeatRepository extends JpaRepository<Seat, Long> {

    List<Seat> findByVehicleId(Long vehicleId);
}

