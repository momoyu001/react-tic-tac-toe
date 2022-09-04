import React from 'react';

/**
 * React的不可变性：
 * 1、改变数据的方式：
 * 1）直接修改变量值
 * 2）使用一份新的数据替换旧的数据
 *
 * 不直接修改数据的好处：
 * 1、简化复杂的功能
 *  不直接在数据上修改可以方便的实现追溯与复用历史记录
 * 2、跟踪数据的变化
 *  如果直接修改数据，那么旧很难追踪到数据的改变。追踪数据的改变，需要可变对象可以与改变之前的版本进行对比，
 *  这样整个对象数都需要遍历一遍。
 * 3、确定在React中何时重新渲染
 *  不可变性最主要的优势在于它可以帮助我们在React中创建  pure component，可以轻松的确定不可变数据是否发生变化，
 *  从而确定何时对组件进行渲染
 * **/

/**
 * 函数组件：
 * 若组件中只包含一个render方法，并且不包含state，那么使用函数组件就会更简单。我们并不需要定义一个继承于
 * React.Component的类，可以定义一个函数，这个函数接收props作为参数，然后返回需要渲染的元素，
 * **/

// Square是 受控组件
// export class Square extends React.Component {
//     // 添加构造函数用来初始化state
//     // 改用props传递的方式，就不用这个构造函数了
//     // constructor(props) {
//     //     super(props);
//     //     this.state = {
//     //         value: null,
//     //     };
//     // }
//     render() {
//         return (
//             <button
//                 className="square"
//                 onClick={() => {
//                     this.props.onClick();
//                 }}
//             >
//                 {this.props.value}
//             </button>
//         );
//     }
// }

// 改写为函数组件
function Square(props) {
    return (
        // 改写成函数组件之后，onClick 的写法于类组件也不同了
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

export class Board extends React.Component {
    // 变量提升至Game组件，
    // constructor(props) {
    //     // ES6 class：构造函数中要先调用super()，执行父类的构造函数。因此在React组件中，构造函数必须以super()开头
    //     super(props);
    //     this.state = {
    //         squares: Array(9).fill(null),
    //         xIsNext: true, // 棋子每移动一步，值就会反转
    //     };
    // }

    // handleClick(i) {
    //     // 为什么要创建一个squares的副本？
    //     const squares = this.state.squares.slice();
    //     if (caculateWinner(squares) || squares[i]) {
    //         return;
    //     }
    //     squares[i] = this.state.xIsNext ? 'X' : 'O';
    //     this.setState({
    //         squares,
    //         xIsNext: !this.state.xIsNext,
    //     });
    // }

    renderSquare(i) {
        return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
    }

    render() {
        // const winner = caculateWinner(this.state.squares);
        // let status;

        // if (winner) {
        //     status = `Winner: ${winner}`;
        // } else {
        //     status = `Next Player: ${this.state.xIsNext ? 'X' : 'O'}`;
        // }

        return (
            <div>
                {/* <div className="status">{status}</div> */}
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

// 完成 ”时间旅行“ 功能：将变量 history 提升至Game顶层组件中
export class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                },
            ],
            xIsNext: true,
            stepNumber: 0,
        };
    }
    handleClick(i) {
        // 为什么要创建一个squares的副本？
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        // 取最新的一份squares（即最后一份）
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        // 判断一下：若当前格子已经用过，或者已经有一方胜利，就直接return
        if (caculateWinner(squares) || squares[i]) {
            return;
        }
        // 判断当前格子要渲染 X 还是 O？
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            // 推荐使用concat，该方法不会改变原数组
            history: history.concat([
                {
                    squares: squares,
                },
            ]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }

    jumoTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: step % 2 === 0,
        });
    }

    render() {
        const history = this.state.history;
        // 根据当前的 stepNumber 渲染，而不是最后一次
        const current = history[this.state.stepNumber];
        const winner = caculateWinner(current.squares);

        // map(item, index)
        const moves = history.map((step, move) => {
            const desc = move ? `Go to move #${move}` : `Go to game start`;
            return (
                // 注意key的使用，与Vue中的
                <li key={move}>
                    <button onClick={() => this.jumoTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = `Winner: ${winner}`;
        } else {
            status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} onClick={i => this.handleClick(i)}></Board>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
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
            return squares[a];
        }
    }

    return null;
}
