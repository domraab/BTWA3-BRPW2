// src/main/java/cz/upce/fei/backend/repository/TeamRepository.java
package cz.upce.fei.backend.repository;

import cz.upce.fei.backend.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
}
