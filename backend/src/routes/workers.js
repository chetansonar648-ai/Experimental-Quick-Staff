import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { uploadProfilePicture } from "../middleware/upload.js";
import { query } from "../config/db.js";
import {
  getWorkerProfile,
  listWorkers,
  updateWorkerProfile,
  validateWorkerProfile,
  getWorkerStats,
  getWorkerJobs,
  updateJobStatus,
  getSavedClients,
  undoJobStatus,
  saveClientFromJob,
} from "../controllers/workersController.js";

const router = Router();

// Categories endpoint - must be before /:id to avoid conflict
router.get("/categories/list", async (req, res, next) => {
  try {
    // Get unique skills/categories from workers with count
    const result = await query(`
      SELECT DISTINCT unnest(wp.skills) as category, COUNT(*) as count
      FROM worker_profiles wp
      JOIN users u ON u.id = wp.user_id
      WHERE u.is_active = TRUE AND u.role = 'worker'
      GROUP BY category
      ORDER BY count DESC, category ASC
    `);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.get("/", listWorkers);

// Specific routes MUST come before /:id to avoid matching issues
router.get("/stats", authenticate(["worker"]), getWorkerStats);
router.get("/jobs", authenticate(["worker"]), getWorkerJobs);
router.patch("/jobs/:id/status", authenticate(["worker"]), updateJobStatus);
router.post("/jobs/:id/undo", authenticate(["worker"]), undoJobStatus);
router.post("/jobs/:jobId/save-client", authenticate(["worker"]), saveClientFromJob);
router.get("/saved-clients", authenticate(["worker"]), getSavedClients);

// IMPORTANT: /me/* routes must come BEFORE /:id to avoid "me" being matched as an id
router.get("/me/profile", authenticate(), getWorkerProfile);
router.put("/me/profile", authenticate(["worker"]), validateWorkerProfile, updateWorkerProfile);
router.get("/:id", getWorkerProfile);

// /:id route must be LAST since it's a catch-all
router.get("/:id", getWorkerProfile);

// Profile picture upload
router.post(
  "/me/profile-picture",
  authenticate(["worker"]),
  uploadProfilePicture.single("profile_picture"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const imageUrl = `/uploads/profiles/${req.file.filename}`;

      // Update users table profile_image column
      await query(
        "UPDATE users SET profile_image = $1, updated_at = NOW() WHERE id = $2",
        [imageUrl, req.user.id]
      );

      res.json({ profile_image: imageUrl, message: "Profile picture updated successfully" });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
