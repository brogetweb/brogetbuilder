
import express from "express";
import mongoose from "mongoose";
import authMiddleware from "../middleware/authMiddleware.js";

import User from "../models/User.js";
import Project from "../models/Project.js";
import SiteMaterial from "../models/SiteMaterial.js";
import MaterialTransaction from "../models/MaterialTransaction.js";
import SiteActivity from "../models/SiteActivity.js";
import DailySiteReport from "../models/DailySiteReport.js";

const router = express.Router();

/* =========================================================
   COMMON HELPERS
========================================================= */

const isManager = (user) =>
  ["owner", "superadmin"].includes(user.role);

const validId = (id) =>
  mongoose.Types.ObjectId.isValid(id);

const todayIST = () => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
};

const isLateSubmission = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const hour = Number(
    parts.find((p) => p.type === "hour").value
  );

  const minute = Number(
    parts.find((p) => p.type === "minute").value
  );

  return hour > 18 || (hour === 18 && minute > 0);
};

const canManageProject = (user, project) => {
  if (user.role === "superadmin") return true;

  return (
    user.role === "owner" &&
    project.ownerId?.toString() === user._id.toString()
  );
};

/* =========================================================
   AUTHENTICATION
========================================================= */

router.use(authMiddleware);

/* =========================================================
   PROJECT ACCESS MIDDLEWARE
   Verifies that the logged-in user can access the project.
========================================================= */

const loadProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    if (!validId(projectId)) {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const user = req.user;

    const isSupervisorAssigned =
      user.role === "siteSupervisor" &&
      (project.assignedSupervisors || []).some(
        (id) => id.toString() === user._id.toString()
      );

    const isOwnerOfProject =
      user.role === "owner" &&
      project.ownerId?.toString() === user._id.toString();

    if (
      user.role !== "superadmin" &&
      !isSupervisorAssigned &&
      !isOwnerOfProject
    ) {
      return res.status(403).json({
        message: "You do not have access to this project",
      });
    }

    req.project = project;

    next();
  } catch (error) {
    console.error("Project access error:", error);

    res.status(500).json({
      message: "Unable to verify project access",
    });
  }
};

/* =========================================================
   1. GET ALL CONSTRUCTION PROJECTS
   GET /api/construction-sites/projects
========================================================= */

router.get("/projects", async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "owner") {
      filter.ownerId = req.user._id;
    } else if (req.user.role === "siteSupervisor") {
      filter.assignedSupervisors = req.user._id;
    } else if (req.user.role !== "superadmin") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const projects = await Project.find(filter)
      .select(
        "name builder location city status ownerId assignedSupervisors"
      )
      .populate("assignedSupervisors", "name email")
      .sort({ createdAt: -1 });

    res.json({ projects });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to load projects",
    });
  }
});

/* =========================================================
   2. GET ALL SITE SUPERVISORS
   GET /api/construction-sites/supervisors
========================================================= */

router.get("/supervisors", async (req, res) => {
  try {
    if (!["owner", "superadmin"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const supervisors = await User.find({
      role: "siteSupervisor",
    }).select("name email");

    res.json({ supervisors });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to load supervisors",
    });
  }
});

/* =========================================================
   3. ASSIGN SUPERVISOR TO PROJECT
   PUT /api/construction-sites/projects/:projectId/assign-supervisor
========================================================= */

