### Concept

These files cannot be hosted and served directly from GitHub pages because they need to:
* Run from apache with PHP installed
* Apache configured with no gzip compression

This is so that the [chunkedResponse.php](chunkedResponse.php) page can behave in a particular way, where we control when the first byte of the response is sent (TTFB) as well as how long the download takes.

Without gzip compression disabled, apache will cache the response before compressing it and returning it to the browser.  In this example, we want the response of the download to the browser to continually happen (chunked) for as long as has been configured.

