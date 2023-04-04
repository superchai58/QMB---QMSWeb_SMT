using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.IO;
namespace QMSWeb.CommonHelper
{
    public class DataTabletoXml
    {
        public static string genXml(DataTable dt)
        {
            if (null == dt)
            {
                return string.Empty;
            }
            if (string.IsNullOrEmpty(dt.TableName))
            {
                dt.TableName = "tbcolumn";
            }
            StringWriter writer = new StringWriter();
            dt.WriteXml(writer);
            string xmlstr = writer.ToString();
            writer.Close();
            return xmlstr;
        } 
    }
}