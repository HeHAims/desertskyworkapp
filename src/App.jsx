import {
  BellRing,
  CalendarDays,
  Camera,
  Check,
  ClipboardList,
  FilePlus,
  Home,
  MapPinned,
  MessageSquareText,
  PackageSearch,
  PenLine,
  Phone,
  Search,
  Send,
  ShieldCheck,
  UserRound
} from 'lucide-react';
import { useMemo, useState } from 'react';

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);

const isoDate = (date) => date.toISOString().slice(0, 10);
const displayDate = (date) =>
  new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);

const initialJobs = [
  {
    id: 'DSV-1042',
    code: '09424 / 3020-2',
    number: '126858',
    account: 'AMW - WESLEY PARK',
    type: 'Install',
    date: isoDate(today),
    timeWindow: '10:00 AM - 12:00 PM',
    duration: 'TBD',
    salesperson: 'Ana',
    customer: 'Hospitality booth set',
    address: '123 Main St, Phoenix, AZ',
    status: 'Ready',
    material: 'Charcoal vinyl low',
    instructions: 'Confirm fabric approval, capture before photos, install booth set, collect customer sign-off.',
    alert: 'Owner approval needed',
    needsApproval: true
  },
  {
    id: 'DSV-1043',
    code: '09425 / 4021-8',
    number: '126861',
    account: 'Residential Client',
    type: 'Repair',
    date: isoDate(today),
    timeWindow: '1:00 PM - 3:00 PM',
    duration: '2 hrs',
    salesperson: 'Maria',
    customer: 'Antique chair restoration',
    address: '440 S Valley View Blvd, Las Vegas, NV',
    status: 'Ready',
    material: 'Supplies ready',
    instructions: 'Repair frame, photo completed work, note any additional fabric damage.',
    alert: 'Technician assigned',
    needsApproval: false
  },
  {
    id: 'DSV-1044',
    code: '09431 / 1180-4',
    number: '126874',
    account: 'Desert Sky Custom',
    type: 'Custom furniture',
    date: isoDate(today),
    timeWindow: '3:30 PM - 5:00 PM',
    duration: '1.5 hrs',
    salesperson: 'Luis',
    customer: 'Custom banquette build',
    address: '3770 S Valley View Blvd, Las Vegas, NV',
    status: 'Blocked',
    material: 'Webbing missing',
    instructions: 'Do not begin upholstery until webbing is confirmed. Notify owner if material is still missing.',
    alert: 'Inventory shortage',
    needsApproval: true
  },
  {
    id: 'DSV-1038',
    code: '09398 / 2075-1',
    number: '126801',
    account: 'The Mirage Villas',
    type: 'Repair',
    date: isoDate(yesterday),
    timeWindow: '9:00 AM - 11:00 AM',
    duration: '3 hrs',
    salesperson: 'Ana',
    customer: 'Lobby chair repair',
    address: '2000 Resort Dr, Las Vegas, NV',
    status: 'Completed',
    material: 'Brown vinyl used',
    instructions: 'Completed with photos and customer sign-off.',
    alert: 'Completion email sent',
    needsApproval: false
  },
  {
    id: 'DSV-1048',
    code: '09440 / 5010-9',
    number: '126910',
    account: 'Boutique Hotel',
    type: 'Install',
    date: isoDate(tomorrow),
    timeWindow: '8:30 AM - 11:30 AM',
    duration: '3 hrs',
    salesperson: 'Maria',
    customer: 'Suite headboard install',
    address: '86 Fremont St, Las Vegas, NV',
    status: 'Scheduled',
    material: 'Cream fabric reserved',
    instructions: 'Daily email notification scheduled. Bring headboard brackets and floor protection.',
    alert: 'Tomorrow route ready',
    needsApproval: false
  }
];

const startingInventory = [
  { id: 'vinyl', label: 'Charcoal vinyl', amount: '18 yd' },
  { id: 'webbing', label: 'Webbing left', amount: '1 roll' },
  { id: 'thread', label: 'Black thread', amount: '6 spools' }
];

