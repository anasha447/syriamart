package com.syriamart.logistics.dto.response.driver;

public record DriverPerformanceResponse(double rating, int totalDeliveries, int onTimeDeliveries, double completionRate,
        int customerComplaints) {
}
