using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;

namespace QMSWeb.operateDB
{
    public class QueryDataDB
    {
        CommonHelper.SqlHelper sqlhelper = new CommonHelper.SqlHelper();

        public DataTable iniSelectOptionValue(string DataSource, string DBName,string PU)
        {
            string strSql = DataSource;
            return sqlhelper.ExecuteDataTable(strSql, CommandType.Text, null, DBName, PU, "query");
        }

        public DataTable SelectOptionChg(string idValue, string DataSource, string DBName, string PU)
        {
            string strSql = DataSource;
            strSql = strSql.Replace("%{0}%", "%" + idValue + "%");
            strSql = strSql.Replace("{0}", "'" + idValue + "'");
            return sqlhelper.ExecuteDataTable(strSql, CommandType.Text, null, DBName, PU, "query");
        }

        public DataTable getQueryData(string ObjectSP, string DBName, string sqlPara, string PU)
        {
            var result = Newtonsoft.Json.JsonConvert.DeserializeObject<IDictionary<object, object>>(sqlPara);
            SqlParameter[] paras = new SqlParameter[result.Count];
            int i = 0;
            foreach (var item in result)
            {
                paras[i] = new SqlParameter("@" + item.Key.ToString(), SqlDbType.VarChar) { Value = item.Value.ToString() };
                i++;
            }
            string strSql = ObjectSP;
            return sqlhelper.ExecuteDataTable(strSql, CommandType.StoredProcedure, paras, DBName, PU, "query");
        }

        public DataSet getStationData(string ObjectSP,string DBName, string sqlPara,string PU)
        {
            var result = Newtonsoft.Json.JsonConvert.DeserializeObject<IDictionary<object, object>>(sqlPara);
            SqlParameter[] paras = new SqlParameter[result.Count];
            int i = 0;
            foreach (var item in result)
            {
                paras[i] = new SqlParameter("@" + item.Key.ToString(), SqlDbType.VarChar) { Value = item.Value.ToString() };
                i++;
            }
            string strSql = ObjectSP;
            return sqlhelper.ExecuteDataSet(strSql, CommandType.StoredProcedure, paras, DBName, PU, "query");
        }

        public DataTable QMSWeb_QueryData(string ObjectName, string Type,string PU)
        {
            string strSP = "QMSWeb_QueryData";
            SqlParameter[] paras = {   
                                      new SqlParameter("@ObjectName", SqlDbType.VarChar, 30) { Value = ObjectName},
                                      new SqlParameter("@Type", SqlDbType.VarChar, 30) { Value = Type},
                                   };
            return sqlhelper.ExecuteDataTable(strSP, CommandType.StoredProcedure, paras, "", PU, "");
        }

        public bool UploadData(DataTable dt, string Item, string DBName, string UID,string PU,ref string msg)
        {
            try
            {
                string strSql = string.Empty;
                if (DBName.IndexOf("QSMS") >= 0)
                {
                    strSql = "Delete From UniReport_Temp Where [KEY]='" + Item + "' And UID='" + UID + "'";
                    sqlhelper.ExecuteDataTable(strSql, CommandType.Text, null, DBName, PU, "");
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        strSql = "Insert Into UniReport_Temp([Key],Value,UID,TransDateTime) values ('" + Item + "','" + dt.Rows[i][0].ToString() + "','" + UID + "',dbo.FormatDate(getdate(),'YYYYMMDDHHNNSS'))";
                        sqlhelper.ExecuteDataTable(strSql, CommandType.Text, null, DBName, PU, "");
                    }
                }
                if (DBName.IndexOf("SMT") >= 0)
                {
                    strSql = "Delete From SN_Stock_Temp Where Type='" + Item + "' And UID='" + UID + "'";
                    sqlhelper.ExecuteDataTable(strSql, CommandType.Text, null, DBName, PU, "");
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        strSql = "Insert Into SN_Stock_Temp(SN,Type,UID,TransDateTime) values ('" + dt.Rows[i][0].ToString() + "','" + Item + "','" + UID + "',dbo.FormatDate(getdate(),'YYYYMMDDHHNNSS'))";
                        sqlhelper.ExecuteDataTable(strSql, CommandType.Text, null, DBName, PU, "");
                    }
                }
                return true;
            }
            catch (Exception ex)
            {
                msg = ex.Message;
                return false;
            }
        }

    }
}