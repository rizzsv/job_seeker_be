import CryptoJS from 'crypto-js'
import { autoEnv } from '../utils/autoEnv.utils'

export class Crypto {
  static encode(data: string): string {
    return CryptoJS.AES.encrypt(data, autoEnv.CRYPTO_KEY!).toString()
  }

  static decode(data: string): string {
    return CryptoJS.AES.decrypt(data, autoEnv.CRYPTO_KEY!).toString(CryptoJS.enc.Utf8)
  }

  static compare(data: string, encryptedData: string): boolean {
    const decryptedData = CryptoJS.AES.decrypt(encryptedData, autoEnv.CRYPTO_KEY!).toString(CryptoJS.enc.Utf8)
    return data === decryptedData
  }
}
