import { useState } from 'react';
import './qizi.css';

function Qizi(props) {
    const { value, onSquareClick, active } = props;
    return <div className={`square ${active ? 'active' : ''}`} onClick={onSquareClick}>
        {value ? <div className={`qizi ${value}`} />
            : null}
    </div>
}

export default Qizi;