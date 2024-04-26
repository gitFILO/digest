const DEVELOP_URL = "http://localhost:3000"
const DEPLOY_URL = "https://digest-jungle.site"

const newVideoLoaded = async (checked) => {
  let youtubeLeftControls =
    document.getElementsByClassName("ytp-left-controls")[0];

  const BUTTON_ID = "digestBookmarkButton";

  let existingButton = document.getElementById(BUTTON_ID);

  if (checked) {
    if (!existingButton) {
      const digestButton = document.createElement("img");
      digestButton.src = chrome.runtime.getURL("/assets/d-icon.png");
      digestButton.className = "ytp-button " + "bookmark-btn";
      digestButton.title = "Click to bookmark current timestamp";
      digestButton.id = BUTTON_ID;
      digestButton.addEventListener("click", addVideoEventHandler);

      if (youtubeLeftControls) {
        youtubeLeftControls.appendChild(digestButton);
      }
    }
  } else {
    if (existingButton && youtubeLeftControls.contains(existingButton)) {
      youtubeLeftControls.removeChild(existingButton);
    }
  }
};

const addVideoEventHandler = async () => {
  const currentUrl = window.location.href;
  // console.log("Current URL:", currentUrl); // 이놈 수정
  const get_v = currentUrl.split("?v=");
  const get_v_id = get_v[1];

  // console.log("??????????????????? get_v_id = ", get_v_id);
  //window.open('http://localhost:3000/playground-ai?v='+get_v_id, 'CodeGPT');

  // TODO: videoUrl 부터 보내 보고 잘 되면 유저에 대한 정보나 쿠키를 보내서 유효성을 확인하는 식으로 확장 하기
  sendYoutubeUrl(`${DEVELOP_URL}/api/extension`, {
    videoUrl: get_v_id,
  });
};

let hideTimeout;
function onMouseOverHandler() {
  clearTimeout(hideTimeout);
  showExtensionIcon(this);
}

function onMouseOutHandler() {
  hideTimeout = setTimeout(() => hideExtensionIcon(), 4000);
}

function onMouseOverTargetHandler() {
  clearTimeout(hideTimeout);
  showTargetExtensionIcon(this);
}

const applyTargetEventListeners = (element) => {
  element.addEventListener("mouseover", onMouseOverTargetHandler);
  element.addEventListener("mouseout", onMouseOutHandler);
};

const applyEventListeners = (element) => {
  element.addEventListener("mouseover", onMouseOverHandler);
  element.addEventListener("mouseout", onMouseOutHandler);
};

const removeEventListeners = (element) => {
  element.removeEventListener("mouseover", onMouseOverHandler);
  element.removeEventListener("mouseout", onMouseOutHandler);
};

const initializeExtensionIconOnHover = (checked) => {
  // console.log("initialExHover:", checked);
  const targetElements = document.querySelectorAll(
    "#contents > ytd-rich-item-renderer"
  );
  const searchElements = document.querySelectorAll(
    "#contents > ytd-video-renderer"
  );
  const otherElements = document.querySelectorAll(
    "#items > ytd-video-renderer"
  );

  if (checked) {
    targetElements.forEach((element) => applyTargetEventListeners(element));
    searchElements.forEach((element) => applyEventListeners(element));
    otherElements.forEach((element) => applyEventListeners(element));
    // console.log("apply button");
  } else {
    targetElements.forEach((element) => removeEventListeners(element));
    searchElements.forEach((element) => removeEventListeners(element));
    otherElements.forEach((element) => removeEventListeners(element));
    // console.log("not apply button");
  }
  const targetContainer = document.querySelector("#contents");
  // if (!targetContainer) return;

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const newTargetElements = node.querySelectorAll(
            "ytd-rich-item-renderer"
          );
          if (checked)
            newTargetElements.forEach((newElement) =>
              applyEventListeners(newElement)
            );
          else
            newTargetElements.forEach((newElement) =>
              removeEventListeners(newElement)
            );
        }
      });
    });
  });

  const config = { childList: true, subtree: true };
  observer.observe(targetContainer, config);
};

const showExtensionIcon = (element) => {
  if (window.location.href == "https://www.youtube.com/") {
    showTargetExtensionIcon(element);
    return;
  }
  let extensionIcon = document.getElementById("extension-icon");
  if (!extensionIcon) {
    extensionIcon = document.createElement("img");
    extensionIcon.id = "extension-icon";
    extensionIcon.src = chrome.runtime.getURL("/assets/d-icon.png"); // 확장 아이콘 경로
    extensionIcon.style.position = "absolute";
    extensionIcon.style.zIndex = "1000";
    extensionIcon.style.cursor = "pointer";
    extensionIcon.style.width = "50px"; // 아이콘 크기 조정
    extensionIcon.style.height = "50px"; // 아이콘 크기 조정
    document.body.appendChild(extensionIcon);
  }

  // 이전에 추가된 이벤트 리스너를 제거
  extensionIcon.removeEventListener("click", extensionIcon.clickEventListener);

  extensionIcon.clickEventListener = () => {
    const videoUrl = element.querySelector("a#thumbnail").href;

    const get_v = videoUrl.split("?v=");

    const get_v_id = get_v[1];
    // console.log(get_v_id);
    //window.open('http://localhost:3000/playground-ai?v='+get_v_id, 'CodeGPT');
    //
    // TODO: videoUrl 부터 보내 보고 잘 되면 유저에 대한 정보나 쿠키를 보내서 유효성을 확인하는 식으로 확장 하기
    sendYoutubeUrl(`${DEVELOP_URL}/api/extension`, {
      videoUrl: get_v_id,
    });

    extensionIcon.classList.add("icon-animate");
    extensionIcon.addEventListener(
      "animationend",
      () => {
        extensionIcon.classList.remove("icon-animate");
      },
      { once: true }
    );
  };
  extensionIcon.addEventListener("click", extensionIcon.clickEventListener);

  const rect = element.getBoundingClientRect();
  extensionIcon.style.top = `${rect.top + window.scrollY - 15}px`;
  extensionIcon.style.left = `${rect.right + window.scrollX - 10}px`; // 아이콘 위치 조정
  extensionIcon.style.display = "block";
};

