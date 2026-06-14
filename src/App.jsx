import {
  BellRing,
  CalendarDays,
  Camera,
  Check,
  ChevronRight,
  CirclePlus,
  ClipboardList,
  FilePlus,
  Home,
  MapPinned,
  MessageSquareText,
  PackageSearch,
  PenLine,
  Search,
  Send,
  ShieldCheck
} from 'lucide-react';
import { useMemo, useState } from 'react';

const initialJobs = [
  {
    id: 'DSV-1042',
    code: '09424 / 3020-2',
    number: '126858',
    account: 'AMW - WESLEY PARK',
    type: 'Install',
    due: '06/05/2026',
    duration: 'unknown',
    salesperson: 'Ana',
    customer: 'Hospitality booth set',
    status: 'Needs approval',
    material: 'Charcoal vinyl low',
    activity: 'Fabric approval and booth install',
    alert: 'Owner approval needed',
    period: 'today'
  },
  {
    id: 'DSV-1043',
    code: '09425 / 4021-8',
    number: '126861',
    account: 'Residential Client',
    type: 'Repair',
    due: '06/06/2026',
    duration: '2 hrs',
    salesperson: 'Maria',
    customer: 'Antique chair restoration',
    status: 'In production',
    material: 'Supplies ready',
    activity: 'Frame repair and fabric prep',
    alert: 'Technician working',
    period: 'today'
  },
  {
    id: 'DSV-1044',
    code: '09431 / 1180-4',
    number: '126874',
    account: 'Desert Sky Custom',
    type: 'Custom furniture',
    due: '06/07/2026',
    duration: '4 hrs',
    salesperson: 'Luis',
    customer: 'Custom banquette build',
    status: 'Blocked',
    material: 'Webbing missing',
    activity: 'Waiting on webbing before upholstery',
    alert: 'Inventory shortage',
    period: 'today'
  },
  {
    id: 'DSV-1038',
    code: '09398 / 2075-1',
    number: '126801',
    account: 'The Mirage Villas',
    type: 'Repair',
    due: '06/03/2026',
    duration: '3 hrs',
    salesperson: 'Ana',
    customer: 'Lobby chair repair',
    status: 'Completed',
    material: 'Brown vinyl used',
    activity: 'Completed with photos and customer sign-off',
    alert: 'Completion email sent',
    period: 'past'
  },
  {
    id: 'DSV-1039',
    code: '09402 / 1120-7',
    number: '126812',
    account: 'Local Restaurant',
    type: 'Upholstery',
    due: '06/04/2026',
    duration: '1.5 hrs',
    salesperson: 'Luis',
    customer: 'Dining booth touch-up',
    status: 'Completed',
    material: 'Black thread used',
    activity: 'Before and after photos captured',
    alert: 'Yesterday job archived',
    period: 'past'
  },
  {
    id: 'DSV-1048',
    code: '09440 / 5010-9',
    number: '126910',
    account: 'Boutique Hotel',
    type: 'Install',
    due: '06/08/2026',
    duration: '5 hrs',
    salesperson: 'Maria',
    customer: 'Suite headboard install',
    status: 'Scheduled',
    material: 'Cream fabric reserved',
    activity: 'Daily email notification scheduled',
    alert: 'Tomorrow route ready',
    period: 'future'
  },
  {
    id: 'DSV-1050',
    code: '09444 / 7090-3',
    number: '126924',
    account: 'Private Client',
    type: 'Custom furniture',
    due: '06/12/2026',
    duration: 'unknown',
    salesperson: 'Ana',
    customer: 'Custom ottoman build',
    status: 'Scheduled',
    material: 'Waiting fabric selection',
    activity: 'Measurements and drawings attached',
    alert: 'Future job queued',
    period: 'future'
  }
];

const forms = ['Pickup condition report', 'Fabric approval form', 'Delivery sign-off', 'Repair notes'];
const inventory = ['18 yd Charcoal vinyl', '1 roll Webbing left', '6 spools Black thread'];
const jobSections = [
  { id: 'past', label: 'Trabajos pasados', empty: 'No past jobs ready' },
  { id: 'today', label: 'Trabajos de hoy', empty: 'No jobs for today' },
  { id: 'future', label: 'Trabajos futuros', empty: 'No future jobs scheduled' }
];
const featureGroups = [
  {
    title: 'Field Service',
    intro: 'Installers get job details, instructions, photos, maps, and sign-offs in one mobile-friendly workflow.',
    items: [
      'Special instructions and documentation',
      'Before and after photos',
      'Mobile customer sign-offs',
      'Daily email notifications',
      'Customer info and location maps',
      'Instant job completion view'
    ]
  },
  {
    title: 'Ping Automation',
    intro: 'Customer and owner communication is handled from job activity instead of manual follow-up calls.',
    items: [
      'Automated appointment reminders',
      'Customer on-the-way texts',
      'Follow-up messages',
      'Company-branded communications',
      'Easy confirm or reschedule',
      'Activity status updates'
    ]
  },
  {
    title: 'Log Visibility',
    intro: 'Every important change becomes a clean activity feed so the owner and shop know what happened.',
    items: [
      'Real-time activity feed',
      'Instant issue alerts',
      'Email alerts to the right people',
      'Sales and manager visibility',
      'Shop-wide status awareness',
      'Designed around service workflows'
    ]
  }
];

