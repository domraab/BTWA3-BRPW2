package cz.upce.fei.backend.dto;

public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private String jobTitle;
    private String password; // pro příjem/hashing nového hesla
    private String role;     // název role

    public UserDTO() {}

    /** Konstruktor pro výstupní DTO (bez hesla) */
    public UserDTO(Long id,
                   String username,
                   String email,
                   String fullName,
                   String phone,
                   String jobTitle,
                   String role) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.phone = phone;
        this.jobTitle = jobTitle;
        this.role = role;
    }

    /** Konstruktor pro vstupní DTO (s heslem a rolí) */
    public UserDTO(Long id,
                   String username,
                   String email,
                   String fullName,
                   String phone,
                   String jobTitle,
                   String password,
                   String role) {
        this(id, username, email, fullName, phone, jobTitle, role);
        this.password = password;
    }

    // --- getters & setters ---

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getJobTitle() {
        return jobTitle;
    }
    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
}
