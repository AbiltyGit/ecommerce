package com.example.ecommercebackend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "customer_profiles")
public class CustomerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String gender;
    private Integer age;
    private String city;
    private String membershipType;
    
    private BigDecimal totalSpend;
    private Integer itemsPurchased;
    
    private Double avgRating;
    private Boolean discountApplied;
    private Integer satisfactionLevel;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    
    public String getMembershipType() { return membershipType; }
    public void setMembershipType(String membershipType) { this.membershipType = membershipType; }
    
    public BigDecimal getTotalSpend() { return totalSpend; }
    public void setTotalSpend(BigDecimal totalSpend) { this.totalSpend = totalSpend; }
    
    public Integer getItemsPurchased() { return itemsPurchased; }
    public void setItemsPurchased(Integer itemsPurchased) { this.itemsPurchased = itemsPurchased; }
    
    public Double getAvgRating() { return avgRating; }
    public void setAvgRating(Double avgRating) { this.avgRating = avgRating; }
    
    public Boolean getDiscountApplied() { return discountApplied; }
    public void setDiscountApplied(Boolean discountApplied) { this.discountApplied = discountApplied; }
    
    public Integer getSatisfactionLevel() { return satisfactionLevel; }
    public void setSatisfactionLevel(Integer satisfactionLevel) { this.satisfactionLevel = satisfactionLevel; }
}
