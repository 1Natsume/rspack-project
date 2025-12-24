import GlobalLoading from '@/components/global-loading';
import { useSelector } from '@/hooks/use-selector';
import { useUserDetail } from './common/use-user-detail';
import Content from './content';
import Slide from './slide';
import { useconfigStore } from '@/stores/config';

export default function Layout() {

  const { lang } = useconfigStore(useSelector('lang'));
  const { loading } = useUserDetail();

  if (loading) {
    return (
      <GlobalLoading />
    )
  }

  return (
      <div key={lang} className='overflow-hidden'>
        <Slide />
        {/* <Content /> */}
      </div>
  );
}
