package com.skillsprint.controller

import com.skillsprint.model.User
import com.skillsprint.repository.UserRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

/**
 * Controller handling User operations:
 * - Freelancer registration & profiles
 * - Client registration & profiles
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = ["http://localhost:5173", "http://localhost:3000"])
class UserController(private val userRepository: UserRepository) {

    // Get all users, optionally filtered by role: /api/users?role=FREELANCER
    @GetMapping
    fun getAllUsers(@RequestParam(required = false) role: String?): List<User> {
        return if (role != null) {
            userRepository.findByRole(role.uppercase())
        } else {
            userRepository.findAll()
        }
    }

    // Get a specific user by ID
    @GetMapping("/{id}")
    fun getUserById(@PathVariable id: Long): ResponseEntity<User> {
        val user = userRepository.findById(id)
        return if (user.isPresent) {
            ResponseEntity.ok(user.get())
        } else {
            ResponseEntity.notFound().build()
        }
    }

    // Create a new user profile (Freelancer or Client)
    @PostMapping
    fun createUser(@RequestBody user: User): ResponseEntity<User> {
        val saved = userRepository.save(user)
        return ResponseEntity.ok(saved)
    }
}
