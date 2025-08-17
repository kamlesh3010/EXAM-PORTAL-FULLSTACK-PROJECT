package com.exam.Test.Repositories;

import com.exam.Test.Models.Universities;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UniversityRepo extends JpaRepository<Universities ,Long> {
    boolean existsByNameIgnoreCase(String name);
}
