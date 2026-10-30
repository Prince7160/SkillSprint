package com.skillsprint.controller

import com.skillsprint.model.Proposal
import com.skillsprint.repository.ProposalRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

/**
 * Controller handling Freelancer proposals / bids:
 * - Freelancer submits a bid on a job
 * - Client reviews and accepts/rejects proposals
 */
@RestController
@RequestMapping("/api/proposals")
@CrossOrigin(origins = ["http://localhost:5173", "http://localhost:3000"])
class ProposalController(private val proposalRepository: ProposalRepository) {

    // Get proposals, filterable by jobId or freelancerId
    @GetMapping
    fun getProposals(
        @RequestParam(required = false) jobId: Long?,
        @RequestParam(required = false) freelancerId: Long?
    ): List<Proposal> {
        return when {
            jobId != null -> proposalRepository.findByJobId(jobId)
            freelancerId != null -> proposalRepository.findByFreelancerId(freelancerId)
            else -> proposalRepository.findAll()
        }
    }

    // Submit a new proposal
    @PostMapping
    fun submitProposal(@RequestBody proposal: Proposal): ResponseEntity<Proposal> {
        val saved = proposalRepository.save(proposal)
        return ResponseEntity.ok(saved)
    }

    // Update proposal status: ACCEPTED or REJECTED
    @PutMapping("/{id}/status")
    fun updateStatus(
        @PathVariable id: Long,
        @RequestParam status: String
    ): ResponseEntity<Proposal> {
        val proposal = proposalRepository.findById(id)
        return if (proposal.isPresent) {
            val item = proposal.get()
            item.status = status.uppercase()
            ResponseEntity.ok(proposalRepository.save(item))
        } else {
            ResponseEntity.notFound().build()
        }
    }
}
