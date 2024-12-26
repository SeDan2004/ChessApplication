package com.example.chessapplication.classes;

public class WebsocketMsgParser {
    public static String getNativeHeaderParam(String msg, String paramName) {
        String param = "undefined";
        StringBuilder sb = new StringBuilder(msg);

        if (sb.indexOf("nativeHeaders") != -1) {
            int paramInd = sb.indexOf(paramName);
            param = sb.substring(paramInd, sb.indexOf(",", paramInd));
            param = param.substring(param.indexOf("[") + 1, param.indexOf("]"));
        }

        return param;
    }
}