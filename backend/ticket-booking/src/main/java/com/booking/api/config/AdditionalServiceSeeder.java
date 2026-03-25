package com.booking.api.config;

import com.booking.api.entity.AdditionalService;
import com.booking.api.repository.AdditionalServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class AdditionalServiceSeeder {

    private final AdditionalServiceRepository additionalServiceRepository;

    @Bean
    CommandLineRunner seedAdditionalServices() {
        return args -> {
            if (additionalServiceRepository.count() > 0) {
                return;
            }

            List<AdditionalService> services = List.of(
                    new AdditionalService(null, "Hành lý ký gửi 15kg", 180000.0),
                    new AdditionalService(null, "Hành lý ký gửi 20kg", 250000.0),
                    new AdditionalService(null, "Hành lý ký gửi 30kg", 350000.0),
                    new AdditionalService(null, "Suất ăn tiêu chuẩn", 89000.0),
                    new AdditionalService(null, "Suất ăn đặc biệt", 129000.0),
                    new AdditionalService(null, "Bảo hiểm du lịch cơ bản", 49000.0),
                    new AdditionalService(null, "Bảo hiểm du lịch cao cấp", 99000.0),
                    new AdditionalService(null, "Taxi đưa đón sân bay (Xanh SM)", 199000.0)
            );

            additionalServiceRepository.saveAll(services);
        };
    }
}

