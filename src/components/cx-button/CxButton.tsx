import React from 'react';
import {Button as AntdButton, ButtonProps} from 'antd';

const CxButton: React.FC<ButtonProps> = (props) => {
	return <AntdButton {...props} />;
};

export default CxButton;
