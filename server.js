const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// GET: Display registration form
app.get("/", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Student Registration</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
            <div class="container">
                <h1>Student Registration</h1>
                <p>Enter your details to register.</p>

                <form action="/register" method="POST">
                    <label>Full Name</label>
                    <input type="text" name="name"
                           placeholder="Enter your full name" required>

                    <label>Email Address</label>
                    <input type="email" name="email"
                           placeholder="Enter your email" required>

                    <label>Age</label>
                    <input type="number" name="age"
                           placeholder="Enter your age"
                           min="1" max="120" required>

                    <label>Password</label>
                    <input type="password" name="password"
                           placeholder="Minimum 8 characters" required>

                    <button type="submit">Register</button>
                </form>
            </div>
        </body>
        </html>
    `);
});

// POST: Validate registration details
app.post("/register", (req, res) => {
    const { name, email, age, password } = req.body;
    const errors = [];

    // Name validation
    if (typeof name !== "string" || name.trim().length < 3) {
        errors.push("Name must contain at least 3 characters.");
    } else if (!/^[A-Za-z ]+$/.test(name.trim())) {
        errors.push("Name can contain only letters and spaces.");
    }

    // Email validation
    if (
        typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
        errors.push("Please enter a valid email address.");
    }

    // Age validation
    const studentAge = Number(age);

    if (
        age === undefined ||
        String(age).trim() === "" ||
        !Number.isInteger(studentAge) ||
        studentAge < 1 ||
        studentAge > 120
    ) {
        errors.push("Age must be a whole number between 1 and 120.");
    }

    // Password validation
    if (typeof password !== "string" || password.length < 8) {
        errors.push("Password must contain at least 8 characters.");
    }

    // Display validation errors
    if (errors.length > 0) {
        return res.status(400).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Registration Error</title>
                <link rel="stylesheet" href="/style.css">
            </head>
            <body>
                <div class="container">
                    <h1>Registration Failed</h1>
                    <div class="error">
                        <ul>
                            ${errors.map(error =>
                                `<li>${escapeHtml(error)}</li>`
                            ).join("")}
                        </ul>
                    </div>
                    <a href="/">Go Back to Registration</a>
                </div>
            </body>
            </html>
        `);
    }

    // Display success response
    res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Registration Successful</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
            <div class="container">
                <h1>Registration Successful!</h1>
                <div class="success">
                    Student registered successfully.
                </div>
                <p><strong>Name:</strong> ${escapeHtml(name.trim())}</p>
                <p><strong>Email:</strong> ${escapeHtml(email.trim())}</p>
                <p><strong>Age:</strong> ${studentAge}</p>
                <a href="/">Register Another Student</a>
            </div>
        </body>
        </html>
    `);
});

// Escape HTML special characters
function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});