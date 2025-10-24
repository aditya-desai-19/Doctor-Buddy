package com.doctor_buddy.doctor_buddy.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.Date;

@Entity
public class Doctor {

    @Id
    private String id;

    @NotBlank(message = "doctorId is mandatory")
    private String doctorId;

    @NotBlank(message = "firstName is mandatory")
    private String firstName;

    private String lastName;

    @NotBlank(message = "email is mandatory")
    private String email;

    @NotBlank(message = "password is mandatory")
    private String password;

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
}
