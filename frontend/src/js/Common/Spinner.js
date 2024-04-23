import React from 'react';
import '../../css/Common/Spinner.css';
import spinnerImg from '../../assets/loading-simp.png';

function Spinner () {
    const initialRotation = Math.floor(Math.random() * 360);
    
    return (
        <img 
            src={spinnerImg} alt="Loading..." 
            className={"SpinnerImg"}
            style={{transform: `rotate(${initialRotation}deg)`}}
        />
    );
}

export default Spinner;