package com.doctor_buddy.doctor_buddy.repository;

import com.doctor_buddy.doctor_buddy.entity.Staff;
import jakarta.persistence.Entity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StaffRepository extends JpaRepository<Staff, String> {
}
