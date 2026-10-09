import {
  FaComments,
  FaFemale,
  FaFire,
  FaHeart,
  FaLightbulb,
  FaMapMarkedAlt,
  FaStore,
  FaUsers,
  FaUtensils,
} from 'react-icons/fa';
import TextCarousel from '../components/TextCarousel.jsx';
import GallerySlider from '../components/GallerySlider.jsx';
import { Reveal, SplitText, Spotlight } from '../components/bits.jsx';

const PROPOSITOS = [
  {
    key: 'economias',
    icon: FaStore,
    kicker: 'Propósito 1 de 6',
    title: 'Fortalecer las economías populares',
    text: 'Reconocer el valor de los emprendimientos de las mujeres, sus productos, servicios y conocimientos, promoviendo oportunidades de colaboración y crecimiento económico.',
    gradient: 'linear-gradient(135deg, #0b3d2e, #16a34a)',
  },
  {
    key: 'liderazgo',
    icon: FaFemale,
    kicker: 'Propósito 2 de 6',
    title: 'Liderazgo y autonomía de las mujeres',
    text: 'Fortalecer su participación, su capacidad para tomar decisiones y su reconocimiento como protagonistas del desarrollo comunitario.',
    gradient: 'linear-gradient(135deg, #5b21b6, #db2777)',
  },
  {
    key: 'saberes',
    icon: FaUtensils,
    kicker: 'Propósito 3 de 6',
    title: 'Preservar saberes y sabores',
    text: 'Valorar la cocina tradicional, las recetas familiares, los ingredientes locales, la memoria oral y las prácticas culturales transmitidas entre generaciones.',
    gradient: 'linear-gradient(135deg, #7c2d12, #ea580c)',
  },
  {
    key: 'turismo',
    icon: FaMapMarkedAlt,
    kicker: 'Propósito 4 de 6',
    title: 'Impulsar el turismo comunitario',
    text: 'Identificar las posibilidades de conexión entre emprendimientos, paisajes, gastronomía, cultura y naturaleza, como base para construir una futura ruta turística desde la comunidad.',
    gradient: 'linear-gradient(135deg, #0c4a6e, #0891b2)',
  },
  {
    key: 'derechos',
    icon: FaHeart,
    kicker: 'Propósito 5 de 6',
    title: 'Derechos humanos y prevención de violencias',
    text: 'Generar espacios de reflexión sobre la autonomía, las relaciones respetuosas, la prevención de la discriminación y el reconocimiento de los derechos de las mujeres, incluidas las situaciones de violencia económica y patrimonial.',
    gradient: 'linear-gradient(135deg, #831843, #e11d48)',
  },
  {
    key: 'redes',
    icon: FaUsers,
    kicker: 'Propósito 6 de 6',
    title: 'Tejer redes de apoyo y colaboración',
    text: 'Fortalecer los vínculos entre las participantes para que el crecimiento de cada iniciativa pueda encontrar oportunidades en el trabajo conjunto.',
    gradient: 'linear-gradient(135deg, #064e3b, #0d9488)',
  },
];

const FOGON_PALABRA = [
  {
    key: 'fogon',
    icon: FaFire,
    kicker: 'El fogón · encuentro y cuidado',
    title: 'El fogón: donde la memoria se convierte en alimento',
    text: 'Es el lugar donde los ingredientes de la tierra se transforman en recetas, donde las familias comparten sus historias y los conocimientos pasan de una generación a otra. Cada preparación guarda una memoria: una receta nos recuerda a nuestras abuelas, una celebración familiar, una costumbre que continúa viva.',
    gradient: 'linear-gradient(135deg, #7c2d12, #f59e0b)',
  },
  {
    key: 'palabra',
    icon: FaComments,
    kicker: 'La palabra · memoria y escucha',
    title: 'La palabra: donde las historias encuentran su voz',
    text: 'Es memoria, escucha y participación: contar lo vivido, reconocer otras experiencias, expresar necesidades y construir acuerdos. En los círculos de palabra las participantes comparten conocimientos, reflexionan sobre sus derechos y crean nuevas formas de colaboración.',
    gradient: 'linear-gradient(135deg, #1e1b4b, #7c3aed)',
  },
];

