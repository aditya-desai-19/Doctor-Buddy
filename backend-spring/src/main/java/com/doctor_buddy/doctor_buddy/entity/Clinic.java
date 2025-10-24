package com.doctor_buddy.doctor_buddy.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Clinic extends AuditDetails {

    @Id
    private String id;

    @NotBlank(message = "name is mandatory")
    private String name;

    private String address;

    @OneToMany(mappedBy = "clinic", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Staff> staffList = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private User user;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public List<Staff> getStaffList() {
        return staffList;
    }

    public void setStaffList(List<Staff> staffList) {
        this.staffList = staffList;
    }

    public User getDoctor() {
        return user;
    }

    public void setDoctor(User user) {
        this.user = user;
    }
}
