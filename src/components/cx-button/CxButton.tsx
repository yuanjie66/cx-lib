import React from 'react';
import {Button as AntdButton, ButtonProps} from 'antd';
// import 'antd/es/button/style/css'; // 手动引入 Antd Button 的样式
export const CxButton: React.FC<ButtonProps> = (props) => {
	return <AntdButton {...props} />;
};
