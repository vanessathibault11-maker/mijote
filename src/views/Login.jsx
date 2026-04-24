import { useState } from 'react';

export default function Login({ onLogin }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  function submit(e) {
    e.preventDefault();
    if (user.trim().toLowerCase() === 'vanessa' && pass === 'autobus123') {
      setError('');
      onLogin();
    } else {
      setError('Identifiants incorrects.');
    }
  }

  return (
    <div className="login-shell">
      <form className="login-card" onSubmit={submit}>
        <div className="login-logo">
          <span className="login-emoji">🍲</span>
          <h1>Mijote</h1>
          <p className="login-tag">Ton plan repas, mijoté juste pour toi.</p>
        </div>
        <label className="field">
          <span>Utilisateur</span>
          <input
            autoFocus
            autoComplete="username"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="vanessa"
          />
        </label>
        <label className="field">
          <span>Mot de passe</span>
          <input
            type="password"
            autoComplete="current-password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="••••••••"
          />
        </label>
        {error && <div className="login-error">{error}</div>}
        <button type="submit" className="btn btn-primary">Se connecter</button>
        <p className="login-hint">Version draft — MVP interne</p>
      </form>
    </div>
  );
}
