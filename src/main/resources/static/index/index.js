let authenticationFormHeader = $(".authentication_form_header")[0],
    authenticationFormMain = $(".authentication_form_main")[0],
    auth, reg, forgotPass, activeForm,
    back = $(".back")[0],
    accept = $(".accept")[0];

function getDivWithoutDisplayNone(div) {
  return getComputedStyle(div).display !== "none";
}
function initializeVariableForms() {
    let header, main;

    header = [...authenticationFormHeader.children].find(getDivWithoutDisplayNone);
    main = [...authenticationFormMain.children].find(getDivWithoutDisplayNone);

    auth = header.querySelector(".auth");
    reg = header.querySelector(".reg");
    activeForm = [...main.children].find(getDivWithoutDisplayNone);
    forgotPass = activeForm.querySelector(".forgot_pass");
}
function acceptForm(e) {
  if (formHasEmptyFields(activeForm)) {
    alert("Есть незапоненные пустые поля!");
    return;
  }

  if (activeForm.classList.contains("reg_form")) acceptReg();
  if (activeForm.classList.contains("auth_form")) acceptAuth();
  if (activeForm.classList.contains("forgot_pass_form")) acceptForgotPass();
}
function acceptReg() {
  let login = activeForm.querySelector(".login_inp").value,
      password = activeForm.querySelector(".password_inp").value,
      repeatPass = activeForm.querySelector(".repeat_password_inp").value,
      controlWord = activeForm.querySelector(".control_word_inp").value;

  if (password !== repeatPass) {
    alert("Пароли не совпадают!");
    return;
  }

  $.ajax({
    method: "POST",
    url: "/user/reg",
    contentType: "application/json",
    data: JSON.stringify({
      login: login,
      password: password,
      codeWord: controlWord
    }),
    success(response) {
      location.href = "/lobby";
    },
    error(error) {
      alert(error.responseJSON.msg);
      clearFormFields(activeForm);
    }
  })
}
function acceptAuth() {
  let login = activeForm.querySelector(".login_inp").value,
      password = activeForm.querySelector(".password_inp").value;

  $.ajax({
    method: "POST",
    url: "/user/auth",
    contentType: "application/json",
    data: JSON.stringify({
      login: login,
      password: password
    }),
    success(response) {
      location.href = "/lobby";
    },
    error(error) {
      alert(error.responseJSON.msg);
      clearFormFields(activeForm);
    }
  })
}
function acceptForgotPass() {
  let login = activeForm.querySelector(".login_inp").value,
      password = activeForm.querySelector(".password_inp").value,
      newPassword = activeForm.querySelector(".new_password_inp").value,
      controlWord = activeForm.querySelector(".control_word_inp").value;

  $.ajax({
    method: "PUT",
    url: "/user/forgot_pass",
    contentType: "application/json",
    data: JSON.stringify({
      login: login,
      password: password,
      newPassword: newPassword,
      codeWord: controlWord
    }),
    success(response) {
      back.click();
    },
    error(error) {
      alert(error.responseJSON.msg);
      clearFormFields(activeForm);
    }
  })
}
function clearFormFields(form) {
  [...form.querySelectorAll("input")].forEach((inp) => {
    if (inp.type === "checkbox") {
      inp.checked = false;
    } else {
      inp.value = "";
    }
  })
}
function formHasEmptyFields(form) {
  return !![...form.querySelectorAll("input")].find((field) => {
    return field.value.trim() === ""
  });
}
function toggleForm(e) {
  let parentToggle = e.currentTarget.parentNode,
      parentForm = activeForm.parentNode,
      currentBtnClass = e.currentTarget.classList[0],
      form;

  if (currentBtnClass === "reg" || currentBtnClass === "auth") {
    let active = parentToggle.querySelector(".active");

    e.currentTarget.classList.add("active");
    active.classList.remove("active");

    e.currentTarget.removeEventListener("click", toggleForm);
    active.addEventListener("click", toggleForm);

    if (currentBtnClass === "reg") {
      form = parentForm.querySelector(".reg_form");
    }

    if (currentBtnClass === "auth") {
      form = parentForm.querySelector(".auth_form");
    }
  }

  if (currentBtnClass === "back") {
    back.style.visibility = "hidden";
    form = parentForm.querySelector(".auth_form");
  }

  if (currentBtnClass === "forgot_pass") {
    back.style.visibility = "visible";
    form = parentForm.querySelector(".forgot_pass_form");
  }

  activeForm.style.opacity = "0";
  setTimeout(() => {
    activeForm.style.display = "none";
    form.style.display = "flex";

    setTimeout(() => {
      form.style.opacity = "1";
      activeForm = form;
    }, 100);
  }, 500);
}
function addEvent() {
  reg.addEventListener("click", toggleForm);
  forgotPass.addEventListener("click", toggleForm);
  back.addEventListener("click", toggleForm);
  accept.addEventListener("click", acceptForm);
}

initializeVariableForms();
addEvent();