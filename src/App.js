import {useState, useEffect} from 'react';
import Formulario from './components/Formulario';
import ListadoImagenes from './components/ListadoImagenes';
import Error from './components/Error';

const App = () => {

  const [busqueda, setBusqueda] = useState('');
  const [imagenes, setImagenes] = useState([]);
  const [peticionVacia, setPedicionVacia] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  useEffect(() => {
    setPaginaActual(1)
  }, [busqueda])

  useEffect(() => {

    const consultarApi = async () =>{
      if(busqueda === '') return;

      const imagenesPorPagina = 30;
      const key = '22226354-09ffd12edc4c8d41e60449e43';
      const url = `https://pixabay.com/api/?key=${key}&q=${busqueda}&per_page=${imagenesPorPagina}&page=${paginaActual}`;

      const respuesta = await fetch(url);
      const resultado = await respuesta.json();
      if(resultado.total === 0){
        setPedicionVacia(true);
        return;
      }
      setPedicionVacia(false);
      setImagenes(resultado.hits);

        //Calculo total páginas
      const calcularTotalPaginas = Math.ceil(resultado.totalHits / imagenesPorPagina);
      setTotalPaginas(calcularTotalPaginas);

        //Mover pantalla para arriba
      const jumbotron = document.querySelector('.jumbotron');
      jumbotron.scrollIntoView({behavior: 'smooth'});
    }
   
    consultarApi();

  }, [busqueda, paginaActual])


  //Ir a la página anterior
  const paginaAnterior = () =>{
    const nuevaPaginaActual = paginaActual - 1;
    if(nuevaPaginaActual === 0) return;
    setPaginaActual(nuevaPaginaActual);
  }

  //Ir a la página siguiente
  const paginaSiguiente = () =>{
    const nuevaPaginaSiguiente = paginaActual + 1;
    if(nuevaPaginaSiguiente > totalPaginas) return;
    setPaginaActual(nuevaPaginaSiguiente);
  }

  return (
    <div className="container">
      <div className="jumbotron">
        <p className="lead text-center">
          Buscador de Imágenes
        </p>
        <Formulario 
          setBusqueda={setBusqueda} 
        />
      </div>
      <div className="row justify-content-center">
      {peticionVacia && <Error mensaje="No hay datos" />}
        <ListadoImagenes
          imagenes={imagenes}
        />

        {(paginaActual === 1) ? null : (
        <button 
          type="button"
          className="bbtn btn-info mr-1"
          onClick={paginaAnterior}
        >
          &laquo; Anterior
        </button>
        )}

        {(paginaActual !== totalPaginas) && (
        <button 
          type="button"
          className="bbtn btn-info mr-1"
          onClick={paginaSiguiente}
        >
          Siguiente &raquo;
        </button>
        )}
      </div>
    </div>
  );
}

export default App;