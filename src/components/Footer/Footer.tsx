import cl from "./Footer.module.css";

const Footer = () => {
    return (
      <footer className={cl.footer}>
        <div className={cl.footer_items}>
          <span className={cl.email}>pochta@pochta.ru</span>
          <span className={cl.phone}>89456123771</span>
        </div>
      </footer>
    );
  };
  
  export default Footer;