import type {Metadata} from 'next';
import EstimatePortal from '@/components/ops/EstimatePortal';
export const metadata:Metadata={title:'Your private estimate · Urbance',robots:{index:false,follow:false},referrer:'no-referrer'};
export default function Page(){return <EstimatePortal/>}
