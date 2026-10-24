const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript');
function harness(role='admin'){
 const writes=[];const profile={role,email:'admin@example.invalid',preferences:{theme:'light',ops_notifications:{digest:false}}};
 const admin={from(table){return {select(){return this},update(value){writes.push({table,value});return this},insert(value){writes.push({table,value});return this},eq(){return this},async single(){return {data:profile,error:null}},then(resolve){return Promise.resolve({error:null}).then(resolve)}}}};
 class OpsError extends Error{constructor(message,status){super(message);this.status=status}}
 const server={identity:async()=>({id:'verified-admin'}),db:()=>admin,OpsError,check:r=>{if(r.error)throw r.error;return r.data}};
 const mod={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/ops/payment-review.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{module:mod,exports:mod.exports,require:n=>n==='./server'?server:{},Promise,Error});
 return {api:mod.exports,writes,profile};
}
test('payment administration rejects provider and customer roles',async()=>{for(const role of ['provider','customer','moderator']){const h=harness(role);await assert.rejects(h.api.paymentAdminContext(),e=>e.status===403);assert.equal(h.writes.length,0);}});
test('payment alert preference preserves unrelated settings and uses the verified admin identity',async()=>{const h=harness();const ctx=await h.api.paymentAdminContext();await h.api.savePaymentAlerts(ctx,true);const p=h.writes.find(x=>x.table==='profiles').value.preferences;assert.equal(p.theme,'light');assert.equal(p.ops_notifications.digest,false);assert.equal(p.ops_notifications.payments,true);assert.equal(h.writes.find(x=>x.table==='ops_audit').value.actor_id,'verified-admin');});
test('alerts cannot be enabled without the verified profile email',async()=>{const h=harness();h.profile.email=null;const ctx=await h.api.paymentAdminContext();await assert.rejects(h.api.savePaymentAlerts(ctx,true),e=>e.status===409);assert.equal(h.writes.length,0);});
