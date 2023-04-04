using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;

namespace QMSWeb.operateDB
{
    public class ShowBoardItem
    {
        CommonHelper.SqlHelper sqlhelper = new CommonHelper.SqlHelper();

        public DataTable QMS_DefineData(string ObjectName, string Type,string PU)
        {
            string strSql = "QMSWeb_DefineData";
            SqlParameter[] paras = {   
                                       new SqlParameter("@ObjectName", SqlDbType.VarChar, 50),
                                       new SqlParameter("@Type", SqlDbType.VarChar, 50)
                                   };
            paras[0].Value = ObjectName;
            paras[1].Value = Type;
            return sqlhelper.ExecuteDataTable(strSql, CommandType.StoredProcedure, paras, "", PU, "");
        }
    }
}