$(document).ready(function() {

    /* funciones de la billetera */

    function obtenerSaldo() {
        return Number(localStorage.getItem('saldo')) || 193000;
    }

    function guardarSaldo(saldo) {
        localStorage.setItem('saldo', saldo);
    }

    function obtenerMovimientos() {
        return JSON.parse(localStorage.getItem('movimientos')) || [];
    }

    function guardarMovimiento(tipo, monto) {
        const movimientos = obtenerMovimientos();
        movimientos.unshift({ tipo, monto, fecha: new Date().toLocaleString("es-CL") });
        localStorage.setItem('movimientos', JSON.stringify(movimientos));
    }

    function mostrarAlerta(mensaje, tipo, contenedor= "alert-container") {
        const alerta = $(`
            <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
                ${mensaje}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `);
        $(`#${contenedor}`).append(alerta);
        setTimeout(() => { alerta.alert('close'); }, 2100);
    }

    /* Login */
    if ($("#login-form").length){
        $('#login-form').submit(function(event) {
            event.preventDefault();
            const email = $('#email').val();
            const password = $('#password').val();

            if (!email || !password) {
                mostrarAlerta('Por favor, ingrese su correo y contraseña.', 'warning', 'login-alert-container');
                return;
            }

            if (email === 'trabajo@sence.com' && password === '913') {
                localStorage.setItem("usuario", email);
                mostrarAlerta('Ingresando a tu billetera', 'success', 'login-alert-container');
                setTimeout(() => { window.location.href = 'menu.html'; }, 2100);
            } else {
                mostrarAlerta('Correo o contraseña incorrectos.', 'danger', 'login-alert-container');
            }   

        });
    }

    /* Menu */

    if ($("#saldo").length) {
        $("#saldo").text(`$${obtenerSaldo().toLocaleString("es-CL")}`);

        $('#btnDepositar').click(function() {
            mostrarAlerta('Redirigiendo a la página de depósito...', 'info', 'menu-alert-container');
            setTimeout(() => { window.location.href = 'deposit.html'; }, 555);
        });

        $('#btnEnviar').click(function() {
            mostrarAlerta('Redirigiendo a la página de envío...', 'info', 'menu-alert-container');
            setTimeout(() => { window.location.href = 'sendmoney.html'; }, 555);
        });

        $('#btnTransacciones').click(function() {
            mostrarAlerta('Redirigiendo a la página de transacciones...', 'info', 'menu-alert-container');
            setTimeout(() => { window.location.href = 'transactions.html'; }, 555);
        });
    }

    /* Depósito */
    if ($("#deposit-form").length) {
        $("#saldo").text(`$${obtenerSaldo().toLocaleString("es-CL")}`);

        $('#deposit-form').submit(function(event) {
            event.preventDefault();

            const amount = Number($('#amount').val());
            if (amount <= 0 || isNaN(amount)) {
                mostrarAlerta('Ingrese un monto válido para depositar.', 'warning', 'deposit-alert-container');
                return;
            }   
            const nuevoSaldo = obtenerSaldo() + amount;
            guardarSaldo(nuevoSaldo);
            guardarMovimiento('Depósito', amount);
            mostrarAlerta(`Has depositado $${amount.toLocaleString("es-CL")}. Nuevo saldo: $${nuevoSaldo.toLocaleString("es-CL")}`, 'success', 'deposit-alert-container');
            $('#amount').val('');
            $("#saldo").text(`$${nuevoSaldo.toLocaleString("es-CL")}`);
            setTimeout(() => { window.location.href = 'menu.html'; }, 2100);
        });
    }

    /* Envío de Dinero */
    if ($("#send-form").length) {
        
        //Contactos
        const Contactos = JSON.parse(localStorage.getItem('contactos')) || [
            { id: 1, nombre: "Pedro"},
            { id: 2, nombre: "Juan"},
            { id: 3, nombre: "Diego"},
        ];

        const $contactSelect = $('#contacto');
        $contactSelect.empty();
        Contactos.forEach(contacto => $contactSelect.append(`<option value="${contacto.id}">${contacto.nombre}</option>`));

        //Nuevo Contacto
        $('#btnNuevoContacto').click(function() {
            const nombreNuevo = prompt("Ingrese el nombre del nuevo contacto:");
            if (nombreNuevo) {
                const nuevoContacto = { id: Date.now(), nombre: nombreNuevo };
                Contactos.push(nuevoContacto);
                localStorage.setItem('contactos', JSON.stringify(Contactos));
                $contactSelect.append(`<option value="${nuevoContacto.id}">${nuevoContacto.nombre}</option>`);
                mostrarAlerta('Nuevo contacto agregado.', 'success', 'send-alert-container');
            }
        });

        //Enviar Dinero
        $('#send-form').submit(function(event) {
            event.preventDefault();

            const destinatario = $('#contacto').val();
            const amount = Number($('#amount').val());
            const saldoActual = obtenerSaldo();

            if (amount <= 0 || isNaN(amount)) {
                mostrarAlerta('Ingrese un monto válido para enviar.', 'warning', 'send-alert-container');
                return;
            }

            if (amount > saldoActual) {
                mostrarAlerta('Saldo insuficiente para realizar esta transacción.', 'danger', 'send-alert-container');
                return;
            }

            guardarSaldo(saldoActual - amount);
            guardarMovimiento('Envío', amount);
            mostrarAlerta(`Has enviado $${amount.toLocaleString("es-CL")} a ${Contactos.find(c => c.id == destinatario).nombre}. Nuevo saldo: $${(saldoActual - amount).toLocaleString("es-CL")}`, 'success', 'send-alert-container');
            $('#amount').val('');
            $("#saldo").text(`$${(saldoActual - amount).toLocaleString("es-CL")}`);
            setTimeout(() => {  window.location.href = 'menu.html'; }, 2100);
        });
    }

    /* Transacciones */
    if ($("#transactions-list").length) {
        const movimientos = obtenerMovimientos();
        const listaTransacciones = $('#transactions-list');
        listaTransacciones.empty();
        movimientos.forEach(mov => {
            listaTransacciones.append(`
                <tr>
                    <td>${mov.tipo}</td>
                    <td>$${mov.monto.toLocaleString("es-CL")}</td>
                    <td>${mov.fecha}</td>
                </tr>
            `);
        });
    }
});