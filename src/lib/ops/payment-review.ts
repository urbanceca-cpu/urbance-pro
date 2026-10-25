import 'server-only';
import {db, identity, OpsError, check} from './server';

export async function paymentAdminContext(){
  const user=await identity(),admin=db();
  const {data:profile,error}=await admin.from('profiles').select('role,email,preferences').eq('id',user.id).single();
  if(error||!profile||!['admin','super_admin'].includes(profile.role))throw new OpsError('Administrator access required.',403);
  return {user,admin,profile};
}
export type PaymentAdminContext=Awaited<ReturnType<typeof paymentAdminContext>>;
export async function paymentReviewData(ctx:PaymentAdminContext){
  const [records,count]=await Promise.all([
    ctx.admin.from('ops_payment_settlements').select('session_id,booking_id,amount_cents,currency,outcome,reason,created_at,bookings(booking_ref,service_name)').order('created_at',{ascending:false}).limit(200),
    ctx.admin.from('ops_payment_settlements').select('session_id',{count:'exact',head:true}).eq('outcome','review'),
  ]);
  check(records);check(count);
  return {records:records.data||[],reviewCount:count.count||0,email:ctx.profile.email||'',alertsEnabled:ctx.profile.preferences?.ops_notifications?.payments===true};
}
export async function savePaymentAlerts(ctx:PaymentAdminContext,enabled:boolean){
  if(enabled&&!ctx.profile.email)throw new OpsError('Your verified profile email is missing. Contact support before enabling alerts.',409);
  const prefs=ctx.profile.preferences||{};
  check(await ctx.admin.from('profiles').update({preferences:{...prefs,ops_notifications:{...prefs.ops_notifications,payments:enabled}}}).eq('id',ctx.user.id));
  check(await ctx.admin.from('ops_audit').insert({actor_id:ctx.user.id,action:'admin.payment_alerts.updated',entity:ctx.user.id,details:{enabled}}));
  return {success:true,alertsEnabled:enabled};
}
