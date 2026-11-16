import Project from "../models/Project.js";

const constructionAccess = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({
        message: "Project ID is required",
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const user = req.user;

    const isSuperAdmin = user.role === "superadmin";

    const isOwner =
      user.role === "owner" &&
      project.ownerId?.toString() === user._id.toString();

    const isAssignedSupervisor =
      user.role === "siteSupervisor" &&
      project.assignedSupervisors.some(
        (id) => id.toString() === user._id.toString()
      );

    if (!isSuperAdmin && !isOwner && !isAssignedSupervisor) {
      return res.status(403).json({
        message: "You do not have access to this construction project",
      });
    }

    req.project = project;
    next();
  } catch (error) {
    console.error("Construction access error:", error);

    res.status(500).json({
      message: "Unable to verify project access",
    });
  }
};

export default constructionAccess;