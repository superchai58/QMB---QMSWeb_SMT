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
    public class SpecialItemController : Controller
    {
        //
        // GET: /SpecialItem/
        Model.SpecialItem specialItem = new Model.SpecialItem();

        public ActionResult SpecialItem()
        {
            specialItem.getMenulist("", "", "SpecialItem", "MenuList", Request["UID"].ToString(), Request["PU"].ToString());
            ViewBag.UID = Request["UID"].ToString();
            ViewBag.PU = Request["PU"].ToString();
            ViewData.Model = specialItem;
            return View();
        }

        public ActionResult getPartialMenu(string id,string PU)
        {
            string view = string.Empty;
            specialItem.getXmlList(id,PU);
            ViewData.Model = specialItem;
            var lstview = specialItem.xmlList.Select(t => t.DisplayView).ToList();
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

        public ActionResult transData(string ObjectSP, string DBName, string sqlPara, string PU)
        {
            DataTable dt = specialItem.execObjSP(ObjectSP, DBName, sqlPara, PU);
            if (dt.Rows.Count == 0)
            {
                return Content("Error,Call QMS!");
            }
            return Content(dt.Rows[0]["ERRDESC"].ToString());
        }

        public ActionResult UpdateSNStatus(string ObjectSP, string DBName, string sqlPara, string PU)
        {
            DataTable dt = specialItem.execObjSP(ObjectSP, DBName, sqlPara, PU);
            if (dt.Rows.Count == 0)
            {
                return Content("Error,Call QMS!");
            }
            return Content(dt.Rows[0]["RESULT"].ToString());
        }

        public ActionResult LockSN(string ObjectSP, string DBName, string sqlPara, string PU)
        {
            DataTable dt = specialItem.execObjSP(ObjectSP, DBName, sqlPara, PU);
            if (dt.Rows.Count == 0)
            {
                return Content("Error,Call QMS!");
            }
            return Content(dt.Rows[0]["msg"].ToString());
        }

        public ActionResult RecoverKey(string ObjectSP, string DBName, string sqlPara, string PU)
        {
            DataTable dt = specialItem.execObjSP(ObjectSP, DBName, sqlPara, PU);
            if (dt.Rows.Count == 0)
            {
                return Content("Error,Call QMS!");
            }
            return Content(dt.Rows[0]["Msg"].ToString());
        }

        public ActionResult ReAllocateKey(string ObjectSP, string DBName, string sqlPara, string PU)
        {
            DataTable dt = specialItem.execObjSP(ObjectSP, DBName, sqlPara, PU);
            if (dt.Rows.Count == 0)
            {
                return Content("Error,Call QMS!");
            }
            return Content(dt.Rows[0]["ErrDesc"].ToString());
        }

        public ActionResult getSPData(string JsonString, string DBName, string Item, string Type, string PU)
        {
            DataTable dt = specialItem.QMS_DefineData(JsonString, DBName, Item, Type, "", PU);
            if (dt.Rows.Count == 0)
            {
                DataRow dr = dt.NewRow();
                dr[0] = "NoData";
                dt.Rows.Add(dr);
            }
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            return QMSWeb.CommonHelper.LargeJson.largeJson(json);
        }

        public ActionResult DownLoadLockFailSN(string LockFailSNList)
        {
            string[] array = LockFailSNList.Split('$');
            DataTable dt= new DataTable();
            dt.Columns.Add("SN", Type.GetType("System.String"));
            dt.Columns.Add("Reason", Type.GetType("System.String"));
            for (int i = 0; i < array.Length; i++)
            {
                string strSNList = array[i].ToString();
                if (strSNList != "")
                {
                    int strStart = strSNList.IndexOf("[");
                    int strEnd = strSNList.IndexOf("]");
                    int strLenth = strSNList.Length;
                    string strSN = strSNList.Substring(strStart+1, strEnd - strStart-1);
                    string strReason = strSNList.Substring(strEnd + 1, strLenth - strEnd - 1);
                    if (strReason.ToUpper() != "OK")
                    {
                        DataRow dr = dt.NewRow();
                        dr["SN"] = strSN;
                        dr["Reason"] = strReason;
                        dt.Rows.Add(dr);
                    }
                }
            }
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
