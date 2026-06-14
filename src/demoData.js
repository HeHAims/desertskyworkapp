export const modules = [
  {
    id: 'field',
    name: 'Field',
    short: 'Mobile crew view',
    description: 'Give installers, repair techs, and delivery crews a simple phone view of every job.',
    features: ['Job details', 'Issue logging', 'Photo checklist', 'Customer signature'],
    status: 'Ready for demo'
  },
  {
    id: 'dox',
    name: 'Dox',
    short: 'Digital forms',
    description: 'Turn paper forms into guided job documents employees can complete from any device.',
    features: ['Pickup forms', 'Delivery forms', 'Approval forms', 'Repair notes'],
    status: 'Template mapped'
  },
  {
    id: 'ping',
    name: 'Ping',
    short: 'Customer updates',
    description: 'Send customer and owner notifications when important job events happen.',
    features: ['Scheduled alerts', 'On the way', 'Decision needed', 'Job complete'],
    status: 'SMS path planned'
  },
  {
    id: 'log',
    name: 'Log',
    short: 'Live activity feed',
    description: 'Show every important change across jobs, inventory, milestones, and documents.',
    features: ['Activity stream', 'Email alerts', 'Audit trail', 'Manager visibility'],
    status: 'Event model drafted'
  }
];

export const jobs = [
  {
    id: 'DSV-1042',
    customer: 'Hospitality booth set',
    type: 'Commercial upholstery',
    owner: 'Maria / Front Office',
    milestone: 'Fabric approval',
    priority: 'High',
    status: 'Needs decision',
    due: 'Today',
    crew: 'Install Team A',
    inventory: 'Charcoal vinyl low'
  },
  {
    id: 'DSV-1043',
    customer: 'Antique chair restoration',
    type: 'Furniture repair',
    owner: 'Jose / Wood Bay',
    milestone: 'Frame restored',
    priority: 'Normal',
    status: 'In production',
    due: 'Tomorrow',
    crew: 'Repair Bench',
    inventory: 'Supplies ready'
  },
  {
    id: 'DSV-1044',
    customer: 'Custom banquette build',
    type: 'Custom furniture',
    owner: 'Ana / Upholstery',
    milestone: 'Client finish review',
    priority: 'Critical',
    status: 'Blocked',
    due: 'Friday',
    crew: 'Custom Build',
    inventory: 'Webbing missing'
  }
];

export const forms = [
  { name: 'Pickup condition report', owner: 'Field crew', state: '2 open' },
  { name: 'Fabric approval form', owner: 'Manager', state: 'Waiting' },
  { name: 'Delivery sign-off', owner: 'Customer', state: 'Ready' },
  { name: 'Repair notes', owner: 'Technician', state: 'Draft' }
];

export const pings = [
  { event: 'Appointment scheduled', target: 'Customer', channel: 'SMS', state: 'Auto' },
  { event: 'Crew on the way', target: 'Customer + owner', channel: 'SMS', state: 'Manual trigger' },
  { event: 'Decision needed', target: 'Owner', channel: 'SMS', state: 'Urgent' },
  { event: 'Job completed', target: 'Customer', channel: 'Email/SMS', state: 'Auto' }
];

export const activity = [
  'DSV-1042 moved to Fabric approval',
  'Ana reported missing webbing on DSV-1044',
  'Delivery sign-off form completed for DSV-1037',
  'Owner SMS queued for blocked job',
  'New photo checklist added to Field view'
];
