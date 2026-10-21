import {NextRequest,NextResponse} from 'next/server';
import {createServerSupabaseClient} from '@/lib/supabase/server';
export async function GET(req:NextRequest){const code=req.nextUrl.searchParams.get('code');if(code){const client=await createServerSupabaseClient();const {error}=await client.auth.exchangeCodeForSession(code);if(!error)return NextResponse.redirect(new URL(req.nextUrl.searchParams.get('flow')==='recovery'?'/reset-password?verified=1':'/apply',req.url));}return NextResponse.redirect(new URL('/apply?verification=retry',req.url));}
