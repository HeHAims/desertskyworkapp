import {
  BellRing,
  Camera,
  ClipboardCheck,
  ClipboardList,
  FileSignature,
  LayoutDashboard,
  ListChecks,
  MessageSquareText,
  PackageCheck,
  PenLine,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { activity, forms, jobs, modules, pings } from './demoData.js';

const moduleIcons = {
  field: Smartphone,
  dox: FileSignature,
  ping: MessageSquareText,
  log: ListChecks
};

const statusClass = {
  'Needs decision': 'status warning',
  'In production': 'status good',
  Blocked: 'status danger'
};

export default function App() {
  const [activeModule, setActiveModule] = useState('field');
  const active = useMemo(() => modules.find((module) => module.id === activeModule), [activeModule]);
  const ActiveIcon = moduleIcons[active.id];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark">DS</div>
          <div>
            <p className="eyebrow">WorkFlowOS Demo</p>
            <h1>Desert Sky WorkApp</h1>
          </div>
        </div>

        <nav className="nav-stack" aria-label="Demo modules">
          <button className="nav-item active" type="button">
            <LayoutDashboard size={18} />
            Command Center
          </button>
          {modules.map((module) => {
            const Icon = moduleIcons[module.id];
            return (
              <button
                key={module.id}
                className={`nav-item ${activeModule === module.id ? 'active-soft' : ''}`}
                type="button"
                onClick={() => setActiveModule(module.id)}
              >
                <Icon size={18} />
                {module.name}
              </button>
            );
          })}
        </nav>

        <div className="license-card">
          <ShieldCheck size={19} />
          <div>
            <strong>Licensed workspace</strong>
            <span>Customer data stays theirs. Platform stays reusable.</span>
          </div>
        </div>
      </aside>

      <main className="main-stage">
        <header className="topbar">
          <div>
            <p className="eyebrow">Demo for furniture, upholstery, repair, and restoration teams</p>
            <h2>Four tools connected to one company workflow</h2>
          </div>
          <div className="topbar-actions">
            <button type="button" className="ghost-button">
              <UserCheck size={17} />
              Owner
            </button>
            <button type="button" className="solid-button">
              <Send size={17} />
              Send Test Ping
            </button>
          </div>
        </header>

        <section className="module-hero">
          <div className="module-copy">
            <div className="module-icon">
              <ActiveIcon size={25} />
            </div>
            <p className="eyebrow">Active demo module</p>
            <h3>{active.name}</h3>
            <p>{active.description}</p>
            <div className="feature-chips">
              {active.features.map((feature) => (
                <span key={feature}>{feature}</span>
              ))}
            </div>
          </div>

          <div className="phone-preview" aria-label="Employee mobile preview">
            <div className="phone-top">
              <span>9:41</span>
              <span>Field View</span>
            </div>
            <div className="phone-card urgent">
              <strong>DSV-1044</strong>
              <span>Custom banquette build</span>
              <small>Blocked: Webbing missing</small>
            </div>
            <div className="phone-actions">
              <button type="button"><Camera size={16} /> Photo</button>
              <button type="button"><PenLine size={16} /> Issue</button>
              <button type="button"><FileSignature size={16} /> Sign</button>
            </div>
            <div className="phone-card">
              <strong>Next action</strong>
              <span>Notify owner and request approval</span>
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="panel jobs-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Jobs and milestones</p>
                <h3>Live work board</h3>
              </div>
              <ClipboardList size={20} />
            </div>

            <div className="job-list">
              {jobs.map((job) => (
                <article key={job.id} className="job-row">
                  <div>
                    <div className="job-title-line">
                      <strong>{job.id}</strong>
                      <span className={statusClass[job.status]}>{job.status}</span>
                    </div>
                    <h4>{job.customer}</h4>
                    <p>{job.type} | {job.crew}</p>
                  </div>
                  <div className="job-meta">
                    <span>{job.milestone}</span>
                    <small>{job.inventory}</small>
                    <b>{job.due}</b>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Dox</p>
                <h3>Digital forms</h3>
              </div>
              <FileSignature size={20} />
            </div>
            <div className="stack-list">
              {forms.map((form) => (
                <div key={form.name} className="mini-row">
                  <FileSignature size={18} />
                  <div>
                    <strong>{form.name}</strong>
                    <span>{form.owner}</span>
                  </div>
                  <em>{form.state}</em>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Ping</p>
                <h3>Customer and owner alerts</h3>
              </div>
              <BellRing size={20} />
            </div>
            <div className="stack-list">
              {pings.map((ping) => (
                <div key={ping.event} className="mini-row">
                  <MessageSquareText size={18} />
                  <div>
                    <strong>{ping.event}</strong>
                    <span>{ping.target} | {ping.channel}</span>
                  </div>
                  <em>{ping.state}</em>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Log</p>
                <h3>Activity feed</h3>
              </div>
              <ListChecks size={20} />
            </div>
            <div className="activity-feed">
              {activity.map((item) => (
                <div key={item} className="activity-item">
                  <span />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel inventory-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Inventory</p>
                <h3>Have, need, missing</h3>
              </div>
              <PackageCheck size={20} />
            </div>
            <div className="inventory-stats">
              <div><strong>18 yd</strong><span>Charcoal vinyl</span></div>
              <div><strong>1 roll</strong><span>Webbing left</span></div>
              <div><strong>6 spools</strong><span>Black thread</span></div>
            </div>
          </div>

          <div className="panel spanish-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Employee mode</p>
                <h3>Spanish-friendly actions</h3>
              </div>
              <Sparkles size={20} />
            </div>
            <div className="spanish-actions">
              <button type="button"><ClipboardCheck size={17} /> Terminado</button>
              <button type="button"><PackageCheck size={17} /> Falta material</button>
              <button type="button"><BellRing size={17} /> Avisar gerente</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
