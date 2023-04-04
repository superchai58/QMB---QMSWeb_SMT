using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Collections;

namespace QMSWeb.Model
{
    public class Settings
    {
        private  Hashtable configList = new Hashtable();

        public  Hashtable ConfigList
        {
            get { return configList; }
        }

        public  void Set(string item, string value)
        {
            configList.Add(item, value);
        }
        //public static void Update(string item, string value)
        //{
        //    if (configList.ContainsKey(item) == true)
        //    {
        //        configList[item] = value;
        //    }
        //    else
        //    {
        //        Set(item, value);
        //    }
        //}
        public  string GetValue(string item)
        {
            if (configList.ContainsKey(item) == false)
                return "";

            return configList[item].ToString();
        }
    }
}