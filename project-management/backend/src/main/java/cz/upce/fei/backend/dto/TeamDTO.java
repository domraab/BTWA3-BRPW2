// src/main/java/cz/upce/fei/backend/dto/TeamDTO.java
package cz.upce.fei.backend.dto;

import java.util.List;

public class TeamDTO {
    private Long id;
    private String name;
    private Long projectId;
    private List<Long> memberIds;

    public TeamDTO() {}

    public TeamDTO(Long id, String name, Long projectId, List<Long> memberIds) {
        this.id = id;
        this.name = name;
        this.projectId = projectId;
        this.memberIds = memberIds;
    }

    public TeamDTO(Long id, String name, List<Long> memberIds) {
        this.id = id;
        this.name = name;
        this.memberIds = memberIds;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public List<Long> getMemberIds() {
        return memberIds;
    }

    public void setMemberIds(List<Long> memberIds) {
        this.memberIds = memberIds;
    }
}
