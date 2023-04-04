using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;


namespace QMSWeb.Model
{
    public class ShowBoardItem
    {
        operateDB.ShowBoardItem showBoardItem = new operateDB.ShowBoardItem();

        public DataTable getUrlList(string ObjectName, string Type, string PU)
        {
            return showBoardItem.QMS_DefineData(ObjectName, Type, PU);
        }
    }
}