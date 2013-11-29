yjjapp
======

演讲家App
------
一个连接讲端和听端，催化各类互动环节的演讲应用
- 3dobe, 2013软件设计大赛
- 16-308 @ WYU

使用说明
------
1. 安装Node.js(v0.10.22以上) 网址 http://nodejs.org/download/
2. 命令行下进入该项目目录下
	cd yjjapp
3. 安装服务器端依赖库
	npm install
4. 安装网页端依赖库
	npm install -g bower
	cd public
	bower install
5. 启动服务
	node app
6. 随后在浏览器打开 http://localhost:3088/ 进行浏览