router.put(
  "/projects/:projectId/assign-supervisor",
  loadProject,
  async (req, res) => {
    try {
      const { supervisorId } = req.body;

      if (!validId(supervisorId)) {
        return res.status(400).json({
          message: "Invalid supervisor ID",
        });
      }

      if (!["owner", "superadmin"].includes(req.user.role)) {
        return res.status(403).json({
          message: "Access denied",
        });
      }

      if (!canManageProject(req.user, req.project)) {
        return res.status(403).json({
          message: "You cannot assign supervisors to this project",
        });
      }

      const supervisor = await User.findOne({
        _id: supervisorId,
        role: "siteSupervisor",
      });

      if (!supervisor) {
        return res.status(404).json({
          message: "Site supervisor not found",
        });
      }

      const alreadyAssigned =
        (req.project.assignedSupervisors || []).some(
          (id) => id.toString() === supervisorId
        );

      if (!alreadyAssigned) {
        req.project.assignedSupervisors.push(supervisorId);

        await req.project.save();
      }

      res.json({
        message: "Supervisor assigned successfully",
        project: req.project,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Unable to assign supervisor",
      });
    }
  }
);

/* =========================================================
   4. REMOVE SUPERVISOR FROM PROJECT
   DELETE /api/construction-sites/projects/:projectId/supervisors/:supervisorId
========================================================= */

router.delete(
  "/projects/:projectId/supervisors/:supervisorId",
  loadProject,
  async (req, res) => {
    try {
      if (!["owner", "superadmin"].includes(req.user.role)) {
        return res.status(403).json({
          message: "Access denied",
        });
      }

      if (!canManageProject(req.user, req.project)) {
        return res.status(403).json({
          message: "Access denied",
        });
      }

      const { supervisorId } = req.params;

      if (!validId(supervisorId)) {
        return res.status(400).json({
          message: "Invalid supervisor ID",
        });
      }

      req.project.assignedSupervisors =
        (req.project.assignedSupervisors || []).filter(
          (id) => id.toString() !== supervisorId
        );

      await req.project.save();

      res.json({
        message: "Supervisor removed successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Unable to remove supervisor",
      });
    }
  }
);

/* =========================================================
   5. ADD MATERIAL TO PROJECT
   POST /api/construction-sites/projects/:projectId/materials
========================================================= */

router.post(
  "/projects/:projectId/materials",
  loadProject,
  async (req, res) => {
    try {
      if (!isManager(req.user)) {
        return res.status(403).json({
          message: "Only builders can add materials",
        });
      }

      if (!canManageProject(req.user, req.project)) {
        return res.status(403).json({
          message: "Access denied",
        });
      }

      const {
        name,
        unit,
        openingStock = 0,
        lowStockLevel = 0,
      } = req.body;

      if (
        !name?.trim() ||
        !unit?.trim() ||
        !Number.isFinite(Number(openingStock)) ||
        Number(openingStock) < 0 ||
        !Number.isFinite(Number(lowStockLevel)) ||
        Number(lowStockLevel) < 0
      ) {
        return res.status(400).json({
          message: "Enter valid material details",
        });
      }

      const material = await SiteMaterial.create({
        projectId: req.project._id,
        name: name.trim(),
        unit: unit.trim(),
        openingStock: Number(openingStock),
        currentStock: Number(openingStock),
        lowStockLevel: Number(lowStockLevel),
        createdBy: req.user._id,
      });

      if (Number(openingStock) > 0) {
        await MaterialTransaction.create({
          projectId: req.project._id,
          materialId: material._id,
          type: "opening",
          quantity: Number(openingStock),
          performedBy: req.user._id,
          notes: "Opening stock",
        });
      }

      res.status(201).json({
        message: "Material created successfully",
        material,
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({
          message: "This material already exists for this project",
        });
      }

      console.error(error);

      res.status(500).json({
        message: "Unable to create material",
      });
    }
  }
);

/* =========================================================
   6. GET PROJECT MATERIALS
   GET /api/construction-sites/projects/:projectId/materials
========================================================= */

router.get(
  "/projects/:projectId/materials",
  loadProject,
  async (req, res) => {
    try {
      const materials = await SiteMaterial.find({
        projectId: req.project._id,
      }).sort({ name: 1 });

      res.json({ materials });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Unable to load materials",
      });
    }
  }
);

/* =========================================================
   7. RECEIVE MATERIAL AT SITE
   POST /api/construction-sites/projects/:projectId/materials/receive
========================================================= */

