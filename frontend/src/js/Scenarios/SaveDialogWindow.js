import React, { useState } from 'react';
import {getLinFromJson, getPbnFromJson, getDsiFromJson} from './DealHelper';
import Spinner from "../Common/Spinner";
import "../../css/Common/DialogWindow.css";

import crossImg from "../../assets/cross.png";

function SaveDialog({ isOpen, onClose, jsonDealSetString }) {
    const [filename, setFilename] = useState('');
    const [fileType, setFileType] = useState('dsi-chosen');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        let contentToSave;

        if (fileType === "lin-chosen") {
            contentToSave = getLinFromJson(jsonDealSetString);
        } else if (fileType === "pbn-chosen") {
            contentToSave = getPbnFromJson(jsonDealSetString);
        } else {
            contentToSave = getDsiFromJson(jsonDealSetString);
        }

        const blob = new Blob([contentToSave], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename || "dealset"}${fileType === "lin-chosen" ? ".lin" : fileType === "pbn-chosen" ? ".pbn" : ".dsi"}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        setIsLoading(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="DialogWindow">
            <div className="DialogWindowContent">
                <button className="CloseButton" onClick={onClose}>
                    <img src={crossImg} alt="Close" className={"CrossImg"}/>
                </button>
                <textarea
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    rows="1"
                    cols="25"
                    placeholder="filename"
                    style={{ resize: 'none' }}></textarea>
                <select value={fileType} onChange={(e) => setFileType(e.target.value)}>
                    <option value="dsi-chosen">.dsi</option>
                    <option value="pbn-chosen">.pbn</option>
                    <option value="lin-chosen">.lin</option>
                </select>
                <div className="SaveSpinnerContainer">
                    {isLoading && (<Spinner />)}
                </div>
                <button className="SaveSubmitButton" onClick={handleSubmit} disabled={isLoading}>Submit</button>
            </div>
        </div>
    );
}

export default SaveDialog;
