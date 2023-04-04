using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Xml;

namespace QMSWeb.Model
{
    public class XmlList
    {
        public List<Xmlparameter> getXmlList(DataTable dt)
        {
            List<Xmlparameter> list = new List<Xmlparameter>();
            string Xmllist = dt.Rows[0]["FilterItem"].ToString();
            string ObjectSP = dt.Rows[0]["ObjectSP"].ToString();
            string DBName = dt.Rows[0]["DBName"].ToString();
            if (Xmllist == "")
            {
                list.Add(new Xmlparameter()
                {
                    Item = "",
                    ItemType = "",
                    eg = "",
                    Tag = "",
                    DataType = "",
                    DataSource = "",
                    DisplayView = "",
                    PromptValue = "",
                    LinkPara = "",
                    Para = "",
                    Editable = "",
                    ObjectSP = ObjectSP,
                    DBName = DBName
                }
               );
                //xmlList = list;
                return list;
            }
            XmlDocument doc = new XmlDocument();
            doc.LoadXml(Xmllist);
            XmlNode xn = doc.SelectSingleNode("Comment");
            XmlNodeList xnl = xn.ChildNodes;
            foreach (XmlNode item in xnl)
            {
                XmlElement xe = (XmlElement)item;
                list.Add(new Xmlparameter()
                {
                    Item = xe.GetAttribute("Item"),//.Replace("[","").Replace("]",""),
                    ItemType = xe.GetAttribute("ItemType"),
                    eg = xe.GetAttribute("eg"),
                    Tag = xe.GetAttribute("tag"),
                    DataType = xe.GetAttribute("DataType"),
                    DataSource = xe.GetAttribute("DataSource"),
                    DisplayView = xe.GetAttribute("DisplayView"),
                    PromptValue = xe.GetAttribute("PromptValue"),
                    LinkPara = xe.GetAttribute("LinkPara"),
                    Para = xe.GetAttribute("Para"),
                    Editable = xe.GetAttribute("Editable"),
                    ObjectSP = ObjectSP,
                    DBName = DBName,
                }
                );
            }
            return list;
        }
    }
}