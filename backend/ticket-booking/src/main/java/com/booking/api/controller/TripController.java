package com.booking.api.controller;

import com.booking.api.dto.SeatResponse;
import com.booking.api.dto.TripCalendarPriceResponse;
import com.booking.api.dto.TripSearchResponse;
import com.booking.api.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    @GetMapping("/search")
    public List<TripSearchResponse> searchTrips(
            @RequestParam("from") String from,
            @RequestParam("to") String to,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "passengers", required = false) Integer passengers) {
        return tripService.searchTrips(from, to, date, type, passengers);
    }

    @GetMapping("/{tripId}")
    public TripSearchResponse getTripDetail(@PathVariable Long tripId) {
        return tripService.getTripDetail(tripId);
    }

    @GetMapping("/{tripId}/seats")
    public List<SeatResponse> getSeats(@PathVariable Long tripId) {
        return tripService.getSeatsForTrip(tripId);
    }

    @GetMapping("/calendar")
    public List<TripCalendarPriceResponse> getCalendarPrices(
            @RequestParam("from") String from,
            @RequestParam("to") String to,
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "passengers", required = false) Integer passengers) {
        return tripService.getCalendarPrices(from, to, start, end, type, passengers);
    }
}
