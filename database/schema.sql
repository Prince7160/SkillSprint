-- ======================================================
-- SkillSprint Database Schema & Sample Data
-- Database: MySQL 8.0+
-- ======================================================

-- 1. Create Database if it does not exist
CREATE DATABASE IF NOT EXISTS skillsprint_db;
USE skillsprint_db;

-- 2. Drop existing tables if re-creating
DROP TABLE IF EXISTS proposals;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS users;

-- 3. Users Table (Clients & Freelancers)
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL,          -- 'CLIENT' or 'FREELANCER'
    title VARCHAR(255) DEFAULT '',       -- e.g. 'Full-Stack Developer'
    bio TEXT,
    skills VARCHAR(500) DEFAULT '',      -- e.g. 'React, Kotlin, MySQL'
    hourly_rate DOUBLE DEFAULT 0.0       -- Hourly rate in INR (₹)
);

-- 4. Jobs Table (Posted by Clients)
CREATE TABLE jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) DEFAULT 'Web Development',
    budget DOUBLE DEFAULT 0.0,           -- Project budget in INR (₹)
    client_id BIGINT NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'OPEN',   -- 'OPEN' or 'CLOSED'
    created_at VARCHAR(100)
);

-- 5. Proposals Table (Submitted by Freelancers)
CREATE TABLE proposals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    freelancer_id BIGINT NOT NULL,
    freelancer_name VARCHAR(255) NOT NULL,
    cover_letter TEXT,
    bid_amount DOUBLE DEFAULT 0.0,       -- Bid amount in INR (₹)
    status VARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'ACCEPTED', 'REJECTED'
    submitted_at VARCHAR(100)
);

-- ======================================================
-- Sample Seed Data
-- ======================================================

INSERT INTO users (name, email, role, title, bio, skills, hourly_rate) VALUES
('TechCorp Studio', 'contact@techcorp.io', 'CLIENT', 'Cloud & AI Software Studio', 'We build cutting-edge SaaS products and hire top talent.', '', 0.0),
('DesignLab Agency', 'hello@designlab.com', 'CLIENT', 'Creative Digital Agency', 'Fast-growing creative studio looking for frontend developers.', '', 0.0),
('Alex Rivera', 'alex@freelance.dev', 'FREELANCER', 'Full-Stack React & Kotlin Developer', '5+ years building modern web apps with React, Spring Boot, and MySQL.', 'React, Kotlin, Spring Boot, MySQL, REST APIs', 1500.0),
('Sophia Chen', 'sophia@uiux.design', 'FREELANCER', 'Senior Frontend & UI/UX Designer', 'Crafting pixel-perfect, accessible interfaces with React & CSS.', 'React, Tailwind CSS, JavaScript, UI/UX, Figma', 1200.0),
('Marcus Vance', 'marcus@backend.pro', 'FREELANCER', 'Backend & Database Architect', 'Specializing in robust microservices, database tuning, and Spring Boot.', 'Kotlin, Java, Spring Boot, MySQL, Docker', 1800.0);

INSERT INTO jobs (title, description, category, budget, client_id, client_name, status, created_at) VALUES
('Build Interactive Analytics Dashboard in React', 'We need an experienced developer to create a responsive dashboard with charts and real-time metrics connected to a REST API.', 'Web Development', 45000.0, 1, 'TechCorp Studio', 'OPEN', '2026-10-08 10:00'),
('Redesign Landing Page & Brand Identity', 'Looking for a creative frontend designer to revamp our marketing homepage with clean aesthetics and animations.', 'UI/UX Design', 25000.0, 2, 'DesignLab Agency', 'OPEN', '2026-10-08 11:30'),
('Kotlin Spring Boot REST API for Checkout Flow', 'Develop a high-reliability order and payment checkout backend service with clean unit tests and MySQL schema.', 'Backend Development', 60000.0, 1, 'TechCorp Studio', 'OPEN', '2026-10-08 14:15');

INSERT INTO proposals (job_id, job_title, freelancer_id, freelancer_name, cover_letter, bid_amount, status, submitted_at) VALUES
(1, 'Build Interactive Analytics Dashboard in React', 3, 'Alex Rivera', 'Hi! I have extensive experience building React dashboards with Spring Boot backends. I would love to build this analytics dashboard for you within 2 weeks.', 42000.0, 'PENDING', '2026-10-08 12:00');
