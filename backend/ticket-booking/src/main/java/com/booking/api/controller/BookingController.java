package com.booking.api.controller;

import com.booking.api.dto.BookingRequest;
import com.booking.api.dto.BookingResponse;
import com.booking.api.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody BookingRequest request) {
        BookingResponse response = bookingService.createBooking(userDetails.getUsername(), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<BookingResponse>> getMyBookings(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<BookingResponse> responses = bookingService.getMyBookings(userDetails.getUsername());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingDetail(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        BookingResponse response = bookingService.getBookingDetail(userDetails.getUsername(), id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        BookingResponse response = bookingService.cancelBooking(userDetails.getUsername(), id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<BookingResponse> completeBooking(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        BookingResponse response = bookingService.completeBooking(userDetails.getUsername(), id);
        return ResponseEntity.ok(response);
    }
}
