package com.example.ecommercebackend.dto.response;

public class CartItemResponse {
    private Long id;
    private ProductDto product;
    private Integer quantity;

    public CartItemResponse(Long id, ProductDto product, Integer quantity) {
        this.id = id;
        this.product = product;
        this.quantity = quantity;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public ProductDto getProduct() { return product; }
    public void setProduct(ProductDto product) { this.product = product; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public static class ProductDto {
        private Long id;
        private String name;
        private java.math.BigDecimal price;

        public ProductDto(Long id, String name, java.math.BigDecimal price) {
            this.id = id;
            this.name = name;
            this.price = price;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public java.math.BigDecimal getPrice() { return price; }
        public void setPrice(java.math.BigDecimal price) { this.price = price; }
    }
}
