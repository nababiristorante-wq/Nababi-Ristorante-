const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);
function baseHeaders(token=SUPABASE_KEY){return {apikey:SUPABASE_KEY,Authorization:`Bearer ${token}`,Accept:'application/json'}}
async function request(table,query='',options={},token=SUPABASE_KEY){if(!supabaseConfigured)throw new Error('Supabase environment variables are missing.');const r=await fetch(`${SUPABASE_URL}/rest/v1/${table}${query}`,{...options,headers:{...baseHeaders(token),...(options.headers||{})}});const t=await r.text();let d=null;try{d=t?JSON.parse(t):null}catch{d=t}if(!r.ok)throw new Error(`Supabase ${r.status}: ${typeof d==='string'?d:JSON.stringify(d)}`);return d}
export const supabaseSelect=(table,query='',token)=>request(table,query,{},token||SUPABASE_KEY);
export const supabaseInsert=(table,payload,token)=>request(table,'',{method:'POST',headers:{'Content-Type':'application/json',Prefer:'return=representation'},body:JSON.stringify(payload)},token||SUPABASE_KEY);
export const supabaseUpdate=(table,query,payload,token)=>request(table,query,{method:'PATCH',headers:{'Content-Type':'application/json',Prefer:'return=representation'},body:JSON.stringify(payload)},token||SUPABASE_KEY);
export const supabaseDelete=(table,query,token)=>request(table,query,{method:'DELETE',headers:{Prefer:'return=minimal'}},token||SUPABASE_KEY);
