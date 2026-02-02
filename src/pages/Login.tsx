import { useState } from "react"
import { getToken } from "../services/Auth.service"
import { useAuth } from "../auth/AuthContext"
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import type { BaseResponse } from "../dto/Response";
import { HandleApiErrors, HandleApiResponse } from "../helper/HelperMethods";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, getRole } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    getToken({username: email, password})
      .then((response) => {
        const result = HandleApiResponse(response);
        login(result.data!);
        switch(getRole())
        {
          case 'Admin': navigate('/admin'); break;
          default: navigate('/'); break;
        }
      })
      .catch((err: AxiosError<BaseResponse>) => {
        HandleApiErrors(err);
      });
  }

  return (
    <div className="login-page">
      {/* Left */}
      <div className="login-left">
        <div>
          <h2>HireHub</h2>
          <p>
            Secure role-based hiring system for Admins, HRs, Mentors, and Panel
            members.
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="login-right">
        <form className="login-card" onSubmit={handleLogin}>
          <h3>Sign In</h3>
          <p>Enter your credentials to continue</p>

          <div className="login-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="login-btn">Login</button>

          <div className="login-footer">
            © {new Date().getFullYear()} HireHub
          </div>
        </form>
      </div>
    </div>
  );
}
