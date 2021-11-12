
const BotonCarrito = document.querySelectorAll('#agregar-carrito');
let tbody = document.querySelector('.tbody');
let carrito = [];


//EVENTOS
$('.agregar-carrito').click(obtenerInfoCarrito)
$('.categoriaItem').click(mustraProductoCategoria)

$(document).ready(mostrarProductosDestacados)
$(document).ready(infoJason)






// RECIBIR INFO DEL JASON
function infoJason() {
    // OBTIENE INFORMACION DEL .JSON

    const url = '../apis.json/productos.json'
    fetch(url)
        .then(data => data.json())
        .then(data => productos = data.productos)
}
//VER CARDS EN EL HTML PRODUCTOS DESTACADOS
function mostrarProductosDestacados() {

    // El div sucursales comienza vacio


    const url = '../apis.json/productos.json'
    fetch(url)
        .then(data => data.json())
        .then(data => {
            productos = data.productos

            // Agrego mi Json a la funcion
            $.get('../apis.json/prodDest.json', function (data) {



                // Recorro mi Json
                $.each(productos, function (index, item) {
                    //  Inyecto en e div las propiedades del Json  
                    $('#divContenedor').html($('#divContenedor').html() + `

            <div class="card  productoItem"  categoria="${item.categoria}">
                <div class="card-item_img">
                    <img class="imagen" src=" ${item.imagen} " alt="...">
                </div>

                <div class="card-item_info">
                    <h3 class="card-title pt-5"> ${item.titulo} </h3>
                    <p class="text-primary">Precio: <span class="precio">$ ${item.precio}</span></p>
                    <button class="btn-carrito  agregar-carrito " id="agregar-carrito" data-id="${item.id}">Añadir a Carrito</button>
                </div>
            </div>


            `);

                    $('.agregar-carrito').click(obtenerInfoCarrito)

                })
            })

        })

}

//VER CARDS AL DAR CLICL EN LAS CATEGORIAS
function mustraProductoCategoria(e) {


    e.preventDefault();

    // LIMPIA EL CONTENEDOR
    $('#divContenedor').html('');

    // SI AL QUE DIMOS CLICK CON TIENE EL ATRIBUTO "CATEGORIA"
    let nombreCategoria = $(this).attr('categoria');
    // RECORRE CADA PRODUCTO 
    $.each(productos, function (index, item) {

        if (item.categoria.indexOf(nombreCategoria) !== -1) {

            $('#divContenedor').html($('#divContenedor').html() + `

            <div class="card  productoItem"  categoria="${item.categoria}">
                <div class="card-item_img">
                    <img class="imagen" src=" ${item.imagen} " alt="...">
                    </div>

                    <div class="card-item_info">
                        <h3 class="card-title pt-5"> ${item.titulo} </h3>
                        <p class="text-primary">Precio: <span class="precio">$ ${item.precio}</span></p>
                        <button class="btn-carrito  agregar-carrito " id="agregar-carrito" data-id="${item.id}">Añadir a Carrito</button>
                    </div>
                </div>
            `);

            $('.agregar-carrito').click(obtenerInfoCarrito)

        }
    });


}

//CARRITO
function obtenerInfoCarrito(e) {
    let boton = e.target;
    let item = boton.closest('.card');
    let itemTitulo = item.querySelector('.card-title').textContent;
    let itemPrecio = item.querySelector('.precio').textContent;
    let itemImagen = item.querySelector('.imagen').src;
    let itemId = item.querySelector('.btn-carrito').getAttribute('data-id');

    // Creo Un Objeto con la informacion del carrito

    const newCarrito = {
        titulo: itemTitulo,
        precio: itemPrecio,
        imagen: itemImagen,
        id: itemId,
        cantidad: 1

    }

    agregoInfoCarrito(newCarrito)
}

function agregoInfoCarrito(newCarrito) {



    const inputElemento = tbody.getElementsByClassName('input__elemento');
    //Aumenta las cantidades y no repite el producto

    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].titulo.trim() === newCarrito.titulo.trim()) {
            carrito[i].cantidad++;

            const inputValue = inputElemento[i]
            inputValue.value++;
            TotalCarrito()
            return null;
        }
    }

    carrito.push(newCarrito);

    carritoHTML()
}
//Muestra eñ carrito en el HTML
function carritoHTML() {

    tbody.innerHTML = "";

    carrito.map(item => {
        const tr = document.createElement('tr');
        tr.classList.add('itemCarrito');
        tr.innerHTML = `
        
        <td class="table__productos"><img src=${item.imagen}  style="width: 5rem"></td>
        <td> <h6 class="titulo">${item.titulo}</h6></td>
        <td class="table__price">  <p> ${item.precio} </p> </td>
        <td class="table__cantidad">  <input type="number" min="1" value=${item.cantidad} class="input__elemento"> </td>
        <td class="table__cantidad"> <button class="btn-delete  btn btn-danger" data-id= ${item.id} >x</button> </td>
        
        `;

        tbody.appendChild(tr);

        tr.querySelector(".btn-delete").addEventListener('click', borrarItemCarrito)
        tr.querySelector(".input__elemento").addEventListener('change', sumarCantidad)

    });
    TotalCarrito()
}

function TotalCarrito() {
    let total = 0;
    const itemCartTotal = document.querySelector('.itemCartTotal');
    carrito.forEach((item) => {
        const precio = Number(item.precio.replace("$", ''))
        total = total + precio * item.cantidad;
    });
    itemCartTotal.innerHTML = ` Total $${total}`;
    addLocalStorage()
}
function borrarItemCarrito(e) {

    if (e.target.classList.contains('btn-delete')) {
        const productoId = e.target.getAttribute('data-id');

        carrito = carrito.filter(item => item.id !== productoId);

        carritoHTML()

    }

}

function sumarCantidad(e) {

    const sumaInput = e.target;
    const tr = sumaInput.closest('.itemCarrito')
    const titulo = tr.querySelector('.titulo').textContent;

    carrito.forEach(item => {
        if (item.titulo.trim() === titulo) {
            sumaInput.value < 1 ? (sumaInput.value = 1) : sumaInput.value;
            item.cantidad = sumaInput.value;

            TotalCarrito()

        }
    });
    e.stopPropagation()
}

function addLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito))
}
window.onload = function () {
    const storage = JSON.parse(localStorage.getItem('carrito'));
    if (storage) {
        carrito = storage;
        carritoHTML()
    }
}






const comprarCarrito = document.querySelector('.btn-comprar').addEventListener("click", comprar)
const mensajeCompra = document.querySelector('.mensajeCompra')



function comprar() {
    const mensaje = document.createElement("p");

    mensaje.textContent = "Su compra se realizo con Exitos!"
    mensaje.classList.add("text-center", "p-1", "text-white", "font-bold", "uppercase", "bg-pink-500", "mt-5");



    // mensaje.classList.add("text-center");
    mensajeCompra.appendChild(mensaje);

    tbody.innerHTML = "";


    setTimeout(() => {
        $(mensaje).fadeOut()

    }, 3000);
}
