package com.doctor_buddy.doctor_buddy.repository;

import com.doctor_buddy.doctor_buddy.entity.Clinic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClinicRepository extends JpaRepository<Clinic, String> {


    Optional<Clinic> findByClinicId(String clinicId);
}
