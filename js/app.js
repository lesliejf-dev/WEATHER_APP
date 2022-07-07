const loginInfoContainer = document.querySelector('.loginInfoContainer');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);
})

function buscarClima(e) {
    e.preventDefault();

    //validar
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if(ciudad === '' || pais === '') {
        //error
        mostrarError('Los campos son obligatorios');

        return;
    }
    //Consulta API
    consultarAPI(ciudad, pais);
}

function mostrarError(mensaje) {
    const alerta = document.querySelector('.red');

    if(!alerta){
        //alerta
        const alerta = document.createElement('div');

        alerta.classList.add('red');

        alerta.innerHTML = `
        <strong>ERROR!</strong>
        <span>${mensaje}</span>
        `;
        loginInfoContainer.appendChild(alerta);

        //remover alerta
        setTimeout(() => {
            alerta.remove();
        }, 3000);

    }
    
}

function consultarAPI(ciudad, pais) {

    const appId = 'b0695cca9b51f04fab82996421b6e13e';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

    fetch(url)
        .then( respuesta => respuesta.json())
        .then( datos => {

            console.log(datos);

            limpiarHTML();

            if(datos.cod === "404") {
                mostrarError('Esa ciudad no se ha encontrado')
                return;
            }

            //mostrar respuesta en HTML
            mostrarClima(datos);
        })
}

function mostrarClima(datos) {
    const { name, main: { temp, temp_max, temp_min }} = datos;

    const centigrados = cambiaGrados(temp);
    const max = cambiaGrados(temp_max);
    const min = cambiaGrados(temp_min);

    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `${name}`;
    nombreCiudad.classList.add('font-bold', 'text-6xl');

    const actual = document.createElement('p');        
    actual.innerHTML = `${centigrados} &#8451;`;
    actual.classList.add('font-bold', 'text-6xl');

    const tempMax = document.createElement('p');
    tempMax.innerHTML = `Max: ${max} &#8451;`;
    tempMax.classList.add('text-xl');

    const tempMin = document.createElement('p');
    tempMin.innerHTML = `Min: ${min} &#8451;`;
    tempMin.classList.add('text-xl');

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMax);
    resultadoDiv.appendChild(tempMin);

    resultado.appendChild(resultadoDiv);
}

//helper de kelvin a centigrados
const cambiaGrados = grados => parseInt(grados - 273.15);


function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}


