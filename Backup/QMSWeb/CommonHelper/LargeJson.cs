using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QMSWeb.CommonHelper
{
    public class LargeJson
    {
        public static JsonResult largeJson(object data)
        {
            return new System.Web.Mvc.JsonResult()
            {
                Data = data,
                MaxJsonLength = 2147483644,
            };
        }
    }
}