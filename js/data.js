/* ============================================================
   data.js
   Datos simulados de la plataforma "Juntos".
   No hay backend: este archivo hace las veces de base de datos.
   Todas las páginas leen de window.IDEAS_DATA.
   ============================================================ */

/**
 * Estructura de cada idea:
 * {
 *   id: number,
 *   nombre: string,
 *   descripcion: string,
 *   categoria: "parejas" | "amigos",
 *   tipo: string,                 // ver listas de filtro en cada sección
 *   ocasion: string,
 *   presupuesto: "gratis" | "economico" | "medio" | "alto",
 *   duracion: string,             // texto libre, ej. "2 horas"
 *   tiempo: string,               // clave de filtro: "menos-1h" | "1-2h" | "medio-dia" | "todo-el-dia"
 *   dificultad: "facil" | "intermedia" | "dificil",
 *   personas: string | null,      // solo amigos: "2" | "3-5" | "6-10" | "mas-10"
 *   materiales: string[],
 *   instrucciones: string[],
 *   pinterest: string,            // URL real
 *   tiktok: string,               // URL real
 *   instagram: string,            // URL real
 *   estado: "aprobada" | "pendiente" | "rechazada",
 *   autor: string,
 *   fecha: string,                // ISO yyyy-mm-dd (fecha de publicación/envío)
 *   vistas: number                // simula popularidad para "más consultadas"
 * }
 */

