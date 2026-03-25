package com.booking.api.repository;

import com.booking.api.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {

    @Query("SELECT t FROM Trip t " +
            "WHERE t.route.origin = :origin " +
            "AND t.route.destination = :destination " +
            "AND t.departureTime BETWEEN :start AND :end " +
            "AND (:vehicleType IS NULL OR t.vehicle.vehicleType = :vehicleType)")
    List<Trip> searchTrips(@Param("origin") String origin,
                           @Param("destination") String destination,
                           @Param("start") LocalDateTime start,
                           @Param("end") LocalDateTime end,
                           @Param("vehicleType") String vehicleType);
}

