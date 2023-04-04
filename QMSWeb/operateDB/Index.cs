using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;

namespace QMSWeb.operateDB
{
    public class Index
    {
        public string strPU { get; set; }

        CommonHelper.SqlHelper sqlhelper = new CommonHelper.SqlHelper();

        public bool CheckkLogin(string uid, string password, string userright, string appname,string PU, ref string msg)
        {
            string strSql = "Select Top 1 0 From UserDetail Where Username='" + uid + "' And PassWord='" + password + "'";
            DataTable dt = sqlhelper.ExecuteDataTable(strSql, CommandType.Text, null, "", PU, "query");
            if (dt.Rows.Count > 0)
            {
                return true;
                //strSql = "Select Top 1 0 From UserRight Where UserName='" + uid + "' And UserRight='" + userright + "' And AppName='" + appname + "'";
                //dt = sqlhelper.ExecuteDataTable(strSql, CommandType.Text, null, CommonHelper.SqlHelper.strConnSMTSecond);
                //if (dt.Rows.Count > 0)
                //{
                //    return true;
                //}
                //else
                //{
                //    msg = "You have no UserRight for Login,Please Contact with SFPE!";
                //}
            }
            else
            {
                msg = "PassWord is Wrong Or UserName not exists,Please Contact with SFPE!";
            }
            return false;
        }

        //public DataTable GetstrConnQSMS(string smtserver, string smtdatabase)
        //{
        //    string strSql = "Select SMT_DB,QSMS_DB,QSMS_Server From QSMS_SMT_DB Where SMT_Server='" + smtserver + "' And SMT_DB = '" + smtdatabase + "'";
        //    return sqlhelper.ExecuteDataTable(strSql, CommandType.Text, null, strPU, "SMTSecond");
        //}

        //public DataTable GetstrConnSMTSecond(string smtserver, string smtdatabase)
        //{
        //    string strSql = "Select Restore_DB From QSMS_SMT_DB Where SMT_Server='" + smtserver + "' And SMT_DB = '" + smtdatabase + "'";
        //    return sqlhelper.ExecuteDataTable(strSql, CommandType.Text, null, HttpContext.Current.Session["ConnSMT"].ToString());
        //}

        //public DataTable getUserDetail()
        //{
        //    string strSql = "Select * From UserDetail With(Nolock)";
        //    return sqlhelper.ExecuteDataTable(strSql, CommandType.Text, null, CommonHelper.SqlHelper.strConnSMTSecond);
        //}
    }
}