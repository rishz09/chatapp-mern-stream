import { LoaderIcon } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';

const PageLoader = () => {
  const { theme } = useThemeStore();
  // implemented current theme to loading page as well

  return (
    <div className="min-h-screen flex items-center justify-center" data-theme={theme}>
      <LoaderIcon className="animate-spin size-10 text-primary" />
    </div>
  );
};

export default PageLoader;
