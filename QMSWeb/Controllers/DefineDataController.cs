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
using System.Text;

namespace QMSWeb.Controllers
{
    public class DefineDataController : Controller
    {
        //
        // GET: /DefineData/
        Model.DefineData defineData = new Model.DefineData();

        public ActionResult DefineData()
        {
            defineData.getMenulist("", "", "DefineData", "MenuList", Request["UID"].ToString(), Request["PU"].ToString());
            ViewData.Model = defineData;
            ViewBag.UID = Request["UID"].ToString();
            ViewBag.PU = Request["PU"].ToString();
            return View();
        }

        public ActionResult getPartialMenu(string id,string PU)
        {
            string view = string.Empty;
            defineData.getXmlList(id, PU);
            ViewBag.MenuNameid = id;
            ViewData.Model = defineData;
            var lstview = defineData.xmlList.Select(t => t.DisplayView).ToList();
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

        public ActionResult getData_Json(string JsonString, string DBName, string Item, string Type, string PU)
        {
            string xmlstring = QMSWeb.CommonHelper.GenXML.genXMLString(JsonString);
            DataTable dt = defineData.QMS_DefineData(xmlstring, DBName, Item, Type, "", PU);
            if (dt.Rows.Count == 0)
            {
                DataRow dr = dt.NewRow();
                dr[0] = "NoData";
                dt.Rows.Add(dr);
            }
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            return QMSWeb.CommonHelper.LargeJson.largeJson(json);
        }

        public ActionResult getData(string JsonString, string DBName, string Item, string Type, string PU)
        {
            string xmlstring = QMSWeb.CommonHelper.GenXML.genXMLString(JsonString);
            DataTable dt = defineData.QMS_DefineData(xmlstring, DBName, Item, Type, "", PU);
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            return Content(json.ToString());
        }

        public ActionResult QMS_DefineData(string JsonString, string DBName, string Item, string Type, string PU)
        {
            string xmlstring = QMSWeb.CommonHelper.GenXML.genXMLString(JsonString);
            DataTable dt = defineData.QMS_DefineData(xmlstring, DBName, Item, Type, "", PU);
            if (dt.Rows.Count == 0)
            {
                return Content("Error,Call QMS!");
            }
            if (dt.Rows[0]["RESULT"].ToString() != "OK")
            {
                return Content(dt.Rows[0]["MSG"].ToString());
            }
            return Content(dt.Rows[0]["RESULT"].ToString());
        }

        public ActionResult getTreeJson(string DBName, string Item, string Type, string PU)
        {
            List<QMSWeb.Model.easyTree> treeList = new List<QMSWeb.Model.easyTree>();
            treeList = defineData.GetTreeParentList("", DBName, Item, Type, PU);
            string json = QMSWeb.CommonHelper.treeToJson.ToJson(treeList);
            return Content(json);
        }

        public ActionResult DownLoadFile(string JsonString, string DBName, string Item, string Type, string PU)
        {
            string xmlstring = QMSWeb.CommonHelper.GenXML.genXMLString(JsonString);
            DataTable dt = defineData.QMS_DefineData(xmlstring, DBName, Item, Type, "", PU);
            XSSFWorkbook Workbook = QMSWeb.CommonHelper.ExcelUtility.Workbook(dt);
            QMSWeb.CommonHelper.NpoiMemoryStream ms = new QMSWeb.CommonHelper.NpoiMemoryStream();
            ms.AllowClose = false;
            Workbook.Write(ms);
            ms.Flush();
            ms.Seek(0, SeekOrigin.Begin);
            string strdate = DateTime.Now.ToString("yyyyMMddhhmmss");
            return File(ms, "application/vnd.ms-excel", "Data" + strdate + ".xlsx");
        }

        public ActionResult UploadData(string Item, string DBName, string UID, string Type, string LimitQty, string PU)
        {
            string msg = "";
            HttpPostedFile file = System.Web.HttpContext.Current.Request.Files[0];
            string filename = System.IO.Path.GetFileName(file.FileName);
            string FileType = file.FileName.Split('.').Last().ToUpper();
            if (FileType != "XLSX" && FileType != "XLS")
            {
                msg = "Error:File format Error!";
                return Content(msg);
            }
            DataTable dt = QMSWeb.CommonHelper.ExcelUtility.FileStreamToDataTable(file.InputStream);
            int ExcelQty = dt.Rows.Count;
            if (ExcelQty > Convert.ToInt32(LimitQty))
            {
                msg = "Error:Upload Qty(" + ExcelQty.ToString() + ") exceed the Maximum allowed Qty(" + LimitQty + ")";
                return Content(msg);
            }
            DataTable dtresult = defineData.UploadData(dt, Item, DBName, Type, UID, PU);
            if (dtresult.Rows.Count == 0)
            {
                return Content("Error,Call QMS!");
            }
            if (dtresult.Rows[0]["RESULT"].ToString() != "OK")
            {
                return Content(dtresult.Rows[0]["MSG"].ToString());
            }
            msg = "OK,Upload sucessfully!";
            return Content(msg);
        }

        public ActionResult DownTemplateFile(string ObjectName, string DBName, string type, string PU)
        {
            DataTable dt = defineData.getTemplateData(ObjectName, DBName, type, PU);

            XSSFWorkbook Workbook = QMSWeb.CommonHelper.ExcelUtility.Workbook(dt);
            QMSWeb.CommonHelper.NpoiMemoryStream ms = new QMSWeb.CommonHelper.NpoiMemoryStream();
            ms.AllowClose = false;
            Workbook.Write(ms);
            ms.Flush();
            ms.Seek(0, SeekOrigin.Begin);
            return File(ms, "application/vnd.ms-excel", "Template.xlsx");
        }
    }
}
