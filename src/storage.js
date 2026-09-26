import {getStoredAdminSession} from './auth';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const GALLERY_BUCKET = 'gallery';
export function publicStorageUrl(path){
  return `${SUPABASE_URL}/storage/v1/object/public/${GALLERY_BUCKET}/${path}`;
}
export async function uploadGalleryImage(file){
  const session=getStoredAdminSession();
  if(!session?.access_token) throw new Error('Admin session is missing. Please sign in again.');
  if(!file) throw new Error('Please select an image.');
  if(!file.type.startsWith('image/')) throw new Error('Only image files are allowed.');
  if(file.size>8*1024*1024) throw new Error('Image must be 8 MB or smaller.');
  const ext=(file.name.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'')||'jpg';
  const path=`gallery-${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`;
  const response=await fetch(`${SUPABASE_URL}/storage/v1/object/${GALLERY_BUCKET}/${path}`,{
    method:'POST',headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${session.access_token}`,'Content-Type':file.type||'application/octet-stream','x-upsert':'false'},body:file
  });
  const text=await response.text();let data={};try{data=text?JSON.parse(text):{}}catch{data={message:text}}
  if(!response.ok) throw new Error(data.message||data.error||`Storage upload failed (${response.status}).`);
  return {path,url:publicStorageUrl(path)};
}
export async function deleteGalleryImage(path){
  const session=getStoredAdminSession();
  if(!session?.access_token) throw new Error('Admin session is missing. Please sign in again.');
  const response=await fetch(`${SUPABASE_URL}/storage/v1/object/${GALLERY_BUCKET}/remove`,{method:'POST',headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${session.access_token}`,'Content-Type':'application/json'},body:JSON.stringify({prefixes:[path]})});
  if(!response.ok){const t=await response.text();throw new Error(`Storage delete failed (${response.status}): ${t}`)}
}
