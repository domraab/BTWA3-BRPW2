# 📝 Semestrální práce – Backend pro správu úkolů v projektech

## 🎯 Popis projektu a cíle práce

Cílem projektu je implementace funkční větve backendové části systému pro správu úkolů (Task Management) v rámci jednotlivých projektů. Důraz je kladen na správnou architekturu, validaci vstupních dat, bezpečnostní opatření a správnou zpětnou vazbu pro klienta.

Tato implementace slouží jako ukázková realizace ucelené větve podle profesionálních standardů pro vývoj podnikových aplikací.

---

## 🧱 Architektura systému

Aplikace je postavena na vícevrstvé architektuře s jasným oddělením odpovědností:

| Vrstva        | Třídy / Obsah                                        | Odpovědnost                                                  |
|---------------|------------------------------------------------------|---------------------------------------------------------------|
| **Entity**    | `Task`, `Project`, `User`, `Team`                   | Datový model, mapování na databázi (JPA)                     |
| **DTO**       | `TaskDTO`                                            | Přenos dat + validace vstupů (`@NotNull`, `@NotBlank`)      |
| **Repository**| `TaskRepository`, `ProjectRepository`, `UserRepository` | Přístup k datům pomocí Spring Data JPA                      |
| **Controller**| `TaskController`                                     | Definice REST API, validace pomocí `@Valid`, zpětná vazba    |
| **Mapper**    | `TaskMapper`                                         | Konverze mezi `Task` a `TaskDTO`                            |
| **Config**    | `SecurityConfig`, `JwtService`, `JwtAuthFilter`     | Bezpečnostní nastavení a autentizace                        |
| **Handler**   | `GlobalExceptionHandler`                             | Jednotná validace a zpětná vazba při chybách                 |

---

## 🔐 Implementované bezpečnostní mechanismy

- **JWT autentizace** – přihlašování přes `/api/auth/login`, generování a kontrola tokenu
- **Autorizace podle rolí** – role `manager`, `developer`, `tester`
- **Omezení přístupu** – pouze oprávnění uživatelé mají přístup k určitým endpointům
- **Spring Security** – konfigurace přes `SecurityConfig.java`, `@PreAuthorize`, role-based access

---

## ✔️ Validace a zpětná vazba API

- Validace je implementována přes anotace ve `TaskDTO.java`:
  - `@NotBlank(message = "Title is required")`
  - `@NotNull(message = "Project ID is required")`
- Vstupy jsou validovány pomocí `@Valid` v `TaskController`
- Chyby jsou vráceny jako čitelné JSON odpovědi díky `GlobalExceptionHandler.java`

### 🔍 Příklad neplatného požadavku:
**Request:**
```json
{
  "title": "",
  "status": "",
  "projectId": null
}
