'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Appbar() {
   const route = usePathname();
   // const [isLocal, setIsLocal] = useState(false);
   // const { apiBaseUrl, wsBaseUrl, setApiBaseUrl, setWsBaseUrl } = useApiStore();

   // const handleSwitchChange = useCallback(
   //    (checked: boolean) => {
   //       setIsLocal(checked);
   //       if (checked) {
   //          setApiBaseUrl(API_URL);
   //          setWsBaseUrl(WS_URL);
   //       } else {
   //          setApiBaseUrl(API_URL_BACKPACK);
   //          setWsBaseUrl(WS_URL_BACKPACK);
   //       }
   //       console.log('API URL:', apiBaseUrl);
   //       console.log('WS URL:', wsBaseUrl);
   //    },
   //    [setApiBaseUrl, setWsBaseUrl, apiBaseUrl, wsBaseUrl]
   // );

   return (
      <div className="relative flex h-14 w-full flex-row justify-between">
         <div className="flex items-center flex-row">
            <div className="text-xl font-bold pl-4 flex flex-col justify-center cursor-pointer text-white">
               <Link href="/">💼 Suitcase</Link>
            </div>
            <div
               className={`text-sm pt-1 flex flex-col justify-center pl-8 cursor-pointer ${
                  route.startsWith('/markets') ? 'text-white' : 'text-slate-500'
               }`}
            >
               <Link href="/markets">Markets</Link>
            </div>
            <div
               className={`text-sm pt-1 flex flex-col justify-center pl-8  ${
                  route.startsWith('/trade') ? 'text-white' : 'text-slate-500'
               }`}
            >
               Trade
            </div>
         </div>
         <div className="flex items-center pr-4">
            {/* <div className="flex items-center space-x-2">
               <Switch
                  id="local-backend"
                  checked={isLocal}
                  onCheckedChange={handleSwitchChange}
               />
               <label
                  htmlFor="local-backend"
                  className="text-sm text-zinc-400 cursor-pointer peer-checked:text-zinc-100 transition-colors"
               >
                  Backend
               </label>
            </div> */}
         </div>
      </div>
   );
}
