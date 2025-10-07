import { useState } from "react";
import { motion } from "framer-motion";

export default function App() {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [highlighted, setHighlighted] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [questionVisible, setQuestionVisible] = useState(false);
  const [showResultButtons, setShowResultButtons] = useState(false);

  const addPlayer = () => {
    if (name.trim() === "") return;
    setPlayers([...players, { name, score: 0 }]);
    setName("");
  };

  const randomHover = () => {
    const interval = setInterval(() => {
      const random = players[Math.floor(Math.random() * players.length)];
      setHighlighted(random.name);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      const chosen = players[Math.floor(Math.random() * players.length)];
      setHighlighted(null);
      setSelectedPlayer(chosen);
      setShowResultButtons(true);
    }, 3000);
  };

  const startSelection = () => {
    if (players.length === 0) return;
    setIsSelecting(true);
    setSelectedPlayer(null);
    setShowResultButtons(false);
    setQuestionVisible(true);
    randomHover();
  };

  const markResult = (correct) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.name === selectedPlayer.name
          ? { ...p, score: correct ? p.score + 1 : p.score }
          : p
      )
    );
    setIsSelecting(false);
    setShowResultButtons(false);
    setSelectedPlayer(null);
  };

  return (
    <div className="min-h-screen bg-background bg-purple-600 text-white p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Jogo de Perguntas</h1>

      {/* Adicionar jogador */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input w-64"
          placeholder="Nome do jogador"
        />
        <button onClick={addPlayer} className="btn-primary bg-white text-black p-1">
          Adicionar
        </button>
      </div>

      {/* Lista de jogadores */}
      <div className="flex flex-wrap gap-4 justify-center mb-6  ">
        {players.map((player) => {
          const isHighlighted = highlighted === player.name;
          const isSelected = selectedPlayer?.name === player.name;

          return (
            <motion.div
              key={player.name}
              className={`player-card bg-purple-800 border-2 border-purple-900 rounded-md pr-1 pl-1 ${
                isHighlighted
                  ? "bg-accent border-yellow-400 text-600"
                  : isSelected
                 
              }`}
              whileHover={{ scale: 1.05 }}
            >
              {player.name}{" "}
              {player.score > 0 && (
                <span className="ml-2 text-sm text-white/70">
                  ({player.score} pts)
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Botão de sorteio */}
      <button
        onClick={startSelection}
        className="btn-accent mb-6"
        disabled={isSelecting}
      >
        Sortear jogador
      </button>

      {/* Pergunta */}
      {questionVisible && (
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Pergunta:</h2>
          <p className="text-lg">Qual é a capital da França?</p>
        </div>
      )}

      {/* Resultado */}
      {showResultButtons && selectedPlayer && (
        <div className="flex gap-4">
          <button className="btn-primary" onClick={() => markResult(true)}>
            Acertou
          </button>
          <button className="btn bg-red-600 hover:bg-red-700" onClick={() => markResult(false)}>
            Errou
          </button>
        </div>
      )}
    </div>
  );
}