window.IDEAS_DATA = [

  // ============ PAREJAS ============

  {
    id: 1,
    nombre: "Caja sorpresa para aniversario",
    descripcion: "Una caja llena de notas, fotos y pequeños detalles que recuerden momentos especiales de la relación.",
    categoria: "parejas",
    tipo: "manualidad",
    ocasion: "aniversario",
    presupuesto: "economico",
    duracion: "2 horas",
    tiempo: "1-2h",
    dificultad: "facil",
    personas: null,
    materiales: ["Caja de cartón o madera", "Fotos impresas", "Notas escritas a mano", "Cinta y decoración"],
    instrucciones: [
      "Elige una caja que puedan decorar a su gusto.",
      "Reúne fotos y recuerdos importantes de la relación.",
      "Escribe una nota por cada recuerdo, explicando por qué es especial.",
      "Decora la caja por fuera con el tema que más los represente.",
      "Entrégala en un momento tranquilo para que puedan revisarla juntos."
    ],
    pinterest: "https://www.pinterest.com/search/pins/?q=caja%20sorpresa%20aniversario",
    tiktok: "https://www.tiktok.com/search?q=caja%20sorpresa%20aniversario",
    instagram: "https://www.instagram.com/explore/tags/cajasorpresa/",
    estado: "aprobada",
    autor: "Equipo Juntos",
    fecha: "2026-03-04",
    vistas: 482
  },
  {
    id: 2,
    nombre: "Picnic romántico al atardecer",
    descripcion: "Una salida sencilla a un parque o mirador, con snacks, una manta y buena compañía para ver el atardecer.",
    categoria: "parejas",
    tipo: "cita",
    ocasion: "cita",
    presupuesto: "economico",
    duracion: "2 horas",
    tiempo: "1-2h",
    dificultad: "facil",
    personas: null,
    materiales: ["Manta", "Snacks y bebidas", "Bocina pequeña (opcional)"],
    instrucciones: [
      "Elige un parque o mirador con buena vista al atardecer.",
      "Prepara snacks fáciles de transportar.",
      "Llega con tiempo para instalarse antes de que empiece a caer el sol.",
      "Lleven una lista de música para ambientar el momento."
    ],
    pinterest: "https://www.pinterest.com/search/pins/?q=picnic%20romantico%20atardecer",
    tiktok: "https://www.tiktok.com/search?q=picnic%20romantico",
    instagram: "https://www.instagram.com/explore/tags/picnicromantico/",
    estado: "aprobada",
    autor: "Equipo Juntos",
    fecha: "2026-02-18",
    vistas: 610
  },
  {
    id: 3,
    nombre: "Cena a la luz de las velas en casa",
    descripcion: "Recrea la experiencia de un restaurante elegante sin salir de casa, con un menú sencillo y buena ambientación.",
    categoria: "parejas",
    tipo: "cita",
    ocasion: "san-valentin",
    presupuesto: "medio",
    duracion: "2 horas",
    tiempo: "1-2h",
    dificultad: "intermedia",
    personas: null,
    materiales: ["Velas", "Mantel", "Ingredientes para el menú", "Música ambiental"],
    instrucciones: [
      "Elijan juntos un menú de 2 o 3 tiempos.",
      "Preparen la mesa con mantel, velas y vajilla especial.",
      "Cocinen juntos o sorpréndanse turnándose los platos.",
      "Bajen las luces y dejen que la música ambiente la noche."
    ],
    pinterest: "https://www.pinterest.com/search/pins/?q=cena%20romantica%20en%20casa",
    tiktok: "https://www.tiktok.com/search?q=cena%20romantica%20en%20casa",
    instagram: "https://www.instagram.com/explore/tags/cenaromantica/",
    estado: "aprobada",
    autor: "Equipo Juntos",
    fecha: "2026-01-22",
    vistas: 754
  },
  {
    id: 4,
    nombre: "Álbum de fotos hecho a mano",
    descripcion: "Un scrapbook con las fotos y anécdotas más importantes de la relación, ideal para regalar en una fecha especial.",
    categoria: "parejas",
    tipo: "manualidad",
    ocasion: "aniversario",
    presupuesto: "economico",
    duracion: "3 horas",
    tiempo: "medio-dia",
    dificultad: "dificil",
    personas: null,
    materiales: ["Álbum o cuaderno en blanco", "Fotos impresas", "Marcadores y pegamento", "Stickers y washi tape"],
    instrucciones: [
      "Selecciona las fotos más significativas de la relación.",
      "Organízalas por fecha o por tipo de recuerdo.",
      "Decora cada página contando la historia detrás de cada foto.",
      "Agrega una dedicatoria en la última página."
    ],
    pinterest: "https://www.pinterest.com/search/pins/?q=scrapbook%20pareja",
    tiktok: "https://www.tiktok.com/search?q=scrapbook%20pareja",
    instagram: "https://www.instagram.com/explore/tags/scrapbookpareja/",
    estado: "aprobada",
    autor: "Equipo Juntos",
    fecha: "2026-04-09",
    vistas: 331
  },
  {
    id: 5,
    nombre: "Escapada de fin de semana",
    descripcion: "Una salida corta a un destino cercano para desconectarse juntos, sin necesidad de planear un viaje grande.",
    categoria: "parejas",
    tipo: "salida",
    ocasion: "cumpleanos",
    presupuesto: "alto",
    duracion: "todo el día",
    tiempo: "todo-el-dia",
    dificultad: "facil",
    personas: null,
    materiales: ["Reserva de hospedaje", "Transporte", "Maleta ligera"],
    instrucciones: [
      "Elijan un destino a máximo 2-3 horas de distancia.",
      "Reserven el hospedaje con anticipación.",
      "Dejen al menos medio día libre sin planes fijos.",
      "Aprovechen para desconectarse del celular el mayor tiempo posible."
    ],
    pinterest: "https://www.pinterest.com/search/pins/?q=escapada%20de%20fin%20de%20semana%20en%20pareja",
    tiktok: "https://www.tiktok.com/search?q=escapada%20fin%20de%20semana%20pareja",
    instagram: "https://www.instagram.com/explore/tags/escapadaenpareja/",
    estado: "aprobada",
    autor: "Equipo Juntos",
    fecha: "2026-05-02",
    vistas: 298
  },
  {
    id: 6,
    nombre: "Carta con frases del inicio de la relación",
    descripcion: "Una carta escrita a mano recordando cómo empezó todo, ideal como detalle simple pero significativo.",
    categoria: "parejas",
    tipo: "detalle",
    ocasion: "dia-especial",
    presupuesto: "gratis",
    duracion: "1 hora",
    tiempo: "menos-1h",
    dificultad: "facil",
    personas: null,
    materiales: ["Papel y sobre", "Bolígrafo"],
    instrucciones: [
      "Recuerda los primeros mensajes, citas o momentos importantes.",
      "Escribe la carta como si estuvieras contando esa historia.",
      "Cierra con una frase sobre lo que sientes hoy.",
      "Entrégala en un sobre decorado a mano."
    ],
    pinterest: "https://www.pinterest.com/search/pins/?q=carta%20de%20amor%20escrita%20a%20mano",
    tiktok: "https://www.tiktok.com/search?q=carta%20de%20amor",
    instagram: "https://www.instagram.com/explore/tags/cartadeamor/",
    estado: "aprobada",
    autor: "Equipo Juntos",
    fecha: "2026-01-30",
    vistas: 402
  },
  {
    id: 7,
    nombre: "Clase de cocina en pareja",
    descripcion: "Aprendan juntos a preparar un platillo nuevo, en casa o en una clase presencial, como plan diferente para una cita.",
    categoria: "parejas",
    tipo: "actividad",
    ocasion: "cita",
    presupuesto: "medio",
    duracion: "2 horas",
    tiempo: "1-2h",
    dificultad: "intermedia",
    personas: null,
    materiales: ["Ingredientes según la receta", "Delantales (opcional)"],
    instrucciones: [
      "Elijan una receta que ninguno de los dos haya preparado antes.",
      "Compren los ingredientes juntos o repártanse la lista.",
      "Cocinen en equipo, turnándose los pasos.",
      "Disfruten el resultado con una mesa bien puesta."
    ],
    pinterest: "https://www.pinterest.com/search/pins/?q=clase%20de%20cocina%20en%20pareja",
    tiktok: "https://www.tiktok.com/search?q=cocinar%20en%20pareja",
    instagram: "https://www.instagram.com/explore/tags/cocinarenpareja/",
    estado: "aprobada",
    autor: "Equipo Juntos",
    fecha: "2026-02-27",
    vistas: 265
  },
  {
    id: 8,
    nombre: "Flores y nota sorpresa en el trabajo",
    descripcion: "Un pequeño gesto para alegrar el día: enviar o llevar flores con una nota corta, sin necesidad de ocasión especial.",
    categoria: "parejas",
    tipo: "sorpresa",
    ocasion: "sin-ocasion",
    presupuesto: "economico",
    duracion: "1 hora",
    tiempo: "menos-1h",
    dificultad: "facil",
    personas: null,
    materiales: ["Ramo pequeño de flores", "Nota corta"],
    instrucciones: [
      "Elige un ramo sencillo, no hace falta que sea grande.",
      "Escribe una nota breve y honesta.",
      "Coordina la entrega para que sea una sorpresa real.",
      "Si no puedes ir en persona, pide ayuda a alguien de confianza para entregarlo."
    ],
    pinterest: "https://www.pinterest.com/search/pins/?q=sorpresa%20de%20flores%20en%20el%20trabajo",
    tiktok: "https://www.tiktok.com/search?q=sorpresa%20de%20flores",
    instagram: "https://www.instagram.com/explore/tags/sorpresadeflores/",
    estado: "aprobada",
    autor: "Equipo Juntos",
    fecha: "2026-03-15",
    vistas: 519
  },
  {
    id: 9,
    nombre: "Noche de juegos de mesa en casa",
    descripcion: "Una noche relajada jugando juegos de mesa o de cartas, ideal para reconectar sin gastar mucho.",
    categoria: "parejas",
    tipo: "cita",
    ocasion: "reconciliacion",
    presupuesto: "gratis",
    duracion: "2 horas",
    tiempo: "1-2h",
    dificultad: "facil",
    personas: null,
    materiales: ["Juegos de mesa o cartas", "Snacks"],
    instrucciones: [
      "Elijan 2 o 3 juegos que ambos disfruten.",
      "Preparen snacks sencillos para picar mientras juegan.",
      "Dejen el celular a un lado durante ese rato.",
      "Aprovechen para hablar con calma entre partida y partida."
    ],
    pinterest: "https://www.pinterest.com/search/pins/?q=noche%20de%20juegos%20de%20mesa%20en%20pareja",
    tiktok: "https://www.tiktok.com/search?q=noche%20de%20juegos%20de%20mesa",
    instagram: "https://www.instagram.com/explore/tags/nochedejuegos/",
    estado: "pendiente",
    autor: "Valentina R.",
    fecha: "2026-07-19",
    vistas: 47
  },
  {
    id: 10,
    nombre: "Sesión de fotos espontánea en la ciudad",
    descripcion: "Un recorrido corto por lugares con buena luz o color, tomándose fotos espontáneas como recuerdo del día.",
    categoria: "parejas",
    tipo: "actividad",
    ocasion: "aniversario",
    presupuesto: "economico",
    duracion: "2 horas",
    tiempo: "1-2h",
    dificultad: "intermedia",
    personas: null,
    materiales: ["Celular o cámara", "Ropa cómoda"],
    instrucciones: [
      "Elijan 2 o 3 puntos de la ciudad con buena luz natural.",
      "Vayan a media tarde para aprovechar la luz dorada.",
      "Tómense fotos espontáneas, sin forzar poses.",
      "Elijan juntos sus 5 favoritas para imprimir después."
    ],
    pinterest: "https://www.pinterest.com/search/pins/?q=sesion%20de%20fotos%20espontanea%20pareja",
    tiktok: "https://www.tiktok.com/search?q=fotos%20espontaneas%20pareja",
    instagram: "https://www.instagram.com/explore/tags/fotosenpareja/",
    estado: "aprobada",
    autor: "Equipo Juntos",
    fecha: "2026-04-21",
    vistas: 373
  },

  // ============ AMIGOS ============

  {
    id: 11,
    nombre: "Noche de trivia en casa",
    descripcion: "Organiza una trivia casera con categorías elegidas por el grupo, ideal para una reunión sin gastar de más.",
    categoria: "amigos",
    tipo: "juego",
    ocasion: "reunion",
    presupuesto: "gratis",
    duracion: "2 horas",
    tiempo: "1-2h",
    dificultad: "facil",
    personas: "3-5",
    materiales: ["Preguntas preparadas o app de trivia", "Papel y lápiz", "Snacks"],
    instrucciones: [
      "Definan las categorías de preguntas entre todos.",
      "Formen equipos de 2 personas.",
      "Lleven el puntaje en una hoja visible.",
      "El equipo ganador elige el snack de la próxima reunión."
    ],
    pinterest: "https://www.pinterest.com/search/pins/?q=noche%20de%20trivia%20con%20amigos",
    tiktok: "https://www.tiktok.com/search?q=noche%20de%20trivia",
    instagram: "https://www.instagram.com/explore/tags/nochedetrivia/",
    estado: "aprobada",
    autor: "Equipo Juntos",
    fecha: "2026-02-11",
    vistas: 288
  },
  {
    id: 12,
    nombre: "Torneo de videojuegos",
    descripcion: "Un torneo casero con el juego favorito del grupo, con eliminatorias y un pequeño premio simbólico.",
    categoria: "amigos",
    tipo: "juego",
    ocasion: "celebracion",
    presupuesto: "economico",
    duracion: "3 horas",
    tiempo: "medio-dia",
    dificultad: "facil",
    personas: "6-10",
    materiales: ["Consola o PC", "Controles adicionales", "Snacks y bebidas"],
    instrucciones: [
      "Elijan el juego y el formato del torneo (eliminación directa o puntos).",
      "Armen un cuadro con los enfrentamientos.",
      "Definan un premio simbólico para el ganador.",
      "Jueguen las rondas con tiempo límite por partida."
    ],
    pinterest: "https://www.pinterest.com/search/pins/?q=torneo%20de%20videojuegos%20con%20amigos",
    tiktok: "https://www.tiktok.com/search?q=torneo%20de%20videojuegos",
    instagram: "https://www.instagram.com/explore/tags/torneogamer/",
    estado: "aprobada",
    autor: "Equipo Juntos",
    fecha: "2026-03-08",
    vistas: 356
  },
  {
    id: 13,
    nombre: "Ruta de food trucks",
    descripcion: "Un recorrido por distintos puestos de comida callejera o food trucks de la ciudad, probando un poco de cada uno.",
    categoria: "amigos",
    tipo: "plan-economico",
    ocasion: "dia-especial",
    presupuesto: "economico",
    duracion: "medio día",
    tiempo: "medio-dia",
    dificultad: "facil",
    personas: "3-5",
    materiales: ["Efectivo o tarjeta", "Ropa cómoda para caminar"],
    instrucciones: [
      "Investiguen 3 o 4 puestos con buenas reseñas.",
      "Definan una ruta a pie o en transporte entre ellos.",
      "Pidan porciones pequeñas para poder probar de todo.",
      "Terminen el recorrido con un postre en el último punto."
    ],
    pinterest: "https://www.pinterest.com/search/pins/?q=ruta%20de%20food%20trucks",
    tiktok: "https://www.tiktok.com/search?q=food%20trucks%20con%20amigos",
    instagram: "https://www.instagram.com/explore/tags/foodtrucks/",
    estado: "aprobada",
    autor: "Equipo Juntos",
    fecha: "2026-05-14",
    vistas: 214
  },
  {
    id: 14,
    nombre: "Escape room",
    descripcion: "Reserven una sala de escape temática y pongan a prueba al grupo resolviendo acertijos contra el reloj.",
    categoria: "amigos",
    tipo: "actividad",
    ocasion: "celebracion",
    presupuesto: "medio",
    duracion: "1 hora",
    tiempo: "menos-1h",
    dificultad: "intermedia",
    personas: "3-5",
    materiales: ["Reserva previa", "Grupo de 3 a 6 personas"],
    instrucciones: [
      "Elijan una sala según el tema que más les llame la atención.",
      "Reserven con anticipación, sobre todo en fin de semana.",
      "Lleguen 15 minutos antes para las indicaciones.",
      "Comuníquense bien dentro de la sala: cada pista cuenta."
    ],
    pinterest: "https://www.pinterest.com/search/pins/?q=escape%20room%20con%20amigos",
    tiktok: "https://www.tiktok.com/search?q=escape%20room",
    instagram: "https://www.instagram.com/explore/tags/escaperoom/",
    estado: "aprobada",
    autor: "Equipo Juntos",
    fecha: "2026-01-27",
    vistas: 447
  },
  {
    id: 15,
    nombre: "Asado o parrillada en el patio",
    descripcion: "Una reunión clásica de grupo grande, con comida a la parrilla, música y juegos al aire libre.",
    categoria: "amigos",
    tipo: "reunion",
    ocasion: "cumpleanos",
    presupuesto: "medio",
    duracion: "todo el día",
    tiempo: "todo-el-dia",
    dificultad: "facil",
    personas: "6-10",
    materiales: ["Carne y acompañamientos", "Parrilla y carbón", "Bocina para música"],
    instrucciones: [
      "Repartan la lista de compras entre todos.",
      "Preparen la parrilla con anticipación.",
      "Organicen algún juego de patio para antes o después de comer.",
      "Dejen a alguien encargado de la música durante el día."
    ],
    pinterest: "https://www.pinterest.com/search/pins/?q=asado%20con%20amigos",
    tiktok: "https://www.tiktok.com/search?q=parrillada%20con%20amigos",
    instagram: "https://www.instagram.com/explore/tags/asadoconamigos/",
    estado: "aprobada",
    autor: "Equipo Juntos",
    fecha: "2026-06-02",
    vistas: 392
  },
  {
    id: 16,
    nombre: "Maratón de películas con snacks",
    descripcion: "Un plan tranquilo en casa para ver varias películas seguidas, con snacks y pijama incluida.",
    categoria: "amigos",
    tipo: "reunion",
    ocasion: "sin-ocasion",
    presupuesto: "gratis",
    duracion: "todo el día",
    tiempo: "todo-el-dia",
    dificultad: "facil",
    personas: "3-5",
    materiales: ["Snacks variados", "Mantas y cojines", "Lista de películas"],
    instrucciones: [
      "Elijan juntos las películas antes de empezar.",
      "Preparen el espacio con mantas y cojines suficientes.",
      "Dejen listos los snacks para no interrumpir tanto.",
      "Hagan una pausa entre película y película para estirar las piernas."
    ],
    pinterest: "https://www.pinterest.com/search/pins/?q=maraton%20de%20peliculas%20con%20amigos",
    tiktok: "https://www.tiktok.com/search?q=maraton%20de%20peliculas",
    instagram: "https://www.instagram.com/explore/tags/maratondepeliculas/",
    estado: "aprobada",
    autor: "Equipo Juntos",
    fecha: "2026-02-05",
    vistas: 501
  },
  {
    id: 17,
    nombre: "Caminata a un mirador",
    descripcion: "Una salida activa en grupo hacia un mirador o sendero cercano, ideal para conversar y desconectarse un rato.",
    categoria: "amigos",
    tipo: "salida",
    ocasion: "dia-especial",
    presupuesto: "gratis",
    duracion: "medio día",
    tiempo: "medio-dia",
    dificultad: "intermedia",
    personas: "6-10",
    materiales: ["Agua y snacks", "Zapatos cómodos", "Protector solar"],
    instrucciones: [
      "Elijan un sendero apto para el nivel del grupo.",
      "Salgan temprano para evitar el calor fuerte.",
      "Lleven suficiente agua para todos.",
      "Aprovechen el mirador para tomarse fotos grupales."
    ],
    pinterest: "https://www.pinterest.com/search/pins/?q=caminata%20a%20un%20mirador%20con%20amigos",
    tiktok: "https://www.tiktok.com/search?q=caminata%20mirador",
    instagram: "https://www.instagram.com/explore/tags/caminataamigos/",
    estado: "aprobada",
    autor: "Equipo Juntos",
    fecha: "2026-04-30",
    vistas: 176
  },
  {
    id: 18,
    nombre: "Clase grupal de baile",
    descripcion: "Una clase de baile en grupo, presencial o improvisada en casa, como plan diferente y activo para el grupo.",
    categoria: "amigos",
    tipo: "actividad",
    ocasion: "celebracion",
    presupuesto: "economico",
    duracion: "1 hora",
    tiempo: "menos-1h",
    dificultad: "intermedia",
    personas: "mas-10",
    materiales: ["Espacio amplio", "Bocina", "Ropa cómoda"],
    instrucciones: [
      "Elijan el estilo de baile que más les llame la atención.",
      "Consigan un espacio con suficiente lugar para moverse.",
      "Sigan un tutorial o contraten a un instructor por una sesión.",
      "Terminen con un pequeño 'show' grupal de lo aprendido."
    ],
    pinterest: "https://www.pinterest.com/search/pins/?q=clase%20de%20baile%20grupal",
    tiktok: "https://www.tiktok.com/search?q=clase%20de%20baile%20con%20amigos",
    instagram: "https://www.instagram.com/explore/tags/clasedebaile/",
    estado: "aprobada",
    autor: "Equipo Juntos",
    fecha: "2026-03-22",
    vistas: 239
  },
  {
    id: 19,
    nombre: "Regalo grupal para el cumpleañero",
    descripcion: "En vez de varios regalos pequeños, el grupo se organiza para dar un solo regalo especial entre todos.",
    categoria: "amigos",
    tipo: "regalo",
    ocasion: "cumpleanos",
    presupuesto: "medio",
    duracion: "1 hora",
    tiempo: "menos-1h",
    dificultad: "facil",
    personas: "3-5",
    materiales: ["Fondo grupal", "Lista de ideas de regalo"],
    instrucciones: [
      "Abran un fondo común entre los interesados.",
      "Propongan 2 o 3 opciones de regalo y voten.",
      "Designen a una persona para comprarlo y envolverlo.",
      "Acompañen el regalo con una tarjeta firmada por todos."
    ],
    pinterest: "https://www.pinterest.com/search/pins/?q=regalo%20grupal%20de%20cumpleanos",
    tiktok: "https://www.tiktok.com/search?q=regalo%20grupal%20cumpleanos",
    instagram: "https://www.instagram.com/explore/tags/regalogrupal/",
    estado: "pendiente",
    autor: "Carlos M.",
    fecha: "2026-07-25",
    vistas: 31
  },
  {
    id: 20,
    nombre: "Karaoke en casa",
    descripcion: "Una noche de karaoke casero con lista de canciones armada entre todos, sin necesidad de salir.",
    categoria: "amigos",
    tipo: "experiencia",
    ocasion: "sin-ocasion",
    presupuesto: "economico",
    duracion: "2 horas",
    tiempo: "1-2h",
    dificultad: "facil",
    personas: "6-10",
    materiales: ["Micrófono o app de karaoke", "Bocina", "Lista de canciones"],
    instrucciones: [
      "Armen la lista de canciones entre todos antes de empezar.",
      "Definan el orden de participación o háganlo libre.",
      "Puntúen las presentaciones si quieren darle un toque de competencia.",
      "Cierren la noche con una canción grupal."
    ],
    pinterest: "https://www.pinterest.com/search/pins/?q=karaoke%20con%20amigos%20en%20casa",
    tiktok: "https://www.tiktok.com/search?q=karaoke%20con%20amigos",
    instagram: "https://www.instagram.com/explore/tags/karaokeconamigos/",
    estado: "rechazada",
    autor: "Andrés P.",
    fecha: "2026-06-30",
    vistas: 12
  }

];

/* ============================================================
   Estadísticas ficticias para el dashboard de administración.
   No se derivan de IDEAS_DATA porque representan datos que,
   en una versión con backend, vendrían de otras tablas
   (usuarios, planes creados por usuarios, etc).
   ============================================================ */
window.APP_STATS = {
  usuarios: 128,
  planesCreados: 342
};
