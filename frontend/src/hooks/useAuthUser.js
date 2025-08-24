// for custom hooks, mandatory to start file name with "use"
import { useQuery } from '@tanstack/react-query';
import { getAuthUser } from '../lib/api';

const useAuthUser = () => {
  // tanstack query
  const authUser = useQuery({
    queryKey: ['authUser'],
    queryFn: getAuthUser,
    retry: false, // false: do not check again
  });

  // .user because thats how we return from /auth/me
  return { isLoading: authUser.isLoading, authUser: authUser.data?.user };
};

export default useAuthUser;
