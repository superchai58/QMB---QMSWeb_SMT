using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;


namespace QMSWeb.operateDB
{
    public class DefineDataDB
    {
        CommonHelper.SqlHelper sqlhelper = new CommonHelper.SqlHelper();

        public DataTable QMS_DefineData(string XMLString, string DBName, string ObjectName, string Type, string UID, string PU)
        {
            //string queryType = "query";
            //if (Type == "AddNew" || Type == "Delete" || Type == "Update" || Type == "batch" || Type == "Fix" || Type == "onSelect")
            //{
            //    queryType = "";
            //}
            string strSql = "QMSWeb_DefineData";
            SqlParameter[] paras = {   
                                       new SqlParameter("@XMLString", SqlDbType.NVarChar),
                                       new SqlParameter("@ObjectName", SqlDbType.VarChar, 50),
                                       new SqlParameter("@Type", SqlDbType.VarChar, 50),   
                                       new SqlParameter("@UID", SqlDbType.VarChar, 20)
                                   };
            paras[0].Value = XMLString;
            paras[1].Value = ObjectName;
            paras[2].Value = Type;
            paras[3].Value = UID;
            return sqlhelper.ExecuteDataTable(strSql, CommandType.StoredProcedure, paras, DBName, PU, "");
        }
    }
}