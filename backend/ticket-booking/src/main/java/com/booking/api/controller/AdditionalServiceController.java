package com.booking.api.controller;

import com.booking.api.entity.AdditionalService;
import com.booking.api.repository.AdditionalServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/additional-services")
@RequiredArgsConstructor
public class AdditionalServiceController {

    private final AdditionalServiceRepository additionalServiceRepository;

    @GetMapping
    public List<AdditionalService> getAll() {
        return additionalServiceRepository.findAll();
    }
}

