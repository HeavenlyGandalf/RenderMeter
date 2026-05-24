import { NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="header">
      <div className="header-brand">
        <h1>RenderMeter</h1>
        <p>Compare template engine performance in real time</p>
      </div>
      <nav className="header-nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Benchmark
        </NavLink>
        <NavLink to="/playground" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Playground
        </NavLink>
      </nav>
    </header>
  );
}
