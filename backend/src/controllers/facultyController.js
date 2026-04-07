const Faculty = require("../models/Faculty");

// CREATE
exports.createFaculty = async (req, res) => {
    try {
        const user = await Faculty.create(req.body);
        res.status(201).json(user);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// READ
exports.getFaculty = async (req, res) => {
    try {
        const user = await Faculty.findById(req.params.id);

        if (!user) {
            return res.status(404).json({error: "User not found."});
        }

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// UPDATE
exports.updateFaculty = async (req, res) => {
    try{
        const user = await Faculty.findByIdAndUpdate(req.params.id, req.body);

        if (!user) {
            return res.status(404).json({error: "User not found."});
        }

        const updatedUser = await Faculty.findById(req.params.id);
        res.status(200).json(updatedUser);

    } catch(error){
         res.status(500).json({error: error.message });
    }
};

// DELETE
exports.deleteFaculty = async (req, res) => {
    try{
        const user = await Faculty.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({error: "User not found."});
        }

        res.status(200).json({msg: "User deleted."});
        
    } catch (error) {
        res.status(500).json({error: error.message });
    }
};

// LOGGING USER IN
exports.loginFaculty = async (req, res) => {
    // Username and password comes from user input
    const {username, password} = req.body
    try{
        // Checking if the username exists
        const user = await Faculty.findOne({username})
        if(!user){
            return res.status(404).json({error: "User not found."});
        }
        if(password == user.password){
            return res.status(200).json({msg: "Login successful!"});
        }
        else{
            return res.status(400).json({error: "Login unsuccessful."})
        }
    } catch (error) {
        res.status(500).json({error: error.message });
    }
};
