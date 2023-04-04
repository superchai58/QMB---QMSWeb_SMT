using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Web.Mvc;

namespace QMSWeb.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/
        Model.HomeIndex homeIndex = new Model.HomeIndex();
        public ActionResult Index()
        {
            HttpCookie cookie = Request.Cookies.Get("Chkremember");
            if (cookie != null)
            {
                ViewBag.username = cookie.Values["UserName"].ToString();
                ViewBag.password = cookie.Values["password"].ToString();
                ViewBag.remember = cookie.Values["remember"].ToString();
            }
            else
            {
                ViewBag.username = "";
                ViewBag.password = "";
                ViewBag.remember = "";
            }
            return View();
        }

        public ActionResult MainMenuUI()
        {

            //QMSWeb.operateDB.LoadSettings LoadSetting = new operateDB.LoadSettings();
            //QMSWeb.Model.ProSettings.Settings = LoadSetting.LoadSetting("ALL", "QMSWeb", Request["PU"].ToString());
            ViewBag.UID = Request["UID"].ToString();
            ViewBag.PU = Request["PU"].ToString();
            return View();
        }

        public ActionResult GetBU(string type)
        {
            DataTable dt = new DataTable();
            string str = System.Configuration.ConfigurationManager.ConnectionStrings["BU"].ConnectionString;
            string [] strarr =str.Split(';');
            dt.Columns.Add("BU",Type.GetType("System.String"));
           
            for (int i = 0; i < strarr.Length; i++)
            {
                DataRow dr = dt.NewRow();
                dr["BU"] =strarr[i];
                dt.Rows.Add(dr);
            }
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            return Content(json.ToString());
        }

        public ActionResult Login(string UID, string PassWord, string UserRight,string remember,string PU)
        {
            string msg = string.Empty;
            string ConnInfo = string.Empty;
            string strConnSMT = string.Empty;
            homeIndex.strPU = PU;
            //CommonHelper.SqlHelper.strConnSMT = System.Configuration.ConfigurationManager.ConnectionStrings["Portal_" + PU].ConnectionString;
            //strConnSMT = System.Configuration.ConfigurationManager.ConnectionStrings["Portal_" + PU].ConnectionString;
            //Session["ConnSMT"] = strConnSMT;
            //ConnInfo = homeIndex.GetSMTSecondServer(strConnSMT);
            ////CommonHelper.SqlHelper.strConnSMTSecond = strConnSMT;
            //if (string.IsNullOrEmpty(ConnInfo))
            //{
            //    return Content("Can't get SMT Second Server information ! Call QMS please!");
            //}
            //Session["ConnSMTSecond"] = ConnInfo;
            //ConnInfo = homeIndex.GetQSMSServer(strConnSMT);
            //if (string.IsNullOrEmpty(ConnInfo))
            //{
            //    return Content("Can't get SMT QSMS Server information ! Call QMS please!");
            //}
            //Session["ConnQSMS"] = ConnInfo;
            if (homeIndex.ChkLogin(UID, PassWord, UserRight, "QMSWeb",PU, ref msg) == false)
            {
                return Content(msg);
            }
            if (remember == "Y")
            {
                HttpCookie cookie = Request.Cookies.Get("Chkremember");
                if (cookie == null)
                {
                    HttpCookie cookies = new HttpCookie("Chkremember");
                    cookies["username"] = UID;
                    cookies["password"] = PassWord;
                    cookies["remember"] = remember;
                    cookies.Expires = DateTime.Now.AddDays(30);
                    //cookies.Expires = DateTime.Now.Add(new TimeSpan(0, 0, 10));   
                    Response.Cookies.Add(cookies);
                }
            }
            else
            {
                HttpCookie cookie = new HttpCookie("Chkremember");
                if (cookie != null)
                {
                    cookie.Expires = DateTime.Now.AddDays(-1);
                    Response.Cookies.Add(cookie);
                }
            }
           
            return Content("PASS");
        }

        //public ActionResult Registration(string UID, string PassWord, string UserRight,string PU)
        //{
        //    string msg = string.Empty;
        //    CommonHelper.SqlHelper.strConnSMT = System.Configuration.ConfigurationManager.ConnectionStrings["Portal_" + PU].ConnectionString;
        //    msg = homeIndex.GetSMTSecondServer(CommonHelper.SqlHelper.strConnSMT);
        //    if (!string.IsNullOrEmpty(msg))
        //    {
        //        return Content(msg);
        //    }
        //    msg = homeIndex.GetQSMSServer(CommonHelper.SqlHelper.strConnSMT);
        //    if (!string.IsNullOrEmpty(msg))
        //    {
        //        return Content(msg);
        //    }
        //    if (homeIndex.Register(UID, PassWord, UserRight, "QMSWeb", ref msg) == false)
        //    {
        //        return Content(msg);
        //    }
        //    return Content("PASS");
        //}

        //public ActionResult getUserDetail()
        //{
        //    DataTable dt = homeIndex.getUserDetail();
        //    var json = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
        //    return Content(json.ToString());
        //}
    }
}
