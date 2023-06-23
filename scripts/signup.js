window.addEventListener('load', function () {
    /* ---------------------- obtenemos variables globales ---------------------- */
    const form = document.querySelector("form")
    const inputNombre = document.querySelector("#inputNombre");
    const inputApellido = document.querySelector("#inputApellido");
    const inputEmail = document.querySelector("#inputEmail");
    const inputPassword = document.querySelector("#inputPassword");
    const inputPasswordRepeat = document.querySelector("#inputPasswordRepetida");   
    
    

    

    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const settings = configuration();
        console.log(settings);
        realizarRegister(settings);          
    });

    const configuration = () =>{
        
        const datosUsuario ={
            firstName: validarCampo(validarTexto(inputNombre.value),inputNombre),   
            lastName: validarCampo(validarTexto(inputApellido.value),inputApellido),
            email: validarCampo(validarEmail(inputEmail.value),inputEmail),
            password: compararContrasenias(inputPassword.value,inputPasswordRepeat.value)?validarCampo(validarContrasenia(inputPassword.value),inputPassword) : insertarErrores(["Contraseñas no coinciden"],inputPassword)
        } 
        console.log(datosUsuario);
        const configuration ={
            method: 'POST',
            body: JSON.stringify(datosUsuario),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        }

        return configuration;
    }

    
    
    

    /* -------------------------------------------------------------------------- */
    /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarRegister(settings) {
        fetch("https://todo-api.ctd.academy/v1/users",settings)
        .then(respuesta => {
            if(respuesta.ok) return respuesta.json();
            else throw respuesta;
            })
        .then(token => guardarToken(token))
        .catch(e=>errorLogin(e)) 




    };
    function guardarToken(token){           
        localStorage.clear();    
        mostrarMsjForm(`<div id="errorLogin" style='color:green; text-align:center;'>Registro Exitoso</div>`)
        localStorage.setItem(inputEmail.value,token.jwt);           
    }

    function errorLogin(e){        
        return e.json()        
            .then(error =>{               
                mostrarMsjForm(`<div id="errorLogin" style='color:white; text-align:center;'>${error}</div>`)                
            })    
    }

    
    function mostrarMsjForm(string){
        const divError = document.querySelector("#divError");
        if(divError) divError.remove();                        
        const divTemplate = document.createElement("div");
        divTemplate.setAttribute("id","divError");
        divTemplate.innerHTML =string; 
        form.appendChild(divTemplate);      
    }




    

});