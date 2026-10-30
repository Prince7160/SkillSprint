package com.skillsprint.model

import jakarta.persistence.*

/**
 * Represents a User in the SkillSprint marketplace.
 * A user can be a CLIENT (posting jobs) or a FREELANCER (offering skills).
 */
@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    val name: String = "",

    val email: String = "",

    // Role can be "FREELANCER" or "CLIENT"
    val role: String = "FREELANCER",

    // Professional headline, e.g. "Full-Stack Developer" or "Startup Founder"
    val title: String = "",

    // Short summary about the user
    @Column(length = 1000)
    val bio: String = "",

    // Comma-separated list of skills, e.g. "React, Kotlin, Spring Boot, MySQL"
    val skills: String = "",

    // Hourly rate in INR (₹) (for freelancers)
    val hourlyRate: Double = 0.0
)
