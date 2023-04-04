using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QMSWeb.Model
{
    public class easyTree
    {
       public int id { get; set; }
       public string text { get; set; }
       public string iconCls { get; set; }/// 图标
       public string state { get; set; }
       public string attributes { get; set; }
       public List<easyTree>  children { get; set; }

       public easyTree( )
       {
           this.state = "open";
           this.children = new List<easyTree>();
       }

       public easyTree(string id, string text, string iconCls = "", string state = "open", List<easyTree> listChildren = null, string attributes="")
       {
           this.id = int.Parse(id);
           this.text = text;
           this.iconCls = iconCls;
           this.state = state;
           this.children = listChildren;
           this.attributes = attributes;
       }

       public easyTree(int id, string text, string iconCls = "", string state = "open")
       {
           this.id = id;
           this.text = text;
           this.iconCls = iconCls;
           this.state = state;
       }

    }
}