CORE_PATH=$1
CORE_DEST=$2

# CORE_DEST - optional parameter contanining destination path of asar
# CORE_PATH - path of the core dir
# TARBALL_NAME - tarball file name
# HODUKEN_DIR - js-adapter folder path

npm pack
TARBALL_NAME=$(ls hadouken-js-adapter-* -t | head -1)
ADAPTER_DIR=$(pwd)

if [ ! -z "$CORE_PATH" ]; then
    echo Building core found at $CORE_PATH
    cd $CORE_PATH
else
    rm core -rf
    echo Pulling develop core from GitHub
    git clone https://github.com/HadoukenIO/core.git
    cd core
    CORE_PATH=$(pwd)
fi

npm install
cp $ADAPTER_DIR/$TARBALL_NAME ./
npm install $TARBALL_NAME
npm install openfin-sign
npm run build
cd out

if [ ! -z "$CORE_DEST" ]; then
    cp *.asar $CORE_DEST
    echo Finished! .asar was created in $(pwd) and copied into $CORE_DEST
else
    echo Finished! .asar was created in $(pwd)
fi


read -n 1 -s -r -p "Press any key to exit"
