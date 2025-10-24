package com.doctor_buddy.doctor_buddy.repository;

import com.doctor_buddy.doctor_buddy.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, String> {
}
