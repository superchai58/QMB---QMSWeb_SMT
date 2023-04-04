using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.IO;
using NPOI;
using NPOI.SS.UserModel;
using NPOI.HSSF.UserModel;
using NPOI.XSSF.UserModel;

namespace QMSWeb.Controllers
{
    public class DeleteDataController : Controller
    {
        //
        // GET: /DeleteData/
        Model.DeleteData deleteData = new Model.DeleteData();

        public ActionResult DeleteData()
        {
            deleteData.getMenulist("", "", "DeleteData", "MenuList", Request["UID"].ToString(), Request["PU"].ToString());
            ViewBag.UID = Request["UID"].ToString();
            ViewBag.PU = Request["PU"].ToString();
            ViewData.Model = deleteData;
            return View();
        }

        public ActionResult getPartialMenu(string id, string PU)
        {
            string view = string.Empty;
            deleteData.getXmlList(id, PU);
            ViewData.Model = deleteData;
            var lstview = deleteData.xmlList.Select(t => t.DisplayView).ToList();
            foreach (var lst in lstview)
            {
                view = lst.ToString();
                if (view.ToUpper() == "PUBLIC")
                {
                    break;
                }
            }
            if (view.ToUpper() == "PUBLIC")
            {
                return PartialView("_PartialView_Public");
            }
            return PartialView("_PartialView_" + id);
        }

        public ActionResult getLaserData(string JsonString, string DBName, string Item,string type, string PU)
        {
            string xmlstring = QMSWeb.CommonHelper.GenXML.genXMLString(JsonString);
            DataTable dt = deleteData.QMS_DefineData(xmlstring, DBName, Item, type, "", PU);
            if (dt.Rows.Count == 0)
            {
                DataRow dr = dt.NewRow();
                dr[0] = "NoData";
                dt.Rows.Add(dr);
            }
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            return QMSWeb.CommonHelper.LargeJson.largeJson(json);
        }

        public ActionResult getDeleteData(string ObjectSP, string DBName, string sqlPara, string PU)
        {
            DataTable dt = deleteData.execObjSP(ObjectSP, DBName, sqlPara, PU);
            if (dt.Rows.Count == 0)
            {
                DataRow dr = dt.NewRow();
                dr[0] = "NoData";
                dt.Rows.Add(dr);
            }
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            return QMSWeb.CommonHelper.LargeJson.largeJson(json);
        }

        public ActionResult DeleteData_SP(string ObjectSP, string DBName, string sqlPara, string PU)
        {
            DataTable dt = deleteData.execObjSP(ObjectSP, DBName, sqlPara, PU);
            if (dt.Rows.Count == 0)
            {
                return Content("Error,Call QMS!");
            }
            if (dt.Rows[0]["Result"].ToString() != "OK")
            {
                return Content(dt.Rows[0]["ErrMsg"].ToString());
            }
            return Content(dt.Rows[0]["Result"].ToString());
        }

        public ActionResult DownLoadFile(string JsonString, string DBName, string Item, string Type, string PU)
        {
            string xmlstring = QMSWeb.CommonHelper.GenXML.genXMLString(JsonString);
            DataTable dt = deleteData.QMS_DefineData(xmlstring, DBName, Item, Type, "", PU);
            XSSFWorkbook Workbook = QMSWeb.CommonHelper.ExcelUtility.Workbook(dt);
            QMSWeb.CommonHelper.NpoiMemoryStream ms = new QMSWeb.CommonHelper.NpoiMemoryStream();
            ms.AllowClose = false;
            Workbook.Write(ms);
            ms.Flush();
            ms.Seek(0, SeekOrigin.Begin);
            string strdate = DateTime.Now.ToString("yyyyMMddhhmmss");
            return File(ms, "application/vnd.ms-excel", "Data" + strdate + ".xlsx");
        }

    }
}
