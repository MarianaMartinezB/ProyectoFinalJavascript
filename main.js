///Cargar elementos JSON
let productos = [];

fetch("/productos.json")
  .then((response) => response.json())
  .then((data) => {
    productos = data;
    cargarProductos(productos);
  })
  .catch((error) => console.error("No es posible cargar productos"));

///ELEMENTOS DOM
const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");

///FUNCIONES

function cargarProductos(productosElegidos) {
  productosElegidos.forEach((producto) => {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `
            <div class="gray border">
            <img class="producto-imagen" src="${producto.imagen}">
            <div class="producto-detalles">
            <div class="card-body id-libro"> 
                <h3 class="card-title text-center fs-6 fw-bold lh-md nombre-libro producto-titulo">${producto.titulo}</h3>
                <p class="precio-libro text-center producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>
        `;

    contenedorProductos.append(div);
  });
  actualizarBotonesAgregar();
}

function actualizarBotonesAgregar() {
  botonesAgregar = document.querySelectorAll(".producto-agregar");

  botonesAgregar.forEach((boton) => {
    boton.addEventListener("click", agregarAlCarrito);
  });
}

let productosEnCarrito;

let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
  productosEnCarrito = JSON.parse(productosEnCarritoLS);
  actualizarNumerito();
} else {
  productosEnCarrito = [];
}

function agregarAlCarrito(e) {
  const idBoton = e.currentTarget.id;
  const productoAgregado = productos.find(
    (producto) => producto.id === idBoton
  );

  if (productosEnCarrito.some((producto) => producto.id === idBoton)) {
    const index = productosEnCarrito.findIndex(
      (producto) => producto.id === idBoton
    );
    productosEnCarrito[index].cantidad++;
  } else {
    productoAgregado.cantidad = 1;
    productosEnCarrito.push(productoAgregado);
  }

  actualizarNumerito();
  localStorage.setItem(
    "productos-en-carrito",
    JSON.stringify(productosEnCarrito)
  );
}

function actualizarNumerito() {
  productosEnCarrito != null
    ? (() => {
        let nuevoNumerito = productosEnCarrito.reduce(
          (acc, producto) => acc + producto.cantidad,
          0
        );
        numerito.innerText = nuevoNumerito;
      })()
    : (() => {
        productosEnCarrito = [];
        numerito.innerText = 0;
      })();
}
