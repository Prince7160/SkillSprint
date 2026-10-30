package com.skillsprint.repository

import com.skillsprint.model.Job
import com.skillsprint.model.Proposal
import com.skillsprint.model.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

/**
 * Spring Data JPA Repositories for SkillSprint.
 * These interfaces automatically provide standard CRUD methods (save, findById, findAll, deleteById).
 */

@Repository
interface UserRepository : JpaRepository<User, Long> {
    fun findByRole(role: String): List<User>
    fun findByEmail(email: String): User?
}

@Repository
interface JobRepository : JpaRepository<Job, Long> {
    fun findByClientId(clientId: Long): List<Job>
    fun findByStatus(status: String): List<Job>
}

@Repository
interface ProposalRepository : JpaRepository<Proposal, Long> {
    fun findByJobId(jobId: Long): List<Proposal>
    fun findByFreelancerId(freelancerId: Long): List<Proposal>

    @Transactional
    @Modifying
    fun deleteByJobId(jobId: Long)
}
