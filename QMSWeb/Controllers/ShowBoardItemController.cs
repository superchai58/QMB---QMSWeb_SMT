using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;

namespace QMSWeb.Controllers
{
    public class ShowBoardItemController : Controller
    {
        //
        // GET: /ShowBoardItem/
        Model.ShowBoardItem showBoardItem = new Model.ShowBoardItem();

        public ActionResult ShowBoardItem()
        {
            ViewBag.UID = Request["UID"].ToString();
            ViewBag.PU = Request["PU"].ToString();
            return View();
        }

        public ActionResult getUrlList(string ObjectName, string Type, string PU)
        {
            DataTable dt = showBoardItem.getUrlList(ObjectName, Type, PU);
            if (dt.Rows.Count == 0)
            {
                DataRow dr = dt.NewRow();
                dr[0] = "NoData";
                dt.Rows.Add(dr);
            }
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            return QMSWeb.CommonHelper.LargeJson.largeJson(json);
        }


    }
}
