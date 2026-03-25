package com.booking.api.service;

import com.booking.api.dto.BookingRequest;
import com.booking.api.dto.BookingResponse;
import com.booking.api.entity.*;
import com.booking.api.exception.BookingException;
import com.booking.api.exception.ResourceNotFoundException;
import com.booking.api.mapper.BookingMapper;
import com.booking.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final TripRepository tripRepository;
    private final SeatRepository seatRepository;
    private final TicketRepository ticketRepository;
    private final AdditionalServiceRepository additionalServiceRepository;
    private final BookingMapper bookingMapper;
    private final EmailService emailService;

    @Transactional
    public BookingResponse createBooking(String email, BookingRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user"));

        Trip trip = tripRepository.findById(request.getTripId())
                .orElseThrow(() -> new ResourceNotFoundException("Chuyến đi", request.getTripId()));

        List<Ticket> tickets = new ArrayList<>();
        double totalPrice = 0;

        for (Long seatId : request.getSeatIds()) {
            Seat seat = seatRepository.findById(seatId)
                    .orElseThrow(() -> new ResourceNotFoundException("Ghế", seatId));

            if (ticketRepository.existsByTripIdAndSeatId(trip.getId(), seat.getId())) {
                throw new BookingException("Ghế " + seat.getSeatNumber() + " đã được đặt cho chuyến này");
            }

            double seatPrice = trip.getPrice();
            if ("VIP".equalsIgnoreCase(seat.getSeatType())) {
                seatPrice *= 2; // Ghế VIP giá gấp đôi
            }

            Ticket ticket = new Ticket();
            ticket.setTrip(trip);
            ticket.setSeat(seat);
            ticket.setPrice(seatPrice);
            tickets.add(ticket);

            totalPrice += seatPrice;
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setBookingDate(LocalDateTime.now());
        booking.setTotalPrice(totalPrice);
        booking.setStatus("PENDING");

        if (request.getAdditionalServiceIds() != null && !request.getAdditionalServiceIds().isEmpty()) {
            List<AdditionalService> services = additionalServiceRepository.findAllById(request.getAdditionalServiceIds());
            booking.setAdditionalServices(services);
            double servicesTotal = services.stream().mapToDouble(s -> s.getPrice() != null ? s.getPrice() : 0).sum();
            booking.setTotalPrice(totalPrice + servicesTotal);
        } else {
            booking.setAdditionalServices(Collections.emptyList());
        }

        // Apply membership discount
        double discountPercent = UserService.getDiscount(user.getPoints() != null ? user.getPoints() : 0);
        if (discountPercent > 0) {
            double discountAmount = booking.getTotalPrice() * (discountPercent / 100.0);
            booking.setTotalPrice(booking.getTotalPrice() - discountAmount);
        }

        for (Ticket ticket : tickets) {
            ticket.setBooking(booking);
        }
        booking.setTickets(tickets);

        bookingRepository.save(booking);

        return bookingMapper.toBookingResponse(booking, trip);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user"));

        List<Booking> bookings = bookingRepository.findByUserIdOrderByBookingDateDesc(user.getId());

        return bookings.stream()
                .map(booking -> {
                    Trip trip = null;
                    if (booking.getTickets() != null && !booking.getTickets().isEmpty()) {
                        trip = booking.getTickets().get(0).getTrip();
                    }
                    return bookingMapper.toBookingResponse(booking, trip);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingDetail(String email, Long bookingId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user"));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new BookingException("Bạn không có quyền xem booking này");
        }

        Trip trip = null;
        if (booking.getTickets() != null && !booking.getTickets().isEmpty()) {
            trip = booking.getTickets().get(0).getTrip();
        }

        return bookingMapper.toBookingResponse(booking, trip);
    }

    @Transactional
    public BookingResponse cancelBooking(String email, Long bookingId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user"));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new BookingException("Bạn không có quyền hủy booking này");
        }

        if ("CANCELLED".equals(booking.getStatus())) {
            throw new BookingException("Booking này đã được hủy trước đó");
        }

        Trip trip = null;
        if (booking.getTickets() != null && !booking.getTickets().isEmpty()) {
            trip = booking.getTickets().get(0).getTrip();
        }

        if (trip != null) {
            LocalDateTime now = LocalDateTime.now();
            long hoursUntilDeparture = java.time.temporal.ChronoUnit.HOURS.between(now, trip.getDepartureTime());

            if ("PAID".equals(booking.getStatus()) || "CONFIRMED".equals(booking.getStatus())) {
                if (hoursUntilDeparture < 4) {
                    throw new BookingException("Không thể hủy/hoàn vé khi chỉ còn dưới 4 tiếng là khởi hành hoặc xe đã chạy");
                }

                double refundAmount = 0.0;
                if (hoursUntilDeparture > 24) {
                    refundAmount = booking.getTotalPrice(); // Hoàn 100%
                } else {
                    refundAmount = booking.getTotalPrice() * 0.9; // Phạt 10%, hoàn 90%
                }

                Refund refund = new Refund();
                refund.setBooking(booking);
                refund.setRefundAmount(refundAmount);
                refund.setRefundDate(now);
                refund.setStatus("COMPLETED");

                if (booking.getRefunds() == null) {
                    booking.setRefunds(new java.util.ArrayList<>());
                }
                booking.getRefunds().add(refund);
            }
        }

        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);

        return bookingMapper.toBookingResponse(booking, trip);
    }

    @Transactional
    public BookingResponse completeBooking(String email, Long bookingId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user"));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new BookingException("Bạn không có quyền thao tác trên booking này");
        }

        if (!"CONFIRMED".equals(booking.getStatus())) {
            throw new BookingException("Chỉ có thể hoàn thành chuyến đi với vé đã xác nhận (CONFIRMED)");
        }

        booking.setStatus("COMPLETED");
        bookingRepository.save(booking);

        // Tích điểm: 1 điểm / 10,000đ
        if (booking.getTotalPrice() != null && booking.getTotalPrice() > 0) {
            int earnedPoints = (int) (booking.getTotalPrice() / 10000);
            int currentPoints = user.getPoints() != null ? user.getPoints() : 0;
            user.setPoints(currentPoints + earnedPoints);
            userRepository.save(user);
        }

        try {
            emailService.sendSurveyEmail(user.getEmail(), booking.getId());
        } catch (Exception e) {}

        Trip trip = null;
        if (booking.getTickets() != null && !booking.getTickets().isEmpty()) {
            trip = booking.getTickets().get(0).getTrip();
        }

        return bookingMapper.toBookingResponse(booking, trip);
    }
}
