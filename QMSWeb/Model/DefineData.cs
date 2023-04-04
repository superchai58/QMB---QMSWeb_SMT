using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Xml;

namespace QMSWeb.Model
{
    public class DefineData
    {
        operateDB.DefineDataDB defineData = new operateDB.DefineDataDB();
        public List<Xmlparameter> xmlList { get; set; }
        public DataTable dtMenulist;
        public string limitQty { get; set; }

        public void getMenulist(string XMLString, string DBName, string ObjectName, string Type, string UID, string PU)
        {
            dtMenulist = defineData.QMS_DefineData(XMLString, DBName, ObjectName, Type, UID, PU);
        }

        public void getXmlList(string ObjectName,string PU)
        {
            DataTable dt = defineData.QMS_DefineData(ObjectName, "", ObjectName, "getXmlList", "", PU);
            XmlList Xmllst = new XmlList();
            xmlList = Xmllst.getXmlList(dt);
            limitQty = dt.Rows[0]["LimitQty"].ToString();
        }

        public DataTable QMS_DefineData(string XMLString, string DBName, string Item, string Type, string UID, string PU)
        {
            return defineData.QMS_DefineData(XMLString, DBName, Item, Type, UID, PU);
        }

        public List<easyTree> GetTreeParentList(string xmlstring, string DBName, string Item, string Type, string PU)
        {
            List<easyTree> treeParentNodeList = new List<easyTree>();
            DataTable dt = defineData.QMS_DefineData(xmlstring, DBName, Item, Type, "", PU);
            if (dt.Rows.Count > 0)
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    treeParentNodeList.Add(new easyTree(dt.Rows[i][0].ToString(), dt.Rows[i][1].ToString(), "icon-user", "closed", GetTreeChildNodeList(dt.Rows[i][1].ToString(), DBName, Item, "ChildNodeList", PU)));
                }
            }
            return treeParentNodeList;
        }

        public List<easyTree> GetTreeChildNodeList(string xmlstring, string DBName, string Item, string Type, string PU)
        {
            List<easyTree> treeChildNodeList = new List<easyTree>();
            DataTable dt = defineData.QMS_DefineData(xmlstring, DBName, Item, Type, "", PU);
            if (dt.Rows.Count > 0)
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    treeChildNodeList.Add(new easyTree(dt.Rows[i][0].ToString(), dt.Rows[i][1].ToString(), "icon-user", "open"));
                }
            }
            return treeChildNodeList;
        }

        public DataTable UploadData(DataTable dt, string Item, string DBName, string Type, string UID, string PU)
        {
            string XMLString = QMSWeb.CommonHelper.DataTabletoXml.genXml(dt);
            return defineData.QMS_DefineData(XMLString, DBName, Item, Type, UID, PU);
        }

        public DataTable getTemplateData(string ObjectName,string DBName, string type, string PU)
        {
            return defineData.QMS_DefineData("",DBName,ObjectName,type, "",PU);
        }

        
    }
}