using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;

namespace QMSWeb.operateDB
{
    public class UploadDataDB
    {
        CommonHelper.SqlHelper sqlhelper = new CommonHelper.SqlHelper();

        public DataTable QMS_UploadData(string DBName, string ObjectName, string type, string PU, string UID)
        {
            string queryType = "";
            if (type == "MenuList" || type == "getXmlList")
            {
                queryType = "query";
            }
            string strSql = "QMSWeb_DefineData";
            SqlParameter[] paras = {   
                                       new SqlParameter("@ObjectName", SqlDbType.VarChar, 50),
                                       new SqlParameter("@Type", SqlDbType.VarChar, 50),
                                       new SqlParameter("@UID", SqlDbType.VarChar, 50)
                                   };
            paras[0].Value = ObjectName;
            paras[1].Value = type;
            paras[2].Value = UID;
            return sqlhelper.ExecuteDataTable(strSql, CommandType.StoredProcedure, paras, DBName, PU, queryType);
        }

        public bool QMS_UploadData(DataTable dt, string DBName, string ObjectName, string type, string PU, string UID,ref string msg)
        {
            try
            {
                string strSql = "";
                string hasPrimaryKey = "";
                if (type == "delALL")
                {
                    strSql = "TRUNCATE TABLE " + @ObjectName;
                    sqlhelper.ExecuteDataTable(strSql, CommandType.Text, null, DBName, PU, "");
                    return true;
                }
                DataTable ColumnData = QMS_UploadData(DBName, ObjectName, "GetColumns", PU,"");
                for (int i = 0; i < ColumnData.Rows.Count; i++)
                {
                    if (ColumnData.Rows[i]["Name"].ToString() != dt.Columns[i].ColumnName.ToString())
                    {
                        msg = "Error:Uploaded Column(" + dt.Columns[i].ColumnName.ToString() + ") and System Column (" + ColumnData.Rows[i]["Name"].ToString() + ") do not match!";
                        return false;
                    }
                    if (ColumnData.Rows[i]["IsPrimaryKey"].ToString() == "Y")
                    {
                        hasPrimaryKey = "Y";
                    }
                }
                if (hasPrimaryKey == "")
                {
                    msg = "Error:Table has no primary key!";
                    return false;
                }
                for (int i = 0; i < dt.Rows.Count;i++)
                {
                    strSql = GenerateSelectSql(ColumnData, dt.Rows[i], ObjectName);
                    if (type == "Save")
                    {
                        DataTable duplicateData = sqlhelper.ExecuteDataTable(strSql, CommandType.Text, null, DBName, PU, "");
                        if (duplicateData.Rows.Count > 0)
                        {
                            strSql = GenerateDeleteSql(ColumnData, dt.Rows[i], ObjectName);
                            sqlhelper.ExecuteDataTable(strSql, CommandType.Text, null, DBName, PU, "");
                        }
                        strSql = GenerateInsertSql(ColumnData, dt.Rows[i], UID, ObjectName);
                        sqlhelper.ExecuteDataTable(strSql, CommandType.Text,null,DBName,PU,"");
                    }
                    if (type == "Delete")
                    {
                        strSql = GenerateDeleteSql(ColumnData, dt.Rows[i], ObjectName);
                        sqlhelper.ExecuteDataTable(strSql, CommandType.Text, null, DBName, PU, "");
                    }
                    if (type == "Upload")
                    {
                        if (dt.Rows[i]["DeleteFlag"].ToString().ToUpper() == "Y")
                        {
                            strSql = GenerateDeleteSql(ColumnData, dt.Rows[i], ObjectName);
                            sqlhelper.ExecuteDataTable(strSql, CommandType.Text, null, DBName, PU, "");
                            continue;
                        }
                        strSql = GenerateDeleteSql(ColumnData, dt.Rows[i], ObjectName);
                        sqlhelper.ExecuteDataTable(strSql, CommandType.Text, null, DBName, PU, "");
                        strSql = GenerateInsertSql(ColumnData, dt.Rows[i], UID, ObjectName);
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

        public string GenerateInsertSql(DataTable item, DataRow dr, string UID, string tableName)
        {
            string fields = string.Empty;
            string strSql = string.Empty;
            for (int i = 0; i < item.Rows.Count; i++)
            {
                fields += string.Format("{0},", quotename(item.Rows[i]["Name"].ToString()));
            }
            fields = fields.Substring(0, fields.Length - 1);
            string values = string.Empty;
            for (int i = 0; i < item.Rows.Count; i++)
            {
                if (item.Rows[i]["XType"].ToString().ToUpper() == "NVARCHAR" || item.Rows[i]["XType"].ToString() == "NCHAR")
                {
                    values += string.Format("N'{0}',", dr[item.Rows[i]["Name"].ToString()].ToString().Trim());
                }
                else
                {
                    values += string.Format("'{0}',", dr[item.Rows[i]["Name"].ToString()].ToString().Trim());
                }
            }
            values = values.Substring(0, values.Length - 1);
            strSql = string.Format("INSERT INTO {0}({1},UID,TransDatetime) VALUES({2},'{3}',DBO.FormatDate(GETDATE(),'yyyymmddhhnnss'))",tableName, fields, values, UID);
            return strSql;
               
        }

        public string GenerateSelectSql(DataTable item, DataRow dr,string tableName)
        {
            string where = string.Empty;

            for (int j = 0; j < item.Rows.Count; j++)
            {
                if (item.Rows[j]["IsPrimaryKey"].ToString() == "Y")
                {
                    if (item.Rows[j]["XType"].ToString().ToUpper() == "NVARCHAR" || item.Rows[j]["XType"].ToString() == "NCHAR")
                    {
                        where += string.Format("{0}=N'{1}' AND ", quotename(item.Rows[j]["Name"].ToString()), dr[item.Rows[j]["Name"].ToString()]);
                    }
                    else
                    {
                        where += string.Format("{0}='{1}' AND ", quotename(item.Rows[j]["Name"].ToString()), dr[item.Rows[j]["Name"].ToString()]);
                    }
                }
            }
            if (string.IsNullOrEmpty(where))
            {
                for (int i = 0; i < item.Rows.Count; i++)
                {
                    if (item.Rows[i]["XType"].ToString().ToUpper() == "NVARCHAR" || item.Rows[i]["XType"].ToString() == "NCHAR")
                    {
                        where += string.Format("{0}=N'{1}' AND ", quotename(item.Rows[i]["Name"].ToString()), dr[item.Rows[i]["Name"].ToString()]);
                    }
                    else
                    {
                        where += string.Format("{0}='{1}' AND ", quotename(item.Rows[i]["Name"].ToString()), dr[item.Rows[i]["Name"].ToString()]);
                    }
                }
            }

            where = where.Substring(0, where.Length - 4);

            string strSql = string.Format("SELECT * FROM {0} WHERE {1}", tableName, where);

            return strSql;
        }

        public string GenerateDeleteSql(DataTable item, DataRow dr, string tableName)
        {
            string where = string.Empty;

            for (int j = 0; j < item.Rows.Count; j++)
            {
                if (item.Rows[j]["IsPrimaryKey"].ToString() == "Y")
                {
                    if (item.Rows[j]["XType"].ToString().ToUpper() == "NVARCHAR" || item.Rows[j]["XType"].ToString() == "NCHAR")
                    {
                        where += string.Format("{0}=N'{1}' AND ", quotename(item.Rows[j]["Name"].ToString()), dr[item.Rows[j]["Name"].ToString()]);
                    }
                    else
                    {
                        where += string.Format("{0}='{1}' AND ", quotename(item.Rows[j]["Name"].ToString()), dr[item.Rows[j]["Name"].ToString()]);
                    }
                }
            }
            if (string.IsNullOrEmpty(where))
            {
                for (int i = 0; i < item.Rows.Count; i++)
                {
                    if (item.Rows[i]["XType"].ToString().ToUpper() == "NVARCHAR" || item.Rows[i]["XType"].ToString() == "NCHAR")
                    {
                        where += string.Format("{0}=N'{1}' AND ", quotename(item.Rows[i]["Name"].ToString()), dr[item.Rows[i]["Name"].ToString()]);
                    }
                    else
                    {
                        where += string.Format("{0}='{1}' AND ", quotename(item.Rows[i]["Name"].ToString()), dr[item.Rows[i]["Name"].ToString()]);
                    }
                }
            }

            where = where.Substring(0, where.Length - 4);

            string strSql = string.Format("DELETE FROM {0} WHERE {1}", tableName, where);

            return strSql;
        }

        public string quotename(string columnName)
        {
            return string.Format("[{0}]", columnName.Trim());
        }

        public DataTable getData(string DBName, string ObjectName, string PU)
        {
            string strSql = "SELECT * FROM " + @ObjectName + " WITH(NOLOCK)";
            return sqlhelper.ExecuteDataTable(strSql, CommandType.Text, null, DBName, PU, "");
        }

    }
}