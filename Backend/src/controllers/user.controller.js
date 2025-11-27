import cloudinary from "../config/cloudinary.js";
import prisma from "../config/prisma.js";

export const UserData = async (req, res) => {
    try {
        const { userId } = req.user;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized request" });
        }

        const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true, isAccountVerified: true, profilePic: true, createdAt: true} });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, userData: user });

    } catch (err) {
        res.status(500).json({ success: false, message: "Error occur in get User data function" });
    }
}

export const UserProfile = async (req, res) => {
    try {
        const { image } = req.body;
        const { userId } = req.user;

        if (!userId) return res.status(401).json({ message: "User ID is missing" });
        if (!image) return res.status(400).json({ message: "Profile picture is required" });

        const uploadImage = await cloudinary.uploader.upload(image, { folder: "users_profile" });

        await prisma.user.update({ where: { id: userId }, data: { profilePic: uploadImage.secure_url } });

        return res.status(200).json({ success: true, message: "User Profile updated succesfully", image: uploadImage.secure_url });
    }
    catch (error) {
        console.error("Error in updateProfile:", error.stack);
        res.status(500).json({ success: false, message: "Error while uploading profile" });
    }
}

