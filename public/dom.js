

$(()=>{

  

    const form= `<form action="/" method="POST">
                    
                    <textarea class="body"  name="text"></textarea><br>
                    <textarea class="textarea-tags" name="tags" placeholder="tags"></textarea><br>
                    <input type="submit" value="  click  ">
                    <input type="submit" value="send" formaction="/send">
                    <input type="submit" value="cancel" formaction="/cancel">
                    <select name="color">
                        <option value="w" selected>w</option>
                        <option value="r">r</option>
                        <option value="y">y</option>
                        <option value="g">g</option>
                        <option value="p">p</option>
                        <option value="b">b</option>
                    </select>
                </form>
                `
    
    
    $('#trigger').one('click',(e)=> {
    $(e.target).addClass('form-format')
    $(e.target).html(form)
    })



    $('#searchtrigger').one('click',(e)=> {
        console.log($(e.target).attr('class'))
        let split = $(e.target).attr('class').split('-')
        console.log(split)
        let tag = split[0]
        console.log(tag)
        $(e.target).addClass('form-format')
        const searchForm= `<form action="/searchcreate" method="POST">   
                <textarea class="body"  name="text"></textarea><br>
                <textarea class="textarea-tags" name="tags" placeholder="tags"></textarea><br>
                <input type="submit" value="  click  ">
                <input type="submit" value="send" formaction="/searchysend">
                <input type="submit" value="cancel" formaction="/search">
                <select name="color">
                    <option value="w" selected>w</option>
                    <option value="r">r</option>
                    <option value="y">y</option>
                    <option value="g">g</option>
                    <option value="p">p</option>
                    <option value="b">b</option>
                </select>
                <input type="hidden" name="search" value="${tag}"/>
            </form>
            `
        $(e.target).html(searchForm)
        })
    
        $('.searchclicked').one('click', (e) => {
            let split = $(e.target).attr('class').split('-')
            let tag = split[0]
            let letter = $(e.target).attr('class')[$(e.target).attr('class').length - 1]
            $(e.target).addClass('form-format')
            const formd = `<form action="searchupdate?_method=PUT" method="POST">
                                <textarea class="body" name="text">${$(`#${$(e.currentTarget).attr('id')}text`).text().trim()}</textarea>
                                <br>
                                <textarea class="textarea-tags" name="tags" placeholder="tags">${$(`#${$(e.currentTarget).attr('id')}tags`).text().trim()}</textarea><br>
                                <input type="submit" value="  click  ">
                                <input type="submit" value="send" formaction="/searchupsend">
                                <input type="submit" value="delete" formaction="/searchdelete?_method=DELETE">
                                <select name="color">
                                    <option value="w">w</option>
                                    <option value="r">r</option>
                                    <option value="y">y</option>
                                    <option value="g">g</option>
                                    <option value="p">p</option>
                                    <option value="b">b</option>
                                    <option value=${letter} selected>${letter}</option>
                                </select>
                                <input type="hidden" name="search" value="${tag}"/>
                                <input type="hidden" name="id" value="${$(e.currentTarget).attr('id')}"/>
                            </form>`
            $(e.currentTarget).html(formd)
        })
    

    $('.clicked').one('click', (e) => {
        let letter = $(e.target).attr('class')[$(e.target).attr('class').length - 1]
        $(e.target).addClass('form-format')
        const formd = `<form action="/${$(e.currentTarget).attr('id')}?_method=PUT" method="POST">
                            <textarea class="body" name="text">${$(`#${$(e.currentTarget).attr('id')}text`).text().trim()}</textarea>
                            <br>
                            <textarea class="textarea-tags" name="tags" placeholder="tags">${$(`#${$(e.currentTarget).attr('id')}tags`).text().trim()}</textarea><br>
                            <input type="submit" value="  click  ">
                            <input type="submit" value="send" formaction="/send/upsend/${$(e.currentTarget).attr('id')}">
                            <input type="submit" value="delete" formaction="/${$(e.currentTarget).attr('id')}?_method=DELETE">
                            <select name="color">
                                <option value="w">w</option>
                                <option value="r">r</option>
                                <option value="y">y</option>
                                <option value="g">g</option>
                                <option value="p">p</option>
                                <option value="b">b</option>
                                <option value=${letter} selected>${letter}</option>
                            </select>
                        </form>`
        $(e.currentTarget).html(formd)
    })

    $('.public-click').one('click',(e)=> {
        let letter = $(e.target).attr('class')[$(e.target).attr('class').length - 1]
        $(e.target).addClass('form-format')
        const formd = `<form action="/publicupload" method="POST">
                        <textarea class="body" name="text" readonly>${$(`#${$(e.currentTarget).attr('id')}text`).text().trim()}</textarea>
                        <br>
                        <textarea class="textarea-tags" name="tags" placeholder="tags" readonly>${$(`#${$(e.currentTarget).attr('id')}tags`).text().trim()}</textarea><br>
                        <input type="submit" value="upload">
                        <input type="submit" value="cancel" formaction="/publiccancel">
                        <input type="hidden" name="color" value="${letter}"/>
                        </form>`
        $(e.currentTarget).html(formd)
    })

    $('.publicsearch-click').one('click',(e)=> {
        let letter = $(e.target).attr('class')[$(e.target).attr('class').length - 1]
        let split = $(e.target).attr('class').split('-')
        let tag = split[0]
        $(e.target).addClass('form-format')
        const formd = `<form action="/publicsearchupload" method="POST">
                        <textarea class="body" name="text" readonly>${$(`#${$(e.currentTarget).attr('id')}text`).text().trim()}</textarea>
                        <br>
                        <textarea class="textarea-tags" name="tags" placeholder="tags" readonly>${$(`#${$(e.currentTarget).attr('id')}tags`).text().trim()}</textarea><br>
                        <input type="submit" value="upload">
                        <input type="submit" value="cancel" formaction="/publicsearchcancel">
                        <input type="hidden" name="color" value="${letter}"/>
                        <input type="hidden" name="search" value="${tag}"/>
                        </form>`
        $(e.currentTarget).html(formd)
    })

    $('.inboxclick').one('click', (e) => {
        let letter = $(e.target).attr('class')[$(e.target).attr('class').length - 1]
        $(e.target).addClass('form-format')
        const formd = `<form action="/upload/${$(e.currentTarget).attr('id')}?_method=PUT" method="POST">
                        <textarea class="body" name="text" readonly>${$(`#${$(e.currentTarget).attr('id')}text`).text().trim()}</textarea>
                        <br>
                        <textarea class="textarea-tags" name="tags" placeholder="tags" readonly>${$(`#${$(e.currentTarget).attr('id')}tags`).text().trim()}</textarea><br>
                        <input type="submit" value="upload">
                        <input type="submit" value="reply" formaction="/send/reply/${$(e.currentTarget).attr('id')}">
                        <input type="submit" value="delete" formaction="/${$(e.currentTarget).attr('id')}?_method=DELETE">
                        <input type="submit" value="cancel" formaction="/cancelinbox">
                        <input type="hidden" name="color" value="${letter}"/>
                        </form>`
        $(e.currentTarget).html(formd)
    })



})