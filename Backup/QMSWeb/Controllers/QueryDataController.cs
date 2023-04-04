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
    public class QueryDataController : Controller
    {
        //
        // GET: /QueryData/
        Model.QueryData queryData = new Model.QueryData();

        public ActionResult QueryData()
        {
            ViewBag.UID = Request["UID"].ToString();
            ViewBag.PU = Request["PU"].ToString();
            queryData.strPU = Request["PU"].ToString();
            return View();
        }

        public ActionResult getlistData(string type,string PU)
        {
            DataTable dt = queryData.getlistData(type, PU);
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            return Content(json.ToString());
        }

        public ActionResult getMenuList(string ObjectName, string type, string UID, string PU)
        {
            if (type == "StationData")
            {
                ViewBag.Station = ObjectName;
                return PartialView("_PartialView_" + type);
            }
            if (type == "SNTrace")
            {
                queryData.getMenulist(ObjectName, "MenuList", PU);
            }
            if (ObjectName == "ReleaseWO")
            {
                type = "ReleaseWO";
            }
            if (ObjectName == "Q_LostLabel")
            {
                type = "Q_LostLabel";
            }
            if (ObjectName == "FVSReport" || ObjectName == "QCReport")
            {
                type = "FVSReport";
            }
            if (ObjectName == "BaseData")
            {
                type = "BaseData";
            }
            if (ObjectName == "WIPQueryByWO")
            {
                type = "WIPQueryByWO";
            }
            if (ObjectName == "WIPQuery")
            {
                type = "WIPQuery";
            }
            queryData.getXmlList(ObjectName,PU);
            ViewData.Model = queryData;
            ViewBag.ObjectName = ObjectName.ToString();
            return PartialView("_PartialView_" + type);
        }

        public ActionResult iniSelectOptionValue(string id, string DataSource, string type, string DBName, string PU)
        {
            //DBName = DBName.Replace("QSMS","SMT");
            DataTable dt = new DataTable();
            if (type == "sql")
            {
                dt = queryData.iniSelectOptionValue(DataSource, DBName,PU);
            }
            else
            {
                string[] strarr = DataSource.Split(';');
                dt.Columns.Add(id, Type.GetType("System.String"));

                for (int i = 0; i < strarr.Length; i++)
                {
                    DataRow dr = dt.NewRow();
                    dr[id] = strarr[i].ToString();
                    dt.Rows.Add(dr);
                }
            }
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            return Content(json.ToString());
        }

        public ActionResult SelectOptionChg(string idValue, string DataSource, string DBName,string PU)
        {
            DataTable dt = queryData.SelectOptionChg(idValue, DataSource, DBName,PU);
            if (dt.Rows.Count == 0)
            {
                return Content("No Data");
            }
            var json = WEBSDK.Br.File.DataTableToJson(dt);
            return Content(json.ToString());
        }

        public ActionResult getQueryData(string ObjectSP, string DBName, string sqlPara,string PU)
        {
            DataTable dt = queryData.getQueryData(ObjectSP,DBName,sqlPara,PU);
            if (dt.Rows.Count == 0)
            {
                DataRow dr = dt.NewRow();
                dr[0] = "NoData";
                dt.Rows.Add(dr);
            }
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            return QMSWeb.CommonHelper.LargeJson.largeJson(json);
        }

        public ActionResult getSNinfo(string ObjectSP, string DBName, string sqlPara, string PU)
        {
            DataTable dt = queryData.getQueryData(ObjectSP, DBName, sqlPara, PU);
            if (dt.Rows.Count == 0)
            {
                DataRow dr = dt.NewRow();
                dr[0] = "NoData";
                dt.Rows.Add(dr);
            }
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            return Content(json.ToString());
        }

        public ActionResult getStationData(string ObjectName, string ObjectSP, string DBName, string sqlPara,string PU)
        {
            string[] arrayObjectSP = ObjectSP.Split(',');
            DataSet ds = queryData.getStationData(arrayObjectSP[0], DBName, sqlPara,PU);
            int cnt = ds.Tables.Count;
            string[] array = new string[cnt];
            for (int i = 0; i < ds.Tables.Count; i++)
            {
                DataTable dt = ds.Tables[i];
                if (dt.Rows.Count == 0)
                {
                    DataRow dr = dt.NewRow();
                    dr[0] = "NoData";
                    dt.Rows.Add(dr);
                }
                var json = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
                array[i] = json.ToString();
            }
            return Json(array);
        }

        public ActionResult DownLoadFile(string ObjectName, string ObjectSP, string DBName, string sqlPara,string PU)
        {
            if (sqlPara == "{}")
            {
                return Content("No Data");
            }
            string strdate = DateTime.Now.ToString("yyyyMMddhhmmss");
            string[] arrayObjectSP = ObjectSP.Split(',');
            //if (ObjectName == "RTMS_ICT" || ObjectName == "RTMS_FVS" || ObjectName == "RTMS_FCT")
            if(arrayObjectSP.Length > 2)
            {
                DataTable dt = queryData.getQueryData(arrayObjectSP[1], DBName, sqlPara, PU);
                DataTable dt2 = queryData.getQueryData(arrayObjectSP[2], DBName, sqlPara, PU);

                XSSFWorkbook Workbook = QMSWeb.CommonHelper.ExcelUtility.Workbook(dt, dt2);
                QMSWeb.CommonHelper.NpoiMemoryStream ms = new QMSWeb.CommonHelper.NpoiMemoryStream();
                ms.AllowClose = false;
                Workbook.Write(ms);
                ms.Flush();
                ms.Seek(0, SeekOrigin.Begin);
                return File(ms, "application/vnd.ms-excel", strdate + "Excel.xlsx");
            }
            else
            {
                DataSet ds = null;
                if (arrayObjectSP.Length > 1)
                {
                    //dt = queryData.getQueryData(arrayObjectSP[1], DBName, sqlPara,PU);
                    ds = queryData.getStationData(arrayObjectSP[1], DBName, sqlPara, PU);
                }
                else
                {
                    //dt = queryData.getQueryData(arrayObjectSP[0], DBName, sqlPara,PU);
                    ds = queryData.getStationData(arrayObjectSP[0], DBName, sqlPara, PU);
                }
                XSSFWorkbook Workbook = QMSWeb.CommonHelper.ExcelUtility.Mult_Workbook(ds);
                QMSWeb.CommonHelper.NpoiMemoryStream ms = new QMSWeb.CommonHelper.NpoiMemoryStream();
                ms.AllowClose = false;
                Workbook.Write(ms);
                ms.Flush();
                ms.Seek(0, SeekOrigin.Begin);
                return File(ms, "application/vnd.ms-excel", strdate + "Excel.xlsx");
            }
        }

        public ActionResult UploadData(string Item, string DBName, string UID, string LimitQty,string PU)
        {
            string msg = "";
            HttpPostedFile file = System.Web.HttpContext.Current.Request.Files[0];
            //string targetDir = System.Web.HttpContext.Current.Server.MapPath("~/TempData/QueryData");
            string filename = System.IO.Path.GetFileName(file.FileName);
            //filename = UID + filename;
            //string path = System.IO.Path.Combine(targetDir, filename);
            //if (!Directory.Exists(targetDir))
            //{
            //    Directory.CreateDirectory(targetDir);
            //}
            //if (System.IO.File.Exists(path))
            //{
            //    System.IO.File.Delete(path);
            //}
            //file.SaveAs(path);
            string FileType = file.FileName.Split('.').Last().ToUpper();
            if (FileType != "XLSX" && FileType != "XLS")
            {
                //System.IO.File.Delete(path);
                msg = "Error:FileType Error,not XLSX or XLS!";
                return Content(msg);
            }
            //DataTable dt = QMSWeb.CommonHelper.ExcelUtility.ExcelToDataTable(path, true);
            //System.IO.File.Delete(path);
            DataTable dt = QMSWeb.CommonHelper.ExcelUtility.FileStreamToDataTable(file.InputStream);
            int ExcelQty = dt.Rows.Count;
            if (ExcelQty > Convert.ToInt32(LimitQty))
            {
                msg = "Error:Upload Qty(" + ExcelQty.ToString() + ") exceed the Maximum allowed Qty(" + LimitQty + ")";
                return Content(msg);
            }
            if (queryData.UploadData(dt, Item, DBName, UID,PU, ref msg) == false)
            {
                return Content(msg);
            }
            msg = "OK,Upload completed,Qty:" + ExcelQty.ToString();
            return Content(msg);
        }

        public ActionResult DownTemplateFile(string ObjectName, string Type,string PU)
        {
            DataTable dt = queryData.getTemplateData(ObjectName,Type,PU);

            XSSFWorkbook Workbook = QMSWeb.CommonHelper.ExcelUtility.Workbook(dt);
            QMSWeb.CommonHelper.NpoiMemoryStream ms = new QMSWeb.CommonHelper.NpoiMemoryStream();
            ms.AllowClose = false;
            Workbook.Write(ms);
            ms.Flush();
            ms.Seek(0, SeekOrigin.Begin);
            return File(ms, "application/vnd.ms-excel", "Template.xlsx");
        }

        public ActionResult getTreeJson(string ObjectSP, string DBName, string sqlPara,string PU)
        {
            List<QMSWeb.Model.easyTree> treeList = new List<QMSWeb.Model.easyTree>();
            treeList = queryData.GetTreeParentList(ObjectSP,DBName,sqlPara,PU);
            string json = QMSWeb.CommonHelper.treeToJson.ToJson(treeList);
            return Content(json);
        }
    }
}
