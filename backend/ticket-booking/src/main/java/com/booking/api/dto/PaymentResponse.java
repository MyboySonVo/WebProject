package com.booking.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {

    private String paymentUrl; // URL chuyển hướng người dùng đến cổng VNPay
    private String transactionId; // Mã giao dịch nội bộ
    private String message; // Thông báo
}
