import ResetPassword from '@/components/ops/ResetPassword';
export default async function Page({searchParams}:{searchParams:Promise<{verified?:string}>}){const params=await searchParams;return <ResetPassword recovery={params.verified==='1'}/> }
