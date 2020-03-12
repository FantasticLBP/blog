## 个人博客系统

本来是用 Markdown 写作，提交到 Github 某个 repo 作为博客的，后来想想还是不够方便，便有了该项目。

采用 HEXO 方便处理 md 文件；自己的编写的样式；开发了 Node 脚本，将 [knowledge-kit](https://github.com/FantasticLBP/knowledge-kit) 这个 repo 中的博客文件，按照需要的格式迁移到 hexo source 目录下。
需要的可以直接下载 clone，修改下代码路径。代码里面有注释。


### 使用

``` shell
node migrate.js
hexo clean
hexo g
hexo d
```