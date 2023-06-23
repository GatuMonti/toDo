/* ---------------------------------- texto --------------------------------- */
function validarTexto(texto) {    
    let erroresTexto=[];
    if(texto == null)erroresTexto.push("No puede ser nulo");
    else if(texto.length <= 3)erroresTexto.push("Debe tener al menos tres caracteres");
    if(!(/^[a-zA-Z\s]+$/).test(texto))erroresTexto.push("Debe contener solo letras");
    return erroresTexto    
}

function normalizarTexto(texto) {
    texto = texto.toLowerCase();
    texto = texto.trim();
    return texto;
}

/* ---------------------------------- email --------------------------------- */
function validarEmail(email) {
    let erroresEmail =[];
    if(email==null)erroresEmail.push("No puede ser nulo");
    else if(email.length<3)erroresEmail.push("Debe tener al menos tres caracteres");
    if(!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(email))erroresEmail.push("Formato de mail incorrecto");
    return erroresEmail;
}

function normalizarEmail(email) {
    email = email.trim();    
    email = email.toLowerCase();
    return email
}

/* -------------------------------- password -------------------------------- */
function validarContrasenia(contrasenia, contrasenia_2) {
    const erroresPass=[];    
    if(contrasenia == null)erroresPass.push("No puede ser nulo");
    else if(contrasenia.length<6)erroresPass.push("Debe tener al menos 6 caracteres");
    else if(contrasenia.length>20)erroresPass.push("Debe tener como maximo 10 caracteres");
    if(!(/[A-Z]/).test(contrasenia))erroresPass.push("Debe contener al menos una letra mayuscula");
    if(!(/^\S*$/).test(contrasenia))erroresPass.push("No debe contener caracteres en blanco");
    if(!(/\d/).test(contrasenia))erroresPass.push("Debe contener por lo menos un numero");
    return erroresPass;
}

function compararContrasenias(contrasenia_1, contrasenia_2) {
    return (contrasenia_1===contrasenia_2)
}


/*------------------------------- Insertar Errores -----------------------------------*/
const validarCampo =(validacion,campo)=>{                            
    if (validacion.length==0) {
        borrarErrores(campo);
        campo.style.marginBottom="1rem";
        return campo.value;
    }
    else insertarErrores(validacion,campo);
}

const borrarErrores = (campo) =>{    
    const contenedorErrores = document.querySelector("#contenedor"+campo.id);    
    if(contenedorErrores)contenedorErrores.remove();  
} 

const insertarErrores = (arregloErrores,campo) =>{ 
    borrarErrores(campo)           
    const errores = arregloErrores.map(e=>`<p style="color:red"><small>*${e}</small></p>`).join("");  
    campo.style.marginBottom="0rem";
    divCampo = document.createElement("div");                
    divCampo.innerHTML=errores;
    divCampo.style.marginBottom="1rem";
    divCampo.setAttribute("id","contenedor"+campo.id);    
    campo.insertAdjacentElement("afterend", divCampo);
}