const showTargetExtensionIcon = (element) => {
  let extensionIcon = document.getElementById("extension-icon-target");
  if (!extensionIcon) {
    extensionIcon = document.createElement("img");
    extensionIcon.id = "extension-icon-target";
    extensionIcon.src = chrome.runtime.getURL("/assets/d-icon.png"); // 확장 아이콘 경로
    extensionIcon.style.position = "absolute";
    extensionIcon.style.zIndex = "2000";
    extensionIcon.style.cursor = "pointer";
    extensionIcon.style.width = "30px"; // 아이콘 크기 조정
    extensionIcon.style.height = "30px"; // 아이콘 크기 조정
    document.body.appendChild(extensionIcon);
  }

  // 이전에 추가된 이벤트 리스너를 제거
  extensionIcon.removeEventListener("click", extensionIcon.clickEventListener);

  extensionIcon.clickEventListener = () => {
    const videoUrl = element.querySelector("a#thumbnail").href;
    // 콘솔이 아니라 fetch로 백으로 보내야함
    const get_v = videoUrl.split("?v=");

    const get_v_id = get_v[1];
    console.log(get_v_id); 
    //window.open('http://localhost:3000/playground-ai?v='+get_v_id, 'CodeGPT');
    //
    // TODO: videoUrl 부터 보내 보고 잘 되면 유저에 대한 정보나 쿠키를 보내서 유효성을 확인하는 식으로 확장 하기
    sendYoutubeUrl(`${DEVELOP_URL}/api/extension`, {
      videoUrl: get_v_id,
    });

    extensionIcon.classList.add("icon-animate");
    extensionIcon.addEventListener(
      "animationend",
      () => {
        extensionIcon.classList.remove("icon-animate");
      },
      { once: true }
    );
  };
  extensionIcon.addEventListener("click", extensionIcon.clickEventListener);

  const rect = element.getBoundingClientRect();
  extensionIcon.style.top = `${rect.top + window.scrollY - 35}px`;
  extensionIcon.style.left = `${rect.right + window.scrollX - 31}px`; // 아이콘 위치 조정
  extensionIcon.style.display = "block";
};

const hideExtensionIcon = () => {
  const extensionIcon = document.getElementById("extension-icon");
  if (extensionIcon) {
    extensionIcon.style.display = "none";
  } else {
    const extensionIcon = document.getElementById("extension-icon-target");
    extensionIcon.style.display = "none";
  }
};

chrome.storage.sync.get(["featureEnabled"], function (result) {
  let checked = result.featureEnabled;
  if (checked) {
    initializeExtensionIconOnHover(checked);
    newVideoLoaded(checked);
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "toggleChanged") {
    initializeExtensionIconOnHover(request.status);
    newVideoLoaded(request.status);
  }
});

function sendYoutubeUrl(url, data) {
  return postData(url, data);
}

async function extractContents() {
  const currentUrl = window.location.href;
  let sendData = contentSelect();
  let data = {
    url: currentUrl,
    contents: sendData,
  };
  postData(`${DEVELOP_URL}/api/extension`, data);

  return;
}

async function postData(url = "", data = {}) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  };

  const response = await fetch(url, requestOptions);

  return response; 
}

function getAllText(element) {
  const skipTags = ["SCRIPT", "STYLE", "CODE"];
  const skipClasses = ["office_preference"]; 

  let text = "";
  for (const child of element.childNodes) {
    if (
      child.nodeType === Node.ELEMENT_NODE &&
      (skipTags.includes(child.tagName) ||
        skipClasses.some((cls) => child.classList.contains(cls)))
    ) {
      continue; 
    }

    if (child.nodeType === Node.TEXT_NODE) {
      const trimmedText = child.textContent.trim();
      if (trimmedText.length >= 10) {
        text += trimmedText + "\n";
      }
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      text += getAllText(child);
    }
  }
  return text;
}

function contentSelect() {
  const allText = getAllText(document.body); 

  return allText;
}

function createButton() {
  const button = document.createElement("digest");
  button.id = "digestButton";
  button.style =
    'position: fixed; width:100px; height:100px; top: 40px; right: 10px; z-index: 1000; background-image: url("' +
    chrome.runtime.getURL("assets/d-icon.png") +
    '"); background-size: contain; background-color: transparent;';
  button.style.transition = "transform 0.5s ease";
  document.body.appendChild(button);

  button.addEventListener("click", extractContents);
}

if (!window.location.href.includes("www.youtube.com")) {
  //createButton();
}
