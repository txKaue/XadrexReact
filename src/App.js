import './App.css';
import Board from "./components/Board"


function App() {
    return (
      <div className="App">
          <div style={{width: "fit-content"}}>
            <p className="at">Super Xadrez do Kaue e da Camila</p>
            <Board />
          </div>
      </div>
    );
}



export default App;
