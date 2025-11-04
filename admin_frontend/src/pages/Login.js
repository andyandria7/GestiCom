import { useState } from "react";
import { Shield, Mail, Lock, EyeOff, Eye, AlertCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import styles from "./LoginStyle";
import api from "../services/api";


function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        // ✅ Vérification côté front
        if (!email.trim() || !password.trim()) {
          setError("Veuillez remplir email et mot de passe !");
          return;
        }

        setIsLoading(true);

        try {
          const { data } = await api.post("http://localhost:8080/auth/login", {
            email: email.trim(),
            password
          });
          await new Promise(resolve => setTimeout(resolve, 1500));

          if (data.status === "ok" && data.token) {
            localStorage.setItem("token", data.token);
            navigate("/dashboard");
          } else {
            setError("Identifiants incorrects");
          }
        } catch (error) {
          if (error.response) {
            setError(error.response.data.message || "Erreur inconnue");
          } else if (error.request) {
            setError("Impossible de contacter le serveur 🚨");
          } else {
            setError("Une erreur est survenue");
          }
        } finally {
          setIsLoading(false);
        }
      };

      const { data } = await api.post("http://localhost:8080/auth/login", {
        email: email.trim(),
        password
      });
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (data.status === "ok" && data.token) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        setError("Identifiants incorrects");
      }
    } catch (error) {
      if (error.response) {
        // Réponse envoyée par le backend
        setError(error.response.data.message || "Erreur inconnue");
      } else if (error.request) {
        // Requête envoyée mais pas de réponse (serveur down)
        setError("Impossible de contacter le serveur 🚨");
      } else {
        // Autre erreur
        setError("Une erreur est survenue");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css"
        rel="stylesheet"
      />

      <div className="min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden" style={styles.wrapper}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4 col-xl-5">
              <div className="card shadow-lg border-0 position-relative" style={styles.card}>
                <div className="card-body p-4">
                  <div className="text-center mb-5">
                    <div className="d-inline-flex align-items-center justify-content-center mb-4 rounded-4 shadow-sm" style={styles.shieldWrapper}>
                      <Shield size={40} className="text-white" />
                    </div>
                    <h1 className="h2 fw-bold mb-3" style={styles.title}>
                      Connexion
                    </h1>
                    <p className="text-muted fw-medium">Accès à l'administration</p>
                    <div className="mx-auto mt-3 rounded-pill" style={styles.underline}></div>
                  </div>

                  <form onSubmit={handleLogin} className="needs-validation" noValidate>
                    <div className="mb-4">
                      <label className="form-label fw-semibold text-dark">Adresse email</label>
                      <div className="input-group">
                        <span className="input-group-text border-2 bg-light" style={styles.inputLeftIcon}>
                          <Mail size={20} className="text-muted" />
                        </span>
                        <input
                          type="email"
                          className="form-control border-2 border-start-0"
                          placeholder="votre.email@exemple.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={isLoading}
                          style={styles.input}
                          onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                          onBlur={(e) => Object.assign(e.target.style, styles.inputBlur)}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold text-dark">Mot de passe</label>
                      <div className="input-group">
                        <span className="input-group-text border-2 bg-light" style={styles.inputLeftIcon}>
                          <Lock size={20} className="text-muted" />
                        </span>
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control border-2 border-start-0 border-end-0"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={isLoading}
                          style={styles.passwordInput}
                          onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                          onBlur={(e) => Object.assign(e.target.style, styles.inputBlur)}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary border-2"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                          style={styles.toggleButton}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="d-flex align-items-center">
                        <Shield size={16} className="text-success me-2" />
                        <small className="text-muted">Connexion sécurisée</small>
                      </div>
                      <a href="#" className="text-decoration-none fw-semibold" style={styles.forgotPassword}>
                        Mot de passe oublié ?
                      </a>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn w-100 fw-semibold position-relative overflow-hidden"
                      style={styles.loginButton}
                    >
                      {isLoading ? (
                        <div className="d-flex align-items-center justify-content-center">
                          <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" style={styles.spinner}></div>
                        </div>
                      ) : (
                        <span>Se connecter</span>
                      )}
                    </button>

                    {error && (
                      <div className="alert alert-danger d-flex align-items-center mt-4 mb-0" role="alert" style={styles.errorAlert}>
                        <AlertCircle size={20} className="text-danger me-2 flex-shrink-0" />
                        <div className="small fw-medium">{error}</div>
                      </div>
                    )}
                  </form>

                  <hr className="my-4" />
                  <div className="text-center">
                    <small className="text-muted">© 2025 Administration Panel. Tous droits réservés.</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/js/bootstrap.bundle.min.js"></script>
    </>
  );
}

export default Login;
