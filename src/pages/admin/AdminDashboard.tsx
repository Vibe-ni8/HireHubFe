export default function AdminDashboard() {
  return (
    <>
      <h1>Dashboard</h1>

      <div className="dashboard-cards">
        <div className="card">
          <h3>Total Users</h3>
          <p>124</p>
        </div>

        <div className="card">
          <h3>Active Users</h3>
          <p>98</p>
        </div>

        <div className="card">
          <h3>Inactive Users</h3>
          <p>26</p>
        </div>

        <div className="card">
          <h3>Roles</h3>
          <p>4</p>
        </div>
      </div>
    </>
  )
}
