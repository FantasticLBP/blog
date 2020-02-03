let path = require("path"),
    fs = require("fs")

let blogs = {
    iOS: '/Users/lbp/Desktop/Github/knowledge-kit/Chapter1 - iOS',
    WebFrontEnd: '/Users/lbp/Desktop/Github/knowledge-kit/Chapter2 - Web FrontEnd',
    Server: '/Users/lbp/Desktop/Github/knowledge-kit/Chapter3 - Server',
    Database: '/Users/lbp/Desktop/Github/knowledge-kit/Chapter4 - DataBase',
    Network: '/Users/lbp/Desktop/Github/knowledge-kit/Chapter5 - Network',
    DesignPattern: '/Users/lbp/Desktop/Github/knowledge-kit/Chapter6 - Design Pattern',
    Finance: '/Users/lbp/Desktop/Github/knowledge-kit/Chapter8 - Finance',
    GeekTalk: '/Users/lbp/Desktop/Github/knowledge-kit/Chapter7 - Geek Talk'
}

let blogPath = '/Users/lbp/Desktop/Github/Blog/source/_posts'
let tags = {
    iOS: 'iOS',
    WebFrontEnd: 'FrontEnd',
    Server: 'Server',
    Database: 'Database',
    Network: 'Network',
    DesignPattern: 'DesignPattern',
    Finance: 'Finance',
    GeekTalk: 'GeekTalk'
}

// 文件夹下面的 Chatper5.md 和 .DS_Store 属于不合格文件路径
function filenameIsInvalidate (filename) {
    return (String(filename).toLocaleLowerCase().indexOf('.DS_Store') == 0 || String(filename).toLocaleLowerCase().indexOf('chapter') == 0 )
}

function createBlogFile (index) {
    let fullFilePath = path.join(blogPath, `${index}.md`)
    return fullFilePath
}

function start () {
    let errorBlogs = new Array()
    let index = 0
    for (const key in blogs) {
        if (blogs.hasOwnProperty(key)) {
            const dirPath = blogs[key];
            let tagName = tags[key]

            fs.readdir(dirPath, function(err, files) {
                if (err) {
                    console.log(`☠️☠️☠️  当前文件夹${key}， 出错原因${err}`)
                } else {
                    files.forEach(function(filename){
                        var subFilePath = path.join(dirPath, filename)
                        if (!filenameIsInvalidate(filename)) {
                            fs.readFile(subFilePath, "utf-8", function(err,data){
                                if (err) {
                                    console.log(`☠️☠️☠️ 当前文件${subFilePath}， 出错原因${err}`)
                                } else {
                                    let firstIndex = data.indexOf('#')
                                    if (firstIndex > -1) {

                                        let content = data.trim()
                                        
                                        // 每个博客 md 文件按照换行符拆分为多行
                                        let rowsContent = content.split('\n')   
                                        let articleTitle = rowsContent[0].replace(new RegExp('# ', 'g'), "")
                                        
                                        // es6 `` 多行字符串换行，利用模版插入之后还是会有前面的空格
                                        const lineBreakSymbol = '\n'
                                        let insertTagString = `${lineBreakSymbol
                                        }---${lineBreakSymbol
                                        }title: ${articleTitle}${lineBreakSymbol
                                        }tag: ${tagName}${lineBreakSymbol
                                        }---`

                                        /*
                                         将每个 md 文件以 \n 拆分为数组后，在数组第一个元素的地方插入 hexo 博客系统需要的信息.如下
                                         ---
                                         title: xxx
                                         tag: iOS
                                         ---
                                        */
                                        rowsContent.shift()
                                        rowsContent.splice(0, 0, insertTagString)  
                                        
                                        // 将剩余的数组里面的文章内容用换行符拼接起来
                                        let articleContent = rowsContent.join('\n')
                                        
                                        // markdown 博客里面有写字符串组合会和 hexo 模版引擎造成冲突，会报错。将冲突字符串进行正则检验替换
                                        articleContent = articleContent.replace(new RegExp('{{', 'g'), "{ {").replace(new RegExp('}}', 'g'), "} }")
                                       
                                        // 将格式组装好的日志文件写入到指定的博客系统所在文件夹
                                        fs.writeFile(createBlogFile(`${tagName}-${index}`), articleContent, function(err){
                                            if (err) {
                                                errorBlogs.push({name: articleTitle, filepath: subFilePath})
                                            }
                                        })
                                        index++

                                    } else {
                                        console.log(`☠️☠️☠️ 当前文档没有${filename} title`)
                                    }
                                }
                            })
                        } 
                    })
                }
            })
        }
    }
    if (errorBlogs.length > 0) {
        console.log(`部分博客迁移失败，失败的有：${errorBlogs}`)
    } else {
        console.log(`🎉 博客全部迁移成功`)
    }
}


start()