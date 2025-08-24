import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import useAuthUser from '../hooks/useAuthUser';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api';

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import ChatLoader from '../components/ChatLoader';
import toast from 'react-hot-toast';
import CallButton from '../components/CallButton';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  // this works because the url that runs ChatPage is "/chat/:id"
  // we have already set which part id needs to take, hence we destructure from params
  const { id: targetUserId } = useParams();

  // communicate with stream
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ['streamToken'],
    queryFn: getStreamToken,
    enabled: !!authUser, // do not run this query function until we have authenticated user's state
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;

      try {
        console.log('Initializing stream chat client...');
        const client = StreamChat.getInstance(STREAM_API_KEY);

        // connects the logged in user to stream chat
        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        // creates a unique channel id ALWAYS, between 2 users
        // sorting because that is always a consistent way to have same channel ID between 2 users
        const channelId = [authUser._id, targetUserId].sort().join('-');

        // coming from documentation
        const currChannel = client.channel('messaging', channelId, {
          members: [authUser._id, targetUserId],
        });

        // watches the channel for any incoming changes in real-time
        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error('Error initializing chat', error);
        toast.error('Could not connect to chat. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [tokenData, authUser, targetUserId]); // whenever any of these 3 changes, run this

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success('Video call link sent successfully!');
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
