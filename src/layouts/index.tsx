import GlobalLoading from '@/components/global-loading';
import { useSelector } from '@/hooks/use-selector';
import { useUserDetail } from './common/use-user-detail';
import Content from './content';
import Slide from './slide';
import { useConfigStore } from '@/stores';

export default function Layout() {

  const { lang } = useConfigStore(useSelector('lang'));
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
