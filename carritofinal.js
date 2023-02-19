let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
let botonesIncrementar = document.querySelectorAll(
  ".carrito-producto-incrementar"
);
let botonesDecrementar = document.querySelectorAll(
  ".carrito-producto-decrementar"
);
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");
const totalCarrito = document.getElementById("total-price");

function cargarProductosCarrito() {
  if (productosEnCarrito && productosEnCarrito.length > 0) {
    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.remove("disabled");
    contenedorCarritoAcciones.classList.remove("disabled");
    contenedorCarritoProductos.innerHTML = "";

    productosEnCarrito.forEach((producto) => {
      const div = document.createElement("div");
      div.classList.add("carrito-producto");
      div.innerHTML = `
                <img class="carrito-producto-imagen" src="${
                  producto.imagen
                }" alt="${producto.titulo}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                    <button class="carrito-producto-incrementar gray" id="${
                      producto.cantidad
                    }"><i class="bi bi-plus"></i></button>
                    <button class="carrito-producto-decrementar gray" id="${
                      producto.cantidad
                    }"><i class="bi bi-dash"></i></button>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                <button class="carrito-producto-eliminar gray" id="${
                  producto.id
                }"><i class="bi bi-trash-fill"></i></button>
            `;

      contenedorCarritoProductos.append(div);
    });

    actualizarBotonesEliminar();
    actualizarCantidades();
    actualizarTotal();
  } else {
    if ((productosEnCarrito = null)) {
      productosEnCarrito = [];

      contenedorCarritoVacio.classList.remove("disabled");
      contenedorCarritoProductos.classList.add("disabled");
      contenedorCarritoAcciones.classList.add("disabled");
      contenedorCarritoComprado.classList.add("disabled");
    }
  }
  botonesIncrementar = document.querySelectorAll(
    ".carrito-producto-incrementar"
  );
  botonesIncrementar.forEach((boton) => {
    boton.addEventListener("click", incrementarCantidad);
  });

  botonesDecrementar = document.querySelectorAll(
    ".carrito-producto-decrementar"
  );
  botonesDecrementar.forEach((boton) => {
    boton.addEventListener("click", decrementarCantidad);
  });
}
cargarProductosCarrito();

function actualizarBotonesEliminar() {
  botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

  botonesEliminar.forEach((boton) => {
    boton.addEventListener("click", eliminarDelCarrito);
  });

  function eliminarDelCarrito(e) {
    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(
      (producto) => producto.id === idBoton
    );
  
    const nombreProducto = productosEnCarrito[index].nombre;
  
    productosEnCarrito.splice(index, 1);
  
    localStorage.setItem(
      "productos-en-carrito",
      JSON.stringify(productosEnCarrito)
    );
  
      Toastify({
      text: `Producto ${nombreProducto} eliminado`,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      style: {
        background: "linear-gradient(to right, #4b33a8, #785ce9)",
        borderRadius: "2rem",
        textTransform: "uppercase",
        fontSize: ".75rem"
      },
      offset: {
        x: "1.5rem",
        y: "1.5rem",
      },
      onClick: function () {},
    }).showToast();
  
    cargarProductosCarrito();
    location.reload();
  }
  
}

botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito() {
  Swal.fire({
    title: "Confirmar",
    html: `Eliminaras ${productosEnCarrito.reduce(
      (acc, producto) => acc + producto.cantidad,
      0
    )} productos.`,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText: "Sí",
    cancelButtonText: "No",
  }).then((result) => {
    if (result.isConfirmed) {
      productosEnCarrito.length = 0;
      localStorage.setItem(
        "productos-en-carrito",
        JSON.stringify(productosEnCarrito)
      );
      cargarProductosCarrito();
      contenedorCarritoProductos.innerHTML = "";
      total.innerText = "";
    }
  });
}

function actualizarTotal() {
  const totalCalculado = productosEnCarrito.reduce(
    (acc, producto) => acc + producto.precio * producto.cantidad,
    0
  );
  total.innerText = `$${totalCalculado}`;
}

botonComprar.addEventListener("click", comprarCarrito);

function comprarCarrito() {
  const abonar = productosEnCarrito.reduce(
    (acc, producto) => acc + producto.precio * producto.cantidad,
    0
  );
  Swal.fire({
    title: "Confirmar",
    html: `Estás por comprar ${productosEnCarrito.reduce(
      (acc, producto) => acc + producto.cantidad,
      0
    )} productos por un total de $${abonar}. ¿Confirmar compra?`,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText: "Sí",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      productosEnCarrito = [];
      localStorage.setItem(
        "productos-en-carrito",
        JSON.stringify(productosEnCarrito)
      );
      cargarProductosCarrito();
      contenedorCarritoProductos.innerHTML = "";
      total.innerText = "";
      Swal.fire({
        title: "¡Compra realizada!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        title: "Pago cancelado - Continuar comprando",
        icon: "info",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  });
}

function actualizarCantidades() {
  botonesIncrementar = document.querySelectorAll(
    ".carrito-producto-incrementar"
  );
  botonesDecrementar = document.querySelectorAll(
    ".carrito-producto-decrementar"
  );

  botonesIncrementar.forEach((boton) => {
    boton.addEventListener("click", incrementarCantidad);
  });
  botonesDecrementar.forEach((boton) => {
    boton.addEventListener("click", decrementarCantidad);
  });
}

function incrementarCantidad(e) {
  const idBoton = e.currentTarget.id;
  const index = productosEnCarrito.findIndex(
    (producto) => producto.cantidad === Number(idBoton)
  );
  productosEnCarrito[index].cantidad += 1;
  localStorage.setItem(
    "productos-en-carrito",
    JSON.stringify(productosEnCarrito)
  );
  cargarProductosCarrito();
}

function decrementarCantidad(e) {
  const idBoton = e.currentTarget.id;
  const index = productosEnCarrito.findIndex(
    (producto) => producto.cantidad === Number(idBoton)
  );
  if (productosEnCarrito[index].cantidad > 1) {
    productosEnCarrito[index].cantidad -= 1;
  } else {
    productosEnCarrito.splice(index, 1);
  }
  localStorage.setItem(
    "productos-en-carrito",
    JSON.stringify(productosEnCarrito)
  );
  cargarProductosCarrito();
}
