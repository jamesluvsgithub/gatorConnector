const User = require("../models/User");
const {createSecretToken} = require("../util/secretToken");
const bcrypt = require("bcrypt");


// LOGGING USER IN
exports.loginUser = async (req, res) => {
    // Username and password comes from user input
    const {username, password} = req.body

    if(!username || !password) {
        return res.status(400).json({error: "Please fill in all fields."});
    }
    try{
        // Checking if the username exists
        const user = await User.findOne({username})
        if(!user){
            return res.status(404).json({error: "User not found."});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({error: "Invalid password."});
        }
        const token = createSecretToken(user._id, "user");
        return res.status(200).json({msg: "Login successful!", token, user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
        });
    } catch (error) {
        res.status(500).json({error: error.message });
    }
};

exports.signupUser = async (req, res) => {
    const usernameRegex = /^[a-zA-Z0-9_]{6,20}$/;
    const passwordRegex = /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9A-Za-z]).{8,32}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const {username, password, email, majors} = req.body
    if(!username || !password || !email || !majors || majors.length === 0){
        return res.status(400).json({error: "Please fill in all fields."});
    }
    if(!username.match(usernameRegex)){
        return res.status(400).json({error: "Username must be between 6 and 20 characters and can only contain letters, numbers, and underscores."});
    }
    if(!password.match(passwordRegex)){
        return res.status(400).json({error: "Password must be between 8 and 32 characters and must contain at least one uppercase letter, one lowercase letter, one number, and one special character."});
    }
    if(!email.match(emailRegex)){
        return res.status(400).json({error: "Please enter a valid email."});
    }
    try{
        const existingUser = await User.findOne({ $or: [{username}, {email}] });
        if(existingUser){
            return res.status(400).json({error: "Username or email already exists."});
        }

        const user = await User.create({username, password, email, department});
        res.status(201).json({
                msg: "Signup successful!",
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    department: user.department
                }   
        });
    } catch (error) {
        res.status(500).json({error: error.message });
    }    
};

exports.verifyUser = async (req, res) => {
        try {
            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(404).json({error: "User not found."});
            }   

            res.status(200).json({
                id: user._id,
                username: user.username,
                email: user.email,
                department: user.department
            });
        }
        catch (error) {
            res.status(500).json({error: error.message });
        }
    };
