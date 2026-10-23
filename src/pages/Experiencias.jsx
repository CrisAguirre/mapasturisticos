import {
  FaArrowRight,
  FaFemale,
  FaFire,
  FaMapMarkerAlt,
  FaRoute,
  FaUtensils,
} from 'react-icons/fa';
import { Reveal, SplitText, Spotlight } from '../components/bits.jsx';
import { EMPRENDIMIENTOS } from '../config/emprendimientos.js';
import './Experiencias.css';

// Las fotos de los ejes se toman de emprendimientos que ya están en la web.
// Así el contenido nuevo no depende de imágenes que todavía no existen.
const ficha = (id) => EMPRENDIMIENTOS.find((e) => e.id === id);

const INTRO = {
  visible:
    'Cada emprendimiento guarda una historia propia, construida a partir de los saberes heredados, las experiencias familiares, los aprendizajes y los sueños de las mujeres que lo hacen posible. Historias que nacen alrededor del fogón, en el trabajo con la tierra, en las tradiciones de las veredas y en las iniciativas que, con esfuerzo y creatividad, contribuyen a mantener viva la identidad cultural del corredor oriental de Pasto.',
  detalle: [
    'Durante el proceso formativo de Caminos de Fogón y Palabra: Mujeres que Guían el Territorio, el encuentro entre las emprendedoras permitió reconocer no solo el valor particular de cada iniciativa, sino también los vínculos, las complementariedades y las posibilidades de articulación entre sus saberes, productos, preparaciones y características territoriales. Este reconocimiento permitió comprender que los emprendimientos pueden formar parte de un tejido comunitario en el que cada mujer aporta algo único y, al mismo tiempo, encuentra puntos de conexión con las demás.',
    'Desde esta perspectiva, las experiencias se convierten en un hilo conductor para imaginar y construir una ruta que integre la cocina tradicional, las memorias del territorio, la gastronomía local y las historias de las mujeres que lo habitan. Una ruta que no se limita a conectar lugares, sino que busca entrelazar conocimientos, reconocer identidades y propiciar encuentros alrededor de aquello que las comunidades conservan, transforman y comparten.',
    'Para dar forma a esta propuesta, el capítulo se articula en cuatro ejes complementarios: Sabores del Fogón, Caminos de Memoria, Del Territorio a la Mesa y Mujeres que Guían. Cada uno representa una manera de acercarse a las historias de las emprendedoras y descubrir cómo sus iniciativas pueden relacionarse para aportar, progresivamente, a la construcción de una propuesta de turismo comunitario desde las capacidades, los saberes y las realidades del territorio.',
  ],
};

