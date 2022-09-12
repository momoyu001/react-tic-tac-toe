// 棋盘组件
import React from 'react';
import { Square } from './Square';
export class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                activeSquare={this.props.activeLine.includes(i)}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        // 循环方式渲染棋盘
        const arr = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
        ];

        const boardHtml = arr.map((item, index) => {
            const rowHtml = item.map((subItem, subIndex) => {
                return <span key={`${subItem}-${subIndex}`}>{this.renderSquare(subItem)}</span>;
            });

            return (
                <div key={index} className="board-row">
                    {rowHtml}
                </div>
            );
        });

        return <div>{boardHtml}</div>;
    }
}
