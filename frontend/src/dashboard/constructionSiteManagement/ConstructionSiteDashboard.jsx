import { useEffect, useMemo, useState } from "react";
import {Link } from 'react-router-dom';
import axios from "axios";
import { API_URL } from "../../config";
import "./ConstructionSiteDashboard.css";

const API = `${API_URL}/construction-sites`;

const getToken = () => localStorage.getItem("token");

const requestConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

const ConstructionSiteDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [dashboard, setDashboard] = useState(null);
  const [reports, setReports] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [activities, setActivities] = useState([]);
  const [materials, setMaterials] = useState([]);

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const user = useMemo(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      return stored;
    } catch {
      return {};
    }
  }, []);

  const isManager = ["owner", "superadmin"].includes(user.role);
  const isSupervisor = user.role === "siteSupervisor";

  const [materialForm, setMaterialForm] = useState({
    name: "",
    unit: "Bags",
    openingStock: "",
    lowStockLevel: "",
  });

  const [receiveForm, setReceiveForm] = useState({
    materialId: "",
    quantity: "",
    reference: "",
    notes: "",
  });

  const [activityForm, setActivityForm] = useState({
    name: "",
    description: "",
    plannedQuantity: "",
    unit: "Sq. Ft.",
    assignedSupervisor: "",
  });

  const [reportForm, setReportForm] = useState({
    workSummary: "",
    workersPresent: "",
    remarks: "",
    activities: [],
    materials: [],
  });

  const [assignmentForm, setAssignmentForm] = useState({
    supervisorId: "",
  });

  // NEW: CREATE SUPERVISOR FORM
  const [supervisorForm, setSupervisorForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const selectedProjectData = projects.find(
    (project) => project._id === selectedProject
  );

  const showMessage = (text) => {
    setMessage(text);
    setError("");
  };

  const showError = (text) => {
    setError(text);
    setMessage("");
  };

  const loadProjects = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API}/projects`,
        requestConfig()
      );

      const list = response.data.projects || [];

      setProjects(list);

      if (list.length) {
        setSelectedProject((current) =>
          list.some((project) => project._id === current)
            ? current
            : list[0]._id
        );
      }
    } catch (err) {
      showError(
        err.response?.data?.message || "Unable to load projects"
      );
    } finally {
      setLoading(false);
    }
  };

  const loadProjectData = async (projectId) => {
    if (!projectId) return;

    try {
      setLoading(true);
      setMessage("");
      setError("");

      const config = requestConfig();

      const [
        dashboardResponse,
        activitiesResponse,
        reportsResponse,
        transactionsResponse,
      ] = await Promise.all([
        axios.get(`${API}/projects/${projectId}/dashboard`, config),
        axios.get(`${API}/projects/${projectId}/activities`, config),
        axios.get(`${API}/projects/${projectId}/reports`, config),
        axios.get(`${API}/projects/${projectId}/transactions`, config),
      ]);

      setDashboard(dashboardResponse.data);
      setMaterials(dashboardResponse.data.materials || []);
      setActivities(activitiesResponse.data.activities || []);
      setReports(reportsResponse.data.reports || []);
      setTransactions(transactionsResponse.data.transactions || []);

      if (isManager) {
        const supervisorResponse = await axios.get(
          `${API}/supervisors`,
          config
        );

        setSupervisors(supervisorResponse.data.supervisors || []);
      }
    } catch (err) {
      showError(
        err.response?.data?.message || "Unable to load project data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadProjectData(selectedProject);
    }
  }, [selectedProject]);

  const refresh = async () => {
    await loadProjectData(selectedProject);
  };

  // ADD MATERIAL
  const addMaterial = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      await axios.post(
        `${API}/projects/${selectedProject}/materials`,
        {
          ...materialForm,
          openingStock: Number(materialForm.openingStock || 0),
          lowStockLevel: Number(materialForm.lowStockLevel || 0),
        },
        requestConfig()
      );

      setMaterialForm({
        name: "",
        unit: "Bags",
        openingStock: "",
        lowStockLevel: "",
      });

      showMessage("Material added successfully");
      await refresh();
    } catch (err) {
      showError(
        err.response?.data?.message || "Unable to add material"
      );
    } finally {
      setSaving(false);
    }
  };

  // RECEIVE MATERIAL
  const receiveMaterial = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      await axios.post(
        `${API}/projects/${selectedProject}/materials/receive`,
        {
          ...receiveForm,
          quantity: Number(receiveForm.quantity),
        },
        requestConfig()
      );

      setReceiveForm({
        materialId: "",
        quantity: "",
        reference: "",
        notes: "",
      });

      showMessage("Material receipt recorded");
      await refresh();
    } catch (err) {
      showError(
        err.response?.data?.message || "Unable to record material receipt"
      );
    } finally {
      setSaving(false);
    }
  };

  // CREATE WORK ACTIVITY
  const addActivity = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      await axios.post(
        `${API}/projects/${selectedProject}/activities`,
        {
          ...activityForm,
          plannedQuantity: Number(activityForm.plannedQuantity || 0),
          assignedSupervisor: activityForm.assignedSupervisor || null,
        },
        requestConfig()
      );

      setActivityForm({
        name: "",
        description: "",
        plannedQuantity: "",
        unit: "Sq. Ft.",
        assignedSupervisor: "",
      });

      showMessage("Work activity created");
      await refresh();
    } catch (err) {
      showError(
        err.response?.data?.message || "Unable to create activity"
      );
    } finally {
      setSaving(false);
    }
  };

  // UPDATE ACTIVITY ENTRY
  const updateActivityEntry = (activityId, value) => {
    setReportForm((current) => {
      const next = current.activities.filter(
        (item) => item.activityId !== activityId
      );

      if (value !== "") {
        next.push({
          activityId,
          completedQuantity: value,
        });
      }

      return { ...current, activities: next };
    });
  };

  // UPDATE MATERIAL ENTRY
  const updateMaterialEntry = (materialId, value) => {
    setReportForm((current) => {
      const next = current.materials.filter(
        (item) => item.materialId !== materialId
      );

      if (value !== "") {
        next.push({
          materialId,
          quantityUsed: value,
        });
      }

      return { ...current, materials: next };
    });
  };

  // SUBMIT DAILY REPORT
  const submitReport = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      const payload = {
        ...reportForm,
        workersPresent: Number(reportForm.workersPresent || 0),
        activities: reportForm.activities.map((item) => ({
          ...item,
          completedQuantity: Number(item.completedQuantity),
        })),
        materials: reportForm.materials.map((item) => ({
          ...item,
          quantityUsed: Number(item.quantityUsed),
        })),
      };

      const response = await axios.post(
        `${API}/projects/${selectedProject}/daily-reports`,
        payload,
        requestConfig()
      );

      setReportForm({
        workSummary: "",
        workersPresent: "",
        remarks: "",
        activities: [],
        materials: [],
      });

      showMessage(response.data.message);
      setActiveTab("reports");
      await refresh();
    } catch (err) {
      showError(
        err.response?.data?.message || "Unable to submit daily report"
      );
    } finally {
      setSaving(false);
    }
  };

  // ASSIGN EXISTING SUPERVISOR
  const assignSupervisor = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      await axios.put(
        `${API}/projects/${selectedProject}/assign-supervisor`,
        assignmentForm,
        requestConfig()
      );

      setAssignmentForm({ supervisorId: "" });
      showMessage("Supervisor assigned successfully");

      await loadProjects();
      await loadProjectData(selectedProject);
    } catch (err) {
      showError(
        err.response?.data?.message || "Unable to assign supervisor"
      );
    } finally {
      setSaving(false);
    }
  };

  // CREATE NEW SUPERVISOR AND AUTOMATICALLY ASSIGN
  const createAndAssignSupervisor = async (event) => {
    event.preventDefault();

    if (!selectedProject) {
      showError("Please select a construction project first.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      setError("");

      // STEP 1: CREATE SUPERVISOR ACCOUNT
      const createResponse = await axios.post(
        `${API_URL}/auth/create-supervisor`,
        {
          name: supervisorForm.name.trim(),
          email: supervisorForm.email.trim(),
          password: supervisorForm.password,
        },
        requestConfig()
      );

      const newSupervisor = createResponse.data.supervisor;
      const newSupervisorId = newSupervisor?.id || newSupervisor?._id;

      if (!newSupervisorId) {
        throw new Error(
          "Supervisor account was created, but the server did not return its ID."
        );
      }

      // STEP 2: ASSIGN SUPERVISOR TO SELECTED PROJECT
      await axios.put(
        `${API}/projects/${selectedProject}/assign-supervisor`,
        { supervisorId: newSupervisorId },
        requestConfig()
      );

      // STEP 3: RESET FORM
      setSupervisorForm({
        name: "",
        email: "",
        password: "",
      });

      setAssignmentForm({ supervisorId: "" });

      showMessage(
        "Supervisor account created and assigned to this project successfully."
      );

      // STEP 4: REFRESH DATA
      await loadProjects();
      await loadProjectData(selectedProject);
    } catch (err) {
      showError(
        err.response?.data?.message ||
          err.message ||
          "Unable to create and assign supervisor."
      );
    } finally {
      setSaving(false);
    }
  };

  // REMOVE SUPERVISOR
  const removeSupervisor = async (supervisorId) => {
    if (!window.confirm("Remove this supervisor from the project?")) return;

    try {
      setSaving(true);

      await axios.delete(
        `${API}/projects/${selectedProject}/supervisors/${supervisorId}`,
        requestConfig()
      );

      showMessage("Supervisor removed");

      await loadProjects();
      await loadProjectData(selectedProject);
    } catch (err) {
      showError(
        err.response?.data?.message || "Unable to remove supervisor"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading && !projects.length) {
    return <div className="csm-loading">Loading construction dashboard...</div>;
  }

  if (!projects.length) {
    return (
      <div className="csm-empty">
        <h2>No construction projects available</h2>
        <p>
          {isSupervisor
            ? "Ask your builder to assign you to a construction project."
            : "Create a project first, then assign a site supervisor."}
        </p>
      </div>
    );
  }

  const tabs = [
    ["overview", "Overview"],
    ["inventory", "Material Inventory"],
    ["activities", "Work Progress"],
    ...(isSupervisor ? [["daily-report", "Submit Daily Report"]] : []),
    ["reports", "Report History"],
    ["transactions", "Material Transactions"],
    ...(isManager ? [["assignment", "Supervisor Assignment"]] : []),
  ];

  return (
    <div className="csm-layout">
      <aside className="csm-sidebar">
        <div className="csm-brand">
          <span className="csm-brand-mark">BB</span>
          <div>
            <strong>BUILDERBROGET</strong>
            <small>CONSTRUCTION MANAGEMENT</small>
          </div>
        </div>

        <div className="csm-sidebar-title">SITE MANAGEMENT</div>

        <nav className="csm-nav">
          {tabs.map(([key, label]) => (
            <button
              key={key}
              className={activeTab === key ? "active" : ""}
              onClick={() => setActiveTab(key)}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="csm-sidebar-footer">
          <span>Signed in as</span>
          <strong>{user.name || user.email || "Dashboard user"}</strong>
          <small>{user.role || "User"}</small>
        </div>
      </aside>

      <main className="csm-main">
        <header className="csm-header">
          <div>
            <span className="csm-eyebrow">CONSTRUCTION SITE MANAGEMENT</span>
            <h1>{tabs.find(([key]) => key === activeTab)?.[1]}</h1>
          </div>

          <div className="csm-project-select">
            <label htmlFor="csm-project">Active project</label>
            <select
              id="csm-project"
              value={selectedProject}
              onChange={(event) => setSelectedProject(event.target.value)}
            >
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </header>

        {message && <div className="csm-alert success">{message}</div>}
        {error && <div className="csm-alert error">{error}</div>}

        {selectedProjectData && (
          <section className="csm-project-banner">
            <div>
              <span>SELECTED CONSTRUCTION PROJECT</span>
              <h2>{selectedProjectData.name}</h2>
              <p>
                {selectedProjectData.location}, {selectedProjectData.city}
              </p>
            </div>
            <span className="csm-status">
              {selectedProjectData.status}
            </span>
          </section>
        )}

        {/* OVERVIEW */}
        {activeTab === "overview" && dashboard && (
          <>
            <section className="csm-stat-grid">
              <StatCard
                label="Total Materials"
                value={dashboard.summary.totalMaterials}
                note="Tracked materials"
              />
              <StatCard
                label="Low Stock Alerts"
                value={dashboard.summary.lowStockCount}
                note="Require attention"
              />
              <StatCard
                label="Work Activities"
                value={dashboard.summary.totalActivities}
                note="Tracked activities"
              />
              <StatCard
                label="Average Progress"
                value={`${dashboard.summary.averageProgress}%`}
                note="Across activities"
              />
              <StatCard
                label="Daily Reports"
                value={dashboard.summary.reportCount}
                note="Submitted reports"
              />
            </section>

            <section className="csm-panel">
              <PanelHeading
                title="Remaining Material Stock"
                subtitle="Current available material at this construction site"
              />
              <MaterialTable materials={materials} />
            </section>

            <section className="csm-panel">
              <PanelHeading
                title="Work Progress"
                subtitle="Latest activity completion status"
              />
              <ActivityTable activities={activities} />
            </section>

            <section className="csm-panel">
              <PanelHeading
                title="Low Stock Alerts"
                subtitle="Materials at or below their minimum stock level"
              />
              <MaterialTable materials={dashboard.lowStock || []} />
            </section>
          </>
        )}

        {/* INVENTORY */}
        {activeTab === "inventory" && (
          <>
            {isManager && (
              <div className="csm-two-column">
                <section className="csm-panel">
                  <PanelHeading
                    title="Add Material"
                    subtitle="Create a material inventory record"
                  />

                  <form className="csm-form" onSubmit={addMaterial}>
                    <label>Material name</label>
                    <input
                      required
                      placeholder="Example: Cement"
                      value={materialForm.name}
                      onChange={(e) =>
                        setMaterialForm({
                          ...materialForm,
                          name: e.target.value,
                        })
                      }
                    />

                    <label>Unit</label>
                    <input
                      required
                      placeholder="Bags, Kg, Ton, Pieces"
                      value={materialForm.unit}
                      onChange={(e) =>
                        setMaterialForm({
                          ...materialForm,
                          unit: e.target.value,
                        })
                      }
                    />

                    <label>Opening stock</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={materialForm.openingStock}
                      onChange={(e) =>
                        setMaterialForm({
                          ...materialForm,
                          openingStock: e.target.value,
                        })
                      }
                    />

                    <label>Low stock alert level</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={materialForm.lowStockLevel}
                      onChange={(e) =>
                        setMaterialForm({
                          ...materialForm,
                          lowStockLevel: e.target.value,
                        })
                      }
                    />

                    <button disabled={saving}>
                      {saving ? "Saving..." : "Add Material"}
                    </button>
                  </form>
                </section>

                <section className="csm-panel">
                  <PanelHeading
                    title="Record Material Received"
                    subtitle="Add newly delivered stock"
                  />

                  <form className="csm-form" onSubmit={receiveMaterial}>
                    <label>Select material</label>
                    <select
                      required
                      value={receiveForm.materialId}
                      onChange={(e) =>
                        setReceiveForm({
                          ...receiveForm,
                          materialId: e.target.value,
                        })
                      }
                    >
                      <option value="">Choose material</option>
                      {materials.map((material) => (
                        <option key={material._id} value={material._id}>
                          {material.name}
                        </option>
                      ))}
                    </select>

                    <label>Received quantity</label>
                    <input
                      required
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={receiveForm.quantity}
                      onChange={(e) =>
                        setReceiveForm({
                          ...receiveForm,
                          quantity: e.target.value,
                        })
                      }
                    />

                    <label>Invoice / delivery reference</label>
                    <input
                      value={receiveForm.reference}
                      onChange={(e) =>
                        setReceiveForm({
                          ...receiveForm,
                          reference: e.target.value,
                        })
                      }
                    />

                    <label>Notes</label>
                    <textarea
                      value={receiveForm.notes}
                      onChange={(e) =>
                        setReceiveForm({
                          ...receiveForm,
                          notes: e.target.value,
                        })
                      }
                    />

                    <button disabled={saving}>
                      {saving ? "Saving..." : "Record Receipt"}
                    </button>
                  </form>
                </section>
              </div>
            )}

            <section className="csm-panel">
              <PanelHeading
                title="Material Inventory"
                subtitle="Available stock for the selected project"
              />
              <MaterialTable materials={materials} />
            </section>
          </>
        )}

        {/* WORK ACTIVITIES */}
        {activeTab === "activities" && (
          <>
            {isManager && (
              <section className="csm-panel">
                <PanelHeading
                  title="Create Work Activity"
                  subtitle="Define work that needs to be tracked"
                />

                <form className="csm-form csm-form-grid" onSubmit={addActivity}>
                  <div>
                    <label>Activity name</label>
                    <input
                      required
                      placeholder="Example: Foundation work"
                      value={activityForm.name}
                      onChange={(e) =>
                        setActivityForm({
                          ...activityForm,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label>Planned quantity</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={activityForm.plannedQuantity}
                      onChange={(e) =>
                        setActivityForm({
                          ...activityForm,
                          plannedQuantity: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label>Unit</label>
                    <input
                      value={activityForm.unit}
                      onChange={(e) =>
                        setActivityForm({
                          ...activityForm,
                          unit: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label>Assign supervisor</label>
                    <select
                      value={activityForm.assignedSupervisor}
                      onChange={(e) =>
                        setActivityForm({
                          ...activityForm,
                          assignedSupervisor: e.target.value,
                        })
                      }
                    >
                      <option value="">Any assigned supervisor</option>
                      {(selectedProjectData?.assignedSupervisors || []).map(
                        (supervisor) => (
                          <option
                            key={supervisor._id}
                            value={supervisor._id}
                          >
                            {supervisor.name}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="csm-full">
                    <label>Description</label>
                    <textarea
                      value={activityForm.description}
                      onChange={(e) =>
                        setActivityForm({
                          ...activityForm,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="csm-full">
                    <button disabled={saving}>
                      {saving ? "Saving..." : "Create Activity"}
                    </button>
                  </div>
                </form>
              </section>
            )}

            <section className="csm-panel">
              <PanelHeading
                title="Construction Work Progress"
                subtitle="Activity-wise completion"
              />
              <ActivityTable activities={activities} />
            </section>
          </>
        )}

        {/* DAILY REPORT */}
        {activeTab === "daily-report" && isSupervisor && (
          <section className="csm-panel">
            <PanelHeading
              title="Submit Daily Site Report"
              subtitle="Submit your work and material usage report for today"
            />

            <div className="csm-deadline">
              <strong>Daily reporting deadline: 6:00 PM IST</strong>
              <span>Reports submitted after the deadline are marked Late.</span>
            </div>

            <form className="csm-form" onSubmit={submitReport}>
              <label>Today's work summary</label>
              <textarea
                required
                rows="4"
                placeholder="Describe the work completed today..."
                value={reportForm.workSummary}
                onChange={(e) =>
                  setReportForm({
                    ...reportForm,
                    workSummary: e.target.value,
                  })
                }
              />

              <label>Workers present</label>
              <input
                type="number"
                min="0"
                step="1"
                value={reportForm.workersPresent}
                onChange={(e) =>
                  setReportForm({
                    ...reportForm,
                    workersPresent: e.target.value,
                  })
                }
              />

              <h3>Work completed today</h3>

              {activities.length === 0 && (
                <p>No work activities have been created for this project.</p>
              )}

              {activities.map((activity) => (
                <div className="csm-entry-row" key={activity._id}>
                  <div>
                    <strong>{activity.name}</strong>
                    <small>
                      Total planned: {activity.plannedQuantity} {activity.unit}
                      {" · "}Completed so far: {activity.completedQuantity}
                    </small>
                  </div>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder={`Today's ${activity.unit}`}
                    onChange={(e) =>
                      updateActivityEntry(activity._id, e.target.value)
                    }
                  />
                </div>
              ))}

              <h3>Materials consumed today</h3>

              {materials.map((material) => (
                <div className="csm-entry-row" key={material._id}>
                  <div>
                    <strong>{material.name}</strong>
                    <small>
                      Available: {material.currentStock} {material.unit}
                    </small>
                  </div>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    max={material.currentStock}
                    placeholder={`Used (${material.unit})`}
                    onChange={(e) =>
                      updateMaterialEntry(material._id, e.target.value)
                    }
                  />
                </div>
              ))}

              <label>Additional remarks</label>
              <textarea
                rows="3"
                value={reportForm.remarks}
                onChange={(e) =>
                  setReportForm({
                    ...reportForm,
                    remarks: e.target.value,
                  })
                }
              />

              <button disabled={saving}>
                {saving ? "Submitting..." : "Submit Daily Report"}
              </button>
            </form>
          </section>
        )}

        {/* REPORT HISTORY */}
        {activeTab === "reports" && (
          <section className="csm-panel">
            <PanelHeading
              title="Daily Report History"
              subtitle="Previously submitted site reports"
            />

            {reports.length === 0 ? (
              <EmptyState text="No daily reports submitted yet." />
            ) : (
              <div className="csm-report-list">
                {reports.map((report) => (
                  <article className="csm-report-card" key={report._id}>
                    <div className="csm-report-top">
                      <div>
                        <span className="csm-report-date">
                          {report.reportDate}
                        </span>
                        <h3>{report.supervisorId?.name || "Supervisor"}</h3>
                      </div>

                      <span
                        className={`csm-report-status ${
                          report.submissionStatus === "Late" ? "late" : "ontime"
                        }`}
                      >
                        {report.submissionStatus}
                      </span>
                    </div>

                    <p>{report.workSummary}</p>

                    <div className="csm-report-meta">
                      <span>Workers: {report.workersPresent}</span>
                      <span>
                        Submitted:{" "}
                        {new Date(report.submittedAt).toLocaleString("en-IN")}
                      </span>
                    </div>

                    {report.activities?.length > 0 && (
                      <>
                        <h4>Work activities</h4>
                        {report.activities.map((item, index) => (
                          <p key={index}>
                            {item.activityId?.name || "Activity"}:{" "}
                            {item.completedQuantity} completed ·{" "}
                            {item.progress}% overall progress
                          </p>
                        ))}
                      </>
                    )}

                    {report.materials?.length > 0 && (
                      <>
                        <h4>Materials used</h4>
                        {report.materials.map((item, index) => (
                          <p key={index}>
                            {item.materialId?.name || "Material"}:{" "}
                            {item.quantityUsed}{" "}
                            {item.materialId?.unit || ""}
                          </p>
                        ))}
                      </>
                    )}

                    {report.remarks && <p>Remarks: {report.remarks}</p>}
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* MATERIAL TRANSACTIONS */}
        {activeTab === "transactions" && (
          <section className="csm-panel">
            <PanelHeading
              title="Material Transaction History"
              subtitle="Material received and consumed records"
            />

            {transactions.length === 0 ? (
              <EmptyState text="No material transactions found." />
            ) : (
              <div className="csm-table-wrap">
                <table className="csm-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Material</th>
                      <th>Type</th>
                      <th>Quantity</th>
                      <th>Recorded by</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction._id}>
                        <td>
                          {new Date(transaction.createdAt).toLocaleDateString(
                            "en-IN"
                          )}
                        </td>
                        <td>{transaction.materialId?.name || "—"}</td>
                        <td>
                          <span
                            className={`csm-transaction-type ${transaction.type}`}
                          >
                            {transaction.type}
                          </span>
                        </td>
                        <td>{transaction.quantity}</td>
                        <td>{transaction.performedBy?.name || "—"}</td>
                        <td>
                          {transaction.notes || transaction.reference || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* SUPERVISOR ASSIGNMENT */}
        {activeTab === "assignment" && isManager && (
          <>
            {/* CREATE A NEW SUPERVISOR ACCOUNT AND ASSIGN IT */}
            <section className="csm-panel">
              <PanelHeading
                title="Create Site Supervisor"
                subtitle="Create a login account and automatically assign the supervisor to this project"
              />

              <form
                className="csm-form csm-form-grid"
                onSubmit={createAndAssignSupervisor}
              >
                <div>
                  <label htmlFor="csm-supervisor-name">Supervisor name</label>
                  <input
                    id="csm-supervisor-name"
                    type="text"
                    required
                    maxLength="100"
                    placeholder="Enter full name"
                    autoComplete="name"
                    value={supervisorForm.name}
                    onChange={(event) =>
                      setSupervisorForm({
                        ...supervisorForm,
                        name: event.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label htmlFor="csm-supervisor-email">Email address</label>
                  <input
                    id="csm-supervisor-email"
                    type="email"
                    required
                    placeholder="Enter email address"
                    autoComplete="email"
                    value={supervisorForm.email}
                    onChange={(event) =>
                      setSupervisorForm({
                        ...supervisorForm,
                        email: event.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label htmlFor="csm-supervisor-password">Login password</label>
                  <input
                    id="csm-supervisor-password"
                    type="password"
                    required
                    minLength="8"
                    placeholder="Minimum 8 characters"
                    autoComplete="new-password"
                    value={supervisorForm.password}
                    onChange={(event) =>
                      setSupervisorForm({
                        ...supervisorForm,
                        password: event.target.value,
                      })
                    }
                  />
                </div>

                <div className="csm-full">
                  <p className="csm-form-note">
                    The supervisor can use this email and password to log in
                    with the Site Supervisor role.
                  </p>

                  <button type="submit" disabled={saving}>
                    {saving
                      ? "Creating and assigning..."
                      : "Create & Assign Supervisor"}
                  </button>
                </div>
              </form>
            </section>

            {/* ASSIGN AN EXISTING SUPERVISOR */}
            <section className="csm-panel">
              <PanelHeading
                title="Assign Existing Supervisor"
                subtitle="Assign an account that has already been created"
              />

              <form
                className="csm-form csm-assignment-form"
                onSubmit={assignSupervisor}
              >
                <select
                  required
                  value={assignmentForm.supervisorId}
                  onChange={(event) =>
                    setAssignmentForm({
                      supervisorId: event.target.value,
                    })
                  }
                >
                  <option value="">Select supervisor</option>

                  {supervisors.map((supervisor) => {
                    const supervisorId = supervisor._id || supervisor.id;

                    return (
                      <option key={supervisorId} value={supervisorId}>
                        {supervisor.name} ({supervisor.email})
                      </option>
                    );
                  })}
                </select>

                <button type="submit" disabled={saving}>
                  {saving ? "Assigning..." : "Assign Supervisor"}
                </button>
              </form>
            </section>

            {/* CURRENTLY ASSIGNED SUPERVISORS */}
            <section className="csm-panel">
              <PanelHeading
                title="Assigned Supervisors"
                subtitle="Supervisors currently assigned to this construction project"
              />

              {(selectedProjectData?.assignedSupervisors || []).length === 0 ? (
                <EmptyState text="No supervisors assigned to this project." />
              ) : (
                <div className="csm-supervisor-list">
                  {selectedProjectData.assignedSupervisors.map((supervisor) => {
                    const supervisorId = supervisor._id || supervisor.id;

                    return (
                      <div className="csm-supervisor" key={supervisorId}>
                        <div>
                          <strong>{supervisor.name}</strong>
                          <small>{supervisor.email}</small>
                        </div>

                        <button
                          type="button"
                          className="csm-remove-button"
                          disabled={saving}
                          onClick={() => removeSupervisor(supervisorId)}
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}

         <footer className="owner-screen-footer">
                  <span>
                    © {new Date().getFullYear()} BuilderBroget Construction Site Studio
                  </span>
      
                  <span>•</span>
      
                  <Link to="/">
                    Back to website ↗
                  </Link>
                </footer>
      </main>
    </div>
  );
};

// STAT CARD
const StatCard = ({ label, value, note }) => (
  <article className="csm-stat-card">
    <span>{label}</span>
    <strong>{value}</strong>
    <small>{note}</small>
  </article>
);

// PANEL HEADING
const PanelHeading = ({ title, subtitle }) => (
  <div className="csm-panel-heading">
    <div>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  </div>
);

// EMPTY STATE
const EmptyState = ({ text }) => (
  <div className="csm-empty-state">{text}</div>
);

// MATERIAL TABLE
const MaterialTable = ({ materials = [] }) => {
  if (!materials.length) {
    return <EmptyState text="No materials found." />;
  }

  return (
    <div className="csm-table-wrap">
      <table className="csm-table">
        <thead>
          <tr>
            <th>Material</th>
            <th>Opening Stock</th>
            <th>Remaining Stock</th>
            <th>Low Stock Level</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {materials.map((material) => {
            const low =
              material.currentStock <= material.lowStockLevel;

            return (
              <tr key={material._id}>
                <td>{material.name}</td>
                <td>
                  {material.openingStock} {material.unit}
                </td>
                <td>
                  <strong>
                    {material.currentStock} {material.unit}
                  </strong>
                </td>
                <td>
                  {material.lowStockLevel} {material.unit}
                </td>
                <td>
                  <span className={`csm-stock-status ${low ? "low" : "good"}`}>
                    {low ? "Low Stock" : "Available"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// ACTIVITY TABLE
const ActivityTable = ({ activities = [] }) => {
  if (!activities.length) {
    return <EmptyState text="No work activities created yet." />;
  }

  return (
    <div className="csm-table-wrap">
      <table className="csm-table">
        <thead>
          <tr>
            <th>Activity</th>
            <th>Planned</th>
            <th>Completed</th>
            <th>Progress</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {activities.map((activity) => (
            <tr key={activity._id}>
              <td>
                <strong>{activity.name}</strong>
                {activity.description && (
                  <small className="csm-table-subtitle">
                    {activity.description}
                  </small>
                )}
              </td>
              <td>
                {activity.plannedQuantity} {activity.unit}
              </td>
              <td>
                {activity.completedQuantity} {activity.unit}
              </td>
              <td>
                <div className="csm-progress">
                  <div>
                    <span style={{ width: `${activity.progress}%` }} />
                  </div>
                  <strong>{activity.progress}%</strong>
                </div>
              </td>
              <td>
                <span className="csm-stock-status good">
                  {activity.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ConstructionSiteDashboard;