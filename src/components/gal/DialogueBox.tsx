// src/components/DialogueBox.tsx
import galSlice from '@/features/gal/galSlice';
import React, { useState, useEffect, useRef } from 'react';

interface DialogueBoxProps {
    isTyping: boolean;
    speaker: string | null;
    displayText: string;
    onClick?: () => void;
    onComplete?: () => void; // 完成回调
}

const DialogueBox: React.FC<DialogueBoxProps> = ({ isTyping, speaker, displayText, onClick }) => {

    return (
        <div className="dialogue-box" onClick={onClick}>
            {speaker && (
                <div className="speaker-name">{speaker}</div>
            )}
            <div className="dialogue-text">{displayText}</div>
            {isTyping && <div className="cursor">|</div>}
        </div>
    );
};

export default DialogueBox;