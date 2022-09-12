// 单个棋盘格子组件
export function Square(props) {
    return (
        // 改写成函数组件之后，onClick 的写法于类组件也不同了
        <button className={props.activeSquare ? 'square active-square' : 'square'} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

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
