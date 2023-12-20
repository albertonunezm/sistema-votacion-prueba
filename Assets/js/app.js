document.addEventListener('DOMContentLoaded', function () {
    // Llena la lista de regiones al cargar la página
    fetchRegions();

    // Llena la lista de candidatos al cargar la página
    fetchCandidates();

    // Asigna la función fetchComunas al evento onchange de la lista de regiones
    document.getElementById('region').addEventListener('change', fetchComunas);
});

// Funcion para obtener las regiones
function fetchRegions() {
    // Realiza una solicitud al servidor para obtener las regiones desde la base de datos
    fetch('/Controllers/HelpersController.php?action=getRegions')
        .then(response => response.json())
        .then(data => {
            // Llenar la lista de regiones
            const regionSelect = document.getElementById('region');
            regionSelect.innerHTML = '<option value="" selected>Seleccione</option>';
            data.forEach(region => {
                const option = document.createElement('option');
                option.value = region.id;
                option.textContent = region.name;
                regionSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Funcion para obtener los candidatos
function fetchCandidates() {
    // Realiza una solicitud al servidor para obtener los candidatos desde la base de datos
    fetch('/Controllers/HelpersController.php?action=getCandidates')
        .then(response => response.json())
        .then(data => {
            // Llena la lista de candidatos
            const candidateSelect = document.getElementById('candidate');
            candidateSelect.innerHTML = '<option value="" selected>Seleccione</option>';

            const comunaSelect = document.getElementById('comuna');
            comunaSelect.innerHTML = '<option value="" selected>Seleccione</option>';

            data.forEach(candidate => {
                const option = document.createElement('option');
                option.value = candidate.id;
                option.textContent = candidate.name;
                candidateSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Funcion para obtener las comunas
function fetchComunas() {
    const regionId = document.getElementById('region').value;

    // Limpia la lista de comunas
    const comunaSelect = document.getElementById('comuna');
    comunaSelect.innerHTML = '<option value="" selected>Seleccione</option>';

    // Solo realiza la solicitud si se selecciona una región
    if (regionId) {
        // Realiza una solicitud al servidor para obtener las comunas según la región seleccionada
        fetch(`/Controllers/HelpersController.php?action=getComunas&region_id=${regionId}`)
            .then(response => response.json())
            .then(data => {
                // Llena la lista de comunas
                data.forEach(comuna => {
                    const option = document.createElement('option');
                    option.value = comuna.id;
                    option.textContent = comuna.name;
                    comunaSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error:', error));
    }
}

// Funcion para procesar el formulario del index.
function processVote(event){

    // Previene la acción por defecto del botón (Votar)
    event.preventDefault();

    // Captura datos del formulario
    let data = {
        fullname: document.getElementById('fullname').value,
        alias: document.getElementById('alias').value,
        rut: document.getElementById('rut').value,
        email: document.getElementById('email').value,
        region: document.getElementById('region').value,
        comuna: document.getElementById('comuna').value,
        candidate: document.getElementById('candidate').value,
        options: Array.from(document.querySelectorAll('input[name="options[]"]:checked')).map(checkbox => checkbox.value)
    };

    // Validaciones
    // Valida el nombre
    if (!data.fullname.trim()) {
        alert('Nombre y Apellido no pueden estar en blanco.');
        event.preventDefault();
        return;
    }

    // Valida el alias
    if (data.alias.length < 6 || !/^(?=.*[a-zA-Z])(?=.*\d).{6,}$/.test(data.alias)) {
        alert('Alias debe tener al menos 6 caracteres y contener letras y números.');
        event.preventDefault();
        return;
    }

    // Validar el formato del RUT chileno
    if (!validarRutChileno(data.rut)) {
        alert('El RUT ingresado no es válido.');
        event.preventDefault();
        return;
    }

    // Valida el email
    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        alert('Email no puede estar en blanco y debe tener un formato válido.');
        event.preventDefault();
        return;
    }
    
    // Valida la region
    if (!data.region.trim() || !data.comuna.trim()) {
        alert('Selecciona una Región y Comuna.');
        event.preventDefault();
        return;
    }

    // Valida el candidato
    if (!data.candidate.trim()) {
        alert('Selecciona un Candidato.');
        event.preventDefault();
        return;
    }

    // Valida las opciones del checkbox
    if (data.options.length < 2) {
        alert('Debes elegir al menos dos opciones en "Cómo se enteró de nosotros".');
        event.preventDefault();
        return;
    }

    // Si pasamos las validaciones. 
    // Realiza la solicitud utilizando fetch

    fetch('/Controllers/VotingController.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        return response.json(); // Retorna la promesa para manejarla
    })
    .then(data => {
        console.log(data);
        if (data.status === 'success') {
            // Voto registrado con éxito
            alert(data.message);
        } else {
            // Error o RUT ya emitió un voto
            alert(data.message);
            formularioClear(); // Limpia el formulario
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Funcion para formatear en tiempo real el RUT
function soloRUT(event) {
    let input = event.target;
    let inputValue = input.value;

    // Eliminar caracteres no permitidos
    let rutInput = inputValue.replace(/^0|[^\dkK0-9]+/g, '');

    // Validar longitud mínima de RUT
    if (rutInput.length < 1) {
        input.value = rutInput;
        return;
    }

    // Obtener dígitos y dígito verificador
    let rutDigits = rutInput.substring(0, rutInput.length - 1);
    let rutVerifier = rutInput.slice(-1);

    // Convertir el dígito verificador a mayúsculas si es "k"
    if (rutVerifier.toLowerCase() === 'k') {
        rutVerifier = 'K';
    }

    // Formatear dígitos del RUT sin puntos
    let formattedRUT = rutDigits + '-' + rutVerifier;

    // Asignar el valor formateado al campo de entrada
    input.value = formattedRUT;
}

// Función para permitir solo letras en los input
function soloLetras(event) {
    let input = event.target;
    let inputValue = input.value;
    
    // Remueve cualquier caracter que no sea letras
    let lettersInput = inputValue.replace(/[^a-zA-ZáéíóúÁÉÍÓÚ\sñÑ]/g, '');
    input.value = lettersInput.toUpperCase();
}

// Función para permitir solo alfanumericos.
function soloAlfanumerico(event) {
    let input = event.target;
    let inputValue = input.value;
    
    // Remueve cualquier caracter no alfanumérico ni espacio
    let alphanumericInput = inputValue.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ'äëÏöÜÄËÏÖÜ]/g, '');
  
    input.value = alphanumericInput.toUpperCase();
}

// Funcion que valida si el RUT realmente es valido segun el DV
function validarRutChileno(rut) {
    rut = rut.replace(/\./g, '').replace(/-/g, '');
    if (!/^\d{7,8}[\dkK]$/.test(rut)) {
        return false;
    }

    if (rut.charAt(0) === '0') {
        return false;
    }

    let dvIngresado = rut.slice(-1).toUpperCase();
    let rutSinDV = rut.slice(0, -1);

    let dvCalculado = calcularDV(rutSinDV);
    let dvEsperado = (dvCalculado == 10) ? 'K' : dvCalculado.toString();

    return (dvIngresado === dvEsperado);
}

//Funcion auxiliar para validar RUT/DV
function calcularDV(rut) {
    let rutNumeros = Array.from(rut).reverse();
    let factor = 2;
    let suma = 0;

    for (let i = 0; i < rutNumeros.length; i++) {
        suma += factor * parseInt(rutNumeros[i]);
        factor = (factor < 7) ? factor + 1 : 2;
    }

    let dvCalculado = 11 - (suma % 11);
    let dv = (dvCalculado == 11) ? 0 : ((dvCalculado == 10) ? 'K' : dvCalculado);

    return dv;
}

// Funcion que limpia el formulario
function formularioClear() {
    document.getElementById('fullname').value = '';
    document.getElementById('alias').value = '';
    document.getElementById('rut').value = '';
    document.getElementById('email').value = '';
    document.getElementById('region').value = '';
    document.getElementById('comuna').value = '';
    document.getElementById('candidate').value = '';

    // Desmarca todos los checkboxes
    var checkboxes = document.querySelectorAll('input[name="options[]"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}
