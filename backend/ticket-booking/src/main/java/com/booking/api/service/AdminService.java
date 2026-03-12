package com.booking.api.service;

import com.booking.api.entity.Provider;
import com.booking.api.entity.Route;
import com.booking.api.entity.Trip;
import com.booking.api.entity.Vehicle;
import com.booking.api.repository.ProviderRepository;
import com.booking.api.repository.RouteRepository;
import com.booking.api.repository.TripRepository;
import com.booking.api.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final RouteRepository routeRepository;
    private final VehicleRepository vehicleRepository;
    private final ProviderRepository providerRepository;
    private final TripRepository tripRepository;

    // ==================== ROUTE ====================

    @Transactional(readOnly = true)
    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    @Transactional
    public Route createRoute(Route route) {
        return routeRepository.save(route);
    }

    @Transactional
    public Route updateRoute(Long id, Route routeData) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tuyến đường với ID: " + id));
        route.setOrigin(routeData.getOrigin());
        route.setDestination(routeData.getDestination());
        return routeRepository.save(route);
    }

    @Transactional
    public void deleteRoute(Long id) {
        if (!routeRepository.existsById(id)) {
            throw new IllegalArgumentException("Không tìm thấy tuyến đường với ID: " + id);
        }
        routeRepository.deleteById(id);
    }

    // ==================== PROVIDER ====================

    @Transactional(readOnly = true)
    public List<Provider> getAllProviders() {
        return providerRepository.findAll();
    }

    @Transactional
    public Provider createProvider(Provider provider) {
        return providerRepository.save(provider);
    }

    @Transactional
    public Provider updateProvider(Long id, Provider providerData) {
        Provider provider = providerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhà cung cấp với ID: " + id));
        provider.setProviderName(providerData.getProviderName());
        provider.setProviderType(providerData.getProviderType());
        provider.setContactInfo(providerData.getContactInfo());
        return providerRepository.save(provider);
    }

    @Transactional
    public void deleteProvider(Long id) {
        if (!providerRepository.existsById(id)) {
            throw new IllegalArgumentException("Không tìm thấy nhà cung cấp với ID: " + id);
        }
        providerRepository.deleteById(id);
    }

    // ==================== VEHICLE ====================

    @Transactional(readOnly = true)
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Vehicle> getVehiclesByProvider(Long providerId) {
        return vehicleRepository.findByProviderId(providerId);
    }

    @Transactional
    public Vehicle createVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    @Transactional
    public Vehicle updateVehicle(Long id, Vehicle vehicleData) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phương tiện với ID: " + id));
        vehicle.setVehicleType(vehicleData.getVehicleType());
        vehicle.setTotalSeats(vehicleData.getTotalSeats());
        if (vehicleData.getProvider() != null) {
            vehicle.setProvider(vehicleData.getProvider());
        }
        return vehicleRepository.save(vehicle);
    }

    @Transactional
    public void deleteVehicle(Long id) {
        if (!vehicleRepository.existsById(id)) {
            throw new IllegalArgumentException("Không tìm thấy phương tiện với ID: " + id);
        }
        vehicleRepository.deleteById(id);
    }

    // ==================== TRIP ====================

    @Transactional(readOnly = true)
    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }

    @Transactional
    public Trip createTrip(Trip trip) {
        return tripRepository.save(trip);
    }

    @Transactional
    public Trip updateTrip(Long id, Trip tripData) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy chuyến đi với ID: " + id));

        if (tripData.getRoute() != null) {
            trip.setRoute(tripData.getRoute());
        }
        if (tripData.getVehicle() != null) {
            trip.setVehicle(tripData.getVehicle());
        }
        if (tripData.getDepartureTime() != null) {
            trip.setDepartureTime(tripData.getDepartureTime());
        }
        if (tripData.getArrivalTime() != null) {
            trip.setArrivalTime(tripData.getArrivalTime());
        }
        if (tripData.getPrice() != null) {
            trip.setPrice(tripData.getPrice());
        }
        if (tripData.getStatus() != null) {
            trip.setStatus(tripData.getStatus());
        }

        return tripRepository.save(trip);
    }

    @Transactional
    public Trip updateTripPrice(Long id, Double price) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy chuyến đi với ID: " + id));
        trip.setPrice(price);
        return tripRepository.save(trip);
    }

    @Transactional
    public void deleteTrip(Long id) {
        if (!tripRepository.existsById(id)) {
            throw new IllegalArgumentException("Không tìm thấy chuyến đi với ID: " + id);
        }
        tripRepository.deleteById(id);
    }
}
