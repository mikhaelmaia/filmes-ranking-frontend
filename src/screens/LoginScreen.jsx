import { useState } from 'react';
import ProfileCard from '../components/ProfileCard.jsx';
import Button from '../components/Button.jsx';
import { PROFILES } from '../data.js';
import * as api from '../api.js';

export default function LoginScreen({ onLogin }) {
  const [profileId, setProfileId] = useState(PROFILES[0].id);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      const auth = await api.login(profileId, password);
      onLogin(auth.perfil?.id || profileId);
    } catch (err) {
      setError(err?.status === 401 ? 'Senha incorreta. Tente de novo.' : 'Não foi possível conectar. Tente de novo.');
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <form onSubmit={submit} style={{ width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <div className="brand" style={{ justifyContent: 'center', fontSize: 44 }}><i />Ranking de Filmes</div>
          <div className="muted">Quem vai entrar?</div>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          {PROFILES.map((p) => (
            <ProfileCard key={p.id} name={p.name} selected={p.id === profileId}
              onSelect={() => { setProfileId(p.id); clearError(); }} />
          ))}
        </div>
        <div className="field">
          <label htmlFor="senha">Senha</label>
          <input id="senha" type="password" className={`input ${error ? 'err' : ''}`} value={password}
            onChange={(e) => { setPassword(e.target.value); clearError(); }} autoComplete="current-password" />
          {error && <div className="err-msg" role="alert">{error}</div>}
        </div>
        <Button type="submit" style={{ width: '100%' }} disabled={loading}>{loading ? 'Entrando…' : 'Entrar'}</Button>
      </form>
    </div>
  );
}
