#################################################################################
# Builds frontend (JS + SASS), outputs to ./dist folder. 
# Switches :
# --setup (enables full setup, you don't need this when doing local dev builds)
# --version (writes current version to fill, not needed on local dev)
#################################################################################
# capture switches
SETUP=0
VERSION=0
while [ -n "$1" ]; do 
    case "$1" in
    -s|--setup) SETUP=1 ;;
    -v|--version) VERSION=1 ;;
    esac 
    shift
done

if [ $SETUP -eq 1 ]; then
    yarn --no-bin-links --ignore-engines
    npm rebuild node-sass --no-bin-links
    jspm install -y
fi

# clear out folder
rm -rf ./dist


# get current tag, this will be used to populate a version value that is visible in the client 
if [ $VERSION -eq 1 ]; then
    TAG=$(git describe --abbrev=0 --tags) &&
    echo "{\"version\": \"$TAG\"}" > client/app/version.json
fi


# build and minify CSS - this unlike js build doesn't go directly to dist folder because we use the same
# sass stage for local dev, so outout folder is local dev ./public
node ./build/build-all-sass && minify ./public/css/style.css > ./public/css/style.min.css


# build and minify JS - this requires cd'ing into jspm relative folder. 
# note that --minify option for jspm fails with ES6, we use uglifyJS instead
cd client/app/
jspm bundle-sfx main/main.js ../../dist/client/app/bundle.js
cp config.js ../../dist/client/app/config.js
cd -

# wait for bundle to appear, it can take its time
while [ ! -f ./dist/client/app/bundle.js ]
do
  echo "waiting for file ... "
  sleep 2
done

uglifyjs -c -v -o ./dist/client/app/bundle.min.js -- ./dist/client/app/bundle.js
uglifyjs -c -v -o ./dist/client/app/config.min.js -- ./dist/client/app/config.js
