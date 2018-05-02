<!doctype html>
<head>
    <title>$Title</title>
    <% base_tag %>
    <meta charset="utf-8" />
    <link rel="icon" href="/favicon.ico" type="image/x-icon" />
    <meta name="description" content="$MetaDescription.ATT" />
    <meta name="robots" content="NOODP, all, index, follow" />
    <meta name="googlebot" content="NOODP, all, index, follow" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <link href="https://fonts.googleapis.com/css?family=Voces" rel="stylesheet" type="text/css" />
     <link rel="stylesheet" type="text/css" href="presentation/css/Presentation.min.css">
<body>
    <div id="page" class="hidden">
        <main id="wrapper">
            <div id="message">
                <p id="inner"></p>
                <p id="hidden">
                    $SplashMessageClean
                </p>
            </div>
            <img src="$BackgroundImage.URL" alt="$BackgroundImage.Title.ATT" />

        </main>
        <nav>
            <ul>
                <li class="nnw" id="home"><a href="/" title="Back to main site">×</a></li>
                <% if $Website %>
                    <li id="current-site" class="nne"><a href="$Website.URL" data-alternative-text="↖" title="Live Site">↘</a></li>
                <% end_if %>
                <% if $PreviousPage %><li class="wnw" id="previous"><a href="$PreviousPage.Link" title="Previous: $PreviousPage.Title.ATT">↫</a></li><% end_if %>
                <% if $NextPage %><li class="ese" id="next"><a href="$NextPage.Link" title="Next: $NextPage.Title.ATT">↪</a></li><% end_if %>
            </ul>
        </nav>
    </div>
    <div id="loading" class="show"><div id="load-inner">$StartSlogan</div></div>
    <script src="framework/thirdparty/jquery/jquery.min.js"></script>
    <script src="presentation/javascript/presentation.min.js"></script>
    <script>
        ticker.imageLinkArray = ['$BackgroundImage.URL'];
        ticker.textWithHTML = '$SplashMessageClean';
        ticker.imageObjectArray = ['$BackgroundImage.URL'];
    </script>
    <% if $Website %><iframe onload="this.width=screen.width;" height="1" src="$Website.URL"></iframe><% end_if %>
</body>
</html>
