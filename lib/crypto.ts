import crypto from 'crypto-js';

export const decryptData = async (encryptedData: string, ivHex: string) => {
  try {
    // convert hex iv to WordArray
    const iv = crypto.enc.Hex.parse(ivHex);

    // ensure key length is correct
    const keyString =
      process.env.NEXT_PUBLIC_ENCRYPTION_KEY || '5F4DCC3B5AA765D61D8327DEB882CF99B32E89CFD2B8E9573647FE11C8940895';
    // if key is hex format, parse to WordArray
    const key = crypto.enc.Hex.parse(keyString);

    // convert base64 encrypted data to crypto-js format
    const ciphertext = crypto.enc.Base64.parse(encryptedData);

    // create cipher params
    const cipherParams = crypto.lib.CipherParams.create({
      ciphertext: ciphertext,
    });

    // decrypt with AES
    const decrypted = crypto.AES.decrypt(cipherParams, key, {
      iv: iv,
      mode: crypto.mode.CBC,
      padding: crypto.pad.Pkcs7,
    });

    // convert to text
    const decryptedText = decrypted.toString(crypto.enc.Utf8);
    if (!decryptedText) {
      console.error('Decrypted data is empty');
      throw new Error('Decrypted data is empty');
    }

    try {
      return JSON.parse(decryptedText);
    } catch (jsonError) {
      console.error('JSON parse error:', jsonError);
      throw new Error('JSON parse failed: ' + decryptedText.substring(0, 50) + '...');
    }
  } catch (error) {
    console.error('Decrypt data failed:', error);
    // for debugging, return more detailed error information
    throw new Error(`Decrypt failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
