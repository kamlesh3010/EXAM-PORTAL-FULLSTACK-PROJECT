package com.exam.Test.Repositories;

import com.exam.Test.Models.ViolationLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ViolationLogRepository extends JpaRepository<ViolationLog, Long> {}
