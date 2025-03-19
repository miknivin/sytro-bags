// components/WhatsAppButton.js

import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const WhatsAppButton = () => {
  const phoneNumber = "9567678465";
  const message = "Hi there! I have a question. Could you help me?";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-button"
    >
      <FontAwesomeIcon className="whatsapp-icon" icon={faWhatsapp} />
    </a>
  );
};

export default WhatsAppButton;
