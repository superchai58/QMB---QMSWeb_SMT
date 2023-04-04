using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;

namespace QMSWeb.Model
{
    public class UploadData
    {
        operateDB.UploadDataDB uploadData = new operateDB.UploadDataDB();
        public List<Xmlparameter> xmlList { get; set; }
        public DataTable dtMenulist;
        public string limitQty { get; set; }

        public void getXmlList(string ObjectName,string PU)
        {
            DataTable dt = uploadData.QMS_UploadData("", ObjectName, "getXmlList", PU,"");
            XmlList Xmllst = new XmlList();
            xmlList = Xmllst.getXmlList(dt);
            limitQty = dt.Rows[0]["LimitQty"].ToString();
        }

        public DataTable getData(string DBName, string ObjectName, string PU,string type)
        {
            if (type == "UploadDataTemplate")
            {
                return uploadData.QMS_UploadData(DBName, ObjectName, type, PU,"");
            }
            return uploadData.getData(DBName, ObjectName, PU);
        }

        public DataTable getListData(string DBName, string ObjectName, string PU, string type, string UID)
        {
            return uploadData.QMS_UploadData(DBName, ObjectName, type, PU,UID);
        }

        public bool QMS_DefineData(DataTable dt, string DBName, string ObjectName, string type, string PU, string UID, ref string msg)
        {
            string message = "";
            if(uploadData.QMS_UploadData(dt, DBName, ObjectName, type, PU,UID,ref message)==false)
            {
                msg=message;
                return false;
            }
            return true;
        }

    }
}