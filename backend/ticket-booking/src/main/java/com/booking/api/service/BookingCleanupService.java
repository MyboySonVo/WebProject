package com.booking.api.service;

import com.booking.api.entity.Booking;
import com.booking.api.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingCleanupService {

    private final BookingRepository bookingRepository;

    // Chạy mỗi 1 phút một lần
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void cancelUnpaidBookings() {
        // Tìm các booking trạng thái PENDING tạo cách đây hơn 15 phút
        LocalDateTime cutoffTime = LocalDateTime.now().minusMinutes(15);
        List<Booking> expiredBookings = bookingRepository.findByStatusAndBookingDateBefore("PENDING", cutoffTime);

        if (!expiredBookings.isEmpty()) {
            log.info("Found {} expired PENDING bookings. Canceling...", expiredBookings.size());
            for (Booking booking : expiredBookings) {
                booking.setStatus("CANCELLED");
            }
            bookingRepository.saveAll(expiredBookings);
        }
    }
}
