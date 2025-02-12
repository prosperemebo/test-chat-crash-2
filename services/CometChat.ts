import config from '@/config'
import { getChatPermissions } from '@/utils/permissions'
// import { CometChatUIKit, UIKitSettings } from '@cometchat/chat-uikit-react-native'

export class CometChatService {
  static init = async () => {
    try {
      getChatPermissions()

      // const uikitSettings: UIKitSettings = {
      //   appId: config.COMETCHAT_APP_ID as string,
      //   authKey: config.COMETCHAT_AUTH_KEY as string,
      //   region: config.COMETCHAT_REGION as string,
      // }

      // const chatUser = await CometChatUIKit.login({ uid: '676d3e1037c17e702fd0a93d' })
      
      // await CometChatUIKit.init(uikitSettings)
      
      // return chatUser
      // return null
    } catch (err: any) {
      console.error('Initialization failed with exception:', err)

      return false
    }
  }
}
