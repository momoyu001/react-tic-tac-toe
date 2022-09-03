import React from 'react';

export class Square extends React.Component {
    // 添加构造函数用来初始化state
    // 改用props传递的方式，就不用这个构造函数了
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         value: null,
    //     };
    // }
    render() {
        return (
            <button
                className="square"
                onClick={() => {
                    this.props.onClick();
                }}
            >
                {this.props.value}
            </button>
        );
    }
}

export class Board extends React.Component {
    constructor(props) {
        // ES6 class：构造函数中要先调用super()，执行父类的构造函数。因此在React组件中，构造函数必须以super()开头
        super(props);
        this.state = {
            squares: Array(9).fill(null),
        };
    }
    handleClick(i) {
        const squares = this.state.squares.slice();
        squares[i] = 'X';
        this.setState({
            squares,
        });
    }
    renderSquare(i) {
        return <Square value={this.state.squares[i]} onClick={() => this.handleClick(i)} />;
    }

    render() {
        const status = 'Next player: X';
        return (
            <div>
                <div className="status">{status}</div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

export class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board></Board>
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}
