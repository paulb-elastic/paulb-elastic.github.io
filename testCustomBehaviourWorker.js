

self.addEventListener('fetch', event => {
  const { request } = event;
  const requestUrl = new URL(request.url);

  if (event.request.url.indexOf('redBox.png') > -1) {
    let ttfb = requestUrl.searchParams.getAll('ttfb');
    event.respondWith(loadDelayedImage(ttfb));
  }
  else if (event.request.url.indexOf('text.html') > -1) {
    let textContentDownload = requestUrl.searchParams.getAll('textContentDownload');
    event.respondWith(
      new Response(generateChunkedResponse(textContentDownload), {
        headers: {
          "Content-Type": "text/html",
          "Transfer-Encoding": "chunked"
        }
      })
    );
  }
  else if (event.request.url.indexOf('customHTTPresponse.png') > -1) {
    let httpResponse = requestUrl.searchParams.getAll('httpResponse');
    event.respondWith(makeHTTPrequestWithResponseCode(httpResponse));
  }
  else if (event.request.url.indexOf('redirect301.png') > -1 || event.request.url.indexOf('redirect302.png') > -1) {
    let redirectTimes = parseInt(requestUrl.searchParams.getAll('redirectTimes'));
    let redirectInstance = parseInt(requestUrl.searchParams.getAll('redirectInstance'));
    if (!isNaN(redirectTimes) && !isNaN(redirectInstance)) {
      let redirectType = 301;
      if (event.request.url.indexOf('redirect302.png') > -1) {
        redirectType = 302;
      }
      event.respondWith(makeHTTPredirectRequest(redirectType, redirectTimes, redirectInstance));
    }
  }
});

function generateChunkedResponse(textContentDownload) {
  return new ReadableStream({
    start(controller) {
      const text = "Hello, World!";
      let index = 0;
      const startedAt = Date.now();
      const finishAt = startedAt + parseInt(textContentDownload);

      function pushChunk() {
        if (Date.now() < finishAt) {
          const chunk = text[index];
          controller.enqueue(new TextEncoder().encode("."));
          index++;
          setTimeout(pushChunk, 10);
        } else {
          controller.close();
        }
      }
      pushChunk();
    }
  });
}

function loadDelayedImage(ttfb) {
  const dataUrlRedBox = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAJOgAACToAYJjBRwAAAGESURBVHhe7dIhAQAgEAAxemDp34wMTwnOTazB1t1n4DexSIhFQiwSYpEQi4RYJMQiIRYJsUiIRUIsEmKREIuEWCTEIiEWCbFIiEVCLBJikRCLhFgkxCIhFgmxSIhFQiwSYpEQi4RYJMQiIRYJsUiIRUIsEmKREIuEWCTEIiEWCbFIiEVCLBJikRCLhFgkxCIhFgmxSIhFQiwSYpEQi4RYJMQiIRYJsUiIRUIsEmKREIuEWCTEIiEWCbFIiEVCLBJikRCLhFgkxCIhFgmxSIhFQiwSYpEQi4RYJMQiIRYJsUiIRUIsEmKREIuEWCTEIiEWCbFIiEVCLBJikRCLhFgkxCIhFgmxSIhFQiwSYpEQi4RYJMQiIRYJsUiIRUIsEmKREIuEWCTEIiEWCbFIiEVCLBJikRCLhFgkxCIhFgmxSIhFQiwSYpEQi4RYJMQiIRYJsUiIRUIsEmKREIuEWCTEIiEWCbFIiEVCLBJikRCLhFgkxCIhFgmxSIhFQiwSYpEQi8CZB2l/lm/9p912AAAAAElFTkSuQmCC";
  return new Promise(resolve => {
    setTimeout(() => {
      fetch(dataUrlRedBox)
        .then(response => {
          if (response.ok) {
            return response.blob();
          }
          throw new Error('Image fetch failed.');
        })
        .then(blob => {
          const contentType = 'image/png';
          resolve(new Response(blob, { headers: { 'Content-Type': contentType } }));
        })
        .catch(error => {
          console.error(error);
          resolve(new Response('', { status: 404 }));
        });
    }, parseInt(ttfb));
  });
}

function makeHTTPrequestWithResponseCode(responseCode) {
  return new Promise(resolve => {
    resolve(new Response('', { status: parseInt(responseCode) }));
  });
};

function makeHTTPredirectRequest(redirectType, redirectTimes, redirectInstance) {
  if (redirectInstance <= redirectTimes) {
    return new Promise(resolve => {
      resolve(
        new Response('', {
          status: parseInt(redirectType),
          headers: {
            'Location': 'redirect' + redirectType + '.png?redirectTimes=' + redirectTimes + '&redirectInstance=' + ++redirectInstance,
            'Content-Type': 'image/png'
          }
        })
      );
    });
  }
  else {
    if (redirectType == 301) {
      return fetch('redBox.png');
    }
    else {
      return fetch('blueBox.png');
    }
  }
};



