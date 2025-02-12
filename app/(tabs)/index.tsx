import { getChatPermissions } from '@/utils/permissions';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { CometChatContextProvider, CometChatConversations, CometChatUIKit, UIKitSettings } from '@cometchat/chat-uikit-react-native'
import { CometChat } from '@cometchat/chat-sdk-react-native'
import { useRouter } from 'expo-router';
import { useCometChatTheme } from '@/hooks/useCometChatTheme';

export default function HomeScreen() {
  const router = useRouter()
  const cometChatTheme = useCometChatTheme()

  useEffect(() => {
    getChatPermissions();

    let uikitSettings: UIKitSettings = {
      appId: '268482a0c6299ce1',
      authKey: '10098b1cc0f8197141d2520f29ce4f5d1f8b534a',
      region: 'eu',
    };

    CometChatUIKit.init(uikitSettings)
      .then(() => {
        console.log('CometChatUiKit successfully initialized');
        return CometChatUIKit.login({ uid: '676d3e1037c17e702fd0a93d' })
      })
      .catch((error) => {
        console.log('Initialization failed with exception:', error);
      });
  }, []);

  const conversationPressHandler = (conversation: any) => {
    const conversationWith: any = conversation.getConversationWith()

    router.push({
      pathname: '/conversation',
      params: {
        conversationType: conversation.getConversationType(),
        conversationWith: (conversationWith as any)['uid'],
        conversationTitle: (conversationWith as any)['name'],
        conversationAvatar: (conversationWith as any)['avatar'],
        conversationStatus: (conversationWith as any)['status'],
      },
    })
  }

  return (
    <CometChatContextProvider theme={cometChatTheme}>
      <CometChatConversations title='' onItemPress={conversationPressHandler} />
    </CometChatContextProvider>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
