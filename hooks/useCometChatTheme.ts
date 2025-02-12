import { CometChatTheme } from '@cometchat/chat-uikit-react-native'

export const useCometChatTheme = () => {
  const theme: CometChatTheme = new CometChatTheme({})

  theme.palette.setMode('dark')

  theme.typography.setSubtitle1({
    fontSize: 12,
  })

  return theme
}
