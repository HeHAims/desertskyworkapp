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
  ArrowLeft,
  Search,
  Send,
  ShieldCheck,
  UserRound
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { supabaseConfigured, workspaceAccessCode } from './supabaseClient.js';
import { uploadJobFile } from './uploads.js';

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
const DEMO_ACCESS_CODE = workspaceAccessCode;
const jobStatusOptions = ['Open', 'Closed', 'Pending', 'Stock'];

const nowLocalInput = () => {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offsetMs).toISOString().slice(0, 16);
};

const calculateHours = (startedAt, finishedAt) => {
  if (!startedAt || !finishedAt) {
    return 'TBD';
  }
  const diffMs = new Date(finishedAt).getTime() - new Date(startedAt).getTime();
  if (!Number.isFinite(diffMs) || diffMs <= 0) {
    return 'TBD';
  }
  const hours = diffMs / 36e5;
  return `${hours.toFixed(hours >= 10 ? 0 : 1)} hrs`;
};

function AppButton({ children, tone = 'dark', onClick }) {
  return (
    <button type="button" className={`app-button ${tone}`} onClick={onClick}>
      {children}
    </button>
  );
}

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');

  function submitLogin(event) {
    event.preventDefault();
    if (!email.includes('@')) {
      setError('Enter a valid employee email.');
      return;
    }
    if (accessCode.trim().toUpperCase() !== DEMO_ACCESS_CODE) {
      setError('Company access code is incorrect.');
      return;
    }
    onLogin({ email, name: email.split('@')[0] });
  }

  return (
    <main className="login-screen">
      <section className="login-card">
        <div className="brand login-brand">
          <div className="brand-mark">DS</div>
          <div>
            <span>Employee access</span>
            <strong>Desert Sky WorkApp</strong>
          </div>
        </div>
        <h1>Sign in to the company workspace</h1>
        <p>Employees use their email plus the company access code provided by management.</p>
        <form onSubmit={submitLogin} className="login-form">
          <label>
            Employee email
            <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="employee@desertsky.com" />
          </label>
          <label>
            Company access code
            <input value={accessCode} onChange={(event) => setAccessCode(event.target.value)} placeholder="Demo code: DSW2026" />
          </label>
          {error ? <strong className="login-error">{error}</strong> : null}
          <button type="submit">Open WorkApp</button>
        </form>
      </section>
    </main>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState(initialJobs);
  const [inventory, setInventory] = useState(startingInventory);
  const [jobFiles, setJobFiles] = useState([]);
  const [workReports, setWorkReports] = useState({});
  const [selectedId, setSelectedId] = useState(initialJobs[0].id);
  const [role, setRole] = useState('Technician');
  const [filter, setFilter] = useState('today');
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('instructions');
  const [notice, setNotice] = useState('Ready for demo');
  const [notesOpen, setNotesOpen] = useState(false);
  const [adjustingItem, setAdjustingItem] = useState(null);
  const [page, setPage] = useState('dashboard');
  const [uploading, setUploading] = useState(false);

  const todayIso = isoDate(today);
  const selectedJob = useMemo(() => jobs.find((job) => job.id === selectedId) ?? jobs[0], [jobs, selectedId]);

  const filteredJobs = useMemo(() => {
    const term = search.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesFilter =
        filter === 'today'
          ? job.date === todayIso && !['Completed', 'Closed'].includes(job.status)
          : filter === 'active'
            ? !['Completed', 'Closed'].includes(job.status)
            : filter === 'approval'
              ? job.needsApproval
              : filter === 'future'
                ? job.date > todayIso
                : filter === 'past'
                  ? job.date < todayIso || ['Completed', 'Closed'].includes(job.status)
                  : filter === 'new'
                    ? job.isNew
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
    setPage('job');
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

  function startJob(job) {
    const arrivalTime = nowLocalInput();
    setSelectedId(job.id);
    setWorkReports((current) => ({
      ...current,
      [job.id]: {
        ...current[job.id],
        arrivedAt: current[job.id]?.arrivedAt || arrivalTime
      }
    }));
    setJobs((current) =>
      current.map((item) =>
        item.id === job.id ? { ...item, status: 'In progress', alert: 'Technician arrived on site' } : item
      )
    );
    setPage('worklog');
    setNotice(`${job.code}: arrival time started`);
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

  function saveWorkReport(formData, completeAfterSave = false) {
    const arrivedAt = formData.get('arrivedAt');
    const finishedAt = formData.get('finishedAt');
    const workDone = formData.get('workDone');
    const issueNotes = formData.get('issueNotes');
    const totalTime = calculateHours(arrivedAt, finishedAt);

    setWorkReports((current) => ({
      ...current,
      [selectedJob.id]: {
        arrivedAt,
        finishedAt,
        workDone,
        issueNotes,
        totalTime,
        savedBy: user.email,
        savedAt: new Date().toISOString()
      }
    }));

    setJobs((current) =>
      current.map((job) =>
        job.id === selectedJob.id
          ? {
              ...job,
              duration: totalTime,
              alert: completeAfterSave ? 'Work report completed' : 'Work report saved',
              status: completeAfterSave ? 'Completed' : job.status
            }
          : job
      )
    );

    if (completeAfterSave) {
      setFilter('today');
      setNotice(`${selectedJob.code}: work report saved and job completed`);
    } else {
      setNotice(`${selectedJob.code}: work report saved`);
    }
  }

  function saveInventory(amount) {
    setInventory((current) =>
      current.map((item) => (item.id === adjustingItem.id ? { ...item, amount } : item))
    );
    setNotice(`Inventory updated: ${adjustingItem.label} is now ${amount}`);
    setAdjustingItem(null);
  }

  function openToolPage(nextPage, message) {
    setPage(nextPage);
    setNotice(message);
  }

  function createJob(formData) {
    const status = formData.get('status');
    const newJob = {
      id: `DSV-${Math.floor(1100 + Math.random() * 8999)}`,
      code: formData.get('code') || `NEW-${Date.now().toString().slice(-5)}`,
      number: formData.get('number') || Date.now().toString().slice(-6),
      account: formData.get('account') || 'New customer',
      type: formData.get('type') || 'Service',
      date: isoDate(today),
      timeWindow: formData.get('timeWindow') || 'TBD',
      duration: 'TBD',
      salesperson: user.name,
      customer: formData.get('customer') || 'New job',
      address: formData.get('address') || 'Address needed',
      status,
      material: formData.get('material') || 'TBD',
      instructions: formData.get('instructions') || 'No instructions added yet.',
      alert: status === 'Stock' ? 'Waiting on stock/material' : status === 'Pending' ? 'Pending review' : 'New job created',
      needsApproval: status === 'Pending',
      isNew: true
    };
    setJobs((current) => [newJob, ...current]);
    setSelectedId(newJob.id);
    setFilter(status === 'Closed' ? 'past' : 'today');
    setPage('job');
    setNotice(`${newJob.code} created with status ${status}`);
  }

  async function handleUpload(uploadType, fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) {
      return;
    }

    setUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        uploaded.push(await uploadJobFile({ job: selectedJob, file, uploadType, user }));
      }
      setJobFiles((current) => [...uploaded, ...current]);
      setNotice(`${uploaded.length} ${uploadType.replace('-', ' ')} file${uploaded.length === 1 ? '' : 's'} saved for ${selectedJob.code}`);
    } catch (error) {
      setNotice(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  }

  const todayJobs = jobs.filter((job) => job.date === todayIso && !['Completed', 'Closed'].includes(job.status));
  const approvalJobs = jobs.filter((job) => job.needsApproval);
  const selectedJobFiles = jobFiles.filter((file) => file.jobId === selectedJob.id);
  const selectedReport = workReports[selectedJob.id] || {};
  const newJobs = jobs.filter((job) => job.isNew);
  const reportFiles = Object.entries(workReports).map(([jobId, report]) => ({
    jobId,
    report,
    job: jobs.find((item) => item.id === jobId)
  })).filter((item) => item.job);

  if (!user) {
    return <LoginScreen onLogin={setUser} />;
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

        <div className="signed-in-card">
          <UserRound size={18} />
          <div>
            <span>Signed in</span>
            <strong>{user.email}</strong>
          </div>
        </div>

        <nav className="side-nav" aria-label="Main views">
          <button className={filter === 'today' && page === 'dashboard' ? 'active' : ''} type="button" onClick={() => {
            setFilter('today');
            setPage('dashboard');
          }}>
            <ClipboardList size={19} /> Trabajo Hoy
          </button>
          <button className={filter === 'future' && page === 'dashboard' ? 'active' : ''} type="button" onClick={() => {
            setFilter('future');
            setPage('dashboard');
          }}>
            <CalendarDays size={19} /> Trabajos Futuros
          </button>
          <button className={filter === 'past' && page === 'dashboard' ? 'active' : ''} type="button" onClick={() => {
            setFilter('past');
            setPage('dashboard');
          }}>
            <CalendarDays size={19} /> Trabajos Pasados
          </button>
          <button className={page === 'newjob' ? 'active' : ''} type="button" onClick={() => openToolPage('newjob', 'Create a new job')}>
            <FilePlus size={19} /> Nuevo Trabajo
          </button>
          <button className={filter === 'new' && page === 'dashboard' ? 'active' : ''} type="button" onClick={() => {
            setFilter('new');
            setPage('dashboard');
          }}>
            <ClipboardList size={19} /> Nuevos Trabajos
          </button>
          <button className={page === 'workfiles' ? 'active' : ''} type="button" onClick={() => openToolPage('workfiles', 'Work files opened')}>
            <FilePlus size={19} /> Work Files
          </button>
          <button className={page === 'alerts' ? 'active' : ''} type="button" onClick={() => openToolPage('alerts', 'Owner alerts opened')}>
            <BellRing size={19} /> Needs Approval
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
          <button type="button" className="logout-button" onClick={() => setUser(null)}>
            Sign out
          </button>
        </header>

        <section className="notice-bar">
          <BellRing size={18} />
          <strong>{notice}</strong>
        </section>

        {page !== 'dashboard' ? (
          <section className="subpage">
            <button type="button" className="back-button" onClick={() => setPage('dashboard')}>
              <ArrowLeft size={19} />
              Back to Trabajo Hoy
            </button>

            {page === 'job' ? (
              <div className="subpage-grid">
                <div className="panel work-panel wide">
                  <div className="work-header">
                    <div>
                      <span className="eyebrow">Job detail</span>
                      <h2>{selectedJob.code}</h2>
                      <p>{selectedJob.customer}</p>
                    </div>
                    <span className={`status ${selectedJob.status.toLowerCase().replace(/\s/g, '-')}`}>{selectedJob.status}</span>
                  </div>
                  <div className="job-form subpage-form">
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
                  <div className="subpage-actions">
                    <AppButton tone="blue" onClick={() => openToolPage('photos', 'Photos page opened')}><Camera size={18} /> Photos</AppButton>
                    <AppButton tone="blue" onClick={() => openToolPage('worklog', 'Work report opened')}><PenLine size={18} /> Work Report</AppButton>
                    <AppButton tone="blue" onClick={() => openToolPage('sign', 'Sign-off page opened')}><FilePlus size={18} /> Sign-Off</AppButton>
                    <AppButton tone="green" onClick={completeJob}><Check size={18} /> Complete Job</AppButton>
                  </div>
                </div>
              </div>
            ) : null}

            {page === 'worklog' ? (
              <div className="panel subpage-panel">
                <span className="eyebrow">{selectedJob.code}</span>
                <h2>Technician Work Report</h2>
                <p className="subpage-copy">Record arrival time, finish time, what was completed, issues, materials, and related photos/files.</p>
                <form className="work-report-form" onSubmit={(event) => {
                  event.preventDefault();
                  saveWorkReport(new FormData(event.currentTarget));
                }}>
                  <div className="time-grid">
                    <label>
                      Arrived on site
                      <input name="arrivedAt" type="datetime-local" defaultValue={selectedReport.arrivedAt || nowLocalInput()} />
                    </label>
                    <label>
                      Finished work
                      <input name="finishedAt" type="datetime-local" defaultValue={selectedReport.finishedAt || ''} />
                    </label>
                  </div>
                  <label>
                    Description of work completed
                    <textarea name="workDone" defaultValue={selectedReport.workDone || ''} placeholder="Example: repaired frame, installed booth upholstery, cleaned work area, customer reviewed final work." />
                  </label>
                  <label>
                    Issues, missing materials, or follow-up needed
                    <textarea name="issueNotes" defaultValue={selectedReport.issueNotes || ''} placeholder="Example: webbing was low, customer requested another chair quote, owner approval needed." />
                  </label>

                  <div className="photo-workflow">
                    <label>
                      <Camera size={24} />
                      Before photos
                      <input type="file" accept="image/*" multiple onChange={(event) => handleUpload('before-photo', event.target.files)} />
                    </label>
                    <label>
                      <Camera size={24} />
                      After photos
                      <input type="file" accept="image/*" multiple onChange={(event) => handleUpload('after-photo', event.target.files)} />
                    </label>
                    <label>
                      <FilePlus size={24} />
                      Documents
                      <input type="file" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" multiple onChange={(event) => handleUpload('document', event.target.files)} />
                    </label>
                  </div>

                  <div className="report-summary">
                    <strong>Total time:</strong>
                    <span>{selectedReport.totalTime || 'Calculated after save'}</span>
                  </div>

                  {selectedJobFiles.length ? (
                    <div className="uploaded-list compact">
                      {selectedJobFiles.map((file) => (
                        <a key={file.id} href={file.publicUrl} target="_blank" rel="noreferrer">
                          <strong>{file.name}</strong>
                          <span>{file.type} - {file.mode}</span>
                        </a>
                      ))}
                    </div>
                  ) : null}

                  <div className="subpage-actions">
                    <button type="submit" className="app-button blue">Save Report</button>
                    <button type="button" className="app-button green" onClick={(event) => {
                      const form = event.currentTarget.closest('form');
                      saveWorkReport(new FormData(form), true);
                    }}>Save & Complete Job</button>
                  </div>
                </form>
              </div>
            ) : null}

            {page === 'newjob' ? (
              <div className="panel subpage-panel">
                <span className="eyebrow">Create and schedule</span>
                <h2>Nuevo Trabajo</h2>
                <p className="subpage-copy">Create a job for today and choose the starting status. Closed jobs move to Trabajos Pasados automatically.</p>
                <form className="work-report-form" onSubmit={(event) => {
                  event.preventDefault();
                  createJob(new FormData(event.currentTarget));
                }}>
                  <div className="time-grid">
                    <label>
                      Job name / code
                      <input name="code" placeholder="09510 / 2200-1" />
                    </label>
                    <label>
                      Job number
                      <input name="number" placeholder="126990" />
                    </label>
                  </div>
                  <div className="time-grid">
                    <label>
                      Customer / job name
                      <input name="customer" placeholder="Custom sofa repair" />
                    </label>
                    <label>
                      Account / location
                      <input name="account" placeholder="AMW - WESLEY PARK" />
                    </label>
                  </div>
                  <label>
                    Address
                    <input name="address" placeholder="3770 S Valley View Blvd, Las Vegas, NV" />
                  </label>
                  <div className="time-grid">
                    <label>
                      Time window
                      <input name="timeWindow" placeholder="10:00 AM - 12:00 PM" />
                    </label>
                    <label>
                      Type
                      <input name="type" placeholder="Install, repair, custom furniture" />
                    </label>
                  </div>
                  <div className="time-grid">
                    <label>
                      Status
                      <select name="status" defaultValue="Open">
                        {jobStatusOptions.map((status) => <option key={status}>{status}</option>)}
                      </select>
                    </label>
                    <label>
                      Material / stock
                      <input name="material" placeholder="Webbing, fabric, thread..." />
                    </label>
                  </div>
                  <label>
                    Instructions / description
                    <textarea name="instructions" placeholder="Describe what needs to be done, customer requests, special notes, measurements, or stock issue." />
                  </label>
                  <div className="subpage-actions">
                    <button type="submit" className="app-button green">Save New Job</button>
                  </div>
                </form>
              </div>
            ) : null}

            {page === 'photos' ? (
              <div className="panel subpage-panel">
                <span className="eyebrow">{selectedJob.code}</span>
                <h2>Job Photos & Files</h2>
                <div className="photo-workflow">
                  <label>
                    <Camera size={24} />
                    Before photos
                    <input type="file" accept="image/*" multiple onChange={(event) => handleUpload('before-photo', event.target.files)} />
                  </label>
                  <label>
                    <Camera size={24} />
                    After photos
                    <input type="file" accept="image/*" multiple onChange={(event) => handleUpload('after-photo', event.target.files)} />
                  </label>
                  <label>
                    <FilePlus size={24} />
                    Measurements, drawings, and documents
                    <input type="file" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" multiple onChange={(event) => handleUpload('document', event.target.files)} />
                  </label>
                </div>
                {uploading ? <p className="upload-status">Uploading files...</p> : null}
                <div className="photo-box large">
                  <Camera size={48} />
                  <strong>Uploaded photos will appear here</strong>
                  <span>{supabaseConfigured ? 'Files save to Supabase Storage.' : 'Demo mode: files preview locally until Supabase keys are added.'}</span>
                </div>
                <div className="uploaded-list">
                  {selectedJobFiles.length ? selectedJobFiles.map((file) => (
                    <a key={file.id} href={file.publicUrl} target="_blank" rel="noreferrer">
                      <strong>{file.name}</strong>
                      <span>{file.type} - {file.mode}</span>
                    </a>
                  )) : <span>No files uploaded for this job yet.</span>}
                </div>
              </div>
            ) : null}

            {page === 'sign' ? (
              <div className="panel subpage-panel">
                <span className="eyebrow">{selectedJob.code}</span>
                <h2>Customer Sign-Off</h2>
                <p className="subpage-copy">Capture approval at the job site and attach the signature directly to the work record.</p>
                <div className="signature-area large">
                  <PenLine size={52} />
                  <span>Customer signature pad</span>
                </div>
                <div className="subpage-actions">
                  <AppButton tone="green" onClick={completeJob}><Check size={18} /> Submit and Complete</AppButton>
                </div>
              </div>
            ) : null}

            {page === 'alerts' ? (
              <div className="panel subpage-panel">
                <span className="eyebrow">Owner view</span>
                <h2>Owner Alerts</h2>
                <div className="subpage-list">
                  {approvalJobs.map((job) => (
                    <button key={job.id} type="button" className="alert-row" onClick={() => openJob(job)}>
                      <MessageSquareText size={18} />
                      <div>
                        <strong>{job.code}</strong>
                        <span>{job.alert} - {job.customer}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {page === 'inventory' ? (
              <div className="panel subpage-panel">
                <span className="eyebrow">Warehouse</span>
                <h2>Inventory Adjustments</h2>
                <div className="inventory-list page-list">
                  {inventory.map((item) => (
                    <button key={item.id} type="button" onClick={() => setAdjustingItem(item)}>
                      <strong>{item.amount}</strong>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {page === 'map' ? (
              <div className="panel subpage-panel">
                <span className="eyebrow">{selectedJob.code}</span>
                <h2>Navigate to Job</h2>
                <div className="map-preview">
                  <MapPinned size={54} />
                  <strong>{selectedJob.address}</strong>
                  <span>Demo map route preview</span>
                </div>
              </div>
            ) : null}

            {page === 'contact' ? (
              <div className="panel subpage-panel">
                <span className="eyebrow">{selectedJob.code}</span>
                <h2>Contact Customer</h2>
                <div className="contact-actions">
                  <button type="button" onClick={() => setNotice('Calling customer...')}><Phone size={22} /> Call customer</button>
                  <button type="button" onClick={() => setNotice('Text sent: crew is on the way')}><MessageSquareText size={22} /> Send on-the-way text</button>
                </div>
              </div>
            ) : null}

            {page === 'pinglog' ? (
              <div className="panel subpage-panel">
                <span className="eyebrow">Automation</span>
                <h2>Ping / Log Center</h2>
                <div className="tool-actions page-list">
                  <button type="button" onClick={() => setNotice('Alert sent: Customer notified of arrival')}>Send customer arrival ping</button>
                  <button type="button" onClick={() => setNotice('Log: Status changed to In Progress')}>Write activity log entry</button>
                  <button type="button" onClick={() => setNotice('Follow-up scheduled after job completion')}>Schedule follow-up</button>
                </div>
              </div>
            ) : null}

            {page === 'workfiles' ? (
              <div className="panel subpage-panel">
                <span className="eyebrow">Photos, documents, and reports</span>
                <h2>Work Files</h2>
                <div className="uploaded-list">
                  {jobFiles.length ? jobFiles.map((file) => (
                    <a key={file.id} href={file.publicUrl} target="_blank" rel="noreferrer">
                      <strong>{file.name}</strong>
                      <span>{file.jobCode} - {file.type} - {file.uploadedBy}</span>
                    </a>
                  )) : <span>No uploaded job files yet.</span>}
                </div>
                <div className="subpage-list work-file-reports">
                  {reportFiles.length ? reportFiles.map(({ job, report }) => (
                    <button key={job.id} type="button" className="alert-row" onClick={() => openJob(job)}>
                      <PenLine size={18} />
                      <div>
                        <strong>{job.code} work report</strong>
                        <span>{report.totalTime || 'TBD'} - {report.workDone || 'No description saved'}</span>
                      </div>
                    </button>
                  )) : <span>No saved work reports yet.</span>}
                </div>
              </div>
            ) : null}
          </section>
        ) : (
        <section className="app-grid">
          <div className="panel job-search-panel">
            <div className="panel-heading">
              <span className="eyebrow">{filter === 'today' ? displayDate(today) : 'Filtered jobs'}</span>
              <h2>
                {filter === 'today'
                  ? 'Trabajo Hoy'
                  : filter === 'future'
                    ? 'Trabajos Futuros'
                    : filter === 'past'
                      ? 'Trabajos Pasados'
                      : filter === 'new'
                        ? 'Nuevos Trabajos'
                      : filter === 'approval'
                        ? 'Needs Approval'
                        : 'Job List'}
              </h2>
            </div>

            <label className="search-field">
              <Search size={22} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search jobs, customer, address..." />
            </label>

            <div className="filter-row">
              <button className={filter === 'today' ? 'active' : ''} type="button" onClick={() => setFilter('today')}>Hoy</button>
              <button className={filter === 'future' ? 'active' : ''} type="button" onClick={() => setFilter('future')}>Futuros</button>
              <button className={filter === 'past' ? 'active' : ''} type="button" onClick={() => setFilter('past')}>Pasados</button>
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
                      startJob(job);
                    }}>Start Job</button>
                    <button type="button" onClick={() => {
                      setSelectedId(job.id);
                      openToolPage('map', `Map opened for ${job.address}`);
                    }}><MapPinned size={16} /> Navigate</button>
                    <button type="button" onClick={() => {
                      setSelectedId(job.id);
                      openToolPage('contact', `Contact options opened for ${job.customer}`);
                    }}><Phone size={16} /> Contact</button>
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
                  ['Arrived', selectedReport.arrivedAt ? selectedReport.arrivedAt.replace('T', ' ') : 'Not recorded'],
                  ['Finished', selectedReport.finishedAt ? selectedReport.finishedAt.replace('T', ' ') : 'Not recorded'],
                  ['Total Time', selectedReport.totalTime || 'TBD'],
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
                <label className="file-row"><Camera size={22} /> Add before photo<input type="file" accept="image/*" onChange={(event) => handleUpload('before-photo', event.target.files)} /></label>
                <label className="file-row"><Camera size={22} /> Add after photo<input type="file" accept="image/*" onChange={(event) => handleUpload('after-photo', event.target.files)} /></label>
                <label className="file-row"><FilePlus size={22} /> Upload special instructions / drawings<input type="file" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" onChange={(event) => handleUpload('document', event.target.files)} /></label>
                {selectedJobFiles.length ? (
                  <div className="uploaded-list compact">
                    {selectedJobFiles.slice(0, 3).map((file) => (
                      <a key={file.id} href={file.publicUrl} target="_blank" rel="noreferrer">{file.name}</a>
                    ))}
                  </div>
                ) : null}
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
              <AppButton tone="blue" onClick={() => openToolPage('worklog', 'Work report opened')}><PenLine size={18} /> Work Report</AppButton>
              <AppButton tone="green" onClick={completeJob}><Check size={18} /> Complete Job</AppButton>
              <AppButton onClick={() => setNotesOpen(true)}><PenLine size={18} /> Notes</AppButton>
            </div>
          </div>

          <div className="right-column">
            <div className="panel side-card">
              <button type="button" className="side-card-button" onClick={() => openToolPage('alerts', 'Owner alerts opened')}>
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
                  <button key={item.id} type="button" onClick={() => openToolPage('inventory', 'Inventory opened')}>
                    <strong>{item.amount}</strong>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="panel side-card">
              <h3>Ping / Log Demo</h3>
              <div className="tool-actions">
                <button type="button" onClick={() => openToolPage('pinglog', 'Ping center opened')}>Send Ping</button>
                <button type="button" onClick={() => openToolPage('pinglog', 'Log center opened')}>Write Log</button>
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
            <button type="button" onClick={() => openToolPage('alerts', 'Owner alerts opened')}><BellRing size={18} /> Alerts</button>
            <button type="button" onClick={() => openToolPage('inventory', 'Inventory opened')}><PackageSearch size={18} /> Inventory</button>
            <button type="button" onClick={() => setRole(role === 'Technician' ? 'Owner' : 'Technician')}><UserRound size={18} /> Me</button>
          </nav>
        </section>
        )}
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
