// userManagement.js

// Import necessary modules
const express = require('express');
const UserModel = require('../models/User'); // Assuming the model is in the models directory
const router = express.Router();

// Authentication and Authorisation Middleware
const authentication = require('../middleware/authentication');
const authorisation = require('../middleware/authorisation');

// Controller Function: Delete User by Username
const delete_user_by_username = async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        const user = await UserModel.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await UserModel.destroy({
            where: { username }
        });

        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while deleting the user' });
    }
};

// Route Handling for Delete User
router.post(
    "/delete/user",
    authentication,
    authorisation({ isAdmin: false }),
    (req, res) => delete_user_by_username(req, res),
);

// Export the router
module.exports = router;

// Frontend: Handling User Interaction
document.getElementById("delete-user-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("other-username").value;
    if (!username) {
        alert("Please enter a username");
        return;
    }

    try {
        const response = await fetch(`http://localhost:4001/auth/delete/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
        } else {
            alert(data.error || 'An error occurred');
        }
    } catch (error) {
        alert('An error occurred while trying to delete the user');
    }
});
