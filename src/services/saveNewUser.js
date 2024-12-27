import { addDocumentFirebase } from "./data-firebase";


export default async function saveNewUser( emailUser, datosNewUser ){
    
    try {
      console.log(emailUser);
      console.log(datosNewUser);
      await addDocumentFirebase(emailUser,datosNewUser)
    } catch (error) {
        console.error(error);
        throw error;
    }
    
}