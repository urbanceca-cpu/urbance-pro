import {redirect} from 'next/navigation';
import {createServerSupabaseClient} from '@/lib/supabase/server';
export const dynamic='force-dynamic';
export default async function Layout({children}:{children:React.ReactNode}){const client=await createServerSupabaseClient();const {data:{user}}=await client.auth.getUser();if(!user)redirect('/login');return <>{children}</>}
