package com.skillsprint.model

import jakarta.persistence.*
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

/**
 * Represents a Job or Project posted by a Client.
 * Freelancers can browse jobs and submit proposals.
 */
@Entity
@Table(name = "jobs")
data class Job(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    val title: String = "",

    @Column(length = 2000)
    val description: String = "",

    // Category like "Web Development", "Mobile Apps", "UI/UX Design"
    val category: String = "Web Development",

    // Project budget in INR (₹)
    val budget: Double = 0.0,

    // Client who posted the job
    val clientId: Long = 0,
    val clientName: String = "",

    // "OPEN" or "CLOSED"
    var status: String = "OPEN",

    // Creation date
    val createdAt: String = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))
)
