import { blogApi } from '@/api/blogApi';
import CGGallery from '@/components/gal/CGGallery';
import { Archive } from '@/types/blog/types';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CG = () => {
    const [archives, setArchives] = useState<Archive[]>([]);
    const navigate = useNavigate();
    const hasMounted = useRef(false);

    useEffect(() => {
        let GetCategoryList = async () => {
            setArchives(await blogApi.GetCategoryList());
        }
        
        if (hasMounted.current) return;
        GetCategoryList()
        hasMounted.current = true;
        
    }, [])


    return (
        <CGGallery cgs={archives} onClose={function (): void {
            navigate('/', { replace: true })
        }} />
    )
}

export default CG;