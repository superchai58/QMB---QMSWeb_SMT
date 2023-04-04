using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Encrypt;

namespace QMSWeb.CommonHelper
{
    public class SqlHelper
    {
        //public static string strConnSMT;//{ get; set; }
        //public static string strConnQSMS;// { get; set; }
        //public static string strConnQSMSSecond { get; set; }
        //public static string strConnSMTSecond { get; set; }
        //public static string strConnDrop { get; set; }
        //public static string strConnDropSecond { get; set; }
        //private static object myObject = new object();
        private SqlConnection _cn;
        private SqlDataAdapter _sda;
        private SqlCommand _cmd;
        private DataTable _dt;
        private DataSet _ds;

        private SqlConnection CreateConnection(string strConn)
        {
            try
            {
                if (String.IsNullOrEmpty(strConn))
                {
                    return null;
                }
                else
                {
                    SqlConnection cn = new SqlConnection(strConn);
                    cn.Open();
                    return cn;
                }
            }
            catch
            {
                return null;
            }
        }

        private SqlConnection CreateConnection(string PU, string DBName, string optype)
        {
            try
            {
                if (string.IsNullOrEmpty(PU))
                {
                    return null;
                }
                string strConnInfo = System.Configuration.ConfigurationManager.ConnectionStrings["Portal_" + PU].ConnectionString;
                strConnInfo = EncryptStr.DecryptDES(strConnInfo, "1234ABCD");
                //if (DBName == "QSMS" || DBName == "QSMS_HUA" || DBName == "QSMS_CAM")
                if(DBName.IndexOf("QSMS")>=0)
                {
                    string smtserver = GetKeyValue(strConnInfo, "Server").ToUpper();
                    string smtdatabase = GetKeyValue(strConnInfo, "Database").ToUpper();
                    string strSql = "Select SMT_DB,QSMS_DB,QSMS_Server From QSMS_SMT_DB Where SMT_Server='" + smtserver + "' And SMT_DB = '" + smtdatabase + "'";
                    DataTable dt = ExecuteDataTable(strSql, CommandType.Text, null, strConnInfo);
                    if (dt.Rows.Count > 0)
                    {
                        string smtdb = dt.Rows[0]["SMT_DB"].ToString().ToUpper();
                        string qsmsdb = dt.Rows[0]["QSMS_DB"].ToString().ToUpper();
                        string qsmsserver = dt.Rows[0]["QSMS_Server"].ToString().ToUpper();
                        string strconnqsms = strConnInfo;
                        strconnqsms = strconnqsms.Replace(smtdb, qsmsdb);
                        strconnqsms = strconnqsms.Replace(smtserver, qsmsserver);
                        strConnInfo = strconnqsms;
                    }
                    else
                    {
                        return null;
                    }
                }
                if (DBName.IndexOf("SMT") >= 0 && optype == "query")
                {
                    string smtserver = GetKeyValue(strConnInfo, "Server").ToUpper();
                    string smtdatabase = GetKeyValue(strConnInfo, "Database").ToUpper();
                    string strSql = "Select Restore_DB From QSMS_SMT_DB Where SMT_Server='" + smtserver + "' And SMT_DB = '" + smtdatabase + "'";
                    DataTable dt = ExecuteDataTable(strSql, CommandType.Text, null, strConnInfo);
                    if (dt.Rows.Count > 0)
                    {
                        string smtserverSecond = dt.Rows[0]["Restore_DB"].ToString().ToUpper();
                        string strconnsmtSecond = strConnInfo;
                        strconnsmtSecond = strconnsmtSecond.Replace(smtserver, smtserverSecond);
                        strConnInfo= strconnsmtSecond;
                    }
                    else
                    {
                        return null;
                    }
                }
                if (String.IsNullOrEmpty(strConnInfo))
                {
                    return null;
                }
                else
                {
                    SqlConnection cn = new SqlConnection(strConnInfo);
                    cn.Open();
                    return cn;
                }
            }
            catch
            {
                return null;
            }
        }

        private void CloseConnection(SqlConnection cn)
        {
            try
            {
                if (cn == null)
                {
                    return;
                }
                if (cn.State != ConnectionState.Closed)
                {
                    cn.Dispose();
                    cn.Close();
                }
            }
            finally
            {
                //cn.Dispose();
                cn = null;
            }
        }

