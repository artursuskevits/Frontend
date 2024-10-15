import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [tooted, setTooted] = useState([]);
  const idRef = useRef();
  const nameRef = useRef();
  const priceRef = useRef();
  const isActiveRef = useRef();

  useEffect(() => {
    fetch("https://localhost:7227/tooted")
        .then(res => res.json())
        .then(json => setTooted(json));
  }, []);

  function kustuta(index) {                             ////////////////////////
    fetch("https://localhost:7227/tooted/kustuta/" + index, {"method": "DELETE"})
        .then(res => res.json())
        .then(json => setTooted(json));
  }

  function lisa() {                                          ////////////////////////
    fetch(`https://localhost:7227/tooted/lisa/
        ${Number(idRef.current.value)}/${nameRef.current.value}/        
        ${Number(priceRef.current.value)}/${isActiveRef.current.checked}`, {"method": "POST"})
        .then(res => res.json())
        .then(json => setTooted(json));
  }

  function dollariteks() {
    const kurss = 1.1;                                      ////////////////////////
    fetch("https://localhost:7227/tooted/hind-dollaritesse/" + kurss, {"method": "PATCH"})
        .then(res => res.json())
        .then(json => setTooted(json));
  }

  return (
      <div className="App">
        <label>ID</label> <br />
        <input ref={idRef} type="number" /> <br />
        <label>Nimi</label> <br />
        <input ref={nameRef} type="text" /> <br />
        <label>Hind</label> <br />
        <input ref={priceRef} type="number" /> <br />
        <label>Aktiivne</label> <br />
        <input ref={isActiveRef} type="checkbox" /> <br />
        <button onClick={() => lisa()}>Lisa</button>
        {tooted.map((toode, index) =>
            <div>
              <div>{toode.id}</div>
              <div>{toode.name}</div>
              <div>{toode.price}</div>
              <button onClick={() => kustuta(index)}>x</button>
            </div>)}
        <button onClick={() => dollariteks()}>Muuda dollariteks</button>
      </div>
  );

}

export default App;