function AppButton({ children, tone = 'dark', onClick }) {
  return (
    <button type="button" className={`app-button ${tone}`} onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [jobs, setJobs] = useState(initialJobs);
  const [selectedId, setSelectedId] = useState(initialJobs[0].id);
  const [tab, setTab] = useState('job');
  const [role, setRole] = useState('Owner');
  const [notice, setNotice] = useState('Ready for demo');
  const [notesOpen, setNotesOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('today');

  const selectedJob = useMemo(() => jobs.find((job) => job.id === selectedId) ?? jobs[0], [jobs, selectedId]);
  const visibleJobs = useMemo(() => jobs.filter((job) => job.period === activeSection), [jobs, activeSection]);

  function openJob(job) {
    setSelectedId(job.id);
    setActiveSection(job.period);
    setTab('job');
    setNotice(`Opened ${job.code}: ${job.customer}`);
  }

  function openSection(sectionId) {
    const nextJob = jobs.find((job) => job.period === sectionId);
    setActiveSection(sectionId);
    if (nextJob) {
      setSelectedId(nextJob.id);
      setTab('job');
      setNotice(`Showing ${jobSections.find((section) => section.id === sectionId)?.label}`);
    }
  }

  function markComplete() {
    setJobs((current) =>
      current.map((job) =>
        job.id === selectedJob.id ? { ...job, status: 'Completed', alert: 'Owner SMS queued' } : job
      )
    );
    setNotice(`Update sent: ${selectedJob.code} marked complete`);
  }

  function reportMaterial() {
    setJobs((current) =>
      current.map((job) =>
        job.id === selectedJob.id ? { ...job, status: 'Blocked', material: 'Material request sent', alert: 'Owner SMS queued' } : job
      )
    );
    setNotice(`Owner alert queued: material needed for ${selectedJob.code}`);
  }

  return (
    <div className="workspace">
      <aside className="side-panel">
        <div className="brand">
          <div className="brand-mark">DS</div>
          <div>
            <span>WorkflowOS demo</span>
            <strong>Desert Sky WorkApp</strong>
          </div>
        </div>

        <nav className="side-nav" aria-label="Main views">
          <button className="active" type="button"><ClipboardList size={19} /> Trabajos</button>
          <button type="button"><Camera size={19} /> Fotos</button>
          <button type="button"><MessageSquareText size={19} /> Ping</button>
          <button type="button"><PackageSearch size={19} /> Inventario</button>
        </nav>

        <div className="license-note">
          <ShieldCheck size={19} />
          <span>Licensed client workspace. Platform stays reusable.</span>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <span className="eyebrow">Demo for furniture, upholstery, repair, and restoration teams</span>
            <h1>Field workflow connected to owner alerts</h1>
          </div>
          <div className="top-actions">
            <select value={role} onChange={(event) => setRole(event.target.value)} aria-label="Role">
              <option>Owner</option>
              <option>Manager</option>
              <option>Employee</option>
            </select>
            <AppButton onClick={() => setNotice(`Test ping sent to ${role}`)}>
              <Send size={18} /> Send Test Ping
            </AppButton>
          </div>
        </header>

        <section className="notice-bar">
          <BellRing size={18} />
          <strong>{notice}</strong>
        </section>

        <section className="app-grid">
          <div className="panel job-search-panel">
            <label>Job search</label>
            <div className="search-field">
              <Search size={22} />
              <span>Enter Job Name...</span>
            </div>

            <div className="job-groups">
              {jobSections.map((section) => {
                const sectionJobs = jobs.filter((job) => job.period === section.id);
                const open = activeSection === section.id;
                return (
                  <div key={section.id} className={`job-section ${open ? 'open' : ''}`}>
                    <button className="group-row" type="button" onClick={() => openSection(section.id)}>
                      <CirclePlus size={24} />
                      <strong>{section.label}</strong>
                      <span>{sectionJobs.length}</span>
                    </button>
                    {open ? (
                      <div className="section-jobs">
                        {visibleJobs.length ? visibleJobs.map((job) => (
                          <button
                            key={job.id}
                            type="button"
                            className={`job-row ${selectedJob.id === job.id ? 'selected' : ''}`}
                            onClick={() => openJob(job)}
                          >
                            <div>
                              <strong>{job.code}</strong>
                              <span>{job.customer}</span>
                            </div>
                            <ChevronRight size={21} />
                          </button>
                        )) : <p>{section.empty}</p>}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="panel work-panel">
            <div className="work-header">
              <div>
                <span className="eyebrow">Active job</span>
                <h2>{selectedJob.code}</h2>
                <p>{selectedJob.customer}</p>
              </div>
              <span className={`status ${selectedJob.status.toLowerCase().replace(/\s/g, '-')}`}>{selectedJob.status}</span>
            </div>

            <div className="tabs">
              {[
                ['job', 'Trabajo', ClipboardList],
                ['photos', 'Fotos', Camera],
                ['sign', 'Renuncia', FilePlus]
              ].map(([id, label, Icon]) => (
                <button key={id} type="button" className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>

            {tab === 'job' ? (
              <div className="job-form">
                {[
                  ['Salesperson', selectedJob.salesperson],
                  ['Account', selectedJob.account],
                  ['Nombre del trabajo', selectedJob.code],
                  ['N\u00famero de trabajo', selectedJob.number],
                  ['Tipo de trabajo', selectedJob.type],
                  ['Fecha de vencimiento', selectedJob.due],
                  ['Duration', selectedJob.duration],
                  ['Tiempo de actividad', selectedJob.activity]
                ].map(([label, value]) => (
                  <div key={label} className="field-line">
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            ) : null}

            {tab === 'photos' ? (
              <div className="photos-view">
                <h3>Job Files</h3>
                <button type="button" className="file-row"><FilePlus size={22} /> Archivos de WorkFlowOS</button>
                <h3>Job Photos</h3>
                <div className="photo-box">
                  <Camera size={42} />
                  <strong>Before / during / after photos</strong>
                  <span>Field employees upload job photos here.</span>
                </div>
              </div>
            ) : null}

            {tab === 'sign' ? (
              <div className="sign-view">
                <h3>Completion sign-off</h3>
                <div className="signature-area">
                  <PenLine size={42} />
                  <span>Customer signature area</span>
                </div>
              </div>
            ) : null}

            <div className="action-strip">
              <AppButton tone="blue" onClick={reportMaterial}><PackageSearch size={18} /> Falta material</AppButton>
              <AppButton tone="green" onClick={markComplete}><Check size={18} /> Completar</AppButton>
              <AppButton onClick={() => setNotesOpen(true)}><PenLine size={18} /> Notes</AppButton>
            </div>
          </div>

          <div className="panel side-card">
            <h3>Owner alerts</h3>
            <div className="alert-list">
              {jobs.map((job) => (
                <div key={job.id} className="alert-row">
                  <MessageSquareText size={18} />
                  <div>
                    <strong>{job.code}</strong>
                    <span>{job.alert}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel side-card">
            <h3>Inventory</h3>
            <div className="inventory-list">
              {inventory.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          <div className="panel feature-panel">
            <div className="feature-heading">
              <span className="eyebrow">Included workflow tools</span>
              <h3>Field, Ping, and Log features for the demo</h3>
            </div>
            <div className="feature-grid">
              {featureGroups.map((group) => (
                <article key={group.title} className="feature-card">
                  <h4>{group.title}</h4>
                  <p>{group.intro}</p>
                  <div>
                    {group.items.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mobile-tabs">
            <button className="active" type="button"><Home size={18} /> Trabajos</button>
            <button type="button"><MapPinned size={18} /> Mapa</button>
            <button type="button"><CalendarDays size={18} /> Calendario</button>
          </div>
        </section>
      </main>

      {notesOpen ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="notes-modal">
            <div className="modal-accent" />
            <h2>Completion Notes</h2>
            <label>Notes</label>
            <textarea placeholder="Add completion notes for the owner..." />
            <div className="modal-actions">
              <button type="button" className="submit" onClick={() => {
                setNotesOpen(false);
                setNotice(`Completion notes saved for ${selectedJob.code}`);
              }}>SUBMIT</button>
              <button type="button" className="cancel" onClick={() => setNotesOpen(false)}>CANCEL</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
