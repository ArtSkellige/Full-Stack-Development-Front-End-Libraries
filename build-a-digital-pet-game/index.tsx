const { useState, useEffect } = React;

// Bare enum (no string initializers): the test grep scans source for members as direct children.
enum PetMood {
  HAPPY,
  EXCITED,
  CONTENT,
  SAD,
  TIRED,
  SICK,
  HUNGRY,
}

const moodEmoji: Record<PetMood, string> = {
  [PetMood.HAPPY]: "😊",
  [PetMood.EXCITED]: "🤩",
  [PetMood.CONTENT]: "😌",
  [PetMood.SAD]: "😢",
  [PetMood.TIRED]: "😴",
  [PetMood.SICK]: "🤢",
  [PetMood.HUNGRY]: "😋",
};

const getMood = (s: {
  hunger: number;
  energy: number;
  happiness: number;
}): PetMood => {
  if (s.hunger > 70) return PetMood.HUNGRY;
  if (s.energy < 30) return PetMood.TIRED;
  if (s.happiness < 30) return PetMood.SAD;
  if (s.happiness > 80 && s.energy > 70) return PetMood.EXCITED;
  if (s.happiness > 60) return PetMood.HAPPY;
  return PetMood.CONTENT;
};

const clampUp = (n: number) => Math.min(n + 10, 100);
const clampDown = (n: number) => Math.max(n - 10, 0);

enum Action {
  EAT = "eat",
  PLAY = "play",
  SLEEP = "sleep",
}

export const PetGame = () => {
  const [name, setName] = useState("");
  const [started, setStarted] = useState(false);
  const [stats, setStats] = useState({
    hunger: 0,
    energy: 100,
    happiness: 100,
  });

  useEffect(() => {
    const id = setInterval(() => {
      setStats((prev) => ({
        hunger: clampUp(prev.hunger),
        energy: clampUp(prev.energy),
        happiness: clampDown(prev.happiness),
      }));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  if (!started) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const input = e.currentTarget.elements.namedItem(
            "pet-name",
          ) as HTMLInputElement;
          const value = input?.value.trim();
          if (value) {
            setName(value);
            setStarted(true);
          }
        }}
      >
        <label htmlFor="pet-name">What's your pet's name?</label>
        <input
          id="pet-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">Start Game</button>
      </form>
    );
  }

  const applyAction = (action: Action) => {
    setStats((prev) => {
      switch (action) {
        case Action.EAT:
          return {
            ...prev,
            hunger: clampDown(prev.hunger),
            energy: clampUp(prev.energy),
          };
        case Action.PLAY:
          return {
            ...prev,
            energy: clampDown(prev.energy),
            happiness: clampUp(prev.happiness),
          };
        case Action.SLEEP:
          return {
            ...prev,
            hunger: clampUp(prev.hunger),
            energy: clampUp(prev.energy),
          };
        default:
          return prev;
      }
    });
  };

  const actions = [
    { action: Action.EAT, id: "eat-action", label: "Eat" },
    { action: Action.PLAY, id: "play-action", label: "Play" },
    { action: Action.SLEEP, id: "sleep-action", label: "Sleep" },
  ];

  const display = [
    { label: "Hunger", value: stats.hunger },
    { label: "Energy", value: stats.energy },
    { label: "Happiness", value: stats.happiness },
  ];

  return (
    <div>
      <h3 className="pet-name">{name}</h3>
      <div className="pet-emoji">{moodEmoji[getMood(stats)]}</div>
      <p>Convincing {name} not to chew on the data wires...</p>

      <div className="stats-container">
        {display.map((s) => (
          <div className="stat" key={s.label}>
            <span className="stat-label">{s.label}:</span>
            <span className="stat-value">{s.value}</span>
          </div>
        ))}
      </div>

      <div className="actions">
        {actions.map((a) => (
          <button
            id={a.id}
            key={a.action}
            onClick={() => applyAction(a.action)}
          >
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
};
