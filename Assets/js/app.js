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
    fetch('/Controllers/SelectController.php?action=getRegions')
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
    fetch('/Controllers/SelectController.php?action=getCandidates')
        .then(response => response.json())
        .then(data => {
            // Llena la lista de candidatos
            const candidateSelect = document.getElementById('candidate');
            candidateSelect.innerHTML = '<option value="" selected>Seleccione</option>';

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
    const communeSelect = document.getElementById('comuna');
    communeSelect.innerHTML = '<option value="" selected>Seleccione</option>';

    // Solo realiza la solicitud si se selecciona una región
    if (regionId) {
        // Realiza una solicitud al servidor para obtener las comunas según la región seleccionada
        fetch(`/Controllers/SelectController.php?action=getComunas&region_id=${regionId}`)
            .then(response => response.json())
            .then(data => {
                // Llena la lista de comunas
                data.forEach(commune => {
                    const option = document.createElement('option');
                    option.value = commune.id;
                    option.textContent = commune.name;
                    communeSelect.appendChild(option);
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
    var data = {
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
    if (!data.fullname.trim()) {
        alert('Nombre y Apellido no pueden estar en blanco.');
        event.preventDefault();
        return;
    }

    if (data.alias.length < 6 || !/^(?=.*[a-zA-Z])(?=.*\d).{6,}$/.test(data.alias)) {
        alert('Alias debe tener al menos 6 caracteres y contener letras y números.');
        event.preventDefault();
        return;
    }

    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        alert('Email no puede estar en blanco y debe tener un formato válido.');
        event.preventDefault();
        return;
    }
    

    //Falta EMAIL y RUT

    if (!data.region.trim() || !data.comuna.trim()) {
        alert('Selecciona una Región y Comuna.');
        event.preventDefault();
        return;
    }

    if (!data.candidate.trim()) {
        alert('Selecciona un Candidato.');
        event.preventDefault();
        return;
    }

    if (optionsChecked.length < 2) {
        alert('Debes elegir al menos dos opciones en "Cómo se enteró de nosotros".');
        event.preventDefault();
        return;
    }

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
        console.log(response.json()); // Esperamos una respuesta en formato JSON
    })
    .then(dataArray => {
        console.log(dataArray); // Hacer algo con los datos recibidos como array
    })
    .catch(error => {
        console.error('Error:', error);
    });
}