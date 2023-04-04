using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Xml;
using System.IO;
using NPOI;
using NPOI.SS.UserModel;
using NPOI.HSSF.UserModel;
using NPOI.XSSF.UserModel;

namespace QMSWeb.Model
{
    public class QueryData
    {
        string message = string.Empty;
        public string strPU { get; set; }

        operateDB.QueryDataDB queryData = new operateDB.QueryDataDB();

        public List<Xmlparameter> xmlList { get; set; }
        public string limitQty { get; set; }
        public string queryInterval { get; set; }
        public DataTable dtMenulist;

        public DataTable getlistData(string type,string PU)
        {
            return queryData.QMSWeb_QueryData("",type,PU);
        }

        public DataTable iniSelectOptionValue(string DataSource, string DBName, string PU)
        {
            return queryData.iniSelectOptionValue(DataSource, DBName,PU);
        }

        public DataTable SelectOptionChg(string idValue, string DataSource, string DBName, string PU)
        {
            return queryData.SelectOptionChg(idValue, DataSource, DBName,PU);
        }

        public DataTable getQueryData(string ObjectSP, string DBName, string sqlPara, string PU)
        {
            return queryData.getQueryData(ObjectSP, DBName, sqlPara,PU);
        }

        public DataTable getTemplateData(string ObjectName,string type,string PU)
        {
            return queryData.QMSWeb_QueryData(ObjectName,type,PU);
        }

        public void getXmlList(string ObjectName, string PU)
        {
            DataTable dt = queryData.QMSWeb_QueryData( ObjectName,"getXmlList",PU);
            XmlList Xmllst = new XmlList();
            xmlList = Xmllst.getXmlList(dt);
            limitQty = dt.Rows[0]["LimitQty"].ToString();
            queryInterval = dt.Rows[0]["QueryInterval"].ToString();
        }

        public bool UploadData(DataTable dt, string Item, string DBName, string UID, string PU, ref string msg)
        {
            if (queryData.UploadData(dt, Item, DBName, UID,PU, ref message) == true)
            {
                return true;
            }
            msg = message;
            return false;
        }

        public DataSet getStationData(string ObjectSP, string DBName, string sqlPara, string PU)
        {
           return queryData.getStationData(ObjectSP,DBName,sqlPara,PU);
        }

        public void getMenulist(string ObjectName, string Type,string PU)
        {
            dtMenulist = queryData.QMSWeb_QueryData(ObjectName, Type, PU);
        }

        public List<easyTree> GetTreeParentList(string ObjectSP, string DBName, string sqlPara, string PU)
        {
            List<easyTree> treeParentNodeList = new List<easyTree>();
            DataTable dt = queryData.getQueryData(ObjectSP, DBName, sqlPara, PU);
            if (dt.Rows.Count > 0)
            {
                var result = Newtonsoft.Json.JsonConvert.DeserializeObject<IDictionary<object, object>>(sqlPara);
                result["Type"] = "ChildNodeList";
                result["Line"] = "";
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    result["Line"] = dt.Rows[i][1].ToString();
                    sqlPara = Newtonsoft.Json.JsonConvert.SerializeObject(result);
                    treeParentNodeList.Add(new easyTree(dt.Rows[i][0].ToString(), dt.Rows[i][1].ToString(), "icon-user", "closed", GetTreeChildNodeList(ObjectSP, DBName,sqlPara, PU)));
                }
            }
            return treeParentNodeList;
        }

        public List<easyTree> GetTreeChildNodeList(string ObjectSP, string DBName, string sqlPara, string PU)
        {
            List<easyTree> treeChildNodeList = new List<easyTree>();
            DataTable dt = queryData.getQueryData(ObjectSP, DBName, sqlPara, PU);
            if (dt.Rows.Count > 0)
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    treeChildNodeList.Add(new easyTree(dt.Rows[i][0].ToString(), dt.Rows[i][1].ToString(), "icon-user", "open"));
                }
            }
            return treeChildNodeList;
        }

    }
}