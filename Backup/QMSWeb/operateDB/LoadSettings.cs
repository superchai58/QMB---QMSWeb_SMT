using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;

namespace QMSWeb.operateDB
{
    public class LoadSettings
    {
        public QMSWeb.Model.Settings LoadSetting(string line, string station,string PU)
        {
            string strSql = "PD_ALL_GetProSetting";

            SqlParameter[] paras = new SqlParameter[2];

            paras[0] = new SqlParameter("@Line", SqlDbType.VarChar, 20) { Value = line };
            paras[1] = new SqlParameter("@Station", SqlDbType.VarChar, 50) { Value = station };
            CommonHelper.SqlHelper sqlhelper = new CommonHelper.SqlHelper();
            DataTable dt = sqlhelper.ExecuteDataTable(strSql, CommandType.StoredProcedure, paras, "", PU, "");
            QMSWeb.Model.Settings settings = new QMSWeb.Model.Settings();
            if (dt.Rows[0]["Result"].ToString() == "0")
            {
                return settings;
            }
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                settings.Set(dt.Rows[i]["Key"].ToString(), dt.Rows[i]["Value"].ToString().ToUpper());
            }
            return settings;
        }
    }
}