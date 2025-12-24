// src/components/CharacterSprite.tsx
import React from 'react';
import { charactersData } from '@/features/gal/galSlice';
import { Character } from '@/features/gal';

interface CharacterSpriteProps {
    character: Character;
}

const CharacterSprite: React.FC<CharacterSpriteProps> = ({ character }) => {
    const positionClass = `character-${character.position}`;
    const characterImage = charactersData[character.id];

    return (
        <div className={`character ${positionClass}`}>
            <div className="character-sprite">
                <img
                    src={characterImage.cloths[character.cloth]}
                    alt={character.name}

                />
            </div>
            <div className="character-expression">
                <img
                    src={characterImage.expressions[character.expression]}
                    alt={character.name}

                />
            </div>

        </div>
    );
};

export default CharacterSprite;