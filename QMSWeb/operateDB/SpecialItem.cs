using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;

namespace QMSWeb.operateDB
{
    public class SpecialItem
    {
        CommonHelper.SqlHelper sqlhelper = new CommonHelper.SqlHelper();

        public DataTable QMS_DefineData(string XMLString, string DBName, string ObjectName, string Type, string UID, string PU)
        {
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
            return sqlhelper.ExecuteDataTable(strSql, CommandType.StoredProcedure, paras, DBName, PU, "query");
        }

        public DataTable execObjSP(string ObjectSP, string DBName, string sqlPara, string PU)
        {
            var result = Newtonsoft.Json.JsonConvert.DeserializeObject<IDictionary<object, object>>(sqlPara);
            SqlParameter[] paras = new SqlParameter[result.Count];
            int i = 0;
            foreach (var item in result)
            {
                paras[i] = new SqlParameter("@" + item.Key.ToString(), SqlDbType.NVarChar) { Value = item.Value.ToString() };
                i++;
            }
            string strSql = ObjectSP;
            return sqlhelper.ExecuteDataTable(strSql, CommandType.StoredProcedure, paras, DBName, PU, "");
        }

        //public DataTable UpdateSNStatus(string SN, string UserName, string CurStatus, string UpdStatus, string Reason, string DBName, string PU)
        //{
        //    string strSql = "ChangeSNStatus";
        //    SqlParameter[] paras = {   
        //                               new SqlParameter("@SN", SqlDbType.NVarChar,100),
        //                               new SqlParameter("@UserName", SqlDbType.VarChar, 20),
        //                               new SqlParameter("@CurStatus", SqlDbType.VarChar, 10),   
        //                               new SqlParameter("@UpdStatus", SqlDbType.VarChar, 10),
        //                               new SqlParameter("@Reason", SqlDbType.VarChar, 200)
        //                           };
        //    paras[0].Value = SN;
        //    paras[1].Value = UserName;
        //    paras[2].Value = CurStatus;
        //    paras[3].Value = UpdStatus;
        //    paras[4].Value = Reason;
        //    return sqlhelper.ExecuteDataTable(strSql, CommandType.StoredProcedure, paras, DBName, PU, "definedata");
        //}


    }
}