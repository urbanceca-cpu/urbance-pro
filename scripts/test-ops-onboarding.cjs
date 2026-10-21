// End-to-end checks run only against labelled demo records. No email or money moves.
const fs=require('node:fs'),assert=require('node:assert/strict'),{spawn}=require('node:child_process');
const {createClient}=require('@supabase/supabase-js');const demo=JSON.parse(fs.readFileSync('.ops-demo.local.json','utf8'));
const admin=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
const base='http://127.0.0.1:3200';const wait=ms=>new Promise(r=>setTimeout(r,ms));let server;const results=[];
function client(){const jar=new Map();return async(path,body,form=false)=>{const r=await fetch(base+path,{method:body?'POST':'GET',headers:{Origin:base,Cookie:[...jar].map(([k,v])=>k+'='+v).join('; '),...body&&!form?{'Content-Type':'application/json'}:{}},body:body?(form?body:JSON.stringify(body)):undefined,redirect:'manual'});for(const cookie of r.headers.getSetCookie()){const pair=cookie.split(';')[0],i=pair.indexOf('=');jar.set(pair.slice(0,i),pair.slice(i+1));}const text=await r.text();let data;try{data=JSON.parse(text);}catch{data={error:text.slice(0,150)}}return {status:r.status,data};};}
async function check(name,fn){await fn();results.push(name);console.log('PASS '+name);}
async function login(account,mode='login'){const c=client();const r=await c('/api/auth/session',{email:account.email,password:account.password,mode});assert.equal(r.status,200,JSON.stringify(r.data));return c;}
async function upload(c,job,phase){const data=new FormData();data.set('job_id',job);data.set('phase',phase);data.set('caption','DEMO evidence — automated workflow test');data.set('file',new File([Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+kfZ0AAAAASUVORK5CYII=','base64')],'demo.png',{type:'image/png'}));return c('/api/ops/upload',data,true);}
async function main(){
 const log=fs.openSync('/tmp/urbance-ops-extra-next.log','w');server=spawn(process.execPath,['node_modules/next/dist/bin/next','dev','--hostname','127.0.0.1','--port','3200'],{stdio:['ignore',log,log]});
 let ready=false;for(let i=0;i<150;i++){try{const r=await fetch(base+'/api/ops/workspace');if(r.status===401){ready=true;break;}}catch{}await wait(200);}assert(ready,'Dev server did not start');
 const owner=await login(demo.accounts.owner),draft=await login(demo.accounts.draft,'resume');
 await check('team invite requires matching verified email and can be accepted only once',async()=>{
 const r=await owner('/api/ops/team/invite',{email:demo.accounts.invitee.email,name:'Invited Demo',role:'technician',permissions:['jobs.work','billing.manage']});assert.equal(r.status,200,JSON.stringify(r.data));const token=new URL(r.data.invitationLink).searchParams.get('token');
 const wrong=await owner('/api/ops/invite/accept',{token,accepted:true});assert.notEqual(wrong.status,200);
 const invited=await login(demo.accounts.invitee,'invite');let a=await invited('/api/ops/invite/accept',{token,accepted:true});assert.equal(a.status,200,JSON.stringify(a.data));a=await invited('/api/ops/invite/accept',{token,accepted:true});assert.notEqual(a.status,200);
 const w=await invited('/api/ops/workspace');assert.deepEqual(w.data.permissions,['jobs.work']);
 });
 await check('onboarding rejects incomplete submission and accepts private documents with current agreements',async()=>{
 const data={legal_name:'Draft Demo',business_name:'Fictional demo business',business_type:'individual',phone:'6045550100',address:'DEMO ONLY',city:'Vancouver',postal_code:'V6B 1A1',categories:['cleaning'],worksafe_status:'not_required_review',notes:'Fictional solo demonstration applicant; eligibility requires review.',insurance_limit:2000000,insurance_expiry:'2027-12-31',years_experience:2,authorized_to_work:true,terms_accepted:true,privacy_accepted:true,contractor_accepted:true,safety_accepted:true,accuracy_accepted:true};
 let r=await draft('/api/ops/application',{data,submit:true});assert.notEqual(r.status,200);
 for(const kind of ['government_id','liability_insurance','background_check']){const f=new FormData();f.set('kind',kind);f.set('file',new File([Buffer.from('%PDF-1.4\n% DEMO ONLY - fictional verification test\n%%EOF')],'demo.pdf',{type:'application/pdf'}));r=await draft('/api/ops/upload',f,true);assert.equal(r.status,200,JSON.stringify(r.data));}
 r=await draft('/api/ops/application',{data,submit:true});assert.equal(r.status,200,JSON.stringify(r.data));const a=await draft('/api/ops/application');assert.equal(a.data.application.status,'submitted');assert.equal((await draft('/api/ops/workspace')).status,403);
 });
 console.log('RESULT '+results.length+' additional workflow checks passed');
 fs.writeFileSync('docs/E2E-ADDITIONAL.json',JSON.stringify({tested_at:new Date().toISOString(),checks:results,scope:'Fictional onboarding and invitations; no real documents or external mail'},null,2));
}
main().catch(e=>{console.error('FAIL '+e.message);process.exitCode=1}).finally(()=>{server?.kill('SIGTERM')});
