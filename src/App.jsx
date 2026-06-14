import {
  ArrowLeft,
  CalendarDays,
  Camera,
  Check,
  ChevronRight,
  CircleMinus,
  CirclePlus,
  ClipboardList,
  FilePlus,
  Home,
  Menu,
  MessageSquareText,
  PackageSearch,
  PenLine,
  Search,
  Send
} from 'lucide-react';
import { useMemo, useState } from 'react';

const jobGroups = [
  { id: 'past', label: 'Trabajos pasados', count: 4, open: false },
  { id: 'yesterday', label: 'Trabajos de ayer', count: 2, open: false },
  { id: 'today', label: 'Trabajos de hoy', count: 3, open: true },
  { id: 'tomorrow', label: 'Trabajos del ma\u00f1ana', count: 2, open: false },
  { id: 'future', label: 'Trabajos futuros', count: 6, open: false }
];

const jobs = [
  {
    id: 'DSV-1042',
    code: '09424 / 3020-2',
    number: '126858',
    account: 'AMW - WESLEY PARK',
    type: 'Install',
    due: '06/05/2026',
    duration: 'unknown',
    salesperson: '',
    activity: 'Fabric approval and booth install',
    status: 'Needs approval',
    customer: 'Hospitality booth set',
    address: '3770 S Valley View Blvd, Las Vegas',
    material: 'Charcoal vinyl low'
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
    activity: 'Antique chair frame repair',
    status: 'In production',
    customer: 'Antique chair restoration',
    address: 'Pickup required',
    material: 'Supplies ready'
  }
];

const fieldRows = [
  ['Salesperson', 'salesperson'],
  ['Account', 'account'],
  ['Nombre del trabajo', 'code'],
  ['N\u00famero de trabajo', 'number'],
  ['Tipo de trabajo', 'type']
];

function TopChrome({ title, onBack, actionLabel, actionIcon = 'edit', onAction }) {
  return (
    <header className="phone-header">
      <button type="button" className="dark-action" onClick={onBack}>
        <ArrowLeft size={26} />
        Regresar
      </button>
      <strong>{title}</strong>
      <button type="button" className="dark-action" onClick={onAction}>
        {actionIcon === 'check' ? <Check size={26} /> : <PenLine size={26} />}
        {actionLabel}
      </button>
    </header>
  );
}

function BottomTabs({ active, onChange }) {
  return (
    <nav className="bottom-tabs" aria-label="Job sections">
      {[
        ['job', 'Trabajo', ClipboardList],
        ['photos', 'Fotos', Camera],
        ['waiver', 'Renuncia', FilePlus]
      ].map(([id, label, Icon]) => (
        <button key={id} type="button" className={active === id ? 'active' : ''} onClick={() => onChange(id)}>
          <Icon size={20} />
          {label}
        </button>
      ))}
    </nav>
  );
}

