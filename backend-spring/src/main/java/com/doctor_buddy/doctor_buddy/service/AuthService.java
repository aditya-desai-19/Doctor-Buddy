package com.doctor_buddy.doctor_buddy.service;

import com.doctor_buddy.doctor_buddy.entity.User;
import com.doctor_buddy.doctor_buddy.repository.ClinicRepository;
import com.doctor_buddy.doctor_buddy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {
    @Autowired
    private ClinicRepository clinicRepository;

    @Autowired
    private UserRepository userRepository;

    public ResponseEntity<String> addUser(User user) {
        user.setId(UUID.randomUUID().toString());
        userRepository.save(user);
        return ResponseEntity.ok("Saved successfully");
    }
}
