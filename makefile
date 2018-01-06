all:
	node build.js
	electron-forge make --platform=linux --arch=ia32,x64