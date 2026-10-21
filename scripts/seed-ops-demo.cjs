// Creates only explicitly labelled demo accounts and jobs. Never sends email.
const {createClient}=require('@supabase/supabase-js');const fs=require('node:fs');const crypto=require('node:crypto');
const admin=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
const target='.ops-demo.local.json';
const existing=fs.existsSync(target)?JSON.parse(fs.readFileSync(target,'utf8')):{accounts:{},jobs:{}};
const run=async p=>{const r=await p;if(r.error)throw Error(r.error.message);return r.data;};
async function account(key,email,name){if(existing.accounts[key]){await admin.auth.admin.updateUserById(existing.accounts[key].id,{app_metadata:{ops_demo:true}});return existing.accounts[key];}const password='Demo-'+crypto.randomBytes(18).toString('base64url')+'!';const result=await admin.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{full_name:name},app_metadata:{ops_demo:true}});if(result.error)throw result.error;const value={email,password,id:result.data.user.id,name};existing.accounts[key]=value;fs.writeFileSync(target,JSON.stringify(existing,null,2),{mode:0o600});return value;}
async function business(account,name){
 await run(admin.from('provider_applications').upsert({user_id:account.id,status:'approved',submitted_at:new Date().toISOString(),basic_info:{legal_name:account.name,full_legal_name:account.name,email:account.email,demo_fixture:true},services_coverage:{categories:['cleaning','handyman'],primary_category:'cleaning'},step_completed:{demo_fixture:true}},{onConflict:'user_id'}));
 const b=await run(admin.from('ops_businesses').upsert({owner_user_id:account.id,display_name:name,mode:'team',city:'Vancouver',address:'DEMO ONLY — fictional Vancouver address',phone:'6045550100',categories:['cleaning','handyman'],max_travel_km:35,online:true,last_seen_at:new Date().toISOString(),is_demo:true},{onConflict:'owner_user_id'}).select().single());
 await run(admin.from('ops_members').upsert({business_id:b.id,owner_user_id:account.id,user_id:account.id,name:account.name,email:account.email,role:'owner'},{onConflict:'user_id'}));return b;
}
(async()=>{
 const owner=await account('owner','provider.owner.demo@urbance.test','Jordan Demo'),tech=await account('technician','provider.technician.demo@urbance.test','Alex Demo'),dispatcher=await account('dispatcher','provider.dispatch.demo@urbance.test','Taylor Demo'),other=await account('competitor','provider.other.demo@urbance.test','Other Demo'),draft=await account('draft','provider.draft.demo@urbance.test','Draft Demo');
 await account('invitee','provider.invited.demo@urbance.test','Invited Demo');await account('customer','customer.demo@urbance.test','Customer Demo');
 const b=await business(owner,'Northline Home Care · Demo');const b2=await business(other,'Harbour Home Care · Demo');existing.business=b.id;existing.other_business=b2.id;
 for(const [member,role]of [[tech,'technician'],[dispatcher,'dispatcher']])await run(admin.from('ops_members').upsert({business_id:b.id,owner_user_id:owner.id,user_id:member.id,name:member.name,email:member.email,role},{onConflict:'user_id'}));
 await run(admin.from('provider_applications').upsert({user_id:draft.id,status:'draft',basic_info:{full_legal_name:draft.name,demo_fixture:true}},{onConflict:'user_id'}));
 const day=new Date(Date.now()+7*86400000).toISOString().slice(0,10);
 for(const [key,service,price]of [['offer','cleaning',200],['second_offer','handyman',175],['race','cleaning',150],['fresh_cleaning','cleaning',249],['fresh_handyman','handyman',149]]){
  if(existing.jobs[key])continue;
  const booking=await run(admin.from('bookings').insert({user_id:existing.accounts.customer.id,booking_ref:'URB-DEMO-'+crypto.randomBytes(4).toString('hex').toUpperCase(),service,service_name:service==='cleaning'?'Home cleaning · Demo':'Handyman help · Demo',status:'confirmed',scheduled_date:day,scheduled_time:'10:00 AM',address:'DEMO ONLY — fictional Vancouver home',subtotal:price,tax:0,total:price,notes:'This is an isolated demo. Do not travel to this location or contact any real customer.'}).select().single());
  const job=await run(admin.from('jobs').insert({booking_id:booking.id,booking_ref:booking.booking_ref,user_id:existing.accounts.customer.id,service_type:service,service_name:booking.service_name,address:booking.address,service_city:'Vancouver',scheduled_date:day,scheduled_time:'10:00 AM',price,payout_amount:price,payment_status:'paid',job_status:'pending',status:'accepted',customer_name:'Fictional customer',customer_email:existing.accounts.customer.email,customer_phone:'6045550199',is_demo:true,notes:booking.notes}).select().single());
  existing.jobs[key]=job.id;existing.jobs[key+'_booking']=booking.id;
  for(const business of key==='race'?[b,b2]:[b])await run(admin.from('ops_dispatch_offers').insert({job_id:job.id,business_id:business.id,wave:'local',expires_at:new Date(Date.now()+14*86400000).toISOString()}));
 }
 existing.created_at=existing.created_at||new Date().toISOString();fs.writeFileSync(target,JSON.stringify(existing,null,2),{mode:0o600});console.log('Demo business, roles, three fictional jobs and a draft applicant are ready. Credentials saved privately.');
})().catch(e=>{console.error(e.message);process.exit(1);});