const HISTORIA = [
  {
    key: 'paso-1',
    icon: FaUsers,
    kicker: 'Paso 1 de 9 · Encuentro',
    title: 'Encuentro comunitario No. 1',
    text: 'Apertura y construcción colectiva del proceso. Compartimos expectativas y construimos acuerdos: las bases de la participación, la confianza y el compromiso de las mujeres con la iniciativa.',
    gradient: 'linear-gradient(135deg, #064e3b, #16a34a)',
  },
  {
    key: 'paso-2',
    icon: FaLightbulb,
    kicker: 'Paso 2 de 9 · Taller',
    title: 'Taller conjunto No. 1',
    text: 'Derechos de las mujeres, liderazgo y turismo comunitario. Reflexionamos sobre el papel de las mujeres en experiencias turísticas respetuosas, inclusivas y conectadas con la vida comunitaria.',
    gradient: 'linear-gradient(135deg, #7c2d12, #ea580c)',
  },
  {
    key: 'paso-3',
    icon: FaMapMarkedAlt,
    kicker: 'Paso 3 de 9 · Recorrido',
    title: 'Recorrido participativo No. 1',
    text: 'Reconocimiento territorial y memoria comunitaria. Caminamos paisajes, historias y lugares significativos para identificar la identidad que puede compartirse con quienes nos visitan.',
    gradient: 'linear-gradient(135deg, #0c4a6e, #0891b2)',
  },
  {
    key: 'paso-4',
    icon: FaUsers,
    kicker: 'Paso 4 de 9 · Encuentro',
    title: 'Encuentro comunitario No. 2',
    text: 'Círculo de palabra sobre cocina tradicional y saberes campesinos. La cocina se volvió escucha: recetas e historias familiares que mantienen viva la identidad gastronómica del territorio.',
    gradient: 'linear-gradient(135deg, #064e3b, #16a34a)',
  },
  {
    key: 'paso-5',
    icon: FaLightbulb,
    kicker: 'Paso 5 de 9 · Taller',
    title: 'Taller conjunto No. 2',
    text: 'Atención al visitante, economía popular y prevención de violencias. Hospitalidad con dignidad: espacios seguros, respetuosos y libres de discriminación para todas las personas.',
    gradient: 'linear-gradient(135deg, #7c2d12, #ea580c)',
  },
  {
    key: 'paso-6',
    icon: FaLightbulb,
    kicker: 'Paso 6 de 9 · Taller',
    title: 'Taller conjunto No. 3',
    text: 'Comunicación comunitaria, interpretación territorial y comercialización local. Cómo contar las historias del territorio y compartir con nuevos públicos lo que nace en las comunidades.',
    gradient: 'linear-gradient(135deg, #7c2d12, #ea580c)',
  },
  {
    key: 'paso-7',
    icon: FaMapMarkedAlt,
    kicker: 'Paso 7 de 9 · Recorrido',
    title: 'Recorrido participativo No. 2',
    text: 'Identificación de emprendimientos y potencial turístico. Cada iniciativa aporta una historia, un saber o un producto que puede complementar futuras experiencias de turismo comunitario.',
    gradient: 'linear-gradient(135deg, #0c4a6e, #0891b2)',
  },
  {
    key: 'paso-8',
    icon: FaUsers,
    kicker: 'Paso 8 de 9 · Encuentro',
    title: 'Encuentro comunitario No. 3',
    text: 'Círculo de palabra sobre comunicación y narrativas del territorio. Las mujeres reflexionaron sobre visibilizar sus iniciativas y fortalecer el sentido de pertenencia.',
    gradient: 'linear-gradient(135deg, #064e3b, #16a34a)',
  },
  {
    key: 'paso-9',
    icon: FaLightbulb,
    kicker: 'Paso 9 de 9 · Taller',
    title: 'Taller conjunto No. 4',
    text: 'Diseño de rutas turísticas, gobernanza y sostenibilidad comunitaria. Trabajar en red, construir acuerdos y proyectar experiencias que valoren la cultura, la gastronomía y el patrimonio local.',
    gradient: 'linear-gradient(135deg, #7c2d12, #ea580c)',
  },
];

// Galería del header: fotos optimizadas en assets/media/2proyecto-web.
// Se ordenan en secuencia natural (foto 1, 2, … 15.3) y se amplían solas
// agregando archivos a esa carpeta.
const photoModules = import.meta.glob('../assets/media/2proyecto-web/*.jpg', {
  eager: true,
  query: '?url',
  import: 'default',
});
const PHOTOS = Object.keys(photoModules)
  .sort((a, b) => a.localeCompare(b, 'es', { numeric: true }))
  .map((path, i) => ({ src: photoModules[path], alt: `Encuentros, talleres y recorridos del proceso · foto ${i + 1}` }));

