import React from 'react';
import {CXProps} from './type';
import './style/index.less';
export const CxButton: React.FC<CXProps> = (props) => {
	return <div className='cx-lib-button'>{props.children}</div>;
};