        public DataSet ExecuteDataSet(string spName, CommandType commandType, SqlParameter[] paras, string strConn)
        {
            _cn = null;
            try
            {
                //lock (myObject)
                //{
                _cn = CreateConnection(strConn);
                if (_cn == null)
                {
                    throw new Exception("Connection is null");
                }
                _sda = new SqlDataAdapter(spName, _cn);
                if (paras != null)
                    foreach (var s in paras)
                        _sda.SelectCommand.Parameters.Add(s);
                _sda.SelectCommand.CommandType = commandType;
                _ds = new DataSet();
                _sda.Fill(_ds);
                _sda.Dispose();
                return _ds;
                //}
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                CloseConnection(_cn);
            }
        }

        public DataSet ExecuteDataSet(string spName, CommandType commandType, SqlParameter[] paras, string DBName, string PU, string optype)
        {
            _cn = null;
            try
            {
                //lock (myObject)
                //{
                _cn = CreateConnection(PU, DBName, optype);
                if (_cn == null)
                {
                    throw new Exception("Connection is null");
                }
                _sda = new SqlDataAdapter(spName, _cn);
                if (paras != null)
                    foreach (var s in paras)
                        _sda.SelectCommand.Parameters.Add(s);
                _sda.SelectCommand.CommandType = commandType;
                _sda.SelectCommand.CommandTimeout = 300;
                _ds = new DataSet();
                _sda.Fill(_ds);
                _sda.Dispose();
                return _ds;
                //}
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                CloseConnection(_cn);
            }
        }

        public DataTable ExecuteDataTable(string spName, CommandType commandType, SqlParameter[] paras, string strConn)
        {
            _cn = null;
            try
            {
                //lock (myObject)
                //{
                _cn = CreateConnection(strConn);
                _sda = new SqlDataAdapter(spName, _cn);
                if (paras != null)
                    foreach (var s in paras)
                        _sda.SelectCommand.Parameters.Add(s);

                _sda.SelectCommand.CommandType = commandType;
                _dt = new DataTable();
                _sda.Fill(_dt);
                _sda.Dispose();
                return _dt;
                //}
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                CloseConnection(_cn);
            }
        }

        public DataTable ExecuteDataTable(string spName, CommandType commandType, SqlParameter[] paras, string DBName, string PU, string optype)
        {
            _cn = null;
            try
            {
                //lock (myObject)
                //{
                _cn = CreateConnection(PU, DBName, optype);
                _sda = new SqlDataAdapter(spName, _cn);
                if (paras != null)
                    foreach (var s in paras)
                        _sda.SelectCommand.Parameters.Add(s);

                _sda.SelectCommand.CommandType = commandType;
                _sda.SelectCommand.CommandTimeout = 300;
                _dt = new DataTable();
                _sda.Fill(_dt);
                _sda.Dispose();
                return _dt;
                //}
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                CloseConnection(_cn);
            }
        }

        public void Executeless(string strSql, CommandType commandType, SqlParameter[] paras, string strConn)
        {
            _cn = null;
            try
            {
                //lock (myObject)
                //{
                _cn = CreateConnection(strConn);
                _cmd = new SqlCommand(strSql, _cn);
                if (paras != null)
                {
                    foreach (var s in paras)
                    {
                        _cmd.Parameters.Add(s);
                    }
                }
                _cmd.CommandType = commandType;
                _cmd.ExecuteNonQuery();
                //}
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                CloseConnection(_cn);
            }
        }

        private string GetKeyValue(string src, string key)
        {
            int pos1, pos2;
            pos1 = src.ToUpper().IndexOf(key.ToUpper() + "=");
            if (pos1 > 0)
            {
                pos1 = pos1 + key.Trim().Length;
                pos2 = src.ToUpper().IndexOf(";", pos1);
                if (pos2 > 0)
                {
                    return src.Substring(pos1 + 1, pos2 - pos1 - 1);
                }
                pos2 = src.ToUpper().IndexOf("\"", pos1);
                if (pos2 > 0)
                {
                    return src.Substring(pos1 + 1, pos2 - pos1 - 1);
                }
                return src.Substring(pos1);
            }
            else
            {
                return string.Empty;
            }
        }
    }
}