package com.booking.api.mapper;

import com.booking.api.dto.BookingResponse;
import com.booking.api.entity.AdditionalService;
import com.booking.api.entity.Booking;
import com.booking.api.entity.Ticket;
import com.booking.api.entity.Trip;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface BookingMapper {

    @Mapping(target = "id", source = "booking.id")
    @Mapping(target = "bookingDate", source = "booking.bookingDate")
    @Mapping(target = "totalPrice", source = "booking.totalPrice")
    @Mapping(target = "status", source = "booking.status")
    @Mapping(target = "origin", source = "trip.route.origin")
    @Mapping(target = "destination", source = "trip.route.destination")
    @Mapping(target = "departureTime", source = "trip.departureTime")
    @Mapping(target = "arrivalTime", source = "trip.arrivalTime")
    @Mapping(target = "vehicleType", source = "trip.vehicle.vehicleType")
    @Mapping(target = "providerName", source = "trip.vehicle.provider.providerName")
    @Mapping(target = "seatNumbers", source = "booking.tickets", qualifiedByName = "ticketsToSeatNumbers")
    @Mapping(target = "additionalServices", source = "booking.additionalServices", qualifiedByName = "servicesToNames")
    @Mapping(target = "refundAmount", source = "booking.refunds", qualifiedByName = "calculateRefundAmount")
    BookingResponse toBookingResponse(Booking booking, Trip trip);

    @Named("ticketsToSeatNumbers")
    default List<String> ticketsToSeatNumbers(List<Ticket> tickets) {
        if (tickets == null)
            return null;
        return tickets.stream()
                .map(t -> t.getSeat().getSeatNumber())
                .collect(Collectors.toList());
    }

    @Named("servicesToNames")
    default List<String> servicesToNames(List<AdditionalService> services) {
        if (services == null) {
            return null;
        }
        return services.stream()
                .map(AdditionalService::getServiceName)
                .collect(Collectors.toList());
    }

    @Named("calculateRefundAmount")
    default Double calculateRefundAmount(List<com.booking.api.entity.Refund> refunds) {
        if (refunds == null || refunds.isEmpty()) return null;
        return refunds.stream().mapToDouble(r -> r.getRefundAmount() != null ? r.getRefundAmount() : 0.0).sum();
    }
}
