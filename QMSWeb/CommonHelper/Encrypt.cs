using System;
using System.Collections.Generic;
//using System.Linq;
//using System.Web;
using System.Text;
using System.IO;
using System.Security.Cryptography;

namespace QMSWeb.CommonHelper
{
    public class Encrypt
    {
        /// <summary>
        /// DES加密
        /// </summary>
        /// <param name="input">待加密的字符串</param>
        /// <returns></returns>
        public static string DesEncrypt(string EncryptString)
        {
            byte[] inputByteArray = Encoding.UTF8.GetBytes(EncryptString);
            DESCryptoServiceProvider des = new DESCryptoServiceProvider();
            des.Key = new byte[] { 1, 2, 3, 4, 5, 6, 7, 8 };
            des.IV = new byte[] { 1, 2, 3, 4, 5, 6, 7, 8 };
            MemoryStream mStream = new MemoryStream();
            CryptoStream cStream = new CryptoStream(mStream, des.CreateEncryptor(), CryptoStreamMode.Write);
            cStream.Write(inputByteArray, 0, inputByteArray.Length);
            cStream.FlushFinalBlock();
            return Convert.ToBase64String(mStream.ToArray());
        }

        /// <summary>
        /// DES解密
        /// </summary>
        /// <param name="DecryptString">待解密的字符串</param>
        /// <returns>解密成功返回解密后的字符串,失败返源串</returns>
        public static string DesDecrypt(string DecryptString)
        {
            try
            {
                byte[] inputByteArray = Convert.FromBase64String(DecryptString);
                DESCryptoServiceProvider des = new DESCryptoServiceProvider();
                des.Key = new byte[] { 1, 2, 3, 4, 5, 6, 7, 8 };
                des.IV = new byte[] { 1, 2, 3, 4, 5, 6, 7, 8 };
                MemoryStream mStream = new MemoryStream();
                CryptoStream cStream = new CryptoStream(mStream, des.CreateDecryptor(), CryptoStreamMode.Write);
                cStream.Write(inputByteArray, 0, inputByteArray.Length);
                cStream.FlushFinalBlock();
                return Encoding.UTF8.GetString(mStream.ToArray());
            }
            catch
            {
                return "";
            }
        }
    }
}