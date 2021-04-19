import produce from "immer";
import { useState, useCallback, useRef } from "react";

const numCols = 40;
const numRows = 30;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 1],
  [-1, 0],
];

const emptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols)).fill(0));
  }
  return rows;
};

const Game = () => {
  const [grid, setGrid] = useState(() => {
    return emptyGrid();
  });

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighbors += g[newI][newJ];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });
    setTimeout(runSimulation, 100);
  }, []);

  return (
    <div>
      <div
        className="container"
        style={{
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[i][j] = grid[i][j] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: "20px",
                height: "20px",
                border: "1.5px solid",
                backgroundColor: grid[i][j] ? "#4f0670" : undefined,
              }}
            />
          ))
        )}
      </div>
      <div className="btn">
        <button
          className="btn1"
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}
        >
          {running ? "Stop" : "Start"}
        </button>
        <button
          className="btn1"
          onClick={() => {
            const rows = [];
            for (let i = 0; i < numRows; i++) {
              rows.push(
                Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0))
              );
              setGrid(rows);
            }
          }}
        >
          Random
        </button>
        <button
          className="btn1"
          onClick={() => {
            setGrid(emptyGrid());
            setRunning(!running);
          }}
        >
          clear
        </button>
      </div>
    </div>
  );
};

export default Game;
