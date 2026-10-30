package com.skillsprint

import com.skillsprint.model.Job
import com.skillsprint.model.Proposal
import com.skillsprint.model.User
import com.skillsprint.repository.JobRepository
import com.skillsprint.repository.ProposalRepository
import com.skillsprint.repository.UserRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@SpringBootApplication
class SkillsprintApplication {

    // Configure CORS to allow frontend communication smoothly
    @Bean
    fun corsConfigurer(): WebMvcConfigurer {
        return object : WebMvcConfigurer {
            override fun addCorsMappings(registry: CorsRegistry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
            }
        }
    }

    // Pre-populate beginner-friendly demo data on startup if database is empty
    @Bean
    fun seedData(
        userRepository: UserRepository,
        jobRepository: JobRepository,
        proposalRepository: ProposalRepository
    ) = CommandLineRunner {
        if (userRepository.count() == 0L) {
            println("🌱 Seeding SkillSprint demo data...")

            // Seed Clients
            val client1 = userRepository.save(
                User(
                    name = "TechCorp Studio",
                    email = "contact@techcorp.io",
                    role = "CLIENT",
                    title = "Cloud & AI Software Studio",
                    bio = "We build cutting-edge SaaS products and are constantly hiring skilled independent talent."
                )
            )

            val client2 = userRepository.save(
                User(
                    name = "DesignLab Agency",
                    email = "hello@designlab.com",
                    role = "CLIENT",
                    title = "Creative Digital Agency",
                    bio = "Fast-growing creative studio looking for frontend developers and UI specialists."
                )
            )

            // Seed Freelancers
            val freelancer1 = userRepository.save(
                User(
                    name = "Alex Rivera",
                    email = "alex@freelance.dev",
                    role = "FREELANCER",
                    title = "Full-Stack React & Kotlin Developer",
                    bio = "5+ years crafting modern web apps with React, Spring Boot, Kotlin, and relational databases.",
                    skills = "React, Kotlin, Spring Boot, MySQL, REST APIs",
                    hourlyRate = 1500.0
                )
            )

            val freelancer2 = userRepository.save(
                User(
                    name = "Sophia Chen",
                    email = "sophia@uiux.design",
                    role = "FREELANCER",
                    title = "Senior Frontend & UI/UX Designer",
                    bio = "Passionate about crafting pixel-perfect, accessible, and delightful interfaces.",
                    skills = "React, Tailwind CSS, JavaScript, Figma, UI/UX",
                    hourlyRate = 1200.0
                )
            )

            val freelancer3 = userRepository.save(
                User(
                    name = "Marcus Vance",
                    email = "marcus@backend.pro",
                    role = "FREELANCER",
                    title = "Backend & Database Architect",
                    bio = "Specializing in robust microservices, database tuning, and Spring Boot backends.",
                    skills = "Kotlin, Java, Spring Boot, MySQL, Docker",
                    hourlyRate = 1800.0
                )
            )

            // Seed Jobs
            val job1 = jobRepository.save(
                Job(
                    title = "Build Interactive Analytics Dashboard in React",
                    description = "We need an experienced developer to create a responsive dashboard with charts and real-time metrics connected to a REST API.",
                    category = "Web Development",
                    budget = 45000.0,
                    clientId = client1.id!!,
                    clientName = client1.name,
                    status = "OPEN"
                )
            )

            val job2 = jobRepository.save(
                Job(
                    title = "Redesign Landing Page & Brand Identity",
                    description = "Looking for a creative frontend designer to revamp our marketing homepage with clean aesthetics and animations.",
                    category = "UI/UX Design",
                    budget = 25000.0,
                    clientId = client2.id!!,
                    clientName = client2.name,
                    status = "OPEN"
                )
            )

            val job3 = jobRepository.save(
                Job(
                    title = "Kotlin Spring Boot REST API for Checkout Flow",
                    description = "Develop a high-reliability order and payment checkout backend service with clean unit tests and MySQL schema.",
                    category = "Backend Development",
                    budget = 60000.0,
                    clientId = client1.id!!,
                    clientName = client1.name,
                    status = "OPEN"
                )
            )

            // Seed Proposal
            proposalRepository.save(
                Proposal(
                    jobId = job1.id!!,
                    jobTitle = job1.title,
                    freelancerId = freelancer1.id!!,
                    freelancerName = freelancer1.name,
                    coverLetter = "Hi! I have extensive experience building React dashboards with Spring Boot backends. I would love to build this analytics dashboard for you within 2 weeks.",
                    bidAmount = 42000.0,
                    status = "PENDING"
                )
            )

            println("✅ SkillSprint demo data seeded successfully!")
        }
    }
}

fun main(args: Array<String>) {
    runApplication<SkillsprintApplication>(*args)
}