const featureGroups = [
  ['Field', 'Instructions, photos, maps, customer sign-off, and instant completion view.'],
  ['Ping', 'Appointment reminders, on-the-way texts, follow-ups, and branded customer communication.'],
  ['Log', 'Real-time job changes, issue alerts, owner visibility, and shop activity history.']
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
  const [inventory, setInventory] = useState(startingInventory);
  const [selectedId, setSelectedId] = useState(initialJobs[0].id);
  const [role, setRole] = useState('Technician');
  const [filter, setFilter] = useState('today');
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('instructions');
  const [notice, setNotice] = useState('Ready for demo');
  const [notesOpen, setNotesOpen] = useState(false);
  const [adjustingItem, setAdjustingItem] = useState(null);

  const todayIso = isoDate(today);
  const selectedJob = useMemo(() => jobs.find((job) => job.id === selectedId) ?? jobs[0], [jobs, selectedId]);

  const filteredJobs = useMemo(() => {
    const term = search.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesFilter =
        filter === 'today'
          ? job.date === todayIso && job.status !== 'Completed'
          : filter === 'active'
            ? job.status !== 'Completed'
            : filter === 'approval'
              ? job.needsApproval
              : filter === 'future'
                ? job.date > todayIso
                : true;

      const matchesSearch =
        !term ||
        [job.code, job.customer, job.account, job.address, job.type].some((value) => value.toLowerCase().includes(term));

      return matchesFilter && matchesSearch;
    });
  }, [filter, jobs, search, todayIso]);

  function openJob(job) {
    setSelectedId(job.id);
    setTab('instructions');
    setNotice(`Opened ${job.code}: ${job.customer}`);
  }

  function updateJobStatus(status, alert) {
    setJobs((current) =>
      current.map((job) =>
        job.id === selectedJob.id
          ? { ...job, status, alert, needsApproval: status === 'Needs approval' || job.needsApproval }
          : job
      )
    );
    setNotice(`${selectedJob.code}: ${alert}`);
  }

  function completeJob() {
    setJobs((current) =>
      current.map((job) =>
        job.id === selectedJob.id
          ? { ...job, status: 'Completed', alert: 'Completed with photos and sign-off', needsApproval: false }
          : job
      )
    );
    setFilter('today');
    setNotice(`${selectedJob.code} completed and removed from Trabajo Hoy`);
  }

  function saveInventory(amount) {
    setInventory((current) =>
      current.map((item) => (item.id === adjustingItem.id ? { ...item, amount } : item))
    );
    setNotice(`Inventory updated: ${adjustingItem.label} is now ${amount}`);
    setAdjustingItem(null);
  }

  const todayJobs = jobs.filter((job) => job.date === todayIso && job.status !== 'Completed');
  const approvalJobs = jobs.filter((job) => job.needsApproval);

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
          <button className={filter === 'today' ? 'active' : ''} type="button" onClick={() => setFilter('today')}>
            <ClipboardList size={19} /> Trabajo Hoy
          </button>
          <button className={filter === 'active' ? 'active' : ''} type="button" onClick={() => setFilter('active')}>
            <CalendarDays size={19} /> All Active
          </button>
          <button className={filter === 'approval' ? 'active' : ''} type="button" onClick={() => setFilter('approval')}>
            <BellRing size={19} /> Needs Approval
          </button>
          <button className={filter === 'future' ? 'active' : ''} type="button" onClick={() => setFilter('future')}>
            <CalendarDays size={19} /> Future Jobs
          </button>
        </nav>

        <div className="license-note">
          <ShieldCheck size={19} />
          <span>Licensed client workspace. Platform stays reusable.</span>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <span className="eyebrow">Technician action center + owner approval view</span>
            <h1>Trabajo Hoy connected to alerts, inventory, and sign-off</h1>
          </div>
          <div className="role-switch" aria-label="Role switch">
            {['Technician', 'Owner'].map((item) => (
              <button key={item} type="button" className={role === item ? 'active' : ''} onClick={() => setRole(item)}>
                {item === 'Technician' ? <UserRound size={17} /> : <ShieldCheck size={17} />}
                {item}
              </button>
            ))}
          </div>
        </header>

        <section className="notice-bar">
          <BellRing size={18} />
          <strong>{notice}</strong>
        </section>

        <section className="app-grid">
          <div className="panel job-search-panel">
            <div className="panel-heading">
              <span className="eyebrow">{filter === 'today' ? displayDate(today) : 'Filtered jobs'}</span>
              <h2>{filter === 'today' ? 'Trabajo Hoy' : filter === 'approval' ? 'Needs Approval' : 'Job List'}</h2>
            </div>

            <label className="search-field">
              <Search size={22} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search jobs, customer, address..." />
            </label>

            <div className="filter-row">
              <button className={filter === 'today' ? 'active' : ''} type="button" onClick={() => setFilter('today')}>Today</button>
              <button className={filter === 'active' ? 'active' : ''} type="button" onClick={() => setFilter('active')}>All Active</button>
              <button className={filter === 'approval' ? 'active' : ''} type="button" onClick={() => setFilter('approval')}>Needs Approval</button>
            </div>

            <div className="job-card-list">
              {filteredJobs.length ? filteredJobs.map((job) => (
                <article key={job.id} className={`today-card ${selectedJob.id === job.id ? 'selected' : ''}`}>
                  <button type="button" className="job-open" onClick={() => openJob(job)}>
                    <strong>{job.code}</strong>
                    <span>{job.customer}</span>
                  </button>
                  <p>{job.account}</p>
                  <p>{job.address}</p>
                  <div className="job-meta-line">
                    <span>{job.timeWindow}</span>
                    <span className={`status ${job.status.toLowerCase().replace(/\s/g, '-')}`}>{job.status}</span>
                  </div>
                  <div className="card-actions">
                    <button type="button" onClick={() => {
                      openJob(job);
                      updateJobStatus('In progress', 'Status changed to In Progress');
                    }}>Start Job</button>
                    <button type="button" onClick={() => setNotice(`Map opened for ${job.address}`)}><MapPinned size={16} /> Navigate</button>
                    <button type="button" onClick={() => setNotice(`Contact options opened for ${job.customer}`)}><Phone size={16} /> Contact</button>
                  </div>
                </article>
              )) : (
                <div className="empty-state">
                  <strong>No jobs scheduled for today.</strong>
                  <span>Check Future Jobs or contact dispatch.</span>
                </div>
              )}
            </div>
          </div>

          <div className="panel work-panel">
            <div className="work-header">
              <div>
                <span className="eyebrow">Selected job detail</span>
                <h2>{selectedJob.code}</h2>
                <p>{selectedJob.customer}</p>
              </div>
              <span className={`status ${selectedJob.status.toLowerCase().replace(/\s/g, '-')}`}>{selectedJob.status}</span>
            </div>

            <div className="tabs">
              {[
                ['instructions', 'Instructions', ClipboardList],
                ['photos', 'Photos', Camera],
                ['sign', 'Sign-Off', FilePlus]
              ].map(([id, label, Icon]) => (
                <button key={id} type="button" className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>

            {tab === 'instructions' ? (
              <div className="job-form">
                {[
                  ['Customer / Location', selectedJob.account],
                  ['Address', selectedJob.address],
                  ['Time Window', selectedJob.timeWindow],
                  ['Job Type', selectedJob.type],
                  ['Duration', selectedJob.duration],
                  ['Material', selectedJob.material],
                  ['Special Instructions', selectedJob.instructions]
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
                <h3>Before & After Photos</h3>
                <button type="button" className="file-row"><Camera size={22} /> Add before photo</button>
                <button type="button" className="file-row"><Camera size={22} /> Add after photo</button>
                <button type="button" className="file-row"><FilePlus size={22} /> Upload special instructions / drawings</button>
              </div>
            ) : null}

            {tab === 'sign' ? (
              <div className="sign-view">
                <h3>Mobile Customer Sign-Off</h3>
                <div className="signature-area">
                  <PenLine size={42} />
                  <span>Customer signature pad</span>
                </div>
              </div>
            ) : null}

            <div className="action-strip">
              <AppButton tone="blue" onClick={() => updateJobStatus('Needs approval', 'Owner approval requested')}>
                <BellRing size={18} /> Request Approval
              </AppButton>
              <AppButton tone="blue" onClick={() => setNotice(`Alert sent: Customer notified crew is on the way`)}>
                <MessageSquareText size={18} /> On-The-Way Text
              </AppButton>
              <AppButton tone="green" onClick={completeJob}><Check size={18} /> Complete Job</AppButton>
              <AppButton onClick={() => setNotesOpen(true)}><PenLine size={18} /> Notes</AppButton>
            </div>
          </div>

          <div className="right-column">
            <div className="panel side-card">
              <button type="button" className="side-card-button" onClick={() => setFilter('approval')}>
                <h3>Owner Alerts</h3>
                <span>{approvalJobs.length} needing attention</span>
              </button>
              <div className="alert-list">
                {approvalJobs.map((job) => (
                  <button key={job.id} type="button" className="alert-row" onClick={() => openJob(job)}>
                    <MessageSquareText size={18} />
                    <div>
                      <strong>{job.code}</strong>
                      <span>{job.alert}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="panel side-card">
              <h3>Inventory</h3>
              <div className="inventory-list">
                {inventory.map((item) => (
                  <button key={item.id} type="button" onClick={() => setAdjustingItem(item)}>
                    <strong>{item.amount}</strong>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="panel side-card">
              <h3>Ping / Log Demo</h3>
              <div className="tool-actions">
                <button type="button" onClick={() => setNotice('Alert sent: Customer notified of arrival')}>Send Ping</button>
                <button type="button" onClick={() => setNotice('Log: Status changed to In Progress')}>Write Log</button>
              </div>
            </div>
          </div>

          <div className="panel feature-panel">
            <div className="feature-grid">
              {featureGroups.map(([title, copy]) => (
                <article key={title} className="feature-card">
                  <h4>{title}</h4>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>

          <nav className="mobile-tabs" aria-label="Mobile navigation">
            <button className="active" type="button" onClick={() => setFilter('today')}><ClipboardList size={18} /> Jobs</button>
            <button type="button" onClick={() => setFilter('approval')}><BellRing size={18} /> Alerts</button>
            <button type="button" onClick={() => setNotice('Inventory opened')}><PackageSearch size={18} /> Inventory</button>
            <button type="button" onClick={() => setRole(role === 'Technician' ? 'Owner' : 'Technician')}><UserRound size={18} /> Me</button>
          </nav>
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

      {adjustingItem ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <form className="notes-modal" onSubmit={(event) => {
            event.preventDefault();
            saveInventory(new FormData(event.currentTarget).get('amount'));
          }}>
            <div className="modal-accent" />
            <h2>Adjust Inventory</h2>
            <label>{adjustingItem.label}</label>
            <input name="amount" defaultValue={adjustingItem.amount} className="amount-input" />
            <div className="modal-actions">
              <button type="submit" className="submit">SAVE</button>
              <button type="button" className="cancel" onClick={() => setAdjustingItem(null)}>CANCEL</button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
