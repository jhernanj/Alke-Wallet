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
                button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `);
        $(`#${contenedor}`).append(alerta);
        setTimeout(() => { alerta.alert('close'); }, 2100);
    }

    /* Login */

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