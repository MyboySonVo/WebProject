package com.booking.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

    private Long id;
    private LocalDateTime bookingDate;
    private Double totalPrice;
    private String status;

    // Trip info
    private String origin;
    private String destination;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private String vehicleType;
    private String providerName;

    // Seats
    private List<String> seatNumbers;

    // Additional services
    private List<String> additionalServices;

    // Refund
    private Double refundAmount;
}
