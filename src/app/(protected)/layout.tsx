import {redirect} from 'next/navigation';
import {identity} from '@/lib/ops/server';
export const dynamic='force-dynamic';
export default async function Layout({children}:{children:React.ReactNode}){try{await identity()}catch{redirect('/login')}return <>{children}</>}
