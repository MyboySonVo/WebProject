package com.booking.api.service;

import com.booking.api.config.VNPayConfig;
import com.booking.api.dto.PaymentRequest;
import com.booking.api.dto.PaymentResponse;
import com.booking.api.entity.Booking;
import com.booking.api.entity.Payment;
import com.booking.api.entity.User;
import com.booking.api.exception.BookingException;
import com.booking.api.exception.ResourceNotFoundException;
import com.booking.api.repository.BookingRepository;
import com.booking.api.repository.PromotionRepository;
import com.booking.api.repository.UserRepository;
import com.booking.api.util.VNPayUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.SortedMap;
import java.util.TreeMap;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final PromotionRepository promotionRepository;
    private final VNPayConfig vnPayConfig;
    private final EmailService emailService;

    /**
     * Tạo URL thanh toán VNPay
     */
    public PaymentResponse createVNPayPayment(String email, PaymentRequest request, String ipAddress) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user"));

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking", request.getBookingId()));

        // Kiểm tra booking thuộc user
        if (!booking.getUser().getId().equals(user.getId())) {
            throw new BookingException("Bạn không có quyền thanh toán booking này");
        }

        // Kiểm tra trạng thái booking
        if (!"PENDING".equals(booking.getStatus())) {
            throw new BookingException("Booking đã được thanh toán hoặc hủy");
        }

        // Tạo mã giao dịch nội bộ
        String txnRef = UUID.randomUUID().toString().replace("-", "").substring(0, 12);

        // Tính tiền (VNPay yêu cầu nhân 100 vì không dùng dấu thập phân)
        long amount = (long) (booking.getTotalPrice() * 100);

        // Xây dựng VNPay params
        SortedMap<String, String> params = new TreeMap<>();
        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", vnPayConfig.getTmnCode());
        params.put("vnp_Amount", String.valueOf(amount));
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_TxnRef", txnRef);
        params.put("vnp_OrderInfo", "Thanh_toan_booking_" + booking.getId());
        params.put("vnp_OrderType", "billpayment");
        params.put("vnp_Locale", request.getLanguage() != null ? request.getLanguage() : "vn");
        params.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
        params.put("vnp_IpAddr", ipAddress);
        params.put("vnp_CreateDate", VNPayUtil.formatDateTime(LocalDateTime.now()));

        if (request.getBankCode() != null && !request.getBankCode().isBlank()) {
            params.put("vnp_BankCode", request.getBankCode());
        }

        // Tạo hash
        String hashData = VNPayUtil.buildHashData(params);
        String secureHash = VNPayUtil.hmacSHA512(vnPayConfig.getHashSecret(), hashData);

        // Build URL
        String queryString = VNPayUtil.buildQueryString(params);
        String paymentUrl = vnPayConfig.getPayUrl() + "?" + queryString + "&vnp_SecureHash=" + secureHash;

        return new PaymentResponse(paymentUrl, txnRef, "Tạo thanh toán thành công. Chuyển hướng đến VNPay.");
    }

    /**
     * Xử lý callback từ VNPay sau khi thanh toán
     */
    @Transactional
    public String handleVNPayReturn(Map<String, String> params) {
        // Validate hash
        boolean isValid = VNPayUtil.validateHash(params, vnPayConfig.getHashSecret());
        if (!isValid) {
            return "INVALID_SIGNATURE";
        }

        String responseCode = params.get("vnp_ResponseCode");
        String orderInfo = params.get("vnp_OrderInfo");
        String amountStr = params.get("vnp_Amount");

        // Lấy booking ID từ orderInfo: "Thanh_toan_booking_<id>"
        Long bookingId = null;
        try {
            String[] parts = orderInfo.split("_");
            bookingId = Long.parseLong(parts[parts.length - 1].trim());
        } catch (Exception e) {
            return "INVALID_ORDER_INFO";
        }

        Booking booking = bookingRepository.findById(bookingId).orElse(null);
        if (booking == null) {
            return "BOOKING_NOT_FOUND";
        }

        if ("00".equals(responseCode)) {
            // Thanh toán thành công
            booking.setStatus("CONFIRMED");

            // Tạo record Payment
            Payment payment = new Payment();
            payment.setBooking(booking);
            payment.setPaymentMethod("VNPAY");
            payment.setPaymentDate(LocalDateTime.now());
            payment.setAmount(amountStr != null ? Double.parseDouble(amountStr) / 100 : booking.getTotalPrice());
            payment.setPaymentStatus("SUCCESS");

            if (booking.getPayments() == null) {
                booking.setPayments(new java.util.ArrayList<>());
            }
            booking.getPayments().add(payment);

            bookingRepository.save(booking);

            // Tích điểm cho User
            User user = booking.getUser();
            if (user != null) {
                int earnedPoints = (int) (booking.getTotalPrice() / 10000);
                int currentPoints = user.getPoints() == null ? 0 : user.getPoints();
                int newPoints = currentPoints + earnedPoints;
                user.setPoints(newPoints);

                // Nâng hạng thành viên
                String newLevel = null;
                if (newPoints >= 2000) {
                    newLevel = "Kim cương";
                } else if (newPoints >= 500) {
                    newLevel = "Vàng";
                } else if (newPoints >= 100) {
                    newLevel = "Bạc";
                }

                if (newLevel != null) {
                    promotionRepository.findByLevelName(newLevel).ifPresent(user::setPromotion);
                }
                userRepository.save(user);
            }

            String seats = "";
            if (booking.getTickets() != null) {
                seats = booking.getTickets().stream().map(t -> t.getSeat().getSeatNumber()).collect(Collectors.joining(", "));
            }

            emailService.sendBookingConfirmation(
                    booking.getUser().getEmail(),
                    booking.getId(),
                    booking.getTotalPrice(),
                    seats
            );

            return "SUCCESS";
        } else {
            // Thanh toán thất bại
            return "FAILED_" + responseCode;
        }
    }
}
