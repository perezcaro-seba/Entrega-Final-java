// Array de productos
const productos = [
    { id: 1, nombre: 'Champú', precio: 5000 },
    { id: 2, nombre: 'Cera para el cabello', precio: 3000 },
    { id: 3, nombre: 'Aceite para barba', precio: 7000 },
    { id: 4, nombre: 'After Shave', precio: 6000 }
];

// Carro de compras
let carro = JSON.parse(localStorage.getItem('carro')) || [];

// Función tabla de productos 
function renderizarProductos() {
    const tablaProductosBody = document.querySelector('#tablaProductos tbody');
    if (!tablaProductosBody) return; 

    tablaProductosBody.innerHTML = ''; 

    productos.forEach(producto => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${producto.nombre}</td>
            <td>$${producto.precio}</td>
            <td><input type="number" min="1" value="1" id="cantidad-${producto.id}" /></td>
            <td><button onclick="agregarAlCarro(${producto.id})">Agregar</button></td>
        `;

        tablaProductosBody.appendChild(row);
    });
}

// Función agregar productos al carro 
function agregarAlCarro(idProducto) {
    const cantidadInput = document.getElementById(`cantidad-${idProducto}`);
    const cantidad = parseInt(cantidadInput.value);
    if (isNaN(cantidad) || cantidad < 0) {
        Swal.fire('Error', 'Por favor, ingresa una cantidad válida.', 'error');
        return;
    }

    const producto = productos.find(p => p.id === idProducto);
    if (!producto) {
        console.log(`Producto con ID ${idProducto} no encontrado.`);
        return;
    }

    const productoEnCarro = carro.find(p => p.id === idProducto);
    if (productoEnCarro) {
        productoEnCarro.cantidad += cantidad;
    } else {
        carro.push({ ...producto, cantidad });
    }

    console.log('Carro actualizado:', carro);
    localStorage.setItem('carro', JSON.stringify(carro)); 
    renderizarCarrito(); 
}

// Función para quitar productos del carro 
function quitarDelCarro(idProducto) {
    carro = carro.filter(producto => producto.id !== idProducto);

    console.log('Carro actualizado después de quitar un producto:', carro);
    localStorage.setItem('carro', JSON.stringify(carro)); 
    calcularTotal();
    renderizarCarrito(); 
}

// Función para calcular el total del carrito 
function calcularTotal() {
    const total = carro.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    const totalElement = document.getElementById('totalCarrito');
    if (totalElement) {
        totalElement.innerText = total;
    }
    console.log('Total del carrito:', total);
}

// Función para renderizar el carrito 
function renderizarCarrito() {
    const tablaCarritoBody = document.querySelector('#tablaCarrito tbody');
    if (!tablaCarritoBody) return; 

    tablaCarritoBody.innerHTML = ''; 

    carro.forEach(producto => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${producto.nombre}</td>
            <td>$${producto.precio}</td>
            <td>${producto.cantidad}</td>
            <td>$${producto.precio * producto.cantidad}</td>
            <td><button onclick="quitarDelCarro(${producto.id})">Quitar</button></td>
        `;

        tablaCarritoBody.appendChild(row);
    });
}

// Función para finalizar compra 
function finalizarCompra() {
    if (carro.length === 0) {
        Swal.fire('Carrito Vacío', 'Agrega productos al carrito antes de finalizar la compra.', 'warning');
        return;
    }

    // Mensaje de WhatsApp con los detalles del carrito
    const mensaje = carro.map(p => `${p.nombre} x${p.cantidad} - $${p.precio * p.cantidad}`).join('\n');
    const total = carro.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
    const whatsappUrl = `https://wa.me/+56950921204?text=Hola,%20quiero%20finalizar%20mi%20compra:%0A${encodeURIComponent(mensaje)}%0ATotal:%20$${total}`;

    window.open(whatsappUrl, '_blank');
}


// Gestión de Reservas

// Array de barberos
const barberos = [
    { id: 1, nombre: 'Juan Pérez' },
    { id: 2, nombre: 'Carlos Gómez' },
    { id: 3, nombre: 'Andrés Ramírez' },
    { id: 4, nombre: 'Pedro Torres' },
    { id: 5, nombre: 'Luis Martínez' }
];

// Array de servicios
const servicios = [
    { id: 1, nombre: 'Corte de pelo', precio: 10000 },
    { id: 2, nombre: 'Afeitado', precio: 8000 },
    { id: 3, nombre: 'Corte y barba', precio: 15000 },
    { id: 4, nombre: 'Tinte de cabello', precio: 12000 },
    { id: 5, nombre: 'Alisado', precio: 20000 }
];