router.post(
  "/projects/:projectId/materials/receive",
  loadProject,
  async (req, res) => {
    try {
      if (!isManager(req.user)) {
        return res.status(403).json({
          message: "Only builders can record receipts",
        });
      }

      if (!canManageProject(req.user, req.project)) {
        return res.status(403).json({
          message: "Access denied",
        });
      }

      const {
        materialId,
        quantity,
        reference = "",
        notes = "",
      } = req.body;

      const amount = Number(quantity);

      if (
        !validId(materialId) ||
        !Number.isFinite(amount) ||
        amount <= 0
      ) {
        return res.status(400).json({
          message: "Enter a valid material and quantity",
        });
      }

      const material = await SiteMaterial.findOne({
        _id: materialId,
        projectId: req.project._id,
      });

      if (!material) {
        return res.status(404).json({
          message: "Material not found",
        });
      }

      const session = await mongoose.startSession();

      try {
        await session.withTransaction(async () => {
          await SiteMaterial.updateOne(
            { _id: material._id },
            { $inc: { currentStock: amount } },
            { session }
          );

          await MaterialTransaction.create(
            [
              {
                projectId: req.project._id,
                materialId,
                type: "received",
                quantity: amount,
                reference,
                notes,
                performedBy: req.user._id,
              },
            ],
            { session }
          );
        });
      } finally {
        await session.endSession();
      }

      const updated = await SiteMaterial.findById(materialId);

      res.status(201).json({
        message: "Material receipt recorded",
        material: updated,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Unable to record material receipt",
      });
    }
  }
);

/* =========================================================
   8. GET PROJECT WORK ACTIVITIES
   GET /api/construction-sites/projects/:projectId/activities
========================================================= */

router.get(
  "/projects/:projectId/activities",
  loadProject,
  async (req, res) => {
    try {
      const activities = await SiteActivity.find({
        projectId: req.project._id,
      })
        .populate("assignedSupervisor", "name")
        .sort({ createdAt: -1 });

      res.json({ activities });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Unable to load work activities",
      });
    }
  }
);

/* =========================================================
   9. CREATE WORK ACTIVITY
   POST /api/construction-sites/projects/:projectId/activities
========================================================= */

router.post(
  "/projects/:projectId/activities",
  loadProject,
  async (req, res) => {
    try {
      if (
        !isManager(req.user) ||
        !canManageProject(req.user, req.project)
      ) {
        return res.status(403).json({
          message: "Access denied",
        });
      }

      const {
        name,
        description = "",
        plannedQuantity = 0,
        unit = "%",
        assignedSupervisor = null,
      } = req.body;

      const planned = Number(plannedQuantity);

      if (
        !name?.trim() ||
        !Number.isFinite(planned) ||
        planned < 0
      ) {
        return res.status(400).json({
          message: "Enter valid activity details",
        });
      }

      if (assignedSupervisor) {
        if (!validId(assignedSupervisor)) {
          return res.status(400).json({
            message: "Invalid supervisor ID",
          });
        }

        const assigned =
          (req.project.assignedSupervisors || []).some(
            (id) => id.toString() === assignedSupervisor
          );

        const supervisorExists = await User.exists({
          _id: assignedSupervisor,
          role: "siteSupervisor",
        });

        if (!assigned || !supervisorExists) {
          return res.status(400).json({
            message: "Select a supervisor assigned to this project",
          });
        }
      }

      const activity = await SiteActivity.create({
        projectId: req.project._id,
        name: name.trim(),
        description,
        plannedQuantity: planned,
        unit,
        assignedSupervisor,
        createdBy: req.user._id,
      });

      res.status(201).json({
        message: "Work activity created",
        activity,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Unable to create activity",
      });
    }
  }
);

/* =========================================================
   10. SUBMIT DAILY SITE REPORT
   POST /api/construction-sites/projects/:projectId/daily-reports

   Supervisor submits:
   - Today's work summary
   - Workers present
   - Work completed
   - Materials consumed

   Deadline: 6 PM IST
========================================================= */

