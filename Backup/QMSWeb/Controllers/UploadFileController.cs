using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.IO;
using System.Net;
using System.Diagnostics;
using Encrypt;

namespace QMSWeb.Controllers
{
    public class UploadFileController : Controller
    {
        //
        // GET: /UploadFile/
        Model.UploadFile uploadfile = new Model.UploadFile();

        public ActionResult UploadFile()
        {
            ViewBag.UID = Request["UID"].ToString();
            ViewBag.PU = Request["PU"].ToString();
            return View();
        }

        public ActionResult getTreeJson(string PU,string uid)
        {
            List<QMSWeb.Model.easyTree> treeList = new List<QMSWeb.Model.easyTree>();
            treeList = uploadfile.GetTreeParentList("", "UploadFile", "UploadFileNodeList", PU,uid);
            string json = QMSWeb.CommonHelper.treeToJson.ToJson(treeList);
            return Content(json);
        }

        public ActionResult getMenuList(string ObjectName,string PU)
        {
            uploadfile.getXmlList(ObjectName,PU);
            ViewData.Model = uploadfile;
            ViewBag.ObjectName = ObjectName.ToString();
            return PartialView("_PartialView_UploadFile");
        }

        public ActionResult getFileList(string XMLString, string DBName, string ObjectName, string Type, string PU)
        {
            string xmlstring = QMSWeb.CommonHelper.GenXML.genXMLString(XMLString);
            DataTable dt = uploadfile.QMS_UploadFile(xmlstring, DBName, ObjectName, Type, PU);
            if (dt.Rows.Count == 0)
            {
                DataRow dr = dt.NewRow();
                dr[0] = "NoData";
                dt.Rows.Add(dr);
            }
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            return QMSWeb.CommonHelper.LargeJson.largeJson(json);
        }

        public ActionResult delFile(string XMLString, string DBName, string ObjectName, string Type, string PU)
        {
            string xmlstring = QMSWeb.CommonHelper.GenXML.genXMLString(XMLString);
            DataTable dt = uploadfile.QMS_UploadFile(xmlstring,DBName,ObjectName,Type,PU);
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

        public ActionResult UploadFile_Insert(string filePath, string fileFormat, string PU, string UID, string DBName)
        {
            HttpPostedFile file = System.Web.HttpContext.Current.Request.Files[0];
            string filename = System.IO.Path.GetFileName(file.FileName);
            string FileType = file.FileName.Split('.').Last().ToUpper();
            fileFormat = fileFormat.Substring(fileFormat.IndexOf('.') + 1, fileFormat.Length - fileFormat.IndexOf('.') - 1);
            if (FileType.ToUpper() != fileFormat.ToUpper())
            {
                return Content("FileFormat Error,Please Upload " + fileFormat + " file!");
            }
            DataTable dt = uploadfile.FileUpload_Insert(filename, file.InputStream, filePath, PU, "", UID, DBName);
            if (dt.Rows[0]["Result"].ToString() == "0")
            {
                return Content("OK");
            }
            else
            {
                return Content(dt.Rows[0]["Description"].ToString());
            }
        }

        public ActionResult DownLoadFile(string filePath, string fileName)
        {
            string filePathName = filePath + fileName;
            Process process = new Process();
            filePath = filePath.Substring(0, filePath.Length - 1);
            try
            {
                process.StartInfo.FileName = "cmd.exe";
                process.StartInfo.CreateNoWindow = true;
                process.StartInfo.UseShellExecute = false;
                process.StartInfo.RedirectStandardError = true;
                process.StartInfo.RedirectStandardInput = true;
                process.StartInfo.RedirectStandardOutput = true;
                process.Start();
                string UserName = System.Configuration.ConfigurationManager.ConnectionStrings["UserName"].ConnectionString;
                string PassWord = System.Configuration.ConfigurationManager.ConnectionStrings["PassWord"].ConnectionString;
                PassWord = EncryptStr.DecryptDES(PassWord, "1234ABCD");
                UserName = EncryptStr.DecryptDES(UserName, "1234ABCD");
                string cmd = @"net use " + filePath + "  " + PassWord + " /user:" + UserName;
                process.StandardInput.WriteLine(cmd);

                FileStream fs = new FileStream(filePathName, FileMode.Open, FileAccess.Read);

                byte[] bytes = new byte[(int)fs.Length];
                fs.Read(bytes, 0, bytes.Length);
                fs.Close();
                Response.ContentType = "application/octet-stream";
                Response.AddHeader("Content-Disposition", "attachment;filename=" + HttpUtility.UrlEncode(fileName, System.Text.Encoding.UTF8));
                Response.BinaryWrite(bytes);
                Response.Flush();
                Response.End();
                return File(fs, "application/vnd.ms-excel", fileName);
            }
            catch (WebException e)
            {
                Response.Write(e.Message.ToString());
                return null;
            }
        }

        //public ActionResult DownLoadFileData(string XMLString, string DBName, string ObjectName, string Type, string PU)
        //{
        //    string filePathName;
        //    string xmlstring = QMSWeb.CommonHelper.GenXML.genXMLString(XMLString);
        //    DataTable dt = uploadfile.QMS_UploadFile(xmlstring, DBName, ObjectName, Type, PU);
        //    if (dt.Rows[0]["RESULT"].ToString() == "OK")
        //    {
        //        filePathName = dt.Rows[0]["MSG"].ToString();
        //    }
        //    else
        //    {
        //        return Content(dt.Rows[0]["MSG"].ToString());
        //    }
        //    string fileName = filePathName.Substring(filePathName.LastIndexOf("\\") + 1);

        //    //string targetDir = System.Web.HttpContext.Current.Server.MapPath("~/TempData/");
        //   // filePathName = targetDir + fileName;

        //    FileStream fs = new FileStream(filePathName,FileMode.Open,FileAccess.Read);
            
        //    byte[] bytes = new byte[(int)fs.Length];
        //    fs.Read(bytes, 0, bytes.Length);
        //    fs.Close();
        //    if (System.IO.File.Exists(filePathName))
        //    {
        //        System.IO.File.Delete(filePathName);
        //    }
        //    Response.ContentType = "application/octet-stream";
        //    Response.AddHeader("Content-Disposition", "attachment;filename=" + HttpUtility.UrlEncode(fileName, System.Text.Encoding.UTF8));
        //    Response.BinaryWrite(bytes);
        //    Response.Flush();
        //    Response.End();
        //    return File(fs, "application/vnd.ms-excel", fileName);
        //}

  
        //public ActionResult DLFile(string filePath, string fileName)
        //{
        //    Uri serverUri = new Uri(filePath + fileName);
        //    WebClient request = new WebClient();
        //    request.Credentials = new NetworkCredential("username", "pw");

        //    try
        //    {
        //        byte[] newFileData = request.DownloadData(serverUri.ToString());
        //        string fileString = System.Text.Encoding.UTF8.GetString(newFileData);
        //        Response.AddHeader("Content-Disposition", string.Format("attachment;filename={0}", fileName));
        //        string fileType = fileName.Substring(fileName.IndexOf('.') + 1, fileName.Length - fileName.IndexOf('.') - 1);
        //        string contenttype = "application/";
        //        if (fileType == "txt")
        //        {
        //            contenttype = "text/plain";
        //        }
        //        return File(newFileData, contenttype);
        //    }
        //    catch (WebException e)
        //    {
        //        Response.Write(e.Message.ToString());
        //        return null;
        //    }
        //}

    }
}
