using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Xml;
using System.IO;

namespace QMSWeb.Model
{
    public class UploadFile
    {
        operateDB.UploadFileDB uploadfile = new operateDB.UploadFileDB();
        public List<Xmlparameter> xmlList { get; set; }

        public List<easyTree> GetTreeParentList(string DBName, string ObjectName, string Type, string PU,string UID)
        {
            List<easyTree> treeNodeList = new List<easyTree>();
            DataTable dt = uploadfile.QMS_UploadFile("",DBName, ObjectName, Type, PU,UID);
            if (dt.Rows.Count > 0)
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    treeNodeList.Add(new easyTree(dt.Rows[i][0].ToString(), dt.Rows[i][1].ToString(), "icon-user", "open", null, dt.Rows[i][2].ToString()));
                }
            }
            return treeNodeList;
        }

        public void getXmlList(string ObjectName,string PU)
        {
            DataTable dt = uploadfile.QMS_UploadFile("","", ObjectName, "getXmlList", PU,"");
            XmlList Xmllst = new XmlList();
            xmlList = Xmllst.getXmlList(dt);
        }

        public DataTable QMS_UploadFile(string XMLString, string DBName, string ObjectName, string type, string PU)
        {
            return uploadfile.QMS_UploadFile(XMLString, DBName, ObjectName, type, PU,"");
        }

        public DataTable FileUpload_Insert(string FileName, Stream FileData, string ObjPath, string PU, string FunctionType, string UID, string DBName)
        {
            return uploadfile.FileUpload_Insert(FileName, FileData, ObjPath, PU, FunctionType, UID, DBName);
        }

    }
}