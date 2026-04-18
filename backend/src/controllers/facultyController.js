const Faculty = require("../models/Faculty");
const User = require("../models/User");

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

exports.loginFaculty = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      username,
      role: "faculty"
    });

    if (!user) {
      return res.status(404).json({ error: "Faculty user not found." });
    }

    if (password === user.password) {
      return res.status(200).json({ msg: "Login successful!" });
    } else {
      return res.status(400).json({ error: "Incorrect password." });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL STUDENT INFORMATION FOR FACULTY
exports.getAllStudentsForFaculty = async (req, res) => {
    try {
        const students = await User.find({ role: "student" }).select("-password");

        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};