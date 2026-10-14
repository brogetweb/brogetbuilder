import express from "express";
import Project from "../models/Project.js";

const router = express.Router();

/*
GET ALL PROJECTS

GET /api/projects
*/
router.get("/", async (req, res) => {
  try {
    const {
      search,
      status,
      city,
      propertyType,
      sort
    } = req.query;

    const filter = {};

    // Search project name,
    // builder or location
    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i"
          }
        },

        {
          builder: {
            $regex: search,
            $options: "i"
          }
        },

        {
          location: {
            $regex: search,
            $options: "i"
          }
        }
      ];
    }

    // Status filter
    if (status) {
      filter.status = status;
    }

    // City filter
    if (city) {
      filter.city = {
        $regex: city,
        $options: "i"
      };
    }

    // Property type filter
    if (propertyType) {
      filter.propertyType =
        propertyType;
    }

    // Sorting
    let sortOption = {
      createdAt: -1
    };

    if (sort === "low") {
      sortOption = {
        minPrice: 1
      };
    }

    if (sort === "high") {
      sortOption = {
        minPrice: -1
      };
    }

    const projects =
      await Project
        .find(filter)
        .sort(sortOption);

    res.status(200).json(
      projects
    );

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


/*
GET FEATURED PROJECTS

GET /api/projects/featured/list
*/
router.get(
  "/featured/list",
  async (req, res) => {
    try {
      const projects =
        await Project
          .find({
            featured: true
          })
          .limit(6);

      res.status(200).json(
        projects
      );

    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);


/*
GET SINGLE PROJECT

GET /api/projects/:id
*/
router.get(
  "/:id",
  async (req, res) => {
    try {
      const project =
        await Project.findById(
          req.params.id
        );

      if (!project) {
        return res.status(404).json({
          message:
            "Project not found"
        });
      }

      res.status(200).json(
        project
      );

    } catch (error) {
      res.status(400).json({
        message:
          "Invalid project ID"
      });
    }
  }
);


/*
CREATE PROJECT

POST /api/projects
*/
router.post(
  "/",
  async (req, res) => {
    try {
      const project =
        await Project.create(
          req.body
        );

      res.status(201).json({
        message:
          "Project added successfully",

        project
      });

    } catch (error) {
      res.status(400).json({
        message: error.message
      });
    }
  }
);


/*
UPDATE PROJECT

PUT /api/projects/:id
*/
router.put(
  "/:id",
  async (req, res) => {
    try {
      const project =
        await Project.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true
          }
        );

      if (!project) {
        return res.status(404).json({
          message:
            "Project not found"
        });
      }

      res.status(200).json({
        message:
          "Project updated successfully",

        project
      });

    } catch (error) {
      res.status(400).json({
        message: error.message
      });
    }
  }
);


/*
DELETE PROJECT

DELETE /api/projects/:id
*/
router.delete(
  "/:id",
  async (req, res) => {
    try {
      const project =
        await Project.findByIdAndDelete(
          req.params.id
        );

      if (!project) {
        return res.status(404).json({
          message:
            "Project not found"
        });
      }

      res.status(200).json({
        message:
          "Project deleted successfully"
      });

    } catch (error) {
      res.status(400).json({
        message:
          "Invalid project ID"
      });
    }
  }
);


export default router;