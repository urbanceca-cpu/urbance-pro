// Uses isolated fixture accounts only; creates one cancelled test record. No mail or money.
const fs=require('node:fs'),assert=require('node:assert/strict');
const fixtures=JSON.parse(fs.readFileSync('.ops-demo.local.json')),base=process.env.OPS_TEST_BASE||'https://pros.urbance.ca';
function client(){const jar=new Map();return async(path,body)=>{const r=await fetch(base+path,{method:body?'POST':'GET',headers:{Origin:base,Cookie:[...jar].map(([k,v])=>k+'='+v).join('; '),...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,redirect:'manual',signal:AbortSignal.timeout(20000)});for(const c of r.headers.getSetCookie()){let p=c.split(';')[0],i=p.indexOf('=');jar.set(p.slice(0,i),p.slice(i+1))}let text=await r.text(),data;try{data=JSON.parse(text)}catch{}return{status:r.status,data,text}}}
async function login(k){let c=client(),a=fixtures.accounts[k];assert.equal((await c('/api/auth/session',{email:a.email,password:a.password,mode:'login'})).status,200);return c}
(async()=>{
 const owner=await login('owner'),other=await login('competitor'),tech=await login('technician');
 const values={title:'Isolated approval verification '+Date.now(),customer_name:'Fictional Client',customer_email:'fictional.client@urbance.test',address:'123 Fictional Street, Vancouver',status:'estimated',revenue_cents:25000,materials_cents:1000,labour_cents:2000,travel_cents:0,overhead_cents:0,notes:'PRIVATE INTERNAL NOTES NEVER SHARE'};
 const created=await owner('/api/ops/business',values);assert.equal(created.status,200,'create job');const id=created.data.id;
 const review=async(token,action='read',extra={})=>{const r=await fetch(base+'/api/estimate',{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:JSON.stringify({token,action,...extra})});return {status:r.status,data:await r.json()}};
 try{
 assert.equal((await tech('/api/ops/business/records')).status,403);
 const a=await owner('/api/ops/business/estimate',{id,scope:'Fictional scope for approval testing only.',exclusions:'No real services or binding transaction.',gst_rate:0});assert.equal(a.status,200,'publish A');
 const b=await owner('/api/ops/business/estimate',{id,scope:'Revised fictional scope for approval testing only.',exclusions:'No real services or binding transaction.',gst_rate:0});assert.equal(b.status,200,'publish B');
 const ta=a.data.url.split('#')[1],tb=b.data.url.split('#')[1];assert.equal((await review(ta)).status,404,'old version revoked');
 const read=await review(tb);assert.equal(read.status,200);assert(!JSON.stringify(read.data).includes('PRIVATE INTERNAL'));assert(!('token_hash' in read.data));assert(!('materials_cents' in read.data));
 assert.equal((await owner('/api/ops/business/invoice',{id,gst_rate:0})).status,409,'approval gates invoice');
 const decision=await review(tb,'accepted',{name:'Fictional Tester',consent:true});assert.equal(decision.status,200,'accept');assert.equal(decision.data.status,'accepted');
 assert.equal((await review(tb,'declined',{name:'Fictional Tester',consent:true})).data.status,'accepted','decision cannot flip');
 assert.equal((await owner('/api/ops/business',{...values,id,revenue_cents:35000})).status,200);
 const invoice=await owner('/api/ops/business/invoice',{id,gst_rate:0});assert.equal(invoice.status,200,'invoice');assert.equal(invoice.data.invoice.total_cents,25000,'approved snapshot remains price');
 assert.equal((await owner('/api/ops/business/invoice',{id,gst_rate:0})).data.invoice.id,invoice.data.invoice.id,'invoice idempotency');
 assert.equal((await other('/api/ops/business/estimate',{id,scope:'Foreign scope not allowed',gst_rate:0})).status,404);
 const entry={job_id:id,request_id:require('node:crypto').randomUUID(),kind:'time',category:'labour',amount_cents:4000,minutes:60,description:'Fictional labour',occurred_on:'2026-10-23'};
 assert.equal((await owner('/api/ops/business/entry',entry)).status,200);assert.equal((await owner('/api/ops/business/entry',entry)).status,200);
 const records=await owner('/api/ops/business/records');const entries=records.data.entries.filter(e=>e.private_job_id===id);assert.equal(entries.length,1,'expense idempotency');
 assert.equal((await other('/api/ops/business/entry', {...entry,request_id:require('node:crypto').randomUUID()})).status,404);
 assert.equal((await owner('/api/ops/business/entry/void',{id:entries[0].id})).status,200);
 const html=await owner('/dashboard/business');assert.equal(html.status,200);assert(html.text.includes('Estimates, costs'));
 console.log('PASS estimate revisions, private-note exclusion, approval gating, immutable decisions/prices, invoice idempotency, cost/time persistence and tenant/role isolation. No emails or payments.');
 }finally{await owner('/api/ops/business',{...values,id,status:'cancelled'})}
 const slot=new Date(Date.parse('2032-01-01T00:00:00Z')+Math.floor(Math.random()*1000000)*60000).toISOString(),ids=[];
 try{const one=await owner('/api/ops/business',{...values,title:'Calendar test A',status:'scheduled',scheduled_at:slot,duration_minutes:60});assert.equal(one.status,200);ids.push(one.data.id);const conflict=await owner('/api/ops/business',{...values,title:'Calendar test B',status:'scheduled',scheduled_at:slot,duration_minutes:60});assert.equal(conflict.status,409,'overlap rejected');console.log('PASS private calendar rejects overlapping appointments.');}finally{for(const id of ids)await owner('/api/ops/business',{...values,id,status:'cancelled'})}
})().catch(e=>{console.error(e.message);process.exitCode=1});
