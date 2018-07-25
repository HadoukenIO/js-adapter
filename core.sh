# CORE_PATH - path of the core dir
# TARBALL_NAME - tarball file name
# HODUKEN_DIR - js-adapter folder path

npm pack
TARBALL_NAME=$(ls hadouken-js-adapter-* -t | head -1)
ADAPTER_DIR=$(pwd)

if [ ! -z "$CORE_PATH" ]; then
    cd $CORE_PATH
else
    rm core -rf
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
echo Finished! .asar was created in $(pwd)
read -n 1 -s -r -p "Press any key to exit"
