import { useState } from "react";
import Card from "../Card/Card";
import { ToastContainer, toast } from 'react-toastify';
import './Grid.css';
import 'react-toastify/dist/ReactToastify.css';

const WIN_LINES = [
    0b000000111,
    0b000111000,
    0b111000000,
    0b001001001,
    0b010010010,
    0b100100100,
    0b100010001,
    0b001010100,
];

function isWinner(board, symbol) {
    if (board[0] == board[1] && board[1] == board[2] && board[2] == symbol) return symbol;
    if (board[3] == board[4] && board[4] == board[5] && board[5] == symbol) return symbol;
    if (board[6] == board[7] && board[7] == board[8] && board[8] == symbol) return symbol;

    if (board[0] == board[3] && board[3] == board[6] && board[6] == symbol) return symbol;
    if (board[1] == board[4] && board[4] == board[7] && board[7] == symbol) return symbol;
    if (board[2] == board[5] && board[5] == board[8] && board[8] == symbol) return symbol;

    if (board[0] == board[4] && board[4] == board[8] && board[8] == symbol) return symbol;
    if (board[2] == board[4] && board[4] == board[6] && board[6] == symbol) return symbol;
    return "";
}

function maskFromBoard(board) {
    let oMask = 0;
    let xMask = 0;
    board.forEach((value, index) => {
        if (value === "O") oMask |= 1 << index;
        if (value === "X") xMask |= 1 << index;
    });
    return { oMask, xMask };
}

function isWinnerMask(mask) {
    return WIN_LINES.some((line) => (mask & line) === line);
}

function getBestMove(board) {
    const { oMask, xMask } = maskFromBoard(board);
    const memo = new Map();

    function minimax(aiMask, humanMask, isAiTurn) {
        if (isWinnerMask(aiMask)) return 1;
        if (isWinnerMask(humanMask)) return -1;
        const fullMask = aiMask | humanMask;
        if (fullMask === 0x1ff) return 0;

        const key = `${aiMask}-${humanMask}-${isAiTurn}`;
        if (memo.has(key)) return memo.get(key);

        const emptyMask = ~fullMask & 0x1ff;
        let best = isAiTurn ? -Infinity : Infinity;

        for (let index = 0; index < 9; index++) {
            const bit = 1 << index;
            if (!(emptyMask & bit)) continue;
            const score = isAiTurn
                ? minimax(aiMask | bit, humanMask, false)
                : minimax(aiMask, humanMask | bit, true);
            if (isAiTurn) {
                best = Math.max(best, score);
                if (best === 1) break;
            } else {
                best = Math.min(best, score);
                if (best === -1) break;
            }
        }

        memo.set(key, best);
        return best;
    }

    let bestMove = null;
    let bestScore = -Infinity;
    const emptyMask = ~(oMask | xMask) & 0x1ff;

    for (let index = 0; index < 9; index++) {
        const bit = 1 << index;
        if (!(emptyMask & bit)) continue;
        const score = minimax(xMask | bit, oMask, false);
        if (score > bestScore) {
            bestScore = score;
            bestMove = index;
        }
    }

    return bestMove;
}

function Grid({ numberOfCards }) {
    const [board, setBoard] = useState(Array(numberOfCards).fill(""));
    const [winner, setWinner] = useState(null);

    function play(index) {
        if (winner || board[index] !== "") return;

        const newBoard = [...board];
        newBoard[index] = "O";

        if (isWinner(newBoard, "O")) {
            setBoard(newBoard);
            setWinner("O");
            toast.success("Congratulations O win the game!!");
            return;
        }

        const aiIndex = getBestMove(newBoard);
        if (aiIndex !== null) {
            newBoard[aiIndex] = "X";
            if (isWinner(newBoard, "X")) {
                setBoard(newBoard);
                setWinner("X");
                toast.success("Congratulations X win the game!!");
                return;
            }
        }

        setBoard(newBoard);
    }

    function reset() {
        setBoard(Array(numberOfCards).fill(""));
        setWinner(null);
    }

    return (
        <div className="grid-wrapper">
            <ToastContainer />
            {winner && (
                <>
                    <h1 className="turn-highlight">Winner is {winner}</h1>
                    <button onClick={reset} className="reset">Reset game</button>
                </>
            )}
            {!winner && <h1 className="turn-highlight">Current Turn: Your move (O)</h1>}
            <div className="grid">
                {board.map((value, idx) => {
                    return <Card gameEnd={Boolean(winner)} onPlay={play} player={value} key={idx} index={idx} />;
                })}
            </div>
        </div>
    );
}

export default Grid;
