import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AppContext";
import { api } from "../services/api";
import { validateEmail, validatePassword } from "../utils/format";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  }

  function validate() {
    const next = {
      email: validateEmail(form.email),
      password: validatePassword(form.password),
    };
    setErrors(next);
    return Object.values(next).every((v) => !v);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      const user = await api.login(form);
      login(user);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container page-section auth-page">
      <div className="auth-card tag-card">
        <p className="eyebrow">Welcome back</p>
        <h1>Log in to Loomé</h1>

        <form onSubmit={handleSubmit} noValidate>
          <div className={`form-field ${errors.email ? "has-error" : ""}`}>
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className={`form-field ${errors.password ? "has-error" : ""}`}>
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          {serverError && <p className="field-error" style={{ marginBottom: 12 }}>{serverError}</p>}

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="auth-card__switch">
          New to Loomé? <Link to="/register">Create an account</Link>
        </p>
        <p className="text-muted auth-card__hint">
          Demo: register once, then log back in with the same details — accounts live in your browser only.
        </p>
      </div>
    </div>
  );
}
