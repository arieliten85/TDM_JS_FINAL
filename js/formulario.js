//ARIABLES
const email = document.querySelector('#email')
const asunto = document.querySelector('#asunto')
const mensaje = document.querySelector('#mensaje')

const btnEnviar = document.querySelector('#enviar')
const formulario = document.querySelector('#enviar-mail')

let datos = []

//EVENTOS





//Exprecion regular para validar Email
const er = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;





eventos()

function eventos() {
    //Cuando la pagina inicia se aplica esto:
    document.addEventListener("DOMContentLoaded", IniciandoApp)

    //Campos del formulario 
    email.addEventListener("blur", validarFormulario);
    asunto.addEventListener("blur", validarFormulario);
    mensaje.addEventListener("blur", validarFormulario);

    //Enaviar email
    formulario.addEventListener('submit', enviarEmail);



    //Guardar Info al LocalStorage
    formulario.addEventListener("submit", obtenerInfo);


}
//FUNCIONES

//Boton Bloqueado de enviar
function IniciandoApp() {
    btnEnviar.disabled = true;
    btnEnviar.classList.add('cursor-not-allowed', 'opacity-50')

    // formulario.reset()
}

function obtenerInfo(e) {
    e.preventDefault();

    const email = document.querySelector('#email').value
    const asunto = document.querySelector('#asunto').value
    const mensaje = document.querySelector('#mensaje').value

    //Objeto
    const infoCorreo = {
        id: Date.now(),
        correo: email,
        causa: asunto,
        texto: mensaje
    }

    datos = [infoCorreo];



}

//Campos valiando con Error si no estan completos
function validarFormulario(e) {

    if (e.target.value.length > 0) {
        //Elimina los errores
        const error = document.querySelector('p.claseInventada');
        if (error) {
            error.remove();
        }
        e.target.classList.remove('border', 'border-red-500');
        e.target.classList.add('border', 'border-green-500');
    } else {
        e.target.classList.remove('border', 'border-green-500');
        e.target.classList.add('border', 'border-red-500');

        mostarError("Todo los campos son obligatorios");
    }


    if (e.target.type === "email") {

        if (er.test(e.target.value)) {
            //Elimina los errores
            const error = document.querySelector('p.claseInventada');
            if (error) {
                error.remove();
            }

            e.target.classList.remove('border', 'border-red-500');
            e.target.classList.add('border', 'border-green-500');
        } else {
            e.target.classList.remove('border', 'border-green-500');
            e.target.classList.add('border', 'border-red-500');
            mostarError("Email no valido");
        }

    }


    if (er.test(email.value) && asunto.value !== "" && mensaje.value !== "") {
        btnEnviar.disabled = false;
        btnEnviar.classList.remove("cursor-not-allowed", "opacity-50");
    }
}

function enviarEmail(e) {
    e.preventDefault();
    //Mosatrar el spinner
    const spinner = document.querySelector('#spinner');
    spinner.style.display = 'flex';

    //Despues de 3s ocultar el spinner y mostrar el mensaje
    setTimeout(() => {
        spinner.style.display = 'none';


        //Mensaje de que se envio Correctamente
        const parrafo = document.createElement("p");
        parrafo.textContent = "El mensaje se envio correctamente"
        parrafo.classList.add("text-center", "p-2", "text-white", "font-bold", "uppercase","bg-green-500");

        formulario.appendChild(parrafo, spinner);

        // parrafo.remove()
        formulario.reset()
        IniciandoApp()

        email.classList.remove('border', 'border-green-500')
        asunto.classList.remove('border', 'border-green-500')
        mensaje.classList.remove('border', 'border-green-500')


        agregarLocalStorage()


        setTimeout(() => {
            $(parrafo).fadeOut()

        }, 3000);

    }, 3000);



}

function mostarError(mensaje) {

    const mensajeDeError = document.createElement("p");
    mensajeDeError.textContent = mensaje;
    mensajeDeError.classList.add("border", "border-red-500", "background-red-100", "text-red-500", "p-3", "mt-5", "text-center", "claseInventada");


    const errores = document.querySelectorAll(".claseInventada");
    // Si la cantidad de veces que tenga el nombre de la clase "claseInvetada" es 0
    if (errores.length === 0) {

        // te Muestras los estilos de ERROR
        formulario.appendChild(mensajeDeError);
    }

    //  ELSE: De lo contrario no se ejecuta la funcion mensajeDeError y no muestra nada

}

//Agrego la info al localStorage
function agregarLocalStorage() {
    localStorage.setItem("Correos", JSON.stringify(datos))
}






