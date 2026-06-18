package com.electroserve.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.electroserve.model.Category;
import com.electroserve.model.CategoryType;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByType(CategoryType type);
}