package com.project.shopapp.services;

import com.project.shopapp.dtos.CategoryDTO;
import com.project.shopapp.dtos.UpdateUserDTO;
import com.project.shopapp.dtos.UserDTO;
import com.project.shopapp.dtos.UserLoginDTO;
import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.exceptions.InvalidPasswordException;
import com.project.shopapp.models.Category;
import com.project.shopapp.models.User;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface IUserService {
    User createUser(UserDTO userDTO) throws Exception;
    String login(UserLoginDTO userLoginDT) throws Exception;

    User updateUser(Long userId, UpdateUserDTO updatedUserDTO) throws Exception;
     User getUserDetailsFromToken(String token) throws Exception;

    User getUserDetailsFromRefreshToken(String refreshToken) throws Exception;
    public Page<User> findAll(String keyword, Pageable pageable);
    void resetPassword(Long userId, String newPassword)
            throws InvalidPasswordException, DataNotFoundException;

    void blockOrEnable(Long userId, Boolean active) throws DataNotFoundException;

    String loginSocial(UserLoginDTO userLoginDTO) throws Exception;
}
