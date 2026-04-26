package com.example.ecommercebackend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "stores")
public class Store {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String description;
    
    private boolean isOpen;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "corporate_user_id")
    private User corporateUser;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public boolean isOpen() { return isOpen; }
    public void setOpen(boolean open) { isOpen = open; }
    
    public User getCorporateUser() { return corporateUser; }
    public void setCorporateUser(User corporateUser) { this.corporateUser = corporateUser; }
}
