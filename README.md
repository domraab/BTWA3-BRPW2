#  Semestrální práce – Taskly (Správa úkolů v projektech)

##  Popis projektu a cíle práce

Cílem projektu je implementace kompletní aplikace pro správu úkolů (task management) v rámci jednotlivých projektů a týmů.  
Projekt zahrnuje jak backendovou část (Spring Boot, PostgreSQL), tak frontendovou část (React.js).  

Uživatelé mohou vytvářet projekty, přidělovat týmy, přidávat úkoly a sledovat jejich stav v přehledném Kanban rozhraní.  
Důraz je kladen na:

- správnou architekturu a rozvržení vrstev
- bezpečnostní opatření a role-based přístup
- validaci vstupních dat a jednotné API chybové odpovědi
- použitelné a přístupné rozhraní (UX)

---

##  Architektura systému

### Backend (Spring Boot)

| Vrstva       | Obsah / Třídy                                               | Odpovědnost                                                                 |
|--------------|-------------------------------------------------------------|------------------------------------------------------------------------------|
| `Entity`     | `Task`, `Project`, `User`, `Team`, `Role`                   | Datový model (JPA)                                                          |
| `DTO`        | `TaskDTO`, `ProjectDTO`, `UserDTO`                          | Validace a přenos dat                                                       |
| `Repository` | `TaskRepository`, `ProjectRepository`, `UserRepository`     | Datová vrstva s pomocí Spring Data JPA                                     |
| `Controller` | `TaskController`, `ProjectController`, ...                  | REST API, validace přes `@Valid`                                            |
| `Mapper`     | `TaskMapper`, `ProjectMapper`, ...                          | Konverze mezi entitami a DTO                                                |
| `Config`     | `SecurityConfig`, `JwtService`, `JwtAuthFilter`             | Zabezpečení, JWT tokeny, autentizace                                        |
| `Handler`    | `GlobalExceptionHandler`                                    | Jednotná zpětná vazba při chybách (HTTP 400, 403, 404...)                   |

---

### Frontend (React.js)

- React + Vite + Bootstrap
- React Router pro navigaci
- JWT token v `localStorage` + `authService.js`
- Komponenty: `TaskCard`, `KanbanBoardPage`, `ProjectDetailPage`, `TeamDetailPage`, `TaskModal`, ...
- Role-based rendering (developer, tester, manager)
- Drag & drop přes `@hello-pangea/dnd`

---

##  Bezpečnostní mechanismy

- JWT autentizace (přihlašování přes `/api/auth/login`)
- Role-based autorizace: `manager`, `developer`, `tester`
- Endpointy chráněné pomocí `@PreAuthorize`, `SecurityConfig`
- Oddělení veřejných a chráněných částí aplikace

---

##  Validace a zpětná vazba API

Validace probíhá pomocí anotací v DTO třídách:

```java
@NotBlank(message = "Title is required")
@NotNull(message = "Project ID is required")
