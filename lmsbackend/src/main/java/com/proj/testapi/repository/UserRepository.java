package com.proj.testapi.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.proj.testapi.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
	public Optional<User> findByEmail(String email);
}
