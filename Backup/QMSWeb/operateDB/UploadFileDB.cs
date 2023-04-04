using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using System.IO;

namespace QMSWeb.operateDB
{
    public class UploadFileDB
    {
        CommonHelper.SqlHelper sqlhelper = new CommonHelper.SqlHelper();
        public DataTable QMS_UploadFile(string XMLString,string DBName, string ObjectName, string type, string PU,string UID)
        {
            string strSql = "QMSWeb_DefineData";
            SqlParameter[] paras = {   
                                       new SqlParameter("@XMLString", SqlDbType.NVarChar),
                                       new SqlParameter("@ObjectName", SqlDbType.VarChar, 50),
                                       new SqlParameter("@Type", SqlDbType.VarChar, 50),
                                       new SqlParameter("@UID", SqlDbType.VarChar, 50)
                                   };
            paras[0].Value = XMLString;
            paras[1].Value = ObjectName;
            paras[2].Value = type;
            paras[3].Value = UID;
            return sqlhelper.ExecuteDataTable(strSql, CommandType.StoredProcedure, paras, DBName, PU, "");
        }
        public DataTable FileUpload_Insert(string FileName, Stream FileData, string ObjPath, string PU, string FunctionType, string UID, string DBName)
        {
            string strSql = "FileUpload_Insert";
            SqlParameter[] paras = {   
                                       new SqlParameter("@FileName", SqlDbType.VarChar),
                                       new SqlParameter("@FileData", SqlDbType.Binary, 0),
                                       new SqlParameter("@ObjPath", SqlDbType.VarChar, 200),
                                        new SqlParameter("@BU", SqlDbType.NVarChar,20),
                                       new SqlParameter("@FunctionType", SqlDbType.VarChar, 20),
                                       new SqlParameter("@UserID", SqlDbType.VarChar, 20)
                                   };
            paras[0].Value = FileName;
            paras[1].Value = FileData;
            paras[2].Value = ObjPath;
            paras[3].Value = PU;
            paras[4].Value = FunctionType;
            paras[5].Value = UID;
            return sqlhelper.ExecuteDataTable(strSql, CommandType.StoredProcedure, paras, DBName, PU, "");
        }
    }
}