export default function Proyecto() {
  return (
    <section className="page-section proyecto">
      <p className="eyebrow">2 · El proyecto</p>
      <SplitText
        as="h2"
        splitBy="chars"
        stagger={18}
        text="Caminos de Fogón y Palabra: Mujeres que Guían el Territorio"
        className="hero-title"
      />
      <Reveal delay={120}>
        <p className="lead">
          Un territorio que se cuenta desde sus mujeres, se comparte desde sus saberes
          y se fortalece cuando caminamos juntas.
        </p>
      </Reveal>

      <GallerySlider images={PHOTOS} interval={5000} label="Galería de fotos del proyecto" />

      <div className="stat-strip" aria-label="El proyecto en cifras">
        <div className="stat"><span className="stat-num">15</span><span className="stat-label">mujeres</span></div>
        <div className="stat"><span className="stat-num">9</span><span className="stat-label">encuentros y talleres</span></div>
        <div className="stat"><span className="stat-num">5</span><span className="stat-label">ejes de aprendizaje</span></div>
        <div className="stat"><span className="stat-num">1</span><span className="stat-label">territorio</span></div>
      </div>

      <Reveal>
        <h3>Una iniciativa que nace de las mujeres y camina con el territorio</h3>
      </Reveal>
      <p className="drop">
        En el corredor oriental de Pasto, entre montañas, caminos rurales, cocinas
        tradicionales y emprendimientos que guardan historias, existe una riqueza que
        merece ser reconocida y compartida: los saberes de las mujeres, la memoria de
        las comunidades y las formas de vida que mantienen viva la identidad de este
        territorio.
      </p>
      <p>
        De ese reconocimiento nace <strong>Caminos de Fogón y Palabra: Mujeres que Guían
        el Territorio</strong>, una iniciativa de la Fundación Quiero Desarrollo Humano,
        desarrollada en el marco del Banco de Iniciativas para las Comunidades 2025, del
        Ministerio del Interior, con el acompañamiento de FINDETER.
      </p>
      <p>
        El proyecto se propuso fortalecer las capacidades de 15 mujeres del corredor
        oriental de Pasto vinculadas a emprendimientos de cocina tradicional y turismo
        comunitario, promoviendo su liderazgo, autonomía económica, participación y
        articulación con otras iniciativas locales.
      </p>
      <p>
        La apuesta parte de una convicción: detrás de cada emprendimiento hay mucho más
        que un producto o un servicio. Hay una historia familiar, un conocimiento
        construido con los años, una relación con la tierra y una mujer que aporta al
        bienestar de su familia y su comunidad.
      </p>
      <p>
        Por eso, Caminos de Fogón y Palabra busca que estos saberes sean reconocidos, que
        las iniciativas encuentren nuevas posibilidades de colaboración y que las mujeres
        puedan construir, desde sus propias voces, oportunidades para el presente y el
        futuro de sus territorios.
      </p>
      <p>
        No se trata de inventar una identidad para mostrarla a quienes nos visitan. Se
        trata de reconocer la que ya existe, cuidarla y encontrar maneras de compartirla
        con orgullo, respeto y autenticidad.
      </p>

      <Reveal>
        <h3>¿Qué busca Caminos de Fogón y Palabra?</h3>
      </Reveal>
      <p>
        El proyecto articula diferentes propósitos que se complementan y dan sentido al
        proceso comunitario. Desliza y descubre cada uno:
      </p>
      <Reveal>
        <TextCarousel slides={PROPOSITOS} interval={5500} label="Propósitos del proyecto" />
      </Reveal>

      <Reveal>
        <h3>¿Por qué las mujeres?</h3>
      </Reveal>
      <p>
        Porque las mujeres son portadoras de conocimientos, memorias y prácticas que forman
        parte de la identidad de sus comunidades. En sus cocinas, huertas, emprendimientos
        y espacios cotidianos se conservan recetas, técnicas, historias y formas de
        relacionarse con el territorio que merecen ser valoradas.
      </p>
      <p>
        Sin embargo, el trabajo de las mujeres rurales no siempre recibe el reconocimiento
        ni las oportunidades que merece.
      </p>
      <p>
        Caminos de Fogón y Palabra busca contribuir a transformar esa realidad, creando
        espacios donde las participantes puedan reconocer sus capacidades, fortalecer sus
        emprendimientos, intercambiar experiencias y encontrar nuevas formas de trabajar
        juntas.
      </p>
      <p>
        Aquí, las mujeres no son solamente anfitrionas que reciben visitantes. Son
        emprendedoras, creadoras, portadoras de memoria, conocedoras del territorio y
        protagonistas de las decisiones sobre su futuro.
      </p>
      <p>
        Cuando una mujer reconoce el valor de lo que sabe y encuentra apoyo en otras
        mujeres, su crecimiento puede convertirse también en una oportunidad para toda la
        comunidad.
      </p>

      <Reveal>
        <h3>El fogón y la palabra: el corazón de nuestra identidad</h3>
      </Reveal>
      <p>
        Dos símbolos, una misma esencia: reconocer lo que las mujeres saben, fortalecer lo
        que hacen y abrir caminos para que sus historias encuentren nuevas voces.
      </p>
      <Reveal>
        <TextCarousel slides={FOGON_PALABRA} interval={7000} label="El fogón y la palabra" />
      </Reveal>

      <Reveal>
        <h3>El corredor oriental de Pasto: un territorio por descubrir</h3>
      </Reveal>
      <p>
        El corredor oriental de Pasto es un territorio de paisajes andinos, comunidades
        rurales, tradiciones gastronómicas y emprendimientos que expresan la creatividad y
        el conocimiento de quienes lo habitan.
      </p>
      <p>
        En lugares como Cabrera, San Pedro de la Laguna y sus veredas, la vida comunitaria
        se encuentra con la cocina tradicional, los productos locales, los saberes
        campesinos y distintas iniciativas que pueden aportar a experiencias de turismo
        comunitario.
      </p>
      <p>
        Un plato de locro pastuso, unas papas con ají, la preparación artesanal de helados
        de paila o la historia de un emprendimiento son mucho más que elementos de una
        posible visita turística: son expresiones de una identidad construida a lo largo
        del tiempo.
      </p>
      <p>
        La invitación es a recorrer el territorio con curiosidad y respeto, escuchar las
        historias de sus habitantes y descubrir que la riqueza de un lugar no se encuentra
        únicamente en sus paisajes, sino también en las personas que le dan vida.
      </p>

      <Reveal>
        <h3>¿Cómo se desarrolló el proceso?</h3>
      </Reveal>
      <p>
        Caminos de Fogón y Palabra se construyó mediante una metodología participativa que
        reconoce a las mujeres como protagonistas de su aprendizaje. Los encuentros,
        talleres y recorridos se plantearon como espacios para compartir experiencias,
        reconocer conocimientos, dialogar sobre los desafíos cotidianos y explorar
        posibilidades de trabajo conjunto.
      </p>
      <p>El proceso integró cinco grandes ejes de aprendizaje:</p>
      <ol className="bullet">
        <li><strong>Derechos de las mujeres y liderazgo.</strong> Reconocimiento de derechos, fortalecimiento de la participación y reflexión sobre la autonomía y la prevención de las violencias basadas en género.</li>
        <li><strong>Cocina tradicional y saberes campesinos.</strong> Recuperación de recuerdos, recetas, ingredientes locales y prácticas que mantienen viva la memoria gastronómica.</li>
        <li><strong>Economías populares y emprendimientos.</strong> Identificación de las iniciativas de las participantes, reconocimiento de sus características y exploración de posibilidades de articulación.</li>
        <li><strong>Turismo comunitario y guianza turística.</strong> Reflexión sobre la hospitalidad, la atención al visitante, la interpretación territorial, el cuidado del patrimonio y la construcción de experiencias respetuosas con las comunidades.</li>
        <li><strong>Comunicación comunitaria y trabajo en red.</strong> Fortalecimiento de las capacidades para contar las historias del territorio, visibilizar los emprendimientos y compartir los aprendizajes del proceso.</li>
      </ol>
      <p>
        Cada espacio aportó herramientas para que las mujeres reconocieran el valor de sus
        iniciativas y descubrieran nuevas formas de conectarlas. El aprendizaje no se
        limitó a los contenidos de los talleres: también se construyó en la conversación,
        la escucha, los ejercicios colectivos y el encuentro con otras experiencias del
        territorio.
      </p>

      <Reveal>
        <h3>La historia de nuestro camino: encuentros, talleres y recorridos</h3>
      </Reveal>
      <p>
        Cada actividad representa un paso en la construcción de Caminos de Fogón y Palabra.
        Recorre los 9 momentos que tejieron este proceso:
      </p>
      <Reveal>
        <TextCarousel slides={HISTORIA} interval={6000} label="Historia del camino" />
      </Reveal>

      <Reveal>
        <h3>¿Qué hemos comenzado a construir?</h3>
      </Reveal>
      <p>
        Más allá de cada taller, el proceso ha permitido avanzar en algo esencial: reconocer
        que las iniciativas de las mujeres pueden fortalecerse cuando dejan de verse como
        esfuerzos aislados y comienzan a relacionarse entre sí.
      </p>
      <p>
        Una preparación tradicional puede vincularse con una experiencia gastronómica. Un
        emprendimiento puede complementar el recorrido de otra participante. Una historia
        familiar puede convertirse en una narración para visitantes. Un conocimiento que
        antes se compartía solamente en el entorno cercano puede encontrar nuevas formas de
        transmitirse.
      </p>
      <p>
        Así comienza a tomar forma la posibilidad de una ruta turística comunitaria de
        Caminos de Fogón y Palabra, construida desde las capacidades, los intereses y la
        participación de las mujeres.
      </p>
      <p>
        Esta ruta es una proyección que se construye progresivamente. Su consolidación
        requiere fortalecer la articulación entre emprendimientos, preparar experiencias,
        construir acuerdos comunitarios y mantener la participación de quienes dan vida al
        proceso.
      </p>
      <p>
        El propósito no es solamente atraer visitantes, sino generar oportunidades que
        reconozcan el trabajo de las mujeres, valoren los saberes locales y contribuyan al
        bienestar de las comunidades.
      </p>

      <Reveal>
        <h3>Una red que crece con cada encuentro</h3>
      </Reveal>
      <p>
        La fuerza de Caminos de Fogón y Palabra está en los vínculos que se construyen. Cada
        conversación permite reconocer otras experiencias; cada actividad abre posibilidades
        de colaboración; cada emprendimiento aporta una pieza a una historia compartida.
      </p>
      <p>
        El trabajo en red significa comprender que el crecimiento de una iniciativa puede
        acompañar el de otras, que los conocimientos se enriquecen cuando se comparten y que
        el desarrollo comunitario necesita confianza, acuerdos y apoyo mutuo.
      </p>
      <p>
        También significa promover relaciones basadas en el respeto, el reconocimiento de
        los derechos y la participación de las mujeres en las decisiones que afectan su vida
        y su territorio.
      </p>
      <p>
        Porque una comunidad se fortalece cuando sus integrantes encuentran maneras de
        colaborar sin perder su identidad y cuando el bienestar colectivo se convierte en
        una tarea compartida.
      </p>

      <Reveal>
        <Spotlight className="card invitar invite-anim">
          <span className="blob b1" aria-hidden="true" />
          <span className="blob b2" aria-hidden="true" />
          <SplitText
            as="h4"
            splitBy="words"
            stagger={60}
            text="Una invitación a caminar con nosotras"
            className="invite-title"
          />
          <p>
            Caminos de Fogón y Palabra es una iniciativa que se construye desde la comunidad y
            mira hacia el futuro sin desprenderse de sus raíces. Su historia vive en las
            mujeres que participan, en los emprendimientos que se fortalecen, en los saberes
            que se comparten y en las relaciones que comienzan a tejerse.
          </p>
          <p>
            Si llegaste hasta aquí, te invitamos a conocer esos caminos, descubrir las
            historias de sus protagonistas y acercarte a un territorio que tiene mucho por
            contar.
          </p>
          <p>
            Quizás tu próxima visita sea una oportunidad para sentarte alrededor de un fogón,
            conocer una receta, escuchar una historia y descubrir que detrás de cada
            emprendimiento hay una mujer con saberes, sueños y mucho por compartir.
          </p>
          <p>
            <strong className="shimmer-text">Caminos de Fogón y Palabra: mujeres que reconocen el valor de sus saberes,
            fortalecen sus iniciativas y tejen juntas nuevas posibilidades para su territorio.</strong>
          </p>
          <div className="invite-ctas">
            <a className="btn primary" href="#/mapa">Explorar el mapa</a>
            <a className="btn" href="#/contacto">Contacto / reserva</a>
          </div>
          <p className="credito">
            Una iniciativa de la Fundación Quiero Desarrollo Humano, desarrollada en el marco
            del Banco de Iniciativas para las Comunidades 2025, del Ministerio del Interior,
            con el acompañamiento de FINDETER.
          </p>
        </Spotlight>
      </Reveal>
    </section>
  );
}
