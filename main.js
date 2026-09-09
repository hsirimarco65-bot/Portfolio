let modoFondoCalmo = false;

document.addEventListener('DOMContentLoaded', () => {
    inicializarPortfolio();
    inicializarNavegacion();
    inicializarObservadorSecciones();
    inicializarModales();
    inicializarVisorImagenes();
    inicializarVideoProyecto();
    inicializarFormularioContacto();
    inicializarLienzoParticulas();
});

function inicializarPortfolio() {
    const botonVerTrabajo = document.getElementById('boton-ver-trabajo');

    if (botonVerTrabajo) {
        botonVerTrabajo.addEventListener('click', manejarClicVerTrabajo);
    }
}

function manejarClicVerTrabajo(evento) {
    evento.preventDefault();
    const seccionDestino = document.querySelector('#acerca-de');

    if (seccionDestino) {
        seccionDestino.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function inicializarNavegacion() {
    const enlaces = document.querySelectorAll('.enlace-nav');

    enlaces.forEach(enlace => {
        enlace.addEventListener('click', (evento) => {
            const destinoId = enlace.getAttribute('href');
            if (destinoId && destinoId.startsWith('#')) {
                const seccionDestino = document.querySelector(destinoId);
                if (seccionDestino) {
                    evento.preventDefault();
                    seccionDestino.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

function inicializarObservadorSecciones() {
    const secciones = document.querySelectorAll('section[id]');
    const enlacesNav = document.querySelectorAll('.enlace-nav');

    const opciones = {
        root: null,
        rootMargin: '-35% 0px -40% 0px',
        threshold: 0
    };

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                const idSeccion = entrada.target.getAttribute('id');

                if (idSeccion === 'acerca-de' || idSeccion === 'proyectos' || idSeccion === 'contacto') {
                    modoFondoCalmo = true;
                } else if (idSeccion === 'bienvenida') {
                    modoFondoCalmo = false;
                }

                enlacesNav.forEach(enlace => {
                    if (enlace.getAttribute('href') === `#${idSeccion}`) {
                        enlace.classList.add('enlace-activo');
                    } else {
                        enlace.classList.remove('enlace-activo');
                    }
                });
            }
        });
    }, opciones);

    secciones.forEach(seccion => observador.observe(seccion));
}

function inicializarModales() {
    function configurarModal(idBoton, idModal, idCerrar, idTelon) {
        const boton = document.getElementById(idBoton);
        const modal = document.getElementById(idModal);
        const botonCerrar = document.getElementById(idCerrar);
        const telon = document.getElementById(idTelon);

        if (!modal) return;

        function abrirModal() {
            modal.classList.add('abierto');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        function cerrarModal() {
            modal.classList.remove('abierto');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        if (boton) {
            boton.addEventListener('click', abrirModal);
        }

        if (botonCerrar) {
            botonCerrar.addEventListener('click', cerrarModal);
        }

        if (telon) {
            telon.addEventListener('click', cerrarModal);
        }

        window.addEventListener('keydown', (evento) => {
            if (evento.key === 'Escape' && modal.classList.contains('abierto')) {
                cerrarModal();
            }
        });
    }

    configurarModal('boton-detalles-siricell', 'modal-siricell', 'cerrar-modal-siricell', 'telon-modal-siricell');
    configurarModal('boton-detalles-siricellsistema', 'modal-siricellsistema', 'cerrar-modal-siricellsistema', 'telon-modal-siricellsistema');
    configurarModal('boton-detalles-mercadoabasto', 'modal-mercadoabasto', 'cerrar-modal-mercadoabasto', 'telon-modal-mercadoabasto');
    configurarModal('boton-detalles-fashionstyle', 'modal-fashionstyle', 'cerrar-modal-fashionstyle', 'telon-modal-fashionstyle');
}

function inicializarVisorImagenes() {
    const modalVisor = document.getElementById('modal-visor-imagen');
    const telonVisor = document.getElementById('telon-visor-imagen');
    const botonCerrar = document.getElementById('cerrar-visor-imagen');
    const imagenActiva = document.getElementById('visor-imagen-activa');
    const tituloVisor = document.getElementById('visor-titulo-imagen');
    const subtituloVisor = document.getElementById('visor-subtitulo-imagen');
    const badgeTipo = document.getElementById('visor-badge-tipo');
    const enlaceExterno = document.getElementById('visor-enlace-externo');
    const contenedorImagen = document.getElementById('visor-contenedor-imagen');
    const botonAnterior = document.getElementById('visor-boton-anterior');
    const botonSiguiente = document.getElementById('visor-boton-siguiente');
    const indicadorContador = document.getElementById('visor-contador');

    if (!modalVisor || !imagenActiva) return;

    const elementosAmpliables = Array.from(document.querySelectorAll('.marco-captura-interactivo'));
    if (elementosAmpliables.length === 0) return;

    let indiceActual = 0;

    function mostrarImagen(indice) {
        if (indice < 0) indice = elementosAmpliables.length - 1;
        if (indice >= elementosAmpliables.length) indice = 0;
        indiceActual = indice;

        const el = elementosAmpliables[indiceActual];
        const origen = el.getAttribute('data-ampliar-origen');
        const titulo = el.getAttribute('data-ampliar-titulo') || 'Captura de Proyecto';
        const subtitulo = el.getAttribute('data-ampliar-subtitulo') || '';
        const esSvg = el.getAttribute('data-es-svg') === 'true' || (origen && origen.toLowerCase().endsWith('.svg'));

        imagenActiva.style.opacity = '0';
        imagenActiva.style.transform = 'scale(0.97)';

        setTimeout(() => {
            imagenActiva.src = origen;
            imagenActiva.alt = titulo;
            if (tituloVisor) tituloVisor.textContent = titulo;
            if (subtituloVisor) subtituloVisor.textContent = subtitulo;
            const tipoCaptura = el.getAttribute('data-ampliar-tipo') || (esSvg ? 'Diagrama UML (Formato Vectorial SVG)' : 'Captura de Entorno / Tests');
            if (badgeTipo) badgeTipo.textContent = tipoCaptura;
            if (enlaceExterno) enlaceExterno.href = origen;
            if (indicadorContador) indicadorContador.textContent = `${indiceActual + 1} / ${elementosAmpliables.length}`;

            if (contenedorImagen) {
                if (esSvg) {
                    contenedorImagen.classList.add('modo-fondo-blanco');
                } else {
                    contenedorImagen.classList.remove('modo-fondo-blanco');
                }
            }

            imagenActiva.style.opacity = '1';
            imagenActiva.style.transform = 'scale(1)';
        }, 120);
    }

    function abrirVisor(indice) {
        mostrarImagen(indice);
        modalVisor.classList.add('abierto');
        modalVisor.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function cerrarVisor() {
        modalVisor.classList.remove('abierto');
        modalVisor.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    elementosAmpliables.forEach((el, index) => {
        el.addEventListener('click', () => abrirVisor(index));
        el.addEventListener('keydown', (evento) => {
            if (evento.key === 'Enter' || evento.key === ' ') {
                evento.preventDefault();
                abrirVisor(index);
            }
        });
    });

    if (botonCerrar) botonCerrar.addEventListener('click', cerrarVisor);
    if (telonVisor) telonVisor.addEventListener('click', cerrarVisor);

    if (botonAnterior) {
        botonAnterior.addEventListener('click', () => {
            mostrarImagen(indiceActual - 1);
        });
    }

    if (botonSiguiente) {
        botonSiguiente.addEventListener('click', () => {
            mostrarImagen(indiceActual + 1);
        });
    }

    window.addEventListener('keydown', (evento) => {
        if (!modalVisor.classList.contains('abierto')) return;

        if (evento.key === 'Escape') {
            cerrarVisor();
        } else if (evento.key === 'ArrowLeft') {
            mostrarImagen(indiceActual - 1);
        } else if (evento.key === 'ArrowRight') {
            mostrarImagen(indiceActual + 1);
        }
    });
}

function inicializarVideoProyecto() {
    const videos = document.querySelectorAll('.reproductor-video');
    videos.forEach(video => {
        video.load();
    });
}

function inicializarLienzoParticulas() {
    const lienzo = document.getElementById('lienzo-particulas');
    if (!lienzo) return;

    const contexto = lienzo.getContext('2d');
    let ancho = 0;
    let alto = 0;
    let particulas = [];
    let idAnimacion = null;

    const raton = {
        x: null,
        y: null,
        radioConexion: 180
    };

    function redimensionarLienzo() {
        const escala = Math.min(window.devicePixelRatio || 1, 2);
        ancho = window.innerWidth;
        alto = window.innerHeight;

        lienzo.width = ancho * escala;
        lienzo.height = alto * escala;
        lienzo.style.width = `${ancho}px`;
        lienzo.style.height = `${alto}px`;

        contexto.scale(escala, escala);
        crearParticulas();
    }

    function crearParticulas() {
        particulas = [];
        const cantidad = Math.max(160, Math.min(300, Math.floor((ancho * alto) / 4500)));

        for (let i = 0; i < cantidad; i++) {
            particulas.push({
                x: Math.random() * ancho,
                y: Math.random() * alto,
                velocidadX: (Math.random() - 0.5) * 0.38,
                velocidadY: (Math.random() - 0.5) * 0.38,
                radio: Math.random() * 1.3 + 1.1,
                opacidadBase: Math.random() * 0.35 + 0.28
            });
        }
    }

    function animar() {
        contexto.clearRect(0, 0, ancho, alto);

        const ratonActivo = !modoFondoCalmo && raton.x !== null && raton.y !== null;
        const pasoPuntos = modoFondoCalmo ? 3 : 1;
        const factorAtenuacion = modoFondoCalmo ? 0.35 : 1.0;

        for (let i = 0; i < particulas.length; i += pasoPuntos) {
            const p = particulas[i];

            const velocidadEscala = modoFondoCalmo ? 0.4 : 1.0;
            p.x += p.velocidadX * velocidadEscala;
            p.y += p.velocidadY * velocidadEscala;

            if (p.x < 0 || p.x > ancho) p.velocidadX *= -1;
            if (p.y < 0 || p.y > alto) p.velocidadY *= -1;

            let factorCercaniaRaton = 0;

            if (ratonActivo) {
                const distRatonX = p.x - raton.x;
                const distRatonY = p.y - raton.y;
                const distanciaRaton = Math.hypot(distRatonX, distRatonY);

                if (distanciaRaton < raton.radioConexion) {
                    factorCercaniaRaton = 1 - (distanciaRaton / raton.radioConexion);

                    const opacidadLineaRaton = factorCercaniaRaton * 0.65;
                    contexto.beginPath();
                    contexto.moveTo(p.x, p.y);
                    contexto.lineTo(raton.x, raton.y);
                    contexto.strokeStyle = `rgba(244, 243, 238, ${opacidadLineaRaton})`;
                    contexto.lineWidth = 0.85;
                    contexto.stroke();
                }
            }

            const opacidadFinal = (p.opacidadBase + factorCercaniaRaton * 0.55) * factorAtenuacion;
            contexto.beginPath();
            contexto.arc(p.x, p.y, p.radio * (modoFondoCalmo ? 0.85 : 1), 0, Math.PI * 2);
            contexto.fillStyle = `rgba(244, 243, 238, ${opacidadFinal})`;
            contexto.fill();

            if (ratonActivo) {
                for (let j = i + 1; j < particulas.length; j += pasoPuntos) {
                    const p2 = particulas[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distanciaEntrePuntos = Math.hypot(dx, dy);
                    const distanciaMaxima = 125;

                    if (distanciaEntrePuntos < distanciaMaxima) {
                        const centroX = (p.x + p2.x) / 2;
                        const centroY = (p.y + p2.y) / 2;
                        const distAlRaton = Math.hypot(centroX - raton.x, centroY - raton.y);

                        if (distAlRaton < raton.radioConexion) {
                            const factorIluminacion = (1 - (distAlRaton / raton.radioConexion)) * (1 - (distanciaEntrePuntos / distanciaMaxima));
                            if (factorIluminacion > 0) {
                                contexto.beginPath();
                                contexto.moveTo(p.x, p.y);
                                contexto.lineTo(p2.x, p2.y);
                                contexto.strokeStyle = `rgba(244, 243, 238, ${factorIluminacion * 0.45})`;
                                contexto.lineWidth = 0.65;
                                contexto.stroke();
                            }
                        }
                    }
                }
            }
        }

        idAnimacion = requestAnimationFrame(animar);
    }

    window.addEventListener('mousemove', (evento) => {
        raton.x = evento.clientX;
        raton.y = evento.clientY;
    });

    window.addEventListener('mouseleave', () => {
        raton.x = null;
        raton.y = null;
    });

    window.addEventListener('touchmove', (evento) => {
        if (evento.touches.length > 0) {
            raton.x = evento.touches[0].clientX;
            raton.y = evento.touches[0].clientY;
        }
    }, { passive: true });

    window.addEventListener('touchend', () => {
        raton.x = null;
        raton.y = null;
    });

    let temporizadorRedimension;
    window.addEventListener('resize', () => {
        clearTimeout(temporizadorRedimension);
        temporizadorRedimension = setTimeout(redimensionarLienzo, 150);
    });

    redimensionarLienzo();
    animar();
}

function inicializarFormularioContacto() {
    const formulario = document.getElementById('formulario-contacto');
    const botonEnviar = document.getElementById('boton-enviar-contacto');
    const estadoEnvio = document.getElementById('estado-envio-contacto');

    if (!formulario || !botonEnviar || !estadoEnvio) return;

    formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        const nombre = formulario.nombre.value.trim();
        const email = formulario.email.value.trim();
        const mensaje = formulario.mensaje.value.trim();

        if (!nombre || !email || !mensaje) {
            mostrarEstado('Por favor, completa todos los campos requeridos.', 'error');
            return;
        }

        botonEnviar.disabled = true;
        const contenidoOriginalBoton = botonEnviar.innerHTML;
        botonEnviar.innerHTML = '<span>Enviando mensaje...</span>';
        mostrarEstado('Enviando tu mensaje...', 'cargando');

        try {
            const respuesta = await fetch('https://formsubmit.co/ajax/hsirimarco65@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    nombre: nombre,
                    email: email,
                    mensaje: mensaje,
                    _subject: `Nuevo mensaje de ${nombre} desde tu Portfolio Web`
                })
            });

            const datos = await respuesta.json();

            if (respuesta.ok && (datos.success === 'true' || datos.success === true || datos.message)) {
                mostrarEstado('¡Mensaje enviado con éxito! Gracias por contactarme, te responderé a la brevedad.', 'exito');
                formulario.reset();
            } else {
                mostrarEstado('Hubo un inconveniente al enviar el mensaje. Podés escribirme directamente a hsirimarco65@gmail.com', 'error');
            }
        } catch (error) {
            console.error('Error al enviar formulario de contacto:', error);
            mostrarEstado('Error de conexión. Podés escribirme directamente a hsirimarco65@gmail.com', 'error');
        } finally {
            botonEnviar.disabled = false;
            botonEnviar.innerHTML = contenidoOriginalBoton;
        }
    });

    function mostrarEstado(mensaje, tipo) {
        estadoEnvio.textContent = mensaje;
        estadoEnvio.className = `estado-envio-contacto mostrar ${tipo}`;
    }
}
