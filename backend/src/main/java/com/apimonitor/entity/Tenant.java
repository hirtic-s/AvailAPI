package com.apimonitor.entity;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.UuidGenerator;
import java.time.LocalDateTime;
import java.util.UUID;

@Data @Entity @Table(name="tenants")
public class Tenant {
    @Id @GeneratedValue @UuidGenerator private UUID id;
    @Column(nullable=false) private String name;
    @Column(unique=true, nullable=false) private String slug;
    @Column(name="created_at") private LocalDateTime createdAt = LocalDateTime.now();
}
