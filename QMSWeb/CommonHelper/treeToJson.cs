using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
namespace QMSWeb.CommonHelper
{
    public class treeToJson
    {
         public static string ToJson(object obj)
        {
            string jsonData = (new JavaScriptSerializer()).Serialize(obj);
            return jsonData;
        }
    }
}