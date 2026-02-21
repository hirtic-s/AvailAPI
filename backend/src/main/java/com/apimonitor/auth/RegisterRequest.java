package com.apimonitor.auth;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank public String teamName;
    @NotBlank @Size(min=3, max=30) public String slug;
    @Email @NotBlank public String email;
    @NotBlank @Size(min=6) public String password;
}