router.post(
  "/projects/:projectId/daily-reports",
  loadProject,
  async (req, res) => {
    const session = await mongoose.startSession();

    try {
      if (req.user.role !== "siteSupervisor") {
        return res.status(403).json({
          message: "Only site supervisors can submit daily reports",
        });
      }

      const {
        workSummary,
        workersPresent = 0,
        remarks = "",
        activities = [],
        materials = [],
      } = req.body;

      if (!workSummary?.trim()) {
        return res.status(400).json({
          message: "Please enter today's work summary",
        });
      }

      if (
        !Number.isInteger(Number(workersPresent)) ||
        Number(workersPresent) < 0 ||
        !Array.isArray(activities) ||
        !Array.isArray(materials)
      ) {
        return res.status(400).json({
          message: "Invalid report data",
        });
      }

      const reportDate = todayIST();
      const submittedAt = new Date();

      const submissionStatus = isLateSubmission(submittedAt)
        ? "Late"
        : "On Time";

      let createdReport;

      await session.withTransaction(async () => {
        const report = await DailySiteReport.create(
          [
            {
              projectId: req.project._id,
              supervisorId: req.user._id,
              reportDate,
              workSummary: workSummary.trim(),
              workersPresent: Number(workersPresent),
              remarks,
              activities: [],
              materials: [],
              submittedAt,
              submissionStatus,
            },
          ],
          { session }
        );

        createdReport = report[0];

        /* Update work activity progress */

        const reportActivities = [];

        for (const item of activities) {
          if (
            !validId(item.activityId) ||
            !Number.isFinite(Number(item.completedQuantity)) ||
            Number(item.completedQuantity) < 0
          ) {
            throw new Error("Invalid activity entry");
          }

          const activity = await SiteActivity.findOne({
            _id: item.activityId,
            projectId: req.project._id,
            $or: [
              { assignedSupervisor: req.user._id },
              { assignedSupervisor: null },
            ],
          }).session(session);

          if (!activity) {
            throw new Error(
              "Activity not found or not assigned to you"
            );
          }

          const newCompleted =
            activity.completedQuantity +
            Number(item.completedQuantity);

          if (
            activity.plannedQuantity > 0 &&
            newCompleted > activity.plannedQuantity
          ) {
            throw new Error(
              `Completed quantity exceeds plan for ${activity.name}`
            );
          }

          const progress =
            activity.plannedQuantity > 0
              ? Math.min(
                  100,
                  (newCompleted / activity.plannedQuantity) * 100
                )
              : activity.progress;

          activity.completedQuantity = newCompleted;

          activity.progress =
            Math.round(progress * 100) / 100;

          activity.status =
            activity.progress >= 100
              ? "Completed"
              : activity.progress > 0
                ? "In Progress"
                : "Not Started";

          await activity.save({ session });

          reportActivities.push({
            activityId: activity._id,
            completedQuantity: Number(item.completedQuantity),
            progress: activity.progress,
          });
        }

        /* Deduct materials consumed */

        const reportMaterials = [];

        for (const item of materials) {
          const amount = Number(item.quantityUsed);

          if (
            !validId(item.materialId) ||
            !Number.isFinite(amount) ||
            amount <= 0
          ) {
            throw new Error(
              "Invalid material consumption entry"
            );
          }

          const updated = await SiteMaterial.findOneAndUpdate(
            {
              _id: item.materialId,
              projectId: req.project._id,
              currentStock: { $gte: amount },
            },
            {
              $inc: { currentStock: -amount },
            },
            {
              new: true,
              session,
            }
          );

          if (!updated) {
            throw new Error(
              "Material not found or insufficient remaining stock"
            );
          }

          await MaterialTransaction.create(
            [
              {
                projectId: req.project._id,
                materialId: updated._id,
                type: "consumed",
                quantity: amount,
                performedBy: req.user._id,
                reportId: createdReport._id,
              },
            ],
            { session }
          );

          reportMaterials.push({
            materialId: updated._id,
            quantityUsed: amount,
          });
        }

        createdReport.activities = reportActivities;
        createdReport.materials = reportMaterials;

        await createdReport.save({ session });
      });

      res.status(201).json({
        message:
          submissionStatus === "Late"
            ? "Daily report submitted and marked late"
            : "Daily report submitted successfully",
        report: createdReport,
      });
    } catch (error) {
      console.error("Daily report error:", error);

      const duplicate = error.code === 11000;

      res.status(duplicate ? 409 : 400).json({
        message: duplicate
          ? "You have already submitted today's report for this project"
          : error.message || "Unable to submit daily report",
      });
    } finally {
      await session.endSession();
    }
  }
);

