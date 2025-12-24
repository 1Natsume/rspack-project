// src/components/ControlPanel.tsx
import React, { useState } from 'react';
import { BackgroundType } from '@/features/gal/galSlice';
import { Character, Expression } from '@/features/gal';

interface ControlPanelProps {
    characters: Character[];
    showCharacter: (id: string, position?: 'left' | 'center' | 'right') => void;
    hideCharacter: (id: string) => void;
    changeExpression: (id: string, expression: Expression) => void;
    moveCharacter: (id: string, position: 'left' | 'center' | 'right') => void;
    changeBackground: (bg: BackgroundType) => void;
}

const CharacterControl: React.FC<{
    character: Character;
    onShow: () => void;
    onHide: () => void;
    onChangeExpression: (exp: Expression) => void;
    onMove: (pos: 'left' | 'center' | 'right') => void;
}> = ({ character, onShow, onHide, onChangeExpression, onMove }) => {
    const expressions: Expression[] = ['normal', 'happy', 'angry', 'sad', 'surprised'];

    return (
        <div className="character-control">
            <h4>{character.name}</h4>
            <div className="control-group">
                <button onClick={onShow} className="control-btn">显示</button>
                <button onClick={onHide} className="control-btn">隐藏</button>
            </div>
            <div className="control-group">
                <button onClick={() => onMove('left')} className="control-btn">左移</button>
                <button onClick={() => onMove('center')} className="control-btn">居中</button>
                <button onClick={() => onMove('right')} className="control-btn">右移</button>
            </div>
            <div className="expression-controls">
                <span>表情: </span>
                {expressions.map(exp => (
                    <button
                        key={exp}
                        onClick={() => onChangeExpression(exp)}
                        className={`expression-btn ${character.expression === exp ? 'active' : ''}`}
                    >
                        {exp}
                    </button>
                ))}
            </div>
        </div>
    );
};

const ControlPanel: React.FC<ControlPanelProps> = ({
    characters,
    showCharacter,
    hideCharacter,
    changeExpression,
    moveCharacter,
    changeBackground
}) => {
    const [isOpen, setIsOpen] = useState(true);
    const backgrounds: BackgroundType[] = ['school', 'classroom', 'sunset', 'park'];

    return (
        <div className={`control-panel ${isOpen ? 'open' : 'closed'}`}>
            <button
                className="toggle-btn"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? '▲ 隐藏控制面板' : '▼ 显示控制面板'}
            </button>

            {isOpen && (
                <>
                    <h3>角色控制</h3>
                    <div className="character-controls">
                        {characters.map(char => (
                            <CharacterControl
                                key={char.id}
                                character={char}
                                onShow={() => showCharacter(char.id)}
                                onHide={() => hideCharacter(char.id)}
                                onChangeExpression={(exp) => changeExpression(char.id, exp)}
                                onMove={(pos) => moveCharacter(char.id, pos)}
                            />
                        ))}
                    </div>

                    <div className="background-controls">
                        <h3>背景控制</h3>
                        <div className="bg-buttons">
                            {backgrounds.map(bg => (
                                <button
                                    key={bg}
                                    onClick={() => changeBackground(bg)}
                                    className="bg-btn"
                                >
                                    {bg === 'school' && '学校'}
                                    {bg === 'classroom' && '教室'}
                                    {bg === 'sunset' && '夕阳'}
                                    {bg === 'park' && '公园'}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ControlPanel;