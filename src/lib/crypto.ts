// Browser fingerprinting for consistent key generation
const generateBrowserFingerprint = (): string => {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  ctx?.fillText("fingerprint", 2, 2)

  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + "x" + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL(),
    navigator.hardwareConcurrency || 0,
  ].join("|")

  return fingerprint
}

// Generate a consistent key from browser fingerprint
export const generateKey = async (): Promise<CryptoKey> => {
  const fingerprint = generateBrowserFingerprint()
  const encoder = new TextEncoder()
  const data = encoder.encode(fingerprint)

  // Create a hash of the fingerprint
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)

  // Import the hash as a key
  return crypto.subtle.importKey("raw", hashBuffer, { name: "AES-GCM" }, false, ["encrypt", "decrypt"])
}

// AES-GCM Encryption
export const encryptAES = async (data: string): Promise<string> => {
  try {
    const key = await generateKey()
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)

    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(12))

    // Encrypt the data
    const encryptedBuffer = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, dataBuffer)

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength)
    combined.set(iv)
    combined.set(new Uint8Array(encryptedBuffer), iv.length)

    // Convert to base64
    return btoa(String.fromCharCode(...combined))
  } catch (error) {
    console.error("Encryption failed:", error)
    throw new Error("Failed to encrypt data")
  }
}

// AES-GCM Decryption
export const decryptAES = async (encryptedData: string): Promise<string> => {
  try {
    const key = await generateKey()

    // Convert from base64
    const combined = new Uint8Array(
      atob(encryptedData)
        .split("")
        .map((char) => char.charCodeAt(0)),
    )

    // Extract IV and encrypted data
    const iv = combined.slice(0, 12)
    const encrypted = combined.slice(12)

    // Decrypt the data
    const decryptedBuffer = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encrypted)

    // Convert back to string
    const decoder = new TextDecoder()
    return decoder.decode(decryptedBuffer)
  } catch (error) {
    console.error("Decryption failed:", error)
    throw new Error("Failed to decrypt data")
  }
}


export const encodeXOR = (data: string, key = "paragone-key"): string => {
  try {
    let encoded = ""
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      encoded += String.fromCharCode(charCode)
    }
    return btoa(encoded)
  } catch (error) {
    console.error("XOR encoding failed:", error)
    throw new Error("Failed to encode data")
  }
}

// Simple XOR decoding
export const decodeXOR = (encodedData: string, key = "paragone-key"): string => {
  try {
    const decoded = atob(encodedData)
    let result = ""
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      result += String.fromCharCode(charCode)
    }
    return result
  } catch (error) {
    console.error("XOR decoding failed:", error)
    throw new Error("Failed to decode data")
  }
}


export const isWebCryptoSupported = (): boolean => {
  return (
    typeof crypto !== "undefined" &&
    typeof crypto.subtle !== "undefined" &&
    typeof crypto.getRandomValues !== "undefined"
  )
}

// Safe encryption wrapper that falls back to XOR if AES fails
export const safeEncrypt = async (data: string): Promise<string> => {
  if (isWebCryptoSupported()) {
    try {
      return await encryptAES(data)
    } catch (error) {
      console.warn("AES encryption failed, falling back to XOR:", error)
      return encodeXOR(data)
    }
  }
  return encodeXOR(data)
}


export const safeDecrypt = async (encryptedData: string): Promise<string> => {
  // Try AES decryption first
  if (isWebCryptoSupported()) {
    try {
      return await decryptAES(encryptedData)
    } catch (error) {
      console.warn("AES decryption failed, trying XOR:", error)
    }
  }

  // Fallback to XOR decoding
  try {
    return decodeXOR(encryptedData)
  } catch (error) {
    console.error("All decryption methods failed:", error)
    throw new Error("Failed to decrypt data")
  }
}

// Simple Base64 encoding with basic obfuscation
const ENCODING_KEY = "paragone2024"

export const encodeToken = (token: string): string => {
  try {
    // Simple XOR with key + Base64 encoding
    let encoded = ""
    for (let i = 0; i < token.length; i++) {
      const charCode = token.charCodeAt(i) ^ ENCODING_KEY.charCodeAt(i % ENCODING_KEY.length)
      encoded += String.fromCharCode(charCode)
    }
    return btoa(encoded)
  } catch (error) {
    console.error("Token encoding failed:", error)
    return token // Return original if encoding fails
  }
}

export const decodeToken = (encodedToken: string): string => {
  try {
    // Decode Base64 + XOR with key
    const decoded = atob(encodedToken)
    let result = ""
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ ENCODING_KEY.charCodeAt(i % ENCODING_KEY.length)
      result += String.fromCharCode(charCode)
    }
    return result
  } catch (error) {
    console.error("Token decoding failed:", error)
    return encodedToken 
  }
}

// Simple data encoding for user data
export const encodeData = (data: string): string => {
  return btoa(data) 
}

export const decodeData = (encodedData: string): string => {
  try {
    return atob(encodedData)
  } catch (error) {
    console.error("Data decoding failed:", error)
    return encodedData
  }
}
