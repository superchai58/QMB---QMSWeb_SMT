using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml;

namespace QMSWeb.CommonHelper
{
    public class GenXML
    {
        public static string genXMLString(string JsonString)
        {
            if (string.IsNullOrEmpty(JsonString))
            {
                return "";
            }
            System.Text.StringBuilder xmlResult = new System.Text.StringBuilder("<?xml version=\"1.0\"?>");
            var result = Newtonsoft.Json.JsonConvert.DeserializeObject<IDictionary<object, object>>(JsonString);
            xmlResult.Append("<XMLData>");
            foreach (var item in result)
            {
                xmlResult.AppendFormat("<" + item.Key.ToString() + ">" + item.Value.ToString() + "</" + item.Key.ToString() + ">");
            }
            xmlResult.Append("</XMLData>");
            return xmlResult.ToString();
        }
    }
}