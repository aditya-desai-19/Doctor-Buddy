package com.doctor_buddy.doctor_buddy.controller;

import com.doctor_buddy.doctor_buddy.dto.RegisterRequest;
import com.doctor_buddy.doctor_buddy.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/user")
    ResponseEntity<String> addUser(@Valid @RequestBody RegisterRequest req) {
        return authService.addUser(req);
    }
}
