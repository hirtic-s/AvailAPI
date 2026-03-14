package com.apimonitor.controller;

import com.apimonitor.service.StatusPageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/public")
@RequiredArgsConstructor
public class StatusPageController {
    private final StatusPageService statusPageService;

    @GetMapping("/{slug}")
    public ResponseEntity<?> getStatusPage(@PathVariable String slug) {
        try {
            return ResponseEntity.ok(statusPageService.getStatusPage(slug));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
