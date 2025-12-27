import CGGallery from '@/components/gal/CGGallery';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Blog = () => {
    const navigate = useNavigate()
    
    return (
        <CGGallery onClose={function (): void {
            navigate('/', { replace: true })
        }} />
    )
}

export default Blog;