import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>
          Welcome to <span>HireHub</span>
        </h1>

        <p>
          A centralized hiring platform to manage drives, candidates,
          interviewers, feedback, and role-based workflows — all in one place.
        </p>

        <div className="home-actions">
          <Link to="/login" className="home-btn">
            Login
          </Link>

          <a href="#features" className="home-btn">
            Learn More
          </a>
        </div>
      </div>
    </div>
  )
}
