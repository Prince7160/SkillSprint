package com.skillsprint.controller

import com.skillsprint.model.Job
import com.skillsprint.repository.JobRepository
import com.skillsprint.repository.ProposalRepository
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*

/**
 * Controller handling Job postings:
 * - Clients posting new projects
 * - Freelancers browsing and filtering jobs
 * - Clients deleting jobs and associated proposals
 */
@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = ["http://localhost:5173", "http://localhost:3000"])
class JobController(
    private val jobRepository: JobRepository,
    private val proposalRepository: ProposalRepository
) {

    // Get all jobs, optionally filtered by clientId
    @GetMapping
    fun getAllJobs(@RequestParam(required = false) clientId: Long?): List<Job> {
        return if (clientId != null) {
            jobRepository.findByClientId(clientId)
        } else {
            jobRepository.findAll()
        }
    }

    // Get a single job by ID
    @GetMapping("/{id}")
    fun getJobById(@PathVariable id: Long): ResponseEntity<Job> {
        val job = jobRepository.findById(id)
        return if (job.isPresent) {
            ResponseEntity.ok(job.get())
        } else {
            ResponseEntity.notFound().build()
        }
    }

    // Post a new job (by Client)
    @PostMapping
    fun createJob(@RequestBody job: Job): ResponseEntity<Job> {
        val saved = jobRepository.save(job)
        return ResponseEntity.ok(saved)
    }

    // Close a job once filled
    @PutMapping("/{id}/close")
    fun closeJob(@PathVariable id: Long): ResponseEntity<Job> {
        val job = jobRepository.findById(id)
        return if (job.isPresent) {
            val updated = job.get()
            updated.status = "CLOSED"
            ResponseEntity.ok(jobRepository.save(updated))
        } else {
            ResponseEntity.notFound().build()
        }
    }

    // Delete a job and its associated proposals in a database transaction
    @DeleteMapping("/{id}")
    @Transactional
    fun deleteJob(
        @PathVariable id: Long,
        @RequestParam(required = false) clientId: Long?
    ): ResponseEntity<Map<String, String>> {
        val jobOptional = jobRepository.findById(id)
        if (jobOptional.isEmpty) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(mapOf("error" to "Job not found with ID: $id"))
        }

        val job = jobOptional.get()

        // Check ownership if clientId is supplied
        if (clientId != null && job.clientId != clientId) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(mapOf("error" to "You are not authorized to delete this job."))
        }

        // Delete associated proposals first to respect foreign-key constraints
        proposalRepository.deleteByJobId(id)

        // Delete the job
        jobRepository.deleteById(id)

        return ResponseEntity.ok(
            mapOf("message" to "Job and its associated proposals deleted successfully.")
        )
    }
}
