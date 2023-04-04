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
using System.Web.Script.Serialization;

namespace QMSWeb.Controllers
{
    public class UploadDataController : Controller
    {
        //
        // GET: /UploadData/
        Model.UploadData uploadData = new Model.UploadData();

        public ActionResult UploadData()
        {
            ViewBag.UID = Request["UID"].ToString();
            ViewBag.PU = Request["PU"].ToString();
            return View();
        }

        public ActionResult getPartialMenu(string ObjectName,string PU)
        {
            uploadData.getXmlList(ObjectName, PU);
            ViewData.Model = uploadData;
            return PartialView("_PartialView_UploadData");
        }

        protected string ToJson(object obj)
        {
            string jsonData = (new JavaScriptSerializer()).Serialize(obj);
            return jsonData;
        }

        public ActionResult getData(string DBName, string ObjectName,string PU)
        {
            DataTable dt = uploadData.getData(DBName, ObjectName, PU,"");
            if (dt.Rows.Count == 0)
            {
                DataRow dr = dt.NewRow();
                dr[0] = "NoData";
                dt.Rows.Add(dr);
            }
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            return QMSWeb.CommonHelper.LargeJson.largeJson(json);
        }

        public ActionResult QMS_UploadData(string JsonString, string DBName,string ObjectName,string type,string LimitQty,string PU,string UID)
        {
            string msg="";
            DataTable dt = null;
            if (type == "Upload")
            {
                HttpPostedFile file = System.Web.HttpContext.Current.Request.Files[0];
                string filename = System.IO.Path.GetFileName(file.FileName);
                string FileType = file.FileName.Split('.').Last().ToUpper();
                if (FileType != "XLSX" && FileType != "XLS")
                {
                    msg = "Error:File format Error!";
                    return Content(msg);
                }
                dt = QMSWeb.CommonHelper.ExcelUtility.FileStreamToDataTable(file.InputStream);
                if (dt.Rows.Count == 0)
                {
                    msg = "No Data of attachment!";
                    return Content(msg);
                }
                int ExcelQty = dt.Rows.Count;
                if (ExcelQty > Convert.ToInt32(LimitQty))
                {
                    msg = "Error:Upload Qty(" + ExcelQty.ToString() + ") exceed the Maximum allowed Qty(" + LimitQty + ")";
                    return Content(msg);
                }
            }
            else
            {
                dt = QMSWeb.CommonHelper.jsonToDataTable.genDataTable(JsonString);
            }
            if(uploadData.QMS_DefineData(dt, DBName, ObjectName, type, PU, UID,ref msg)==false)
            {
                return Content(msg);
            }
            msg = "OK";
            if (type == "Upload")
            {
                msg = "OK,Upload sucessfully!";
            }
            return Content(msg);
        }

        public ActionResult getListData(string DBName, string ObjectName, string PU, string UID)
        {
            DataTable dt = uploadData.getListData(DBName, ObjectName, PU, "MenuList",UID);
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            return Content(json.ToString());
        }

        public ActionResult DownLoadFile(string DBName, string ObjectName, string PU)
        {
            DataTable dt = uploadData.getData(DBName, ObjectName, PU,"");
            XSSFWorkbook Workbook = QMSWeb.CommonHelper.ExcelUtility.Workbook(dt);
            QMSWeb.CommonHelper.NpoiMemoryStream ms = new QMSWeb.CommonHelper.NpoiMemoryStream();
            ms.AllowClose = false;
            Workbook.Write(ms);
            ms.Flush();
            ms.Seek(0, SeekOrigin.Begin);
            string strdate = DateTime.Now.ToString("yyyyMMddhhmmss");
            return File(ms, "application/vnd.ms-excel", "Data" + strdate + ".xlsx");
        }

        public ActionResult DownTemplateFile(string DBName,string ObjectName,string PU)
        {
            DataTable dt = uploadData.getData(DBName, ObjectName, PU, "UploadDataTemplate");

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
