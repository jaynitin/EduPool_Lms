package com.proj.testapi.service;

import java.util.List;

import com.proj.testapi.entity.Course;

import jakarta.servlet.http.HttpSession;

public interface CourseService {
	Course createCourse(Course course, HttpSession session);

    List<Course> getAllCourses();

    Course updateCourse(Long courseId, Course course, HttpSession session);

    String deleteCourse(Long courseId, HttpSession session);
}
