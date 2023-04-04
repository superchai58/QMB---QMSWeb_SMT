using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;

namespace QMSWeb.Model
{
    public class SpecialItem
    {
        operateDB.SpecialItem specialItem = new operateDB.SpecialItem();
        public DataTable dtMenulist;
        public List<Xmlparameter> xmlList { get; set; }
        public string limitQty { get; set; }
        public void getMenulist(string XMLString, string DBName, string ObjectName, string Type, string UID, string PU)
        {
            dtMenulist = specialItem.QMS_DefineData(XMLString, DBName, ObjectName,Type, UID, PU);
        }

        public void getXmlList(string ObjectName,string PU)
        {
            DataTable dt = specialItem.QMS_DefineData("", "", ObjectName, "getXmlList", "", PU);
            XmlList Xmllst = new XmlList();
            xmlList = Xmllst.getXmlList(dt);
            limitQty = dt.Rows[0]["LimitQty"].ToString();
        }

        public DataTable QMS_DefineData(string XMLString, string DBName, string Item, string Type, string UID, string PU)
        {
            return specialItem.QMS_DefineData(XMLString, DBName, Item, Type, UID, PU);
        }

        public DataTable execObjSP(string ObjectSP, string DBName, string sqlPara, string PU)
        {
            return specialItem.execObjSP(ObjectSP, DBName, sqlPara, PU);
        }

   
    }
}