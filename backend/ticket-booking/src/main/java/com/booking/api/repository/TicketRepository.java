package com.booking.api.repository;

import com.booking.api.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    boolean existsByTripIdAndSeatId(Long tripId, Long seatId);

    long countByTripId(Long tripId);
}
