package com.skillsprint.model

import jakarta.persistence.*
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

/**
 * Represents a Proposal / Bid submitted by a Freelancer for a specific Job.
 */
@Entity
@Table(name = "proposals")
data class Proposal(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    // The job being applied for
    val jobId: Long = 0,
    val jobTitle: String = "",

    // The freelancer submitting the proposal
    val freelancerId: Long = 0,
    val freelancerName: String = "",

    // Proposal message explaining why the freelancer is a great fit
    @Column(length = 2000)
    val coverLetter: String = "",

    // The freelancer's proposed price or bid
    val bidAmount: Double = 0.0,

    // Status can be "PENDING", "ACCEPTED", or "REJECTED"
    var status: String = "PENDING",

    val submittedAt: String = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))
)