const EJES = [
  {
    id: 'sabores-del-fogon',
    num: '01',
    kicker: '5.1 · Eje 1 de 4',
    icon: FaFire,
    title: 'Sabores del Fogón',
    subtitle: 'La memoria que se comparte alrededor de la cocina',
    color: '#fb923c',
    color2: '#7c2d12',
    foto: ficha('casita-de-los-sabores'),
    intro:
      'El fogón es uno de los lugares donde las historias familiares permanecen vivas. Alrededor de él se transmiten conocimientos, se aprenden técnicas de preparación y se conservan recetas que han acompañado a distintas generaciones. En las cocinas del corredor oriental de Pasto, estos saberes forman parte de la identidad de las comunidades y expresan la relación entre la alimentación, la memoria y la vida cotidiana.',
    detalle: [
      'Este eje reúne las historias de las mujeres cuyos emprendimientos están vinculados a la cocina tradicional y a la preservación de los conocimientos culinarios. Sus preparaciones, los ingredientes que utilizan y las enseñanzas recibidas de sus madres, abuelas y otras personas de sus comunidades permiten reconocer el valor cultural que existe detrás de cada plato.',
      'En el marco de Caminos de Fogón y Palabra, la cocina también constituye un punto de encuentro entre emprendimientos. Las preparaciones tradicionales, los conocimientos compartidos y las distintas formas de mantener vivas las recetas pueden complementarse y aportar a una narrativa común sobre la gastronomía y la memoria del territorio.',
      'Así, Sabores del Fogón invita a descubrir las historias que acompañan cada preparación y a reconocer la cocina tradicional como una expresión de identidad, un patrimonio de las comunidades y una posibilidad para generar encuentros alrededor de los saberes de las mujeres.',
    ],
    cierre:
      'Cada fogón guarda una historia y cada preparación conserva una parte de nuestra memoria.',
    claves: ['Fogón', 'Recetas familiares', 'Generaciones', 'Identidad', 'Encuentro'],
    cta: { href: '#/mujeres', label: 'Conocer los fogones' },
  },
  {
    id: 'caminos-de-memoria',
    num: '02',
    kicker: '5.2 · Eje 2 de 4',
    icon: FaRoute,
    title: 'Caminos de Memoria',
    subtitle: 'Las historias que dan sentido al territorio',
    color: '#2dd4bf',
    color2: '#134e4a',
    foto: ficha('finca-los-arrayanes'),
    intro:
      'Los caminos del corredor oriental de Pasto conectan veredas, paisajes, viviendas y espacios de encuentro, pero también conservan las memorias de quienes los han recorrido y habitado a lo largo del tiempo. Cada lugar tiene características particulares, recuerdos y significados que permiten comprender la identidad de las comunidades más allá de sus paisajes.',
    detalle: [
      'Este eje propone acercarse al territorio desde las voces y experiencias de sus habitantes, reconociendo las historias familiares, las tradiciones locales y los lugares que tienen un significado especial para las comunidades. Las mujeres emprendedoras aportan a esta mirada desde sus conocimientos cotidianos, sus trayectorias y la relación que mantienen con sus veredas.',
      'Durante el proceso formativo, el reconocimiento territorial permitió identificar que los emprendimientos no se encuentran aislados de su entorno. Sus ubicaciones, sus historias y las características de los lugares donde se desarrollan pueden establecer conexiones que contribuyan a imaginar recorridos y formas de encuentro entre distintas iniciativas.',
      'Por ello, Caminos de Memoria busca poner en valor los relatos que dan sentido a cada lugar y explorar cómo pueden articularse para construir una ruta que conecte experiencias, saberes y territorios. Se trata de reconocer que recorrer una vereda también puede significar escuchar sus historias, comprender sus tradiciones y acercarse a las personas que mantienen viva su memoria.',
    ],
    cierre:
      'Cada camino conecta lugares, pero son las historias de sus habitantes las que construyen el sentido del recorrido.',
    claves: ['Veredas', 'Paisajes', 'Relatos', 'Tradiciones', 'Recorridos'],
    cta: { href: '#/mapa', label: 'Recorrer el territorio' },
  },
  {
    id: 'del-territorio-a-la-mesa',
    num: '03',
    kicker: '5.3 · Eje 3 de 4',
    icon: FaUtensils,
    title: 'Del Territorio a la Mesa',
    subtitle: 'Los productos locales como encuentro entre saberes y sabores',
    color: '#fbbf24',
    color2: '#78350f',
    foto: ficha('tradicion-san-luis'),
    intro:
      'Los alimentos expresan la relación entre las comunidades y el territorio que habitan. En cada ingrediente se encuentran conocimientos sobre la tierra, prácticas productivas y formas de aprovechar los recursos locales; en cada preparación convergen técnicas, experiencias familiares y tradiciones que se transmiten y transforman con el paso del tiempo.',
    detalle: [
      'En los emprendimientos vinculados a Caminos de Fogón y Palabra, la gastronomía y los productos locales permiten reconocer distintas formas de relacionarse con la cocina, la producción y la economía popular. Las mujeres, desde sus conocimientos y capacidades, transforman ingredientes, elaboran preparaciones y desarrollan iniciativas que reflejan la identidad de sus comunidades.',
      'Este eje permite identificar las conexiones entre quienes producen, transforman y preparan alimentos, así como las posibilidades de complementariedad entre los emprendimientos. La relación entre los productos del territorio, las preparaciones tradicionales y las historias de quienes los trabajan puede contribuir a construir una propuesta articulada que reconozca el valor de cada iniciativa y la riqueza de sus vínculos.',
      'Del Territorio a la Mesa invita a comprender la gastronomía como una expresión cultural que conecta la tierra con la cocina, el trabajo con la tradición y los conocimientos individuales con las oportunidades colectivas. De esta manera, los productos y las preparaciones pueden convertirse en puntos de encuentro que aporten a la construcción de una ruta con identidad propia.',
    ],
    cierre:
      'De la tierra a la cocina y de la cocina a la comunidad, cada alimento cuenta una historia que merece ser compartida.',
    claves: ['Ingredientes', 'Tierra', 'Cocina', 'Economía popular', 'Productos locales'],
    cta: { href: '#/mujeres', label: 'Descubrir productos locales' },
  },
  {
    id: 'mujeres-que-guian',
    num: '04',
    kicker: '5.4 · Eje 4 de 4',
    icon: FaFemale,
    title: 'Mujeres que Guían',
    subtitle: 'Historias que se encuentran y caminos que se construyen en colectivo',
    color: '#f472b6',
    color2: '#831843',
    foto: ficha('jardin-de-mama-luz'),
    intro:
      'Detrás de cada emprendimiento hay una mujer, una historia y un conjunto de conocimientos que dan sentido a su iniciativa. Algunas han encontrado en la cocina tradicional una manera de conservar las enseñanzas familiares; otras han desarrollado propuestas relacionadas con la producción, las plantas, los espacios rurales, la gastronomía o las expresiones culturales de sus comunidades. Todas aportan capacidades y experiencias que enriquecen la diversidad del corredor oriental de Pasto.',
    detalle: [
      'Este eje reconoce a las mujeres como protagonistas de sus procesos y portadoras de saberes fundamentales para la vida comunitaria. Sus historias permiten comprender las motivaciones que dieron origen a sus emprendimientos, los aprendizajes que han construido y las expectativas con las que proyectan sus iniciativas hacia el futuro.',
      'Uno de los aportes del proceso formativo fue propiciar espacios de encuentro en los que las emprendedoras pudieron reconocerse, compartir conocimientos e identificar características de sus iniciativas que podrían complementarse. Este intercambio permitió ampliar la mirada sobre sus emprendimientos, pasando del reconocimiento individual a la identificación de posibilidades de articulación y colaboración.',
      'Desde esta perspectiva, las mujeres no solo representan el corazón de cada emprendimiento, sino también el vínculo humano que puede conectar las demás experiencias. Sus historias enlazan los sabores del fogón, las memorias territoriales y los productos locales, dando sentido a una propuesta que busca construirse desde la participación, el reconocimiento mutuo y las capacidades de las comunidades.',
      'Mujeres que Guían es, por tanto, un espacio para conocer a las protagonistas de esta iniciativa, valorar sus trayectorias y reconocer que el fortalecimiento de sus emprendimientos también puede contribuir a abrir nuevas oportunidades de cooperación y desarrollo comunitario.',
    ],
    cierre:
      'Cada mujer tiene su propio camino; cuando sus historias se encuentran, aparecen nuevas posibilidades para caminar juntas.',
    claves: ['Protagonistas', 'Saberes', 'Trayectorias', 'Colectivo', 'Cooperación'],
    cta: { href: '#/mujeres', label: 'Conocer a las protagonistas' },
  },
];

