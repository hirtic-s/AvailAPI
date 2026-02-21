package com.apimonitor.auth;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class AuthRequest {
    @Email @NotBlank public String email;
    @NotBlank public String password;
}
