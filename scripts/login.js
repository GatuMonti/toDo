window.addEventListener('load', function () {
    /* ---------------------- obtenemos variables globales ---------------------- */
    const form = document.querySelector("form")
    const inputEmail = document.querySelector("#inputEmail")
    const inputPassword = document.querySelector("#inputPassword")
    const btnSubmin = document.querySelector("form button")




    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener('submit', function (event) {
        event.preventDefault(); 
        const settings = capturarDatos();                 
        realizarLogin(settings);
        
    });

    function capturarDatos(){
        const usuarioLogin = {
            email: inputEmail.value,
            password: inputPassword.value 
        }      
        
        
        const settings = {
            method: 'POST',
            body: JSON.stringify(usuarioLogin),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }          
        }
        return settings
    }
    



    /* -------------------------------------------------------------------------- */
    /*                     FUNCIÓN 2: Realizar el login [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarLogin(settings) {      
        
        fetch("https://todo-api.ctd.academy/v1/users/login",settings)
            .then(respuesta => {
                if(respuesta.ok) return respuesta.json();
                else throw respuesta;
                })
            .then(token => {
                console.log("Entro al try");
                guardarToken(token);
                location.replace("./mis-tareas.html") ;
            })
            .catch(e=>{
                console.log(e);
                errorLogin(e)})        
    };


    //Funciones ejecutadas en el fetch -------------------------------------------------
    function guardarToken(token){            
        mostrarMsjLogin(`<div id="errorLogin" style='color:green; text-align:center;'>Login Exitoso</div>`)       
        
        localStorage.setItem("token",token.jwt);        
    }

    function errorLogin(e){        
        return e.json()        
            .then(error =>{               
                mostrarMsjLogin(`<div id="errorLogin" style='color:white; text-align:center;'>${error}</div>`)                
            }) 
            .catch()  
    }

    function mostrarMsjLogin(string){
        const divError = document.querySelector("#divError");
        if(divError) divError.remove();                        
        const divTemplate = document.createElement("div");
        divTemplate.setAttribute("id","divError");
        divTemplate.innerHTML =string; 
        form.appendChild(divTemplate);      
    }
});