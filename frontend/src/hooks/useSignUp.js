import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signup } from '../lib/api';

const useSignUp = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: signup,
    // onSuccess, query with key "authUser" is invalidated, means that it is no longer available in cache, so refetch it
    // in App.jsx, this basically will refetch /auth/me to get the new logged-in user's data
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['authUser'] }),
  });

  return { isPending, error, signupMutation: mutate };
};

export default useSignUp;
