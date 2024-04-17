import React, { useState } from 'react';
import {getLinFromDsi, getPbnFromDsi} from "./DealHelper";
import "../../css/Scenarios/SaveDialogWindow.css";

function SaveDialog({ isOpen, onClose, dsiString }) {
    const [filename, setFilename] = useState('');
    const [fileType, setFileType] = useState('dsi-chosen');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        let contentToSave = dsiString;

        if (fileType === "lin-chosen") {
            contentToSave = getLinFromDsi(dsiString); // Implement this function based on your conversion logic
        } else if (fileType === "pbn-chosen") {
            contentToSave = getPbnFromDsi(dsiString); // Implement this function based on your conversion logic
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
        <div className="dialog-window">
            <div className="dialog-window-content">
                <button className="close-button" onClick={onClose}>
                    <img src="path_to_assets/cross.png" alt="Close"/>
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
                {isLoading && (
                    <div className="spinner-container">
                        <img src="path_to_assets/loading-simp.png" alt="Loading"/>
                    </div>
                )}
                <button className="save-submit-button" onClick={handleSubmit} disabled={isLoading}>Submit</button>
            </div>
        </div>
    );
}

export default SaveDialog;
