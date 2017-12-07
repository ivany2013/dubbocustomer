package com.xl.tool;

import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.lang3.StringUtils;
import org.joda.time.DateTime;

import com.mysteel.common.string.StringUtil;

public class VelocityTool {
    public VelocityTool() {
    }
    public static String hiddenLongStr(String value){
    	if(StringUtil.isBlank(value)){
    		return "";
    	}
    	if(value.length()>10){
    		value=value.substring(0,10)+"...";
    	}
    	return value;
    }
    public static String covertZero(Object obj) {
        if (obj != null) {
            return "--";
        }
        return "";
    }

    public static String formatMoney(Object money) {
        if (money != null) {
            DecimalFormat df = new DecimalFormat("##0.00");
            return df.format(Double.valueOf(money.toString()));
        }
        return "0.00";
    }

    public static String formatZero(Object zero) {
        if (zero != null) {
            try {
                int z = Integer.parseInt(zero.toString());
                if (z == 0) {
                    return "--";
                }
            } catch (Exception e) {

            }
        }
        return zero.toString();
    }

    public static String formatString(Object obj) {
        return String.valueOf(obj);
    }

    public static long formatLong(Object obj) {
        return Long.parseLong(String.valueOf(obj));
    }

    // 格式化时间
    public static String formatTime(Long time, String format)
	{
		if (null == time)
		{
			return "";
		}

		if (null == format || format.trim().length() == 0)
		{
			format = "yyyy-MM-dd HH:mm:ss";
		} 
		else
		{
			format = format.trim();
		}

		DateTime dt = new DateTime(time);
		return dt.toString(format);
	}
    
    public static String timeFormat(Date date) {
        final String str = "yyyy-MM-dd HH:mm:ss";
        SimpleDateFormat sdf = new SimpleDateFormat(str);
        return sdf.format(date);
    }

    public static String timeFormat1(Date date) {
        final String str = "yyyy/MM/dd HH:mm:ss";
        SimpleDateFormat sdf = new SimpleDateFormat(str);
        return sdf.format(date);
    }

    public static String dateFormat(Date date) {
        final String str = "yyyy-MM-dd";
        SimpleDateFormat sdf = new SimpleDateFormat(str);
        return sdf.format(date);
    }

    public static String dateFormat1(Date date) {
        final String str = "yyyy-MM";
        SimpleDateFormat sdf = new SimpleDateFormat(str);
        return sdf.format(date);
    }

    public static String formatPercent(String n) {
        if (StringUtil.isBlank(n)) {
            return "--";
        }
        if ("--".equals(n.trim())) {
            return "--";
        }
        try{
        	
        	Double valueOf = Double.valueOf(n);
        	DecimalFormat nf = (DecimalFormat) NumberFormat.getPercentInstance();
        	nf.applyPattern("0%"); // 00表示小数点2位
        	nf.setMaximumFractionDigits(2);
        	return nf.format(valueOf);
        }catch(Exception e){
        	return n;
        }
    }
    
    public static boolean isEmpty(Object obj){
    	return "".equals(obj)||null==obj;
    }

    /**
     * 
     * 说明：判断平均访问时长,如果是空为返回"--"
     * 
     * @param n
     * @return
     * @author liupc
     * @time：2016年6月2日
     */
    public static String formatTernary(String n) {
        return StringUtils.isBlank(n) ? "--" : n;
    }

    /**
     * 
     * 说明：将pvcount等指标加个逗号,例如 1896464 --> 1,896,464
     * 
     * @param target
     * @return
     * @author 刘品呈
     * @time：2016年6月20日
     */
    public static String formatNormCount(String target) {
        if (StringUtils.equals("--", target)) {
            return target;
        }
        if (target==null||target.trim().equals("")) {
            return "--";
        }
        char[] charArray = target.toCharArray();
        StringBuffer sb = new StringBuffer();
        int x = 1;
        for (int i = charArray.length - 1; i >= 0; i--) {
            if (x % 3 == 1) {
                sb.append(",");
            }
            sb.append(charArray[i]);
            ++x;
        }
        String substring = sb.substring(0, 1);
        String s = sb.toString();
        if (StringUtils.equals(",", substring)) {
            s = s.substring(1, sb.length());
        }
        charArray = s.toCharArray();
        StringBuffer ss = new StringBuffer();
        for (int i = charArray.length - 1; i >= 0; i--) {
            ss.append(charArray[i]);
        }
        return ss.toString();
    }

}
