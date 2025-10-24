package com.doctor_buddy.doctor_buddy.service;

import com.doctor_buddy.doctor_buddy.dto.RegisterRequest;
import com.doctor_buddy.doctor_buddy.entity.Clinic;
import com.doctor_buddy.doctor_buddy.repository.ClinicRepository;
import com.doctor_buddy.doctor_buddy.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {
    @Autowired
    private ClinicRepository clinicRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    private String generateUniqueClinicId() {
        boolean isUnique = false;
        while (!isUnique) {
            String id = "Cl-" + UUID.randomUUID().toString().substring(0, 8);
            Optional<Clinic> clinic = clinicRepository.findByClinicId(id);
            if(clinic.isEmpty()) {
                isUnique = true;
                return id;
            }
        }
        return "";
    }

    private void addClinic(String clinicName, String address) {
        String clinicId = generateUniqueClinicId();
        Clinic newClinic = new Clinic();
        newClinic.setId(UUID.randomUUID().toString());
        newClinic.setClinicId(clinicId);
        newClinic.setName(clinicName);
        newClinic.setAddress(address);
        newClinic.setDeleted(false);
        clinicRepository.save(newClinic);
    }

    private void addDoctor(RegisterRequest req) {

    }

    private void addStaff(RegisterRequest req) {

    }

    public ResponseEntity<String> addUser(RegisterRequest req) {
        String role = req.getRole();

        if(role == "Admin") {
            addDoctor(req);
        }
        else {
            addStaff(req);
        }

        return ResponseEntity.ok("User added successfully");
    }
}
