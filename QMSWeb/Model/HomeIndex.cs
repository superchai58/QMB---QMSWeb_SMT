using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using System.Data;

namespace QMSWeb.Model
{
    public class HomeIndex
    {
        public string strPU { get; set; }

        operateDB.Index index = new operateDB.Index();
        
        public bool ChkLogin(string uid, string password, string userright, string appname,string PU, ref string msg)
        {
            string Msg=string.Empty;
            index.strPU = strPU;
            if (index.CheckkLogin(uid, password,userright,appname,PU, ref Msg) == false)
            {
                msg = Msg;
                return false;
            }
            return true;
        }

    }
}