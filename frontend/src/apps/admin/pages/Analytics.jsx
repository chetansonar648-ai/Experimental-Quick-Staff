import { useState, useEffect } from 'react'
import './Analytics.css'

const Analytics = () => {
  const [chartData, setChartData] = useState([])
  const [topServices, setTopServices] = useState([])
  const [metrics, setMetrics] = useState(null)
  const [deviceStats, setDeviceStats] = useState([])
  const [trafficStats, setTrafficStats] = useState([])
  const [loading, setLoading] = useState(true)

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000'

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true)
        const [resSummary, resMonthly, resServices, resDevices, resTraffic] = await Promise.all([
          fetch(`${apiBase}/admin/summary`),
          fetch(`${apiBase}/admin/analytics/monthly`),
          fetch(`${apiBase}/admin/analytics/top-services`),
          fetch(`${apiBase}/admin/analytics/devices`),
          fetch(`${apiBase}/admin/analytics/traffic`)
        ])

        if (resSummary.ok) setMetrics(await resSummary.json())
        if (resMonthly.ok) {
          const monthly = await resMonthly.json()
          // Fill in missing months if needed, or just use what we have
          setChartData(monthly.length > 0 ? monthly : [{ month: 'No Data', value: 0 }])
        }
        if (resServices.ok) setTopServices(await resServices.json())
        if (resDevices.ok) setDeviceStats(await resDevices.json())
        if (resTraffic.ok) setTrafficStats(await resTraffic.json())

      } catch (err) {
        console.error("Error fetching analytics:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchAllData()
  }, [])

  const maxValue = chartData.length > 0
    ? Math.max(...chartData.map(d => Number(d.value) || 0)) || 10
    : 100

  if (loading) return <div className="analytics-page p-8 text-center">Loading Analytics...</div>

  return (
    <div className="analytics-page">
      <div className="page-header">
        <h2>Analytics & Reports</h2>
        <p>Track performance and user engagement metrics</p>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card chart-card">
          <h3>Monthly Bookings Trend</h3>
          <div className="chart-container">
            <div className="chart-bars">
              {chartData.map((data, index) => (
                <div key={index} className="chart-bar-wrapper">
                  <div
                    className="chart-bar"
                    style={{ height: `${(Number(data.value) / maxValue) * 100}%` }}
                    title={`${data.value} Bookings`}
                  >
                    <span className="chart-value">{data.value}</span>
                  </div>
                  <span className="chart-label">{data.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="analytics-card">
          <h3>Key Metrics</h3>
          <div className="metrics-list">
            <div className="metric-item">
              <div className="metric-info">
                <span className="metric-label">Total Users</span>
                <span className="metric-value">{metrics?.total_users || 0}</span>
              </div>
              <span className="metric-change positive">Workers: {metrics?.total_workers || 0}</span>
            </div>
            <div className="metric-item">
              <div className="metric-info">
                <span className="metric-label">Total Bookings</span>
                <span className="metric-value">{metrics?.total_bookings || 0}</span>
              </div>
              <span className="metric-change positive">Clients: {metrics?.total_clients || 0}</span>
            </div>
            <div className="metric-item">
              <div className="metric-info">
                <span className="metric-label">Active Workers</span>
                <span className="metric-value">{metrics?.total_workers || 0}</span>
              </div>
              <span className="metric-change positive">Ready to work</span>
            </div>
            <div className="metric-item">
              <div className="metric-info">
                <span className="metric-label">System Status</span>
                <span className="metric-value" style={{ color: 'green' }}>Operational</span>
              </div>
              <span className="metric-change positive">100% Uptime</span>
            </div>
          </div>
        </div>
      </div>

      <div className="analytics-card">
        <h3>Top Performing Services</h3>
        <div className="top-pages-list">
          {topServices.length === 0 ? (
            <p className="p-4 text-gray-500">No services booked yet.</p>
          ) : (
            topServices.map((service, index) => (
              <div key={index} className="page-item">
                <div className="page-rank">#{index + 1}</div>
                <div className="page-info">
                  <span className="page-path">{service.name}</span>
                  <span className="page-views">{service.count} Bookings</span>
                </div>
                <span className="page-change positive">Popular</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Traffic Sources (Estimated)</h3>
          <div className="traffic-sources">
            {trafficStats.length > 0 ? trafficStats.map((src, idx) => (
              <div key={idx} className="source-item">
                <div className="source-bar">
                  <div className="source-fill" style={{ width: `${src.percentage}%` }}></div>
                </div>
                <div className="source-info">
                  <span>{src.source}</span>
                  <span>{src.percentage}%</span>
                </div>
              </div>
            )) : <p className="text-gray-500 p-4">Loading traffic data...</p>}
          </div>
        </div>

        <div className="analytics-card">
          <h3>Device Breakdown</h3>
          <div className="device-stats">
            {deviceStats.map((d, i) => (
              <div key={i} className="device-item">
                <span className="device-icon">{d.device === 'Desktop' ? '💻' : d.device === 'Mobile' ? '📱' : '📲'}</span>
                <div className="device-details">
                  <span>{d.device}</span>
                  <span className="device-percent">{d.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics

