package com.apimonitor.controller;
import com.apimonitor.entity.Endpoint;
import com.apimonitor.repository.PingResultRepository;
import com.apimonitor.service.EndpointService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/endpoints")
@RequiredArgsConstructor
public class EndpointController {
    private final EndpointService endpointService;
    private final PingResultRepository pingRepo;

    @GetMapping
    public List<Endpoint> getAll() { return endpointService.getAll(); }

    @PostMapping
    public ResponseEntity<Endpoint> create(@RequestBody Endpoint ep) {
        return ResponseEntity.ok(endpointService.create(ep));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        endpointService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<?> history(@PathVariable UUID id,
            @RequestParam(defaultValue = "24") int hours) {
        return ResponseEntity.ok(
            pingRepo.findByEndpointIdSince(id, LocalDateTime.now().minusHours(hours)));
    }
}