const CIERRE = {
  visible:
    'Los cuatro ejes de Caminos de Fogón y Palabra: Mujeres que Guían el Territorio se complementan y se enriquecen mutuamente. Los sabores conservan la memoria culinaria; los caminos permiten reconocer las historias de los lugares; los productos locales conectan la tierra con la mesa; y las mujeres dan vida a estas experiencias a través de sus conocimientos, sus iniciativas y sus relaciones comunitarias.',
  detalle: [
    'Su articulación representa una oportunidad para continuar construyendo una propuesta de turismo comunitario que reconozca las particularidades de cada emprendimiento y, al mismo tiempo, valore las conexiones que existen entre ellos. Una propuesta en la que las experiencias no se entiendan únicamente como actividades o lugares por visitar, sino como oportunidades para escuchar, aprender, compartir y reconocer la riqueza cultural del territorio.',
    'Este camino se construye progresivamente, desde las capacidades existentes, las decisiones de las emprendedoras y las posibilidades reales de colaboración. Su propósito es contribuir a que las historias individuales encuentren puntos de encuentro y que esos encuentros permitan proyectar nuevas formas de visibilizar los saberes, fortalecer las iniciativas y generar vínculos entre las comunidades y quienes desean conocerlas.',
  ],
  cita:
    'Porque una ruta no se construye solamente uniendo lugares, sino encontrando las historias, los saberes y las personas que les dan sentido.',
};

