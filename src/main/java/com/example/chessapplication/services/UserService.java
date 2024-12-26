package com.example.chessapplication.services;

import com.example.chessapplication.classes.ExceptionEnum;
import com.example.chessapplication.modules.exceptions.IncorrectCodeWordException;
import com.example.chessapplication.modules.exceptions.UserExistException;
import com.example.chessapplication.modules.exceptions.UserNotExistException;
import com.example.chessapplication.modules.requests.UserAuthRequest;
import com.example.chessapplication.modules.requests.UserForgotPassRequest;
import com.example.chessapplication.modules.requests.UserRegRequest;
import com.example.chessapplication.repositories.CodeWordsRepository;
import com.example.chessapplication.repositories.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CodeWordsRepository codeWordsRepository;
    @Autowired
    private HttpServletRequest servletRequest;

    private HttpSession session;

    private String login;
    private String password;
    private String newPassword;
    private String codeWord;

    public Long reg(UserRegRequest request)
            throws UserExistException {
        login = request.getLogin();
        password = request.getPassword();
        codeWord = request.getCodeWord();
        session = servletRequest.getSession();

        if (!userRepository.checkUserInDb(login, password)) {
            Long userId = userRepository.add(login, password);
            codeWordsRepository.add(userId, codeWord);
            session.setAttribute("username", login);
            return userId;
        } else {
            throw new UserExistException(ExceptionEnum.USER_EXIST.getMsg());
        }
    }

    public Long auth(UserAuthRequest request) throws UserNotExistException {
        login = request.getLogin();
        password = request.getPassword();
        session = servletRequest.getSession();

        if (userRepository.checkUserInDb(login, password)) {
            session.setAttribute("username", login);
            return userRepository.getIdByLoginAndPassword(login, password);
        } else {
            throw new UserNotExistException(ExceptionEnum.USER_NOT_EXIST.getMsg());
        }
    }

    public void forgotPass(UserForgotPassRequest request)
            throws UserNotExistException, IncorrectCodeWordException {
        login = request.getLogin();
        password = request.getPassword();
        newPassword = request.getNewPassword();
        codeWord = request.getCodeWord();

        Long idUser = userRepository.getIdByLoginAndPassword(login, password);

        if (idUser != null) {
            if (codeWordsRepository.checkCodeWord(idUser, codeWord)) {
                userRepository.update(idUser, newPassword);
            } else {
                throw new IncorrectCodeWordException(ExceptionEnum.INCORRECT_CODE_WORD.getMsg());
            }
        } else {
            throw new UserNotExistException(ExceptionEnum.USER_NOT_EXIST.getMsg());
        }
    }
}
