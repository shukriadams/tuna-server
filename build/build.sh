# when running on a CI system like travis, use switch "--ci"
# when running locally, force clean jspm build with "--jspm"
CI=0
JSPM=0
DOCKERPUSH=0
while [ -n "$1" ]; do 
    case "$1" in
    --ci) CI=1 ;;
    --jspm) JSPM=1 ;;
    --dockerpush) DOCKERPUSH=1 ;;
    esac 
    shift
done

# Setup work folder to build from. This is needed on dev systems where we want to be able to bypass local node modules etc
# We use cp on CI systems because we can't be sure rsync is available there
# NOTE : jspm hits github each time you run a local build. If you do this enough times you'll hit your github rate limit

# to make it easier to test builds without hammering JSPM, flushing is done only when JSPM flag is toggled
if [ $JSPM -eq 1 ]; then
    sudo rm -rf .clone 
fi

mkdir -p .clone &&    
    
if [ $CI -eq 1 ]; then
    # if running on CI system, copy everything from src to .clone folder
    cp -R ./../src .clone/ 
else
    echo "Copying a bunch of stuff, this will likely take a while ...."
    # copy everything from src but exclude 
    if [ $JSPM -eq 1 ]; then
        # exclude node modules, jspm lib and all hidden files in project root
        rsync -v -r --exclude=node_modules --exclude=client/lib --exclude=.* ./../src .clone 
    else
        rsync -v -r --exclude=node_modules --exclude=.* ./../src .clone 
    fi
fi

# build 1: build frontend CSS/JS, and leaves it behind in .clone/src/dist folder. This build will npm install dev modules, which we
# want to delete
docker run -v $(pwd)/.clone:/tmp/tuna shukriadams/node10build:0.0.3 sh -c "cd /tmp/tuna/src && sh ./build-frontend.sh --setup" &&
sudo rm -rf .clone/src/node_modules &&

# build 2: run a second container install, this one npm intalls "production" modules, these we want
docker run -v $(pwd)/.clone:/tmp/tuna shukriadams/node10build:0.0.3 sh -c "cd /tmp/tuna/src && yarn --no-bin-links --ignore-engines --production" &&

# combine artifacts from steps 1 and 2 and zip them
rm -rf .stage &&
mkdir -p .stage &&
mkdir -p .stage/public &&
cp -R .clone/src/dist/client .stage &&
cp -R .clone/src/node_modules .stage &&
cp -R .clone/src/server .stage &&
cp -R .clone/src/scripts .stage &&
cp -R .clone/src/public/css .stage/public &&
cp -R .clone/src/client/media .stage/public &&
cp .clone/src/index.js .stage &&
cp .clone/src/package.json .stage &&
rm -rf .stage/server/reference &&
rm -f node/.stage.tar.gz &&
tar -czvf node/.stage.tar.gz .stage &&

# build 3: Build the final container, using the zip. We do this in a subfolder so we can limit the size of the docker build context,
# else docker will pass in everything in current folder 
cd node
docker build -t shukriadams/tuna-server . &&
cd -

if [ $DOCKERPUSH -eq 1 ]; then
    TAG=$(git describe --tags --abbrev=0) &&
    docker login -u $DOCKER_USER -p $DOCKER_PASS &&
    docker tag shukriadams/tuna-server:latest shukriadams/tuna-server:$TAG &&
    docker push shukriadams/tuna-server:$TAG 
fi

echo "Build complete"