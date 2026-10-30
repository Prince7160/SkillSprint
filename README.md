# ⚡ SkillSprint - Beginner-Friendly Freelancer Marketplace

SkillSprint is a clean, minimal, full-stack freelancer marketplace web application where:
- **Clients** can post project jobs, browse talented freelancers, and review/accept proposals.
- **Freelancers** can browse open client projects, filter by category/skills, and submit competitive proposals and bids.

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) + Clean Vanilla CSS & [Lucide Icons](https://lucide.dev/)
- **Backend**: [Kotlin](https://kotlinlang.org/) + [Spring Boot 3](https://spring.io/projects/spring-boot) + Spring Data JPA
- **Database**: [MySQL](https://www.mysql.com/) (with automatic table schema creation & sample data seeding)
- **Editor**: [VS Code](https://code.visualstudio.com/)

---

## 📂 Project Structure

```text
skillsprint/
├── .vscode/                 # VS Code configuration (one-click run tasks & recommended plugins)
│   ├── tasks.json
│   └── extensions.json
├── database/                # Ready-to-use MySQL database scripts
│   └── schema.sql           # SQL script to create database, tables & sample data manually
├── backend/                 # Kotlin + Spring Boot API
│   ├── src/main/kotlin/com/skillsprint/
│   │   ├── SkillsprintApplication.kt  # Entry point, CORS config & auto seed data runner
│   │   ├── model/
│   │   │   ├── User.kt      # User entity (CLIENT or FREELANCER)
│   │   │   ├── Job.kt       # Job posting entity
│   │   │   └── Proposal.kt  # Bid/Proposal entity
│   │   ├── repository/
│   │   │   └── Repositories.kt # Spring Data JPA repositories (UserRepository, JobRepository, ProposalRepository)
│   │   └── controller/
│   │       ├── UserController.kt     # /api/users endpoints
│   │       ├── JobController.kt      # /api/jobs endpoints
│   │       └── ProposalController.kt # /api/proposals endpoints
│   └── src/main/resources/
│       └── application.properties    # MySQL connection configuration
└── frontend/                # React Vite Application
    ├── src/
    │   ├── api.js           # Lightweight fetch wrapper for backend endpoints
    │   ├── App.jsx          # Main state, role switching, tab views
    │   ├── index.css        # Clean, modern styles with CSS variables
    │   └── components/
    │       ├── Navbar.jsx          # Header with single user profile display & Log Out button
    │       ├── LoginView.jsx       # Simple sign-in & register view (when logged out)
    │       ├── JobList.jsx         # Searchable list of open jobs with category filters & Delete Job action
    │       ├── JobModal.jsx        # Job detail view & proposal submission form
    │       ├── PostJobModal.jsx    # Client form to post new jobs (in ₹ INR)
    │       ├── FreelancerList.jsx  # Talent directory with skills & hourly rates (in ₹ INR)
    │       └── ProposalsList.jsx   # Client review & accept/reject proposal management
    └── package.json
```

---

## 🚀 How to Run in VS Code

### 1. Open the project in VS Code
Open VS Code, click **File > Open Folder...**, and select:
`C:\Users\Prince\.gemini\antigravity\scratch\skillsprint`

---

### 2. Configure MySQL Database
Make sure your local MySQL server is running (e.g. via MySQL Workbench, XAMPP, or Windows service).

1. Check or update your MySQL password in `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/skillsprint_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=root    <--- Change to your MySQL root password if different
   ```
2. *(Optional)* If you want to create the database and seed records manually via MySQL Workbench or CLI, run the script in:
   `database/schema.sql`
   *(Spring Boot also auto-creates the tables and populates sample data on first start!)*

> 💡 **Quick Test Tip**: If you don't have MySQL installed yet and want to run the app immediately, open `application.properties` and uncomment the H2 in-memory database lines.

---

### 3. Start the Kotlin + Spring Boot Backend
Open a terminal in VS Code:
```powershell
cd backend
.\gradlew.bat bootRun
```
*Backend will start on `http://localhost:8080`.*

---

### 4. Start the React Frontend
Open a second terminal in VS Code:
```powershell
cd frontend
npm run dev
```
*Click the URL displayed in the terminal (usually `http://localhost:5173`) to open SkillSprint in your browser!*

---

### ⚡ Or use VS Code Tasks (1-Click Run)
1. Press `Ctrl + Shift + P` in VS Code.
2. Type **Tasks: Run Task** and press Enter.
3. Select **1. Run Backend** or **2. Run Frontend**.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users` | List all users (filter by `?role=FREELANCER` or `?role=CLIENT`) |
| `POST` | `/api/users` | Create a new user profile |
| `GET` | `/api/jobs` | Get all jobs (filter by `?clientId=1`) |
| `POST` | `/api/jobs` | Post a new job (Clients) |
| `PUT` | `/api/jobs/{id}/close` | Mark job as closed |
| `DELETE` | `/api/jobs/{id}?clientId={clientId}` | Delete a job and all associated proposals transactionally (Client owner) |
| `GET` | `/api/proposals` | Get proposals (filter by `?jobId=1` or `?freelancerId=2`) |
| `POST` | `/api/proposals` | Submit a proposal/bid (Freelancers) |
| `PUT` | `/api/proposals/{id}/status?status=ACCEPTED` | Accept or Reject a proposal (Clients) |

---

## 💰 Currency
All budgets, bids, and hourly rates throughout the application are denominated in **Indian Rupees (₹ INR)**.
