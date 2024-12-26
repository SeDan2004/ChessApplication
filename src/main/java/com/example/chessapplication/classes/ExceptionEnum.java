package com.example.chessapplication.classes;

public enum ExceptionEnum {
    USER_EXIST("Пользователь уже существует!"),
    USER_NOT_EXIST("Пользователя не существует, или указаны неправильные данные!"),
    INCORRECT_CODE_WORD("Неправильно указано ключевое слово");

    private String msg;

    ExceptionEnum(String msg) {
        this.msg = msg;
    }

    public String getMsg() {
        return msg;
    }
}
