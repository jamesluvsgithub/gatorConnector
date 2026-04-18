const User = require("../models/User");
const {createSecretToken} = require("../util/secretToken");


// LOGGING USER IN
exports.loginUser = async (req, res) => {
    // Username and password comes from user input
    const {username, password} = req.body
    try{
        // Checking if the username exists
        const user = await User.findOne({username})
        if(!user){
            return res.status(404).json({error: "User not found."});
        }
        if(password == user.password){
            const token = createSecretToken(user._id);
            return res.status(200).json({msg: "Login successful!", token});
        }
        else{
            return res.status(400).json({error: "Login unsuccessful."})
        }
    } catch (error) {
        res.status(500).json({error: error.message });
    }
};

exports.signupUser = async (req, res) => {
    const usernameRegex = /^[a-zA-Z0-9_]{6,20}$/;
    const passwordRegex = /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9A-Za-z]).{8,32}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const {username, password, email} = req.body
    if(!username || !password || !email){
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

        const user = await User.create({username, password, email});
        res.status(201).json({
                msg: "Signup successful!",
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }   
        });
    } catch (error) {
        res.status(500).json({error: error.message });
    }    
};