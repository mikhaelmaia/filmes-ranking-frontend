import { useCallback, useEffect, useState } from 'react';
import LoginScreen from './screens/LoginScreen.jsx';
import RankingScreen from './screens/RankingScreen.jsx';
import MovieFormScreen from './screens/MovieFormScreen.jsx';
import MovieDetailScreen from './screens/MovieDetailScreen.jsx';
import ConfirmModal from './components/ConfirmModal.jsx';
import { PROFILES, compareMovies } from './data.js';
import * as api from './api.js';

export default function App() {
  const [userId, setUserId] = useState(() => api.getAuth()?.perfil?.id ?? null);
  const [viewing, setViewing] = useState(() => api.getAuth()?.perfil?.id ?? null);
  const [movies, setMovies] = useState([]);
  const [screen, setScreen] = useState({ name: 'ranking' }); // ranking | form | detail
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Sessão expirada em qualquer rota protegida → volta ao login.
  useEffect(() => {
    api.setOnUnauthorized(() => {
      setUserId(null);
      setViewing(null);
      setMovies([]);
      setScreen({ name: 'ranking' });
    });
    return () => api.setOnUnauthorized(null);
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [mik, vit] = await Promise.all([api.listMovies('mik'), api.listMovies('vit')]);
      setMovies([...mik, ...vit]);
    } catch (err) {
      if (err?.status !== 401) setLoadError(err?.message || 'Não foi possível conectar. Tente de novo.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (userId) loadAll(); }, [userId, loadAll]);

  if (!userId) {
    return <LoginScreen onLogin={(id) => { setUserId(id); setViewing(id); setScreen({ name: 'ranking' }); }} />;
  }

  const me = PROFILES.find((p) => p.id === userId);
  const other = PROFILES.find((p) => p.id !== userId);
  const byId = (id) => movies.find((m) => m.id === id);
  const goRanking = () => setScreen({ name: 'ranking' });

  const logout = () => {
    api.logout();
    setUserId(null);
    setViewing(null);
    setMovies([]);
    setScreen({ name: 'ranking' });
  };

  /** Lança em caso de erro — o formulário mostra a mensagem e mantém o que foi preenchido. */
  const save = async (id, data) => {
    const saved = id ? await api.updateMovie(id, data) : await api.createMovie(data);
    setMovies((list) => (list.some((m) => m.id === saved.id)
      ? list.map((m) => (m.id === saved.id ? saved : m))
      : [...list, saved]));
    setViewing(userId);
    goRanking();
  };

  const confirmDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await api.deleteMovie(toDelete);
      setMovies((list) => list.filter((m) => m.id !== toDelete));
      setToDelete(null);
      goRanking();
    } catch (err) {
      if (err?.status !== 401) setDeleteError(err?.message || 'Não foi possível excluir. Tente de novo.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <main className="wrap"><div className="muted">Carregando…</div></main>;
  }

  if (loadError) {
    return (
      <main className="wrap">
        <div className="err-msg" role="alert">{loadError}</div>
        <div style={{ marginTop: 16 }}>
          <button className="btn btn-secondary" onClick={loadAll}>Tentar de novo</button>
          <button className="btn btn-ghost" onClick={logout} style={{ marginLeft: 8 }}>Sair</button>
        </div>
      </main>
    );
  }

  let content;
  if (screen.name === 'form') {
    content = <MovieFormScreen movie={screen.id ? byId(screen.id) : null} onSave={save} onCancel={goRanking} />;
  } else if (screen.name === 'detail' && byId(screen.id)) {
    const movie = byId(screen.id);
    const ranked = movies.filter((m) => m.owner === movie.owner).sort(compareMovies);
    content = (
      <MovieDetailScreen movie={movie} position={ranked.findIndex((m) => m.id === movie.id) + 1}
        ownerName={PROFILES.find((p) => p.id === movie.owner).name} readOnly={movie.owner !== userId}
        onBack={goRanking} onEdit={() => setScreen({ name: 'form', id: movie.id })} onDelete={() => setToDelete(movie.id)} />
    );
  } else {
    content = (
      <RankingScreen me={me} other={other} viewing={viewing} setViewing={setViewing} movies={movies}
        onNew={() => setScreen({ name: 'form' })} onOpen={(id) => setScreen({ name: 'detail', id })}
        onEdit={(id) => setScreen({ name: 'form', id })} onDelete={setToDelete}
        onLogout={logout} />
    );
  }

  return (
    <>
      {content}
      {toDelete && (
        <ConfirmModal movieName={byId(toDelete)?.name} busy={deleting} error={deleteError}
          onCancel={() => { if (!deleting) { setToDelete(null); setDeleteError(null); } }}
          onConfirm={confirmDelete} />
      )}
    </>
  );
}
