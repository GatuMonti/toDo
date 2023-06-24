// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.



/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener('load', function () {
  if (this.localStorage.getItem("token")) {

    /* ---------------- variables globales y llamado a funciones ---------------- */
    const btnCerrarSesion = document.querySelector("#closeApp");
    const usrInfo = document.querySelector(".user-info p");
    const formCrearTarea = document.querySelector("form");
    const tareasPendientes = document.querySelector(".tareas-pendientes")
    const tareasTerminadas = document.querySelector(".tareas-terminadas")
    const token = localStorage.getItem("token");
    obtenerNombreUsuario()
    consultarTareas()
    



    /* -------------------------------------------------------------------------- */
    /*                          FUNCIÓN 1 - Cerrar sesión                         */
    /* -------------------------------------------------------------------------- */

    btnCerrarSesion.addEventListener('click', () => {
      if (confirm("Esta seguro que quiere cerrar sesion")) {
        this.localStorage.clear();
        window.location.href = "./index.html";
      }
    })

    /* -------------------------------------------------------------------------- */
    /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
    /* -------------------------------------------------------------------------- */

    function obtenerNombreUsuario() {
      const settings = {
        method: 'GET',
        headers: {
          Authorization: `${token}`
        }
      }

      fetch("https://todo-api.ctd.academy/v1/users/getMe", settings)
        .then(res => res.json())
        .then(usuario => mostrarUsuario(usuario))
        .catch(e => console.error(e))
    };
    function mostrarUsuario(respuesta) {
      usrInfo.innerHTML = `<p>${respuesta.firstName} ${respuesta.lastName}</p>`
    }


    /* -------------------------------------------------------------------------- */
    /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
    /* -------------------------------------------------------------------------- */

    function consultarTareas() {
      const settings = {
        method: 'GET',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          Authorization: `${token}`
        }
      }

      fetch("https://todo-api.ctd.academy/v1/tasks", settings)
        .then(res => res.json())
        .then(tareas => {
          renderizarTareas(tareas);  
          botonesCambioEstado(tareas);
          botonBorrarTarea(tareas)        
        })
        .catch()
    };


    /* -------------------------------------------------------------------------- */
    /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
    /* -------------------------------------------------------------------------- */

    formCrearTarea.addEventListener('submit', function (event) {
      event.preventDefault();
      crearNuevaTarea();
    });

    function crearNuevaTarea() {
      const tarea = {
        "description": nuevaTarea.value,
        "completed": false
      }
      const settings = {
        method: 'POST',
        body: JSON.stringify(tarea),
        headers: {
          Authorization: `${token}`,
          'Content-type': 'application/json; charset=UTF-8',
        }
      }
      fetch("https://todo-api.ctd.academy/v1/tasks", settings)
        .then(res => res.json())
        .then(tarea => {
          consultarTareas();
          formCrearTarea.reset();
        })
        .catch()
    }

    /* -------------------------------------------------------------------------- */
    /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
    /* -------------------------------------------------------------------------- */
    function renderizarTareas(listado) {
      const cantidadFinalizadas = document.querySelector("#cantidad-finalizadas");
      let contador = 0;
      tareasTerminadas.innerHTML = "";
      tareasPendientes.innerHTML = "";
      listado.forEach(tarea => {
        if (tarea.completed) {
          contador++;
          tareasTerminadas.innerHTML += `<li class=tarea ><button class=cambios-estados id=${tarea.id} type="button"><span class=hecha><i class="fa-regular fa-circle-check"></i></span></button><div class="descripcion"><span class="nombre">${tarea.description}</span><button type="button" class="incompleta" id=BtnTareaIncompleta${tarea.id}><i class="fa-solid fa-rotate-left"></i></button><button type="button" class="borrar" id=btnTareaborrada${tarea.id}><i class="fa-regular fa-trash-can"></i></button></div></li>`
        } else tareasPendientes.innerHTML += `<li class=tarea ><button class=cambios-estados id=${tarea.id} type="button"><i class="fa-regular fa-circle"></i></button><div class="descripcion"><span class=nombre>${tarea.description}</span><span class=timestamp>${tarea.createdAt.split("T")[0].replaceAll('-', '/')}</span></span></div></li>`
      });
      cantidadFinalizadas.innerHTML = contador;      
    };

    /* -------------------------------------------------------------------------- */
    /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
    /* -------------------------------------------------------------------------- */
    function botonesCambioEstado(listado) {
      const btnCambioDeEstado = document.querySelectorAll(".cambios-estados");
      let tareaLocal = "";
      btnCambioDeEstado.forEach(boton => {
        boton.addEventListener("click", () => {
          listado.forEach(tarea => tarea.id == boton.id ? tareaLocal = tarea : "")
          const tarea = { "completed": tareaLocal.completed ? false : true }

          const settings = {
            method: 'PUT',
            body: JSON.stringify(tarea),
            headers: {
              Authorization: `${token}`,
              Id: tareaLocal.id,
              'Content-type': 'application/json; charset=UTF-8',
            }
          }
          fetch("https://todo-api.ctd.academy/v1/tasks/" + tareaLocal.id, settings)
            .then(res => res.json())
            .then(tarea => {              
              consultarTareas()})
        });
      });
    };


    




    /* -------------------------------------------------------------------------- */
    /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
    /* -------------------------------------------------------------------------- */
    function botonBorrarTarea(listado) {
      const btnBorrarTarea = document.querySelectorAll(".borrar")
      btnBorrarTarea.forEach(boton => {
        boton.addEventListener('click', () => {
          listado.forEach(tarea => {
            if(tarea.id == boton.id.split(/[A-Za-z]+/).join("")){              
              eliminarTareaDelete(listado, tarea.id);  
              mostrarModal();            
            }
          })            
        })
      })
    }

    function eliminarTareaDelete(listado, tareaId) {      
      const setting = {
        method: 'DELETE',
        headers: {
          Authorization: `${token}`,
          Id: tareaId,
          'Content-type': 'application/json; charset=UTF-8',
        }
      }

      fetch("https://todo-api.ctd.academy/v1/tasks/" + tareaId, setting)
        .then(res => res.json())
        .then(respuesta => {  
          console.log("delente");                           
          consultarTareas()
          console.log("renderizo");
          })
    }

    function mostrarModal(){            
      formCrearTarea.innerHTML += `<div id="ventanaModal" class="modal">
      <div class="modal-content">          
          <h2>TAREA ELIMINADA</h2>
          <p>se elimino la tarea seleccionada</p>          
      </div>
    </div>`
    
    const modal = document.querySelector("#ventanaModal");  
    // Hace referencia al elemento <span> que tiene la X que cierra la ventana
    setTimeout(() => {
      modal.remove();      
    }, 2000);    
    }

    
  }else{
    alert("DEBES ESTAR LOGUEADO")
    location.replace("./index.html")
  }


});