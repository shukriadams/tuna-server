# Nextcloud

## Getting OAUTH keys on a dev environment

If you're running on localhost and want to test your integration on a live Nextcloud server, do the following

    1. If you haven't already, login to your Nextcloud server as admin, go to Settings > Security, and create an oauth2 app. Copy its client id and secret. If different, then log in as the user you intend to share music as. 

    2. If you haven't already, ensure that your local Tuna server is running and configured. Ensure the following variables are set (host is the full base URL of your NextCloud server, egs. "https://next.example.com"

        nextCloudClientId
        nextCloudSecret
        nextCloudHost

    3. Add your Nextcloud server url and client identifier to the following URL

            https://{NEXTCLOUDHOST}/index.php/apps/oauth2/authorize?response_type=code&client_id={NEXTCLOUD_CLIENT_ID}&state=somethingrandom&redirect_uri=https://{DEFINITELY_BOGUS_URL}

    Change {NEXTCLOUDHOST}, {NEXTCLOUD_CLIENT_ID} AND {DEFINITELY_BOGUS_URL} - the latter should be a URL you know doesn't exist. Paste the resulting URL into a browser address bar to start the OAUTH flow. Authorize the request in Nextcloud - this will attempt to redirect to the bogus url and stall there. Copy the "code" querystring value that should now be in your browser address bar

    4. Open a console window in your Tuna source code 

        cd /src/scripts
        node nextcloud-codeToToken --code {YOUR-CODE-HERE}

    substituting in the code you got from your browser. This should swap the code for a token and persist this in your Tuna server. You will now be able to access your shared music on NextCloud, and Tuna will keep the token updated forever. Note that if you delete the authorization on either NextCloud or on Tuna, you'll need to repeat this entire process.


