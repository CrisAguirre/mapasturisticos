import {
  FaBreadSlice,
  FaFire,
  FaIceCream,
  FaLeaf,
  FaPalette,
  FaPaw,
  FaSeedling,
  FaTractor,
  FaUtensils,
} from 'react-icons/fa';
import fotoAlSon from '../assets/media/3mujeres-web/al-son-de-la-cuchara.jpg';
import fotoCasaLuna from '../assets/media/3mujeres-web/casa-luna.jpg';
import fotoCasita from '../assets/media/3mujeres-web/casita-de-los-sabores.jpg';
import fotoArrayanes from '../assets/media/3mujeres-web/finca-los-arrayanes.jpg';
import fotoJardin from '../assets/media/3mujeres-web/jardin-de-mama-luz.jpg';
import fotoAbuela from '../assets/media/3mujeres-web/sabores-y-saberes-de-la-abuela.jpg';
import fotoThanysol from '../assets/media/3mujeres-web/thanysol.jpg';
import fotoSanLuis from '../assets/media/3mujeres-web/tradicion-san-luis.jpg';

// Filtros por oficio. El id coincide con el campo `filtro` de cada ficha.
export const FILTROS = [
  { id: 'todos', label: 'Todos', icon: FaFire },
  { id: 'cocina', label: 'Cocina', icon: FaUtensils },
  { id: 'naturaleza', label: 'Naturaleza', icon: FaLeaf },
  { id: 'campo', label: 'Campo', icon: FaTractor },
  { id: 'arte', label: 'Arte', icon: FaPalette },
  { id: 'dulces', label: 'Dulces', icon: FaIceCream },
];

