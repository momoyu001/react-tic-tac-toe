import React from 'react';
import { Board } from './Board.js';

export class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                    currentPoint: [null, null], // 记录此时点击的坐标（列号、行号）
                    index: 0,
                },
            ],
            xIsNext: true,
            stepNumber: 0,
            activeHistory: null,
            increase: true, // 是否升序（升序-默认）
            activeLine: [], // 赢家的路径
        };
    }
    handleClick(i) {
        // 为什么要创建一个squares的副本？
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        // 取最新的一份squares（即最后一份）
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        // 计算当前点击的坐标
        const currentX = Math.floor(i / 3);
        const currentY = i % 3;
        const currentPoint = [currentX + 1, currentY + 1];
        const cacuRet = caculateWinner(squares);
        // 判断一下：若当前格子已经用过，或者已经有一方胜利，就直接return
        if (cacuRet || squares[i]) {
            if (cacuRet) {
                const activeLine = cacuRet[0];
                this.setState({
                    activeLine,
                });
            }
            return;
        }
        // 判断当前格子要渲染 X 还是 O？
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            // 推荐使用concat，该方法不会改变原数组
            history: history.concat([
                {
                    squares: squares,
                    currentPoint,
                    index: history.length + 1,
                },
            ]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }

    jumoTo(step, move) {
        this.setState({
            stepNumber: this.state.increase ? move : this.state.history.length - 1 - move,
            xIsNext: step % 2 === 0,
            activeHistory: step.index,
        });
    }

    // 升序降序
    sortTo(increase = true) {
        this.setState({
            increase,
        });
    }

    renderHistory() {
        let history = this.state.history;
        history = this.state.increase ? history : history.reverse();
        // map(item, index)
        const moves = history.map((step, move) => {
            const point = step.currentPoint;
            let desc;
            let pointText = '';
            if (this.state.increase) {
                // 默认升序的场景
                desc = move ? `Go to move #${step.index}` : `Go to game start`;
                pointText = move ? '坐标' : '';
            } else {
                desc = move === history.length - 1 ? `Go to game start` : `Go to move #${step.index}`;
                pointText = move === history.length - 1 ? '' : '坐标';
            }
            return (
                // 注意key的使用，与Vue中的
                <div key={step.index} className="game-li">
                    <div
                        className={this.state.activeHistory === step.index ? 'game-active-item game-li-button' : 'game-li-button'}
                        onClick={() => this.jumoTo(step, move)}
                    >
                        {`${desc}\t\t${pointText}${point[0] ? point[0] + ',' : ''}${point[1] ? point[1] : ''}`}
                    </div>
                </div>
            );
        });

        return moves;
    }

    render() {
        const history = this.state.history;
        const historyLen = this.state.history.length;
        // 根据当前的 stepNumber 渲染，而不是最后一次
        const current = history[this.state.stepNumber];
        // map(item, index)
        const moves = this.renderHistory();
        const ret = caculateWinner(current.squares);
        let activeLine;
        let status;
        if (ret) {
            const winner = ret[1];
            activeLine = ret[0];
            status = `Winner: ${winner}`;
        } else {
            if (historyLen === 10 && current.index === 10) {
                // 无人获胜
                status = `平局，无人获胜~`;
            } else {
                status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
            }
        }

        return (
            <div className="game-module">
                <div className="game-title">~~React-tic-tac-toe~~</div>
                <div className="game-content">
                    <div className="game-board">
                        <Board
                            squares={current.squares}
                            activeLine={activeLine ? activeLine : []}
                            onClick={i => this.handleClick(i)}
                        ></Board>
                    </div>
                    <div className="game-info">
                        <div className="game-status">{status}</div>
                        <div className="game-button-box">
                            <div className="game-button" onClick={() => this.sortTo(true)}>
                                升序
                            </div>
                            <div className="game-button" onClick={() => this.sortTo(false)}>
                                降序
                            </div>
                        </div>
                        <div className="game-history">{moves}</div>
                    </div>
                </div>
            </div>
        );
    }
}

// 判断是否有玩家胜利
function caculateWinner(squares) {
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
            return [lines[i], squares[a]];
        }
    }

    return null;
}
