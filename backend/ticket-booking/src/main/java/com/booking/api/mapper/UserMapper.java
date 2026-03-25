package com.booking.api.mapper;

import com.booking.api.dto.UserResponse;
import com.booking.api.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponse toUserResponse(User user);
}
