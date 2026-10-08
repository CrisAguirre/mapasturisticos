import { FaWhatsapp } from 'react-icons/fa';
import './WhatsAppFloat.css';

const PHONE = '573196822133';
const MESSAGE =
  'Hola! Somos el proyecto comunitario Caminos de Fogon, gracias por visitarnos, en que te podriamos ayudar?';

export default function WhatsAppFloat() {
  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="wa-float"
      aria-label="Contactar por WhatsApp"
      title="WhatsApp directo"
    >
      <FaWhatsapp className="wa-icon" />
    </a>
  );
}
