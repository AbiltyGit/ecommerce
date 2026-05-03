package com.example.ecommercebackend.service.impl;
import com.example.ecommercebackend.dto.request.StoreRequest;
import com.example.ecommercebackend.dto.response.StoreResponse;
import com.example.ecommercebackend.model.Store;
import com.example.ecommercebackend.model.User;
import com.example.ecommercebackend.repository.StoreRepository;
import com.example.ecommercebackend.repository.UserRepository;
import com.example.ecommercebackend.service.StoreService;
import com.example.ecommercebackend.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class StoreServiceImpl implements StoreService {
    private final StoreRepository storeRepository;
    private final UserRepository userRepository;
    public StoreServiceImpl(StoreRepository storeRepository, UserRepository userRepository) { this.storeRepository = storeRepository; this.userRepository = userRepository; }
    public StoreResponse createStore(StoreRequest request) {
        Store store = new Store();
        store.setName(request.name());
        store.setDescription(request.description());
        store.setOpen(true);
        if (request.corporateUserId() != null) {
            User user = userRepository.findById(request.corporateUserId()).orElseThrow(() -> new ResourceNotFoundException("Corporate user not found"));
            store.setCorporateUser(user);
        }
        return mapToResponse(storeRepository.save(store));
    }
    public StoreResponse getStoreById(Long id) { return mapToResponse(storeRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Store not found"))); }
    public List<StoreResponse> getAllStores() { return storeRepository.findAll().stream().map(this::mapToResponse).toList(); }
    public StoreResponse toggleStoreStatus(Long id) {
        Store store = storeRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Store not found: " + id));
        store.setOpen(!store.isOpen());
        return mapToResponse(storeRepository.save(store));
    }
    private StoreResponse mapToResponse(Store store) { return new StoreResponse(store.getId(), store.getName(), store.getDescription(), store.isOpen(), store.getCorporateUser() != null ? store.getCorporateUser().getId() : null); }
}
