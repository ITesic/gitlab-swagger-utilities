chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);

      const url = cleanUrl(window.location.href);

      if (isMaybeContract(url)) {
        initSwaggerViewer(rawContractUrl(url), "swagger-viewer");
      }
    }
  }, 100);
});

/**
 * Initialize swagger viewer on GitLab page
 *
 * @param contractUrl String, url to .yaml or .json contract file
 * @param swaggerViewerId String, ID of the DOM element where swagger ui will be rendered
 */
function initSwaggerViewer(contractUrl, swaggerViewerId) {
  const $fileHolder = document
    .getElementById("blob-content-holder")
    .getElementsByClassName("file-holder")[0];
  const $fileActions = $fileHolder.getElementsByClassName("file-actions")[0];

  // Swagger preview button
  const swaggerPreviewButton = createSwaggerPreviewButton(
    `<i aria-hidden="true" data-hidden="true" class="fa fa-eye"></i> Swagger`,
    "#"
  );
  attachSwaggerPreviewButton(swaggerPreviewButton, $fileActions);
  swaggerPreviewButton.addEventListener("click", function(e) {
    e.preventDefault();
    toggleSwaggerPreview($fileHolder);
  });

  // Swagger preview container
  const swaggerContainer = createSwaggerContainer(swaggerViewerId);
  attachSwaggerContainer(swaggerContainer, $fileHolder);

  renderSwaggerUI(contractUrl, `#${swaggerViewerId}`);
}

function createSwaggerPreviewButton(text, url, classes) {
  let link = document.createElement("a");
  link.innerHTML = text;
  link.setAttribute("id", "swagger-preview-btn");
  link.setAttribute("rel", "noopener noreferrer");
  link.setAttribute("title", "Preview swagger");
  link.setAttribute("data-container", "body");
  link.setAttribute("href", url);
  link.setAttribute(
    "class",
    "btn btn-sm has-tooltip " + classes || ""
  );

  return link;
}

function attachSwaggerPreviewButton(button, $fileActions) {
  $fileActions.prepend(button);
}

function createSwaggerContainer(id) {
  const swaggerContainer = document.createElement("div");
  swaggerContainer.setAttribute("class", "swagger-viewer");
  swaggerContainer.setAttribute("id", id);
  return swaggerContainer;
}

function attachSwaggerContainer(swaggerContainer, $fileHolder) {
  $fileHolder.appendChild(swaggerContainer);
}

function toggleSwaggerPreview($fileHolder) {
  if (isSwaggerPreviewOn($fileHolder)) {
    swaggerPreviewOff($fileHolder);
  } else {
    swaggerPreviewOn($fileHolder);
  }
}

function isSwaggerPreviewOn($fileHolder) {
  return $fileHolder.classList.contains("swagger-preview-on");
}

function swaggerPreviewOn($fileHolder) {
  $fileHolder.classList.add("swagger-preview-on");
  try {
    let $buttonIcon = document.getElementById("swagger-preview-btn").getElementsByClassName("fa")[0];
    $buttonIcon.classList.remove("fa-eye");
    $buttonIcon.classList.add("fa-eye-slash");
  } catch (e) { console.error(e)}
}

function swaggerPreviewOff($fileHolder) {
  $fileHolder.classList.remove("swagger-preview-on");
  try {
    let $buttonIcon = document.getElementById("swagger-preview-btn").getElementsByClassName("fa")[0];
    $buttonIcon.classList.remove("fa-eye-slash");
    $buttonIcon.classList.add("fa-eye");
  } catch (e) {console.error(e)}
}

function rawContractUrl(url) {
  return url.replace("/blob/", "/raw/");
}

function isMaybeContract(url) {
  const extension = url.split(".").pop();
  return extension == "yaml" || extension == "json";
}

function cleanUrl(url) {
  let lastChar = url.slice(-1);
  if (lastChar == "#" || lastChar == "/") {
    return url.slice(0, -1);
  }
  return url;
}

function renderSwaggerUI(url, domId) {
  // Begin Swagger UI call region
  const ui = SwaggerUIBundle({
    url: url,
    dom_id: domId,
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis
      // SwaggerUIStandalonePreset
    ],
    plugins: [
      // SwaggerUIBundle.plugins.DownloadUrl
    ]
    // layout: "StandaloneLayout"
  });
  // End Swagger UI call region

  window.ui = ui;
}
