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
import GallerySlider from '../components/GallerySlider.jsx';
import { Reveal, SplitText, Spotlight } from '../components/bits.jsx';
import { ProcesoAnimado, LineaTiempo } from '../components/ProcesoAnimado.jsx';
import { PropositosGrid, DueloFogon } from '../components/PiezasProyecto.jsx';

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
        En el corredor oriental de Pasto, entre cocinas tradicionales y emprendimientos
        con historia, vive una riqueza por compartir: los saberes de las mujeres y la
        memoria de sus comunidades.
      </p>
      <div className="proj-grid">
        <div className="proj-card">
          <h4>🌄 Territorio</h4>
          <p>Cabrera, San Pedro de la Laguna y veredas: montañas, caminos rurales y cocina que guarda identidad.</p>
        </div>
        <div className="proj-card">
          <h4>🤝 Impulso</h4>
          <p>Fundación Quiero Desarrollo Humano · Banco de Iniciativas 2025 (MinInterior) + FINDETER.</p>
        </div>
        <div className="proj-card">
          <h4>🔥 Apuesta</h4>
          <p>15 mujeres de cocina tradicional y turismo comunitario: liderazgo, autonomía y trabajo en red.</p>
        </div>
      </div>
      <details className="proj-mas">
        <summary>Leer el contexto completo</summary>
        <p>
          De ese reconocimiento nace <strong>Caminos de Fogón y Palabra: Mujeres que Guían
          el Territorio</strong>. La apuesta parte de una convicción: detrás de cada
          emprendimiento hay una historia familiar, un conocimiento de años y una mujer que
          aporta al bienestar de su familia y su comunidad.
        </p>
        <p>
          No se trata de inventar una identidad para mostrarla. Se trata de reconocer la que
          ya existe, cuidarla y compartirla con orgullo, respeto y autenticidad.
        </p>
      </details>

      <Reveal>
        <h3>¿Qué busca Caminos de Fogón y Palabra?</h3>
      </Reveal>
      <p>
        Seis propósitos que se complementan, todos visibles de un vistazo:
      </p>
      <PropositosGrid items={PROPOSITOS} />

      <Reveal>
        <h3>¿Por qué las mujeres?</h3>
      </Reveal>
      <blockquote className="proj-cita">
        “Cuando una mujer reconoce el valor de lo que sabe y encuentra apoyo en otras
        mujeres, su crecimiento se vuelve oportunidad para toda la comunidad.”
      </blockquote>
      <p>
        Son portadoras de recetas, técnicas e historias que sostienen la identidad del
        territorio — y protagonistas de las decisiones sobre su futuro.
      </p>
      <details className="proj-mas">
        <summary>Por qué este enfoque</summary>
        <p>
          El trabajo de las mujeres rurales no siempre recibe el reconocimiento ni las
          oportunidades que merece. Aquí no son solo anfitrionas: son emprendedoras,
          creadoras y conocedoras del territorio.
        </p>
      </details>

      <Reveal>
        <h3>El fogón y la palabra: el corazón de nuestra identidad</h3>
      </Reveal>
      <p>
        Dos símbolos, una misma esencia: reconocer lo que las mujeres saben y abrir
        caminos para que sus historias encuentren nuevas voces.
      </p>
      <DueloFogon items={FOGON_PALABRA} />

      <Reveal>
        <h3>El corredor oriental de Pasto: un territorio por descubrir</h3>
      </Reveal>
      <p>
        Paisajes andinos, cocina tradicional y emprendimientos creativos en Cabrera, San
        Pedro de la Laguna y sus veredas.
      </p>
      <div className="proj-chips">
        <span>🥘 Locro pastuso</span>
        <span>🥔 Papas con ají</span>
        <span>🍨 Helados de paila</span>
        <span>📖 Historias vivas</span>
      </div>
      <details className="proj-mas">
        <summary>Más del territorio</summary>
        <p>
          Cada plato y cada emprendimiento es identidad construida en el tiempo. La
          invitación es a recorrer con curiosidad y respeto: la riqueza está en los
          paisajes y en las personas que les dan vida.
        </p>
      </details>

      <Reveal>
        <h3>¿Cómo se desarrolló el proceso?</h3>
      </Reveal>
      <p>
        Metodología participativa: las mujeres como protagonistas. Toca cada eje y mira
        cómo se encadenan — la secuencia avanza sola:
      </p>
      <Reveal>
        <ProcesoAnimado />
      </Reveal>

      <Reveal>
        <h3>La historia de nuestro camino: encuentros, talleres y recorridos</h3>
      </Reveal>
      <p>
        9 momentos que tejieron el proceso. Desliza la línea y abre cada paso:
      </p>
      <Reveal>
        <LineaTiempo pasos={HISTORIA} />
      </Reveal>

      <Reveal>
        <h3>¿Qué hemos comenzado a construir?</h3>
      </Reveal>
      <div className="proj-grid">
        <div className="proj-card">
          <h4>🔗 De aislado a red</h4>
          <p>Una preparación se vincula a una experiencia; una historia familiar se vuelve narración para visitantes.</p>
        </div>
        <div className="proj-card">
          <h4>🗺️ Ruta en construcción</h4>
          <p>Una ruta turística comunitaria que nace de las capacidades e intereses de las mujeres.</p>
        </div>
        <div className="proj-card">
          <h4>🌱 Más que visitantes</h4>
          <p>Oportunidades que reconocen el trabajo de las mujeres y el bienestar de las comunidades.</p>
        </div>
      </div>

      <Reveal>
        <h3>Una red que crece con cada encuentro</h3>
      </Reveal>
      <p>
        Cada conversación abre colaboración; cada emprendimiento aporta una pieza a la
        historia compartida. Colaborar sin perder identidad: esa es la tarea.
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
            Si llegaste hasta aquí, te invitamos a conocer esos caminos y a sentarte
            alrededor de un fogón: detrás de cada emprendimiento hay una mujer con
            saberes, sueños y mucho por compartir.
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
