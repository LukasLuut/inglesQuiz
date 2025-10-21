import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit3, Trash2 } from "lucide-react";

export default function App() {
  /* ================================
   🧠 ESTADOS GERAIS DO JOGO
  ================================= */
  const [players, setPlayers] = useState([]); // Lista de jogadores
  const [name, setName] = useState(""); // Nome do jogador sendo digitado
  const [selectedPlayer, setSelectedPlayer] = useState(null); // Jogador sorteado
  const [highlighted, setHighlighted] = useState(null); // Jogador temporariamente destacado durante o sorteio
  const [isSelecting, setIsSelecting] = useState(false); // Indica se está sorteando
  const [questionVisible, setQuestionVisible] = useState(false); // Mostra/oculta o quadro da pergunta
  const [showResultButtons, setShowResultButtons] = useState(false); // Mostra botões de resultado
  const [hoveredPlayer, setHoveredPlayer] = useState(null); // Jogador com hover ativo
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questions, setQuestions] = useState([
    "How do you usually study for a test?",
    "What helps you remember information better?",
    "Do you prefer studying alone or with others? Why?",
    "How does listening help you learn a subject?",
    "Do you like using flashcards? Why?",
    "How does writing notes help you learn?",
    "Which is better for you: reading or watching videos?",
    "Do you use mind maps or summaries?",
    "How often do you review what you study?",
    "What time of day do you learn best?",
    "Do you test yourself after studying? How?",
    "What do you do when you don't understand something?",
    "Do you learn better by doing exercises or reading theory?",
    "Are you a visual, auditory, or kinesthetic learner?",
    "Do you remember things better when you draw them?",
    "How do you feel about group study? Does it help you?",
    "What tools do you use to stay focused while studying?",
    "How do breaks help you study better?"
  ]);

  const hoverTimeoutRef = useRef(null); // Referência para controlar o tempo de hover

  /* ================================
   ➕ FUNÇÕES DE JOGADORES
  ================================= */
  const addPlayer = () => {
    if (name.trim() === "") return;
    setPlayers([...players, { name, score: 0 }]);
    setName("");
  };

  const removePlayer = (nameToRemove) => {
    setPlayers((prev) => prev.filter((p) => p.name !== nameToRemove));
  };

  const editPlayer = (playerName) => {
    const newName = prompt("Edit Player Name:", playerName);
    if (newName && newName.trim() !== "") {
      setPlayers((prev) =>
        prev.map((p) =>
          p.name === playerName ? { ...p, name: newName } : p
        )
      );
    }
  };

  const getQuestion = () => {
    const randomNumber = Math.floor(Math.random() * questions.length)
    const question = questions[randomNumber];

    const saveQuestions = questions;
    saveQuestions.splice(randomNumber, 1);
    setQuestions(saveQuestions)

    return question;
  }

  /* ================================
   🎲 LÓGICA DE SORTEIO DE JOGADOR
  ================================= */
  const randomHover = () => {
    // Pisca nomes aleatoriamente antes de escolher o sorteado
    const interval = setInterval(() => {
      const random = players[Math.floor(Math.random() * players.length)];
      setHighlighted(random.name);
    }, 100);

    // Após 3 segundos, escolhe o jogador final
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
    const question = getQuestion();
    setTimeout(() => {
      setCurrentQuestion(question);
    }, 3000)
    randomHover();
  };

  /* ================================
   ✅❌ RESULTADO DA PERGUNTA
  ================================= */
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

  /* ================================
   🖱️ CONTROLE DE HOVER COM DELAY
  ================================= */
  const handleMouseEnter = (playerName) => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredPlayer(playerName);
    }, 800); // Delay de 0.8s para mostrar ícones
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeoutRef.current);
    setHoveredPlayer(null);
  };

  /* ================================
   🎨 INTERFACE PRINCIPAL
  ================================= */
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-700 text-white p-8 flex flex-col items-center font-sans">
      {/* ================================
       🧙‍♂️ TÍTULO
      ================================= */}
      <motion.h1
        className="text-4xl font-bold mb-10 text-yellow-400 drop-shadow-lg"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🧙‍♂️ Discussion Game
      </motion.h1>

      {/* ================================
       ➕ FORMULÁRIO DE ADIÇÃO DE JOGADOR
      ================================= */}
      <motion.div
        className="flex gap-2 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addPlayer(); // ✅ Pressionar Enter adiciona jogador
          }}
          className="w-64 p-2 rounded-md border-2 border-purple-500 bg-purple-950 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="Player name"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05, backgroundColor: "#fde047" }}
          onClick={addPlayer}
          className="px-4 py-2 rounded-md bg-yellow-400 text-purple-900 font-semibold shadow-md"
        >
          Add Player
        </motion.button>
      </motion.div>

      {/* ================================
       👥 LISTA DE JOGADORES
      ================================= */}
      <div className="max-w-[800px] flex flex-wrap gap-6 justify-center mb-8 mt-8">
        <AnimatePresence>
          {players.map((player) => {
            const isHighlighted = highlighted === player.name;
            const isSelected = selectedPlayer?.name === player.name;
            const isHovered = hoveredPlayer === player.name;

            return (
              <motion.div
                key={player.name}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: isHighlighted ? 1.15 : 1,
                  rotate: isSelected ? 8 : 0,
                }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                onMouseEnter={() => handleMouseEnter(player.name)}
                onMouseLeave={handleMouseLeave}
              >
                {/* CARTÃO DO JOGADOR */}
                <motion.div
                  whileHover={!isSelected ? { scale: 1.05 } : {}}
                  animate={{
                    scale: isSelected ? 1.1 : isHighlighted ? 1.06 : 1,
                    boxShadow: isSelected
                      ? [
                        "0 0 10px rgba(250,204,21,0.85)",
                        "0 0 25px rgba(250,204,21,0.65)",
                        "0 0 10px rgba(250,204,21,0.85)",
                      ]
                      : "0 0 0 rgba(0,0,0,0)",
                    backgroundColor: isHovered
                      ? "#6d28d9" // roxo intenso no hover
                      : isSelected
                        ? "#facc15"
                        : isHighlighted
                          ? "#facc15"
                          : "#4c1d95",
                    color: isHovered ? "#fff" : isSelected ? "#1e0033" : "#ffffff",
                  }}
                  transition={{
                    scale: { type: "spring", stiffness: 200, damping: 16 },
                    backgroundColor: { duration: 0.2 },
                  }}
                  className="w-40 h-30 flex mb-2 pb-10 items-center justify-center rounded-xl text-center cursor-pointer select-none shadow-md transition border border-purple-600 hover:border-yellow-400"
                >
                  {/* CONTEÚDO INTERNO DO CARD */}
                  <AnimatePresence mode="wait">
                    {isHovered ? (
                      // ÍCONES APARECEM DENTRO DO CARD
                      <motion.div
                        key="icons"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        className="flex gap-4 mb-0 mt-10"
                      >
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          onClick={() => editPlayer(player.name)}
                          className="p-2 rounded-full hover:text-purple-900 transition"
                        >
                          <Edit3 size={18} className="text-yellow-300" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          onClick={() => removePlayer(player.name)}
                          className="p-2 rounded-full hover:text-white transition"
                        >
                          <Trash2 size={18} className="text-red-400" />
                        </motion.button>
                      </motion.div>
                    ) : (
                      // Avatar + Nome
                      <motion.div
                        key="avatar"
                        className="flex flex-col items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <img
                          src={`https://robohash.org/${encodeURIComponent(player.name)}?set=set4 `}
                          alt={player.name}
                          className="w-20 h-20  "
                        />
                        <span className="text-lg font-semibold mt-2 mb-0">{player.name}</span>
                        {player.score > 0 && (
                          <span className="text-sm text-purple-450 mb-2">{player.score} pts</span>
                        )}
                      </motion.div>

                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ================================
       🎲 BOTÃO DE SORTEIO
      ================================= */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={startSelection}
        disabled={isSelecting}
        className={`px-6 py-2 rounded-full font-semibold text-lg transition ${isSelecting
            ? "bg-purple-500 text-white cursor-not-allowed opacity-70"
            : "bg-yellow-400 text-purple-900 hover:bg-yellow-300 shadow-md shadow-yellow-400/30"
          }`}
      >
        Choice Player 🎲
      </motion.button>

      {/* ================================
       📜 QUADRO DE PERGUNTA
      ================================= */}
      <AnimatePresence>
        {questionVisible && (
          <motion.div
            key="question"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 40, damping: 15 }}
            className="mt-10 bg-purple-950/60 border-4 border-yellow-400 rounded-2xl shadow-lg shadow-yellow-400/30 p-6 text-center max-w-lg"
          >
            <h2 className="text-2xl font-bold mb-2 text-yellow-300">
              Ask:
            </h2>
            <p className="text-lg text-white/90">
              {
                currentQuestion
              }
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================================
       🟢🔴 BOTÕES DE RESULTADO
      ================================= */}
      <AnimatePresence>
        {showResultButtons && selectedPlayer && (
          <motion.div
            key="resultButtons"
            className="flex gap-6 mt-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => markResult(true)}
              className="px-6 py-2 bg-green-500 text-white rounded-full font-bold hover:bg-green-400 shadow-md"
            >
              ✅
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => markResult(false)}
              className="px-6 py-2 bg-red-600 text-white rounded-full font-bold hover:bg-red-500 shadow-md"
            >
              ❌
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
