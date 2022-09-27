import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

/*
class Square extends React.Component {
    render() {
        return (
            <button
                className="square"
                onClick={() => { this.props.onClick() }}
            >
                {this.props.value}
            </button>
        );
    }
} */

function Square(props) {
    return (
        <button
            className={props.styleSquare}
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                styleSquare={this.props.styleSquare[i]}
            />
        );
    }

    render() {
        const index = [[0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14],
        [15, 16, 17, 18, 19], [20, 21, 22, 23, 24]];

        const rows = index.map((i) => {
            var cells = i.map((j) => {
                return (<label key={j.toString()}>{this.renderSquare(j)}</label>);
            });

            return (
                <div key={i.toString()} className="board-row">
                    {cells}
                </div>
            );
        });

        return (
            <div>
                {rows}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(25).fill(null),
                position: null,
            }],
            xIsNext: true,
            stepNumber: 0,
            styleSquare: Array(25).fill("square"),
            ascend: false,
        };
        this.toggle = this.toggle.bind(this);
    }

    handleClick(i) {
        var history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        var styleSquare = this.state.styleSquare.slice();
        const position = [i%5, Math.floor(i/5)];

        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({
            history: history.concat([{
                squares: squares,
                position: position,
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });

        const winner = calculateWinner(squares);

        if (winner) {
            this.onWin(winner, styleSquare);
        }
    }

    onWin(winner, styleSquare) {
        styleSquare[winner[0]] = "win";
        styleSquare[winner[1]] = "win";
        styleSquare[winner[2]] = "win";
        styleSquare[winner[3]] = "win";
        styleSquare[winner[4]] = "win";

        this.setState({
            styleSquare: styleSquare,
        });
    }

    jumpTo(step) {
        var history = this.state.history.slice(0, step + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        var styleSquare = this.state.styleSquare.slice();
        const winner = calculateWinner(squares);

        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });

        if (winner) {
            this.onWin(winner, styleSquare);
        } else {
            this.setState({
                styleSquare: Array(25).fill("square"),
            });
        }
    }

    toggle() {
        this.setState({
            ascend: !this.state.ascend,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        let status;
        let flag = allAreNull(current.squares);

        const toggle = this.state.ascend ? "Ascending" : "Descending";

        const moves = history.map((step, move) => {
            if (this.state.ascend) {
                move = history.length - 1 - move;
            }
            const desc = move ?
                'Go to move #' + move + '    position (' + history[move].position.toString() + ')' :
                'Go to game start';

            if (move === this.state.stepNumber) {
                return (
                    <li key={move}>
                        <button className='btnHistory' onClick={() => this.jumpTo(move)}><b>{desc}</b></button>
                    </li>
                );
            }
            else {
                return (
                    <li key={move}>
                        <button className='btnHistory' onClick={() => this.jumpTo(move)}>{desc}</button>
                    </li>
                );
            }
        });

        if (winner) {
            status = 'Winner: ' + current.squares[winner[0]];

        }
        else if (flag) {
            status = 'Draw!!';
        }
        else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <div className='gamename'>TIC TAC TOE</div>
                    <div className='status'>{status}</div>
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        styleSquare={this.state.styleSquare}
                    />
                </div>
                <div className="game-info">
                    <div>{/*status */}</div>
                    <button className='btnSort' onClick={this.toggle}>{toggle}</button>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2, 3, 4],
        [5, 6, 7, 8, 9],
        [10, 11, 12, 13, 14],
        [15, 16, 17, 18, 19],
        [20, 21, 22, 23, 24],
        [0, 5, 10, 15, 20],
        [1, 6, 11, 16, 21],
        [2, 7, 12, 17, 22],
        [3, 8, 13, 18, 23],
        [4, 9, 14, 19, 24],
        [0, 6, 12, 18, 24],
        [4, 8, 12, 16, 20]
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c, d, e] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d] && squares[a] === squares[e]) {
            return [a, b, c, d, e];
        }
    }
    return null;
};

function allAreNull(arr) {
    return arr.every(element => element != null);
}


/* END */