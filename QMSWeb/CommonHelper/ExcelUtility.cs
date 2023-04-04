using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using System.Data;
using NPOI;
using System.Data.OleDb;
using NPOI.SS.UserModel;
using NPOI.HSSF.UserModel;
using NPOI.XSSF.UserModel;

namespace QMSWeb.CommonHelper
{
    public class ExcelUtility
    {
        public static DataTable ExcelToDataTable(string filePath, bool isColumnName)
        {
            DataTable dataTable = null;
            FileStream fs = null;
            DataColumn column = null;
            DataRow dataRow = null;
            IWorkbook workbook = null;
            ISheet sheet = null;
            IRow row = null;
            ICell cell = null;
            int startRow = 0;
            try
            {
                using (fs = File.OpenRead(filePath))
                {
                    if (filePath.IndexOf(".xlsx") > 0)
                    {
                        workbook = new XSSFWorkbook(fs);
                    }
                    else if (filePath.IndexOf(".xls") > 0)
                    {
                        workbook = new HSSFWorkbook(fs);
                    }
                    if (workbook != null)
                    {
                        sheet = workbook.GetSheetAt(0);//读取第一个sheet，当然也可以循环读取每个sheet  
                        dataTable = new DataTable();
                        if (sheet != null)
                        {
                            int rowCount = sheet.LastRowNum;//总行数  
                            if (rowCount > 0)
                            {
                                IRow firstRow = sheet.GetRow(0);//第一行  
                                int cellCount = firstRow.LastCellNum;//列数  
                                //构建datatable的列  
                                if (isColumnName)
                                {
                                    startRow = 1;//如果第一行是列名，则从第二行开始读取  
                                    for (int i = firstRow.FirstCellNum; i < cellCount; ++i)
                                    {
                                        cell = firstRow.GetCell(i);
                                        if (cell != null)
                                        {
                                            if (cell.StringCellValue != null)
                                            {
                                                column = new DataColumn(cell.StringCellValue);
                                                dataTable.Columns.Add(column);
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    for (int i = firstRow.FirstCellNum; i < cellCount; ++i)
                                    {
                                        column = new DataColumn("column" + (i + 1));
                                        dataTable.Columns.Add(column);
                                    }
                                }
                                //填充行  
                                for (int i = startRow; i <= rowCount; ++i)
                                {
                                    row = sheet.GetRow(i);
                                    if (row == null) continue;
                                    dataRow = dataTable.NewRow();
                                    for (int j = row.FirstCellNum; j < cellCount; ++j)
                                    {
                                        cell = row.GetCell(j);
                                        if (cell == null)
                                        {
                                            dataRow[j] = "";
                                        }
                                        else
                                        {
                                            switch (cell.CellType)
                                            {
                                                case CellType.Blank:
                                                    dataRow[j] = "";
                                                    break;
                                                case CellType.Numeric:
                                                    short format = cell.CellStyle.DataFormat;
                                                    //对时间格式（2015.12.5、2015/12/5、2015-12-5等）的处理  
                                                    if (format == 14 || format == 31 || format == 57 || format == 58)
                                                        dataRow[j] = cell.DateCellValue;
                                                    else
                                                        dataRow[j] = cell.NumericCellValue;
                                                    break;
                                                case CellType.String:
                                                    dataRow[j] = cell.StringCellValue;
                                                    break;
                                            }
                                        }
                                    }
                                    dataTable.Rows.Add(dataRow);
                                }
                            }
                        }
                    }
                }
                return dataTable;
            }
            catch (Exception)
            {
                if (fs != null)
                {
                    fs.Close();
                }
                return null;
            }
        }

        public static XSSFWorkbook Workbook(DataTable dt)
        {
            //创建Excel文件的对象  
            //NPOI.HSSF.UserModel.HSSFWorkbook book = new NPOI.HSSF.UserModel.HSSFWorkbook(); //xlx格式
            XSSFWorkbook book = new XSSFWorkbook(); //xlsx格式
            NPOI.SS.UserModel.ISheet sheet1 = book.CreateSheet("Sheet1"); //添加一个sheet  
            NPOI.SS.UserModel.IRow row1 = sheet1.CreateRow(0);//给sheet1添加第一行的头部标题 
            for (int i = 0; i < dt.Columns.Count; i++)
            {
                row1.CreateCell(i).SetCellValue(dt.Columns[i].ColumnName);
            }
            for (int i = 0; i < dt.Rows.Count; i++) //将数据逐步写入sheet1各个行  
            {
                NPOI.SS.UserModel.IRow rowtemp = sheet1.CreateRow(i + 1);
                for (int j = 0; j < dt.Columns.Count; j++)
                {
                    rowtemp.CreateCell(j).SetCellValue(dt.Rows[i][j].ToString().Trim());
                }
            }
            return book;
        }

        public static XSSFWorkbook Mult_Workbook(DataSet ds)
        {
            //创建Excel文件的对象  
            //NPOI.HSSF.UserModel.HSSFWorkbook book = new NPOI.HSSF.UserModel.HSSFWorkbook(); //xlx格式
            XSSFWorkbook book = new XSSFWorkbook(); //xlsx格式
            for (int m = 0; m < ds.Tables.Count; m++)
            {
                DataTable dt = ds.Tables[m];
                NPOI.SS.UserModel.ISheet sheet = book.CreateSheet("Sheet" + (m + 1).ToString()); //添加一个sheet  
                NPOI.SS.UserModel.IRow row1 = sheet.CreateRow(0);//给sheet1添加第一行的头部标题 
                for (int i = 0; i < dt.Columns.Count; i++)
                {
                    row1.CreateCell(i).SetCellValue(dt.Columns[i].ColumnName);
                }
                for (int i = 0; i < dt.Rows.Count; i++) //将数据逐步写入sheet1各个行  
                {
                    NPOI.SS.UserModel.IRow rowtemp = sheet.CreateRow(i + 1);
                    for (int j = 0; j < dt.Columns.Count; j++)
                    {
                        rowtemp.CreateCell(j).SetCellValue(dt.Rows[i][j].ToString().Trim());
                    }
                }
            }
            return book;
        }

        public static XSSFWorkbook Workbook(DataTable dt, DataTable dt2)
        {
            //创建Excel文件的对象  
            //NPOI.HSSF.UserModel.HSSFWorkbook book = new NPOI.HSSF.UserModel.HSSFWorkbook(); //xlx格式
            XSSFWorkbook book = new XSSFWorkbook(); //xlsx格式
            NPOI.SS.UserModel.ISheet sheet1 = book.CreateSheet("Sheet1"); //添加一个sheet  
            NPOI.SS.UserModel.IRow row1 = sheet1.CreateRow(0);//给sheet1添加第一行的头部标题 
            for (int i = 0; i < dt.Columns.Count; i++)
            {
                row1.CreateCell(i).SetCellValue(dt.Columns[i].ColumnName);
            }
            for (int i = 0; i < dt.Rows.Count; i++) //将数据逐步写入sheet1各个行  
            {
                NPOI.SS.UserModel.IRow rowtemp = sheet1.CreateRow(i + 1);
                for (int j = 0; j < dt.Columns.Count; j++)
                {
                    rowtemp.CreateCell(j).SetCellValue(dt.Rows[i][j].ToString().Trim());
                }
            }
            NPOI.SS.UserModel.ISheet sheet2 = book.CreateSheet("Sheet2"); //添加一个sheet  
            NPOI.SS.UserModel.IRow row2 = sheet2.CreateRow(0);//给sheet1添加第一行的头部标题 
            for (int i = 0; i < dt2.Columns.Count; i++)
            {
                row2.CreateCell(i).SetCellValue(dt2.Columns[i].ColumnName);
            }
            for (int i = 0; i < dt2.Rows.Count; i++) //将数据逐步写入sheet1各个行  
            {
                NPOI.SS.UserModel.IRow rowtemp = sheet2.CreateRow(i + 1);
                for (int j = 0; j < dt2.Columns.Count; j++)
                {
                    rowtemp.CreateCell(j).SetCellValue(dt2.Rows[i][j].ToString().Trim());
                }
            }
            return book;
        }

        public static DataTable FileStreamToDataTable(Stream stream)
        {
            DataTable table = new DataTable();
            //导入excel 自动区分 xls 和 xlsx
            IWorkbook workbook = WorkbookFactory.Create(stream);
            ISheet sheet = workbook.GetSheetAt(0);//得到里面第一个sheet
            //获取Excel的最大行数
            int rowsCount = sheet.PhysicalNumberOfRows;
            //为保证Table布局与Excel一样，这里应该取所有行中的最大列数（需要遍历整个Sheet）。
            //为少一交全Excel遍历，提高性能，我们可以人为把第0行的列数调整至所有行中的最大列数。
            int colsCount = sheet.GetRow(0).PhysicalNumberOfCells;
            for (int i = 0; i < colsCount; i++)
            {
                //将第一列设置成表头
                table.Columns.Add(sheet.GetRow(0).GetCell(i).ToString());
            }
            for (int x = 0; x < rowsCount; x++)
            {
                if (x == 0) continue; //去掉第一列
                DataRow dr = table.NewRow();
                for (int y = 0; y < colsCount; y++)
                {
                    dr[y] = sheet.GetRow(x).GetCell(y).ToString();
                }
                table.Rows.Add(dr);
            }
            string isEmpty = "N";
            while (isEmpty == "N")
            {
                for (int i = 0; i < table.Rows.Count; i++)
                {
                    isEmpty = "Y";
                    if (table.Rows[i][0].ToString() == "")
                    {
                        isEmpty = "N";
                        table.Rows.RemoveAt(i);
                    }
                }
            }
            return table;
        }

        public static DataTable GetExcelToDataTableBySheet(string FileFullPath, string SheetName)
        {
            try
            {
                if (string.IsNullOrEmpty(SheetName)) { SheetName = "Sheet1"; }
                bool checksheetname = false;
                String[] sheetNames = GetExcelSheetNames(FileFullPath);

                foreach (string sname in sheetNames)
                {
                    if (sname == SheetName)
                    {
                        checksheetname = true;
                    }
                }

                if (checksheetname == false)
                {
                    return null;
                }
                string strConn = "Provider=Microsoft.Ace.OleDb.12.0;" + "data source=" + FileFullPath + ";Extended Properties='Excel 12.0; HDR=NO; IMEX=1'"; //此連接可以操作.xls與.xlsx文件
                OleDbConnection conn = new OleDbConnection(strConn);
                conn.Open();

                DataTable dt1 = new DataTable();
                DataTable dt2 = new DataTable();

                string strCom = " SELECT * FROM [" + SheetName + "$] ";
                OleDbDataAdapter odda = new OleDbDataAdapter(strCom, conn);

                odda.Fill(dt1);
                conn.Close();

                int colCount = dt1.Columns.Count;
                int rowCount = dt1.Rows.Count;
                int x = 0;
                string colname;
                while (x < colCount)
                {
                    colname = dt1.Rows[0][x].ToString();    //把第一行数据当做表列名
                    dt2.Columns.Add(colname, Type.GetType("System.String"));
                    x = x + 1;
                }
                int y = 0;
                while (y < rowCount - 1)
                {
                    DataRow dr = dt2.NewRow();
                    for (int i = 0; i < dt2.Columns.Count; i++)  //从第2行开始塞入数据到dt2
                    {
                        dr[i] = dt1.Rows[y + 1][i].ToString();
                    }
                    dt2.Rows.Add(dr);
                    y = y + 1;
                }
                return dt2;
            }
            catch (Exception)
            {
                return null;
            }
            finally
            {
            }
        }

        public static String[] GetExcelSheetNames(string excelFile)
        {
            OleDbConnection objConn = null;
            System.Data.DataTable dt = null;
            try
            {
                string strConn = "Provider=Microsoft.Ace.OleDb.12.0;" + "data source=" + excelFile + ";Extended Properties='Excel 12.0; HDR=NO; IMEX=1'"; //此連接可以操作.xls與.xlsx文件
                objConn = new OleDbConnection(strConn);
                objConn.Open();
                dt = objConn.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
                if (dt == null)
                {
                    return null;
                }
                String[] excelSheets = new String[dt.Rows.Count];
                int i = 0;
                foreach (DataRow row in dt.Rows)
                {
                    excelSheets[i] = row["TABLE_NAME"].ToString().Replace("$", "");
                    i++;
                }
                return excelSheets;
            }
            catch (Exception)
            {
                return null;
            }
            finally
            {
                if (objConn != null)
                {
                    objConn.Close();
                    objConn.Dispose();
                }
                if (dt != null)
                {
                    dt.Dispose();
                }
            }
        }

        private static void DeleteFile(string FileName)
        {
            try
            {
                if (System.IO.File.Exists(FileName))
                {
                    System.IO.File.Delete(FileName);
                }
            }
            catch { }
        }

        private static System.Web.Mvc.FileStreamResult GetFileStreamResult(string FileName, string DownloadFileName)
        {
            try
            {
                System.Threading.Thread.Sleep(500);
                FileStream fs = new FileStream(FileName, FileMode.Open);
                byte[] data = new byte[fs.Length];
                fs.Read(data, 0, data.Length);
                fs.Close();

                MemoryStream ms = new MemoryStream(data);
                System.Web.Mvc.FileStreamResult fsr = new System.Web.Mvc.FileStreamResult(ms, "text/html;charset=UTF-8");
                fsr.FileDownloadName = DownloadFileName;
                return fsr;
            }
            catch (Exception)
            {
                return null;
            }
        }

    }
}