// Fichas construidas con el documento "fichas de emprendedoras.docx".
// `foto: null` deja el espacio previsto para cuando llegue la imagen.
export const EMPRENDIMIENTOS = [
  {
    id: 'al-son-de-la-cuchara',
    num: '01',
    name: 'Al Son de la Cuchara',
    tagline: 'Sabores de la tierra y encuentros con la naturaleza',
    owner: 'Lidia del Rosario Hidalgo',
    lugar: 'Cabrera centro · Pasto',
    anio: null,
    cat: 'Cocina tradicional',
    filtro: 'cocina',
    icon: FaUtensils,
    c1: '#f97316',
    c2: '#7c2d12',
    foto: fotoAlSon,
    resumen:
      'Platos típicos y una Mini-Granja con animales domésticos y exóticos: cocina, campo y familia en un mismo paseo.',
    lead:
      'En el centro poblado de Cabrera, Al Son de la Cuchara convierte los sabores tradicionales en una invitación a descubrir la riqueza culinaria del territorio. Detrás de la mesa está Lidia del Rosario Hidalgo, una mujer lideresa que ha construido espacios que acogen, conectan y enamoran.',
    secciones: [
      {
        titulo: 'Una historia que se sirve con sabor',
        texto:
          'El restaurante es el resultado del esfuerzo y la visión de su propietaria, quien ha trabajado con dedicación para ofrecer una cocina de casa, generosa y llena de memoria. Cada plato es una puerta de entrada a los sabores del corredor oriental de Pasto.',
      },
      {
        titulo: 'Mini-Granja, la segunda sede',
        texto:
          'A pocos pasos de la mesa, la Mini-Granja amplía la experiencia con llamas, ovejas, cabras, cuyes exóticos, conejos, cerdos miniatura, pavos reales, gallos, chumbos y gallinetas. Es un encuentro cercano con la vida rural que despierta la curiosidad de visitantes de todas las edades.',
      },
      {
        titulo: 'Una experiencia para el turismo comunitario',
        texto:
          'Visitar Al Son de la Cuchara es regalarse un momento de tranquilidad, contemplar la vida animal y compartir un espacio donde el entorno rural es protagonista. Gastronomía, naturaleza y hospitalidad se integran en una alternativa para descubrir el territorio.',
      },
    ],
    claves: ['Platos típicos', 'Mini-Granja', 'Animales de granja', 'Paseo campestre', 'Visitas familiares'],
    cierre:
      'Sabores de nuestra tierra, encuentros con la naturaleza y la calidez de una mujer que hace de su emprendimiento un lugar para compartir.',
  },
  {
    id: 'jardin-de-mama-luz',
    num: '02',
    name: 'Jardín de Mamá Luz',
    tagline: 'Naturaleza, saberes y experiencias para reconectar con la vida',
    owner: 'Ángela Patricia de la Cruz',
    lugar: 'Vereda Buenavista · Cabrera',
    anio: 2020,
    cat: 'Naturaleza y vivero',
    filtro: 'naturaleza',
    icon: FaLeaf,
    c1: '#22c55e',
    c2: '#065f46',
    foto: fotoJardin,
    resumen:
      'Terrarios, huertas, flores y vivero nacidos de los saberes de su madre: un jardín para caminar, respirar y aprender.',
    lead:
      'Jardín de Mamá Luz nació en 2020, en medio de la pandemia, acercando la naturaleza a los hogares con pequeños terrarios y minijardines. Lo que empezó como una forma de cultivar paciencia y bienestar se convirtió en un espacio para recorrer, aprender y compartir.',
    secciones: [
      {
        titulo: 'Una semilla que floreció en el territorio',
        texto:
          'Ángela Patricia de la Cruz encontró en los conocimientos heredados de su madre la inspiración para dar vida al emprendimiento. De esa relación cotidiana con el campo y las plantas surgieron saberes que, con el tiempo, se transformaron en un proyecto propio.',
      },
      {
        titulo: 'Un jardín para caminar y aprender',
        texto:
          'Huertas de hortalizas, cultivos de flores, plantas ornamentales, suculentas y un vivero especializado invitan a descubrir el mundo vegetal. A ellos se suman las aromáticas que evocan los sabores de la región y rincones para caminar sin afán, respirar y escuchar el canto de las aves.',
      },
      {
        titulo: 'Más que productos, saberes que se comparten',
        texto:
          'La experiencia se complementa con yogur natural, yogur de frutas y yogur griego elaborados artesanalmente. Quienes llegan encuentran plantas, productos e historias: la oportunidad de aprender sobre el cuidado de la naturaleza y los conocimientos que pasan de una generación a otra.',
      },
    ],
    claves: ['Terrarios y minijardines', 'Vivero y suculentas', 'Huerta y aromáticas', 'Yogur artesanal', 'Caminatas y aves'],
    cierre:
      'Un lugar donde la naturaleza florece, los saberes se heredan y cada visita deja una semilla de conocimiento.',
  },
  {
    id: 'finca-los-arrayanes',
    num: '03',
    name: 'Finca Agroturística Los Arrayanes',
    tagline: 'Memoria campesina, sabores tradicionales y experiencias vivas con la tierra',
    owner: 'Roxana Ramos Botina',
    rol: 'Copropietaria',
    lugar: 'Vereda Aguapamba · San Pedro de La Laguna',
    anio: null,
    cat: 'Agroturismo',
    filtro: 'campo',
    icon: FaTractor,
    c1: '#14b8a6',
    c2: '#134e4a',
    foto: fotoArrayanes,
    resumen:
      'Chagra, alojamiento rural y las sopas de los abuelitos: una finca que abre sus puertas para vivir el campo desde adentro.',
    lead:
      'La Finca Agroturística Los Arrayanes nace del deseo de preservar las tradiciones campesinas que han pasado de generación en generación. Su propuesta parte de una convicción: el campo guarda una riqueza invaluable en sus formas de cultivar, preparar los alimentos y compartir en familia.',
    secciones: [
      {
        titulo: 'Un legado entre la tierra y la tradición',
        texto:
          'El emprendimiento busca dar valor agregado a la finca, a la chagra y a las recetas tradicionales, reconociendo en cada una una expresión de la memoria familiar y comunitaria. Las sopas de los abuelitos conservan sabores, conocimientos y recuerdos que merecen seguir transmitiéndose.',
      },
      {
        titulo: 'Vivir el campo desde adentro',
        texto:
          'Los recorridos vivenciales permiten descubrir la chagra, reconocer sus cultivos y observar especies menores como los cuyes exóticos. También es posible alojarse en la finca y participar en labores del campo: sembrar, observar y comprender el trabajo que hay detrás de los alimentos.',
      },
      {
        titulo: 'La chagra y la cocina como herencia viva',
        texto:
          'La tierra proporciona los alimentos y la cocina los transforma en preparaciones que reúnen conocimientos, afectos y memorias. Cada recorrido busca despertar la memoria, evocar las formas de vida de los antepasados y propiciar un encuentro entre generaciones.',
      },
    ],
    claves: ['Recorridos vivenciales', 'Chagra', 'Alojamiento rural', 'Cuyes exóticos', 'Sopas tradicionales'],
    cierre:
      'Un encuentro con la memoria campesina, donde la tierra enseña, la tradición alimenta y cada experiencia nos acerca a nuestras raíces.',
  },
  {
    id: 'thanysol',
    num: '04',
    name: 'Thanysol',
    tagline: 'De la tierra al cuidado natural: flores, aromas y transformación campesina',
    owner: 'Margoth Catalina Buesaquillo',
    lugar: 'Vereda Aguapamba · La Laguna',
    anio: null,
    cat: 'Plantas y bienestar',
    filtro: 'naturaleza',
    icon: FaSeedling,
    c1: '#a3e635',
    c2: '#3f6212',
    foto: fotoThanysol,
    resumen:
      'Flores y aromáticas transformadas en aceites, pomadas y champús, con energía solar y una apuesta por el campo.',
    lead:
      'Thanysol nace del gusto de Margoth Catalina Buesaquillo por las plantas y las flores, pero también de una reflexión sobre la realidad del campo: vender los productos sin transformar no siempre garantiza una remuneración justa. De esa inquietud surgió una apuesta por dar valor agregado a la cosecha.',
    secciones: [
      {
        titulo: 'Una idea que florece',
        texto:
          'La experiencia familiar, ligada durante años a las labores del campo, le permitió reconocer las dificultades de los productores cuando los precios dependen del mercado o cuando no encuentran compradores. Así comenzó a tomar forma un emprendimiento que transforma flores, plantas aromáticas y condimentarias.',
      },
      {
        titulo: 'Flores que se transforman en bienestar',
        texto:
          'A través de la deshidratación de flores como la caléndula y la manzanilla, Thanysol elabora aceites, pomadas y champús para el cuidado personal. También cultiva aromáticas y condimentarias que aportan aromas y sabores a las preparaciones culinarias, ampliando sus posibilidades de uso y comercialización.',
      },
      {
        titulo: 'Sostenibilidad y economía popular',
        texto:
          'El uso de energía solar en la elaboración de sus productos y la apuesta por insumos orgánicos expresan un interés por prácticas más respetuosas con el medio ambiente. La iniciativa demuestra que el valor del campo no termina en la cosecha: también está en el conocimiento y la creatividad.',
      },
    ],
    claves: ['Caléndula y manzanilla', 'Aceites y pomadas', 'Champús naturales', 'Aromáticas y condimentarias', 'Energía solar'],
    cierre:
      'Transformar lo que nace de la tierra para cultivar nuevas oportunidades, cuidar la naturaleza y reconocer el valor del trabajo campesino.',
  },
  {
    id: 'casa-luna',
    num: '05',
    name: 'Casa Luna',
    tagline: 'Un encuentro con el arte, la memoria y la magia del Carnaval de Negros y Blancos',
    owner: 'Karolina Sánchez',
    lugar: 'Vereda Centro · Cabrera',
    anio: 2020,
    cat: 'Arte y carnaval',
    filtro: 'arte',
    icon: FaPalette,
    c1: '#ec4899',
    c2: '#4c1d95',
    foto: fotoCasaLuna,
    resumen:
      'Un espacio donde el carnaval no espera a enero: danza, música, trajes y pintura para vivir la fiesta todo el año.',
    lead:
      'Casa Luna nació en 2020, en medio de la pandemia, del amor al arte y a una de las expresiones culturales más representativas de Nariño: el Carnaval de Negros y Blancos. Karolina Sánchez, artista vinculada al universo carnavalero, encontró aquí una forma de mantener vivo el espíritu de la fiesta incluso cuando las calles no se llenan de comparsas.',
    secciones: [
      {
        titulo: 'El carnaval vive todo el año',
        texto:
          'Desde el corregimiento de Cabrera, la iniciativa invita a turistas y visitantes a descubrir que el carnaval es mucho más que una celebración: es memoria colectiva, creatividad, identidad y una forma de narrar quiénes somos como pueblo.',
      },
      {
        titulo: 'Sentir y vivir el carnaval',
        texto:
          'La experiencia es participativa: danza y música tradicional, relatos sobre historias y tradiciones, y la posibilidad de conocer y probarse trajes y tocados. Se suman las técnicas artísticas del carnaval, el juego con espuma, la pinta carnavalera y el préstamo de trajes y accesorios.',
      },
      {
        titulo: 'Una artista que abre las puertas de su cultura',
        texto:
          'Karolina comparte su experiencia para acercar a otras personas al universo del Carnaval de Negros y Blancos y reconocer el trabajo de quienes crean, danzan, interpretan y mantienen viva esta manifestación cultural. Casa Luna amplía las posibilidades de circulación del arte y del patrimonio inmaterial nariñense.',
      },
    ],
    claves: ['Danza y música', 'Trajes y tocados', 'Relatos del carnaval', 'Pinta carnavalera', 'Juego con espuma'],
    cierre:
      'Un rincón de Cabrera donde el carnaval no espera a enero, porque la memoria, el arte y la alegría se celebran durante todo el año.',
  },
  {
    id: 'tradiciones-marucha',
    num: '06',
    name: 'Tradiciones Nariñenses Marucha',
    tagline: 'Dulces tradicionales, recetas artesanales y sabor de hogar',
    owner: 'Emprendimiento familiar',
    lugar: 'Sector El Solar · Jongovito',
    anio: null,
    cat: 'Dulces tradicionales',
    filtro: 'dulces',
    icon: FaIceCream,
    c1: '#fb7185',
    c2: '#7c2d12',
    foto: null,
    resumen:
      'Dulces de chilacuán, mora, guayaba y calabaza; arequipe, obleas y miel con cuajada hechos sin conservantes.',
    lead:
      'Tradiciones Nariñenses Marucha es un emprendimiento familiar de Pasto que nace del deseo de compartir los sabores de la tierra y acompañar esos momentos especiales que merecen un toque dulce. Su propuesta se inspira en la tradición gastronómica nariñense y en el valor de las preparaciones artesanales.',
    secciones: [
      {
        titulo: 'Una tradición que endulza los momentos de la vida',
        texto:
          'Los dulces no son solamente alimentos: también son recuerdos, expresiones de afecto y pequeños placeres que acompañan los encuentros y las celebraciones cotidianas. Cada preparación busca mantener presentes los sabores que hacen parte de la identidad culinaria de Nariño.',
      },
      {
        titulo: 'Sabores que conservan la identidad',
        texto:
          'La oferta reúne dulces de chilacuán, mora, fresa, guayaba, calabaza, brevas y uvilla, además de tomate de árbol, arequipe, cortado de leche, crema tres leches y miel con cuajada. También incluye obleas, mosaicos de gelatina con fresas y crema, y otras opciones para compartir.',
      },
      {
        titulo: 'Hechos con dedicación, pensados para compartir',
        texto:
          'La elaboración artesanal, sin conservantes añadidos, busca transmitir cercanía y sabor casero. La propuesta acompaña ocasiones significativas —un regalo, una mesa dulce o un cumpleaños— y fortalece la economía popular a través del trabajo artesanal.',
      },
    ],
    claves: ['Dulces de fruta', 'Arequipe y cortado', 'Obleas y mosaicos', 'Miel con cuajada', 'Sin conservantes'],
    cierre:
      'Dulces que evocan nuestra tierra, despiertan recuerdos y convierten cada momento en una ocasión para compartir.',
  },
  {
    id: 'tradicion-san-luis',
    num: '07',
    name: 'Tradición San Luis',
    tagline: 'Herencia familiar, crianza de cuyes y saberes campesinos',
    owner: 'Marina Isabel Guerrero Jojoa',
    lugar: 'Vereda San Luis · San Pedro de La Laguna',
    anio: null,
    cat: 'Crianza de cuyes',
    filtro: 'campo',
    icon: FaPaw,
    c1: '#f59e0b',
    c2: '#78350f',
    foto: fotoSanLuis,
    resumen:
      'Tres generaciones criando cuyes criollos y exóticos: pie de cría, calidad y una tradición que sostiene a una familia.',
    lead:
      'Tradición San Luis tiene sus raíces en una historia familiar ligada a la crianza de cuyes, una práctica profundamente arraigada en la vida campesina y en la cultura gastronómica de Nariño. Sus orígenes están en el trabajo de los padres de Marina Isabel Guerrero Jojoa, quienes encontraron en esta actividad una fuente de sustento para el hogar.',
    secciones: [
      {
        titulo: 'Una tradición que se cría generación tras generación',
        texto:
          'Con los años, el conocimiento continuó en la familia. La hermana mayor asumió también la crianza y fortaleció una actividad que representa una oportunidad económica y una herencia de saberes transmitidos mediante la práctica y la convivencia. La formación recibida sobre mejores prácticas amplió los conocimientos y se compartió dentro de la familia.',
      },
      {
        titulo: 'Calidad y conocimiento en la crianza del cuy',
        texto:
          'El emprendimiento se distingue por su interés en ofrecer cuyes de calidad, con atención al manejo de los animales y a la selección de ejemplares para reproducción. Trabaja con cuyes criollos y exóticos, y ofrece pie de cría para quienes desean iniciar o fortalecer sus criaderos, además de cuyes destinados al consumo.',
      },
      {
        titulo: 'El cuy, identidad y cultura gastronómica',
        texto:
          'En Nariño, el cuy ocupa un lugar especial en la cocina tradicional y en las celebraciones familiares y comunitarias. Su crianza está vinculada con las prácticas campesinas, la economía de los hogares rurales y las costumbres que se transmiten de generación en generación.',
      },
    ],
    claves: ['Cuyes criollos', 'Cuyes exóticos', 'Pie de cría', 'Cuy de consumo', 'Saberes familiares'],
    cierre:
      'Una herencia que se cultiva con dedicación, se fortalece con conocimiento y mantiene vivas las raíces campesinas de Nariño.',
  },
  {
    id: 'casita-de-los-sabores',
    num: '08',
    name: 'Casita de los Sabores',
    tagline: 'Cocina tradicional, memoria campesina y experiencias para compartir',
    owner: 'Rosa Isabel Botina',
    lugar: 'Vereda Alto San Pedro · La Laguna',
    anio: 2020,
    cat: 'Cocina y campo',
    filtro: 'cocina',
    icon: FaFire,
    c1: '#fb923c',
    c2: '#9a3412',
    foto: fotoCasita,
    resumen:
      'Cuy asado, canchape y postres de la huerta: una casa que nació en pandemia y hoy recibe grupos de hasta diez personas.',
    lead:
      'Casita de los Sabores nació en 2020, cuando las restricciones y las dificultades para comercializar los productos del campo afectaban a numerosas familias campesinas. Rosa Isabel Botina decidió buscar nuevas formas de ofrecer lo que producía su entorno, comenzando por acercarlo a familias amigas.',
    secciones: [
      {
        titulo: 'Una idea que nació en tiempos difíciles',
        texto:
          'Los cuyes, las frutas, las hortalizas y las verduras se acumulaban sin suficientes compradores. La respuesta a aquella iniciativa fue favorable y el nombre, que evoca la calidez del hogar y el gusto de reunirse alrededor de la mesa, empezó a convertirse en un emprendimiento con identidad propia.',
      },
      {
        titulo: 'Sabores que se preparan y se comparten',
        texto:
          'La cocina tiene como protagonista al cuy asado, preparación emblemática de la gastronomía nariñense. También ofrece sopas tradicionales como el canchape, la sopa de calabaza y el sancocho, además de postres elaborados con mora, fresa y tomate cultivados en el sector.',
      },
      {
        titulo: 'Aprender, recorrer y vivir el campo',
        texto:
          'Con capacidad para grupos de hasta diez personas, la visita invita a involucrarse en la elaboración del cuy asado y a aprender a preparar postres tradicionales. La experiencia se complementa con recorridos guiados por la vereda y las chagras, acercando a los visitantes a los cultivos, los paisajes y la vida rural.',
      },
    ],
    claves: ['Cuy asado', 'Canchape', 'Postres de fruta', 'Recorridos por chagras', 'Grupos de hasta 10'],
    cierre:
      'Un lugar para aprender con las manos, recorrer con curiosidad y descubrir, alrededor del fogón, los sabores y las historias de nuestra tierra.',
  },
  {
    id: 'sabores-de-la-abuela',
    num: '09',
    name: 'Sabores y Saberes de la Abuela',
    tagline: 'Memoria familiar, cocina tradicional y saberes heredados alrededor del fogón',
    owner: 'Sandra Milena Córdoba Apraez',
    lugar: 'Vereda Cujacal Bajo · Buesaquillo',
    anio: null,
    cat: 'Amasijos y memoria',
    filtro: 'cocina',
    icon: FaBreadSlice,
    c1: '#fbbf24',
    c2: '#92400e',
    foto: fotoAbuela,
    resumen:
      'Envuelos de choclo, guiso y yuca, quimbolitos y frito pastuso: recetas que vienen del fogón de la abuela.',
    lead:
      'Sabores y Saberes de la Abuela nace de los recuerdos de infancia de Sandra Milena Córdoba Apraez, quien encontró en las enseñanzas de su abuela una herencia invaluable: los conocimientos de la cocina tradicional transmitidos alrededor del fogón de leña.',
    secciones: [
      {
        titulo: 'Una herencia alrededor del fogón',
        texto:
          'Entre ingredientes, preparaciones y conversaciones familiares, aprendió a elaborar amasijos y recetas que han acompañado a numerosas generaciones. Cada enseñanza era mucho más que una técnica: una forma de compartir afecto, preservar la memoria y mantener vivas las costumbres campesinas.',
      },
      {
        titulo: 'Amasijos que guardan historias',
        texto:
          'La esencia del emprendimiento son los amasijos tradicionales: envueltos de choclo, de guiso y de yuca, y quimbolitos. La propuesta también explora nuevas formas de presentarlos, como la transformación del quimbolito en torta, reinterpretando una preparación tradicional sin perder el vínculo con sus raíces.',
      },
      {
        titulo: 'Platos y bebidas que reúnen a la familia',
        texto:
          'La experiencia se complementa con el frito pastuso y las papas con ajíes, sabores que evocan encuentros y celebraciones, además de hervidos y aromáticas. La diversidad de la propuesta permite acercarse a distintas expresiones de la gastronomía nariñense, desde los amasijos hasta los platos de la memoria colectiva.',
      },
    ],
    claves: ['Envueltos de choclo', 'Envueltos de guiso y yuca', 'Quimbolitos', 'Frito pastuso', 'Hervidos y aromáticas'],
    cierre:
      'Recetas que vienen de generaciones, sabores que abrazan la memoria y una tradición que sigue viva alrededor del fogón.',
  },
];
