package com.example.chessapplication.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class PageController {
    @GetMapping
    public String index() {
        return "index";
    }

    @GetMapping("lobby")
    public String lobby() {
        return "lobby";
    }

    @GetMapping("chess_page")
    public String chess() {
        return "chess";
    }
}
