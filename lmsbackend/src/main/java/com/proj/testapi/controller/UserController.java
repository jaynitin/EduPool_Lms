package com.proj.testapi.controller;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;

import com.proj.testapi.entity.User;
import com.proj.testapi.service.UserService;

import jakarta.servlet.http.HttpSession;

import org.springframework.http.ResponseEntity;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {

    @Autowired
    private UserService uservice;

    // Sign Up
    @PostMapping("/reg")
    public String register(@RequestBody User user) {
        uservice.signup(user);
        return "User Added!";
    }

    // Log In
    // @PostMapping("/login")
    // public String login(@RequestBody User user, HttpSession session) {

    // User loggedInUser = uservice.signin(user.getEmail(), user.getPassword(),
    // session);

    // if (loggedInUser == null) {
    // return "Invalid Credentials";
    // }

    // return "Login Successful";
    // }

    // Log In
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user, HttpSession session) {
        User loggedInUser = uservice.signin(user.getEmail(), user.getPassword(), session);

        if (loggedInUser == null) {
            return ResponseEntity.status(401).body("Invalid Credentials");
        }

        return ResponseEntity.ok(Map.of(
                "name", loggedInUser.getName(),
                "email", loggedInUser.getEmail(),
                "role", loggedInUser.getRole()));
    }

    // Log Out
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "Logged Out!";
    }

    // @GetMapping("/me")
    // public String me(HttpSession session) {
    // String username = (String) session.getAttribute("name");
    // String role = (String) session.getAttribute("role");
    // if (username == null) {
    // return null;
    // }
    // return "Name: " + username + " Role: " + role;
    // }
    
    @GetMapping("/me")
    public ResponseEntity<?> me(HttpSession session) {
        String name = (String) session.getAttribute("name");
        String role = (String) session.getAttribute("role");
        if (name == null) {
            return ResponseEntity.status(401).body("Not logged in");
        }
        return ResponseEntity.ok(Map.of("name", name, "role", role));
    }
}