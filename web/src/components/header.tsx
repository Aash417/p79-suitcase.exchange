export default function Header() {
   return (
      <div className="relative flex h-14 w-full flex-col justify-center bg-amber-300">
         <div className="grid grid-cols-3">
            <div className="flex items-center flex-row">
               <a
                  className="items-center text-center font-semibold rounded-lg focus:ring-blue-200 focus:none focus:outline-hidden hover:opacity-90 disabled:opacity-80 disabled:hover:opacity-80 flex flex-col justify-center bg-transparent h-8 text-sm p-0 xs:mr-6 mr-3 ml-4 shrink-0 sm:ml-[21px]"
                  href="/"
               ></a>
            </div>

            <div className="hidden justify-self-center xl:inline-flex">
               <div className="flex items-center justify-between flex-row bg-base-background-l2 focus-within:ring-accent-blue w-[340px] flex-1 cursor-pointer overflow-hidden rounded-xl px-1 ring-0 focus-within:ring-2">
                  <div className="flex items-center flex-row flex-1">
                     <input
                        aria-label="Search markets"
                        type="text"
                        aria-autocomplete="list"
                        autocomplete="off"
                        placeholder="Search markets"
                        autocorrect="off"
                        spellcheck="false"
                        tabIndex="0"
                        id="react-aria-:R2f96H3:"
                        role="combobox"
                        aria-expanded="false"
                        className="bg-base-background-l2 text-high-emphasis placeholder-low-emphasis h-8 w-full border-0 p-0 text-sm font-normal outline-hidden focus:ring-0"
                        value=""
                     />
                  </div>
                  <div className="border-base-border-med bg-base-background-l2 text-base-icon mx-2 flex h-6 w-6 items-center justify-center rounded-sm border text-sm select-none">
                     /
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
