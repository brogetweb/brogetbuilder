
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import "./WebsiteAnalytics.css";

function WebsiteAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${API_URL}/website-analytics/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setData(response.data);

      } catch (error) {
        console.error(
          "Analytics loading error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <p>Loading analytics...</p>;

  if (!data) {
    return <p>Unable to load analytics.</p>;
  }

  const {
    overview,
    sourceStats,
    locationStats,
    deviceStats,
    recentVisits,
    dailyStats,
  } = data;

  return (
    <div className="website-analytics">

      <div className="analytics-heading">
        <div>
          <h1>Website Analytics</h1>
          <p>
            Understand your BuilderBroget website visitors.
          </p>
        </div>
      </div>

      <div className="analytics-cards">

        <div className="analytics-card">
          <span>Total Visitors</span>
          <h2>{overview.totalVisitors}</h2>
        </div>

        <div className="analytics-card">
          <span>Total Page Views</span>
          <h2>{overview.totalPageViews}</h2>
        </div>

        <div className="analytics-card">
          <span>New Visitors</span>
          <h2>{overview.newVisitors}</h2>
        </div>

        <div className="analytics-card">
          <span>Returning Visitors</span>
          <h2>{overview.returningVisitors}</h2>
        </div>

      </div>

      <section className="analytics-section">
        <h2>Traffic Sources</h2>

        <div className="analytics-list">

          {sourceStats.map((item) => (
            <div
              className="analytics-list-item"
              key={item._id}
            >
              <span>{item._id}</span>
              <strong>{item.count}</strong>
            </div>
          ))}

        </div>
      </section>

      <section className="analytics-section">
        <h2>Visitor Locations</h2>

        <div className="analytics-list">

          {locationStats.map((item, index) => (
            <div
              className="analytics-list-item"
              key={index}
            >
              <span>
                {item._id.city},{" "}
                {item._id.country}
              </span>

              <strong>{item.visitors} visitors</strong>
            </div>
          ))}

        </div>
      </section>

      <section className="analytics-section">
        <h2>Devices</h2>

        <div className="analytics-list">

          {deviceStats.map((item) => (
            <div
              className="analytics-list-item"
              key={item._id}
            >
              <span>{item._id}</span>
              <strong>{item.count}</strong>
            </div>
          ))}

        </div>
      </section>

      <section className="analytics-section">
        <h2>Daily Website Visits</h2>

        <div className="analytics-list">

          {dailyStats.map((item) => (
            <div
              className="analytics-list-item"
              key={item.date}
            >
              <span>{item.date}</span>

              <strong>
                {item.visits} page views
              </strong>
            </div>
          ))}

        </div>
      </section>

      <section className="analytics-section">
        <h2>Recent Visitors</h2>

        <div className="analytics-table-wrapper">

          <table className="analytics-table">

            <thead>
              <tr>
                <th>Location</th>
                <th>Page</th>
                <th>Source</th>
                <th>Device</th>
                <th>Visitor Type</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>

              {recentVisits.map((visit) => (
                <tr key={visit._id}>

                  <td>
                    {visit.city || "Unknown"},
                    {" "}
                    {visit.country || "Unknown"}
                  </td>

                  <td>{visit.page}</td>

                  <td>{visit.source}</td>

                  <td>{visit.device}</td>

                  <td>
                    <span
                      className={
                        visit.isReturning
                          ? "returning-badge"
                          : "new-badge"
                      }
                    >
                      {visit.isReturning
                        ? "Returning"
                        : "New"}
                    </span>
                  </td>

                  <td>
                    {new Date(
                      visit.visitedAt
                    ).toLocaleString("en-IN")}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      </section>

    </div>
  );
}

export default WebsiteAnalytics;