function JobSearch({ onOpenJob }) {
  return (
    <section className="screen-body">
      <label className="search-label">Job search</label>
      <div className="search-box">
        <Search size={28} />
        <span>Enter Job Name...</span>
      </div>

      <div className="group-stack">
        {jobGroups.map((group) => (
          <article key={group.id} className={`job-group ${group.open ? 'open' : ''}`}>
            <button type="button" className="group-heading">
              {group.open ? <CircleMinus size={35} /> : <CirclePlus size={35} />}
              <span>{group.label}</span>
            </button>
            {group.open ? (
              <div className="group-content">
                <div className="filter-box">
                  <Search size={24} />
                  <span>Filter items...</span>
                </div>
                {jobs.map((job) => (
                  <button key={job.id} type="button" className="job-picker" onClick={() => onOpenJob(job)}>
                    <div>
                      <strong>{job.code}</strong>
                      <span>{job.customer}</span>
                    </div>
                    <ChevronRight size={24} />
                  </button>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>

      <div className="demo-logo">
        <div className="logo-triangle">DS</div>
        <strong>Desert Sky WorkApp</strong>
      </div>
    </section>
  );
}

function JobDetail({ job, onNotes }) {
  return (
    <section className="screen-body detail-body">
      {fieldRows.map(([label, key]) => (
        <div key={key} className="form-row">
          <label>{label}</label>
          <div className="readonly-input">{job[key] || '\u00a0'}</div>
        </div>
      ))}

      <div className="two-col">
        <div className="form-row">
          <label>Fecha de vencimiento</label>
          <div className="readonly-input">{job.due}</div>
        </div>
        <div className="form-row">
          <label>Duration</label>
          <div className="readonly-input">{job.duration}</div>
        </div>
      </div>

      <div className="form-row">
        <label>Tiempo de actividad</label>
        <div className="large-input">{job.activity}</div>
      </div>

      <div className="quick-actions">
        <button type="button"><MessageSquareText size={22} /> Avisar due\u00f1o</button>
        <button type="button"><PackageSearch size={22} /> Falta material</button>
        <button type="button" onClick={onNotes}><Check size={22} /> Completar</button>
      </div>
    </section>
  );
}

function PhotosView({ onNotes }) {
  return (
    <section className="screen-body photos-body">
      <div className="blue-divider" />
      <h2>Job Files</h2>
      <button type="button" className="file-button">
        <CirclePlus size={32} />
        Archivos de WorkFlowOS
      </button>
      <div className="blue-divider" />
      <h2>Job Photos</h2>
      <label className="photo-label">Antes de</label>
      <div className="upload-strip">
        <span>Seleccionar archivos</span>
        <strong>ning\u00fan archivo seleccionado</strong>
      </div>
      <div className="photo-placeholder">
        <Camera size={62} />
        <strong>Photo capture placeholder</strong>
        <span>Before / during / after job images sync here.</span>
      </div>
      <button type="button" className="complete-button" onClick={onNotes}>
        <Check size={24} />
        Completion notes
      </button>
    </section>
  );
}

function WaiverView() {
  return (
    <section className="screen-body waiver-body">
      <div className="blue-divider" />
      <h2>Renuncia / Sign-Off</h2>
      <p>Customer signature and completion approval will be captured here.</p>
      <div className="signature-box">
        <PenLine size={48} />
        <span>Signature area</span>
      </div>
      <button type="button" className="complete-button">
        <Send size={22} />
        Enviar aprobaci\u00f3n
      </button>
    </section>
  );
}

function NotesModal({ onClose }) {
  return (
    <div className="modal-scrim" role="dialog" aria-modal="true">
      <div className="notes-modal">
        <div className="modal-accent" />
        <h2>Completion Notes</h2>
        <label>Notes</label>
        <textarea />
        <div className="modal-actions">
          <button type="button" className="submit" onClick={onClose}>SUBMIT</button>
          <button type="button" className="cancel" onClick={onClose}>CANCEL</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [tab, setTab] = useState('job');
  const [notesOpen, setNotesOpen] = useState(false);

  const currentJob = useMemo(() => selectedJob ?? jobs[0], [selectedJob]);
  const title = selectedJob ? currentJob.code : 'DSW';

  return (
    <div className="mobile-shell">
      <div className="status-bar">
        <span>5:32</span>
        <span>WorkFlowOS Field</span>
        <span>54%</span>
      </div>

      {selectedJob ? (
        <>
          <TopChrome
            title={title}
            onBack={() => {
              setSelectedJob(null);
              setTab('job');
            }}
            actionLabel="Enviar"
            actionIcon={tab === 'photos' ? 'check' : 'edit'}
            onAction={() => setNotesOpen(true)}
          />
          {tab === 'job' ? <JobDetail job={currentJob} onNotes={() => setNotesOpen(true)} /> : null}
          {tab === 'photos' ? <PhotosView onNotes={() => setNotesOpen(true)} /> : null}
          {tab === 'waiver' ? <WaiverView /> : null}
          <BottomTabs active={tab} onChange={setTab} />
        </>
      ) : (
        <>
          <header className="phone-header home-header">
            <button type="button" className="dark-action">
              <Menu size={28} />
              Menu
            </button>
            <strong>DSW</strong>
            <button type="button" className="dark-action invisible">
              <Home size={26} />
              Home
            </button>
          </header>
          <JobSearch onOpenJob={setSelectedJob} />
          <nav className="bottom-tabs" aria-label="Home sections">
            <button type="button" className="active"><ClipboardList size={20} /> Trabajos</button>
            <button type="button"><Home size={20} /> Mapa</button>
            <button type="button"><CalendarDays size={20} /> Calendario</button>
          </nav>
        </>
      )}

      {notesOpen ? <NotesModal onClose={() => setNotesOpen(false)} /> : null}
    </div>
  );
}