function irAEje(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

function FotoEje({ eje }) {
  const foto = eje.foto;

  return (
    <figure className="ex-media">
      {foto?.foto ? (
        <img src={foto.foto} alt={`${foto.name} · ${foto.owner}`} loading="lazy" decoding="async" />
      ) : (
        <div className="ex-media-vacia">Foto en camino</div>
      )}
      <span className="ex-media-sombra" aria-hidden="true" />

      <div className="ex-media-top">
        <span className="ex-media-num">{eje.num}</span>
        <span className="ex-media-icon">
          <eje.icon aria-hidden="true" />
        </span>
      </div>

      <figcaption className="ex-media-pie">
        <span className="ex-media-nombre">{foto?.name ?? 'Emprendimiento del territorio'}</span>
        <span className="ex-media-lugar">
          {foto?.owner}
          {foto?.lugar ? ` · ${foto.lugar}` : ''}
        </span>
        {foto && (
          <a
            className="ex-media-mapa"
            href={`#/mapa?p=${foto.id}`}
            aria-label={`Ver ${foto.name} en el mapa`}
          >
            <FaMapMarkerAlt aria-hidden="true" /> Ver en el mapa
          </a>
        )}
      </figcaption>
    </figure>
  );
}

export default function Experiencias() {
  return (
    <section className="page-section experiencias">
      <p className="eyebrow">5 · Experiencias</p>
      <SplitText
        as="h2"
        splitBy="chars"
        stagger={14}
        text="Historias, sabores y caminos que se entrelazan en el territorio"
        className="hero-title"
      />
      <Reveal delay={120}>
        <p className="lead ex-lead">
          Una ruta que no se limita a conectar lugares, sino que busca entrelazar
          conocimientos, reconocer identidades y propiciar encuentros alrededor de aquello
          que las comunidades conservan, transforman y comparten.
        </p>
      </Reveal>

      <div className="stat-strip" aria-label="Las experiencias en cifras">
        <div className="stat"><span className="stat-num">4</span><span className="stat-label">ejes temáticos</span></div>
        <div className="stat"><span className="stat-num">9</span><span className="stat-label">emprendimientos</span></div>
        <div className="stat"><span className="stat-num">4</span><span className="stat-label">corregimientos</span></div>
        <div className="stat"><span className="stat-num">1</span><span className="stat-label">ruta en construcción</span></div>
      </div>

      <Reveal>
        <div className="ex-intro">
          <p className="ex-drop">{INTRO.visible}</p>
          <details className="ex-mas">
            <summary>Leer la introducción completa</summary>
            <div className="ex-mas-cuerpo">
              {INTRO.detalle.map((p) => <p key={p}>{p}</p>)}
            </div>
          </details>
        </div>
      </Reveal>

      <Reveal>
        <div className="ex-cabecera-bloque">
          <div>
            <p className="ex-sobre">Cuatro ejes complementarios</p>
            <h3 className="ex-titulo-bloque">Una misma ruta, cuatro formas de recorrerla</h3>
          </div>
          <p className="ex-pista">Toca un eje para ir directo a su historia.</p>
        </div>
      </Reveal>

      <Reveal>
        <div className="ex-ruta">
          {EJES.map((eje) => (
            <button
              key={eje.id}
              type="button"
              className="ex-ruta-card"
              style={{ '--e1': eje.color, '--e2': eje.color2 }}
              onClick={() => irAEje(eje.id)}
              aria-label={`Ir al eje ${eje.title}`}
            >
              <span className="ex-ruta-icon"><eje.icon aria-hidden="true" /></span>
              <span className="ex-ruta-num">Eje {eje.num}</span>
              <span className="ex-ruta-titulo">{eje.title}</span>
              <span className="ex-ruta-sub">{eje.subtitle}</span>
              <span className="ex-ruta-ir">Explorar <FaArrowRight aria-hidden="true" /></span>
            </button>
          ))}
        </div>
      </Reveal>

      {EJES.map((eje, i) => {
        const invertida = i % 2 === 1;
        return (
          <Reveal key={eje.id} delay={i * 45}>
            <article
              id={eje.id}
              className={`ex-eje${invertida ? ' invertida' : ''}`}
              style={{ '--e1': eje.color, '--e2': eje.color2 }}
            >
              <FotoEje eje={eje} />
              <div className="ex-cuerpo">
                <p className="ex-kicker">{eje.kicker}</p>
                <h3 className="ex-eje-titulo">{eje.title}</h3>
                <p className="ex-subtitulo">{eje.subtitle}</p>
                <p className="ex-texto">{eje.intro}</p>

                <details className="ex-mas">
                  <summary>Leer el eje completo</summary>
                  <div className="ex-mas-cuerpo">
                    {eje.detalle.map((p) => <p key={p}>{p}</p>)}
                  </div>
                </details>

                <div className="ex-claves" aria-label={`Palabras clave de ${eje.title}`}>
                  {eje.claves.map((c) => <span key={c}>{c}</span>)}
                </div>

                <blockquote className="ex-cierre">{eje.cierre}</blockquote>

                <div className="ex-acciones">
                  <a className="ex-enlace" href={eje.cta.href}>
                    {eje.cta.label} <FaArrowRight aria-hidden="true" />
                  </a>
                  {eje.foto && (
                    <a className="ex-enlace ex-enlace-suave" href={`#/mapa?p=${eje.foto.id}`}>
                      <FaMapMarkerAlt aria-hidden="true" /> Ubicarlo en el mapa
                    </a>
                  )}
                </div>
              </div>
            </article>
          </Reveal>
        );
      })}

      <Reveal>
        <div className="ex-final">
          <p className="ex-sobre">Cierre</p>
          <h3>Un camino que se construye entre todas</h3>
          <p className="ex-final-texto">{CIERRE.visible}</p>
          <details className="ex-mas">
            <summary>Leer el cierre completo</summary>
            <div className="ex-mas-cuerpo">
              {CIERRE.detalle.map((p) => <p key={p}>{p}</p>)}
            </div>
          </details>
          <blockquote className="ex-cierre ex-cierre-final">{CIERRE.cita}</blockquote>

          <Spotlight className="card invite-anim ex-invitar">
            <p className="ex-sobre">La ruta se descubre caminando</p>
            <SplitText
              as="h4"
              splitBy="words"
              stagger={55}
              text="Conoce a las mujeres y recorre el territorio"
              className="invite-title"
            />
            <p>
              Los cuatro ejes se encuentran en los nueve emprendimientos del corredor
              oriental de Pasto. Cada mesa, cada jardín y cada historia son una puerta
              abierta para seguir construyendo esta ruta entre todas.
            </p>
            <div className="invite-ctas">
              <a className="btn primary" href="#/mujeres">Conocer las mujeres</a>
              <a className="btn" href="#/mapa">Explorar el mapa</a>
              <a className="btn" href="#/contacto">Contacto / reserva</a>
            </div>
          </Spotlight>
        </div>
      </Reveal>
    </section>
  );
}
