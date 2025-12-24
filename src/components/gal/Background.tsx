// src/components/Background.tsx
import React from 'react';

interface BackgroundProps {
    image: string;
}

const Background: React.FC<BackgroundProps> = ({ image }) => {
    return (
        <div
            className="background"
            style={{ backgroundImage: `url(${image})` }}
        />
    );
};

export default Background;