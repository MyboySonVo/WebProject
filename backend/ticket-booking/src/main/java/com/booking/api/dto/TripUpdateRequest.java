package com.booking.api.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TripUpdateRequest {

    private LocalDateTime newDepartureTime;
    private LocalDateTime newArrivalTime;

    @NotNull(message = "Cần phải có lý do cập nhật")
    private String reason;
}
