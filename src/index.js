import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {forInStatement} from "@babel/types";

const boardLoc = {
    0: {x: 0, y: 0,},
    1: {x: 0, y: 1,},
    2: {x: 0, y: 2,},
    3: {x: 1, y: 0,},
    4: {x: 1, y: 1,},
    5: {x: 1, y: 2,},
    6: {x: 2, y: 0,},
    7: {x: 2, y: 1,},
    8: {x: 2, y: 2,}
};

const Square = (props) => {
    return (
        <button
            className="square"
            onClick={props.onClick}>
            {props.value}
        </button>
    );
};

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }



    render() {
        const renderBoard = () => {
            let board = [];
            let index = 0;
            for (let i = 0; i < 3; i++) {
                let squares = [];
                for (let j = 0; j < 3; j++) {
                    squares.push(this.renderSquare(index));
                    index++;
                    console.log(squares);
                }
                board.push(<div className="board-row" key={`row-${i}`}>
                    {squares}
                </div>)
            }
            return board;
        };

        return (
            <div>
                {renderBoard()}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    onChangeColor(e) {
        const selectedStep = document.querySelector('.selected-step');
        if (!!selectedStep) {
            selectedStep.classList.toggle('selected-step');
        }
        e.target.classList.toggle('selected-step');
    }


    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Move on #' + move : 'To the beginning of the game';

            return (
                <li className="move" key={move}>
                    <button onClick={(e) => {
                        this.jumpTo(move);
                        this.onChangeColor(e);
                    }}>{desc}
                    </button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = winner + ' won!';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

const calculateWinner = (squares) => {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
};

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);
