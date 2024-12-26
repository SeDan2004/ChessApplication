let stompClient,
    username,
    users,
    userLength,
    userList = $(".user_list")[0],
    pagBtns = [...$(".pag_btns")[0].children],
    back = pagBtns[0],
    pagNums = pagBtns.slice(1, pagBtns.length - 1),
    next = pagBtns[pagBtns.length - 1],
    pagsCount,
    activePagNum = 1,
    pageSize = 5,
    invitersArr = [],
    recipientsArr = [];

function connect(username) {
  let socket = new SockJS("/lobby_users");

  stompClient = Stomp.over(socket);
  stompClient.connect({username: username, endpoint: "/lobby_users"}, () => {
    console.log("Connection is opened!");
    getUpdatedUsersAndCount();
    getUsersAndCount();
    checkInvitersStatus();
  })
}
function getUsersAndCount() {
  $.ajax({
    method: "GET",
    url: `/lobby/list/${username}`,
    success(response) {
      users = response.users;
      userLength = response.totalCount;

      renderUsers();
      getPagCount();

      if (pagsCount > 0) {
        $(".pag_btns")[0].style.display = "flex";
        renderPagBtns();
      } else {
        $(".pag_btns")[0].style.display = "none";
      }
    }
  })
}
function getUpdatedUsersAndCount() {
  stompClient.subscribe("/user/msg/user_list_and_count", (msg) => {
    let response = JSON.parse(msg.body);
    users = response.users;
    userLength = response.totalCount;

    renderUsers();
    getPagCount();

    if (pagsCount > 0) {
      if (activePagNum > pagsCount) {
        activePagNum--;
        checkActivePagNum();
      }

      $(".pag_btns")[0].style.display = "flex";
      renderPagBtns();
    } else {
      $(".pag_btns")[0].style.display = "none";
    }
  })
}
function invite(e) {
  let currentBtn = e.currentTarget,
      userBox = currentBtn.parentNode.parentNode,
      inviteInfo, recipient;

  currentBtn.innerText = "Отмена";
  currentBtn.classList.remove("invite");
  currentBtn.classList.add("cancel");

  currentBtn.removeEventListener("click", invite);
  currentBtn.addEventListener("click", cancelInvite);

  recipient = userBox.querySelector("p").innerText;

  inviteInfo = JSON.stringify({
    sender: username,
    recipient: recipient,
    action: "invite"
  });

  stompClient.send("/send/invite", {}, inviteInfo);
  recipientsArr.push(recipient);
}
function cancelInvite(e) {
  let currentBtn = e.currentTarget,
      userBox = currentBtn.parentNode.parentNode,
      inviteInfo, recipient;

  currentBtn.innerText = "Пригласить на матч";
  currentBtn.classList.remove("cancel");
  currentBtn.classList.add("invite");

  currentBtn.removeEventListener("click", cancelInvite);
  currentBtn.addEventListener("click", invite);

  recipient = userBox.querySelector("p").innerText;

  inviteInfo = JSON.stringify({
    sender: username,
    recipient: recipient,
    action: "cancel"
  })

  stompClient.send("/send/invite", {}, inviteInfo);
  recipientsArr.splice(recipientsArr.indexOf(recipient), 1);
}
function refuseInvite(e) {
  let currentBtn = e.currentTarget,
      inviteInfo,
      userBox = currentBtn.parentNode.parentNode.parentNode,
      refuseAndAccept = currentBtn.parentNode,
      inviteBtn = refuseAndAccept.nextElementSibling,
      recipient = userBox.querySelector("p").innerText;

  refuseAndAccept.children[0].removeEventListener("click", refuseInvite);
  refuseAndAccept.children[1].removeEventListener("click", acceptInvite);
  refuseAndAccept.style.display = "none";

  inviteBtn.addEventListener("click", invite);
  inviteBtn.style.display = "flex";

  inviteInfo = JSON.stringify({
    sender: username,
    recipient: recipient,
    action: "refuse"
  })

  stompClient.send("/send/invite", {}, inviteInfo);
  invitersArr.splice(invitersArr.indexOf(recipient), 1);
}
function acceptInvite(e) {
  let userBox = e.currentTarget.parentNode.parentNode.parentNode,
      recipient = userBox.querySelector("p").innerText,
      inviteInfo;

  inviteInfo = JSON.stringify({
    sender: username,
    recipient: recipient,
    action: "accept"
  })

  stompClient.send("/send/invite", {}, inviteInfo);
  location.href = "/chess_page";
}
function checkInvitersStatus() {
  stompClient.subscribe("/user/msg/invite", (msg) => {
    let [sender, action] = msg.body.split("-");

    if (action === "invite") {
      invitersArr.push(sender);
      checkInvitersAndRecipientsArr();
    }

    if (action === "cancel") {
      let userListChild = [...userList.children],
          userBox;

      invitersArr.splice(invitersArr.indexOf(sender), 1);
      userBox = userListChild.find((user) => user.querySelector("p").innerText === sender);

      if (userBox !== undefined) {
        let inviteBtn = userBox.querySelector(".invite"),
            refuseAndAccept = userBox.querySelector(".refuse_and_accept");

        refuseAndAccept.style.display = "none";
        inviteBtn.style.display = "flex";

        refuseAndAccept.children[0].removeEventListener("click", refuseInvite);
        refuseAndAccept.children[1].removeEventListener("click", acceptInvite);
        inviteBtn.addEventListener("click", invite);
      }
    }

    if (action === "refuse") {
      let userListChild = [...userList.children],
          userBox;

      recipientsArr.splice(recipientsArr.indexOf(sender), 1);
      userBox = userListChild.find(user => user.querySelector("p").innerText === sender);

      if (userBox !== undefined) {
        let cancelOrInvite = userBox.querySelector(".cancel");

        cancelOrInvite.innerText = "Пригласить на матч";
        cancelOrInvite.classList.remove("cancel");
        cancelOrInvite.classList.add("invite");

        cancelOrInvite.removeEventListener("click", cancelInvite);
        cancelOrInvite.addEventListener("click", invite);
      }
    }

    if (action === "accept") {
      location.href = "/chess_page";
    }
  })
}
function checkInvitersAndRecipientsArr() {
  let userListChilds = [...userList.children],
      userBox, refuseAndAccept, inviteBtn;

  invitersArr.forEach((inviter) => {
    userBox = userListChilds.find((user) => {
      return user.querySelector("p").innerText === inviter;
    })

    if (userBox !== undefined) {
      refuseAndAccept = userBox.querySelector(".refuse_and_accept");
      inviteBtn = userBox.querySelector(".invite");

      refuseAndAccept.style.display = "flex";
      inviteBtn.style.display = "none";

      inviteBtn.removeEventListener("click", invite);
      refuseAndAccept.children[0].addEventListener("click", refuseInvite);
      refuseAndAccept.children[1].addEventListener("click", acceptInvite);
    }
  })

  recipientsArr.forEach((recipient) => {
    userBox = userListChilds.find((user) => {
      return user.querySelector("p").innerText === recipient;
    })

    if (userBox !== undefined) {
      let cancelOrInviteBtn = userBox.querySelector(".invite");

      cancelOrInviteBtn.innerText = "Отмена";
      cancelOrInviteBtn.classList.remove("invite");
      cancelOrInviteBtn.classList.add("cancel");

      cancelOrInviteBtn.removeEventListener("click", invite);
      cancelOrInviteBtn.addEventListener("click", cancelInvite);
    }
  })
}
function renderUsers() {
  function getUserIcon() {
    let userSvg;

    $.ajax({
      method: "GET",
      async: false,
      url: "/icons/user.svg",
      success(response) {
        userSvg = response.querySelector("svg");
      }
    })

    return userSvg;
  }

  if (userList.children.length !== 0) {
    userList.innerHTML = "";
  }

  for (let user of users) {
    let userBox,
        userIcon = getUserIcon(),
        inviteBtn;

    userBox = $(
      `
        <div class="user_box">
            <div>
                <div class="user_icon">
                    ${userIcon.outerHTML}
                </div>
                
                <p>${user}</p>
            </div>
            
            <div>
                <div class="refuse_and_accept">
                    <div class="refuse">
                        <p>Отказать</p>
                    </div>
                    
                    <div class="accept">
                        <p>Подтвердить</p>
                    </div>
                </div>
            
                <div class="invite">
                    <p>Пригласить на матч</p>
                </div>
            </div>
        </div>
      `
    )[0];

    inviteBtn = userBox.querySelector(".invite");
    inviteBtn.addEventListener("click", invite);

    userList.appendChild(userBox);
  }
}
function clickOnPagBtn(e) {
  switch(e.currentTarget.classList[0]) {
    case "back":
      activePagNum--;
    break;

    case "next":
      activePagNum++;
    break;

    default:
      activePagNum = +e.currentTarget.innerText;
  }

  userList.innerHTML = "";

  checkActivePagNum();
  setPageOffset();

  setTimeout(() => {
    getUsersAndCount();

    setTimeout(() => {
      checkInvitersAndRecipientsArr();
    }, 100);
  }, 100);
}
function setPageOffset() {
  $.ajax({
    method: "POST",
    url: "/lobby/page_offset",
    contentType: "application/json",
    data: JSON.stringify({
      username: username,
      pageOffset: activePagNum
    }),
    error(error) {
      alert(error.responseJSON.msg);
    }
  })
}
function checkActivePagNum() {
  let activeBtn = $(".active")[0],
      pagNum = pagNums.find(btn => btn.innerText === activePagNum);

  if (pagNum !== undefined) {
    activeBtn.classList.remove("active");
    activeBtn.addEventListener("click", clickOnPagBtn);

    pagNum.classList.add("active");
    pagNum.removeEventListener("click", clickOnPagBtn);

    toggleDisabledPag(back, activePagNum !== 1);
    toggleDisabledPag(next, activePagNum !== pagsCount);
  } else {
    activeBtn.classList.remove("active");
    back.classList.remove("disabled_pag");
    next.classList.remove("disabled_pag");

    /*let i = 0;
    while (i < pagNums.length) {
      pagNums[i].style.display = "none";
      pagNums[i].removeEventListener("click", clickOnPagBtn);
      i++;
    }*/

    renderPagBtns();
  }
}
function toggleDisabledPag(pag, condition) {
  if (condition) {
    if (pag.classList.contains("disabled_pag")) {
      pag.classList.remove("disabled_pag");
    }
  } else {
    pag.classList.add("disabled_pag");
  }
}
function checkPagNums() {
  for (let i = 0; i < pagNums.length; i++) {
    if (getComputedStyle(pagNums[i]).display === "flex") {
      pagNums[i].innerText = "";
      pagNums[i].style.display = "none";
      pagNums[i].removeEventListener("click", clickOnPagBtn);
    }
  }
}
function renderPagBtns() {
  let startPag, pagNumInd, endPag;

  toggleDisabledPag(back, activePagNum !== 1);
  toggleDisabledPag(next, activePagNum !== pagsCount);
  checkPagNums();

  pagNumInd = activePagNum % pagNums.length || pagNums.length;
  startPag = activePagNum - (pagNumInd - 1);
  endPag = activePagNum + (pagNums.length - pagNumInd);

  if (endPag > pagsCount) {
    endPag = pagsCount;
  }

  let i = 0;
  while (startPag <= endPag) {
    pagNums[i].innerText = startPag;
    pagNums[i].style.display = "flex";

    if (startPag === activePagNum) {
      pagNums[i].classList.add("active");
    } else {
      pagNums[i].addEventListener("click", clickOnPagBtn);
    }

    i++;
    startPag++;
  }
}
function getPagCount() {
  if (pagsCount === undefined) {
    pagsCount = Math.ceil(userLength / pageSize);
  } else {
    let result = Math.ceil(userLength / pageSize);

    if (pagsCount !== result) {
      pagsCount = result;
    }
  }
}
function getUsername() {
  $.ajax({
    method: "GET",
    async: false,
    url: "/lobby/username",
    success(name) {
      if (name.length !== 0) {
        username = name;
      } else {
        location.href = "/";
      }
    }
  })
}
function addEvent() {
  back.addEventListener("click", clickOnPagBtn);
  next.addEventListener("click", clickOnPagBtn);
}

addEvent();
getUsername();
connect(username);