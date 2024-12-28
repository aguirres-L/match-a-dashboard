export default function RefreshMadre({typeUser, isSpinningMadre }){
    // typeUser puede ser 1 o 2 , 1 es para niñera o at y 2 es para madres o acompañados 
    let colorRefesh = '';
    if(typeUser===1) colorRefesh ='blue'
    if(typeUser===2) colorRefesh = 'red'
        return(
            <svg class={`w-6 h-6 text-gray-800 dark:text-${colorRefesh}-300  ${
                isSpinningMadre ? "animate-spin" : ""
          } `}
            aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"/>
          </svg>
          
        )
    }