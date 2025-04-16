export const Footer = ()=>{

    const currentYear = new Date()

    return(
        <div>
            <footer id="footer" className="footer">
                <div className="copyright">
                    <p>
                        {currentYear.getFullYear()}&copy; Copyright 
                        <strong>
                            <span>NiceAdmin.</span>
                        </strong>
                        
                        Todos los derechos reservados
                    </p>
                </div>
                <div className="credits">
                    Diseñado por <a href="https://bootstrapmade.com/">BootstrapMade</a>
                </div>
            </footer>
        </div>
    )
}