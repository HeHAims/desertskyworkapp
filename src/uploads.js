import { supabase, supabaseConfigured } from './supabaseClient.js';

const safeFileName = (name) => name.replace(/[^a-z0-9._-]/gi, '-').toLowerCase();

export async function uploadJobFile({ job, file, uploadType, user }) {
  const fileRecord = {
    id: `${Date.now()}-${file.name}`,
    jobId: job.id,
    jobCode: job.code,
    name: file.name,
    size: file.size,
    type: uploadType,
    uploadedBy: user.email,
    uploadedAt: new Date().toISOString()
  };

  if (!supabaseConfigured) {
    return {
      ...fileRecord,
      storagePath: 'demo-local',
      publicUrl: URL.createObjectURL(file),
      mode: 'demo'
    };
  }

  const path = `${job.id}/${uploadType}/${Date.now()}-${safeFileName(file.name)}`;
  const { error } = await supabase.storage.from('job-files').upload(path, file, {
    cacheControl: '3600',
    upsert: false
  });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from('job-files').getPublicUrl(path);

  return {
    ...fileRecord,
    storagePath: path,
    publicUrl: data.publicUrl,
    mode: 'supabase'
  };
}

