package com.booking.api.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {

    @NotNull(message = "Booking ID không được để trống")
    private Long bookingId;

    private String bankCode; // Mã ngân hàng (tùy chọn, ví dụ: NCB, VNPAYQR)
    private String language; // Ngôn ngữ: "vn" hoặc "en" (mặc định "vn")
}
