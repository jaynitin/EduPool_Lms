package com.proj.testapi.service;

import com.proj.testapi.entity.User;

import jakarta.servlet.http.HttpSession;

public interface UserService {
	public void signup(User user);

    public User signin(String email, String password, HttpSession session);

    public void signout(HttpSession session);
}