/* =========================================================
   11. GET DAILY REPORTS
   GET /api/construction-sites/projects/:projectId/reports
========================================================= */

router.get(
  "/projects/:projectId/reports",
  loadProject,
  async (req, res) => {
    try {
      const filter = {
        projectId: req.project._id,
      };

      if (req.user.role === "siteSupervisor") {
        filter.supervisorId = req.user._id;
      }

      const reports = await DailySiteReport.find(filter)
        .populate("supervisorId", "name email")
        .populate("activities.activityId", "name unit")
        .populate("materials.materialId", "name unit")
        .sort({
          reportDate: -1,
          submittedAt: -1,
        });

      res.json({ reports });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Unable to load reports",
      });
    }
  }
);

/* =========================================================
   12. GET MATERIAL TRANSACTION HISTORY
   GET /api/construction-sites/projects/:projectId/transactions
========================================================= */

router.get(
  "/projects/:projectId/transactions",
  loadProject,
  async (req, res) => {
    try {
      const transactions = await MaterialTransaction.find({
        projectId: req.project._id,
      })
        .populate("materialId", "name unit")
        .populate("performedBy", "name")
        .sort({ createdAt: -1 })
        .limit(200);

      res.json({ transactions });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Unable to load transactions",
      });
    }
  }
);

/* =========================================================
   13. CONSTRUCTION SITE DASHBOARD
   GET /api/construction-sites/projects/:projectId/dashboard

   Shows:
   - Total materials
   - Remaining material stock
   - Low stock materials
   - Work activities
   - Average work progress
   - Daily report count
   - Latest reports
========================================================= */

router.get(
  "/projects/:projectId/dashboard",
  loadProject,
  async (req, res) => {
    try {
      const projectId = req.project._id;

      const [
        materials,
        activities,
        reportCount,
        latestReports,
      ] = await Promise.all([
        SiteMaterial.find({ projectId }).sort({ name: 1 }),

        SiteActivity.find({ projectId }).sort({
          createdAt: -1,
        }),

        DailySiteReport.countDocuments({
          projectId,
          ...(req.user.role === "siteSupervisor"
            ? { supervisorId: req.user._id }
            : {}),
        }),

        DailySiteReport.find({
          projectId,
          ...(req.user.role === "siteSupervisor"
            ? { supervisorId: req.user._id }
            : {}),
        })
          .populate("supervisorId", "name")
          .sort({ submittedAt: -1 })
          .limit(5),
      ]);

      const lowStock = materials.filter(
        (material) =>
          material.currentStock <= material.lowStockLevel
      );

      const averageProgress = activities.length
        ? Math.round(
            activities.reduce(
              (sum, activity) => sum + activity.progress,
              0
            ) / activities.length
          )
        : 0;

      res.json({
        project: req.project,

        summary: {
          totalMaterials: materials.length,
          lowStockCount: lowStock.length,
          totalActivities: activities.length,
          averageProgress,
          reportCount,
        },

        materials,
        activities,
        lowStock,
        latestReports,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Unable to load dashboard",
      });
    }
  }
);

export default router;
