import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

/**
 * All code commented in this code prevents the expo-router decode error
 * We believe that cometchat-uikit causes this error
 */

import {
  CometChatMessageList,
  CometChatContextProvider,
  MessageListStyleInterface,
} from '@cometchat/chat-uikit-react-native';
import { listners } from '@cometchat/chat-uikit-react-native/src/CometChatMessageHeader/listners';
import { CometChat } from '@cometchat/chat-sdk-react-native';
import { useCometChatTheme } from '@/hooks/useCometChatTheme';

const Conversation = () => {
  const {
    conversationWith,
    conversationType,
    conversationTitle,
    conversationAvatar,
    conversationStatus,
  } = useLocalSearchParams();

  const cometchatTheme = useCometChatTheme()

  const conversation = useRef<CometChat.Conversation | any>(null);
  const userStatusListenerId = useRef<string>(
    `user_status_${new Date().getTime()}`
  );
  const messsageTypingListenerId = useRef<string>(
    `message_typing_${new Date().getTime()}`
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const user = useRef<CometChat.User | null>(null);
  const router = useRouter();
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [userStatus, setUserStatus] = useState<string>('');

  useEffect(() => {
    const init = async () => {
      try {
        const _user = await CometChat.getUser(conversationWith as string);
        const _conversation = await CometChat.getConversation(
          conversationWith as string,
          conversationType as string
        );

        user.current = _user;
        conversation.current = _conversation;

        setUserStatus(_user.getStatus() || '');
        setIsLoading(false);
      } catch (err: any) {
        // TODO: HANDLE ERRORS
        console.error('An Error occurred while loading chats', err);
      }
    };

    init();
  }, [conversationType, conversationWith]);

  useEffect(() => {
    setUserStatus(user.current?.getStatus() || '');
  }, [user.current]);

  useEffect(() => {
    if (user.current) {
      listners.addListener.userListener({
        userStatusListenerId: userStatusListenerId.current,
        handleUserStatus,
      });
    }

    listners.addListener.messageListener({
      msgTypingListenerId: messsageTypingListenerId.current,
      msgTypingIndicator: typingIndicatorHandler,
    });

    return () => {
      if (user.current) {
        listners.removeListner.removeUserListener({ userStatusListenerId });
      }

      listners.removeListner.removeMessageListener({
        msgTypingListenerId: messsageTypingListenerId,
      });
    };
  }, []);

  const conversationWithData = useMemo(() => {
    if (conversationType === CometChat.RECEIVER_TYPE.USER) {
      return {
        user: conversation.current?.['conversationWith'] as CometChat.User,
        group: undefined,
      };
    }

    if (conversationType === CometChat.RECEIVER_TYPE.GROUP) {
      return {
        user: undefined,
        group: conversation.current?.['conversationWith'] as CometChat.Group,
      };
    }

    return { user: undefined, group: undefined };
  }, [conversationType, conversation.current]);

  const goBack = () => {
    if (!router.canGoBack()) return;

    router.back();
  };

  const handleUserStatus = (userDetails: any) => {
    if (userDetails.uid === user.current?.getUid())
      setUserStatus(userDetails.status);
  };

  const typingIndicatorHandler = (typist: any, status: string) => {
    setIsTyping(status === 'typing');
  };

  return (
    <Fragment>
      {isLoading ||
      (!conversationWithData.group && !conversationWithData.user) ? (
        <ActivityIndicator size='large' />
      ) : (
        <CometChatContextProvider theme={cometchatTheme}>
          <CometChatMessageList
            user={conversationWithData.user}
            group={conversationWithData.group}
          />
        </CometChatContextProvider>
      )}
    </Fragment>
  );
};

export default Conversation;
