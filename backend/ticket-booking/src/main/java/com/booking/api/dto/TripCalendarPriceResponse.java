package com.booking.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class TripCalendarPriceResponse {

    private LocalDate date;
    private Double minPrice;
    private boolean available;
}

