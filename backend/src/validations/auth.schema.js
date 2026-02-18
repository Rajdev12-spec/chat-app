const { z, regex } = require("zod");

const nameRegex = /^[A-Za-z]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/

const signUpSchema = z.object({
    firstName: z
        .string()
        .min(3, "First name must be at least 3 characters")
        .max(20, "First name can't be more than 20 characters")
        .regex(nameRegex, "First name must contatin only alphabets")
        .trim(),
    lastName: z
        .string()
        .min(3, "Last name must be at least 3 characters")
        .max(20, "Last name can't be more than 20 characters")
        .regex(nameRegex, "Last name must contatin only alphabets")
        .trim(),
    email: z
        .email("Invalid email address"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .regex(passwordRegex, "Password must contain uppercase, lowercase, number and special character")
})

const signInSchema = z.object({
    email: z
        .email("Invalid email address"),
    password: z
        .string()
        .min(1, "Password is required")
})

module.exports = { signUpSchema, signInSchema }