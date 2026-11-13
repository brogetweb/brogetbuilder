
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  LineChart,
  Legend
} from "recharts";

import { API_URL } from "../../config";
import "./OwnerDashboard.css";

const CHART_COLORS = [
  "#23324C",
  "#B9975B",
  "#E6C594",
  "#344A6B",
  "#526987",
  "#A9874F",
  "#172337",
];

const ITEMS_PER_PAGE = 5;

const downloadCSV = (filename, rows) => {
  if (!rows || rows.length === 0) {
    alert("No data available to download.");
    return;
  }

  const escapeCSV = (value) => {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
  };

  const csvContent = rows
    .map((row) => row.map(escapeCSV).join(","))
    .join("\r\n");

  const blob = new Blob(
    ["\uFEFF" + csvContent],
    { type: "text/csv;charset=utf-8;" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

const getReportId = (value) => {
  if (!value) return "";

  if (typeof value === "object") {
    return String(value._id || value.id || "");
  }

  return String(value);
};

const getReportDate = (value) => {
  if (!value) return "";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("en-IN");
};

function StatSparkline({ data, strokeColor }) {
  const points = useMemo(() => {
    const list =
      data && data.length > 1
        ? data
        : [10, 15, 12, 22, 18, 28, 20, 30];

    const min = Math.min(...list);
    const max = Math.max(...list);
    const range = max - min || 1;

    const width = 80;
    const height = 24;

    return list
      .map((val, i) => {
        const x = (i / (list.length - 1)) * width;
        const y =
          height - ((val - min) / range) * (height - 6) - 3;

        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }, [data]);

  return (
    <div className="stat-sparkline-wrap">
      <svg viewBox="0 0 80 24">
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    </div>
  );
}


function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}) {
  if (totalItems === 0) return null;

  const startRecord =
    (currentPage - 1) * ITEMS_PER_PAGE + 1;

  const endRecord = Math.min(
    currentPage * ITEMS_PER_PAGE,
    totalItems
  );

  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, currentPage + 1);

  if (currentPage === 1) {
    endPage = Math.min(totalPages, 3);
  }

  if (currentPage === totalPages) {
    startPage = Math.max(1, totalPages - 2);
  }

  const pageNumbers = [];

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="table-card-footer">
      <span className="records-count-text">
        Showing {startRecord}-{endRecord} of {totalItems} records
      </span>

      <div className="table-pagination-nav">
        <button
          type="button"
          className="p-btn"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          ← Previous
        </button>

        {pageNumbers.map((page) => (
          <button
            type="button"
            key={page}
            className={`p-num ${
              currentPage === page ? "active" : ""
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          className="p-btn"
          disabled={
            currentPage === totalPages || totalPages === 0
          }
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

function OwnerDashboard() {

  const navigate = useNavigate();

  // Not logged in (or session expired) → send to login and come back here after.
  const redirectToLogin = () => {
    navigate("/login", {
      replace: true,
      state: { from: "/owner-dashboard" },
    });
  };

  const [owner, setOwner] = useState(null);
  const [statistics, setStatistics] = useState({});
  const [properties, setProperties] = useState([]);
  const [projects, setProjects] = useState([]);
  const [recentVisitors, setRecentVisitors] = useState([]);
  const [registeredUsersData, setRegisteredUsersData] = useState([]);
  const [recentPropertyVisits, setRecentPropertyVisits] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visitorsLoading, setVisitorsLoading] = useState(false);
  const [error, setError] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("properties");
  const [tableSearch, setTableSearch] = useState("");
  const [propertyPage, setPropertyPage] = useState(1);
  const [projectPage, setProjectPage] = useState(1);
  const [visitorPage, setVisitorPage] = useState(1);
  const [registeredUserPage, setRegisteredUserPage] = useState(1);
  const [customerPage, setCustomerPage] = useState(1);
  const [performanceRange, setPerformanceRange] = useState("30days");

  const getAuthHeaders = (token) => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchPropertyVisitors = async (token) => {
    if (!token) return;

    try {
      setVisitorsLoading(true);

      const response = await axios.get(
        `${API_URL}/public/owners/dashboard/visitors`,
        getAuthHeaders(token)
      );

      const data = response.data || {};

      const visits = Array.isArray(data.recentPropertyVisits)
        ? data.recentPropertyVisits
        : Array.isArray(data.visits)
          ? data.visits
          : [];

      setRecentPropertyVisits(visits);

      setStatistics((previous) => ({
        ...previous,

        totalVisitors:
          data.totalVisitors ??
          data.totalRecentVisits ??
          previous.totalVisitors ??
          visits.length,
      }));
    } catch (err) {
      console.error(
        "Error fetching property/project visitors:",
        err.response?.data?.message || err.message
      );
    } finally {
      setVisitorsLoading(false);
    }
  };

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        redirectToLogin();
        return;
      }

      const response = await axios.get(
        `${API_URL}/owner/dashboard`,
        getAuthHeaders(token)
      );

      const data = response.data || {};

      setOwner(data.owner || null);

      setStatistics(data.statistics || {});

      setProperties(
        Array.isArray(data.properties) ? data.properties : []
      );

      setProjects(
        Array.isArray(data.projects) ? data.projects : []
      );

      setRecentVisitors(
        Array.isArray(data.recentVisitors)
          ? data.recentVisitors
          : []
      );

      // Use the dedicated registeredUsers array if available.
      // Otherwise, fall back to recentVisitors.

      setRegisteredUsersData(
        Array.isArray(data.registeredUsers)
          ? data.registeredUsers
          : Array.isArray(data.recentVisitors)
            ? data.recentVisitors
            : []
      );

      setRecentCustomers(
        Array.isArray(data.recentCustomers)
          ? data.recentCustomers
          : []
      );

      await fetchPropertyVisitors(token);
    } catch (err) {
      console.error(
        "Error fetching owner dashboard:",
        err.response?.data || err.message
      );

      const status = err.response?.status;
      const approvalStatus = err.response?.data?.approvalStatus;

      // Token invalid/expired → clear it and log in again.
      if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        redirectToLogin();
        return;
      }

      // Owner not approved yet (or rejected) → show application status.
      if (
        status === 403 &&
        (approvalStatus === "pending" || approvalStatus === "rejected")
      ) {
        navigate("/owner-application-status", { replace: true });
        return;
      }

      setError(
        err.response?.data?.message ||
          "Unable to load your dashboard. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    setPropertyPage(1);
    setProjectPage(1);
    setVisitorPage(1);
    setRegisteredUserPage(1);
    setCustomerPage(1);
  }, [tableSearch, activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMobileSidebarOpen(false);
  };

  const formatPrice = (price) => {
    if (
      price == null ||
      price === "" ||
      !Number.isFinite(Number(price))
    ) {
      return "Price on request";
    }

    const num = Number(price);

    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(1)} Cr`;
    }

    return `₹${num.toLocaleString("en-IN")}`;
  };

  const getArea = (item) => {
    const areaFields = [
      "areaSqFt",
      "squareFeet",
      "sqft",
      "area",
      "builtUpArea",
      "carpetArea",
      "superBuiltUpArea",
    ];

    for (const field of areaFields) {
      const value = item[field];

      if (
        value != null &&
        value !== "" &&
        Number.isFinite(Number(value)) &&
        Number(value) > 0
      ) {
        return Number(value);
      }
    }

    return null;
  };

  const formatArea = (item) => {
    const area = getArea(item);

    return area != null
      ? `${area.toLocaleString("en-IN")} sq.ft`
      : "—";
  };

  const getImage = (item, fallbackText = "Property") => {
    if (Array.isArray(item.images) && item.images.length) {
      const firstImage = item.images[0];

      if (typeof firstImage === "string") return firstImage;

      if (firstImage?.url) return firstImage.url;
    }

    if (typeof item.image === "string" && item.image) {
      return item.image;
    }

    return `https://placehold.co/100x75?text=${fallbackText}`;
  };

  const getVisitedListing = (visit) =>
    visit.project || visit.property || null;

  const getVisitedListingName = (visit) => {
    const listing = getVisitedListing(visit);

    if (!listing) {
      return visit.entityType === "project"
        ? "Project unavailable"
        : "Property unavailable";
    }

    return listing.name || listing.title || "Untitled listing";
  };

  const getVisitedListingType = (visit) => {
    if (visit.project || visit.entityType === "project") {
      return "Project";
    }

    return "Property";
  };

  const getVisitedListingLocation = (visit) => {
    const listing = getVisitedListing(visit);

    if (!listing) return "Not specified";

    return (
      [listing.location, listing.city].filter(Boolean).join(", ") ||
      "Not specified"
    );
  };

  const getVisitDate = (visit) => {
    const date = visit.visitedAt || visit.createdAt;

    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString("en-IN");
  };

  const getRegisteredDate = (user) => {
    const date = user.createdAt || user.registeredAt;

    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString("en-IN");
  };

  const registeredUsers = useMemo(
    () =>
      registeredUsersData.filter(
        (user) =>
          user.role !== "owner" &&
          user.role !== "superadmin"
      ),
    [registeredUsersData]
  );

const insightVisitorTotal = Number(
  statistics?.totalVisitors ?? recentPropertyVisits.length ?? 0
);

const insightEnquiryTotal = Number(
  statistics?.totalEnquiries ?? recentCustomers.length ?? 0
);

const enquiryConversionRate =
  insightVisitorTotal > 0
    ? Math.min(
        100,
        (insightEnquiryTotal / insightVisitorTotal) * 100
      )
    : 0;

const getInsightId = (value) => {
  if (!value) return "";
  if (typeof value === "object") {
    return String(value._id || value.id || "");
  }
  return String(value);
};

const topPerformingProperties = (properties || [])
  .map((property) => {
    const propertyId = getInsightId(property._id);

    const matchingVisits = (recentPropertyVisits || []).filter(
      (visit) => {
        const visitedPropertyId = getInsightId(
          visit.property || visit.propertyId
        );

        return visitedPropertyId === propertyId;
      }
    );

    const matchingEnquiries = (recentCustomers || []).filter(
      (customer) => {
        const enquiryPropertyId = getInsightId(
          customer.property || customer.propertyId
        );

        return enquiryPropertyId === propertyId;
      }
    );

    const views = Number(
      property.totalViews ??
      property.viewCount ??
      property.views ??
      property.totalVisits ??
      matchingVisits.length
    );

    const enquiries = matchingEnquiries.length;

    return {
      ...property,
      insightViews: views,
      insightEnquiries: enquiries,
    };
  })
  .sort((a, b) => {
    if (b.insightEnquiries !== a.insightEnquiries) {
      return b.insightEnquiries - a.insightEnquiries;
    }

    return b.insightViews - a.insightViews;
  })
  .slice(0, 5);

const recentBusinessActivities = [
  ...(recentPropertyVisits || []).map((visit) => ({
    id: `visit-${getInsightId(visit._id) || Math.random()}`,
    type: "visit",
    title:
      visit.property?.title ||
      visit.property?.name ||
      visit.project?.title ||
      visit.listingTitle ||
      "Property viewed",
    description: "Someone viewed a property",
    date: visit.lastVisited || visit.visitedAt || visit.createdAt,
  })),

  ...(recentCustomers || []).map((customer) => ({
    id: `enquiry-${getInsightId(customer._id) || Math.random()}`,
    type: "enquiry",
    title:
      customer.name ||
      customer.fullName ||
      customer.email ||
      "New customer enquiry",
    description:
      customer.property?.title ||
      customer.property?.name ||
      "Enquiry received",
    date: customer.createdAt,
  })),

  ...(registeredUsers || []).map((user) => ({
    id: `registration-${getInsightId(user._id) || Math.random()}`,
    type: "registration",
    title:
      user.name ||
      user.fullName ||
      user.email ||
      "New user",
    description: "New user registered",
    date: user.createdAt || user.registeredAt,
  })),
]
  .filter((activity) => {
    return activity.date && !Number.isNaN(
      new Date(activity.date).getTime()
    );
  })
  .sort(
    (a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  .slice(0, 8);

const monthlyPerformance = useMemo(() => {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  let startDate = new Date(today);
  let groupByMonth = false;

  // LAST 7 DAYS
  if (performanceRange === "7days") {
    startDate.setDate(today.getDate() - 6);
  }

  // LAST 30 DAYS
  else if (performanceRange === "30days") {
    startDate.setDate(today.getDate() - 29);
  }

  // LAST 6 MONTHS
  else if (performanceRange === "6months") {
    startDate = new Date(
      today.getFullYear(),
      today.getMonth() - 5,
      1
    );

    groupByMonth = true;
  }

  // THIS YEAR
  else if (performanceRange === "thisYear") {
    startDate = new Date(today.getFullYear(), 0, 1);

    groupByMonth = true;
  }

  const endDate = new Date(today);
  endDate.setHours(23, 59, 59, 999);

  // CREATE CHART BUCKETS
  const buckets = [];

  const current = new Date(startDate);

  if (groupByMonth) {
    current.setDate(1);

    while (current <= today) {
      const year = current.getFullYear();
      const month = current.getMonth();

      buckets.push({
        key: `${year}-${String(month + 1).padStart(2, "0")}`,

        name: current.toLocaleDateString("en-IN", {
          month: "short",
          year: "2-digit",
        }),

        visitors: 0,
        enquiries: 0,
        registrations: 0,
      });

      current.setMonth(current.getMonth() + 1);
    }
  } else {
    while (current <= today) {
      const year = current.getFullYear();

      const month = String(
        current.getMonth() + 1
      ).padStart(2, "0");

      const day = String(
        current.getDate()
      ).padStart(2, "0");

      buckets.push({
        key: `${year}-${month}-${day}`,

        name: current.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        }),

        visitors: 0,
        enquiries: 0,
        registrations: 0,
      });

      current.setDate(current.getDate() + 1);
    }
  }

  const bucketMap = new Map(
    buckets.map((bucket) => [bucket.key, bucket])
  );

  // DATE VALIDATION
  const getValidDate = (value) => {
    if (!value) return null;

    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
  };

  // GET DAILY OR MONTHLY BUCKET KEY
  const getBucketKey = (date) => {
    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    if (groupByMonth) {
      return `${year}-${month}`;
    }

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // ==========================================
  // 1. VISITORS
  // ==========================================

  recentVisitors.forEach((visitor) => {
    const date = getValidDate(
      visitor.lastVisited || visitor.createdAt
    );

    if (!date || date < startDate || date > endDate) {
      return;
    }

    const bucket = bucketMap.get(getBucketKey(date));

    if (bucket) {
      bucket.visitors += 1;
    }
  });

  // ==========================================
  // 2. ENQUIRIES
  // ==========================================

  recentCustomers.forEach((customer) => {
    const date = getValidDate(customer.createdAt);

    if (!date || date < startDate || date > endDate) {
      return;
    }

    const bucket = bucketMap.get(getBucketKey(date));

    if (bucket) {
      bucket.enquiries += 1;
    }
  });

  // ==========================================
  // 3. REGISTRATIONS
  // ==========================================

  registeredUsers.forEach((user) => {
    const date = getValidDate(user.createdAt);

    if (!date || date < startDate || date > endDate) {
      return;
    }

    const bucket = bucketMap.get(getBucketKey(date));

    if (bucket) {
      bucket.registrations += 1;
    }
  });

  return buckets;
}, [
  performanceRange,
  recentVisitors,
  recentCustomers,
  registeredUsers,
]);

const performanceTotals = useMemo(() => {
  return monthlyPerformance.reduce(
    (totals, item) => ({
      visitors: totals.visitors + item.visitors,

      enquiries: totals.enquiries + item.enquiries,

      registrations:
        totals.registrations + item.registrations,
    }),
    {
      visitors: 0,
      enquiries: 0,
      registrations: 0,
    }
  );
}, [monthlyPerformance]);

  const listingDistribution = useMemo(() => {
    const counts = properties.reduce((result, property) => {
      const type = property.listingType || "Other";

      result[type] = (result[type] || 0) + 1;

      return result;
    }, {});

    const data = Object.entries(counts).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

    return data.length
      ? data
      : [
          { name: "Residential", value: 1 },
          { name: "Commercial", value: 1 },
        ];
  }, [properties]);

  const projectStatusDistribution = useMemo(() => {
    const counts = projects.reduce((result, project) => {
      const status = project.status || "Unspecified";

      result[status] = (result[status] || 0) + 1;

      return result;
    }, {});

    const data = Object.entries(counts).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

    return data.length
      ? data
      : [
          { name: "Under Construction", value: 1 },
          { name: "Completed", value: 1 },
        ];
  }, [projects]);

  const overviewData = useMemo(
    () => [
      {
        name: "Properties",
        total: Number(
          statistics.totalProperties ?? properties.length
        ),
      },
      {
        name: "Projects",
        total: Number(
          statistics.totalProjects ?? projects.length
        ),
      },
      {
        name: "Users",
        total: Number(
          statistics.registeredUsers ?? registeredUsers.length
        ),
      },
      {
        name: "Enquiries",
        total: Number(
          statistics.totalCustomers ?? recentCustomers.length
        ),
      },
      {
        name: "Favourites",
        total: Number(statistics.totalFavourites ?? 0),
      },
      {
        name: "Visits",
        total: Number(
          statistics.totalVisitors ?? recentPropertyVisits.length
        ),
      },
    ],
    [
      statistics,
      properties.length,
      projects.length,
      registeredUsers.length,
      recentCustomers.length,
      recentPropertyVisits.length,
    ]
  );

  const filteredProperties = useMemo(() => {
    const query = tableSearch.trim().toLowerCase();

    if (!query) return properties;

    return properties.filter((property) =>
      [
        property.title,
        property.city,
        property.location,
        property.listingType,
        property.propertyType,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        )
    );
  }, [properties, tableSearch]);

  const filteredProjects = useMemo(() => {
    const query = tableSearch.trim().toLowerCase();

    if (!query) return projects;

    return projects.filter((project) =>
      [
        project.name,
        project.title,
        project.city,
        project.location,
        project.status,
        project.propertyType,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        )
    );
  }, [projects, tableSearch]);

  const filteredVisits = useMemo(() => {
    const query = tableSearch.trim().toLowerCase();

    if (!query) return recentPropertyVisits;

    return recentPropertyVisits.filter((visit) => {
      const visitorName =
        visit.visitor?.name || "Guest Visitor";

      const visitorEmail = visit.visitor?.email || "";

      const listingName = getVisitedListingName(visit);

      const location = getVisitedListingLocation(visit);

      return [
        visitorName,
        visitorEmail,
        listingName,
        location,
      ].some((value) =>
        String(value).toLowerCase().includes(query)
      );
    });
  }, [recentPropertyVisits, tableSearch]);

  const filteredRegisteredUsers = useMemo(() => {
    const query = tableSearch.trim().toLowerCase();

    if (!query) return registeredUsers;

    return registeredUsers.filter((user) =>
      [
        user.name,
        user.email,
        user.role,
        user.phone,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        )
    );
  }, [registeredUsers, tableSearch]);

  const propertyTotalPages = Math.max(
    1,
    Math.ceil(filteredProperties.length / ITEMS_PER_PAGE)
  );

  const paginatedProperties = useMemo(() => {
    const start = (propertyPage - 1) * ITEMS_PER_PAGE;

    return filteredProperties.slice(
      start,
      start + ITEMS_PER_PAGE
    );
  }, [filteredProperties, propertyPage]);

  const projectTotalPages = Math.max(
    1,
    Math.ceil(filteredProjects.length / ITEMS_PER_PAGE)
  );

  const paginatedProjects = useMemo(() => {
    const start = (projectPage - 1) * ITEMS_PER_PAGE;

    return filteredProjects.slice(
      start,
      start + ITEMS_PER_PAGE
    );
  }, [filteredProjects, projectPage]);

  const visitorTotalPages = Math.max(
    1,
    Math.ceil(filteredVisits.length / ITEMS_PER_PAGE)
  );

  const paginatedVisits = useMemo(() => {
    const start = (visitorPage - 1) * ITEMS_PER_PAGE;

    return filteredVisits.slice(
      start,
      start + ITEMS_PER_PAGE
    );
  }, [filteredVisits, visitorPage]);

  const registeredUserTotalPages = Math.max(
    1,
    Math.ceil(
      filteredRegisteredUsers.length / ITEMS_PER_PAGE
    )
  );

  const paginatedRegisteredUsers = useMemo(() => {
    const start =
      (registeredUserPage - 1) * ITEMS_PER_PAGE;

    return filteredRegisteredUsers.slice(
      start,
      start + ITEMS_PER_PAGE
    );
  }, [filteredRegisteredUsers, registeredUserPage]);

  const customerTotalPages = Math.max(
    1,
    Math.ceil(recentCustomers.length / ITEMS_PER_PAGE)
  );

  const paginatedCustomers = useMemo(() => {
    const start = (customerPage - 1) * ITEMS_PER_PAGE;

    return recentCustomers.slice(
      start,
      start + ITEMS_PER_PAGE
    );
  }, [recentCustomers, customerPage]);

  const totalPropsVal =
    statistics.totalProperties ?? properties.length;

  const totalProjectsVal =
    statistics.totalProjects ?? projects.length;

  const registeredUsersVal =
    statistics.registeredUsers ?? registeredUsers.length;

  const customerEnquiriesVal =
    statistics.totalCustomers ?? recentCustomers.length;

  const totalVisitorsVal =
    statistics.totalVisitors ?? recentPropertyVisits.length;

  const statMetrics = [
    {
      label: "Total Properties",
      value: totalPropsVal,
      badge: totalPropsVal,
      badgeColor: "#EF4444",
      sparkData: [10, 14, 12, 18, 16, 22, 18, 25],
    },
    {
      label: "Total Projects",
      value: totalProjectsVal,
      badge: totalProjectsVal,
      badgeColor: "#F59E0B",
      sparkData: [5, 8, 6, 12, 10, 16, 11, 14],
    },
    {
      label: "Registered Users",
      value: registeredUsersVal,
      badge: registeredUsersVal,
      badgeColor: "#8B5CF6",
      sparkData: [16, 22, 20, 30, 26, 34, 28, 38],
    },
    {
      label: "Customer Enquiries",
      value: customerEnquiriesVal,
      badge: customerEnquiriesVal,
      badgeColor: "#14B8A6",
      sparkData: [12, 18, 15, 24, 20, 28, 24, 30],
    },
    {
      label: "Total Visitors",
      value: totalVisitorsVal,
      badge: totalVisitorsVal,
      badgeColor: "#EC4899",
      sparkData: [28, 42, 36, 54, 46, 62, 55, 70],
    },
  ];


const downloadMonthlyReport = () => {
  const rows = [
    [
      "Period",
      "Visitors",
      "Enquiries",
      "Registrations",
    ],
  ];

  (monthlyPerformance || []).forEach((item) => {
    rows.push([
      item.name,
      item.visitors,
      item.enquiries,
      item.registrations,
    ]);
  });

  downloadCSV(
    "BuilderBroget_Monthly_Performance.csv",
    rows
  );
};


const downloadPropertyReport = () => {
  const rows = [
    [
      "Property Name",
      "Location",
      "Property Type",
      "Listing Type",
      "Price",
      "Views",
      "Enquiries",
    ],
  ];

  (properties || []).forEach((property) => {
    const propertyId = getReportId(property._id);

    const matchingVisits = (recentPropertyVisits || []).filter(
      (visit) => {
        const visitedId = getReportId(
          visit.property || visit.propertyId
        );

        return visitedId === propertyId;
      }
    );

    const matchingEnquiries = (recentCustomers || []).filter(
      (customer) => {
        const enquiryId = getReportId(
          customer.property || customer.propertyId
        );

        return enquiryId === propertyId;
      }
    );

    const views = Number(
      property.totalViews ??
      property.viewCount ??
      property.views ??
      property.totalVisits ??
      matchingVisits.length
    );

    rows.push([
      property.title || property.propertyTitle || "",
      property.location || property.city || "",
      property.propertyType || "",
      property.listingType || "",
      property.price ?? "",
      views,
      matchingEnquiries.length,
    ]);
  });

  downloadCSV(
    "BuilderBroget_Property_Performance.csv",
    rows
  );
};


const downloadEnquiryReport = () => {
  const rows = [
    [
      "Customer Name",
      "Phone",
      "Email",
      "Property",
      "Enquiry Date",
    ],
  ];

  (recentCustomers || []).forEach((customer) => {
    rows.push([
      customer.name || customer.fullName || "",
      customer.phone || customer.mobile || "",
      customer.email || "",
      customer.property?.title ||
        customer.property?.name ||
        customer.propertyTitle ||
        customer.listingTitle ||
        "",
      getReportDate(customer.createdAt),
    ]);
  });

  downloadCSV(
    "BuilderBroget_Customer_Enquiries.csv",
    rows
  );
};

const downloadVisitorReport = () => {
  const rows = [
    [
      "Property",
      "Property Type",
      "Location",
      "Visit Date",
    ],
  ];

  (recentPropertyVisits || []).forEach((visit) => {
    rows.push([
      getVisitedListingName(visit) || "Property viewed",
      getVisitedListingType(visit) || "",
      getVisitedListingLocation(visit) || "",
      getReportDate(
        visit.lastVisited ||
        visit.visitedAt ||
        visit.createdAt
      ),
    ]);
  });

  downloadCSV(
    "BuilderBroget_Visitor_Activity.csv",
    rows
  );
};


const downloadBusinessSummary = () => {
  const rows = [
    ["BUILDERBROGET BUSINESS PERFORMANCE REPORT", ""],
    ["Report Generated", new Date().toLocaleString("en-IN")],
    ["Selected Performance Range", performanceRange],
    ["", ""],
    ["BUSINESS OVERVIEW", "VALUE"],

    [
      "Total Visitors",
      statistics?.totalVisitors ?? recentPropertyVisits.length,
    ],

    [
      "Total Enquiries",
      statistics?.totalEnquiries ?? recentCustomers.length,
    ],

    [
      "Registered Users",
      registeredUsers.length,
    ],

    [
      "Total Properties",
      properties.length,
    ],

    [
      "Total Projects",
      projects.length,
    ],

    ["", ""],
    ["MONTHLY PERFORMANCE", ""],
    [
      "Period",
      "Visitors",
      "Enquiries",
      "Registrations",
    ],
  ];

  (monthlyPerformance || []).forEach((item) => {
    rows.push([
      item.name,
      item.visitors,
      item.enquiries,
      item.registrations,
    ]);
  });

  downloadCSV(
    "BuilderBroget_Complete_Business_Report.csv",
    rows
  );
};

const printBusinessReport = () => {
  window.print();
};


  if (loading) {
    return (
      <div className="owner-dash-loader">
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="owner-dash-loader">
        <p>{error}</p>

        <button
          type="button"
          onClick={fetchDashboard}
          style={{ marginTop: 10 }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div
      className={`owner-studio-container ${
        sidebarCollapsed ? "sidebar-collapsed" : ""
      } ${mobileSidebarOpen ? "mobile-sidebar-open" : ""}`}
    >

      {mobileSidebarOpen && (
        <button
          type="button"
          className="sidebar-mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside className="owner-nav-sidebar">

        <div className="sidebar-brand-block">
          <div className="brand-icon-box">B</div>

          {!sidebarCollapsed && (
            <div className="brand-text-box">
              <strong>BuilderBroget</strong>
              <span>OWNER STUDIO</span>
            </div>
          )}
        </div>

        <button
          type="button"
          className="sidebar-toggle-btn"
          onClick={() =>
            setSidebarCollapsed((previous) => !previous)
          }
          title={
            sidebarCollapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
        >
          {sidebarCollapsed ? "→" : "←"}
        </button>

        <nav className="sidebar-menu-list">

          <button
            type="button"
            className="nav-item-btn"
            title="Overview"
            onClick={() => {
              handleTabChange("properties");

              document
                .getElementById("analytics")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span className="nav-icon">▦</span>
            {!sidebarCollapsed && <span>Overview</span>}
          </button>

          <a
            href="#analytics"
            className="nav-item-btn"
            title="Analytics"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <span className="nav-icon">◔</span>
            {!sidebarCollapsed && <span>Analytics</span>}
          </a>

          <button
            type="button"
            className={`nav-item-btn ${
              activeTab === "visitors" ? "active" : ""
            }`}
            title="Property & Project Visitors"
            onClick={() => handleTabChange("visitors")}
          >
            <span className="nav-icon">◉</span>

            {!sidebarCollapsed && (
              <span>Property & Project Visitors</span>
            )}
          </button>

          <button
            type="button"
            className={`nav-item-btn ${
              activeTab === "registeredUsers" ? "active" : ""
            }`}
            title="Registered Users"
            onClick={() =>
              handleTabChange("registeredUsers")
            }
          >
            <span className="nav-icon">♙</span>

            {!sidebarCollapsed && (
              <span>Registered Users</span>
            )}
          </button>

          <button
            type="button"
            className={`nav-item-btn ${
              activeTab === "properties" ? "active" : ""
            }`}
            title="My Properties"
            onClick={() => handleTabChange("properties")}
          >
            <span className="nav-icon">⌂</span>

            {!sidebarCollapsed && (
              <span>My Properties</span>
            )}
          </button>

          <button
            type="button"
            className={`nav-item-btn ${
              activeTab === "projects" ? "active" : ""
            }`}
            title="My Projects"
            onClick={() => handleTabChange("projects")}
          >
            <span className="nav-icon">▤</span>

            {!sidebarCollapsed && (
              <span>My Projects</span>
            )}
          </button>

          <a
            href="#leads-section"
            className="nav-item-btn"
            title="Customer Enquiries"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <span className="nav-icon">✉</span>

            {!sidebarCollapsed && (
              <span>Customer Enquiries</span>
            )}
          </a>
        </nav>

        {!sidebarCollapsed && (
          <div className="sidebar-quick-actions">
            <span className="quick-actions-label">
              Quick Actions
            </span>

            <Link
              to="/post-property"
              className="quick-action-outline-btn"
            >
              + Post Property
            </Link>

            <Link
              to="/post-new-project"
              className="quick-action-outline-btn"
            >
              + Post New Project
            </Link>
          </div>
        )}

        <div className="sidebar-user-footer">
          <div className="user-avatar-badge">
            {(owner?.name || "O")
              .charAt(0)
              .toUpperCase()}
          </div>

          {!sidebarCollapsed && (
            <div className="user-details-text">
              <strong>
                {owner?.name || "Property Owner"}
              </strong>

              <span>Owner account</span>
            </div>
          )}

          {!sidebarCollapsed && (
            <span className="sidebar-dropdown-arrow">
              ⌵
            </span>
          )}
        </div>
      </aside>

      {/* ======================================
          MAIN VIEW
      ====================================== */}

      <main className="owner-main-stage">

        {/* TOPBAR */}

        <header className="owner-main-topbar">

          <button
            type="button"
            className="mobile-sidebar-toggle"
            onClick={() =>
              setMobileSidebarOpen((previous) => !previous)
            }
            aria-label="Toggle navigation"
          >
            ☰
          </button>

          <div className="topbar-breadcrumbs">
            <span>Workspace</span>
            <span className="crumb-sep">/</span>
            <strong>Dashboard</strong>
          </div>

          <div className="topbar-user-cluster">
            <div className="live-status-pill">
              <span className="live-pulse-dot" />
              <span>Live</span>
            </div>

            <div className="topbar-avatar">
              {(owner?.name || "O")
                .charAt(0)
                .toUpperCase()}
            </div>
          </div>
        </header>

        <div className="owner-dashboard-body">

          {/* ==================================
              WELCOME BANNER
          ================================== */}

          <section className="owner-welcome-card">

            <div className="welcome-text-side">
              <h1>
                Welcome back,{" "}
                {owner?.name || "Property Owner"}!
              </h1>

              <p>
                <strong>OWNER CONTROL CENTER</strong> •
                Here's an overview of your listings and
                customer activity.
              </p>
            </div>

            <div className="welcome-right-cluster">

              <div className="welcome-actions">
                <Link
                  to="/post-property"
                  className="btn-gold-solid"
                >
                  + Add Property
                </Link>

                <Link
                  to="/post-new-project"
                  className="btn-gold-outline"
                >
                  + Add Project
                </Link>
              </div>

              <div
                className="architect-illustration"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 100 80"
                  className="architect-svg"
                >
                  <path
                    d="M10 80 L10 35 L28 20 L45 35 L45 80 Z"
                    fill="none"
                    stroke="#D3B88C"
                    strokeWidth="1.2"
                  />

                  <path
                    d="M45 80 L45 15 L62 5 L78 15 L78 80 Z"
                    fill="none"
                    stroke="#D3B88C"
                    strokeWidth="1.2"
                  />

                  <path
                    d="M78 80 L78 30 L95 42 L95 80 Z"
                    fill="none"
                    stroke="#D3B88C"
                    strokeWidth="1.2"
                  />

                  <line
                    x1="16"
                    y1="40"
                    x2="16"
                    y2="75"
                    stroke="#D3B88C"
                    strokeWidth="0.8"
                  />

                  <line
                    x1="22"
                    y1="40"
                    x2="22"
                    y2="75"
                    stroke="#D3B88C"
                    strokeWidth="0.8"
                  />

                  <line
                    x1="53"
                    y1="22"
                    x2="53"
                    y2="75"
                    stroke="#D3B88C"
                    strokeWidth="0.8"
                  />

                  <line
                    x1="60"
                    y1="22"
                    x2="60"
                    y2="75"
                    stroke="#D3B88C"
                    strokeWidth="0.8"
                  />

                  <line
                    x1="67"
                    y1="22"
                    x2="67"
                    y2="75"
                    stroke="#D3B88C"
                    strokeWidth="0.8"
                  />

                  <line
                    x1="84"
                    y1="42"
                    x2="84"
                    y2="75"
                    stroke="#D3B88C"
                    strokeWidth="0.8"
                  />
                </svg>
              </div>
            </div>
          </section>

          {/* ==================================
              STAT CARDS
          ================================== */}

          <section className="owner-stats-strip">

            {statMetrics.map((stat) => (
              <div
                className="stat-pill-box"
                key={stat.label}
              >
                <div className="stat-pill-header">
                  <span className="stat-pill-title">
                    {stat.label}
                  </span>

                  <span
                    className="stat-pill-badge"
                    style={{
                      backgroundColor: stat.badgeColor,
                    }}
                  >
                    {stat.badge}
                  </span>
                </div>

                <div className="stat-pill-lower">
                  <span className="stat-pill-number">
                    {stat.value}
                  </span>

                  <StatSparkline
                    data={stat.sparkData}
                    strokeColor={stat.badgeColor}
                  />
                </div>
              </div>
            ))}
          </section>

          {/* ==================================
              PERFORMANCE OVERVIEW
          ================================== */}

          <section
            className="owner-charts-section"
            id="analytics"
          >
            <h2 className="section-title">
              Performance Overview
            </h2>

            <div className="owner-charts-grid">

              {/* LISTING DISTRIBUTION */}

              <div className="card-chart-frame">
                <div className="card-chart-header">
                  <h3>Listing Distribution</h3>
                  <span className="tag-recharts">
                    Recharts
                  </span>
                </div>

                <div className="donut-chart-flex">
                  <div className="donut-center-circle">
                    <ResponsiveContainer
                      width={135}
                      height={135}
                    >
                      <PieChart>
                        <Pie
                          data={listingDistribution}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={42}
                          outerRadius={62}
                          stroke="none"
                        >
                          {listingDistribution.map(
                            (entry, idx) => (
                              <Cell
                                key={`cell-list-${entry.name}`}
                                fill={
                                  CHART_COLORS[
                                    idx % CHART_COLORS.length
                                  ]
                                }
                              />
                            )
                          )}
                        </Pie>

                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="chart-legend-col">
                    {listingDistribution.map(
                      (item, idx) => (
                        <div
                          className="legend-row"
                          key={item.name}
                        >
                          <span
                            className="legend-square"
                            style={{
                              backgroundColor:
                                CHART_COLORS[
                                  idx % CHART_COLORS.length
                                ],
                            }}
                          />

                          <span>{item.name}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* PROJECT STATUS */}

              <div className="card-chart-frame">
                <div className="card-chart-header">
                  <h3>Project Status</h3>
                  <span className="tag-recharts">
                    Recharts
                  </span>
                </div>

                <div className="donut-chart-flex">
                  <div className="donut-center-circle">
                    <ResponsiveContainer
                      width={135}
                      height={135}
                    >
                      <PieChart>
                        <Pie
                          data={projectStatusDistribution}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={42}
                          outerRadius={62}
                          stroke="none"
                        >
                          {projectStatusDistribution.map(
                            (entry, idx) => (
                              <Cell
                                key={`cell-proj-${entry.name}`}
                                fill={
                                  idx === 0
                                    ? "#14B8A6"
                                    : idx === 1
                                      ? "#B9975B"
                                      : "#23324C"
                                }
                              />
                            )
                          )}
                        </Pie>

                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="chart-legend-col">
                    {projectStatusDistribution.map(
                      (item, idx) => (
                        <div
                          className="legend-row"
                          key={item.name}
                        >
                          <span
                            className="legend-square"
                            style={{
                              backgroundColor:
                                idx === 0
                                  ? "#14B8A6"
                                  : idx === 1
                                    ? "#B9975B"
                                    : "#23324C",
                            }}
                          />

                          <span>{item.name}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* PORTFOLIO OVERVIEW */}

              <div className="card-chart-frame">
                <div className="card-chart-header">
                  <h3>Portfolio Overview</h3>
                  <span className="tag-recharts">
                    Recharts
                  </span>
                </div>

                <div className="barchart-container">
                  <ResponsiveContainer
                    width="100%"
                    height={150}
                  >
                    <BarChart
                      data={overviewData}
                      margin={{
                        top: 8,
                        right: 8,
                        left: -25,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid
                        stroke="#ECE5D8"
                        vertical={false}
                        strokeDasharray="3 3"
                      />

                      <XAxis
                        dataKey="name"
                        tick={{
                          fill: "#8A92A6",
                          fontSize: 9,
                        }}
                        axisLine={{
                          stroke: "#DED7C8",
                        }}
                        tickLine={false}
                      />

                      <YAxis
                        allowDecimals={false}
                        tick={{
                          fill: "#8A92A6",
                          fontSize: 9,
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1D2636",
                          border: "1px solid #B9975B",
                          borderRadius: 4,
                          color: "#F4F5F7",
                        }}
                        labelStyle={{
                          color: "#E6C594",
                          fontSize: 10,
                        }}
                      />

                      <Bar
                        dataKey="total"
                        name="Total"
                        fill="#B9975B"
                        maxBarSize={12}
                        radius={[2, 2, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* ==========================================
    MONTHLY BUSINESS PERFORMANCE
========================================== */}

<article className="owner-chart-card owner-monthly-performance-card">

  {/* HEADER */}

  <div className="owner-monthly-heading">

    <div className="owner-chart-heading">

      <div>
        <h3>Monthly Business Performance</h3>

        <p>
          Monitor your website visitors, enquiries
          and registrations.
        </p>
      </div>

      <span className="owner-chart-icon">
        ▥
      </span>

    </div>

    {/* DATE FILTER */}

    <div className="owner-performance-filter">

      <label htmlFor="performanceRange">
        Select Date Range
      </label>

      <select
        id="performanceRange"
        value={performanceRange}
        onChange={(e) =>
          setPerformanceRange(e.target.value)
        }
      >
        <option value="7days">
          Last 7 days
        </option>

        <option value="30days">
          Last 30 days
        </option>

        <option value="6months">
          Last 6 months
        </option>

        <option value="thisYear">
          This year
        </option>

      </select>

    </div>

  </div>

  {/* SUMMARY CARDS */}

  <div className="owner-performance-summary">

    {/* VISITORS */}

    <div className="owner-performance-stat">

      <div className="owner-performance-icon visitors-icon">
        <span>◉</span>
      </div>

      <div>
        <p>Total Visitors</p>

        <h3>
          {performanceTotals.visitors.toLocaleString("en-IN")}
        </h3>
      </div>

    </div>

    {/* ENQUIRIES */}

    <div className="owner-performance-stat">

      <div className="owner-performance-icon enquiries-icon">
        <span>✉</span>
      </div>

      <div>
        <p>Total Enquiries</p>

        <h3>
          {performanceTotals.enquiries.toLocaleString("en-IN")}
        </h3>
      </div>

    </div>

    {/* REGISTRATIONS */}

    <div className="owner-performance-stat">

      <div className="owner-performance-icon registrations-icon">
        <span>♙</span>
      </div>

      <div>
        <p>New Registrations</p>

        <h3>
          {performanceTotals.registrations.toLocaleString("en-IN")}
        </h3>
      </div>

    </div>

  </div>
  <div className="owner-monthly-performance-chart">

    <ResponsiveContainer width="100%" height="100%">

      <BarChart
        data={monthlyPerformance}
        margin={{
          top: 15,
          right: 10,
          left: -15,
          bottom: 5,
        }}
        barGap={4}
      >

        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(199, 208, 220, 0.15)"
          vertical={false}
        />

        <XAxis
          dataKey="name"
          stroke="#C7D0DC"
          tick={{
            fill: "#C7D0DC",
            fontSize: 11,
          }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
          minTickGap={15}
        />

        <YAxis
          allowDecimals={false}
          stroke="#C7D0DC"
          tick={{
            fill: "#C7D0DC",
            fontSize: 11,
          }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip
          contentStyle={{
            background: "#1D2636",
            border: "1px solid #E6C594",
            borderRadius: "10px",
            color: "#FDFBF7",
          }}
          labelStyle={{
            color: "#E6C594",
            fontWeight: 600,
            marginBottom: "6px",
          }}
          cursor={{
            fill: "rgba(230, 197, 148, 0.07)",
          }}
        />

        <Legend
          verticalAlign="bottom"
          height={40}
          wrapperStyle={{
            color: "#FDFBF7",
            fontSize: "12px",
          }}
        />
<Bar
  dataKey="visitors"
  name="Visitors"
  maxBarSize={24}
  fill="#C49A52"
  fillOpacity={1}
  stroke="#C49A52"
  strokeWidth={0}
  radius={[4, 4, 0, 0]}
>
  {monthlyPerformance.map((entry, index) => (
    <Cell
      key={`visitor-${index}`}
      fill="#C49A52"
      fillOpacity={1}
    />
  ))}
</Bar>
<Bar
  dataKey="enquiries"
  name="Enquiries"
  maxBarSize={24}
  fill="#648DB8"
  fillOpacity={1}
  stroke="#648DB8"
  strokeWidth={0}
  radius={[4, 4, 0, 0]}
>
  {monthlyPerformance.map((entry, index) => (
    <Cell
      key={`enquiry-${index}`}
      fill="#648DB8"
      fillOpacity={1}
    />
  ))}
</Bar>
<Bar
  dataKey="registrations"
  name="Registrations"
  maxBarSize={24}
  fill="#36A58D"
  fillOpacity={1}
  stroke="#36A58D"
  strokeWidth={0}
  radius={[4, 4, 0, 0]}
>
  {monthlyPerformance.map((entry, index) => (
    <Cell
      key={`registration-${index}`}
      fill="#36A58D"
      fillOpacity={1}
    />
  ))}
</Bar>

      </BarChart>

    </ResponsiveContainer>

  </div>

  <div className="owner-performance-footer">
    <span>
      <span className="owner-performance-footer-dot"></span>
      Performance overview
    </span>

    <span>
      {performanceRange === "7days" && "Last 7 days"}

      {performanceRange === "30days" && "Last 30 days"}

      {performanceRange === "6months" && "Last 6 months"}

      {performanceRange === "thisYear" && "Current year"}
    </span>
  </div>

</article>
            </div>
          </section>

<section className="owner-business-insights">

  <h2 className="section-title">
    Business Insights
  </h2>

  <div className="owner-insights-grid">

    <article className="insight-card enquiry-analysis-card">

      <div className="insight-card-heading">
        <div>
          <span className="insight-heading-icon">
            <i className="fas fa-chart-line"></i>
          </span>

          <div>
            <h3>Enquiry Conversion Analysis</h3>
            <p>Visitor to enquiry performance</p>
          </div>
        </div>
      </div>

      <div className="conversion-main">

        <div className="conversion-rate">
          {enquiryConversionRate.toFixed(1)}%
        </div>

        <span className="conversion-rate-label">
          Visitor-to-enquiry rate
        </span>

        <div className="conversion-progress-track">
          <div
            className="conversion-progress-fill"
            style={{
              width: `${enquiryConversionRate}%`,
            }}
          />
        </div>

        <p className="conversion-description">
          Percentage of recorded visitors who submitted an enquiry.
        </p>

      </div>

      <div className="conversion-insight-footer">
        <i className="fas fa-lightbulb"></i>

        <span>
          Use this metric to understand how effectively your
          property listings generate customer interest.
        </span>
      </div>

    </article>

    <article className="insight-card top-properties-card">

      <div className="insight-card-heading">
        <div>
          <span className="insight-heading-icon">
            <i className="fas fa-building"></i>
          </span>

          <div>
            <h3>Top Performing Properties</h3>
            <p>Ranked by enquiries and property views</p>
          </div>
        </div>
      </div>

      <div className="top-properties-list">

        {topPerformingProperties.length > 0 ? (

          topPerformingProperties.map((property, index) => (

            <div
              className="top-property-item"
              key={property._id || index}
            >

              <span className="top-property-rank">
                {index + 1}
              </span>

              <img
                src={getImage(property)}
                alt={property.title || "Property"}
                className="top-property-image"
              />

              <div className="top-property-details">

                <h4>
                  {property.title || property.propertyTitle || "Untitled Property"}
                </h4>

                <div className="top-property-metrics">

                  <span>
                    <i className="fas fa-eye"></i>
                    {property.insightViews} Views
                  </span>

                  <span>
                    <i className="fas fa-envelope"></i>
                    {property.insightEnquiries} Enquiries
                  </span>

                </div>

              </div>

              <Link
                to={`/property/${property._id}`}
                className="top-property-view"
                title="View Property"
              >
                <i className="fas fa-arrow-up-right-from-square"></i>
              </Link>

            </div>

          ))

        ) : (

          <div className="insight-empty-state">
            <i className="fas fa-building"></i>
            <p>No property performance data available yet.</p>
          </div>

        )}

      </div>

    </article>

  </div>

  <article className="insight-card activity-timeline-card">

    <div className="insight-card-heading">

      <div>
        <span className="insight-heading-icon">
          <i className="fas fa-clock"></i>
        </span>

        <div>
          <h3>Recent Activity Timeline</h3>
          <p>Latest activity across your business</p>
        </div>
      </div>

    </div>


    {recentBusinessActivities.length > 0 ? (

      <div className="activity-timeline">

        {recentBusinessActivities.map((activity) => (

          <div
            className={`activity-timeline-item activity-${activity.type}`}
            key={activity.id}
          >

            <div className="activity-timeline-icon">

              {activity.type === "visit" && (
                <i className="fas fa-eye"></i>
              )}

              {activity.type === "enquiry" && (
                <i className="fas fa-envelope"></i>
              )}

              {activity.type === "registration" && (
                <i className="fas fa-user-plus"></i>
              )}

            </div>


            <div className="activity-timeline-content">

              <div className="activity-timeline-heading">

                <div>
                  <h4>{activity.title}</h4>

                  <p>{activity.description}</p>
                </div>

                <span className={`activity-type-badge ${activity.type}`}>
                  {activity.type === "visit" && "Property Visit"}

                  {activity.type === "enquiry" && "Enquiry"}

                  {activity.type === "registration" && "Registration"}
                </span>

              </div>

              <span className="activity-timeline-date">
                {new Date(activity.date).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>

            </div>

          </div>

        ))}

      </div>

    ) : (

      <div className="insight-empty-state">
        <i className="fas fa-clock"></i>
        <p>No recent business activity available.</p>
      </div>

    )}

  </article>

</section>
          <section className="owner-tables-split-row">
            <div className="tabbed-table-card">
              <div className="tabbed-table-header">
                <div className="table-tabs">
                  <button
                    type="button"
                    className={`tab-btn ${
                      activeTab === "properties"
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handleTabChange("properties")
                    }
                  >
                    My Properties
                  </button>

                  <button
                    type="button"
                    className={`tab-btn ${
                      activeTab === "projects"
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handleTabChange("projects")
                    }
                  >
                    My Projects
                  </button>

                  <button
                    type="button"
                    className={`tab-btn ${
                      activeTab === "visitors"
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handleTabChange("visitors")
                    }
                  >
                    Property & Project Visitors
                  </button>

                  <button
                    type="button"
                    className={`tab-btn ${
                      activeTab === "registeredUsers"
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handleTabChange("registeredUsers")
                    }
                  >
                    Registered Users
                  </button>

                </div>

                <div className="table-search-box">
                  <span className="search-icon">
                    🔍
                  </span>

                  <input
                    type="search"
                    placeholder="Search..."
                    value={tableSearch}
                    onChange={(e) =>
                      setTableSearch(e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="table-horizontal-wrap">

                {activeTab === "properties" && (
                  <>
                    <table className="light-owner-table">
                      <thead>
                        <tr>
                          <th>Property</th>
                          <th>Location</th>
                          <th>Status</th>
                          <th>Price</th>
                          <th>Area</th>
                          <th></th>
                        </tr>
                      </thead>

                      <tbody>
                        {paginatedProperties.length === 0 ? (
                          <tr>
                            <td
                              colSpan={6}
                              className="empty-table-cell"
                            >
                              No properties found.
                            </td>
                          </tr>
                        ) : (
                          paginatedProperties.map((prop) => (
                            <tr key={prop._id}>
                              <td>
                                <div className="prop-meta-cell">
                                  <img
                                    src={getImage(
                                      prop,
                                      "Property"
                                    )}
                                    alt={
                                      prop.title || "Property"
                                    }
                                  />

                                  <span>
                                    {prop.title ||
                                      "Untitled Property"}
                                  </span>
                                </div>
                              </td>

                              <td>
                                {[
                                  prop.location,
                                  prop.city,
                                ]
                                  .filter(Boolean)
                                  .join(", ") || "—"}
                              </td>

                              <td>
                                <span className="status-pill-badge badge-for-sale">
                                  {prop.listingType ||
                                    "For Sale"}
                                </span>
                              </td>

                              <td className="table-bold-cell">
                                {formatPrice(prop.price)}
                              </td>

                              <td>{formatArea(prop)}</td>

                              <td>
                                <Link
                                  to={`/property/${prop._id}`}
                                  className="view-prop-btn"
                                >
                                  View Property ↗
                                </Link>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>

                    <TablePagination
                      currentPage={propertyPage}
                      totalPages={propertyTotalPages}
                      totalItems={filteredProperties.length}
                      onPageChange={setPropertyPage}
                    />
                  </>
                )}

                {activeTab === "projects" && (
                  <>
                    <table className="light-owner-table">
                      <thead>
                        <tr>
                          <th>Project</th>
                          <th>Location</th>
                          <th>Status</th>
                          <th>Price Range</th>
                          <th>Area</th>
                          <th></th>
                        </tr>
                      </thead>

                      <tbody>
                        {paginatedProjects.length === 0 ? (
                          <tr>
                            <td
                              colSpan={6}
                              className="empty-table-cell"
                            >
                              No projects found.
                            </td>
                          </tr>
                        ) : (
                          paginatedProjects.map((project) => (
                            <tr key={project._id}>
                              <td>
                                <div className="prop-meta-cell">
                                  <img
                                    src={getImage(
                                      project,
                                      "Project"
                                    )}
                                    alt={
                                      project.name || "Project"
                                    }
                                  />

                                  <span>
                                    {project.name ||
                                      project.title ||
                                      "Untitled Project"}
                                  </span>
                                </div>
                              </td>

                              <td>
                                {[
                                  project.location,
                                  project.city,
                                ]
                                  .filter(Boolean)
                                  .join(", ") || "—"}
                              </td>

                              <td>
                                <span className="status-pill-badge badge-project">
                                  {project.status || "Project"}
                                </span>
                              </td>

                              <td className="table-bold-cell">
                                {project.minPrice == null &&
                                project.maxPrice == null
                                  ? "Price on request"
                                  : formatPrice(
                                      project.minPrice ??
                                        project.maxPrice
                                    )}
                              </td>

                              <td>{formatArea(project)}</td>

                              <td>
                                <Link
                                  to={`/project/${project._id}`}
                                  className="view-prop-btn"
                                >
                                  View Project ↗
                                </Link>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>

                    <TablePagination
                      currentPage={projectPage}
                      totalPages={projectTotalPages}
                      totalItems={filteredProjects.length}
                      onPageChange={setProjectPage}
                    />
                  </>
                )}

                {activeTab === "visitors" && (
                  <>
                    <table className="light-owner-table">
                      <thead>
                        <tr>
                          <th>Visitor</th>
                          <th>Email</th>
                          <th>Listing Name</th>
                          <th>Category</th>
                          <th>Location</th>
                          <th>Visit Date</th>
                        </tr>
                      </thead>

                      <tbody>
                        {visitorsLoading ? (
                          <tr>
                            <td
                              colSpan={6}
                              className="empty-table-cell"
                            >
                              Loading visitors...
                            </td>
                          </tr>
                        ) : paginatedVisits.length === 0 ? (
                          <tr>
                            <td
                              colSpan={6}
                              className="empty-table-cell"
                            >
                              No visit activity found.
                            </td>
                          </tr>
                        ) : (
                          paginatedVisits.map(
                            (visit, idx) => (
                              <tr key={visit._id || idx}>
                                <td>
                                  <div className="lead-user-cell">
                                    <div
                                      className="user-avatar-badge table-user-avatar"
                                    >
                                      {(
                                        visit.visitor?.name ||
                                        "G"
                                      )
                                        .charAt(0)
                                        .toUpperCase()}
                                    </div>

                                    <span>
                                      {visit.visitor?.name ||
                                        "Guest Visitor"}
                                    </span>
                                  </div>
                                </td>

                                <td>
                                  {visit.visitor?.email || "—"}
                                </td>

                                <td>
                                  {getVisitedListingName(
                                    visit
                                  )}
                                </td>

                                <td>
                                  <span className="status-pill-badge badge-for-sale">
                                    {getVisitedListingType(
                                      visit
                                    )}
                                  </span>
                                </td>

                                <td>
                                  {getVisitedListingLocation(
                                    visit
                                  )}
                                </td>

                                <td>
                                  {getVisitDate(visit)}
                                </td>
                              </tr>
                            )
                          )
                        )}
                      </tbody>
                    </table>

                    <TablePagination
                      currentPage={visitorPage}
                      totalPages={visitorTotalPages}
                      totalItems={filteredVisits.length}
                      onPageChange={setVisitorPage}
                    />
                  </>
                )}

                {activeTab === "registeredUsers" && (
                  <>
                    <table className="light-owner-table">
                      <thead>
                        <tr>
                          <th>Registered User</th>
                          <th>Email Address</th>
                          <th>Phone Number</th>
                          <th>Account Type</th>
                          <th>Registered Date</th>
                        </tr>
                      </thead>

                      <tbody>
                        {paginatedRegisteredUsers.length === 0 ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="empty-table-cell"
                            >
                              No registered users found.
                            </td>
                          </tr>
                        ) : (
                          paginatedRegisteredUsers.map(
                            (user, idx) => (
                              <tr key={user._id || idx}>
                                <td>
                                  <div className="lead-user-cell">
                                    <div className="user-avatar-badge table-user-avatar">
                                      {(user.name || "U")
                                        .charAt(0)
                                        .toUpperCase()}
                                    </div>

                                    <span>
                                      {user.name ||
                                        "Unnamed User"}
                                    </span>
                                  </div>
                                </td>

                                <td>
                                  {user.email || "—"}
                                </td>

                                <td>
                                  {user.phone || "Not provided"}
                                </td>

                                <td>
                                  <span className="status-pill-badge badge-for-sale">
                                    {user.role || "User"}
                                  </span>
                                </td>

                                <td>
                                  {getRegisteredDate(user)}
                                </td>
                              </tr>
                            )
                          )
                        )}
                      </tbody>
                    </table>

                    <TablePagination
                      currentPage={registeredUserPage}
                      totalPages={registeredUserTotalPages}
                      totalItems={
                        filteredRegisteredUsers.length
                      }
                      onPageChange={setRegisteredUserPage}
                    />
                  </>
                )}

              </div>
            </div>

            <div
              className="leads-table-card"
              id="leads-section"
            >
              <div className="leads-table-header">
                <h3>
                  Recent Customer Enquiries (WhatsApp Leads)
                </h3>
              </div>

              <div className="table-horizontal-wrap">
                <table className="light-owner-table leads-grid-table">
                  <thead>
                    <tr>
                      <th>Customer Name</th>
                      <th>Phone Number</th>
                      <th>Associated Property</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedCustomers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="empty-table-cell"
                        >
                          No customer enquiries yet.
                        </td>
                      </tr>
                    ) : (
                      paginatedCustomers.map(
                        (lead, idx) => (
                          <tr key={lead._id || idx}>
                            <td>
                              <div className="lead-user-cell">
                                <div className="user-avatar-badge table-user-avatar">
                                  {(lead.name || "C")
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>

                                <span>
                                  {lead.name ||
                                    "Customer Name"}
                                </span>
                              </div>
                            </td>

                            <td>
                              {lead.phone || "Not provided"}
                            </td>

                            <td>
                              {lead.propertyTitle ||
                                lead.property?.title ||
                                "Associated Property"}
                            </td>

                            <td>
                              {lead.phone ? (
                                <a
                                  href={`https://wa.me/${String(
                                    lead.phone
                                  ).replace(/\D/g, "")}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn-whatsapp-action"
                                >
                                  WhatsApp ↗
                                </a>
                              ) : (
                                "—"
                              )}
                            </td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>
                </table>
              </div>

              <TablePagination
                currentPage={customerPage}
                totalPages={customerTotalPages}
                totalItems={recentCustomers.length}
                onPageChange={setCustomerPage}
              />
            </div>
          </section>


{/* ==========================================
    REPORTS & DOWNLOADS
========================================== */}

<section className="owner-reports-section">

  <div className="reports-section-header">

    <div>
      <h2 className="section-title">
        Reports & Downloads
      </h2>

      <p>
        Review your business performance and download reports.
      </p>
    </div>

    <button
      type="button"
      className="reports-pdf-button"
      onClick={printBusinessReport}
    >
      <i className="fas fa-file-pdf"></i>
      Print / Save as PDF
    </button>

  </div>


  {/* REPORT CONTENT - USED FOR PDF PRINTING */}

  <div className="print-report-content">

    {/* REPORT SUMMARY */}

    <div className="report-overview-grid">

      <div className="report-overview-card">
        <span className="report-overview-icon">
          <i className="fas fa-eye"></i>
        </span>

        <div>
          <span>Total Visitors</span>

          <strong>
            {Number(
              statistics?.totalVisitors ??
              recentPropertyVisits.length
            ).toLocaleString("en-IN")}
          </strong>
        </div>
      </div>


      <div className="report-overview-card">
        <span className="report-overview-icon">
          <i className="fas fa-envelope"></i>
        </span>

        <div>
          <span>Total Enquiries</span>

          <strong>
            {Number(
              statistics?.totalEnquiries ??
              recentCustomers.length
            ).toLocaleString("en-IN")}
          </strong>
        </div>
      </div>


      <div className="report-overview-card">
        <span className="report-overview-icon">
          <i className="fas fa-user-check"></i>
        </span>

        <div>
          <span>Registered Users</span>

          <strong>
            {registeredUsers.length.toLocaleString("en-IN")}
          </strong>
        </div>
      </div>


      <div className="report-overview-card">
        <span className="report-overview-icon">
          <i className="fas fa-building"></i>
        </span>

        <div>
          <span>Total Properties</span>

          <strong>
            {properties.length.toLocaleString("en-IN")}
          </strong>
        </div>
      </div>

    </div>


    {/* DOWNLOADABLE REPORTS */}

    <div className="download-reports-heading">

      <h3>Download Your Reports</h3>

      <p>
        Export your business data for record keeping and analysis.
      </p>

    </div>

    <div className="download-reports-grid">
      <article className="download-report-card">
        <div className="download-report-icon">
          <i className="fas fa-chart-pie"></i>
        </div>
        <div className="download-report-info">
          <h4>Complete Business Report</h4>
          <p>
            Overview statistics and monthly performance.
          </p>

        </div>

        <button
          type="button"
          onClick={downloadBusinessSummary}
          className="download-report-button"
        >
          <i className="fas fa-download"></i>
          Download CSV
        </button>

      </article>

      <article className="download-report-card">

        <div className="download-report-icon">
          <i className="fas fa-chart-column"></i>
        </div>

        <div className="download-report-info">

          <h4>Monthly Performance</h4>

          <p>
            Visitors, enquiries and registrations by period.
          </p>

        </div>

        <button
          type="button"
          onClick={downloadMonthlyReport}
          className="download-report-button"
        >
          <i className="fas fa-download"></i>
          Download CSV
        </button>

      </article>

      <article className="download-report-card">
        <div className="download-report-icon">
          <i className="fas fa-house"></i>
        </div>
        <div className="download-report-info">
          <h4>Property Performance</h4>
          <p>
            Property details, views and enquiry counts.
          </p>
        </div>

        <button
          type="button"
          onClick={downloadPropertyReport}
          className="download-report-button"
        >
          <i className="fas fa-download"></i>
          Download CSV
        </button>

      </article>

      <article className="download-report-card">

        <div className="download-report-icon">
          <i className="fas fa-envelope-open-text"></i>
        </div>

        <div className="download-report-info">

          <h4>Customer Enquiries</h4>

          <p>
            Customer contact details and enquiry dates.
          </p>

        </div>

        <button
          type="button"
          onClick={downloadEnquiryReport}
          className="download-report-button"
        >
          <i className="fas fa-download"></i>
          Download CSV
        </button>

      </article>

      <article className="download-report-card">

        <div className="download-report-icon">
          <i className="fas fa-users"></i>
        </div>

        <div className="download-report-info">

          <h4>Visitor Activity</h4>

          <p>
            Property visits and available visit dates.
          </p>

        </div>

        <button
          type="button"
          onClick={downloadVisitorReport}
          className="download-report-button"
        >
          <i className="fas fa-download"></i>
          Download CSV
        </button>

      </article>

    </div>

  </div>

</section>


          <footer className="owner-screen-footer">
            <span>
              © {new Date().getFullYear()} BuilderBroget Owner Studio
            </span>

            <span>•</span>

            <Link to="/">
              Back to website ↗
            </Link>
          </footer>

        </div>
      </main>
    </div>
  );
}

export default OwnerDashboard;

