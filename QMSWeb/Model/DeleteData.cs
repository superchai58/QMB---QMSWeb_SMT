using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;

namespace QMSWeb.Model
{
    public class DeleteData
    {
        operateDB.DeleteDataDB deleteData = new operateDB.DeleteDataDB();
        public List<Xmlparameter> xmlList { get; set; }
        public DataTable dtMenulist;
        public string limitQty { get; set; }


        public void getMenulist(string XMLString, string DBName, string ObjectName, string Type, string UID, string PU)
        {
            dtMenulist = deleteData.QMS_DefineData(XMLString, DBName, ObjectName, Type, UID, PU);
        }

        public void getXmlList(string ObjectName, string PU)
        {
            DataTable dt = deleteData.QMS_DefineData("", "", ObjectName, "getXmlList", "", PU);
            XmlList Xmllst = new XmlList();
            xmlList = Xmllst.getXmlList(dt);
            limitQty = dt.Rows[0]["LimitQty"].ToString();
        }

        public DataTable execObjSP(string ObjectSP, string DBName, string sqlPara, string PU)
        {
            return deleteData.execObjSP(ObjectSP, DBName, sqlPara, PU);
        }

        public DataTable QMS_DefineData(string XMLString, string DBName, string Item, string Type, string UID, string PU)
        {
            return deleteData.QMS_DefineData(XMLString, DBName, Item, Type, UID, PU);
        }
    }
}