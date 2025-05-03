const express = require('express');
const authRouter = express.Router();
const { protect } = require('../middleware/authMiddleware.js');
const { registerUser, loginUser, getUserInfo } = require('../controllers/authController.js');
const upload = require('../middleware/uploadMiddleware.js');

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.get('/getuser',protect, getUserInfo);
authRouter.post('/upload-image', upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
});


module.exports = authRouter;