// Función selector de barberos 
function poblarBarberos() {
    const selectBarbero = document.getElementById('barbero');
    if (!selectBarbero) return;

    barberos.forEach(barbero => {
        const option = document.createElement('option');
        option.value = barbero.id;
        option.text = barbero.nombre;
        selectBarbero.appendChild(option);
    });
}

// Función selector de servicios 
function poblarServicios() {
    const selectServicio = document.getElementById('servicio');
    if (!selectServicio) return;

    servicios.forEach(servicio => {
        const option = document.createElement('option');
        option.value = servicio.id;
        option.text = `${servicio.nombre} - $${servicio.precio}`;
        selectServicio.appendChild(option);
    });
}

// Función formulario de reserva 
function manejarReserva() {
    const reservaForm = document.getElementById('reservaForm');
    if (!reservaForm) return;

    reservaForm.addEventListener('submit', function(event) {
        event.preventDefault(); 

        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const fecha = document.getElementById('fecha').value;
        const hora = document.getElementById('hora').value;
        const barberoId = parseInt(document.getElementById('barbero').value);
        const servicioId = parseInt(document.getElementById('servicio').value);

        
        const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
        const reservaExistente = reservas.find(r => r.fecha === fecha && r.hora === hora && r.barberoId === barberoId);

        if (reservaExistente) {
            Swal.fire('Error', 'Esta fecha y hora ya están reservadas para el barbero seleccionado.', 'error');
            return;
        }

        const reserva = {
            id: Date.now(),
            nombre,
            email,
            telefono,
            fecha,
            hora,
            barberoId,
            servicioId
        };

        reservas.push(reserva);
        localStorage.setItem('reservas', JSON.stringify(reservas));

        console.log('Reserva realizada:', reserva);

        // Mostrar mensaje de confirmación 
        Swal.fire(
            'Reserva completada',
            'La reserva se ha realizado correctamente',
            'success'
        ).then(() => {
            reservaForm.reset(); 
        });
    });
}

// Función para evitar reservas duplicadas 
function verificarReservaDuplicada(reserva) {
    const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    return reservas.some(r => r.fecha === reserva.fecha && r.hora === reserva.hora && r.barberoId === reserva.barberoId);
}

function renderizarProductos() {
    const tablaProductosBody = document.querySelector('#tablaProductos tbody');
    tablaProductosBody.innerHTML = ''; 

    productos.forEach(producto => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${producto.nombre}</td>
            <td>$${producto.precio}</td>
            <td><input type="number" min="1" value="1" id="cantidad-${producto.id}" /></td>
            <td><button onclick="agregarAlCarro(${producto.id})">Agregar</button></td>
        `;

        tablaProductosBody.appendChild(row);
    });
}


// Agregar Productos 
function agregarAlCarro(idProducto) {
    const cantidad = document.getElementById(`cantidad-${idProducto}`).value;
    const producto = productos.find(p => p.id === idProducto);

    const productoEnCarro = carro.find(p => p.id === idProducto);
    if (productoEnCarro) {
        productoEnCarro.cantidad += parseInt(cantidad);
    } else {
        carro.push({ ...producto, cantidad: parseInt(cantidad) });
    }

    console.log('Carro actualizado:', carro);
    calcularTotal();
    renderizarCarrito(); 
}

// formulario de contacto 
function manejarContacto() {
    const contactoForm = document.getElementById('contactoForm');
    if (!contactoForm) return;

    contactoForm.addEventListener('submit', function(event) {
        event.preventDefault(); 

        const nombre = document.getElementById('nombreContacto').value.trim();
        const email = document.getElementById('emailContacto').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();

        const contacto = {
            nombre,
            email,
            mensaje
        };

        console.log('Mensaje de contacto recibido:', contacto);

        Swal.fire(
            'Mensaje Enviado',
            'Tu mensaje ha sido enviado correctamente.',
            'success'
        ).then(() => {
            contactoForm.reset();
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    
    if (document.getElementById('tablaProductos')) {
        renderizarProductos();
    }

    if (document.getElementById('tablaCarrito')) {
        renderizarCarrito();
        calcularTotal();
    }

    if (document.getElementById('reservaForm')) {
        poblarBarberos();
        poblarServicios();
        manejarReserva();
    }

    if (document.getElementById('galeriaProductos')) {
        renderizarGaleria();
        manejarBusqueda();
    }

    if (document.getElementById('contactoForm')) {
        manejarContacto();
    }
});
